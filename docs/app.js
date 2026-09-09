const translations = {
  en: {
    pageTitle: "Proxy",
    pageDescription: "Proxy is a Chrome MV3 proxy for CORS-related request issues with a direct package download and installation guide.",
    brand: "Proxy",
    navAriaLabel: "Primary",
    navDownload: "Download",
    navInstall: "Install",
    navScope: "Scope",
    languageLabel: "Language",
    heroTitle: "Bridge requests beyond CORS.",
    heroLead: "Proxy forwards requests through a Chrome service worker so your frontend can reach blocked endpoints from gallego.top, its subdomains, edunoza.com, and local development pages.",
    heroPrimaryCta: "Download package",
    heroSecondaryCta: "Installation guide",
    heroMetaAriaLabel: "Extension summary",
    metaFlowLabel: "Flow",
    metaFlowValue: "page -> content script -> service worker -> target",
    metaCallersLabel: "Caller pages",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Target hosts",
    metaTargetsValue: "HTTP/HTTPS endpoints; private network requires permission",
    downloadTitle: "Ready to install.",
    archiveLabel: "Archive",
    archiveDescription: "The zip contains manifest.json, content-script.js, and service-worker.js at the archive root.",
    downloadCta: "Download zip",
    installTitle: "Install in four steps.",
    step1Title: "Download and extract",
    step1Body: "Download proxy-extension.zip and extract it to any local folder.",
    step2Title: "Enable Developer mode",
    step2Body: "Open chrome://extensions and enable Developer mode.",
    step3Title: "Load unpacked",
    step3Body: "Select the extracted folder that contains manifest.json at its root.",
    step4Title: "Use it from allowed pages",
    step4Body: "Run the bridge from gallego.top, edunoza.com, localhost, or 127.0.0.1.",
    scopeTitle: "Control who can connect.",
    scopeParagraph1: "The extension can call HTTP or HTTPS endpoints covered by its host permissions. Private-network targets require both an enabled origin policy and an explicit request flag.",
    scopeParagraph2: "The restriction is on who can use it. The bridge only accepts enabled callers from configured origin policies and the built-in trusted page matches.",
    scopeList1: "Uses token-based authentication without browser cookies.",
    scopeList2: "Rejects unsupported protocols.",
    scopeList3: "Filters unsafe transport headers.",
    scopeList4: "Validates the sender against the manifest allowlist.",
    finalTitle: "Add Proxy to Chrome.",
    finalTestBench: "Extension test bench",
    finalClientExample: "Bridge client example",
    finalChangelog: "Changelog",
    finalCta: "Get Proxy"
  },
  es: {
    pageTitle: "Proxy",
    pageDescription: "Proxy es un proxy Chrome MV3 para problemas de solicitudes relacionados con CORS, con descarga directa del paquete y guía de instalación.",
    brand: "Proxy",
    navAriaLabel: "Principal",
    navDownload: "Descarga",
    navInstall: "Instalación",
    navScope: "Alcance",
    languageLabel: "Idioma",
    heroTitle: "Envía solicitudes más allá de CORS.",
    heroLead: "Proxy reenvía solicitudes a través de un service worker de Chrome para que tu frontend pueda alcanzar endpoints bloqueados desde gallego.top, sus subdominios, edunoza.com y páginas de desarrollo local.",
    heroPrimaryCta: "Descargar paquete",
    heroSecondaryCta: "Guía de instalación",
    heroMetaAriaLabel: "Resumen de la extensión",
    metaFlowLabel: "Flujo",
    metaFlowValue: "página -> content script -> service worker -> destino",
    metaCallersLabel: "Páginas autorizadas",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Hosts de destino",
    metaTargetsValue: "Endpoints HTTP/HTTPS; la red privada requiere permiso",
    downloadTitle: "Listo para instalar.",
    archiveLabel: "Archivo",
    archiveDescription: "El zip contiene manifest.json, content-script.js y service-worker.js en la raíz del archivo.",
    downloadCta: "Descargar zip",
    installTitle: "Instala en cuatro pasos.",
    step1Title: "Descarga y extrae",
    step1Body: "Descarga proxy-extension.zip y extráelo en cualquier carpeta local.",
    step2Title: "Activa el modo desarrollador",
    step2Body: "Abre chrome://extensions y activa el modo desarrollador.",
    step3Title: "Carga descomprimida",
    step3Body: "Selecciona la carpeta extraída que contiene manifest.json en su raíz.",
    step4Title: "Úsala desde páginas permitidas",
    step4Body: "Ejecuta el puente desde gallego.top, edunoza.com, localhost o 127.0.0.1.",
    scopeTitle: "Controla quién puede conectarse.",
    scopeParagraph1: "La extensión puede llamar a endpoints HTTP o HTTPS cubiertos por sus permisos de host. Los destinos de red privada requieren una política de origen activa y una opción explícita en la solicitud.",
    scopeParagraph2: "La restricción determina quién puede usarla. El puente solo acepta llamadas desde orígenes activos en la configuración y desde las páginas de confianza incluidas.",
    scopeList1: "Usa autenticación por token sin cookies del navegador.",
    scopeList2: "Rechaza protocolos no soportados.",
    scopeList3: "Filtra cabeceras de transporte no seguras.",
    scopeList4: "Valida el remitente frente a la allowlist del manifiesto.",
    finalTitle: "Añade Proxy a Chrome.",
    finalTestBench: "Banco de pruebas de la extensión",
    finalClientExample: "Ejemplo de cliente del puente",
    finalChangelog: "Historial de cambios",
    finalCta: "Obtener Proxy"
  },
  gl: {
    pageTitle: "Proxy",
    pageDescription: "Proxy é un proxy Chrome MV3 para problemas de solicitudes relacionados con CORS, con descarga directa do paquete e guía de instalación.",
    brand: "Proxy",
    navAriaLabel: "Principal",
    navDownload: "Descarga",
    navInstall: "Instalación",
    navScope: "Alcance",
    languageLabel: "Idioma",
    heroTitle: "Envía solicitudes máis alá de CORS.",
    heroLead: "Proxy reenvía solicitudes a través dun service worker de Chrome para que o teu frontend poida chegar a endpoints bloqueados desde gallego.top, os seus subdominios, edunoza.com e páxinas de desenvolvemento local.",
    heroPrimaryCta: "Descargar paquete",
    heroSecondaryCta: "Guía de instalación",
    heroMetaAriaLabel: "Resumo da extensión",
    metaFlowLabel: "Fluxo",
    metaFlowValue: "páxina -> content script -> service worker -> destino",
    metaCallersLabel: "Páxinas autorizadas",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Hosts de destino",
    metaTargetsValue: "Endpoints HTTP/HTTPS; a rede privada require permiso",
    downloadTitle: "Listo para instalar.",
    archiveLabel: "Arquivo",
    archiveDescription: "O zip contén manifest.json, content-script.js e service-worker.js na raíz do arquivo.",
    downloadCta: "Descargar zip",
    installTitle: "Instala en catro pasos.",
    step1Title: "Descarga e extrae",
    step1Body: "Descarga proxy-extension.zip e extráeo en calquera cartafol local.",
    step2Title: "Activa o modo desenvolvedor",
    step2Body: "Abre chrome://extensions e activa o modo desenvolvedor.",
    step3Title: "Carga descomprimida",
    step3Body: "Selecciona o cartafol extraído que contén manifest.json na raíz.",
    step4Title: "Úsaa desde páxinas permitidas",
    step4Body: "Executa a ponte desde gallego.top, edunoza.com, localhost ou 127.0.0.1.",
    scopeTitle: "Controla quen pode conectarse.",
    scopeParagraph1: "A extensión pode chamar a endpoints HTTP ou HTTPS cubertos polos seus permisos de host. Os destinos da rede privada requiren unha política de orixe activa e unha opción explícita na solicitude.",
    scopeParagraph2: "A restrición determina quen pode usala. A ponte só acepta chamadas desde orixes activas na configuración e desde as páxinas de confianza incluídas.",
    scopeList1: "Usa autenticación con token sen cookies do navegador.",
    scopeList2: "Rexecta protocolos non compatibles.",
    scopeList3: "Filtra cabeceiras de transporte non seguras.",
    scopeList4: "Valida o remitente fronte á allowlist do manifesto.",
    finalTitle: "Engade Proxy a Chrome.",
    finalTestBench: "Banco de probas da extensión",
    finalClientExample: "Exemplo de cliente da ponte",
    finalChangelog: "Historial de cambios",
    finalCta: "Obter Proxy"
  },
  fr: {
    pageTitle: "Proxy",
    pageDescription: "Proxy est un proxy Chrome MV3 pour les problèmes de requêtes liés à CORS, avec téléchargement direct du paquet et guide d'installation.",
    brand: "Proxy",
    navAriaLabel: "Principal",
    navDownload: "Téléchargement",
    navInstall: "Installation",
    navScope: "Portée",
    languageLabel: "Langue",
    heroTitle: "Envoyez des requêtes au-delà de CORS.",
    heroLead: "Proxy transmet les requêtes via un service worker Chrome afin que votre frontend puisse atteindre des endpoints bloqués depuis gallego.top, ses sous-domaines, edunoza.com et les pages de développement local.",
    heroPrimaryCta: "Télécharger le paquet",
    heroSecondaryCta: "Guide d'installation",
    heroMetaAriaLabel: "Résumé de l'extension",
    metaFlowLabel: "Flux",
    metaFlowValue: "page -> content script -> service worker -> cible",
    metaCallersLabel: "Pages autorisées",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Hôtes cibles",
    metaTargetsValue: "Points de terminaison HTTP/HTTPS ; le réseau privé requiert une autorisation",
    downloadTitle: "Prêt à installer.",
    archiveLabel: "Archive",
    archiveDescription: "Le zip contient manifest.json, content-script.js et service-worker.js à la racine de l'archive.",
    downloadCta: "Télécharger le zip",
    installTitle: "Installez en quatre étapes.",
    step1Title: "Télécharger et extraire",
    step1Body: "Téléchargez proxy-extension.zip et extrayez-le dans n'importe quel dossier local.",
    step2Title: "Activer le mode développeur",
    step2Body: "Ouvrez chrome://extensions et activez le mode développeur.",
    step3Title: "Charger l'extension non empaquetée",
    step3Body: "Sélectionnez le dossier extrait qui contient manifest.json à sa racine.",
    step4Title: "Utiliser depuis les pages autorisées",
    step4Body: "Utilisez le pont depuis gallego.top, edunoza.com, localhost ou 127.0.0.1.",
    scopeTitle: "Contrôlez qui peut se connecter.",
    scopeParagraph1: "L’extension peut appeler les points de terminaison HTTP ou HTTPS couverts par ses autorisations d’hôte. Les destinations du réseau privé nécessitent une politique d’origine active et une option explicite dans la requête.",
    scopeParagraph2: "La restriction détermine qui peut l’utiliser. Le pont accepte uniquement les appels provenant d’origines actives dans la configuration et des pages de confiance incluses.",
    scopeList1: "Utilise l'authentification par jeton sans cookies du navigateur.",
    scopeList2: "Rejette les protocoles non pris en charge.",
    scopeList3: "Filtre les en-têtes de transport non sûrs.",
    scopeList4: "Valide l'expéditeur par rapport à la liste autorisée du manifeste.",
    finalTitle: "Ajoutez Proxy à Chrome.",
    finalTestBench: "Banc de test de l’extension",
    finalClientExample: "Exemple de client du pont",
    finalChangelog: "Historique des modifications",
    finalCta: "Obtenir Proxy"
  },
  de: {
    pageTitle: "Proxy",
    pageDescription: "Proxy ist ein Chrome-MV3-Proxy für CORS-bezogene Anfrageprobleme mit direktem Paketdownload und Installationsanleitung.",
    brand: "Proxy",
    navAriaLabel: "Primär",
    navDownload: "Download",
    navInstall: "Installation",
    navScope: "Umfang",
    languageLabel: "Sprache",
    heroTitle: "Anfragen über CORS hinaus.",
    heroLead: "Proxy leitet Anfragen über einen Chrome-Service-Worker weiter, damit dein Frontend blockierte Endpunkte von gallego.top, dessen Subdomains, edunoza.com und lokalen Entwicklungsseiten erreichen kann.",
    heroPrimaryCta: "Paket herunterladen",
    heroSecondaryCta: "Installationsanleitung",
    heroMetaAriaLabel: "Erweiterungsübersicht",
    metaFlowLabel: "Ablauf",
    metaFlowValue: "Seite -> Content Script -> Service Worker -> Ziel",
    metaCallersLabel: "Erlaubte Seiten",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Ziel-Hosts",
    metaTargetsValue: "HTTP/HTTPS-Endpunkte; private Netzwerke erfordern eine Berechtigung",
    downloadTitle: "Bereit zur Installation.",
    archiveLabel: "Archiv",
    archiveDescription: "Die ZIP enthält manifest.json, content-script.js und service-worker.js im Archivstamm.",
    downloadCta: "ZIP herunterladen",
    installTitle: "In vier Schritten installieren.",
    step1Title: "Herunterladen und entpacken",
    step1Body: "Lade proxy-extension.zip herunter und entpacke sie in einen lokalen Ordner.",
    step2Title: "Entwicklermodus aktivieren",
    step2Body: "Öffne chrome://extensions und aktiviere den Entwicklermodus.",
    step3Title: "Entpackte Erweiterung laden",
    step3Body: "Wähle den entpackten Ordner aus, der manifest.json im Stammverzeichnis enthält.",
    step4Title: "Von erlaubten Seiten nutzen",
    step4Body: "Nutze die Brücke von gallego.top, edunoza.com, localhost oder 127.0.0.1 aus.",
    scopeTitle: "Zugriff gezielt steuern.",
    scopeParagraph1: "Die Erweiterung kann HTTP- oder HTTPS-Endpunkte aufrufen, die durch ihre Hostberechtigungen abgedeckt sind. Ziele in privaten Netzwerken erfordern eine aktive Ursprungsrichtlinie und eine ausdrückliche Option in der Anfrage.",
    scopeParagraph2: "Die Einschränkung legt fest, wer sie verwenden darf. Die Brücke akzeptiert nur Aufrufe von in der Konfiguration aktivierten Ursprüngen und den integrierten vertrauenswürdigen Seiten.",
    scopeList1: "Verwendet tokenbasierte Authentifizierung ohne Browser-Cookies.",
    scopeList2: "Lehnt nicht unterstützte Protokolle ab.",
    scopeList3: "Filtert unsichere Transport-Header.",
    scopeList4: "Prüft den Absender gegen die Allowlist im Manifest.",
    finalTitle: "Proxy zu Chrome hinzufügen.",
    finalTestBench: "Testumgebung der Erweiterung",
    finalClientExample: "Beispiel für einen Brückenclient",
    finalChangelog: "Änderungsprotokoll",
    finalCta: "Proxy holen"
  },
  pt: {
    pageTitle: "Proxy",
    pageDescription: "Proxy é uma extensão proxy Chrome MV3 para problemas de pedidos relacionados com CORS, com descarga direta do pacote e guia de instalação.",
    brand: "Proxy",
    navAriaLabel: "Principal",
    navDownload: "Download",
    navInstall: "Instalação",
    navScope: "Âmbito",
    languageLabel: "Idioma",
    heroTitle: "Envia pedidos para além do CORS.",
    heroLead: "Proxy encaminha pedidos através de um service worker do Chrome para que o teu frontend alcance endpoints bloqueados a partir de gallego.top, dos seus subdomínios, de edunoza.com e de páginas de desenvolvimento local.",
    heroPrimaryCta: "Descarregar pacote",
    heroSecondaryCta: "Guia de instalação",
    heroMetaAriaLabel: "Resumo da extensão",
    metaFlowLabel: "Fluxo",
    metaFlowValue: "página -> content script -> service worker -> destino",
    metaCallersLabel: "Páginas autorizadas",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Hosts de destino",
    metaTargetsValue: "Endpoints HTTP/HTTPS; a rede privada requer permissão",
    downloadTitle: "Pronto para instalar.",
    archiveLabel: "Arquivo",
    archiveDescription: "O zip contém manifest.json, content-script.js e service-worker.js na raiz do arquivo.",
    downloadCta: "Descarregar zip",
    installTitle: "Instala em quatro passos.",
    step1Title: "Descarregar e extrair",
    step1Body: "Descarrega proxy-extension.zip e extrai-o para qualquer pasta local.",
    step2Title: "Ativar modo de programador",
    step2Body: "Abre chrome://extensions e ativa o modo de programador.",
    step3Title: "Carregar sem compactação",
    step3Body: "Seleciona a pasta extraída que contém manifest.json na raiz.",
    step4Title: "Usar a partir de páginas permitidas",
    step4Body: "Executa a ponte a partir de gallego.top, edunoza.com, localhost ou 127.0.0.1.",
    scopeTitle: "Controla quem se pode ligar.",
    scopeParagraph1: "A extensão pode chamar endpoints HTTP ou HTTPS abrangidos pelas suas permissões de host. Os destinos de rede privada requerem uma política de origem ativa e uma opção explícita no pedido.",
    scopeParagraph2: "A restrição determina quem pode utilizá-la. A ponte só aceita chamadas de origens ativas na configuração e das páginas de confiança incluídas.",
    scopeList1: "Usa autenticação por token sem cookies do navegador.",
    scopeList2: "Rejeita protocolos não suportados.",
    scopeList3: "Filtra cabeçalhos de transporte inseguros.",
    scopeList4: "Valida o remetente face à allowlist do manifesto.",
    finalTitle: "Adiciona o Proxy ao Chrome.",
    finalTestBench: "Banco de testes da extensão",
    finalClientExample: "Exemplo de cliente da ponte",
    finalChangelog: "Registo de alterações",
    finalCta: "Obter Proxy"
  },
  ca: {
    pageTitle: "Proxy",
    pageDescription: "Proxy és un proxy Chrome MV3 per a problemes de sol·licituds relacionats amb CORS, amb descàrrega directa del paquet i guia d'instal·lació.",
    brand: "Proxy",
    navAriaLabel: "Principal",
    navDownload: "Descàrrega",
    navInstall: "Instal·lació",
    navScope: "Abast",
    languageLabel: "Idioma",
    heroTitle: "Envia sol·licituds més enllà de CORS.",
    heroLead: "Proxy reenvia sol·licituds a través d'un service worker de Chrome perquè el teu frontend arribi a endpoints bloquejats des de gallego.top, els seus subdominis, edunoza.com i pàgines de desenvolupament local.",
    heroPrimaryCta: "Descarrega el paquet",
    heroSecondaryCta: "Guia d'instal·lació",
    heroMetaAriaLabel: "Resum de l'extensió",
    metaFlowLabel: "Flux",
    metaFlowValue: "pàgina -> content script -> service worker -> destí",
    metaCallersLabel: "Pàgines autoritzades",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Hosts de destí",
    metaTargetsValue: "Endpoints HTTP/HTTPS; la xarxa privada requereix permís",
    downloadTitle: "A punt per instal·lar.",
    archiveLabel: "Arxiu",
    archiveDescription: "El zip conté manifest.json, content-script.js i service-worker.js a l'arrel de l'arxiu.",
    downloadCta: "Descarrega el zip",
    installTitle: "Instal·la en quatre passos.",
    step1Title: "Descarrega i extreu",
    step1Body: "Descarrega proxy-extension.zip i extreu-lo a qualsevol carpeta local.",
    step2Title: "Activa el mode desenvolupador",
    step2Body: "Obre chrome://extensions i activa el mode desenvolupador.",
    step3Title: "Carrega descomprimida",
    step3Body: "Selecciona la carpeta extreta que conté manifest.json a l'arrel.",
    step4Title: "Fes-la servir des de pàgines permeses",
    step4Body: "Executa el pont des de gallego.top, edunoza.com, localhost o 127.0.0.1.",
    scopeTitle: "Controla qui es pot connectar.",
    scopeParagraph1: "L’extensió pot cridar endpoints HTTP o HTTPS coberts pels seus permisos d’amfitrió. Les destinacions de xarxa privada requereixen una política d’origen activa i una opció explícita a la sol·licitud.",
    scopeParagraph2: "La restricció determina qui la pot utilitzar. El pont només accepta crides d’orígens actius a la configuració i de les pàgines de confiança incloses.",
    scopeList1: "Fa servir autenticació per token sense cookies del navegador.",
    scopeList2: "Rebutja protocols no compatibles.",
    scopeList3: "Filtra capçaleres de transport no segures.",
    scopeList4: "Valida el remitent contra l'allowlist del manifest.",
    finalTitle: "Afegeix Proxy a Chrome.",
    finalTestBench: "Banc de proves de l’extensió",
    finalClientExample: "Exemple de client del pont",
    finalChangelog: "Registre de canvis",
    finalCta: "Obtén Proxy"
  },
  eu: {
    pageTitle: "Proxy",
    pageDescription: "Proxy CORSekin lotutako eskaera arazoetarako Chrome MV3 proxya da, pakete zuzeneko deskargarekin eta instalazio gidarekin.",
    brand: "Proxy",
    navAriaLabel: "Nagusia",
    navDownload: "Deskarga",
    navInstall: "Instalazioa",
    navScope: "Esparrua",
    languageLabel: "Hizkuntza",
    heroTitle: "Bidali eskaerak CORSetik harago.",
    heroLead: "Proxyek eskaerak Chrome service worker baten bidez birbidaltzen ditu zure frontendak blokeatutako endpointetara iristeko gallego.top, haren azpidomeinu, edunoza.com eta garapen lokaleko orrietatik.",
    heroPrimaryCta: "Deskargatu paketea",
    heroSecondaryCta: "Instalazio gida",
    heroMetaAriaLabel: "Luzapenaren laburpena",
    metaFlowLabel: "Fluxua",
    metaFlowValue: "orria -> content script -> service worker -> helmuga",
    metaCallersLabel: "Baimendutako orriak",
    metaCallersValue: "gallego.top, edunoza.com, localhost, 127.0.0.1",
    metaTargetsLabel: "Helmugako hostak",
    metaTargetsValue: "HTTP/HTTPS endpointak; sare pribatuak baimena behar du",
    downloadTitle: "Instalatzeko prest.",
    archiveLabel: "Artxiboa",
    archiveDescription: "Zipak manifest.json, content-script.js eta service-worker.js ditu artxiboaren erroan.",
    downloadCta: "Deskargatu zipa",
    installTitle: "Instalatu lau urratsetan.",
    step1Title: "Deskargatu eta erauzi",
    step1Body: "Deskargatu proxy-extension.zip eta erauzi edozein karpeta lokaletan.",
    step2Title: "Gaitu garatzaile modua",
    step2Body: "Ireki chrome://extensions eta gaitu garatzaile modua.",
    step3Title: "Kargatu deskonprimituta",
    step3Body: "Hautatu erroan manifest.json duen erauzitako karpeta.",
    step4Title: "Erabili baimendutako orrietatik",
    step4Body: "Exekutatu zubia gallego.top, edunoza.com, localhost edo 127.0.0.1-etik.",
    scopeTitle: "Kontrolatu nor konekta daitekeen.",
    scopeParagraph1: "Luzapenak bere host-baimenek estaltzen dituzten HTTP edo HTTPS endpointak dei ditzake. Sare pribatuko helmugek jatorri-politika aktiboa eta eskaeran aukera esplizitua behar dituzte.",
    scopeParagraph2: "Murrizketak nork erabil dezakeen zehazten du. Zubiak konfigurazioan aktibatutako jatorrietatik eta barneko konfiantzazko orrietatik datozen deiak bakarrik onartzen ditu.",
    scopeList1: "Token bidezko autentifikazioa erabiltzen du nabigatzaileko cookierik gabe.",
    scopeList2: "Onartzen ez diren protokoloak baztertzen ditu.",
    scopeList3: "Garraioko goiburu ez-seguruak iragazten ditu.",
    scopeList4: "Igorlea manifestuko allowlist-aren aurka balioztatzen du.",
    finalTitle: "Gehitu Proxy Chrome-ra.",
    finalTestBench: "Luzapenaren proba-bankua",
    finalClientExample: "Zubi-bezeroaren adibidea",
    finalChangelog: "Aldaketen erregistroa",
    finalCta: "Lortu Proxy"
  }
};

