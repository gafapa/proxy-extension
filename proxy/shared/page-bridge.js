(function (root, factory) {
  const exported = factory(root.ProxyExtensionBridgeConfig || require("./bridge-config.js"));
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
  root.ProxyExtensionPageBridge = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function (config) {
  const { MESSAGE_TYPES, PROTOCOL_NAME, PROTOCOL_VERSION } = config;

  function createBridgeError(code, message, details) {
    const error = new Error(message);
    error.name = "BridgeProtocolError";
    error.code = code;
    if (details !== undefined) {
      error.details = details;
    }
    return error;
  }

  function serializeError(error, fallbackMessage) {
    return {
      code: error && error.code ? error.code : "bridge_error",
      message: error && error.message ? error.message : fallbackMessage,
      details: error && error.details ? error.details : null,
      status: error && Number.isInteger(error.status) ? error.status : null,
    };
  }

  function validatePageEnvelope(message, appSource) {
    const allowedSources = Array.isArray(appSource) ? appSource : [appSource];
    if (!message || typeof message.type !== "string") {
      return { valid: false };
    }
    if (!message.source || !allowedSources.includes(message.source)) {
      return {
        valid: false,
        error: createBridgeError("invalid_source", "Bridge request source is not allowed.", { source: message.source }),
      };
    }
    if (message.protocol !== PROTOCOL_NAME || message.version !== PROTOCOL_VERSION) {
      return {
        valid: false,
        error: createBridgeError("invalid_protocol", "Bridge protocol version is not supported.", {
          protocol: message.protocol,
          version: message.version,
        }),
      };
    }
    if (message.type === MESSAGE_TYPES.PING) {
      return { valid: true, kind: MESSAGE_TYPES.PING };
    }
    if (message.type !== MESSAGE_TYPES.REQUEST) {
      return { valid: false };
    }
    if (!(typeof message.requestId === "string" || typeof message.requestId === "number")) {
      return { valid: false, error: createBridgeError("invalid_request_id", "Request identifier must be a string or number.") };
    }
    if (!message.payload || typeof message.payload !== "object" || Array.isArray(message.payload) || typeof message.payload.url !== "string") {
      return { valid: false, error: createBridgeError("invalid_payload", "Bridge request payload is invalid.") };
    }
    return { valid: true, kind: MESSAGE_TYPES.REQUEST };
  }

  return { createBridgeError, serializeError, validatePageEnvelope };
});
