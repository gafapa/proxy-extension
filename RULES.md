# Repository Rules

## Language

- Use English for code identifiers.
- Use English for Markdown documentation.
- Use English for code comments and Git commit messages.

## Extension Scope

- Keep this repository focused on the Chrome extension bridge only.
- Do not add unrelated frontend or backend application code here.

## Security

- Accept only `http` and `https` request targets.
- Keep content script `matches` limited to approved web application origins.
- Restrict bridge usage to `gallego.top` and local development origins unless requirements change.
- Do not add credential persistence unless explicitly required.

## Documentation Sync

- Update `README.md` when install or usage steps change.
- Update `ARCHITECTURE.md` when message flow or runtime responsibilities change.
