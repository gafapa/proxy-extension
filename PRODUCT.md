# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and maintainers who need an authorized browser page to exchange data with HTTP or HTTPS endpoints that would otherwise be blocked by browser CORS restrictions.

## Product Purpose

Proxy is a Chrome Manifest V3 extension that provides a controlled request bridge. Success means a user can understand its scope, download the package, install it locally, and call the bridge from an authorized page.

## Positioning

Proxy forwards requests through a Chrome service worker while restricting which caller pages and HTTP methods may use the bridge.

## Operating Context

The extension is installed as an unpacked Chrome extension. It serves gallego.top and its subdomains, edunoza.com, localhost, and 127.0.0.1 by default, with configurable caller policies, methods, private-network access, and request size limits.

## Capabilities and Constraints

- Supports HTTP and HTTPS targets.
- Supports GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, PROPFIND, and MKCOL when enabled.
- Accepts Authorization and If-Match headers after transport-header filtering.
- Provides selectable request limits from 1 MB through 100 MB, plus no limit.
- Uses token-based authentication without browser cookies.
- Stores a bounded local audit trail without request or response bodies.

## Brand Commitments

The product name is Proxy. The existing geometric bridge icon at `docs/assets/proxy-icon.png` is the project mark. The public website may take structural and tonal inspiration from OpenHands while retaining Proxy's own content and identity.

## Evidence on Hand

The repository contains the working extension, automated tests, a packaged download, an extension test bench, privacy documentation, and a localized public landing page. No customer logos, testimonials, performance benchmarks, or commercial claims are available and none should be fabricated.

## Product Principles

- Explain the bridge mechanism before implementation detail.
- Keep installation direct and verifiable.
- State access boundaries precisely.
- Keep the public site fast, accessible, and portable.
