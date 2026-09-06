# incident — Kernel Verb

Portable incident management contract. Invoked by wrappers (e.g., `confidence-incident`).

## Purpose

Declare and manage incidents with structured severity, ownership, and timeline. Models the Grafana-style incident workflow: declare → assign → update → resolve.

## Contract

| Field           | Value                                |
|-----------------|--------------------------------------|
| Invocation      | Via wrapper skill (never direct)     |
| Mode            | Write (creates/updates incident log) |
| Output          | Incident artifact, timeline entries  |
| Scope           | Defined by wrapper's incident surfaces |

## Inputs (from wrapper)

- `severity_levels`: Available severity options (e.g., SEV1-SEV4)
- `roles`: Commander, comms lead, responders
- `notify_channels`: Where to draft notifications (does not auto-send)
- `incident_artifact`: Path pattern for incident logs
- `timeline_format`: How to structure timeline entries

## Incident Lifecycle

```
DECLARED → INVESTIGATING → IDENTIFIED → MITIGATED → RESOLVED
```

## Incident Structure

```markdown
# Incident: [title]

**Severity**: SEV[n]  
**Status**: [lifecycle state]  
**Commander**: [name]  
**Declared**: YYYY-MM-DD HH:MM

## Impact

[What is affected, who is affected]

## Timeline

| Time | Action | Owner |
|------|--------|-------|
| HH:MM | Incident declared | [name] |
| HH:MM | [update] | [name] |

## Root Cause

[To be filled after resolution]

## Action Items

- [ ] [Post-incident task]
```

## Behavioral Rules

1. Notify drafts a message; it does not send automatically
2. Severity determines urgency, not blame
3. Timeline is append-only during incident
4. Commander owns the incident until handoff or resolution
5. No PHI in incident artifacts (reference ticket IDs instead)
