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

  function getByteLength(value) {
    if (textEncoder) {
      return textEncoder.encode(value).length;
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.byteLength(value, "utf8");
    }

    return value.length;
  }

  function normalizeSettings(input) {
    const raw = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const requestTimeoutMs = Number.isFinite(raw.requestTimeoutMs)
      ? Math.max(1000, Math.min(120000, Math.trunc(raw.requestTimeoutMs)))
      : DEFAULT_SETTINGS.requestTimeoutMs;
    const maxBodyBytes = Number.isFinite(raw.maxBodyBytes)
      ? Math.max(1024, Math.min(10 * 1024 * 1024, Math.trunc(raw.maxBodyBytes)))
      : DEFAULT_SETTINGS.maxBodyBytes;
    const allowedMethods = Array.isArray(raw.allowedMethods)
      ? raw.allowedMethods.filter((method) => DEFAULT_SETTINGS.allowedMethods.includes(String(method).toUpperCase())).map((method) => String(method).toUpperCase())
      : DEFAULT_SETTINGS.allowedMethods.slice();

    return {
      requestTimeoutMs,
      maxBodyBytes,
      allowedMethods: allowedMethods.length ? Array.from(new Set(allowedMethods)) : DEFAULT_SETTINGS.allowedMethods.slice(),
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

  function validatePageEnvelope(message, appSource) {
    if (!message || message.source !== appSource || typeof message.type !== "string") {
      return { valid: false };
    }

    if (message.protocol !== PROTOCOL_NAME || message.version !== PROTOCOL_VERSION) {
      return {
        valid: false,
        error: createBridgeError("invalid_protocol", "Bridge protocol version is not supported.", {
          protocol: message.protocol,
          version: message.version,
        }),
      };
    }

    if (message.type === MESSAGE_TYPES.PING) {
      return { valid: true, kind: MESSAGE_TYPES.PING };
    }

    if (message.type !== MESSAGE_TYPES.REQUEST) {
      return { valid: false };
    }

    if (!(typeof message.requestId === "string" || typeof message.requestId === "number")) {
      return {
        valid: false,
        error: createBridgeError("invalid_request_id", "Request identifier must be a string or number."),
      };
    }

    if (!message.payload || typeof message.payload !== "object" || Array.isArray(message.payload) || typeof message.payload.url !== "string") {
      return {
        valid: false,
        error: createBridgeError("invalid_payload", "Bridge request payload is invalid."),
      };
    }

    return { valid: true, kind: MESSAGE_TYPES.REQUEST };
  }

  function buildRequest(payload, settings, allowedTargetPatterns) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw createBridgeError("invalid_payload", "Request payload must be a plain object.");
    }

    const url = sanitizeUrl(payload.url);
    if (!matchesAnyPattern(url, allowedTargetPatterns)) {
      throw createBridgeError("target_not_allowed", "Target URL is not covered by host permissions.", { url });
    }

    const method = sanitizeMethod(payload.method, settings);
    return {
      url,
      method,
      headers: sanitizeHeaders(payload.headers),
      body: sanitizeBody(method, payload.body, settings),
    };
  }

  async function executeRequest(request, settings, fetchImpl) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutHandle = controller
      ? setTimeout(() => controller.abort(), settings.requestTimeoutMs)
      : null;

    try {
      const response = await fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        credentials: "include",
        redirect: "follow",
        signal: controller ? controller.signal : undefined,
      });

      const bodyText = await response.text();
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
        finalUrl: response.url,
      };
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw createBridgeError("request_timeout", "Request timed out.", {
          timeoutMs: settings.requestTimeoutMs,
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
    normalizeSettings,
    validatePageEnvelope,
    validateRuntimeMessage,
    validateSenderUrl,
    buildRequest,
    executeRequest,
  };
});
