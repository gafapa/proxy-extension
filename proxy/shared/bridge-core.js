(function (root, factory) {
  const exported = factory(root.ProxyExtensionBridgeConfig || require("./bridge-config.js"));
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
  root.ProxyExtensionBridgeCore = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function (config) {
  const { DEFAULT_SETTINGS, FORBIDDEN_HEADERS, MESSAGE_TYPES, PROTOCOL_NAME, PROTOCOL_VERSION } = config;
  const textEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;

  function createBridgeError(code, message, details, status) {
    const error = new Error(message);
    error.name = "BridgeProtocolError";
    error.code = code;
    if (details !== undefined) {
      error.details = details;
    }
    if (status !== undefined) {
      error.status = status;
    }
    return error;
  }

  function serializeError(error, fallbackMessage) {
    return {
      code: error && error.code ? error.code : "bridge_error",
      message: error && error.message ? error.message : fallbackMessage,
      details: error && error.details ? error.details : null,
      status: error && Number.isInteger(error.status) ? error.status : null,
    };
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function patternToRegex(pattern) {
    const match = pattern.match(/^(\*|http|https):\/\/([^/]+)(\/.*)$/);
    if (!match) {
      return null;
    }

    const scheme = match[1];
    const host = match[2];
    const path = match[3];
    const schemeRegex = scheme === "*" ? "https?" : escapeRegex(scheme);

    let hostRegex;
    if (host === "*") {
      hostRegex = "[^/:]+";
    } else if (host.startsWith("*.")) {
      hostRegex = "(?:[^/.]+\\.)*" + escapeRegex(host.slice(2));
    } else {
      hostRegex = escapeRegex(host);
    }

    const pathRegex = escapeRegex(path).replace(/\\\*/g, ".*");
    return new RegExp("^" + schemeRegex + ":\\/\\/" + hostRegex + "(?::\\d+)?" + pathRegex + "$");
  }

  function matchesAnyPattern(url, patterns) {
    return patterns.some((pattern) => {
      const regex = patternToRegex(pattern);
      return regex ? regex.test(url) : false;
    });
  }

  function normalizeAuthorizedSite(value) {
    const rawValue = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (!rawValue) {
      return "";
    }

    const candidate = rawValue.includes("://") ? rawValue : "https://" + rawValue;
    try {
      const hostname = new URL(candidate).hostname.toLowerCase();
      return hostname === "*" ? "" : hostname.replace(/^\*\./, "");
    } catch (_error) {
      return rawValue
        .replace(/^[a-z]+:\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/:\d+$/, "")
        .replace(/^\*\./, "")
        .toLowerCase();
    }
  }

  function extractAuthorizedSiteFromPattern(pattern) {
    const match = typeof pattern === "string" ? pattern.trim().match(/^(\*|http|https):\/\/([^/]+)(\/.*)$/) : null;
    const host = match && match[2] ? match[2].toLowerCase() : "";
    if (!host || host === "*" || host.includes(":")) {
      return "";
    }

    return normalizeAuthorizedSite(host);
  }

  function normalizeAllowedPagePatterns(input) {
    if (!Array.isArray(input)) {
      return DEFAULT_SETTINGS.allowedPagePatterns.slice();
    }

    const normalizedPatterns = [];
    input.forEach((rawPattern) => {
      const pattern = typeof rawPattern === "string" ? rawPattern.trim() : "";
      const match = pattern.match(/^(\*|http|https):\/\/([^/]+)(\/.*)$/);
      const regex = patternToRegex(pattern);
      const host = match ? match[2] : "";
      if (regex && !host.includes(":") && !normalizedPatterns.includes(pattern)) {
        normalizedPatterns.push(pattern);
      }
    });

    return normalizedPatterns.slice(0, 50);
  }

  function createDefaultOriginPolicy(origin) {
    return {
      origin: normalizeAuthorizedSite(origin),
      enabled: true,
      localNetworkAccess: false,
    };
  }

  function normalizeOriginPolicy(input, fallbackOrigin) {
    const raw = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const origin = normalizeAuthorizedSite(raw.origin || fallbackOrigin);
    if (!origin) {
      return null;
    }

    return {
      origin,
      enabled: raw.enabled !== false,
      localNetworkAccess: raw.localNetworkAccess === true,
    };
  }

  function normalizeOriginPolicies(input, migratedPatterns) {
    const policies = {};
    Object.values(DEFAULT_SETTINGS.originPolicies || {}).forEach((policy) => {
      const normalizedPolicy = normalizeOriginPolicy(policy, policy && policy.origin);
      if (normalizedPolicy) {
        policies[normalizedPolicy.origin] = normalizedPolicy;
      }
    });

    if (input && typeof input === "object" && !Array.isArray(input)) {
      Object.entries(input).forEach(([origin, policy]) => {
        const normalizedPolicy = normalizeOriginPolicy(policy, origin);
        if (normalizedPolicy) {
          policies[normalizedPolicy.origin] = normalizedPolicy;
        }
      });
    }

    normalizeAllowedPagePatterns(migratedPatterns).forEach((pattern) => {
      const origin = extractAuthorizedSiteFromPattern(pattern);
      if (origin && !policies[origin]) {
        policies[origin] = createDefaultOriginPolicy(origin);
      }
    });

    return policies;
  }

  function createAllowedPagePatterns(originPolicies, allowedPagePatterns) {
    return normalizeAllowedPagePatterns(allowedPagePatterns).filter((pattern) => {
      const origin = extractAuthorizedSiteFromPattern(pattern);
      const policy = origin && originPolicies ? originPolicies[origin] : null;
      return policy && policy.enabled !== false;
    });
  }

  function getOriginPolicyForUrl(senderUrl, settings) {
    let hostname;
    try {
      hostname = new URL(senderUrl).hostname.toLowerCase();
    } catch (_error) {
      return null;
    }

    const policies = settings && settings.originPolicies ? settings.originPolicies : {};
    if (policies[hostname]) {
      return policies[hostname];
    }

    return Object.values(policies).find((policy) => {
      const origin = policy && policy.origin;
      return origin && hostname.endsWith("." + origin);
    }) || null;
  }

  function normalizeUiLanguage(input) {
    const value = typeof input === "string" ? input.trim().toLowerCase() : DEFAULT_SETTINGS.uiLanguage;
    return value || DEFAULT_SETTINGS.uiLanguage;
  }

  function getByteLength(value) {
    if (textEncoder) {
      return textEncoder.encode(value).length;
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.byteLength(value, "utf8");
    }

    return value.length;
  }

  function usesOllamaPort(input) {
    let url;
    try {
      url = new URL(input);
    } catch (_error) {
      return false;
    }

    return url.port === "11434";
  }

  function isPrivateNetworkUrl(input) {
    let hostname;
    try {
      hostname = new URL(input).hostname.toLowerCase();
    } catch (_error) {
      return true;
    }

    return hostname === "localhost" ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      /^127\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^169\.254\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
  }

  function getRequestTimeoutMs(request, settings) {
    return usesOllamaPort(request.url)
      ? Math.max(settings.requestTimeoutMs, 300000)
      : settings.requestTimeoutMs;
  }

  function buildFetchHeaders(request) {
    if (!usesOllamaPort(request.url)) {
      return request.headers;
    }

    const headers = {};
    for (const [rawName, rawValue] of Object.entries(request.headers || {})) {
      const normalizedName = rawName.toLowerCase();
      if (normalizedName === "accept" || normalizedName === "accept-language" || normalizedName === "content-language" || normalizedName === "range") {
        headers[rawName] = rawValue;
      }
    }

    if (request.body !== undefined && request.method !== "GET" && request.method !== "HEAD") {
      headers["Content-Type"] = "text/plain";
    }

    return headers;
  }

  function normalizeSettings(input) {
    const raw = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const requestTimeoutMs = Number.isFinite(raw.requestTimeoutMs)
      ? Math.max(1000, Math.min(120000, Math.trunc(raw.requestTimeoutMs)))
      : DEFAULT_SETTINGS.requestTimeoutMs;
    const maxBodyBytes = Number.isFinite(raw.maxBodyBytes)
      ? Math.max(1024, Math.min(10 * 1024 * 1024, Math.trunc(raw.maxBodyBytes)))
      : DEFAULT_SETTINGS.maxBodyBytes;
    const maxResponseBytes = Number.isFinite(raw.maxResponseBytes)
      ? Math.max(1024, Math.min(50 * 1024 * 1024, Math.trunc(raw.maxResponseBytes)))
      : DEFAULT_SETTINGS.maxResponseBytes;
    const allowedMethods = Array.isArray(raw.allowedMethods)
      ? raw.allowedMethods.filter((method) => DEFAULT_SETTINGS.allowedMethods.includes(String(method).toUpperCase())).map((method) => String(method).toUpperCase())
      : DEFAULT_SETTINGS.allowedMethods.slice();
    const allowedPagePatterns = normalizeAllowedPagePatterns(raw.allowedPagePatterns);
    const originPolicies = normalizeOriginPolicies(raw.originPolicies, allowedPagePatterns);
    const uiLanguage = normalizeUiLanguage(raw.uiLanguage);

    return {
      requestTimeoutMs,
      maxBodyBytes,
      maxResponseBytes,
      allowedMethods: allowedMethods.length ? Array.from(new Set(allowedMethods)) : DEFAULT_SETTINGS.allowedMethods.slice(),
      allowedPagePatterns,
      originPolicies,
      uiLanguage,
    };
  }

  function sanitizeUrl(input) {
    let url;
    try {
      url = new URL(input);
    } catch (_error) {
      throw createBridgeError("invalid_url", "Target URL is not a valid absolute URL.");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw createBridgeError("invalid_protocol", "Only http and https URLs are supported.", { protocol: url.protocol });
    }

    return url.toString();
  }

  function sanitizeMethod(input, settings) {
    const method = typeof input === "string" ? input.toUpperCase() : "GET";
    if (!settings.allowedMethods.includes(method)) {
      throw createBridgeError("method_not_allowed", "HTTP method is not allowed.", { method });
    }

    return method;
  }

  function sanitizeHeaders(input) {
    if (input == null) {
      return {};
    }

    if (typeof input !== "object" || Array.isArray(input)) {
      throw createBridgeError("invalid_headers", "Headers must be a plain object.");
    }

    const headers = {};
    for (const [rawName, rawValue] of Object.entries(input)) {
      if (typeof rawName !== "string" || typeof rawValue !== "string") {
        throw createBridgeError("invalid_headers", "Headers must use string names and values.");
      }

      const normalizedName = rawName.toLowerCase();
      if (FORBIDDEN_HEADERS.includes(normalizedName)) {
        throw createBridgeError("forbidden_header", "Header is not allowed.", { header: rawName });
      }

      headers[rawName] = rawValue;
    }

    return headers;
  }

  function sanitizeBody(method, input, settings) {
    if (method === "GET" || method === "HEAD") {
      if (input != null) {
        throw createBridgeError("body_not_allowed", "GET and HEAD requests cannot include a body.", { method });
      }

      return undefined;
    }

    if (input == null) {
      return undefined;
    }

    if (typeof input !== "string") {
      throw createBridgeError("invalid_body", "Request body must be a string when provided.");
    }

    const byteLength = getByteLength(input);
    if (byteLength > settings.maxBodyBytes) {
      throw createBridgeError("body_too_large", "Request body exceeds the configured maximum size.", {
        maxBodyBytes: settings.maxBodyBytes,
        actualBodyBytes: byteLength,
      });
    }

    return input;
  }

  function validateSenderUrl(senderUrl, allowedPagePatterns) {
    if (typeof senderUrl !== "string" || !matchesAnyPattern(senderUrl, allowedPagePatterns)) {
      throw createBridgeError("sender_not_allowed", "Message sender is not an allowed page origin.");
    }
  }

  function validateRuntimeMessage(message) {
    if (!message || message.type !== MESSAGE_TYPES.FETCH) {
      throw createBridgeError("invalid_message_type", "Runtime message type is not supported.");
    }

    if (message.protocol !== PROTOCOL_NAME || message.version !== PROTOCOL_VERSION) {
      throw createBridgeError("invalid_protocol", "Runtime message protocol version is not supported.", {
        protocol: message.protocol,
        version: message.version,
      });
    }

    if (!(typeof message.requestId === "string" || typeof message.requestId === "number")) {
      throw createBridgeError("invalid_request_id", "Request identifier must be a string or number.");
    }
  }

  function buildRequest(payload, settings, allowedTargetPatterns, options) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw createBridgeError("invalid_payload", "Request payload must be a plain object.");
    }

    const url = sanitizeUrl(payload.url);
    const allowPrivateNetwork = payload.allowPrivateNetwork === true && options && options.allowPrivateNetwork === true;
    if (isPrivateNetworkUrl(url) && !allowPrivateNetwork) {
      throw createBridgeError("private_network_blocked", "Private-network targets are blocked for this bridge request.", { url });
    }

    if (!matchesAnyPattern(url, allowedTargetPatterns)) {
      throw createBridgeError("target_not_allowed", "Target URL is not covered by host permissions.", { url });
    }

    const method = sanitizeMethod(payload.method, settings);
    return {
      url,
      method,
      headers: sanitizeHeaders(payload.headers),
      body: sanitizeBody(method, payload.body, settings),
      responseType: payload.responseType === "base64" ? "base64" : "text",
      privateNetwork: isPrivateNetworkUrl(url),
      allowPrivateNetwork,
      allowedTargetPatterns: allowedTargetPatterns.slice(),
    };
  }

  function validateRedirectUrl(input, request) {
    const url = sanitizeUrl(input);
    if (isPrivateNetworkUrl(url) && request.allowPrivateNetwork !== true) {
      throw createBridgeError("private_network_blocked", "A redirect to a private-network target was blocked.", { url });
    }

    if (!matchesAnyPattern(url, request.allowedTargetPatterns || [])) {
      throw createBridgeError("target_not_allowed", "Redirect target is not covered by host permissions.", { url });
    }

    return url;
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }

    if (typeof btoa === "function") {
      return btoa(binary);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(bytes).toString("base64");
    }

    throw createBridgeError("base64_unsupported", "Base64 encoding is not available in this environment.");
  }

  async function readResponseBody(response, settings) {
    if (response.body && typeof response.body.getReader === "function" && typeof TextDecoder !== "undefined") {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const chunks = [];
      let byteLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        byteLength += value.byteLength;
        if (byteLength > settings.maxResponseBytes) {
          if (typeof reader.cancel === "function") {
            await reader.cancel();
          }
          throw createBridgeError("response_too_large", "Response body exceeds the configured maximum size.", {
            maxResponseBytes: settings.maxResponseBytes,
            actualResponseBytes: byteLength,
          });
        }

        chunks.push(decoder.decode(value, { stream: true }));
      }

      chunks.push(decoder.decode());
      return chunks.join("");
    }

    const bodyText = await response.text();
    const byteLength = getByteLength(bodyText);
    if (byteLength > settings.maxResponseBytes) {
      throw createBridgeError("response_too_large", "Response body exceeds the configured maximum size.", {
        maxResponseBytes: settings.maxResponseBytes,
        actualResponseBytes: byteLength,
      });
    }

    return bodyText;
  }

  async function readResponseBase64(response, settings) {
    if (response.body && typeof response.body.getReader === "function") {
      const reader = response.body.getReader();
      const chunks = [];
      let byteLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        byteLength += value.byteLength;
        if (byteLength > settings.maxResponseBytes) {
          if (typeof reader.cancel === "function") {
            await reader.cancel();
          }
          throw createBridgeError("response_too_large", "Response body exceeds the configured maximum size.", {
            maxResponseBytes: settings.maxResponseBytes,
            actualResponseBytes: byteLength,
          });
        }

        chunks.push(value);
      }

      const bytes = new Uint8Array(byteLength);
      let offset = 0;
      chunks.forEach((chunk) => {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      });

      return {
        bodyBase64: arrayBufferToBase64(bytes.buffer),
        byteLength,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const byteLength = arrayBuffer.byteLength;
    if (byteLength > settings.maxResponseBytes) {
      throw createBridgeError("response_too_large", "Response body exceeds the configured maximum size.", {
        maxResponseBytes: settings.maxResponseBytes,
        actualResponseBytes: byteLength,
      });
    }

    return {
      bodyBase64: arrayBufferToBase64(arrayBuffer),
      byteLength,
    };
  }

  async function executeRequest(request, settings, fetchImpl) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const requestTimeoutMs = getRequestTimeoutMs(request, settings);
    const timeoutHandle = controller
      ? setTimeout(() => controller.abort(), requestTimeoutMs)
      : null;
    const credentials = "omit";
    const fetchHeaders = buildFetchHeaders(request);

    try {
      let currentUrl = request.url;
      let currentMethod = request.method;
      let currentBody = request.body;
      let currentHeaders = { ...fetchHeaders };
      let response;

      for (let redirectCount = 0; redirectCount <= 10; redirectCount += 1) {
        response = await fetchImpl(currentUrl, {
          method: currentMethod,
          headers: currentHeaders,
          body: currentBody,
          credentials,
          redirect: "manual",
          signal: controller ? controller.signal : undefined,
        });

        if (![301, 302, 303, 307, 308].includes(response.status)) {
          break;
        }

        const location = response.headers && typeof response.headers.get === "function"
          ? response.headers.get("location")
          : null;
        if (!location) {
          break;
        }
        if (redirectCount === 10) {
          throw createBridgeError("too_many_redirects", "Request exceeded the maximum number of redirects.");
        }

        const nextUrl = validateRedirectUrl(new URL(location, currentUrl).toString(), request);
        if (new URL(nextUrl).origin !== new URL(currentUrl).origin) {
          Object.keys(currentHeaders).forEach((name) => {
            if (["authorization", "proxy-authorization"].includes(name.toLowerCase())) {
              delete currentHeaders[name];
            }
          });
        }
        if (response.status === 303 || ((response.status === 301 || response.status === 302) && currentMethod === "POST")) {
          currentMethod = "GET";
          currentBody = undefined;
          Object.keys(currentHeaders).forEach((name) => {
            if (["content-type", "content-length"].includes(name.toLowerCase())) {
              delete currentHeaders[name];
            }
          });
        }
        currentUrl = nextUrl;
      }

      const isBinaryResponse = request.responseType === "base64";
      let bodyText = "";
      let bodyBase64 = null;

      if (isBinaryResponse) {
        bodyBase64 = (await readResponseBase64(response, settings)).bodyBase64;
      } else {
        bodyText = await readResponseBody(response, settings);
      }

      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers,
        bodyText,
        bodyBase64,
        finalUrl: response.url,
      };
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw createBridgeError("request_timeout", "Request timed out.", {
          timeoutMs: requestTimeoutMs,
        }, 408);
      }

      throw error;
    } finally {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    }
  }

  return {
    createBridgeError,
    serializeError,
    patternToRegex,
    matchesAnyPattern,
    normalizeAuthorizedSite,
    extractAuthorizedSiteFromPattern,
    normalizeOriginPolicies,
    createAllowedPagePatterns,
    getOriginPolicyForUrl,
    isPrivateNetworkUrl,
    usesOllamaPort,
    getRequestTimeoutMs,
    buildFetchHeaders,
    normalizeAllowedPagePatterns,
    normalizeSettings,
    validateRuntimeMessage,
    validateSenderUrl,
    buildRequest,
    validateRedirectUrl,
    readResponseBody,
    readResponseBase64,
    executeRequest,
  };
});
