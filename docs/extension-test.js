const bridgeClient = globalThis.ProxyExtensionBridgeClient.createBridgeClient({
  source: "moodle-analyzer-web",
  timeoutMs: 20000,
});

const elements = {
  originValue: document.getElementById("origin-value"),
  bridgeCard: document.getElementById("bridge-card"),
  bridgeStatus: document.getElementById("bridge-status"),
  launcherCard: document.getElementById("launcher-card"),
  launcherStatus: document.getElementById("launcher-status"),
  requestCard: document.getElementById("request-card"),
  requestStatus: document.getElementById("request-status"),
  pingButton: document.getElementById("ping-button"),
  sampleButton: document.getElementById("sample-button"),
  clearButton: document.getElementById("clear-button"),
  requestForm: document.getElementById("request-form"),
  targetUrl: document.getElementById("target-url"),
  requestMethod: document.getElementById("request-method"),
  responseType: document.getElementById("response-type"),
  privateNetwork: document.getElementById("private-network"),
  headersJson: document.getElementById("headers-json"),
  requestBody: document.getElementById("request-body"),
  activateAiButton: document.getElementById("activate-ai-button"),
  fixtureButton: document.getElementById("fixture-button"),
  logOutput: document.getElementById("log-output"),
};

const AI_RUNTIME_TARGET = "ai-runtime-extension";
const AI_RUNTIME_ACTIVATE_EVENT = "ai-runtime-extension:activate";
const AI_RUNTIME_LAUNCHER_ID = "ai-runtime-extension-launcher";
const PROXY_LAUNCHER_ID = "proxy-extension-launcher";

function setStatus(card, statusElement, state, text) {
  card.dataset.state = state;
  statusElement.textContent = text;
}

function formatForLog(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return text.length > 6000 ? text.slice(0, 6000) + "\n... truncated ..." : text;
}

function logEvent(title, payload = null) {
  const timestamp = new Date().toLocaleTimeString();
  const payloadText = payload === null ? "" : "\n" + formatForLog(payload);
  elements.logOutput.textContent = `[${timestamp}] ${title}${payloadText}\n\n${elements.logOutput.textContent}`;
}

function parseHeaders() {
  const rawHeaders = elements.headersJson.value.trim();
  if (!rawHeaders) {
    return {};
  }

  const headers = JSON.parse(rawHeaders);
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    throw new Error("Headers JSON must be an object.");
  }

  return headers;
}

function buildRequestPayload() {
  const method = elements.requestMethod.value;
  const body = elements.requestBody.value;
  const payload = {
    url: elements.targetUrl.value.trim(),
    method,
    headers: parseHeaders(),
    responseType: elements.responseType.value,
    allowPrivateNetwork: elements.privateNetwork.checked,
  };

  if (body && method !== "GET" && method !== "HEAD") {
    payload.body = body;
  }

  return payload;
}

async function pingBridge() {
  setStatus(elements.bridgeCard, elements.bridgeStatus, "busy", "Checking");
  elements.pingButton.disabled = true;

  try {
    const response = await bridgeClient.ping();
    setStatus(elements.bridgeCard, elements.bridgeStatus, "ok", "Available");
    logEvent("Bridge ping succeeded", response);
  } catch (error) {
    setStatus(elements.bridgeCard, elements.bridgeStatus, "error", "Not available");
    logEvent("Bridge ping failed", error.message || error);
  } finally {
    elements.pingButton.disabled = false;
  }
}

async function runProxyRequest(event) {
  event.preventDefault();
  setStatus(elements.requestCard, elements.requestStatus, "busy", "Running");

  const submitButton = elements.requestForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const payload = buildRequestPayload();
    logEvent("Proxy request started", payload);
    const response = await bridgeClient.request(payload);
    setStatus(elements.requestCard, elements.requestStatus, "ok", `${response.status} ${response.statusText || ""}`.trim());
    logEvent("Proxy request completed", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      finalUrl: response.finalUrl,
      headers: response.headers,
      bodyText: response.bodyText,
      bodyBase64: response.bodyBase64,
    });
  } catch (error) {
    setStatus(elements.requestCard, elements.requestStatus, "error", "Failed");
    logEvent("Proxy request failed", error);
  } finally {
    submitButton.disabled = false;
  }
}

