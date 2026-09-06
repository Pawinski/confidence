# expert-review — Confidence Wrapper

Wraps kernel `review` verb for Confidence formal critique. Invoked via `/expert-review` slash command.

## Wrapper Declaration

| Field           | Value                                     |
|-----------------|-------------------------------------------|
| Kernel          | `.grok/skills/review`                     |
| Slash command   | `/expert-review`                          |
| Artifact        | `reviews/expert-review-*.md`              |
| Mode            | Read-only (no source modifications)       |

## Usage

```
/expert-review
```

Agent adopts reviewer personas, reads context files, applies Confidence review surfaces, and writes structured critique to `reviews/expert-review-YYYY-MM-DD-HHMMSS.md`.

## Personas

Default reviewers (from `agent/harness-select.json`):
- software-architect
- security-engineer  
- product-manager

Platform changes add:
- platform-architect

Persona definitions live in external roster (see AGENTS.md for path).

## Review Surfaces

The following checklists are applied during review:

### law-5-25-ownership
- Does the change respect Quebec Law 5 (health info follows person) and Law 25 (privacy)?
- Hosting real Quebec health information is regulated — is this local-only?
- No personal health data in git.

### blood-type-honesty-ux
- Self-reported blood type can be wrong. Does UI communicate this?
- Source and date must remain visible.
- User owns the fact, not the app.

### french-first-copy
- Primary language is French.
- English toggle available but French is default.
- Medical terms use Quebec conventions.

### doctor-handoff
- **Montrer à un médecin**: hold phone out workflow.
- **Imprimer / PDF**: one-page printable.
- **Enregistrer la carte**: standalone HTML file for AirDrop/Files.
- The app does not become a communication channel.

### incident-declare
- Severity levels defined and appropriate.
- Commander role clear.
- Timeline is append-only during incident.
- Notify drafts a message — does NOT auto-send.

### mcp-consent-gate
- MCP/agents OFF by default.
- Single click does not enable — user must check every risk.
- Agent token is user-minted, shown once, revocable.
- Locked state blocks handshake.

### welcome-boundary
- Do not merge with Welcome (`/Users/apawinski/dev/welcome`).
- Maternity/birthing is a separate app.
- No shared state, no shared deployment.

## Context Files

Read before reviewing (from `agent/harness-select.json`):
- `PRODUCT.md`
- `agent/context.md`

## Output

Review artifact written to:
```
reviews/expert-review-YYYY-MM-DD-HHMMSS.md
```

Format follows kernel `review` output structure with Confidence surfaces applied.
