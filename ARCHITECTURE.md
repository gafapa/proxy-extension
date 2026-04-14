# Architecture

## Goal

Provide a standalone Chrome MV3 extension that proxies Moodle HTTP requests for a browser-based web application.

## Components

- `content-script.js`
  - injected into the allowed web app origins
  - listens for `window.postMessage(...)` requests from the page
  - forwards request payloads to the extension runtime
  - returns responses back to the page with `window.postMessage(...)`

- `service-worker.js`
  - receives runtime messages from the content script
  - validates the destination URL
  - executes `fetch(...)` using extension permissions
  - serializes status, headers, and body back to the caller

- `manifest.json`
  - declares MV3 metadata
  - registers the service worker
  - defines `host_permissions`
  - defines page match patterns for the content script

## Messaging Flow

1. The web page emits a bridge request.
2. The content script forwards the request with `chrome.runtime.sendMessage(...)`.
3. The service worker executes the remote request.
4. The content script posts the response back into the page context.

## Security Notes

- Only `http` and `https` URLs are accepted.
- The extension currently grants broad `host_permissions` because Moodle hosts may vary.
- The effective exposure is limited by the content script `matches` configuration.
