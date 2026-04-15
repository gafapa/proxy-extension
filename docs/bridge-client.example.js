(function (root, factory) {
  const exported = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
  root.ProxyExtensionBridgeClient = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const APP_SOURCE = "moodle-analyzer-web";
  const EXTENSION_SOURCE = "proxy-extension";
  const PROTOCOL_NAME = "proxy-extension-bridge";
  const PROTOCOL_VERSION = 1;

  function createBridgeClient() {
    const pending = new Map();

    function handleMessage(event) {
      if (event.source !== window || event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!data || data.source !== EXTENSION_SOURCE || data.protocol !== PROTOCOL_NAME || data.version !== PROTOCOL_VERSION) {
        return;
      }

      if (data.type !== "bridge-response" || !pending.has(data.requestId)) {
        return;
      }

      const entry = pending.get(data.requestId);
      pending.delete(data.requestId);
      window.removeEventListener("message", handleMessage);

      if (data.ok) {
        entry.resolve(data.result);
        return;
      }

      entry.reject(data.error || { code: "bridge_error", message: "Unknown bridge error." });
    }

    return {
      async ping() {
        return new Promise((resolve) => {
          function onMessage(event) {
            const data = event.data;
            if (
              event.source === window &&
              event.origin === window.location.origin &&
              data &&
              data.source === EXTENSION_SOURCE &&
              data.protocol === PROTOCOL_NAME &&
              data.version === PROTOCOL_VERSION &&
              data.type === "bridge-available"
            ) {
              window.removeEventListener("message", onMessage);
              resolve(data);
            }
          }

          window.addEventListener("message", onMessage);
          window.postMessage(
            {
              source: APP_SOURCE,
              protocol: PROTOCOL_NAME,
              version: PROTOCOL_VERSION,
              type: "bridge-ping",
            },
            window.location.origin,
          );
        });
      },
      async request(payload) {
        const requestId = String(Date.now()) + "-" + Math.random().toString(16).slice(2);
        return new Promise((resolve, reject) => {
          pending.set(requestId, { resolve, reject });
          window.addEventListener("message", handleMessage);
          window.postMessage(
            {
              source: APP_SOURCE,
              protocol: PROTOCOL_NAME,
              version: PROTOCOL_VERSION,
              type: "bridge-request",
              requestId,
              payload,
            },
            window.location.origin,
          );
        });
      },
    };
  }

  return {
    createBridgeClient,
  };
});
