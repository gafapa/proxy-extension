const BridgeConfig = globalThis.ProxyExtensionBridgeConfig;
const BridgeCore = globalThis.ProxyExtensionBridgeCore;
const { DEFAULT_SETTINGS, PROTOCOL_NAME, PROTOCOL_VERSION, STORAGE_KEY, VERSION } = BridgeConfig;

const optionTranslations = {
  en: {
    title: "Proxy Extension Settings",
    brand: "Proxy Extension",
    optionsTitle: "Bridge settings",
    intro: "Configure request limits for the extension runtime. Caller page allowlists stay controlled by the manifest.",
    versionLabel: "Version",
    runtimeLimitsTitle: "Runtime limits",
    requestTimeoutLabel: "Request timeout (ms)",
    maxBodyLabel: "Max request body size (bytes)",
    allowedMethodsLabel: "Allowed HTTP methods",
    saveButton: "Save settings",
    resetButton: "Reset defaults",
    allowedCallersTitle: "Allowed caller pages",
    bridgeProtocolTitle: "Bridge protocol",
    protocolLabel: "Protocol:",
    protocolVersionLabel: "Version:",
    storageKeyLabel: "Storage key:",
    saved: "Settings saved.",
    reset: "Defaults restored.",
    saveError: "Failed to save settings.",
  },
  es: {
    title: "Configuración de Proxy Extension",
    brand: "Proxy Extension",
    optionsTitle: "Configuración del bridge",
    intro: "Configura los límites de petición del runtime de la extensión. La allowlist de páginas autorizadas sigue controlada por el manifiesto.",
    versionLabel: "Versión",
    runtimeLimitsTitle: "Límites de ejecución",
    requestTimeoutLabel: "Tiempo máximo de petición (ms)",
    maxBodyLabel: "Tamaño máximo del cuerpo de la petición (bytes)",
    allowedMethodsLabel: "Métodos HTTP permitidos",
    saveButton: "Guardar configuración",
    resetButton: "Restaurar valores por defecto",
    allowedCallersTitle: "Páginas autorizadas",
    bridgeProtocolTitle: "Protocolo del bridge",
    protocolLabel: "Protocolo:",
    protocolVersionLabel: "Versión:",
    storageKeyLabel: "Clave de almacenamiento:",
    saved: "Configuración guardada.",
    reset: "Valores por defecto restaurados.",
    saveError: "No se pudo guardar la configuración.",
  },
  gl: {
    title: "Configuración de Proxy Extension",
    brand: "Proxy Extension",
    optionsTitle: "Configuración da ponte",
    intro: "Configura os límites de petición do runtime da extensión. A allowlist de páxinas autorizadas segue controlada polo manifesto.",
    versionLabel: "Versión",
    runtimeLimitsTitle: "Límites de execución",
    requestTimeoutLabel: "Tempo máximo da petición (ms)",
    maxBodyLabel: "Tamaño máximo do corpo da petición (bytes)",
    allowedMethodsLabel: "Métodos HTTP permitidos",
    saveButton: "Gardar configuración",
    resetButton: "Restaurar valores por defecto",
    allowedCallersTitle: "Páxinas autorizadas",
    bridgeProtocolTitle: "Protocolo da ponte",
    protocolLabel: "Protocolo:",
    protocolVersionLabel: "Versión:",
    storageKeyLabel: "Clave de almacenamento:",
    saved: "Configuración gardada.",
    reset: "Valores por defecto restaurados.",
    saveError: "Non se puido gardar a configuración.",
  },
  fr: {
    title: "Paramètres de Proxy Extension",
    brand: "Proxy Extension",
    optionsTitle: "Paramètres du bridge",
    intro: "Configurez les limites de requête du runtime de l'extension. La liste autorisée des pages appelantes reste contrôlée par le manifeste.",
    versionLabel: "Version",
    runtimeLimitsTitle: "Limites d'exécution",
    requestTimeoutLabel: "Délai maximal de requête (ms)",
    maxBodyLabel: "Taille maximale du corps de requête (octets)",
    allowedMethodsLabel: "Méthodes HTTP autorisées",
    saveButton: "Enregistrer les paramètres",
    resetButton: "Restaurer les valeurs par défaut",
    allowedCallersTitle: "Pages autorisées",
    bridgeProtocolTitle: "Protocole du bridge",
    protocolLabel: "Protocole :",
    protocolVersionLabel: "Version :",
    storageKeyLabel: "Clé de stockage :",
    saved: "Paramètres enregistrés.",
    reset: "Valeurs par défaut restaurées.",
    saveError: "Impossible d'enregistrer les paramètres.",
  },
  de: {
    title: "Proxy Extension Einstellungen",
    brand: "Proxy Extension",
    optionsTitle: "Bridge-Einstellungen",
    intro: "Konfiguriere die Anfragegrenzen der Erweiterung. Die Allowlist der aufrufenden Seiten bleibt im Manifest definiert.",
    versionLabel: "Version",
    runtimeLimitsTitle: "Laufzeitgrenzen",
    requestTimeoutLabel: "Anfrage-Timeout (ms)",
    maxBodyLabel: "Maximale Request-Body-Größe (Bytes)",
    allowedMethodsLabel: "Erlaubte HTTP-Methoden",
    saveButton: "Einstellungen speichern",
    resetButton: "Standardwerte wiederherstellen",
    allowedCallersTitle: "Erlaubte Seiten",
    bridgeProtocolTitle: "Bridge-Protokoll",
    protocolLabel: "Protokoll:",
    protocolVersionLabel: "Version:",
    storageKeyLabel: "Speicherschlüssel:",
    saved: "Einstellungen gespeichert.",
    reset: "Standardwerte wiederhergestellt.",
    saveError: "Einstellungen konnten nicht gespeichert werden.",
  },
  pt: {
    title: "Definições do Proxy Extension",
    brand: "Proxy Extension",
    optionsTitle: "Definições da bridge",
    intro: "Configura os limites de pedido do runtime da extensão. A allowlist das páginas autorizadas continua controlada pelo manifesto.",
    versionLabel: "Versão",
    runtimeLimitsTitle: "Limites de execução",
    requestTimeoutLabel: "Tempo limite do pedido (ms)",
    maxBodyLabel: "Tamanho máximo do corpo do pedido (bytes)",
    allowedMethodsLabel: "Métodos HTTP permitidos",
    saveButton: "Guardar definições",
    resetButton: "Repor valores predefinidos",
    allowedCallersTitle: "Páginas autorizadas",
    bridgeProtocolTitle: "Protocolo da bridge",
    protocolLabel: "Protocolo:",
    protocolVersionLabel: "Versão:",
    storageKeyLabel: "Chave de armazenamento:",
    saved: "Definições guardadas.",
    reset: "Valores predefinidos repostos.",
    saveError: "Não foi possível guardar as definições.",
  },
  ca: {
    title: "Configuració de Proxy Extension",
    brand: "Proxy Extension",
    optionsTitle: "Configuració del bridge",
    intro: "Configura els límits de petició del runtime de l'extensió. L'allowlist de pàgines autoritzades continua controlada pel manifest.",
    versionLabel: "Versió",
    runtimeLimitsTitle: "Límits d'execució",
    requestTimeoutLabel: "Temps màxim de la petició (ms)",
    maxBodyLabel: "Mida màxima del cos de la petició (bytes)",
    allowedMethodsLabel: "Mètodes HTTP permesos",
    saveButton: "Desa la configuració",
    resetButton: "Restaura els valors per defecte",
    allowedCallersTitle: "Pàgines autoritzades",
    bridgeProtocolTitle: "Protocol del bridge",
    protocolLabel: "Protocol:",
    protocolVersionLabel: "Versió:",
    storageKeyLabel: "Clau d'emmagatzematge:",
    saved: "Configuració desada.",
    reset: "Valors per defecte restaurats.",
    saveError: "No s'ha pogut desar la configuració.",
  },
  eu: {
    title: "Proxy Extension ezarpenak",
    brand: "Proxy Extension",
    optionsTitle: "Zubiaren ezarpenak",
    intro: "Konfiguratu luzapenaren runtime-eko eskaera mugak. Baimendutako orrien allowlist-a manifestuak kontrolatzen jarraitzen du.",
    versionLabel: "Bertsioa",
    runtimeLimitsTitle: "Exekuzio mugak",
    requestTimeoutLabel: "Eskaeraren denbora-muga (ms)",
    maxBodyLabel: "Eskaeraren gorputzaren gehieneko tamaina (byte)",
    allowedMethodsLabel: "Baimendutako HTTP metodoak",
    saveButton: "Gorde ezarpenak",
    resetButton: "Leheneratu balio lehenetsiak",
    allowedCallersTitle: "Baimendutako orriak",
    bridgeProtocolTitle: "Zubiaren protokoloa",
    protocolLabel: "Protokoloa:",
    protocolVersionLabel: "Bertsioa:",
    storageKeyLabel: "Biltegiratze-gakoa:",
    saved: "Ezarpenak gorde dira.",
    reset: "Balio lehenetsiak leheneratu dira.",
    saveError: "Ezin izan dira ezarpenak gorde.",
  },
};

