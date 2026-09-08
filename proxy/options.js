const BridgeConfig = globalThis.ProxyExtensionBridgeConfig;
const BridgeCore = globalThis.ProxyExtensionBridgeCore;
const { DEFAULT_SETTINGS, PROTOCOL_NAME, PROTOCOL_VERSION, STORAGE_KEY, VERSION } = BridgeConfig;

const languageOptions = [
  ["auto", "Automatic"],
  ["en", "English"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["pt", "Português"],
  ["gl", "Galego"],
  ["ca", "Català"],
  ["eu", "Euskara"],
];

const optionTranslations = {
  en: {
    title: "Proxy Settings",
    brand: "Proxy",
    optionsTitle: "Bridge settings",
    intro: "Configure request limits, languages, and pages that can use the bridge.",
    versionLabel: "Version",
    siteCountLabel: "Authorized sites",
    authorizedSitesTitle: "Authorized sites",
    authorizedSitesHelp: "Add Chrome match patterns for pages allowed to call the bridge.",
    allowedSiteLabel: "Site match pattern",
    allowedSiteHint: "Use patterns such as https://example.com/* or http://localhost/*.",
    addSiteButton: "Add site",
    customSitesTitle: "Custom authorized sites",
    manifestSitesTitle: "Built-in sites",
    emptyCustomSites: "No custom sites yet.",
    enabled: "Enabled",
    localNetworkAccess: "Local network",
    removeSiteDisabled: "Built-in",
    removeSite: "Remove",
    policyChanged: "Policy changed. Save settings to apply it.",
    languageTitle: "Language",
    languageLabel: "Interface language",
    runtimeLimitsTitle: "Runtime limits",
    requestTimeoutLabel: "Request timeout (ms)",
    maxBodyLabel: "Max request body size (bytes, 0 = unlimited)",
    maxResponseLabel: "Max response body size (bytes)",
    allowedMethodsLabel: "Allowed HTTP methods",
    saveButton: "Save settings",
    resetButton: "Reset defaults",
    bridgeProtocolTitle: "Bridge protocol",
    protocolLabel: "Protocol:",
    protocolVersionLabel: "Version:",
    storageKeyLabel: "Storage key:",
    saved: "Settings saved.",
    reset: "Defaults restored.",
    saveError: "Failed to save settings.",
    invalidPattern: "Enter a valid Chrome match pattern.",
    duplicatePattern: "That site is already authorized.",
    siteAdded: "Site added. Save settings to apply it.",
    siteRemoved: "Site removed. Save settings to apply the change.",
  },
  es: {
    title: "Configuración de Proxy",
    brand: "Proxy",
    optionsTitle: "Configuración del bridge",
    intro: "Configura límites, idioma y páginas que pueden usar el bridge.",
    versionLabel: "Versión",
    siteCountLabel: "Sitios autorizados",
    authorizedSitesTitle: "Sitios autorizados",
    authorizedSitesHelp: "Añade patrones de Chrome para páginas autorizadas a llamar al bridge.",
    allowedSiteLabel: "Patrón del sitio",
    allowedSiteHint: "Usa patrones como https://example.com/* o http://localhost/*.",
    addSiteButton: "Añadir sitio",
    customSitesTitle: "Sitios personalizados",
    manifestSitesTitle: "Sitios incluidos",
    emptyCustomSites: "Aún no hay sitios personalizados.",
    removeSite: "Eliminar",
    languageTitle: "Idioma",
    languageLabel: "Idioma de la interfaz",
    runtimeLimitsTitle: "Límites de ejecución",
    requestTimeoutLabel: "Tiempo máximo de petición (ms)",
    maxBodyLabel: "Tamaño máximo de petición (bytes, 0 = sin límite)",
    maxResponseLabel: "Tamaño máximo de respuesta (bytes)",
    allowedMethodsLabel: "Métodos HTTP permitidos",
    saveButton: "Guardar configuración",
    resetButton: "Restaurar valores",
    bridgeProtocolTitle: "Protocolo del bridge",
    protocolLabel: "Protocolo:",
    protocolVersionLabel: "Versión:",
    storageKeyLabel: "Clave:",
    saved: "Configuración guardada.",
    reset: "Valores por defecto restaurados.",
    saveError: "No se pudo guardar la configuración.",
    invalidPattern: "Introduce un patrón de Chrome válido.",
    duplicatePattern: "Ese sitio ya está autorizado.",
    siteAdded: "Sitio añadido. Guarda para aplicarlo.",
    siteRemoved: "Sitio eliminado. Guarda para aplicar el cambio.",
  },
  fr: {
    title: "Paramètres de Proxy",
    brand: "Proxy",
    optionsTitle: "Paramètres du bridge",
    intro: "Configurez les limites, la langue et les pages autorisées à utiliser le bridge.",
    versionLabel: "Version",
    siteCountLabel: "Sites autorisés",
    authorizedSitesTitle: "Sites autorisés",
    authorizedSitesHelp: "Ajoutez des motifs Chrome pour les pages autorisées à appeler le bridge.",
    allowedSiteLabel: "Motif du site",
    allowedSiteHint: "Utilisez des motifs comme https://example.com/* ou http://localhost/*.",
    addSiteButton: "Ajouter",
    customSitesTitle: "Sites personnalisés",
    manifestSitesTitle: "Sites intégrés",
    emptyCustomSites: "Aucun site personnalisé.",
    removeSite: "Supprimer",
    languageTitle: "Langue",
    languageLabel: "Langue de l'interface",
    runtimeLimitsTitle: "Limites d'exécution",
    requestTimeoutLabel: "Délai de requête (ms)",
    maxBodyLabel: "Taille maximale de requête (octets, 0 = illimitée)",
    maxResponseLabel: "Taille maximale de réponse (octets)",
    allowedMethodsLabel: "Méthodes HTTP autorisées",
    saveButton: "Enregistrer",
    resetButton: "Réinitialiser",
    bridgeProtocolTitle: "Protocole du bridge",
    protocolLabel: "Protocole :",
    protocolVersionLabel: "Version :",
    storageKeyLabel: "Clé :",
    saved: "Paramètres enregistrés.",
    reset: "Valeurs par défaut restaurées.",
    saveError: "Impossible d'enregistrer les paramètres.",
    invalidPattern: "Saisissez un motif Chrome valide.",
    duplicatePattern: "Ce site est déjà autorisé.",
    siteAdded: "Site ajouté. Enregistrez pour l'appliquer.",
    siteRemoved: "Site supprimé. Enregistrez pour appliquer le changement.",
  },
  de: {
    title: "Proxy Einstellungen",
    brand: "Proxy",
    optionsTitle: "Bridge-Einstellungen",
    intro: "Konfiguriere Limits, Sprache und Seiten, die die Bridge nutzen dürfen.",
    versionLabel: "Version",
    siteCountLabel: "Erlaubte Seiten",
    authorizedSitesTitle: "Erlaubte Seiten",
    authorizedSitesHelp: "Füge Chrome-Match-Patterns für Seiten hinzu, die die Bridge aufrufen dürfen.",
    allowedSiteLabel: "Seitenmuster",
    allowedSiteHint: "Nutze Muster wie https://example.com/* oder http://localhost/*.",
    addSiteButton: "Hinzufügen",
    customSitesTitle: "Eigene Seiten",
    manifestSitesTitle: "Integrierte Seiten",
    emptyCustomSites: "Noch keine eigenen Seiten.",
    removeSite: "Entfernen",
    languageTitle: "Sprache",
    languageLabel: "Oberflächensprache",
    runtimeLimitsTitle: "Laufzeitlimits",
    requestTimeoutLabel: "Anfrage-Timeout (ms)",
    maxBodyLabel: "Maximale Anfragegröße (Bytes, 0 = unbegrenzt)",
    maxResponseLabel: "Maximale Antwortgröße (Bytes)",
    allowedMethodsLabel: "Erlaubte HTTP-Methoden",
    saveButton: "Speichern",
    resetButton: "Zurücksetzen",
    bridgeProtocolTitle: "Bridge-Protokoll",
    protocolLabel: "Protokoll:",
    protocolVersionLabel: "Version:",
    storageKeyLabel: "Schlüssel:",
    saved: "Einstellungen gespeichert.",
    reset: "Standardwerte wiederhergestellt.",
    saveError: "Einstellungen konnten nicht gespeichert werden.",
    invalidPattern: "Gib ein gültiges Chrome-Match-Pattern ein.",
    duplicatePattern: "Diese Seite ist bereits erlaubt.",
    siteAdded: "Seite hinzugefügt. Speichern, um sie zu aktivieren.",
    siteRemoved: "Seite entfernt. Speichern, um die Änderung zu aktivieren.",
  },
  pt: {
    title: "Definições do Proxy",
    brand: "Proxy",
    optionsTitle: "Definições da bridge",
    intro: "Configura limites, idioma e páginas que podem usar a bridge.",
    versionLabel: "Versão",
    siteCountLabel: "Sites autorizados",
    authorizedSitesTitle: "Sites autorizados",
    authorizedSitesHelp: "Adiciona padrões Chrome para páginas autorizadas a chamar a bridge.",
    allowedSiteLabel: "Padrão do site",
    allowedSiteHint: "Usa padrões como https://example.com/* ou http://localhost/*.",
    addSiteButton: "Adicionar",
    customSitesTitle: "Sites personalizados",
    manifestSitesTitle: "Sites incluídos",
    emptyCustomSites: "Ainda não há sites personalizados.",
    removeSite: "Remover",
    languageTitle: "Idioma",
    languageLabel: "Idioma da interface",
    runtimeLimitsTitle: "Limites de execução",
    requestTimeoutLabel: "Tempo limite do pedido (ms)",
    maxBodyLabel: "Tamanho máximo do pedido (bytes, 0 = sem limite)",
    maxResponseLabel: "Tamanho máximo da resposta (bytes)",
    allowedMethodsLabel: "Métodos HTTP permitidos",
    saveButton: "Guardar",
    resetButton: "Repor",
    bridgeProtocolTitle: "Protocolo da bridge",
    protocolLabel: "Protocolo:",
    protocolVersionLabel: "Versão:",
    storageKeyLabel: "Chave:",
    saved: "Definições guardadas.",
    reset: "Valores predefinidos repostos.",
    saveError: "Não foi possível guardar as definições.",
    invalidPattern: "Introduz um padrão Chrome válido.",
    duplicatePattern: "Esse site já está autorizado.",
    siteAdded: "Site adicionado. Guarda para aplicar.",
    siteRemoved: "Site removido. Guarda para aplicar a alteração.",
  },
  gl: {
    title: "Configuración de Proxy",
    brand: "Proxy",
    optionsTitle: "Configuración da ponte",
    intro: "Configura límites, idioma e páxinas que poden usar a ponte.",
    versionLabel: "Versión",
    siteCountLabel: "Sitios autorizados",
    authorizedSitesTitle: "Sitios autorizados",
    authorizedSitesHelp: "Engade patróns de Chrome para páxinas autorizadas a chamar á ponte.",
    allowedSiteLabel: "Patrón do sitio",
    allowedSiteHint: "Usa patróns como https://example.com/* ou http://localhost/*.",
    addSiteButton: "Engadir",
    customSitesTitle: "Sitios personalizados",
    manifestSitesTitle: "Sitios incluídos",
    emptyCustomSites: "Aínda non hai sitios personalizados.",
    removeSite: "Eliminar",
    languageTitle: "Idioma",
    languageLabel: "Idioma da interface",
    runtimeLimitsTitle: "Límites de execución",
    requestTimeoutLabel: "Tempo máximo da petición (ms)",
    maxBodyLabel: "Tamaño máximo da petición (bytes, 0 = sen límite)",
    maxResponseLabel: "Tamaño máximo da resposta (bytes)",
    allowedMethodsLabel: "Métodos HTTP permitidos",
    saveButton: "Gardar",
    resetButton: "Restaurar",
    bridgeProtocolTitle: "Protocolo da ponte",
    protocolLabel: "Protocolo:",
    protocolVersionLabel: "Versión:",
    storageKeyLabel: "Clave:",
    saved: "Configuración gardada.",
    reset: "Valores por defecto restaurados.",
    saveError: "Non se puido gardar a configuración.",
    invalidPattern: "Introduce un patrón de Chrome válido.",
    duplicatePattern: "Ese sitio xa está autorizado.",
    siteAdded: "Sitio engadido. Garda para aplicalo.",
    siteRemoved: "Sitio eliminado. Garda para aplicar o cambio.",
  },
  ca: {
    title: "Configuració de Proxy",
    brand: "Proxy",
    optionsTitle: "Configuració del bridge",
    intro: "Configura límits, idioma i pàgines que poden utilitzar el bridge.",
    versionLabel: "Versió",
    siteCountLabel: "Llocs autoritzats",
    authorizedSitesTitle: "Llocs autoritzats",
    authorizedSitesHelp: "Afegeix patrons de Chrome per a pàgines autoritzades a cridar el bridge.",
    allowedSiteLabel: "Patró del lloc",
    allowedSiteHint: "Fes servir patrons com https://example.com/* o http://localhost/*.",
    addSiteButton: "Afegeix",
    customSitesTitle: "Llocs personalitzats",
    manifestSitesTitle: "Llocs inclosos",
    emptyCustomSites: "Encara no hi ha llocs personalitzats.",
    removeSite: "Elimina",
    languageTitle: "Idioma",
    languageLabel: "Idioma de la interfície",
    runtimeLimitsTitle: "Límits d'execució",
    requestTimeoutLabel: "Temps màxim de petició (ms)",
    maxBodyLabel: "Mida màxima de petició (bytes, 0 = sense límit)",
    maxResponseLabel: "Mida màxima de resposta (bytes)",
    allowedMethodsLabel: "Mètodes HTTP permesos",
    saveButton: "Desa",
    resetButton: "Restaura",
    bridgeProtocolTitle: "Protocol del bridge",
    protocolLabel: "Protocol:",
    protocolVersionLabel: "Versió:",
    storageKeyLabel: "Clau:",
    saved: "Configuració desada.",
    reset: "Valors per defecte restaurats.",
    saveError: "No s'ha pogut desar la configuració.",
    invalidPattern: "Introdueix un patró de Chrome vàlid.",
    duplicatePattern: "Aquest lloc ja està autoritzat.",
    siteAdded: "Lloc afegit. Desa per aplicar-lo.",
    siteRemoved: "Lloc eliminat. Desa per aplicar el canvi.",
  },
  eu: {
    title: "Proxy ezarpenak",
    brand: "Proxy",
    optionsTitle: "Zubiaren ezarpenak",
    intro: "Konfiguratu mugak, hizkuntza eta zubia erabil dezaketen orriak.",
    versionLabel: "Bertsioa",
    siteCountLabel: "Baimendutako guneak",
    authorizedSitesTitle: "Baimendutako guneak",
    authorizedSitesHelp: "Gehitu Chrome ereduak zubia deitu dezaketen orrietarako.",
    allowedSiteLabel: "Gunearen eredua",
    allowedSiteHint: "Erabili https://example.com/* edo http://localhost/* bezalako ereduak.",
    addSiteButton: "Gehitu",
    customSitesTitle: "Gune pertsonalizatuak",
    manifestSitesTitle: "Barneko guneak",
    emptyCustomSites: "Oraindik ez dago gune pertsonalizaturik.",
    removeSite: "Kendu",
    languageTitle: "Hizkuntza",
    languageLabel: "Interfazearen hizkuntza",
    runtimeLimitsTitle: "Exekuzio mugak",
    requestTimeoutLabel: "Eskaeraren denbora-muga (ms)",
    maxBodyLabel: "Eskaeraren gehieneko tamaina (byte, 0 = mugarik gabe)",
    maxResponseLabel: "Erantzunaren gehieneko tamaina (byte)",
    allowedMethodsLabel: "Baimendutako HTTP metodoak",
    saveButton: "Gorde",
    resetButton: "Berrezarri",
    bridgeProtocolTitle: "Zubiaren protokoloa",
    protocolLabel: "Protokoloa:",
    protocolVersionLabel: "Bertsioa:",
    storageKeyLabel: "Gakoa:",
    saved: "Ezarpenak gorde dira.",
    reset: "Balio lehenetsiak berrezarri dira.",
    saveError: "Ezin izan dira ezarpenak gorde.",
    invalidPattern: "Sartu baliozko Chrome eredua.",
    duplicatePattern: "Gune hori dagoeneko baimenduta dago.",
    siteAdded: "Gunea gehitu da. Gorde aplikatzeko.",
    siteRemoved: "Gunea kendu da. Gorde aldaketa aplikatzeko.",
  },
};

let activeSettings = BridgeCore.normalizeSettings(DEFAULT_SETTINGS);
let dictionary = optionTranslations.en;

const timeoutInput = document.getElementById("request-timeout-ms");
const maxBodyInput = document.getElementById("max-body-bytes");
const maxResponseInput = document.getElementById("max-response-bytes");
const methodsContainer = document.getElementById("allowed-methods");
const statusMessage = document.getElementById("status-message");
const form = document.getElementById("settings-form");
const resetButton = document.getElementById("reset-button");
const languageSelect = document.getElementById("ui-language");
const siteInput = document.getElementById("allowed-site-input");
const addSiteButton = document.getElementById("add-site-button");
const customSitesList = document.getElementById("custom-sites");
const manifestSitesList = document.getElementById("manifest-sites");
const siteCount = document.getElementById("site-count");

function normalizeLocale(input) {
  const value = String(input || "").trim().toLowerCase();
  const languagePart = value.split("-")[0];
  return optionTranslations[languagePart] ? languagePart : "en";
}

function getBrowserLanguage() {
  return typeof chrome.i18n !== "undefined" && chrome.i18n.getUILanguage
    ? chrome.i18n.getUILanguage()
    : navigator.language;
}

function getDictionary(language) {
  const selectedLanguage = language === "auto" ? getBrowserLanguage() : language;
  return optionTranslations[normalizeLocale(selectedLanguage)] || optionTranslations.en;
}

function t(key) {
  return dictionary[key] || optionTranslations.en[key] || key;
}

function isDefaultPolicyOrigin(origin) {
  return Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS.originPolicies || {}, origin);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function applyTranslations() {
  dictionary = getDictionary(activeSettings.uiLanguage);
  document.documentElement.lang = normalizeLocale(activeSettings.uiLanguage === "auto" ? getBrowserLanguage() : activeSettings.uiLanguage);
  document.title = dictionary.title;

  setText("options-brand", dictionary.brand);
  setText("options-title", dictionary.optionsTitle);
  setText("options-intro", dictionary.intro);
  setText("version-label", dictionary.versionLabel);
  setText("site-count-label", dictionary.siteCountLabel);
  setText("authorized-sites-title", dictionary.authorizedSitesTitle);
  setText("authorized-sites-help", dictionary.authorizedSitesHelp);
  setText("allowed-site-label", dictionary.allowedSiteLabel);
  setText("allowed-site-hint", dictionary.allowedSiteHint);
  setText("add-site-button", dictionary.addSiteButton);
  setText("custom-sites-title", dictionary.customSitesTitle);
  setText("manifest-sites-title", dictionary.manifestSitesTitle);
  setText("language-title", dictionary.languageTitle);
  setText("language-label", dictionary.languageLabel);
  setText("runtime-limits-title", dictionary.runtimeLimitsTitle);
  setText("request-timeout-label", dictionary.requestTimeoutLabel);
  setText("max-body-label", dictionary.maxBodyLabel);
  setText("max-response-label", dictionary.maxResponseLabel);
  setText("allowed-methods-label", dictionary.allowedMethodsLabel);
  setText("save-button", dictionary.saveButton);
  setText("reset-button", dictionary.resetButton);
  setText("bridge-protocol-title", dictionary.bridgeProtocolTitle);
  setText("protocol-label", dictionary.protocolLabel);
  setText("protocol-version-label", dictionary.protocolVersionLabel);
  setText("storage-key-label", dictionary.storageKeyLabel);
}

document.getElementById("extension-version").textContent = VERSION;
document.getElementById("protocol-name").textContent = PROTOCOL_NAME;
document.getElementById("protocol-version").textContent = String(PROTOCOL_VERSION);
document.getElementById("storage-key").textContent = STORAGE_KEY;

function getManifestPagePatterns() {
  const manifest = chrome.runtime.getManifest();
  return manifest.content_scripts ? manifest.content_scripts.flatMap((entry) => entry.matches || []) : [];
}

function renderLanguageOptions() {
  languageSelect.innerHTML = "";
  languageOptions.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "auto" ? `${label} (${normalizeLocale(getBrowserLanguage()).toUpperCase()})` : label;
    option.selected = activeSettings.uiLanguage === value;
    languageSelect.appendChild(option);
  });
}

