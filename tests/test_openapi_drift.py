import json
import os
from pathlib import Path

os.environ["HEALTH_TESTING"] = "1"

import main

SNAPSHOT = Path(__file__).resolve().parents[1] / "openapi.json"


def test_openapi_matches_committed_snapshot() -> None:
    expected = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    assert main.app.openapi() == expected