const supportedLocales = Object.keys(translations);

function matchLocale(input) {
  const value = String(input || "").trim().toLowerCase();
  if (!value) {
    return null;
  }

  if (supportedLocales.includes(value)) {
    return value;
  }

  const languagePart = value.split("-")[0];
  return supportedLocales.includes(languagePart) ? languagePart : null;
}

function normalizeLocale(input) {
  return matchLocale(input) || "en";
}

function applyTranslation(locale) {
  const dictionary = translations[locale] || translations.en;
  document.documentElement.lang = locale;
  document.title = dictionary.pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", dictionary.pageDescription);
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const mappings = element.dataset.i18nAttr.split(",");
    mappings.forEach((mapping) => {
      const parts = mapping.split(":").map((value) => value.trim());
      const attribute = parts[0];
      const key = parts[1];
      if (attribute && key && dictionary[key]) {
        element.setAttribute(attribute, dictionary[key]);
      }
    });
  });
}

globalThis.ProxyExtensionDocsApp = {
  translations,
  matchLocale,
  normalizeLocale,
  applyTranslation,
};

const languageSelect = document.getElementById("language-select");
const savedLocale = window.localStorage.getItem("proxy-extension-locale");
const browserLocales = Array.isArray(navigator.languages) && navigator.languages.length
  ? navigator.languages
  : [navigator.language];
const detectedLocale = browserLocales
  .map((locale) => matchLocale(locale))
  .find(Boolean) || "en";
const activeLocale = savedLocale ? normalizeLocale(savedLocale) : detectedLocale;
languageSelect.value = activeLocale;
applyTranslation(activeLocale);

languageSelect.addEventListener("change", (event) => {
  const locale = normalizeLocale(event.target.value);
  window.localStorage.setItem("proxy-extension-locale", locale);
  applyTranslation(locale);
});
