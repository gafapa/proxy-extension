const { execFileSync } = require("node:child_process");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const tests = ["bridge-core.test.js", "docs-app.test.js", "zip.test.js"];

for (const test of tests) {
  execFileSync(process.execPath, [path.join(__dirname, test)], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

console.log("All tests passed.");
