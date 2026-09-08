const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const proxyRoot = path.join(repoRoot, "proxy");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

const manifest = readJson(path.join(proxyRoot, "manifest.json"));
const packageJson = readJson(path.join(repoRoot, "package.json"));
const expectedLocaleDirectories = ["ca", "de", "en", "es", "eu", "fr", "gl", "pt"];

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function getProxyRelativePath(filePath) {
  return path.relative(proxyRoot, filePath).replace(/\\/g, "/");
}

function isPackagedProxyFile(filePath) {
  return !getProxyRelativePath(filePath).startsWith("_metadata/");
}

assert.equal(manifest.manifest_version, 3);
assert.equal(packageJson.version, manifest.version);
assert.equal(manifest.default_locale, "en");
assert.ok(manifest.action, "Expected toolbar action for user access to settings.");
assert.ok(manifest.options_ui && manifest.options_ui.page === "options.html");
assert.ok(manifest.permissions.includes("storage"));
assert.ok(manifest.permissions.includes("scripting"));
assert.ok(!manifest.permissions.includes("declarativeNetRequest"), "DNR must not globally rewrite target CORS headers.");
assert.equal(manifest.declarative_net_request, undefined);
assert.deepEqual(manifest.host_permissions, ["http://*/*", "https://*/*"]);
assert.deepEqual(
  manifest.content_scripts[0].js,
  ["shared/bridge-config.js", "shared/page-bridge.js", "content-script.js"],
  "Content pages must load the lightweight page bridge instead of the network engine.",
);

const localeDirectories = fs.readdirSync(path.join(proxyRoot, "_locales")).sort();
assert.deepEqual(localeDirectories, expectedLocaleDirectories);

for (const locale of localeDirectories) {
  const messages = readJson(path.join(proxyRoot, "_locales", locale, "messages.json"));
  assert.ok(messages.appName && messages.appName.message);
  assert.ok(messages.appDescription && messages.appDescription.message);
  assert.ok(messages.appDescription.message.length <= 132);
}

const packageFiles = listFiles(proxyRoot).filter(isPackagedProxyFile);
for (const filePath of packageFiles) {
  const relativePath = getProxyRelativePath(filePath);

  if (/\.(js|html)$/i.test(filePath)) {
    const source = readText(filePath);
    assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(source), `${relativePath} must not load remote scripts.`);
    assert.ok(!/\beval\s*\(/.test(source), `${relativePath} must not use eval.`);
  }
}

assert.ok(fs.existsSync(path.join(repoRoot, "docs", "privacy.html")), "Expected publishable privacy policy.");
assert.ok(fs.existsSync(path.join(repoRoot, "STORE_LISTING.md")), "Expected store listing draft.");
assert.ok(fs.existsSync(path.join(repoRoot, "PUBLISHING.md")), "Expected publishing checklist.");

const bridgeConfigSource = readText(path.join(proxyRoot, "shared", "bridge-config.js"));
assert.ok(bridgeConfigSource.includes(`VERSION: "${manifest.version}"`), "Bridge config version must match manifest version.");

const serviceWorkerSource = readText(path.join(proxyRoot, "service-worker.js"));
assert.ok(
  serviceWorkerSource.includes("createAllowedPagePatterns(settings.originPolicies, settings.allowedPagePatterns)"),
  "Dynamic content-script registration must use only the stored custom page patterns.",
);

const docsIndexSource = readText(path.join(repoRoot, "docs", "index.html"));
assert.ok(docsIndexSource.includes(`v${manifest.version}`), "Public docs version label must match manifest version.");
assert.ok(!docsIndexSource.includes("Includes credentials for cookie-backed sessions."), "Public docs must not claim cookie-backed credential forwarding.");

const docsAppSource = readText(path.join(repoRoot, "docs", "app.js"));
const optionsSource = readText(path.join(proxyRoot, "options.js"));
for (const locale of expectedLocaleDirectories) {
  assert.ok(new RegExp(`\\b${locale}:\\s*\\{`).test(docsAppSource), `Website translations must include ${locale}.`);
  assert.ok(new RegExp(`\\b${locale}:\\s*\\{`).test(optionsSource), `Options translations must include ${locale}.`);
  assert.ok(docsIndexSource.includes(`value="${locale}"`), `Website language selector must include ${locale}.`);
}

const architectureSource = readText(path.join(repoRoot, "ARCHITECTURE.md"));
assert.ok(!architectureSource.includes('credentials: "include"'), "Architecture docs must match the current credentials mode.");

for (const documentationPath of ["README.md", "STORE_LISTING.md", "PUBLISHING.md", path.join("docs", "privacy.html")]) {
  const documentation = readText(path.join(repoRoot, documentationPath));
  assert.ok(!documentation.includes("does not store request or response history"), `${documentationPath} must disclose the local audit trail.`);
  assert.ok(!documentation.includes("Request and response history is not stored"), `${documentationPath} must disclose the local audit trail.`);
}

console.log("store-readiness.test.js passed");
