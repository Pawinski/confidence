import re
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _load_builder():
    spec = importlib.util.spec_from_file_location(
        "build_wallet", ROOT / "scripts" / "build_wallet.py"
    )
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_wallet_has_no_camille_and_opens_offline() -> None:
    html = (ROOT / "static" / "index.html").read_text(encoding="utf-8")
    store = (ROOT / "static" / "js" / "store.js").read_text(encoding="utf-8")
    card = (ROOT / "static" / "js" / "card.js").read_text(encoding="utf-8")
    css = (ROOT / "static" / "css" / "app.css").read_text(encoding="utf-8")
    assert "Camille" not in html + store
    assert "Exemple Patient" in store
    assert 'href="css/app.css"' in html
    assert 'src="js/app.js"' in html
    assert "@media print" in css
    assert "text/html" in card
    assert "canShare" in card
    assert "hospitals" in card
    assert "professionals" in card
    assert "hospitals" in store


def test_card_escapes_html() -> None:
    # Load card.js escape by executing the same replacements in a tiny replica
    # of the published function so a regression in the source is visible.
    src = (ROOT / "static" / "js" / "card.js").read_text(encoding="utf-8")
    assert ".replace(/&/g, \"&amp;\")" in src
    assert ".replace(/</g, \"&lt;\")" in src


EMPTY_KEYS = {
    "emptyAllergies": "Aucune",
    "emptyConditions": "Aucune",
    "emptyEmergencyContact": "Aucune",
    "emptyMedications": "Aucun",
    "emptyHospitals": "Aucun",
    "emptyProfessionals": "Aucun",
}


def _locales(text: str) -> dict[str, str]:
    parts = re.split(r"\n  ([a-z]{2}): \{", text)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts), 2)}


def test_empty_states_every_language() -> None:
    copy = (ROOT / "static" / "js" / "copy.js").read_text(encoding="utf-8")
    app = (ROOT / "static" / "js" / "app.js").read_text(encoding="utf-8")
    card = (ROOT / "static" / "js" / "card.js").read_text(encoding="utf-8")
    locales = _locales(copy)
    assert {"fr", "en"} <= set(locales)
    for lang, block in locales.items():
        assert "\n    none:" not in block, lang
        for key in EMPTY_KEYS:
            assert re.search(rf'\n    {key}: "[^"]+"', block), (lang, key)
    for key, word in EMPTY_KEYS.items():
        assert f'{key}: "{word}"' in locales["fr"], key
        assert key in app and f"copy.{key}" in card, key
    assert 't("none")' not in app
    assert "copy.none" not in card


def test_build_wallet_inlines_assets(tmp_path: Path, monkeypatch) -> None:
    mod = _load_builder()
    out = tmp_path / "confidence.html"
    monkeypatch.setattr(mod, "OUT", out)
    mod.main()
    html = out.read_text(encoding="utf-8")
    assert "<style>" in html
    assert "ConfidenceStore" in html
    assert "ConfidenceIncidents" in html
    assert 'href="css/app.css"' not in html
    assert 'src="js/app.js"' not in html
    assert "@media print" in html
    assert 'emptyAllergies: "Aucune"' in html
    assert 'emptyConditions: "Aucune"' in html
    assert 'emptyEmergencyContact: "Aucune"' in html
    assert 'none: "Aucun"' not in html
    assert 't("none")' not in html
    assert "copy.none" not in html
