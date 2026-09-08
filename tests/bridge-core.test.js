const assert = require("node:assert/strict");
const path = require("node:path");
const config = require(path.join(__dirname, "..", "proxy", "shared", "bridge-config.js"));
const core = require(path.join(__dirname, "..", "proxy", "shared", "bridge-core.js"));
const pageBridge = require(path.join(__dirname, "..", "proxy", "shared", "page-bridge.js"));

(function testNormalizeSettings() {
  const settings = core.normalizeSettings({
    requestTimeoutMs: 999999,
    maxBodyBytes: 512,
    maxResponseBytes: 999999999,
    allowedMethods: ["get", "post", "TRACE"],
    allowedPagePatterns: [" https://example.com/* ", "invalid", "https://example.com/*", "http://localhost/*", "http://localhost:3000/*"],
    uiLanguage: "ES",
  });

  assert.equal(settings.requestTimeoutMs, 120000);
  assert.equal(settings.maxBodyBytes, 1024);
  assert.equal(settings.maxResponseBytes, 50 * 1024 * 1024);
  assert.deepEqual(settings.allowedMethods, ["GET", "POST"]);
  assert.deepEqual(settings.allowedPagePatterns, ["https://example.com/*", "http://localhost/*"]);
  assert.equal(settings.originPolicies["example.com"].enabled, true);
  assert.equal(settings.originPolicies.localhost.localNetworkAccess, true);
  assert.equal(settings.uiLanguage, "es");
})();

(function testDynamicPagePatternsPreserveSchemeAndPath() {
  const settings = core.normalizeSettings({
    allowedPagePatterns: ["https://example.com/safe/*", "http://example.com/dev/*"],
  });

  assert.deepEqual(
    core.createAllowedPagePatterns(settings.originPolicies, settings.allowedPagePatterns),
    ["https://example.com/safe/*", "http://example.com/dev/*"],
  );
  assert.ok(!core.createAllowedPagePatterns(settings.originPolicies, settings.allowedPagePatterns).includes("https://gallego.top/*"));
})();

(function testDisabledPolicyRemovesDynamicPatterns() {
  const settings = core.normalizeSettings({
    allowedPagePatterns: ["https://example.com/safe/*"],
    originPolicies: {
      "example.com": { origin: "example.com", enabled: false },
    },
  });

  assert.deepEqual(core.createAllowedPagePatterns(settings.originPolicies, settings.allowedPagePatterns), []);
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
    { allowPrivateNetwork: false },
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

(function testBuildRequestAllowsUnlimitedBodySize() {
  const settings = core.normalizeSettings({ maxBodyBytes: 0, allowedMethods: ["PUT"] });
  const body = "x".repeat(11 * 1024 * 1024);
  const request = core.buildRequest(
    { url: "https://storage.example.com/encrypted.bin", method: "PUT", body },
    settings,
    ["https://*/*"],
    { allowPrivateNetwork: false },
  );

  assert.equal(settings.maxBodyBytes, 0);
  assert.equal(request.body.length, body.length);
})();

(function testEdunozaFileHeadersAndMethods() {
  const settings = core.normalizeSettings({});
  const request = core.buildRequest(
    {
      url: "https://storage.example.com/encrypted.bin",
      method: "PUT",
      headers: { Authorization: "Bearer example", "If-Match": '"revision"' },
      body: "encrypted-content",
    },
    settings,
    ["https://*/*"],
    { allowPrivateNetwork: false },
  );

  assert.deepEqual(request.headers, { Authorization: "Bearer example", "If-Match": '"revision"' });
  for (const method of ["PROPFIND", "MKCOL"]) {
    assert.throws(
      () => core.buildRequest({ url: "https://storage.example.com/folder", method }, settings, ["https://*/*"]),
      (error) => error.code === "method_not_allowed",
    );
  }
})();

(function testBuildRequestBlocksPrivateNetworkWithoutPolicy() {
  const settings = core.normalizeSettings({});
  assert.throws(
    () => core.buildRequest(
      {
        url: "http://127.0.0.1:11434/api/tags",
        method: "GET",
        allowPrivateNetwork: true,
      },
      settings,
      ["http://*/*"],
      { allowPrivateNetwork: false },
    ),
    (error) => error.code === "private_network_blocked",
  );
})();

(function testBuildRequestAllowsPrivateNetworkWithRequestAndPolicy() {
  const settings = core.normalizeSettings({});
  const request = core.buildRequest(
    {
      url: "http://127.0.0.1:11434/api/tags",
      method: "GET",
      allowPrivateNetwork: true,
    },
    settings,
    ["http://*/*"],
    { allowPrivateNetwork: true },
  );

  assert.equal(request.privateNetwork, true);
})();

(function testGetRequestTimeoutMsExtendsOllamaRequests() {
  const settings = core.normalizeSettings({ requestTimeoutMs: 15000 });

  assert.equal(
    core.getRequestTimeoutMs({ url: "http://localhost:11434/api/generate" }, settings),
    300000,
  );
  assert.equal(
    core.getRequestTimeoutMs({ url: "https://example.com/api" }, settings),
    15000,
  );
})();

(function testBuildFetchHeadersAvoidsOllamaPreflight() {
  const headers = core.buildFetchHeaders({
    url: "http://localhost:11434/api/chat",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer token",
      "X-Requested-With": "bridge",
    },
    body: "{\"model\":\"llama3.2\",\"messages\":[]}",
  });

  assert.deepEqual(headers, {
    Accept: "application/json",
    "Content-Type": "text/plain",
  });
})();

(async function testExecuteRequestOmitsCredentialsForOllamaPort() {
  const settings = core.normalizeSettings({});
  let capturedOptions;

  await core.executeRequest(
    {
      url: "http://localhost:11434/api/tags",
      method: "GET",
      headers: {},
    },
    settings,
    async (_url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        url: "http://localhost:11434/api/tags",
        headers: {
          forEach() {},
        },
        text: async () => "{}",
      };
    },
  );

  assert.equal(capturedOptions.credentials, "omit");
})();

