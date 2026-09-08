# Architecture

## Goal

Provide a standalone Chrome MV3 extension that proxies Moodle HTTP requests for a browser-based web application while keeping the proxy scope explicitly bounded.

## Repository Layout

- `proxy/`
  - unpacked Chrome extension source
  - includes `_locales/` for Chrome-managed manifest localization
- `docs/`
  - static website and packaged download
- `README.md`
  - setup and operational notes
- `RULES.md`
  - repository constraints

## Components

- `proxy/shared/bridge-config.js`
  - defines protocol identifiers, message types, storage keys, version information, and default settings
  - accepts `moodle-analyzer-web`, `imageneando-studio`, and `edunoza-web` as page application identifiers

- `proxy/shared/page-bridge.js`
  - contains only page-envelope validation and error serialization
  - is loaded by content scripts instead of the larger network request engine

- `proxy/shared/bridge-core.js`
  - normalizes settings and Chrome match patterns
  - validates senders, targets, private-network access, headers, methods, bodies, and redirects
  - reads bounded text and binary responses
  - is loaded by the service worker and options page, where its full functionality is required

- `proxy/content-script.js`
  - injected into the allowed web app origins
  - loads a small page-only validation module instead of parsing the network request engine on every page
  - listens for `window.postMessage(...)` requests from the page
  - validates the bridge request shape, protocol name, and protocol version before forwarding it
  - returns responses back to the page with `window.postMessage(...)`

- `proxy/service-worker.js`
  - receives runtime messages from the content script
  - loads persisted bridge settings from `chrome.storage.sync`
  - validates the sender page URL against the configured content script matches
  - validates the destination URL against the configured `host_permissions`
  - validates method, headers, body size, and timeout limits
  - executes `fetch(...)` with `credentials: "omit"` and timeout handling
  - follows redirects one hop at a time and validates every destination before connecting
  - stores metadata for the latest 20 requests in local extension storage without delaying the bridge response
  - serializes status, headers, and body back to the caller

- `proxy/manifest.json`
  - declares MV3 metadata
  - registers the service worker
  - defines `default_locale` for manifest localization
  - registers the options page and icons
  - defines broad `host_permissions` for HTTP and HTTPS targets
  - defines page match patterns for `gallego.top` and local development origins

- `proxy/options.html`
  - allows runtime bridge limits to be configured without editing source files

- `docs/index.html`
  - publishes the extension overview, install guide, and download call to action

- `docs/app.js`
  - applies website translations and persists the selected language in local storage

- `docs/bridge-client.example.js`
  - demonstrates the page-side protocol for ping and proxy requests

- `tests/`
  - verifies bridge validation, website i18n coverage, and packaged zip contents

- `docs/downloads/proxy-extension.zip`
  - packaged distribution artifact built from the contents of `proxy/`
  - contains minified JavaScript while the repository source remains readable

## Runtime Loading

Static and dynamically registered content scripts load `bridge-config.js`, `page-bridge.js`, and `content-script.js`. They do not load `bridge-core.js`. This reduces the page-injected JavaScript source from 33,906 bytes to 12,926 bytes in version `0.2.5`.

A `maxBodyBytes` value of `0` disables the extension-defined request-body limit. Positive values are bounded between 1 KiB and 10 MiB. The default remains 1 MiB.

The default method policy includes the WebDAV `PROPFIND` and `MKCOL` methods. They pass through the same sender, target, header, body, private-network, redirect, timeout, and response-size validation as other requests.

Settings schema version 2 migrates legacy stored method lists by adding `PROPFIND` and `MKCOL`. Normalized settings are marked with the current schema version, so later user changes to the method list are preserved. `https://edunoza.com/*` is a static built-in caller pattern and is not duplicated by dynamic registration.

The service worker loads `bridge-config.js` and `bridge-core.js` when Chrome starts it for an extension event. The options page loads the same two files only when the user opens settings.

Audit records are written outside the response-critical path, so storage persistence does not add to the time observed by the calling page.

## Packaging

1. `npm install` installs Terser as a development dependency.
2. `npm run package:extension` copies extension files to a temporary staging directory.
3. Terser compresses and mangles staged JavaScript files.
4. The staging directory is archived as `docs/downloads/proxy-extension.zip` and then removed.
5. `npm test` checks the size limit and executes the packaged shared modules to verify that minification produced valid code.

## Messaging Flow

1. The web page emits a bridge request.
2. The content script validates the protocol envelope and forwards it with `chrome.runtime.sendMessage(...)`.
3. The service worker loads persisted settings, validates the sender URL and target URL, then enforces request limits.
4. The service worker executes the remote request with extension permissions.
5. The content script posts a normalized response back into the page context.

## Security Notes

- Only `http` and `https` URLs are accepted.
- Allowed destination hosts are any `http` or `https` URL covered by `proxy/manifest.json` `host_permissions`.
- Allowed caller pages are defined by `proxy/manifest.json` content script `matches`.
- Extension fetches intentionally omit browser cookies. Token-based authentication should be supplied through allowed request headers.
- Request headers are filtered to prevent page code from setting sensitive transport headers such as `Cookie`, `Host`, `Origin`, or `Referer`.
