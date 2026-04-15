const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.join(__dirname, "..");
const zipPath = path.join(repoRoot, "docs", "downloads", "proxy-extension.zip");
assert.ok(fs.existsSync(zipPath), "Expected packaged zip to exist.");

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

console.log("zip.test.js passed");
