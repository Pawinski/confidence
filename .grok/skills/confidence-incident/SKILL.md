# confidence-incident — Confidence Wrapper

Wraps kernel `incident` verb for Confidence incident management. Aligns to in-app **Déclarer un incident**.

## Wrapper Declaration

| Field           | Value                                     |
|-----------------|-------------------------------------------|
| Kernel          | `.grok/skills/incident`                   |
| In-app feature  | Déclarer un incident                      |
| Mode            | Write (creates incident artifact)         |

## Confidence Incident Context

The in-app incident feature (Déclarer un incident) follows Grafana-style incident management:
- Severity selection
- Commander assignment
- Timeline of notes and steps
- Notify opens Messages — does NOT send automatically

## Severity Levels

| Level | French          | Description                          |
|-------|-----------------|--------------------------------------|
| SEV1  | Critique        | Data integrity, security breach      |
| SEV2  | Majeur          | Core functionality unavailable       |
| SEV3  | Mineur          | Degraded but usable                  |
| SEV4  | Cosmétique      | Visual/minor issues                  |

## Roles

- **Commander (Commandant)**: Owns the incident until resolution
- **Comms Lead**: Drafts notifications (does not auto-send)
- **Responders**: Execute mitigation steps

## Incident Flow

```
Déclarer → Enquêter → Identifier → Atténuer → Résoudre
```

1. **Déclarer**: Select severity, assign commander
2. **Enquêter**: Add timeline entries
3. **Identifier**: Document root cause
4. **Atténuer**: Apply fix
5. **Résoudre**: Close incident, create follow-up tasks

## Notify Behavior

**Critical**: Notify opens Messages/mail composer. It does NOT auto-send.

The user must:
1. Review the drafted message
2. Choose recipients
3. Manually send

This prevents accidental disclosure of health-related incidents.

## Incident Artifact

Timeline and notes stored locally in browser (like other Confidence data).
Agent-accessible incident logs must NOT contain:
- Patient names or identifiers
- NAM/RAMQ numbers
- Actual health data

Reference ticket/incident IDs only.
