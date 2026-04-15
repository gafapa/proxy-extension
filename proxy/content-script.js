const BridgeConfig = globalThis.ProxyExtensionBridgeConfig;
const BridgeCore = globalThis.ProxyExtensionBridgeCore;
const { APP_SOURCE, EXTENSION_SOURCE, MESSAGE_TYPES, PROTOCOL_NAME, PROTOCOL_VERSION, VERSION } = BridgeConfig;

function postToPage(message) {
  window.postMessage(message, window.location.origin);
}

function buildEnvelope(type, payload) {
  return {
    source: EXTENSION_SOURCE,
    protocol: PROTOCOL_NAME,
    version: PROTOCOL_VERSION,
    extensionVersion: VERSION,
    type,
    ...payload,
  };
}

function sendAvailability() {
  postToPage(
    buildEnvelope(MESSAGE_TYPES.AVAILABLE, {
      capabilities: {
        optionsPage: true,
        protocolVersion: PROTOCOL_VERSION,
      },
    }),
  );
}

function sendBridgeError(requestId, error) {
  postToPage(
    buildEnvelope(MESSAGE_TYPES.RESPONSE, {
      requestId,
      ok: false,
      error: BridgeCore.serializeError(error, "Bridge request failed."),
    }),
  );
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) {
    return;
  }

  const validation = BridgeCore.validatePageEnvelope(event.data, APP_SOURCE);
  if (!validation.valid) {
    if (validation.error && event.data && (typeof event.data.requestId === "string" || typeof event.data.requestId === "number")) {
      sendBridgeError(event.data.requestId, validation.error);
    }
    return;
  }

  if (validation.kind === MESSAGE_TYPES.PING) {
    sendAvailability();
    return;
  }

  chrome.runtime.sendMessage(
    {
      protocol: PROTOCOL_NAME,
      version: PROTOCOL_VERSION,
      type: MESSAGE_TYPES.FETCH,
      requestId: event.data.requestId,
      payload: event.data.payload,
    },
    (response) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        sendBridgeError(
          event.data.requestId,
          BridgeCore.createBridgeError("runtime_error", runtimeError.message),
        );
        return;
      }

      postToPage(response || buildEnvelope(MESSAGE_TYPES.RESPONSE, {
        requestId: event.data.requestId,
        ok: false,
        error: BridgeCore.serializeError(null, "Bridge response was empty."),
      }));
    },
  );
});

sendAvailability();
