from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "static"


def test_manifest_is_standalone_shell() -> None:
    manifest = (STATIC / "manifest.json").read_text(encoding="utf-8")
    assert '"display": "standalone"' in manifest
    assert '"start_url": "./"' in manifest
    assert "Confidence" in manifest
    assert "icon-192.png" in manifest


def test_service_worker_is_shell_only() -> None:
    sw = (STATIC / "sw.js").read_text(encoding="utf-8")
    assert "localStorage" in sw
    assert "never" in sw.lower() or "never in this cache" in sw
    assert "addAll" in sw
    assert "./index.html" in sw
    assert "/api/" not in sw


def test_index_registers_pwa() -> None:
    html = (STATIC / "index.html").read_text(encoding="utf-8")
    css = (STATIC / "css" / "app.css").read_text(encoding="utf-8")
    app = (STATIC / "js" / "app.js").read_text(encoding="utf-8")
    assert 'rel="manifest"' in html
    assert "apple-touch-icon" in html
    assert 'name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"' in html
    assert 'name="apple-mobile-web-app-status-bar-style" content="black-translucent"' in html
    assert "max(12px, env(safe-area-inset-top))" in css
    assert "serviceWorker" in app
    assert 'register("sw.js")' in app
    assert "https:" in app


def test_airdrop_build_strips_pwa_links(tmp_path: Path, monkeypatch) -> None:
    spec_path = ROOT / "scripts" / "build_wallet.py"
    import importlib.util

    spec = importlib.util.spec_from_file_location("build_wallet", spec_path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    out = tmp_path / "confidence.html"
    monkeypatch.setattr(mod, "OUT", out)
    mod.main()
    html = out.read_text(encoding="utf-8")
    assert "manifest.json" not in html
    assert "serviceWorker" in html


def test_doctor_card_buttons_do_not_cover_sections() -> None:
    css = (STATIC / "css" / "app.css").read_text(encoding="utf-8")
    actions = css.split(".hold-actions {", 1)[1].split("}", 1)[0]
    sheet = css.split(".hold-sheet {", 1)[1].split("}", 1)[0]
    assert "position: sticky" not in actions
    assert "position: static" in actions
    assert "overflow: auto" in sheet
