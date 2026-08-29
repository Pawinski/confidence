# Confidence

Patient-owned record for Quebec. See [PRODUCT.md](PRODUCT.md).

## Local (file)

```sh
open /Users/apawinski/dev/health/confidence.html
```

Rebuild after changing `static/`:

```sh
python3 scripts/build_wallet.py
```

## Production (home screen)

GitHub Pages publishes `static/` from `main`.

https://pawinski.github.io/confidence/

On iPhone: open that URL in **Safari** → Share → **Add to Home Screen**. Facts stay in the phone’s browser.

Do not deploy `uvicorn` / `.data/health.db` with real health facts.

## Agents (MCP)

Off until you set a password, unlock, and consent (every risk checked). Then:

1. Create a password in the app (10+ characters)
2. Unlock
3. Consent and download the agent pack
4. `python3 mcp_consent.py install ~/Downloads/confidence-agent-pack.json`
5. `python3 mcp_auth.py unlock`
6. Mint an agent token in the app (or `python3 mcp_auth.py mint`) and export it:

```sh
export CONFDENCE_AGENT_TOKEN='…paste once…'
```

7. Add to `~/.grok/config.toml` or this repo’s `.grok/config.toml`:

```toml
[mcp_servers.confidence]
command = "/Users/apawinski/dev/health/.venv/bin/python"
args = ["/Users/apawinski/dev/health/mcp_server.py"]

[mcp_servers.confidence.env]
CONFIDENCE_AGENT_TOKEN = "${CONFIDENCE_AGENT_TOKEN}"
```

> **Migration note:** If you had `CONFDENCE_AGENT_TOKEN` set, rename the env var to `CONFIDENCE_AGENT_TOKEN`. The server accepts either name during transition.

`python3 mcp_consent.py disable` turns the server back into a brick.

```sh
.venv/bin/python scripts/make_icons.py
.venv/bin/python scripts/build_wallet.py
.venv/bin/pytest -q
```
