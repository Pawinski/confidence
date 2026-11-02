import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
JS = ROOT / "static" / "js"


def _flags(record: dict) -> list:
    node = shutil.which("node")
    if not node:
        pytest.skip("node not installed")
    script = (
        "global.window = {};"
        f"eval(require('fs').readFileSync({json.dumps(str(JS / 'common-allergens.js'))}, 'utf8'));"
        f"process.stdout.write(JSON.stringify(window.findAllergenFlags({json.dumps(record)})));"
    )
    return json.loads(subprocess.run([node, "-e", script], check=True, capture_output=True, text=True).stdout)


def test_flag_when_allergen_only_in_medications() -> None:
    record = {"allergies": [], "medications": [{"name": "Sample Penicilline 500"}], "conditions": []}
    assert _flags(record) == ["pénicilline"]


def test_flag_from_conditions_text() -> None:
    record = {"allergies": [], "medications": [], "conditions": [{"name": "Rash", "detail": "after LATEX gloves"}]}
    assert _flags(record) == ["latex"]


def test_no_flag_when_already_listed() -> None:
    record = {
        "allergies": [{"name": "Penicillin", "severity": "moderate"}],
        "medications": [{"name": "pénicilline"}],
        "conditions": [],
    }
    assert _flags(record) == []


def test_no_flag_for_partial_word_or_empty() -> None:
    assert _flags({"medications": [{"name": "Aspirinate-free sample"}]}) == []
    assert _flags({}) == []


def test_strings_and_no_questions() -> None:
    copy = (JS / "copy.js").read_text(encoding="utf-8")
    assert 'possibleAllergy: "Allergie possible :"' in copy
    assert 'possibleAllergy: "Possible allergy:"' in copy
    app = (JS / "app.js").read_text(encoding="utf-8")
    flag_fn = app.split("function renderAllergenFlags", 1)[1].split("\n  }\n", 1)[0]
    module = (JS / "common-allergens.js").read_text(encoding="utf-8")
    for src in (flag_fn, module):
        for banned in ("confirm(", "prompt(", "alert(", "showModal(", "<dialog"):
            assert banned not in src
    html = (ROOT / "static" / "index.html").read_text(encoding="utf-8")
    assert 'src="js/common-allergens.js"' in html
    assert "common-allergens.js" in (ROOT / "static" / "sw.js").read_text(encoding="utf-8")
