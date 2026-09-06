# Persona Catalog

Generic reviewer personas available for harness selection. Persona definitions live in an external roster (see AGENTS.md for path).

## Available Roles

| Role                 | Focus Area                                    |
|----------------------|-----------------------------------------------|
| `software-architect` | System design, code structure, patterns       |
| `security-engineer`  | Vulnerabilities, auth, data protection        |
| `product-manager`    | User experience, requirements, scope          |
| `platform-architect` | Infrastructure, deployment, scalability       |

## Flag Sets

### default

Standard review team for most changes:
- software-architect
- security-engineer
- product-manager

### platform

For infrastructure and deployment changes:
- platform-architect
- security-engineer
- software-architect

## Custom Personas

Project-specific personas can be added to `agent/personas/`. See `agent/harness-select.json` for configuration.

## External Roster

Full persona definitions and additional roles are maintained externally. See AGENTS.md for the roster path.
