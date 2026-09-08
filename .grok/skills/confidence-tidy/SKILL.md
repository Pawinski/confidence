# confidence-tidy — Confidence Wrapper

Wraps kernel `tidy` verb for Confidence codebase cleanup.

## Wrapper Declaration

| Field           | Value                                     |
|-----------------|-------------------------------------------|
| Kernel          | `.grok/skills/tidy`                       |
| Mode            | Write (safe mutations only)               |

## Confidence Tidy Context

Confidence is a browser-first PWA with optional FastAPI backend. Tidy operations respect the static/server split.

## Tidy Operations

| Task              | Confidence Scope                     |
|-------------------|--------------------------------------|
| `format`          | Python (black/ruff), JS (prettier if configured) |
| `imports`         | Python imports, JS module imports    |
| `dead-code`       | Unused Python functions, unused JS   |
| `trailing`        | All text files                       |
| `doc-sync`        | README, PRODUCT.md references        |
| `deps`            | requirements.txt, package.json       |

## Exclude Paths

Do not tidy:
- `static/` app code (unless explicitly requested)
- `.grok/config.toml` (MCP wiring)
- `confidence.html` (generated/bundled)
- Third-party vendored files

## Tidy Checklist

Before tidying:
- [ ] Run tests to establish baseline
- [ ] Confirm no uncommitted work changes

After tidying:
- [ ] Tests still pass
- [ ] No behavior change
- [ ] French copy unchanged (formatting only)

## Commit Style

```
tidy: [category] in [scope]
```

Examples:
- `tidy: format Python files`
- `tidy: remove unused imports in mcp_tools.py`
- `tidy: sync README links`

## What Tidy Does NOT Do

- Change application logic
- Modify user-facing French copy (except whitespace)
- Touch MCP consent logic
- Remove "unused" code that is actually called by browser JS
- Modify PRODUCT.md content (structure/links only)
