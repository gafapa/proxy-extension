# Chrome Web Store Publishing Checklist

This checklist tracks the release steps for publishing Proxy to the Chrome Web Store.

## Pre-submit checks

- Run `npm install` when dependencies are not installed yet.
- Run `npm run package:extension`.
- Run `npm test` after packaging so the current ZIP is validated.
- Upload `docs/downloads/proxy-extension.zip`.
- Confirm the ZIP is below the enforced 30 KiB package limit.
- Confirm the uploaded ZIP does not include `_metadata`, `.git`, docs, tests, or generated development files.
- Confirm every JavaScript file is bundled locally and no remote script is loaded or evaluated.
- Confirm packaged JavaScript is minified and the ZIP tests can load its shared modules.
- Confirm the privacy policy is publicly reachable.
- Confirm the support contact in the Chrome Web Store developer dashboard is current.

## Developer dashboard fields

- Item name: `Proxy`
- Category: `Developer Tools`
- Single purpose: use the text from `STORE_LISTING.md`.
- Short description: use the text from `STORE_LISTING.md`.
- Detailed description: use the text from `STORE_LISTING.md`.
- Privacy policy URL: public URL for `docs/privacy.html`.
- Permission justifications: use the text from `STORE_LISTING.md`.

## Data usage declarations

Declare that the extension handles website content only to perform the user-facing bridge request feature.

Declare that the extension:

- Does not sell or transfer user data for advertising.
- Does not use user data for creditworthiness or lending.
- Does not collect analytics.
- Stores a local audit trail with metadata for the latest 20 requests, excluding bodies, query strings, and URL fragments.
- Stores settings in Chrome extension storage.

## Manual test before upload

1. Load `proxy/` unpacked in Chrome.
2. Click the toolbar icon and confirm the options page opens.
3. Change the interface language and confirm labels update.
4. Add `http://localhost/*` as an authorized site and save.
5. Reload a matching local page and confirm the bridge announces availability.
6. Send a test request to an allowed HTTP or HTTPS endpoint.
7. Confirm large responses are rejected when they exceed the configured maximum.
