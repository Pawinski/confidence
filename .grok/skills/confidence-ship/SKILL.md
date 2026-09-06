# confidence-ship — Confidence Wrapper

Wraps kernel `ship` verb for Confidence deployment workflow.

## Wrapper Declaration

| Field           | Value                                     |
|-----------------|-------------------------------------------|
| Kernel          | `.grok/skills/ship`                       |
| Artifact        | Ship log entry in commit/tag              |
| Mode            | Write (controlled mutations)              |

## Confidence Ship Context

Confidence is a static PWA. "Ship" means:
1. Push to main → GitHub Pages auto-deploys `static/` folder
2. Service worker updates
3. No server-side deployment (SQLite API is local dogfood only)

## Preflight Checks

Before shipping:
- [ ] Tests pass (`pytest`)
- [ ] No PHI in staged changes
- [ ] No RAMQ/NAM identifiers committed
- [ ] French copy is primary, English is toggle
- [ ] MCP consent gate remains off-by-default
- [ ] No merge with Welcome codebase

## Ship Workflow

1. **Version**: Update version in `static/manifest.json` if applicable
2. **Changelog**: Document changes since last tag
3. **Tag**: Create annotated tag (`v*` or date-based)
4. **Push**: Push to main, GitHub Pages workflow runs

## What Ship Does NOT Do

- Does not deploy the FastAPI server with real health data
- Does not enable MCP by default
- Does not create production database
- Does not send notifications

## Rollback

```bash
git revert HEAD
git push origin main
```

Service worker will pick up reverted version.

## Post-Ship Verification

- Visit GitHub Pages URL
- Confirm service worker version updated
- Test offline capability
