(function (root, factory) {
  const exported = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
  root.ProxyExtensionBridgeConfig = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEFAULT_SETTINGS = {
    requestTimeoutMs: 15000,
    maxBodyBytes: 1024 * 1024,
    allowedMethods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
  };

  return {
    APP_SOURCE: "moodle-analyzer-web",
    EXTENSION_SOURCE: "proxy-extension",
    PROTOCOL_NAME: "proxy-extension-bridge",
    PROTOCOL_VERSION: 1,
    VERSION: "0.1.0",
    STORAGE_KEY: "bridgeSettings",
    MESSAGE_TYPES: {
      PING: "bridge-ping",
      AVAILABLE: "bridge-available",
      REQUEST: "bridge-request",
      RESPONSE: "bridge-response",
      FETCH: "proxy-fetch",
    },
    FORBIDDEN_HEADERS: ["content-length", "cookie", "host", "origin", "referer"],
    DEFAULT_SETTINGS,
  };
});
