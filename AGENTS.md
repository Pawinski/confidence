# Agent instructions — Confidence

Read [PRODUCT.md](PRODUCT.md) before writing code.
Read [docs/PROGRAM_DESIGN.md](docs/PROGRAM_DESIGN.md) for file layout and naming rules.

## UI Evidence Rule

UI pull requests: every PR that changes user-visible UI MUST attach before/after screenshots (or a short screen recording) sufficient for manual verify. No merge without them. Non-UI PRs are exempt; PR description must state `UI: none`. Review may flag missing shots; hard-veto UI merge without evidence.

## Boundaries

- This folder only. Do not merge with Welcome.
- No PHI in git (no patient samples, no NAM, no blood values).

## Personas

Need a designer / architect / etc.: see the personas roster, then the matching file.

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

## Pull requests

### Size and names

Alexander's rules (19 Nov 2026). They apply to every Confidence PR:

1. **Size.** About 500 changed lines max for anything Alexander reviews. Protected-path changes go in small, isolated PRs. If a PR would go over, split it before opening. Check size with `git diff --shortstat origin/main...HEAD`.
2. **Moves and renames.** Code moves stay verbatim. Renames go in their own PR. All renames for one effort can be one PR, with an old-to-new name table in the body.
3. **Descriptive names only.** No single-letter variables, abbreviations, or acronyms in code or file names. Exception: `i`, `j`, and `k` are allowed as indexes in plain counting loops only (Alexander, 19 Nov 2026). This extends the 18 Oct code-org rule: readability beats the ~150-line target; group and split by logic; name each file for what it holds; no numbered or lettered files.
4. **Bad names.** Need not be fixed on sight, but they must be planned and listed in the PR body or plan so Alexander is told.
5. **Lead check.** Before a PR goes to Alexander, the lead checks the changed-line total and runs a naming scan. If either fails, it goes back to the builder, not to him. The PR body carries a Size line and a Names line.

### Code in strings

No code inside strings that get executed (Alexander, 12 Nov 2026). Banned: `eval`, `window.eval`, `new Function`, `vm.runIn*`, `setTimeout` with a string, and `node -e`, `python -c`, or `bash -c` (including heredoc scripts) that carry logic. Code lives in real files, and test stubs are real functions. Exception: Playwright `page.evaluate` and `add_init_script` are allowed.

### Descriptions

PR descriptions follow the pr-description-standard skill: TL;DR, Filed by, Why, What changed, Deleted / simplified, Proof, Risk and veto, Cost, plus Size and Names lines.