const timeoutInput = document.getElementById("request-timeout-ms");
const maxBodyInput = document.getElementById("max-body-bytes");
const methodsContainer = document.getElementById("allowed-methods");
const statusMessage = document.getElementById("status-message");
const form = document.getElementById("settings-form");
const resetButton = document.getElementById("reset-button");

function normalizeLocale(input) {
  const value = String(input || "").trim().toLowerCase();
  const languagePart = value.split("-")[0];
  return optionTranslations[languagePart] ? languagePart : "en";
}

function getDictionary() {
  const language = typeof chrome.i18n !== "undefined" && chrome.i18n.getUILanguage
    ? chrome.i18n.getUILanguage()
    : navigator.language;
  return optionTranslations[normalizeLocale(language)] || optionTranslations.en;
}

const dictionary = getDictionary();
document.title = dictionary.title;

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function applyTranslations() {
  setText("options-brand", dictionary.brand);
  setText("options-title", dictionary.optionsTitle);
  setText("options-intro", dictionary.intro);
  setText("version-label", dictionary.versionLabel);
  setText("runtime-limits-title", dictionary.runtimeLimitsTitle);
  setText("request-timeout-label", dictionary.requestTimeoutLabel);
  setText("max-body-label", dictionary.maxBodyLabel);
  setText("allowed-methods-label", dictionary.allowedMethodsLabel);
  setText("save-button", dictionary.saveButton);
  setText("reset-button", dictionary.resetButton);
  setText("allowed-callers-title", dictionary.allowedCallersTitle);
  setText("bridge-protocol-title", dictionary.bridgeProtocolTitle);
  setText("protocol-label", dictionary.protocolLabel);
  setText("protocol-version-label", dictionary.protocolVersionLabel);
  setText("storage-key-label", dictionary.storageKeyLabel);
}

