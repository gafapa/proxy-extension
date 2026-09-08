importScripts("shared/bridge-config.js", "shared/bridge-core.js");

const BridgeConfig = globalThis.ProxyExtensionBridgeConfig;
const BridgeCore = globalThis.ProxyExtensionBridgeCore;
const { AUDIT_STORAGE_KEY, DYNAMIC_CONTENT_SCRIPT_ID, EXTENSION_SOURCE, MESSAGE_TYPES, PROTOCOL_NAME, PROTOCOL_VERSION, SETTINGS_VERSION, STORAGE_KEY } = BridgeConfig;
const AUDIT_LOG_LIMIT = 20;

function getAllowedPagePatterns() {
  const manifest = chrome.runtime.getManifest();
  return manifest.content_scripts ? manifest.content_scripts.flatMap((entry) => entry.matches || []) : [];
}

function getAllowedTargetPatterns() {
  const manifest = chrome.runtime.getManifest();
  return manifest.host_permissions || [];
}

function getStaticAllowedPagePatterns() {
  return getAllowedPagePatterns();
}

function getRuntimeAllowedPagePatterns(settings) {
  return getStaticAllowedPagePatterns().concat(BridgeCore.createAllowedPagePatterns(settings.originPolicies, settings.allowedPagePatterns));
}

async function loadSettings() {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const storedSettings = result[STORAGE_KEY];
  const settings = BridgeCore.normalizeSettings(storedSettings);
  if (!storedSettings || storedSettings.settingsVersion !== SETTINGS_VERSION) {
    await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
  }
  return settings;
}

function getBridgeContentScriptFiles() {
  const manifest = chrome.runtime.getManifest();
  const script = manifest.content_scripts && manifest.content_scripts[0];
  return script ? script.js : ["shared/bridge-config.js", "shared/page-bridge.js", "content-script.js"];
}

async function registerUserAllowedPages(settings) {
  if (!chrome.scripting || !chrome.scripting.registerContentScripts) {
    return;
  }

  try {
    await chrome.scripting.unregisterContentScripts({ ids: [DYNAMIC_CONTENT_SCRIPT_ID] });
  } catch (_error) {
    // Chrome throws when the script was not registered yet.
  }

  const dynamicMatches = BridgeCore.createAllowedPagePatterns(settings.originPolicies, settings.allowedPagePatterns);
  if (!dynamicMatches.length) {
    return;
  }

  await chrome.scripting.registerContentScripts([
    {
      id: DYNAMIC_CONTENT_SCRIPT_ID,
      matches: dynamicMatches,
      js: getBridgeContentScriptFiles(),
      runAt: "document_start",
      persistAcrossSessions: true,
    },
  ]);
}

async function refreshUserAllowedPages() {
  await registerUserAllowedPages(await loadSettings());
}

function buildWorkerResponse(requestId, payload) {
  return {
    protocol: PROTOCOL_NAME,
    version: PROTOCOL_VERSION,
    source: EXTENSION_SOURCE,
    type: MESSAGE_TYPES.RESPONSE,
    requestId,
    ...payload,
  };
}

function sanitizeAuditTargetUrl(value) {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch (_error) {
    return String(value).slice(0, 500);
  }
}

async function appendProxyAuditLog(entry) {
  try {
    const result = await chrome.storage.local.get(AUDIT_STORAGE_KEY);
    const currentLog = Array.isArray(result[AUDIT_STORAGE_KEY]) ? result[AUDIT_STORAGE_KEY] : [];
    await chrome.storage.local.set({
      [AUDIT_STORAGE_KEY]: [entry].concat(currentLog).slice(0, AUDIT_LOG_LIMIT),
    });
  } catch (_error) {
    // Audit logging must not break the bridge request.
  }
}

function createAuditBase(senderUrl, request, startedAt) {
  let origin = "";
  try {
    origin = new URL(senderUrl).origin;
  } catch (_error) {
    origin = String(senderUrl || "");
  }

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    origin,
    method: request.method,
    targetUrl: sanitizeAuditTargetUrl(request.url),
    responseType: request.responseType,
    privateNetwork: request.privateNetwork === true,
    requestBytes: request.body ? new TextEncoder().encode(request.body).length : 0,
    durationMs: Math.max(1, Date.now() - startedAt),
  };
}

async function executeAuditedRequest(senderUrl, request, settings) {
  const startedAt = Date.now();
  try {
    const result = await BridgeCore.executeRequest(request, settings, fetch);
    void appendProxyAuditLog({
      ...createAuditBase(senderUrl, request, startedAt),
      status: "success",
      statusCode: result.status,
      statusText: result.statusText,
    });
    return result;
  } catch (error) {
    const serializedError = BridgeCore.serializeError(error, "Extension bridge request failed.");
    void appendProxyAuditLog({
      ...createAuditBase(senderUrl, request, startedAt),
      status: "error",
      errorCode: serializedError.code,
      errorMessage: serializedError.message,
    });
    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === MESSAGE_TYPES.OPEN_OPTIONS) {
    chrome.runtime.openOptionsPage(() => {
      const runtimeError = chrome.runtime.lastError;
      sendResponse({
        ok: !runtimeError,
        error: runtimeError ? runtimeError.message : null,
      });
    });

    return true;
  }

  if (!message || message.type !== MESSAGE_TYPES.FETCH) {
    return false;
  }

  (async () => {
    try {
      BridgeCore.validateRuntimeMessage(message);
      const settings = await loadSettings();
      const senderUrl = sender && sender.url;
      BridgeCore.validateSenderUrl(senderUrl, getRuntimeAllowedPagePatterns(settings));
      const senderPolicy = BridgeCore.getOriginPolicyForUrl(senderUrl, settings);
      if (!senderPolicy || senderPolicy.enabled === false) {
        throw BridgeCore.createBridgeError("sender_not_allowed", "Message sender is not an enabled page origin.");
      }

      const request = BridgeCore.buildRequest(message.payload, settings, getAllowedTargetPatterns(), {
        allowPrivateNetwork: senderPolicy.localNetworkAccess === true,
      });
      const result = await executeAuditedRequest(senderUrl, request, settings);

      sendResponse(
        buildWorkerResponse(message.requestId, {
          ok: true,
          result,
          settingsSnapshot: settings,
        }),
      );
    } catch (error) {
      sendResponse(
        buildWorkerResponse(message && message.requestId, {
          ok: false,
          error: BridgeCore.serializeError(error, "Extension bridge request failed."),
        }),
      );
    }
  })();

  return true;
});

chrome.runtime.onInstalled.addListener(refreshUserAllowedPages);
chrome.runtime.onStartup.addListener(refreshUserAllowedPages);
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes[STORAGE_KEY]) {
    refreshUserAllowedPages();
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
