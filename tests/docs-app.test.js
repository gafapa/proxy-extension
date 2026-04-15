const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scriptPath = path.join(__dirname, "..", "docs", "app.js");
const source = fs.readFileSync(scriptPath, "utf8");

const elements = new Map();
const createElement = () => ({
  dataset: {},
  textContent: "",
  value: "en",
  setAttribute(name, value) {
    this[name] = value;
  },
  addEventListener() {},
});

elements.set("language-select", createElement());

const sandbox = {
  console,
  globalThis: null,
  navigator: { language: "fr-FR" },
  window: { localStorage: { getItem: () => null, setItem() {} } },
  document: {
    documentElement: { lang: "en" },
    title: "",
    querySelector(selector) {
      if (selector === 'meta[name="description"]') {
        return { setAttribute(_name, value) { this.content = value; } };
      }
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById(id) {
      return elements.get(id);
    },
  },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const app = sandbox.ProxyExtensionDocsApp;
assert.ok(app);
assert.equal(app.normalizeLocale("es-ES"), "es");
assert.equal(app.normalizeLocale("gl-ES"), "gl");
assert.equal(app.normalizeLocale("ca-ES"), "ca");
assert.equal(app.normalizeLocale("unknown"), "en");
assert.deepEqual(Object.keys(app.translations).sort(), ["ca", "de", "en", "es", "eu", "fr", "gl", "pt"]);

console.log("docs-app.test.js passed");