(async function testExecuteRequestRejectsLargeResponseBody() {
  const settings = core.normalizeSettings({ maxResponseBytes: 1024 });

  await assert.rejects(
    () => core.executeRequest(
      {
        url: "https://example.com/large",
        method: "GET",
        headers: {},
      },
      settings,
      async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        url: "https://example.com/large",
        headers: {
          forEach() {},
        },
        text: async () => "x".repeat(2048),
      }),
    ),
    (error) => error.code === "response_too_large",
  );
})();

(async function testExecuteRequestBlocksRedirectToPrivateNetwork() {
  const settings = core.normalizeSettings({});
  const request = core.buildRequest(
    { url: "https://example.com/start", method: "GET" },
    settings,
    ["http://*/*", "https://*/*"],
    { allowPrivateNetwork: false },
  );
  let fetchCount = 0;

  await assert.rejects(
    () => core.executeRequest(request, settings, async () => {
      fetchCount += 1;
      return {
        status: 302,
        headers: {
          get(name) {
            return name === "location" ? "http://127.0.0.1/admin" : null;
          },
          forEach() {},
        },
      };
    }),
    (error) => error.code === "private_network_blocked",
  );
  assert.equal(fetchCount, 1, "The private redirect target must not be fetched.");
})();

(async function testExecuteRequestValidatesAndFollowsPublicRedirect() {
  const settings = core.normalizeSettings({});
  const request = core.buildRequest(
    { url: "https://example.com/start", method: "GET" },
    settings,
    ["https://*/*"],
    { allowPrivateNetwork: false },
  );
  const requestedUrls = [];

  const result = await core.executeRequest(request, settings, async (url) => {
    requestedUrls.push(url);
    if (requestedUrls.length === 1) {
      return {
        status: 302,
        headers: {
          get(name) {
            return name === "location" ? "/final" : null;
          },
          forEach() {},
        },
      };
    }

    return {
      ok: true,
      status: 200,
      statusText: "OK",
      url,
      headers: { get() { return null; }, forEach() {} },
      text: async () => "done",
    };
  });

  assert.deepEqual(requestedUrls, ["https://example.com/start", "https://example.com/final"]);
  assert.equal(result.bodyText, "done");
})();

(function testValidatePageEnvelope() {
  const result = pageBridge.validatePageEnvelope(
    {
      protocol: config.PROTOCOL_NAME,
      version: config.PROTOCOL_VERSION,
      source: config.APP_SOURCE,
      type: config.MESSAGE_TYPES.REQUEST,
      requestId: "abc",
      payload: { url: "https://example.com" },
    },
    config.APP_SOURCE,
  );

  assert.equal(result.valid, true);
  assert.equal(result.kind, config.MESSAGE_TYPES.REQUEST);
})();

(function testValidatePageEnvelopeAcceptsEdunoza() {
  const result = pageBridge.validatePageEnvelope(
    {
      protocol: config.PROTOCOL_NAME,
      version: config.PROTOCOL_VERSION,
      source: "edunoza-web",
      type: config.MESSAGE_TYPES.REQUEST,
      requestId: "edunoza-request",
      payload: { url: "https://storage.example.com/encrypted.bin" },
    },
    config.APP_SOURCES,
  );

  assert.equal(result.valid, true);
})();

(function testValidatePageEnvelopeRejectsMissingSource() {
  const result = pageBridge.validatePageEnvelope(
    {
      protocol: config.PROTOCOL_NAME,
      version: config.PROTOCOL_VERSION,
      type: config.MESSAGE_TYPES.REQUEST,
      requestId: "abc",
      payload: { url: "https://example.com" },
    },
    config.APP_SOURCE,
  );

  assert.equal(result.valid, false);
  assert.equal(result.error.code, "invalid_source");
})();

(function testValidatePageEnvelopeRejectsWrongSource() {
  const result = pageBridge.validatePageEnvelope(
    {
      source: "unexpected-app",
      protocol: config.PROTOCOL_NAME,
      version: config.PROTOCOL_VERSION,
      type: config.MESSAGE_TYPES.REQUEST,
      requestId: "abc",
      payload: { url: "https://example.com" },
    },
    config.APP_SOURCE,
  );

  assert.equal(result.valid, false);
})();

console.log("bridge-core.test.js passed");
