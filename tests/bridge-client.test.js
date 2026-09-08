const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scriptPath = path.join(__dirname, "..", "docs", "bridge-client.example.js");
const source = fs.readFileSync(scriptPath, "utf8");

const listeners = new Set();
const postedMessages = [];
const windowStub = {
  location: { origin: "https://gallego.top" },
  addEventListener(type, listener) {
    if (type === "message") {
      listeners.add(listener);
    }
  },
  removeEventListener(type, listener) {
    if (type === "message") {
      listeners.delete(listener);
    }
  },
  postMessage(message, origin) {
    postedMessages.push({ message, origin });
  },
};

const sandbox = {
  console,
  clearTimeout,
  globalThis: null,
  module: { exports: {} },
  setTimeout,
  window: windowStub,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

function dispatchExtensionResponse(requestId, result) {
  for (const listener of Array.from(listeners)) {
    listener({
      source: windowStub,
      origin: windowStub.location.origin,
      data: {
        source: "proxy-extension",
        protocol: "proxy-extension-bridge",
        version: 1,
        type: "bridge-response",
        requestId,
        ok: true,
        result,
      },
    });
  }
}

(async function testConcurrentRequestsResolveIndependently() {
  const client = sandbox.module.exports.createBridgeClient();

  const first = client.request({ url: "https://example.com/first" });
  const second = client.request({ url: "https://example.com/second" });

  assert.equal(listeners.size, 1);
  assert.equal(postedMessages.length, 2);
  assert.equal(postedMessages[0].message.source, "moodle-analyzer-web");

  const firstRequestId = postedMessages[0].message.requestId;
  const secondRequestId = postedMessages[1].message.requestId;

  dispatchExtensionResponse(firstRequestId, { bodyText: "first" });
  assert.equal(listeners.size, 1);

  dispatchExtensionResponse(secondRequestId, { bodyText: "second" });
  assert.equal(listeners.size, 0);

  assert.deepEqual(await first, { bodyText: "first" });
  assert.deepEqual(await second, { bodyText: "second" });
})();

console.log("bridge-client.test.js passed");
