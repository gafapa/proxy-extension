const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.join(__dirname, "..");
const zipPath = path.join(repoRoot, "docs", "downloads", "proxy-extension.zip");
assert.ok(fs.existsSync(zipPath), "Expected packaged zip to exist.");
assert.ok(fs.statSync(zipPath).size < 30 * 1024, "Packaged extension must remain below 30 KiB.");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "proxy-extension-zip-"));
execFileSync("powershell", [
  "-NoProfile",
  "-Command",
  `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${tempDir.replace(/'/g, "''")}' -Force`,
]);

assert.ok(fs.existsSync(path.join(tempDir, "manifest.json")));
assert.ok(fs.existsSync(path.join(tempDir, "content-script.js")));
assert.ok(fs.existsSync(path.join(tempDir, "service-worker.js")));
assert.ok(fs.existsSync(path.join(tempDir, "_locales", "es", "messages.json")));
assert.ok(!fs.existsSync(path.join(tempDir, "_metadata")), "Expected generated browser metadata to be excluded.");
assert.ok(!fs.existsSync(path.join(tempDir, "rules", "ollama-cors.json")), "Expected global Ollama DNR rule to be excluded.");

const packagedConfig = require(path.join(tempDir, "shared", "bridge-config.js"));
const packagedCore = require(path.join(tempDir, "shared", "bridge-core.js"));
const packagedPageBridge = require(path.join(tempDir, "shared", "page-bridge.js"));
assert.equal(packagedConfig.VERSION, "0.2.5");
assert.equal(typeof packagedCore.executeRequest, "function");
assert.equal(typeof packagedPageBridge.validatePageEnvelope, "function");

console.log("zip.test.js passed");
