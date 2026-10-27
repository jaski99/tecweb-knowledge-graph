"""Contratto dei nodi e delle lezioni aggiunti nel round 2 dal worker X2."""
import json
import re
from urllib.parse import urlparse

import pytest

from kg import LESSONS, load_graph, topo_order


EXPECTED = {
    "architetture-mashup": {
        "area": 2, "gruppo": "A", "tipo": "concetto",
        "prerequisiti": {"rest-principi", "json-formato-dati", "architettura-3-tier"},
    },
    "sviluppo-event-driven": {
        "area": 2, "gruppo": "A", "tipo": "concetto",
        "prerequisiti": {"dom-virtual-dom", "eventi-locali-vs-remoti", "javascript-fetch-async-await"},
    },
    "html5-struttura-semantica": {
        "area": 3, "gruppo": "A", "tipo": "abilita",
        "prerequisiti": {"html-form-accessibilita"},
    },
    "react-componenti-jsx": {
        "area": 3, "gruppo": "A", "tipo": "abilita",
        "prerequisiti": {"dom-virtual-dom", "javascript-fetch-async-await", "json-formato-dati"},
    },
    "sensori-mobile-web": {
        "area": 3, "gruppo": "B", "tipo": "concetto",
        "prerequisiti": {"sviluppo-event-driven", "javascript-fetch-async-await"},
    },
    "python-base-web": {
        "area": 4, "gruppo": "A", "tipo": "abilita",
        "prerequisiti": {"json-formato-dati"},
    },
    "servizi-restful-flask": {
        "area": 4, "gruppo": "A", "tipo": "tipo_esercizio",
        "prerequisiti": {
            "flask-request-response", "rest-metodi-http", "json-formato-dati",
            "javascript-fetch-async-await", "codici-stato-http",
        },
    },
    "git-workflow-collaborativo": {
        "area": 4, "gruppo": "A", "tipo": "abilita",
        "prerequisiti": {"git-comandi-base"},
    },
}

CAMPI_V4 = {
    "perche_ti_serve", "scenario_fil_rouge", "definizione_esame", "spiegazione",
    "analogia", "worked_example", "completion_problem", "esercizio_autonomo",
    "errori_trappole", "richiamo_attivo", "riepilogo", "flashcard", "checklist",
}
MERMAID_START = re.compile(r"^(flowchart|graph|sequenceDiagram|stateDiagram(?:-v2)?|classDiagram|erDiagram|gitGraph)\b")
SENZA_ACCENTO = re.compile(r"\b(?:perche|puo|cosi|gia|piu|cioe)\b", re.I)
PUNTEGGI_INVENTATI = re.compile(r"(?:vale|valgono)\s+[^.]{0,24}?\bpunti\b|\d+\s*[-–]\s*\d+\s*punti\b", re.I)
HOST_AMMESSI = {
    "developer.mozilla.org", "react.dev", "docs.python.org",
    "flask.palletsprojects.com", "git-scm.com",
}

GRAPH = load_graph()
BY_ID = {node["id"]: node for node in GRAPH["nodi"]}


def _lesson(node_id):
    return json.loads((LESSONS / f"{node_id}.json").read_text(encoding="utf-8"))


def test_x2_ha_esattamente_gli_otto_nodi_contrattuali():
    x2_ids = {node["id"] for node in GRAPH["nodi"] if node.get("worker") == "X2"}
    assert x2_ids == set(EXPECTED)


@pytest.mark.parametrize("node_id", sorted(EXPECTED))
def test_identita_e_prerequisiti_contrattuali(node_id):
    expected = EXPECTED[node_id]
    record = BY_ID[node_id]
    assert (record["area"], record["gruppo"], record["tipo"], record["worker"]) == (
        expected["area"], expected["gruppo"], expected["tipo"], "X2"
    )
    assert {item["id"] for item in record["prerequisiti"]} == expected["prerequisiti"]
    assert {item["forza"] for item in record["prerequisiti"]} <= {"hard", "soft"}


def test_prerequisiti_x2_esistono_e_l_intero_grafo_non_ha_cicli():
    graph_ids = set(BY_ID)
    missing = [
        (node_id, item["id"])
        for node_id in EXPECTED
        for item in BY_ID[node_id]["prerequisiti"]
        if item["id"] not in graph_ids
    ]
    assert not missing
    order = topo_order(GRAPH["nodi"])
    positions = {node_id: index for index, node_id in enumerate(order)}
    for node_id in EXPECTED:
        for item in BY_ID[node_id]["prerequisiti"]:
            assert positions[item["id"]] < positions[node_id]


