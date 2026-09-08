# Agent instructions — Confidence

Read [PRODUCT.md](PRODUCT.md) before writing code.

## UI Evidence Rule

UI pull requests: every PR that changes user-visible UI MUST attach before/after screenshots (or a short screen recording) sufficient for manual verify. No merge without them. Non-UI PRs are exempt; PR description must state `UI: none`. Review may flag missing shots; hard-veto UI merge without evidence.

## Boundaries

- This folder only. Do not merge with Welcome.
- No PHI in git (no patient samples, no NAM, no blood values).

## Personas

Need a designer / architect / etc.: `/Users/apawinski/dev/.grok/personas/_roster.md` then the matching file.

## Harness (Kernel + Adapter)

Confidence uses a kernel/adapter pattern for agent skills. See [docs/HARNESS.md](docs/HARNESS.md).

| Verb       | Wrapper               | Slash Command    |
|------------|-----------------------|------------------|
| `review`   | `expert-review`       | `/expert-review` |
| `ship`     | `confidence-ship`     | —                |
| `incident` | `confidence-incident` | —                |
| `tidy`     | `confidence-tidy`     | —                |

### /expert-review

Formal critique via `/expert-review`. Writes artifact to `reviews/expert-review-*.md`.

Review surfaces applied:
- Law 5/25 ownership
- Blood-type honesty UX
- French-first copy
- Doctor handoff (Montrer/PDF/carte)
- Incident declare (severity/commander/timeline; notify ≠ auto-send)
- MCP consent gate (off-by-default)
- Welcome boundary

### Configuration

- `agent/harness-select.json` — runtime verb/persona/surface configuration
- `agent/context.md` — project context stub
- `agent/personas/` — custom personas (empty; uses external roster)
