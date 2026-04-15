const assert = require("node:assert/strict");
const path = require("node:path");
const config = require(path.join(__dirname, "..", "proxy", "shared", "bridge-config.js"));
const core = require(path.join(__dirname, "..", "proxy", "shared", "bridge-core.js"));

(function testNormalizeSettings() {
  const settings = core.normalizeSettings({
    requestTimeoutMs: 999999,
    maxBodyBytes: 512,
    allowedMethods: ["get", "post", "TRACE"],
  });

  assert.equal(settings.requestTimeoutMs, 120000);
  assert.equal(settings.maxBodyBytes, 1024);
  assert.deepEqual(settings.allowedMethods, ["GET", "POST"]);
})();

(function testBuildRequest() {
  const settings = core.normalizeSettings({ allowedMethods: ["POST"] });
  const request = core.buildRequest(
    {
      url: "https://example.com/api",
      method: "post",
      headers: { Accept: "application/json" },
      body: "{}",
    },
    settings,
    ["https://*/*"],
  );

  assert.equal(request.method, "POST");
  assert.equal(request.url, "https://example.com/api");
})();

(function testBuildRequestRejectsBodySize() {
  const settings = core.normalizeSettings({ maxBodyBytes: 1024, allowedMethods: ["POST"] });
  const largeBody = "x".repeat(2048);
  assert.throws(
    () => core.buildRequest({ url: "https://example.com", method: "POST", body: largeBody }, settings, ["https://*/*"]),
    (error) => error.code === "body_too_large",
  );
})();

(function testValidatePageEnvelope() {
  const result = core.validatePageEnvelope(
    {
      source: config.APP_SOURCE,
      protocol: config.PROTOCOL_NAME,
      version: config.PROTOCOL_VERSION,
      type: config.MESSAGE_TYPES.REQUEST,
      requestId: "abc",
      payload: { url: "https://example.com" },
    },
    config.APP_SOURCE,
  );

  assert.equal(result.valid, true);
  assert.equal(result.kind, config.MESSAGE_TYPES.REQUEST);
})();

console.log("bridge-core.test.js passed");