function renderMethodCheckboxes() {
  methodsContainer.innerHTML = "";
  DEFAULT_SETTINGS.allowedMethods.forEach((method) => {
    const label = document.createElement("label");
    label.className = "checkbox-label";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "allowedMethods";
    input.value = method;
    input.checked = activeSettings.allowedMethods.includes(method);

    const text = document.createElement("span");
    text.textContent = method;

    label.append(input, text);
    methodsContainer.appendChild(label);
  });
}

function renderManifestSites() {
  manifestSitesList.innerHTML = "";
  getManifestPagePatterns().forEach((page) => {
    const item = document.createElement("li");
    item.textContent = page;
    manifestSitesList.appendChild(item);
  });
}

function renderCustomSites() {
  customSitesList.innerHTML = "";
  const policies = Object.values(activeSettings.originPolicies || {}).sort((left, right) => left.origin.localeCompare(right.origin));

  if (!policies.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = t("emptyCustomSites");
    customSitesList.appendChild(emptyItem);
  }

  policies.forEach((policy) => {
    const item = document.createElement("li");
    item.className = "policy-item";
    const code = document.createElement("code");
    const controls = document.createElement("div");
    const enabledLabel = document.createElement("label");
    const enabledInput = document.createElement("input");
    const privateLabel = document.createElement("label");
    const privateInput = document.createElement("input");
    const button = document.createElement("button");

    code.textContent = policy.origin;
    controls.className = "policy-controls";
    enabledLabel.className = "inline-check";
    enabledInput.type = "checkbox";
    enabledInput.checked = policy.enabled !== false;
    enabledInput.dataset.policyFlag = `${policy.origin}:enabled`;
    enabledLabel.append(enabledInput, document.createTextNode(t("enabled")));

    privateLabel.className = "inline-check";
    privateInput.type = "checkbox";
    privateInput.checked = policy.localNetworkAccess === true;
    privateInput.dataset.policyFlag = `${policy.origin}:localNetworkAccess`;
    privateLabel.append(privateInput, document.createTextNode(t("localNetworkAccess")));

    button.type = "button";
    button.className = "text-button";
    button.dataset.removePolicyOrigin = policy.origin;
    button.disabled = isDefaultPolicyOrigin(policy.origin);
    button.textContent = button.disabled ? t("removeSiteDisabled") : t("removeSite");

    controls.append(enabledLabel, privateLabel, button);
    item.append(code, controls);
    customSitesList.appendChild(item);
  });

  siteCount.textContent = String(policies.filter((policy) => policy.enabled !== false).length);
}

