# Moodle Analyzer Proxy Extension

Chrome MV3 extension that proxies Moodle API requests for a web application when direct browser requests are blocked by CORS.

## Purpose

This project contains only the Chrome extension bridge.

The extension allows a frontend web app to:

1. send a request from the page to the content script
2. forward the request to the extension service worker
3. perform the Moodle HTTP request with extension host permissions
4. return the response back to the page

## Files

- `manifest.json`: Chrome MV3 manifest
- `content-script.js`: page-to-extension bridge
- `service-worker.js`: extension-side HTTP proxy worker

## Load In Chrome

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this project folder: `D:\ProyectosIA\proxy extension`

## Current Page Matches

The content script is injected on:

- `http://127.0.0.1/*`
- `http://localhost/*`

If the target web app runs on another origin, update `manifest.json`.

## Notes

- This extension is intended for development or controlled distribution.
- It does not bypass authentication. It only changes where the HTTP request is executed.
- If a Moodle deployment is broken at the server/proxy layer, this extension is a practical client-side bridge.
