# Chrome Web Store Listing Draft

## Item name

Proxy

## Short description

Local extension bridge for controlled cross-origin HTTP requests from authorized pages.

## Detailed description

Proxy is a Manifest V3 Chrome extension for controlled development and integration workflows. It lets authorized web pages send user-initiated HTTP requests through the extension service worker, then returns the response to the calling page.

Use it when a trusted local or hosted web application needs a browser-side bridge for cross-origin HTTP requests during development, Moodle integrations, local Ollama calls, or similar controlled environments. Private-network targets require an explicit per-origin setting and an explicit request flag.

Key features:

- Authorize caller pages from the extension options page.
- Configure request timeout, maximum request body size, maximum response body size, and allowed HTTP methods.
- Choose request and response limits from 1, 5, 10, 25, 50, or 100 MB. Requests also support an unlimited option, while the defaults remain 1 MB for requests and 10 MB for responses.
- Run with a self-contained Manifest V3 codebase.
- Keep page startup lightweight by loading network request code only in the extension service worker.
- Use localized extension settings in English, Spanish, French, German, Portuguese, Galician, Catalan, and Basque.
- Open settings directly from the extension toolbar button.

Edunoza integration uses the `edunoza-web` protocol identifier and the built-in `https://edunoza.com/*` caller pattern. The default method set includes `GET`, `PUT`, `PROPFIND`, and `MKCOL`; headers such as `Authorization`, `If-Match`, and `Depth` support encrypted-file synchronization, concurrent-update detection, and WebDAV collection discovery and creation. Upgrades migrate legacy stored method lists once to add the two WebDAV methods while preserving later user choices.

Security notes:

- Only pages matched by the built-in or user-configured authorized site list can call the bridge.
- Only `http` and `https` target URLs are accepted.
- Custom caller patterns retain their configured scheme and path restrictions.
- Every redirect destination is validated before connection, and cross-origin redirects lose authorization headers.
- Extension fetches use `credentials: "omit"`.
- A local audit trail keeps metadata for the latest 20 requests. Request and response bodies, query strings, and URL fragments are not stored.
- The extension does not bypass authentication or paywalls.

## Single purpose

Proxy provides a configurable extension-side HTTP bridge for authorized web pages that need to perform controlled cross-origin requests from Chrome.

## Category

Developer Tools

## Language support

English, Spanish, French, German, Portuguese, Galician, Catalan, and Basque.

## Permission justifications

### `storage`

Stores user settings such as authorized caller page patterns, language, request limits, response limits, and allowed HTTP methods.

### Private network access

Localhost and private-network calls are blocked unless the calling origin policy enables local network access and the page request sets `allowPrivateNetwork: true`.

### `scripting`

Registers the packaged bridge content script on user-authorized caller page patterns added from the options page.

### Host permissions: `http://*/*`, `https://*/*`

Required for the extension's single purpose: performing user-initiated bridge requests to HTTP and HTTPS endpoints selected by authorized pages. The extension validates caller pages, request methods, request size, response size, and target URL protocol before forwarding a request.

## Privacy practices

- The extension does not collect analytics.
- The extension does not sell user data.
- The extension stores metadata for the latest 20 requests locally. It does not store request or response bodies, query strings, or URL fragments.
- Settings are stored in Chrome extension storage.
- Network data is transmitted only to the target URL supplied by an authorized page as part of the bridge request.

Privacy policy URL: publish `docs/privacy.html` and use that public URL in the Chrome Web Store developer dashboard.

## Reviewer notes

The extension is self-contained and does not execute remotely hosted code. All JavaScript executed by the extension is bundled and minified in the uploaded package. Minification is performed locally from the readable source in this repository.

To test:

1. Load the unpacked `proxy/` directory in Chrome.
2. Open the extension toolbar icon to enter settings.
3. Add an authorized caller page pattern, for example `http://localhost/*`.
4. Save settings and reload the authorized page.
5. Use `docs/bridge-client.example.js` from that page to send a bridge request.

The broad host permissions are necessary because target endpoints are user-selected HTTP or HTTPS URLs. Caller pages are still restricted by the built-in manifest matches and by user-configured authorized site patterns.

## Assets checklist

- 128x128 extension icon: `proxy/assets/icon128.png`
- 48x48 extension icon: `proxy/assets/icon48.png`
- 32x32 extension icon: `proxy/assets/icon32.png`
- 16x16 extension icon: `proxy/assets/icon16.png`
- Screenshots still need to be captured from the options page before submission.
- Promotional images still need to be created if the dashboard requires them for the chosen listing configuration.
