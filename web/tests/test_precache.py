"""La versione della PWA dipende dai contenuti e dalla disponibilità di X6."""
import importlib.util
import json
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "scripts/genera_precache.py"


def leggi(path):
    text = path.read_text(encoding="utf-8")
    return json.loads(text.removeprefix("globalThis.__KG_BUILD__ = ").removesuffix(";\n"))


def test_precache_deterministica_e_rigenerazione(tmp_path, monkeypatch):
    spec = importlib.util.spec_from_file_location("precache_generator", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    monkeypatch.setattr(module, "WEB", tmp_path)
    for name in module.ROOT_FILES:
        (tmp_path / name).write_text(name, encoding="utf-8")
    (tmp_path / "js").mkdir()
    (tmp_path / "js/main.js").write_text("app", encoding="utf-8")
    module.genera()
    first = leggi(tmp_path / "precache.js")
    module.genera()
    assert leggi(tmp_path / "precache.js") == first
    assert "./graph.json" in first["files"] and first["esitiDisponibili"] is False
    (tmp_path / "graph.json").write_text("grafo aggiornato", encoding="utf-8")
    path_x6 = tmp_path / "modules/simulatore/esiti.js"
    path_x6.parent.mkdir(parents=True)
    path_x6.write_text("export function leggiEsiti() {}", encoding="utf-8")
    module.genera()
    second = leggi(tmp_path / "precache.js")
    assert second["versione"] != first["versione"]
    assert second["esitiDisponibili"] is True
    assert "./modules/simulatore/esiti.js" in second["files"]
