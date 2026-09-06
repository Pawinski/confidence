# Harness Architecture

The Confidence agent harness uses a **kernel + adapter** pattern to separate portable contracts from project-specific behavior.

## Kernel vs Adapter

```
┌─────────────────────────────────────────────────────┐
│                   Slash Command                      │
│                   /expert-review                     │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Wrapper (Adapter Layer)                 │
│         .grok/skills/expert-review/SKILL.md         │
│                                                      │
│  - Confidence-specific surfaces                      │
│  - Project context (PRODUCT.md, agent/context.md)   │
│  - Artifact path (reviews/expert-review-*.md)       │
│  - Persona selection                                 │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Kernel (Portable Contract)              │
│           .grok/skills/review/SKILL.md              │
│                                                      │
│  - Generic review structure                          │
│  - Behavioral rules                                  │
│  - Output format                                     │
└─────────────────────────────────────────────────────┘
```

### Kernels

Portable, project-agnostic contracts that define *what* a verb does:

| Kernel     | Purpose                              |
|------------|--------------------------------------|
| `review`   | Read-only critique of changes        |
| `ship`     | Controlled deployment workflow       |
| `incident` | Incident declaration and management  |
| `tidy`     | Mechanical, safe code cleanup        |

Kernels live in `.grok/skills/{verb}/SKILL.md`.

### Wrappers (Adapters)

Project-specific implementations that define *how* a verb applies to Confidence:

| Wrapper               | Wraps    | Slash Command    |
|-----------------------|----------|------------------|
| `expert-review`       | review   | `/expert-review` |
| `confidence-ship`     | ship     | —                |
| `confidence-incident` | incident | —                |
| `confidence-tidy`     | tidy     | —                |

Wrappers live in `.grok/skills/{wrapper-name}/SKILL.md`.

## Configuration

Runtime configuration lives in `agent/harness-select.json`:

```json
{
  "verbs": {
    "review": {
      "wrapper": "expert-review",
      "skill": ".grok/skills/expert-review",
      "kernel": ".grok/skills/review"
    }
  },
  "flags": {
    "default": ["software-architect", "security-engineer", "product-manager"]
  },
  "review_surfaces": ["law-5-25-ownership", "blood-type-honesty-ux", ...]
}
```

## Review Surfaces

The `/expert-review` command applies these Confidence-specific checklists:

| Surface                | What it checks                                    |
|------------------------|---------------------------------------------------|
| `law-5-25-ownership`   | Quebec Law 5/25 compliance, data residency        |
| `blood-type-honesty-ux`| Self-reported data UX, source/date visibility     |
| `french-first-copy`    | French-primary, English toggle                    |
| `doctor-handoff`       | Montrer/PDF/carte workflows                       |
| `incident-declare`     | Severity/commander/timeline, notify ≠ auto-send   |
| `mcp-consent-gate`     | Off-by-default, explicit consent required         |
| `welcome-boundary`     | No merge with Welcome app                         |

## Personas

Reviewer personas are defined in an external roster (see AGENTS.md for path).

The harness selects personas based on flags:
- **default**: software-architect, security-engineer, product-manager
- **platform**: platform-architect, security-engineer, software-architect

Custom personas can be added to `agent/personas/` for project-specific roles.

## Artifacts

Review artifacts are written to:
```
reviews/expert-review-YYYY-MM-DD-HHMMSS.md
```

This folder is tracked by git (via `.gitkeep`) but individual reviews may be gitignored depending on content.

## Why This Pattern?

1. **Portability**: Kernels can be shared across projects
2. **Customization**: Wrappers adapt behavior without forking kernels
3. **Consistency**: Same review structure, project-specific surfaces
4. **Separation**: Generic contracts vs domain-specific constraints

## UI Evidence Rule

UI pull requests: every PR that changes user-visible UI MUST attach before/after screenshots (or a short screen recording) sufficient for manual verify. No merge without them. Non-UI PRs are exempt; PR description must state `UI: none`. Review may flag missing shots; hard-veto UI merge without evidence.
