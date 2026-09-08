const BridgeConfig = globalThis.ProxyExtensionBridgeConfig;
const PageBridge = globalThis.ProxyExtensionPageBridge;
const PROXY_LAUNCHER_ID = "proxy-extension-launcher";
const AI_RUNTIME_LAUNCHER_ID = "ai-runtime-extension-launcher";
const { APP_SOURCE, APP_SOURCES, EXTENSION_SOURCE, MESSAGE_TYPES, PROTOCOL_NAME, PROTOCOL_VERSION, VERSION } = BridgeConfig;

function requestOptionsPage() {
  try {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_OPTIONS }, () => {
      // Reading lastError prevents noisy console output if the worker was reloaded.
      void chrome.runtime.lastError;
    });
  } catch (_error) {
    // The launcher is informational and must not affect the bridge.
  }
}

function getAiRuntimeLauncherRoot() {
  const host = document.getElementById(AI_RUNTIME_LAUNCHER_ID);
  if (!host) {
    return null;
  }

  return (host.shadowRoot && host.shadowRoot.querySelector("[data-launcher-root]")) || host;
}

function mountProxyLauncher() {
  if (document.getElementById(PROXY_LAUNCHER_ID)) {
    return;
  }

  const host = document.createElement("div");
  host.id = PROXY_LAUNCHER_ID;
  host.setAttribute("aria-label", "Proxy extension launcher");
  Object.assign(host.style, {
    all: "initial",
    position: "fixed",
    left: "0",
    bottom: "0",
    zIndex: "2147483647",
  });

  const shadowRoot = host.attachShadow ? host.attachShadow({ mode: "open" }) : null;
  const container = document.createElement("div");
  container.setAttribute("data-proxy-launcher-root", "true");
  Object.assign(container.style, {
    all: "initial",
    position: "fixed",
    left: "0",
    bottom: "0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#ffffff",
    border: "1px solid rgba(20, 33, 61, 0.16)",
    borderLeft: "none",
    borderBottom: "none",
    borderRadius: "0 10px 0 0",
    boxShadow: "0 8px 18px rgba(20, 33, 61, 0.12)",
    padding: "5px 8px",
    fontFamily: "\"Trebuchet MS\", \"Segoe UI\", sans-serif",
    overflow: "hidden",
    boxSizing: "border-box",
  });

  const label = document.createElement("span");
  label.textContent = "PX";
  Object.assign(label.style, {
    all: "initial",
    fontSize: "12px",
    fontWeight: "700",
    color: "#14213d",
    fontFamily: "\"Trebuchet MS\", \"Segoe UI\", sans-serif",
    whiteSpace: "nowrap",
  });

  const controls = document.createElement("div");
  Object.assign(controls.style, {
    all: "initial",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    maxWidth: "0",
    opacity: "0",
    pointerEvents: "none",
    transition: "max-width 160ms ease, opacity 120ms ease",
  });

  const optionsButton = document.createElement("button");
  optionsButton.type = "button";
  optionsButton.textContent = "\u2699";
  optionsButton.setAttribute("aria-label", "Open proxy extension options");
  Object.assign(optionsButton.style, {
    all: "initial",
    border: "none",
    borderRadius: "6px",
    background: "#14213d",
    color: "#ffffff",
    width: "24px",
    height: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    fontFamily: "\"Trebuchet MS\", \"Segoe UI\", sans-serif",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "1",
    cursor: "pointer",
  });
  optionsButton.addEventListener("click", requestOptionsPage);

  controls.append(optionsButton);
  container.append(label, controls);
  if (shadowRoot) {
    shadowRoot.appendChild(container);
  } else {
    host.appendChild(container);
  }

  const setExpanded = (expanded) => {
    controls.style.maxWidth = expanded ? "30px" : "0";
    controls.style.opacity = expanded ? "1" : "0";
    controls.style.pointerEvents = expanded ? "auto" : "none";
  };

  const syncPosition = () => {
    const aiRoot = getAiRuntimeLauncherRoot();
    if (!aiRoot) {
      container.style.left = "0";
      container.style.bottom = "0";
      container.style.borderLeft = "none";
      return;
    }

    const rect = aiRoot.getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) {
      return;
    }

    container.style.left = Math.max(0, Math.round(rect.right)) + "px";
    container.style.bottom = Math.max(0, Math.round(window.innerHeight - rect.bottom)) + "px";
    container.style.borderLeft = "1px solid rgba(20, 33, 61, 0.12)";
  };

  let frame = 0;
  const scheduleSyncPosition = () => {
    if (frame) {
      return;
    }

    frame = requestAnimationFrame(() => {
      frame = 0;
      syncPosition();
    });
  };

  let observedAiRoot = null;
  const resizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(scheduleSyncPosition)
    : null;
  const observeAiLauncher = () => {
    const nextAiRoot = getAiRuntimeLauncherRoot();
    if (nextAiRoot === observedAiRoot) {
      return;
    }

    if (resizeObserver && observedAiRoot) {
      resizeObserver.unobserve(observedAiRoot);
    }

    observedAiRoot = nextAiRoot;
    if (resizeObserver && observedAiRoot) {
      resizeObserver.observe(observedAiRoot);
    }

    scheduleSyncPosition();
  };

  const mutationObserver = typeof MutationObserver !== "undefined"
    ? new MutationObserver(observeAiLauncher)
    : null;

  const mount = () => {
    const mountTarget = document.body || document.documentElement;
    if (!mountTarget) {
      return;
    }

    if (!mountTarget.contains(host)) {
      mountTarget.appendChild(host);
    }

    if (mutationObserver && document.documentElement) {
      mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    observeAiLauncher();
  };

  container.addEventListener("mouseenter", () => {
    setExpanded(true);
    scheduleSyncPosition();
  });
  container.addEventListener("mouseleave", () => {
    setExpanded(false);
    scheduleSyncPosition();
  });
  container.addEventListener("focusin", () => {
    setExpanded(true);
    scheduleSyncPosition();
  });
  container.addEventListener("focusout", (event) => {
    if (!container.contains(event.relatedTarget)) {
      setExpanded(false);
      scheduleSyncPosition();
    }
  });
  window.addEventListener("resize", scheduleSyncPosition);
  window.addEventListener("focus", scheduleSyncPosition);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      observeAiLauncher();
    }
  });

  if (document.body || document.documentElement) {
    mount();
  } else {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  }

  setExpanded(false);
  scheduleSyncPosition();
}

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
      error: PageBridge.serializeError(error, "Bridge request failed."),
    }),
  );
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) {
    return;
  }

  const validation = PageBridge.validatePageEnvelope(event.data, APP_SOURCES || APP_SOURCE);
  if (!validation.valid) {
    if (validation.error && event.data && (typeof event.data.requestId === "string" || typeof event.data.requestId === "number")) {
      sendBridgeError(event.data.requestId, validation.error);
    }
    return;
  }

  if (validation.kind === MESSAGE_TYPES.PING) {
    mountProxyLauncher();
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
          PageBridge.createBridgeError("runtime_error", runtimeError.message),
        );
        return;
      }

      postToPage(response || buildEnvelope(MESSAGE_TYPES.RESPONSE, {
        requestId: event.data.requestId,
        ok: false,
        error: PageBridge.serializeError(null, "Bridge response was empty."),
      }));
    },
  );
});

sendAvailability();