function loadSampleRequest() {
  elements.targetUrl.value = "https://httpbin.org/anything?proxy=test";
  elements.requestMethod.value = "POST";
  elements.responseType.value = "text";
  elements.privateNetwork.checked = false;
  elements.headersJson.value = JSON.stringify({ Accept: "application/json" }, null, 2);
  elements.requestBody.value = JSON.stringify({
    message: "Proxy test request",
    origin: window.location.origin,
  }, null, 2);
  logEvent("Sample request loaded");
}

function activateAiRuntimeLauncher() {
  window.dispatchEvent(
    new CustomEvent(AI_RUNTIME_ACTIVATE_EVENT, {
      detail: { target: AI_RUNTIME_TARGET },
    }),
  );
  logEvent("AI Runtime activate event dispatched");
  window.setTimeout(updateLauncherStatus, 250);
}

function createAiLauncherFixture() {
  const host = document.createElement("div");
  host.id = AI_RUNTIME_LAUNCHER_ID;
  host.dataset.testFixture = "true";
  host.setAttribute("aria-label", "AI Runtime launcher fixture");
  Object.assign(host.style, {
    all: "initial",
    position: "fixed",
    left: "0",
    bottom: "0",
    zIndex: "2147483647",
  });

  const shadowRoot = host.attachShadow({ mode: "open" });
  const root = document.createElement("div");
  root.setAttribute("data-launcher-root", "true");
  Object.assign(root.style, {
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
    boxSizing: "border-box",
  });

  const label = document.createElement("span");
  label.textContent = "AI";
  Object.assign(label.style, {
    all: "initial",
    color: "#146c43",
    fontFamily: "\"Trebuchet MS\", \"Segoe UI\", sans-serif",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  });

  root.append(label);
  shadowRoot.append(root);
  document.body.append(host);
}

function toggleAiLauncherFixture() {
  const existing = document.getElementById(AI_RUNTIME_LAUNCHER_ID);
  if (existing && existing.dataset.testFixture === "true") {
    existing.remove();
    logEvent("AI launcher fixture removed");
  } else if (existing) {
    logEvent("AI launcher already exists; fixture was not mounted");
  } else {
    createAiLauncherFixture();
    logEvent("AI launcher fixture mounted");
  }

  window.setTimeout(updateLauncherStatus, 250);
}

function updateLauncherStatus() {
  const proxyLauncher = document.getElementById(PROXY_LAUNCHER_ID);
  const aiLauncher = document.getElementById(AI_RUNTIME_LAUNCHER_ID);

  if (!proxyLauncher) {
    setStatus(elements.launcherCard, elements.launcherStatus, "error", "PX not found");
    return;
  }

  if (aiLauncher) {
    setStatus(elements.launcherCard, elements.launcherStatus, "ok", "PX should be attached to AI");
    return;
  }

  setStatus(elements.launcherCard, elements.launcherStatus, "ok", "PX visible");
}

function clearLog() {
  elements.logOutput.textContent = "";
}

elements.originValue.textContent = window.location.origin;
elements.pingButton.addEventListener("click", pingBridge);
elements.sampleButton.addEventListener("click", loadSampleRequest);
elements.clearButton.addEventListener("click", clearLog);
elements.requestForm.addEventListener("submit", runProxyRequest);
elements.activateAiButton.addEventListener("click", activateAiRuntimeLauncher);
elements.fixtureButton.addEventListener("click", toggleAiLauncherFixture);

const launcherObserver = new MutationObserver(updateLauncherStatus);
launcherObserver.observe(document.documentElement, { childList: true, subtree: true });

updateLauncherStatus();
logEvent("Test bench loaded", {
  origin: window.location.origin,
  note: "Serve this page from localhost or 127.0.0.1 so the extension content script can run.",
});
