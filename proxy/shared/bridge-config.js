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
    maxResponseBytes: 10 * 1024 * 1024,
    allowedMethods: ["DELETE", "GET", "HEAD", "MKCOL", "OPTIONS", "PATCH", "POST", "PROPFIND", "PUT"],
    allowedPagePatterns: [],
    originPolicies: {
      "gallego.top": {
        origin: "gallego.top",
        enabled: true,
        localNetworkAccess: false,
      },
      localhost: {
        origin: "localhost",
        enabled: true,
        localNetworkAccess: true,
      },
      "127.0.0.1": {
        origin: "127.0.0.1",
        enabled: true,
        localNetworkAccess: true,
      },
    },
    uiLanguage: "auto",
  };

  return {
    APP_SOURCE: "moodle-analyzer-web",
    APP_SOURCES: ["moodle-analyzer-web", "imageneando-studio", "edunoza-web"],
    EXTENSION_SOURCE: "proxy-extension",
    PROTOCOL_NAME: "proxy-extension-bridge",
    PROTOCOL_VERSION: 1,
    VERSION: "0.2.6",
    STORAGE_KEY: "bridgeSettings",
    AUDIT_STORAGE_KEY: "proxyAuditLog",
    DYNAMIC_CONTENT_SCRIPT_ID: "user_allowed_bridge_pages",
    MESSAGE_TYPES: {
      PING: "bridge-ping",
      AVAILABLE: "bridge-available",
      REQUEST: "bridge-request",
      RESPONSE: "bridge-response",
      FETCH: "proxy-fetch",
      OPEN_OPTIONS: "proxy-open-options",
    },
    FORBIDDEN_HEADERS: ["content-length", "cookie", "host", "origin", "referer"],
    DEFAULT_SETTINGS,
  };
});
