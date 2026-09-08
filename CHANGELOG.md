# Changelog

## 0.2.6 - 2026-09-09

- Enabled the WebDAV `PROPFIND` and `MKCOL` methods by default.
- Added regression coverage for WebDAV collection discovery and creation requests.
- Bumped the extension package version to `0.2.6`.

## 0.2.5 - 2026-09-09

- Added the `edunoza-web` bridge application identifier.
- Added `0` as an unlimited request-body setting while retaining the 1 MiB default.
- Documented the opt-in Edunoza caller pattern and fixed-file synchronization capabilities.
- Bumped the extension package version to `0.2.5`.

## 0.2.4 - 2026-09-09

- Renamed the extension and public product branding from `GateFetch` to `Proxy`.
- Renamed the distribution archive to `proxy-extension.zip`.
- Bumped the extension package version to `0.2.4`.

## 0.2.3 - 2026-09-08

- Reduced content-script startup work by separating page validation from the network request engine.
- Moved audit-log persistence out of the response-critical path.
- Prevented duplicate content-script injection and duplicate proxy requests on built-in caller pages.
- Preserved the scheme and path restrictions of custom Chrome match patterns.
- Added validation for every HTTP redirect before connecting to its destination.
- Removed authorization headers when a redirect changes origin.
- Documented the local 20-entry request metadata audit trail.
- Added regression coverage for dynamic registration and private-network redirects.
- Bumped the extension package version to `0.2.3`.

## 0.2.2 - 2026-06-04

- Updated the in-page launcher to show the compact `PX` label by default and reveal only the options button on hover or focus.
- Bumped the extension package version to `0.2.2`.

## 0.2.1 - 2026-06-04

- Changed the in-page options launcher to appear only after an authorized app sends a bridge ping.
- Simplified the in-page launcher so it only shows the options icon and keeps attaching next to the AI Runtime launcher when present.
- Added a local extension test bench page for bridge and launcher checks.
- Flattened the options page visual style to match the AI Runtime extension settings UI more closely.
- Bumped the extension package version to `0.2.1`.

## 0.2.0 - 2026-05-11

- Confirmed full localization support for English, Spanish, French, Portuguese, German, Galician, Catalan, and Basque across the Chrome manifest, website, and extension options page.
- Bumped the extension package version to `0.2.0`.

## 0.1.2 - 2026-05-06

- Added configurable authorized caller page patterns from the options page.
- Added dynamic packaged content script registration for user-authorized pages.
- Added a localized language selector for English, Spanish, French, German, Portuguese, Galician, Catalan, and Basque.
- Improved the extension options UI for publication readiness.
- Added response body size limits and safer package validation checks.
- Added Chrome Web Store publication materials, privacy policy, and listing notes.
- Added an extension toolbar action that opens the options page.

## 0.1.1 - 2026-04-27

- Fixed CORS rejection when the target server returns `Access-Control-Allow-Origin: *`: changed fetch credentials mode from `include` to `omit`. Token-based authentication does not require cookies.

## 0.1.0 - 2026-04-15

- Renamed the extension to `GateFetch`.
- Added caller origin restrictions for `gallego.top`, subdomains, and local development hosts.
- Added Chrome `_locales` bundles for Spanish, Galician, English, French, German, Portuguese, Catalan, and Basque.
- Added a localized static website with direct package download.
- Added an options page for request timeout, body size, and allowed methods.
- Added stricter bridge protocol validation with protocol versioning and normalized errors.
- Added a browser client example for bridge consumers.
- Added tests, packaging scripts, and extension icons.
