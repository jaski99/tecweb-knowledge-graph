"""Regressioni dell'integrazione I-2 e dei riferimenti alla presentazione."""

import json
import re
import subprocess

import pytest

from kg import ROOT, build, edges, topo_order


@pytest.fixture(scope="module")
def graph():
    return build()


@pytest.mark.parametrize(
    ("dependent", "prerequisite", "strength"),
    [
        ("flask-rotte-jsonify", "python-base-web", "hard"),
        ("tesina-progetto-flask-crud", "servizi-restful-flask", "soft"),
        ("tesina-progetto-flask-crud", "git-workflow-collaborativo", "soft"),
        ("ia-python-numpy-lab", "python-base-web", "soft"),
        ("sviluppo-event-driven", "eventi-locali-vs-remoti", "soft"),
    ],
)
def test_archi_i2_direzione_forza_e_ordine(graph, dependent, prerequisite, strength):
    nodes = {node["id"]: node for node in graph["nodi"]}
    matches = [p for p in nodes[dependent]["prerequisiti"] if p["id"] == prerequisite]
    assert len(matches) == 1
    assert matches[0]["forza"] == strength
    assert matches[0]["motivo"].strip()
    assert (prerequisite, dependent) in edges(graph["nodi"])
    order = topo_order(graph["nodi"])
    assert order.index(prerequisite) < order.index(dependent)


def test_presentazione_separa_fatto_ufficiale_e_ipotesi(graph):
    presentation = next(n for n in graph["nodi"] if n["id"] == "tesina-presentazione-8-minuti")
    fact, proposal = presentation["sapere"].split("[IPOTESI]", 1)
    assert "[FATTO]" in fact and "massimo 8 minuti" in fact and "[F1]" in fact
    assert "materiale utente" in proposal and "quattro slide" in proposal
    assert "1 + 2 + 3 + 2" in proposal and "non un requisito ufficiale" in proposal

    slide_skills = [text for text in presentation["saper_fare"] if "slide" in text.lower()]
    assert slide_skills and all("[IPOTESI]" in text for text in slide_skills)
    assert "materiale utente" in slide_skills[0]

    exercise = presentation["esercizi"][0]
    for field in ("tipo_esame", "testo", "soluzione"):
        assert exercise[field].startswith("[IPOTESI]"), field
    assert "materiale utente" in exercise["testo"]
    assert "materiale utente" in exercise["soluzione"]
    assert "massimo 8 minuti [F1]" in exercise["soluzione"]

    checklist = presentation["checklist_ripasso"]
    assert "PowerPoint: massimo 8 minuti [F1]" in checklist
    hypotheses = [text for text in checklist if re.search(r"quattro slide|4 slide|1 \+ 2 \+ 3 \+ 2", text, re.I)]
    assert len(hypotheses) == 2
    assert all(text.startswith("[IPOTESI]") and "materiale utente" in text for text in hypotheses)
    assert "8 minuti totali" not in checklist


def test_grafo_e_copia_web_sono_rigenerati_dalle_sorgenti(graph):
    generated = json.loads((ROOT / "graph/graph.json").read_text(encoding="utf-8"))
    assert generated == graph, "graph/graph.json non coincide con le sorgenti"
    # La copia web è ignorata da git: si può testare anche in un clone pulito.
    subprocess.run(["sh", str(ROOT / "web/build.sh")], cwd=ROOT, capture_output=True, check=True)
    web_graph = json.loads((ROOT / "web/graph.json").read_text(encoding="utf-8"))
    assert web_graph == graph, "web/graph.json non coincide con le sorgenti"