function fillForm(settings) {
  activeSettings = BridgeCore.normalizeSettings(settings);
  timeoutInput.value = String(activeSettings.requestTimeoutMs);
  maxBodyInput.value = String(activeSettings.maxBodyBytes);
  maxResponseInput.value = String(activeSettings.maxResponseBytes);
  renderLanguageOptions();
  renderMethodCheckboxes();
  renderManifestSites();
  renderCustomSites();
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
    settingsVersion: activeSettings.settingsVersion,
    requestTimeoutMs: Number(timeoutInput.value),
    maxBodyBytes: Number(maxBodyInput.value),
    maxResponseBytes: Number(maxResponseInput.value),
    allowedMethods,
    allowedPagePatterns: activeSettings.allowedPagePatterns,
    originPolicies: activeSettings.originPolicies,
    uiLanguage: languageSelect.value,
  });
}

function setStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.dataset.state = isError ? "error" : "success";
}

function addSitePattern() {
  const pattern = siteInput.value.trim();
  const normalized = BridgeCore.normalizeAllowedPagePatterns([pattern]);

  if (!normalized.length) {
    setStatus(dictionary.invalidPattern, true);
    return;
  }

  const origin = BridgeCore.extractAuthorizedSiteFromPattern(normalized[0]);
  if (!origin) {
    setStatus(dictionary.invalidPattern, true);
    return;
  }

  if (activeSettings.originPolicies[origin]) {
    setStatus(dictionary.duplicatePattern, true);
    return;
  }

  activeSettings.allowedPagePatterns = activeSettings.allowedPagePatterns.concat(normalized[0]);
  activeSettings.originPolicies = {
    ...activeSettings.originPolicies,
    [origin]: {
      origin,
      enabled: true,
      localNetworkAccess: false,
    },
  };
  siteInput.value = "";
  renderCustomSites();
  setStatus(dictionary.siteAdded, false);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const settings = readFormSettings();
    await saveSettings(settings);
    activeSettings = settings;
    applyTranslations();
    fillForm(settings);
    setStatus(dictionary.saved, false);
  } catch (error) {
    setStatus(error && error.message ? error.message : dictionary.saveError, true);
  }
});