@pytest.mark.parametrize("node_id", sorted(EXPECTED))
def test_lezione_x2_ha_esattamente_i_tredici_campi_v4(node_id):
    lesson = _lesson(node_id)
    assert set(lesson) == CAMPI_V4
    assert 20 <= len(lesson["perche_ti_serve"]) <= 200
    assert "[F1]" in lesson["perche_ti_serve"]
    assert len(lesson["scenario_fil_rouge"]) >= 50
    definition = lesson["definizione_esame"]
    assert set(definition) == {"definizione", "scopo_vantaggio", "esempio"}
    assert all(len(definition[key]) >= 10 for key in definition)


@pytest.mark.parametrize("node_id", sorted(EXPECTED))
def test_spiegazione_e_fading_soddisfano_didattica(node_id):
    lesson = _lesson(node_id)
    explanation = lesson["spiegazione"]
    assert len(explanation) >= 1500
    assert len(re.findall(r"^#{2,3} ", explanation, re.M)) >= 3
    assert explanation.count("```") % 2 == 0
    mermaid_blocks = re.findall(r"^```mermaid\n(.*?)^```", explanation, re.S | re.M)
    assert mermaid_blocks and all(MERMAID_START.match(block.strip()) for block in mermaid_blocks)
    assert re.search(r"^\|[-: |]+\|$", explanation, re.M), "serve una tabella di contrasto"
    worked = lesson["worked_example"]
    assert len(worked["passi"]) >= 2 and len(worked["soluzione"]) >= 10
    completion = lesson["completion_problem"]
    assert completion["passi_mancanti"] and len(completion["soluzione"]) >= 10
    autonomous = lesson["esercizio_autonomo"]
    assert len(autonomous["testo"]) >= 20 and len(autonomous["soluzione_attesa"]) >= 10
    assert len(lesson["errori_trappole"]) >= 3
    assert all(item["distrattore"] for item in lesson["errori_trappole"])


@pytest.mark.parametrize("node_id", sorted(EXPECTED))
def test_richiamo_riepilogo_e_italiano_corretto(node_id):
    lesson = _lesson(node_id)
    recall = lesson["richiamo_attivo"]
    assert 3 <= len(recall["domande"]) <= 5
    assert len(recall["spiega_con_parole_tue"]) >= 20
    assert len(recall["collegamenti_interleaving"]) >= 1
    for connection in recall["collegamenti_interleaving"]:
        assert connection["nodo"] in BY_ID
        assert len(connection["collegamento"]) >= 20
    assert 40 <= len(lesson["riepilogo"]) <= 800
    assert lesson["flashcard"]["fronte"] and lesson["flashcard"]["retro"]
    assert lesson["checklist"]["so_fare"] and lesson["checklist"]["so_dire"]
    head_and_tail = " ".join((
        lesson["perche_ti_serve"], lesson["definizione_esame"]["definizione"], lesson["riepilogo"],
    ))
    assert not SENZA_ACCENTO.search(head_and_tail)
    assert "è" in lesson["definizione_esame"]["definizione"] or "è" in lesson["spiegazione"]


@pytest.mark.parametrize("node_id", sorted(EXPECTED))
def test_niente_punteggi_inventati_e_risorse_ammesse(node_id):
    assert not PUNTEGGI_INVENTATI.search(json.dumps(_lesson(node_id), ensure_ascii=False))
    for resource in BY_ID[node_id]["risorse"]:
        parsed = urlparse(resource["url"])
        assert parsed.scheme == "https"
        assert parsed.hostname in HOST_AMMESSI
        assert resource["verificato"] is True


def test_servizi_restful_flask_crea_e_consuma_tutti_i_metodi():
    text = json.dumps(_lesson("servizi-restful-flask"), ensure_ascii=False)
    for method in ("@app.get", "@app.post", "@app.put", "@app.patch", "@app.delete"):
        assert method in text
    for status in ("200", "201", "204", "400", "404"):
        assert status in text
    assert "jsonify" in text
    assert "fetch(" in text
    assert "JSON.stringify" in text


def test_sensori_indica_permessi_contesto_sicuro_e_alternativa():
    text = json.dumps(_lesson("sensori-mobile-web"), ensure_ascii=False).casefold()
    for word in ("geolocation", "permess", "contesto sicuro", "manuale"):
        assert word in text
