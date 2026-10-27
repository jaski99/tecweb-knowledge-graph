"""La CI deve controllare i dati versionati senza rigenerarli prima del check."""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]


def test_pages_controlla_prima_di_preparare_il_sito_e_dei_test():
    workflow = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
    check = workflow.index("run: python scripts/kg.py check")
    build_web = workflow.index("run: sh web/build.sh")
    node = workflow.index("npm test --prefix web")
    pytest = workflow.index("pytest -q --tb=short")
    assert check < build_web < node < pytest
    assert workflow.count("sh web/build.sh") == 1
    assert "scripts/kg.py build" not in workflow
    assert "scripts/gen_docs.py build" not in workflow


def test_check_rileva_grafo_obsoleto_senza_modificarlo(tmp_path):
    shutil.copytree(ROOT / "graph", tmp_path / "graph")
    (tmp_path / "scripts").mkdir()
    shutil.copy2(ROOT / "scripts/kg.py", tmp_path / "scripts/kg.py")
    graph = tmp_path / "graph/graph.json"
    with graph.open("a", encoding="utf-8") as out:
        out.write(" ")
    stale = graph.read_bytes()
    result = subprocess.run([sys.executable, str(tmp_path / "scripts/kg.py"), "check"],
                            text=True, capture_output=True, check=False)
    assert result.returncode != 0
    assert "NON aggiornato" in result.stdout
    assert graph.read_bytes() == stale
