# review — Kernel Verb

Portable read-only critique contract. Invoked by wrappers (e.g., `expert-review`).

## Purpose

Generate a formal design/architecture review of code, config, or documentation changes. The review produces a structured artifact for human consumption.

## Contract

| Field           | Value                                |
|-----------------|--------------------------------------|
| Invocation      | Via wrapper skill (never direct)     |
| Mode            | Read-only (no file modifications)    |
| Output          | Markdown artifact (path set by wrapper) |
| Scope           | Defined by wrapper's surface checklist |

## Inputs (from wrapper)

- `surfaces`: List of review surfaces/checklists to apply
- `context`: Files to read for project context
- `personas`: Reviewer personas to adopt
- `artifact_pattern`: Where to write the review

## Output Structure

```markdown
# Review: [subject]

**Date**: YYYY-MM-DD  
**Reviewer personas**: [list]  
**Scope**: [surfaces checked]

## Summary

[One-paragraph summary of findings]

## Findings by Surface

### [Surface Name]
- [Finding 1]
- [Finding 2]

## Recommendations

1. [Prioritized recommendation]

## Sign-off

[Persona opinions and consensus]
```

## Behavioral Rules

1. Do not modify source files
2. Do not commit or push
3. Cite specific line numbers when referencing code
4. Flag blockers vs. suggestions clearly
5. Respect wrapper-defined scope boundaries
