importScripts("shared/bridge-config.js", "shared/bridge-core.js");

const BridgeConfig = globalThis.ProxyExtensionBridgeConfig;
const BridgeCore = globalThis.ProxyExtensionBridgeCore;
const { APP_SOURCE, EXTENSION_SOURCE, MESSAGE_TYPES, PROTOCOL_NAME, PROTOCOL_VERSION, STORAGE_KEY, DEFAULT_SETTINGS } = BridgeConfig;

function getAllowedPagePatterns() {
  const manifest = chrome.runtime.getManifest();
  return manifest.content_scripts ? manifest.content_scripts.flatMap((entry) => entry.matches || []) : [];
}

function getAllowedTargetPatterns() {
  const manifest = chrome.runtime.getManifest();
  return manifest.host_permissions || [];
}

async function loadSettings() {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return BridgeCore.normalizeSettings(result[STORAGE_KEY]);
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== MESSAGE_TYPES.FETCH) {
    return false;
  }

  (async () => {
    try {
      BridgeCore.validateRuntimeMessage(message);
      BridgeCore.validateSenderUrl(sender && sender.url, getAllowedPagePatterns());
      const settings = await loadSettings();
      const request = BridgeCore.buildRequest(message.payload, settings, getAllowedTargetPatterns());
      const result = await BridgeCore.executeRequest(request, settings, fetch);

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
