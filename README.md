# Proxy

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
- `proxy/shared/bridge-config.js`: protocol constants and default settings
- `proxy/shared/page-bridge.js`: lightweight validation loaded on authorized pages
- `proxy/shared/bridge-core.js`: settings, request, response, and redirect validation used by extension pages and the service worker
- `proxy/content-script.js`: page-to-extension bridge
- `proxy/service-worker.js`: extension-side HTTP proxy worker
- `docs/index.html`: static website with overview, install guide, and download link
- `docs/privacy.html`: privacy policy page for Chrome Web Store publication
- `docs/app.js`: client-side translations and language selection
- `docs/bridge-client.example.js`: browser example client for the bridge protocol
- `docs/styles.css`: website styling
- `docs/downloads/proxy-extension.zip`: packaged extension archive
- `scripts/`: packaging and icon generation helpers
- `tests/`: regression checks for bridge logic, i18n, and package contents
- `CHANGELOG.md`: release history
- `STORE_LISTING.md`: Chrome Web Store listing copy and permission justifications
- `PUBLISHING.md`: Chrome Web Store publishing checklist
- `package.json`: local scripts for tests and packaging
- `README.md`: setup and usage notes
- `ARCHITECTURE.md`: runtime responsibilities and message flow
- `RULES.md`: repository-level constraints

## Allowed Caller Pages

The packaged content script is injected by default on these page origins:

- `https://gallego.top/*`
- `https://*.gallego.top/*`
- `http://127.0.0.1/*`
- `https://127.0.0.1/*`
- `http://localhost/*`
- `https://localhost/*`

Only pages loaded from those origins can use the bridge by default. Additional caller page patterns can be added from the extension options page. User-added patterns are stored in Chrome extension storage and registered as dynamic content scripts with the packaged bridge files.

Custom patterns retain their exact scheme and path. For example, `https://example.com/tools/*` does not authorize HTTP pages or other paths on that host.

## Allowed Target Hosts

The extension can contact any `http` or `https` host. This keeps the bridge usable against different Moodle deployments and user-selected endpoints. Caller pages are still restricted by the built-in and user-configured authorized site lists.

## Load In Chrome

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select the repository's `proxy/` folder, which contains `manifest.json`.

## Website

- Open `docs/index.html` locally to view the product page.
- The website includes translations for Spanish, Galician, English, French, German, Portuguese, Catalan, and Basque.
- The website is static and ready to be published through GitHub Pages or any static host.
- The page links directly to `docs/downloads/proxy-extension.zip`.

## Extension Options

- Click the extension toolbar icon or open `Extension options` from `chrome://extensions`.
- The options page controls authorized caller pages, interface language, request timeout, maximum request body size, maximum response body size, and allowed HTTP methods.
- The request body limit defaults to 1 MiB. Set it to `0` to remove the extension-defined limit; Chrome messaging, memory, and target-server limits still apply.

## Edunoza

Edunoza can use the bridge with the protocol source identifier `edunoza-web`. It is intentionally not a built-in caller origin. Add `https://edunoza.com/*` under **Authorized sites** in the extension options and save the settings before using it.

The default method set includes `GET` and `PUT`. Request headers may include `Authorization` and `If-Match`, allowing Edunoza to exchange a fixed-name encrypted file and use entity tags to detect concurrent updates. `PROPFIND` and `MKCOL` are not supported, so the remote folder must already exist.

## Development Commands

- Run `npm install` once to install the packaging tools.
- `npm test`: runs the local regression checks.
- `npm run package:extension`: rebuilds `docs/downloads/proxy-extension.zip` with minified JavaScript.
- `npm run generate:icons`: regenerates the extension icons in `proxy/assets/`.

Run packaging before the final test pass because the test suite also validates the generated ZIP.

## Performance and Package Size

- Authorized pages load only the protocol configuration, the lightweight page bridge, and the content script. The network request engine remains in the service worker and is not parsed by each page.
- The page-injected JavaScript source is 12,926 bytes in version `0.2.5`, down from 33,906 bytes before the split.
- Packaging minifies JavaScript in a temporary staging directory. The readable source files in `proxy/` remain unchanged.
- A regression test keeps packaged releases below 30 KiB.
- Audit-log persistence starts after request execution and does not delay delivery of the bridge response.

## Chrome Web Store Preparation

- `docs/downloads/proxy-extension.zip` is the upload package.
- `STORE_LISTING.md` contains listing copy, single purpose text, permission justifications, and reviewer notes.
- `PUBLISHING.md` contains the final dashboard checklist.
- `docs/privacy.html` must be published to a stable public URL and entered in the privacy policy field.
- The package is Manifest V3 and does not load remotely hosted code.

## Security Notes

- Only `http` and `https` URLs are accepted.
- The service worker accepts any `http` or `https` target URL allowed by the broad host permissions.
- The service worker validates that messages come from a page URL matched by the content script.
- Extension fetches use `credentials: "omit"` to avoid CORS rejections when the target server returns `Access-Control-Allow-Origin: *`. Token-based authentication (Moodle web service tokens) does not require cookies.
- Requests to port `11434` avoid unnecessary preflight headers inside the bridge. Private-network targets such as localhost, `127.0.0.1`, and RFC1918 addresses require both an enabled origin policy and `allowPrivateNetwork: true` on the bridge request.
- Redirects are followed manually. Every destination is validated before Chrome connects to it, and authorization headers are removed when a redirect changes origin.
- The extension stores a local audit trail for the latest 20 requests. It contains request metadata but excludes request bodies, response bodies, query strings, and URL fragments.

## Notes

- This extension is intended for development or controlled distribution.
- It does not bypass authentication. It only changes where the HTTP request is executed.
- If a Moodle deployment is broken at the server or proxy layer, this extension is a practical client-side bridge.