resetButton.addEventListener("click", async () => {
  const defaults = BridgeCore.normalizeSettings(DEFAULT_SETTINGS);
  await saveSettings(defaults);
  activeSettings = defaults;
  applyTranslations();
  fillForm(defaults);
  setStatus(dictionary.reset, false);
});

languageSelect.addEventListener("change", () => {
  activeSettings = readFormSettings();
  applyTranslations();
  renderLanguageOptions();
  renderCustomSites();
  setStatus("", false);
});

addSiteButton.addEventListener("click", addSitePattern);
siteInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addSitePattern();
  }
});

customSitesList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-policy-flag]");
  if (!input) {
    return;
  }

  const [origin, flag] = input.dataset.policyFlag.split(":");
  const policy = activeSettings.originPolicies[origin];
  if (!policy) {
    return;
  }

  activeSettings.originPolicies = {
    ...activeSettings.originPolicies,
    [origin]: {
      ...policy,
      [flag]: input.checked,
    },
  };
  renderCustomSites();
  setStatus(t("policyChanged"), false);
});

customSitesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-policy-origin]");
  if (!button) {
    return;
  }

  const origin = button.dataset.removePolicyOrigin;
  if (isDefaultPolicyOrigin(origin)) {
    return;
  }

  activeSettings.allowedPagePatterns = activeSettings.allowedPagePatterns.filter((pattern) => BridgeCore.extractAuthorizedSiteFromPattern(pattern) !== origin);
  const nextPolicies = { ...activeSettings.originPolicies };
  delete nextPolicies[origin];
  activeSettings.originPolicies = nextPolicies;
  renderCustomSites();
  setStatus(dictionary.siteRemoved, false);
});

(async () => {
  activeSettings = await loadSettings();
  applyTranslations();
  fillForm(activeSettings);
})();
