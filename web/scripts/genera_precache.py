"""Genera un inventario deterministico per app e service worker, dopo la copia dei dati."""
from hashlib import sha256
import json
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
ROOT_FILES = ["index.html", "sw.js", "manifest.webmanifest", "favicon.svg", "graph.json", "quiz.json"]
EXTENSIONS = {".js", ".mjs", ".css", ".png", ".svg"}


def genera():
    paths = [WEB / name for name in ROOT_FILES]
    for directory in ("js", "modules", "css", "vendor", "icons"):
        paths.extend(p for p in (WEB / directory).rglob("*") if p.is_file() and p.suffix in EXTENSIONS)
    paths = sorted(set(paths), key=lambda p: p.relative_to(WEB).as_posix())
    digest = sha256()
    for path in paths:
        name = path.relative_to(WEB).as_posix()
        digest.update(name.encode("utf-8") + b"\0" + path.read_bytes() + b"\0")
    files = ["./"] + ["./" + p.relative_to(WEB).as_posix() for p in paths] + ["./precache.js"]
    build = {"versione": digest.hexdigest()[:20], "files": files,
             "esitiDisponibili": (WEB / "modules/simulatore/esiti.js").is_file()}
    (WEB / "precache.js").write_text("globalThis.__KG_BUILD__ = " + json.dumps(build, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"precache {build['versione']}: {len(files)} risorse")


if __name__ == "__main__":
    genera()
