# ship — Kernel Verb

Portable shipping/deployment contract. Invoked by wrappers (e.g., `confidence-ship`).

## Purpose

Execute a controlled ship workflow: pre-flight checks, version bump, changelog, tag, and deployment trigger. Wrapper defines what "ship" means for the specific project.

## Contract

| Field           | Value                                |
|-----------------|--------------------------------------|
| Invocation      | Via wrapper skill (never direct)     |
| Mode            | Write (controlled mutations)         |
| Output          | Changelog entry, tag, deployment     |
| Scope           | Defined by wrapper's ship checklist  |

## Inputs (from wrapper)

- `preflight_checks`: List of checks to pass before shipping
- `version_strategy`: How to bump version (semver, date, etc.)
- `changelog_path`: Where to append release notes
- `deploy_trigger`: What action triggers deployment
- `rollback_plan`: How to revert if needed

## Ship Workflow

1. **Preflight**
   - Run test suite
   - Check linter
   - Verify no uncommitted changes
   - Validate version bump is appropriate

2. **Prepare**
   - Update version in manifest/config
   - Generate changelog entry from commits
   - Create annotated tag

3. **Ship**
   - Push tag
   - Trigger deployment (CI, manual, or none)
   - Record ship in artifact log

4. **Verify**
   - Confirm deployment health (if applicable)
   - Document rollback command

## Behavioral Rules

1. Never ship with failing tests
2. Always create a tag before deploying
3. Changelog entries must be human-readable
4. Wrapper defines what constitutes "deployed"
5. No PHI/secrets in commit messages or changelogs
