(function (root, factory) {
  const exported = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
  root.ProxyExtensionBridgeClient = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const EXTENSION_SOURCE = "proxy-extension";
  const DEFAULT_APP_SOURCE = "moodle-analyzer-web";
  const PROTOCOL_NAME = "proxy-extension-bridge";
  const PROTOCOL_VERSION = 1;
  const DEFAULT_TIMEOUT_MS = 15000;

  function createBridgeClient(options = {}) {
    const appSource = typeof options.source === "string" && options.source.trim()
      ? options.source.trim()
      : DEFAULT_APP_SOURCE;
    const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0
      ? options.timeoutMs
      : DEFAULT_TIMEOUT_MS;
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
      clearTimeout(entry.timeoutHandle);
      if (pending.size === 0) {
        window.removeEventListener("message", handleMessage);
      }

      if (data.ok) {
        entry.resolve(data.result);
        return;
      }

      entry.reject(data.error || { code: "bridge_error", message: "Unknown bridge error." });
    }

    return {
      async ping() {
        return new Promise((resolve, reject) => {
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
              clearTimeout(timeoutHandle);
              window.removeEventListener("message", onMessage);
              resolve(data);
            }
          }

          const timeoutHandle = setTimeout(() => {
            window.removeEventListener("message", onMessage);
            reject(new Error("Timed out waiting for the bridge."));
          }, timeoutMs);
          window.addEventListener("message", onMessage);
          window.postMessage(
            {
              source: appSource,
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
          const timeoutHandle = setTimeout(() => {
            pending.delete(requestId);
            if (pending.size === 0) {
              window.removeEventListener("message", handleMessage);
            }
            reject(new Error("Timed out waiting for the bridge response."));
          }, timeoutMs);
          const shouldAddListener = pending.size === 0;
          pending.set(requestId, { resolve, reject, timeoutHandle });
          if (shouldAddListener) {
            window.addEventListener("message", handleMessage);
          }
          window.postMessage(
            {
              source: appSource,
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