document.getElementById("extension-version").textContent = VERSION;
document.getElementById("protocol-name").textContent = PROTOCOL_NAME;
document.getElementById("protocol-version").textContent = String(PROTOCOL_VERSION);
document.getElementById("storage-key").textContent = STORAGE_KEY;

function renderMethodCheckboxes(settings) {
  methodsContainer.innerHTML = "";
  DEFAULT_SETTINGS.allowedMethods.forEach((method) => {
    const label = document.createElement("label");
    label.className = "checkbox-label";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "allowedMethods";
    input.value = method;
    input.checked = settings.allowedMethods.includes(method);

    const text = document.createElement("span");
    text.textContent = method;

    label.append(input, text);
    methodsContainer.appendChild(label);
  });
}

function fillForm(settings) {
  timeoutInput.value = String(settings.requestTimeoutMs);
  maxBodyInput.value = String(settings.maxBodyBytes);
  renderMethodCheckboxes(settings);
}

async function loadSettings() {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return BridgeCore.normalizeSettings(result[STORAGE_KEY]);
}

async function saveSettings(settings) {
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
}

function readFormSettings() {
  const allowedMethods = Array.from(document.querySelectorAll('input[name="allowedMethods"]:checked')).map((input) => input.value);
  return BridgeCore.normalizeSettings({
    requestTimeoutMs: Number(timeoutInput.value),
    maxBodyBytes: Number(maxBodyInput.value),
    allowedMethods,
  });
}

function setStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.dataset.state = isError ? "error" : "success";
}

function renderCallerPages() {
  const list = document.getElementById("caller-pages");
  list.innerHTML = "";
  const manifest = chrome.runtime.getManifest();
  const pages = manifest.content_scripts ? manifest.content_scripts.flatMap((entry) => entry.matches || []) : [];
  pages.forEach((page) => {
    const item = document.createElement("li");
    item.textContent = page;
    list.appendChild(item);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const settings = readFormSettings();
    await saveSettings(settings);
    fillForm(settings);
    setStatus(dictionary.saved, false);
  } catch (error) {
    setStatus(error && error.message ? error.message : dictionary.saveError, true);
  }
});

resetButton.addEventListener("click", async () => {
  const defaults = BridgeCore.normalizeSettings(DEFAULT_SETTINGS);
  await saveSettings(defaults);
  fillForm(defaults);
  setStatus(dictionary.reset, false);
});

applyTranslations();
(async () => {
  fillForm(await loadSettings());
  renderCallerPages();
})();
