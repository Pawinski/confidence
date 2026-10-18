# Program design: Confidence

Human readability comes first. Every rule below serves it.

## Organizing code

- Group code by logic first, then split each group by logic.
- Name every file and folder for what it holds.
- Aim for about 150 lines per file. This is a guideline, not a limit: keep a coherent unit whole even if it runs longer.
- Load order comes from an index or entry file that imports by name. Never encode order in file names.

## Naming

- No numbered or lettered files or folders (no `01-`, `a/`, `b/`, `step2`).
- No acronyms or abbreviations in any name: files, folders, classes, variables, functions, components. Write the full words (`authentication`, not `auth`; `internationalization`, not `i18n`).

## Exemptions

These names stay as they are:

- Names a tool or platform requires: `AGENTS.md`, `README.md`, `Dockerfile`, `package.json`, `tsconfig.json`, `app.json`, `pytest.ini`, `requirements.txt`, and similar.
- Everything under `.github/` and `.grok/`.
- `index` entry files.
- Icon file names that carry a pixel size (for example `icon-192.png`).
- The `src/` and `docs/` folder names.

## Existing code

Old names are renamed when someone works in that area, in a separate rename PR. No big-bang renames. Known names to change when touched: `mcp_*` modules and `static/js/mcp.js`, `tests/test_mcp.py`, `tests/test_pwa.py`, `mobile/src/i18n/`, `static/css/`, `static/js/`, `static/sw.js`, `auth` (`mcp_auth.py`, `static/js/auth.js`), and `mobile/App.tsx`.
