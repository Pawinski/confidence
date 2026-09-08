# tidy — Kernel Verb

Portable code cleanup/organization contract. Invoked by wrappers (e.g., `confidence-tidy`).

## Purpose

Perform mechanical, low-risk cleanups: formatting, import sorting, dead code removal, documentation sync. Does not change behavior.

## Contract

| Field           | Value                                |
|-----------------|--------------------------------------|
| Invocation      | Via wrapper skill (never direct)     |
| Mode            | Write (safe mutations only)          |
| Output          | Clean commits, optional report       |
| Scope           | Defined by wrapper's tidy checklist  |

## Inputs (from wrapper)

- `tidy_tasks`: Which cleanup operations to perform
- `exclude_paths`: Files/patterns to skip
- `commit_style`: How to structure tidy commits
- `verify_no_behavior_change`: Whether to run tests after

## Tidy Operations

| Task              | Description                          |
|-------------------|--------------------------------------|
| `format`          | Apply project formatter              |
| `imports`         | Sort/organize imports                |
| `dead-code`       | Remove unused variables/functions    |
| `trailing`        | Remove trailing whitespace           |
| `doc-sync`        | Update stale doc references          |
| `deps`            | Remove unused dependencies           |

## Tidy Workflow

1. **Audit**
   - List files needing cleanup
   - Estimate scope of changes

2. **Apply**
   - Run tidy operations in order
   - Group related changes

3. **Verify**
   - Ensure tests still pass
   - Confirm no behavior change

4. **Commit**
   - One commit per tidy category (or single batch)
   - Message format: `tidy: [category]`

## Behavioral Rules

1. Never change application logic
2. Skip files in exclude_paths
3. Run tests before and after (if configured)
4. Separate tidy commits from feature commits
5. Do not tidy generated files unless explicitly told
