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

- `proxy/content-script.js`
  - injected into the allowed web app origins
  - listens for `window.postMessage(...)` requests from the page
  - validates the bridge request shape, protocol name, and protocol version before forwarding it
  - returns responses back to the page with `window.postMessage(...)`

- `proxy/service-worker.js`
  - receives runtime messages from the content script
  - loads persisted bridge settings from `chrome.storage.sync`
  - validates the sender page URL against the configured content script matches
  - validates the destination URL against the configured `host_permissions`
  - validates method, headers, body size, and timeout limits
  - executes `fetch(...)` with `credentials: "include"` and timeout handling
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
- Cookie-backed Moodle sessions are preserved through `credentials: "include"`.
- Request headers are filtered to prevent page code from setting sensitive transport headers such as `Cookie`, `Host`, `Origin`, or `Referer`.
