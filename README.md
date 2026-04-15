# Proxy Extension

Chrome MV3 extension that acts as a proxy for CORS-related request issues.

## Purpose

This repository contains only the Chrome extension bridge. The unpacked extension source lives in `proxy/`.

The extension allows a frontend web app to:

1. send a request from the page to the content script
2. forward the request to the extension service worker
3. perform the Moodle HTTP request with extension host permissions
4. return the response back to the page

## Repository Layout

- `proxy/manifest.json`: Chrome MV3 manifest
- `proxy/_locales/`: Chrome extension locale bundles for name and description
- `proxy/options.html`: extension settings page for runtime limits
- `proxy/shared/`: shared bridge protocol and validation logic
- `proxy/content-script.js`: page-to-extension bridge
- `proxy/service-worker.js`: extension-side HTTP proxy worker
- `docs/index.html`: static website with overview, install guide, and download link
- `docs/app.js`: client-side translations and language selection
- `docs/bridge-client.example.js`: browser example client for the bridge protocol
- `docs/styles.css`: website styling
- `docs/downloads/proxy-extension.zip`: packaged extension archive
- `scripts/`: packaging and icon generation helpers
- `tests/`: regression checks for bridge logic, i18n, and package contents
- `CHANGELOG.md`: release history
- `package.json`: local scripts for tests and packaging
- `README.md`: setup and usage notes
- `ARCHITECTURE.md`: runtime responsibilities and message flow
- `RULES.md`: repository-level constraints

## Allowed Caller Pages

The content script is injected only on these page origins:

- `https://gallego.top/*`
- `https://*.gallego.top/*`
- `http://127.0.0.1/*`
- `https://127.0.0.1/*`
- `http://localhost/*`
- `https://localhost/*`

Only pages loaded from those origins can use the bridge.

## Allowed Target Hosts

The extension can contact any `http` or `https` host. This keeps the bridge usable against different Moodle deployments without editing the manifest for each one.

If the target web app must run on another origin, update the content script `matches` in `proxy/manifest.json` accordingly.

## Load In Chrome

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this folder: `D:\ProyectosIA\proxy extension\proxy`

## Website

- Open `docs/index.html` locally to view the product page.
- The website includes translations for Spanish, Galician, English, French, German, Portuguese, Catalan, and Basque.
- The website is static and ready to be published through GitHub Pages or any static host.
- The page links directly to `docs/downloads/proxy-extension.zip`.

## Extension Options

- Open the extension details in `chrome://extensions` and enter `Extension options`.
- The options page controls request timeout, maximum request body size, and allowed HTTP methods.
- Caller origins remain fixed in `proxy/manifest.json`.

## Development Commands

- `npm test`: runs the local regression checks.
- `npm run package:extension`: rebuilds `docs/downloads/proxy-extension.zip`.
- `npm run generate:icons`: regenerates the extension icons in `proxy/assets/`.

## Security Notes

- Only `http` and `https` URLs are accepted.
- The service worker accepts any `http` or `https` target URL allowed by the broad host permissions.
- The service worker validates that messages come from a page URL matched by the content script.
- Extension fetches use `credentials: "include"` so Moodle cookie-based sessions can be reused.

## Notes

- This extension is intended for development or controlled distribution.
- It does not bypass authentication. It only changes where the HTTP request is executed.
- If a Moodle deployment is broken at the server or proxy layer, this extension is a practical client-side bridge.
