# Confidence Agent Context

Source of truth: [PRODUCT.md](../PRODUCT.md)

## Critical Constraints

1. **Do not commit personal health data** — no patient samples, no NAM/RAMQ numbers, no blood values in git.
2. **Do not merge with Welcome** — maternity/birthing is a separate app at a separate path.
3. **MCP is off by default** — consent gate requires explicit user action.

## Project Scope

Confidence is a Quebec patient-owned health record. The patient holds the facts and hands them to a doctor on purpose, for a limited time.

Read PRODUCT.md for:
- What this is (and is not)
- Why Quebec
- First slice features
- Risks that must not be sanded off
- MCP/agent constraints
