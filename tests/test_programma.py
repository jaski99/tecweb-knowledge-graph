"""Contratti del programma INF-37 e delle priorità del round 2.

I nodi X2/X3 sono verificati nel catalogo, non richiesti nel grafo: potranno
arrivare nei loro part senza rendere questi test dipendenti dall'ordine dei merge.
"""
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re

import pytest

from kg import ROOT, load_parts, load_schema

DOCS = ROOT / "docs"
F1 = (
    "https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/"
    "insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022"
)
ORIGINAL_MATERIALE_SHA256 = "632ba026f6e1bba7be79cd17a902a4a5b286be3fab11908fa8dd9ae04e01b2a8"

# La tabella 1.1 mantiene invariati gruppo e livello degli altri 17 nodi.
UNCHANGED_A = {
    "http-protocollo-base", "http-stateless-vs-stateful", "tcp-ip-modello-livelli",
    "http-1-1-1-2-3-differenze", "uri-url-urn-differenze",
    "cookie-sessioni-gestione-stato", "codici-stato-http", "statico-vs-dinamico",
    "architettura-3-tier", "rest-principi", "rest-metodi-http", "codice-404-not-found",
    "api-design-best-practice", "html-form-accessibilita", "css-box-model",
    "css-origini-ereditarieta", "dom-virtual-dom",
}
PROMOTED_A = {
    "git-comandi-base", "flask-rotte-jsonify", "flask-request-response",
    "javascript-fetch-async-await", "ajax-fetch-xhr", "json-formato-dati",
    "tesina-progetto-flask-crud", "tesina-presentazione-8-minuti",
    "tesina-domande-revisione-codice", "tesina-esercitazione-guidata",
}
CONTEXT_B = {
    "eventi-locali-vs-remoti", "quic-protocollo", "multiplexing-http-2-3",
    "sqlite-crud", "quiz-form", "rate-limiting-sicurezza", "web-1-0-2-0-3-0-4-0",
}
OPTIONAL_C = {
    "web-semantico-rdf-owl", "sparql-query-esempi", "canvas-api",
    "dhtml-dynamic-html", "span-tag-uso", "motore-js-parser-ast-jit",
}
EXPECTED_PRIORITIES = {
    **{node_id: ("A", "alta") for node_id in UNCHANGED_A | PROMOTED_A},
    **{node_id: ("B", "media") for node_id in CONTEXT_B},
    **{node_id: ("C", "bassa") for node_id in OPTIONAL_C},
}


def read_doc(name):
    return (DOCS / name).read_text(encoding="utf-8")


def base_nodes():
    """Solo i sei part originari; i nuovi part sono di X2/X3."""
    parts = load_parts()
    return {
        node["id"]: node
        for area in range(1, 7)
        for node in parts[f"area-{area}.json"]
    }


def reference_links(text):
    return dict(re.findall(r"^\[(F\d+)\]: <([^>]+)>\s*$", text, flags=re.MULTILINE))


def markdown_rows(text):
    rows = {}
    for line in text.splitlines():
        match = re.match(r"^\| `([^`]+)` \|", line)
        if match:
            rows[match.group(1)] = [field.strip() for field in line.strip("|").split("|")]
    return rows


def prerequisite_ids(cell):
    return set(re.findall(r"`([^`]+)`", cell))


def test_syllabus_anagrafica_e_moduli():
    text = read_doc("SYLLABUS.md")
    for term in (
        "INF-37", "2026/27", "2024/25", "Laura Po", "Simone Calderara",
        "12 CFU", "108 ore", "6 CFU", "54 ore", "Moodle", "Python", "NumPy",
    ):
        assert term in text
    assert "I215-020" not in text
    assert "Django" not in text
    assert "non è un modulo opzionale" in text.lower()


@pytest.mark.parametrize("topic", [
    "URI", "HTTP/2", "mashup", "event-driven", "HTML5", "CSS", "JavaScript",
    "AJAX", "JSON", "React", "sensori", "Python", "Flask", "RESTful",
    "Git", "branching", "merge", "pull request", "supervisionato",
    "classificazione lineare", "bayesiano", "clustering", "regressione",
    "riduzione delle dimensioni", "NumPy",
])
def test_syllabus_copre_i_contenuti_ufficiali(topic):
    assert topic.casefold() in read_doc("SYLLABUS.md").casefold()


@pytest.mark.parametrize("name", ["SYLLABUS.md", "EXAM_FORMAT.md"])
def test_esame_tw_ia_e_lode(name):
    text = read_doc(name)
    for term in ("0–23", "0–10", "8 minuti", "ON/OFF", "media ponderata", "entrambi i moduli"):
        assert term.casefold() in text.casefold(), (name, term)
    for pattern in (r"senza appunti|non sono consentiti appunti", r"tre settimane", r"prove intermedie"):
        assert re.search(pattern, text, re.IGNORECASE), (name, pattern)
    assert re.search(r"lode in almeno uno", text, re.IGNORECASE)
    assert "tecnologie a libera scelta" in text.lower()
    assert "[F1]" in text


@pytest.mark.parametrize("name", ["SYLLABUS.md", "EXAM_FORMAT.md"])
@pytest.mark.parametrize("claim", ["2 ore", "4 slide"])
def test_durata_e_slide_sono_ipotesi(name, claim):
    lines = [line for line in read_doc(name).splitlines() if claim in line]
    assert lines, (name, claim)
    assert all("[IPOTESI]" in line for line in lines), (name, claim, lines)


def test_fonti_r3_sono_tutte_tracciate_senza_modificare_url():
    syllabus = read_doc("SYLLABUS.md")
    links = reference_links(syllabus)
    researched = reference_links(read_doc("research/R3-programma-esame.md"))
    assert set(links) == {f"F{i}" for i in range(1, 28)}
    assert links == researched
    assert links["F1"] == F1
    assert all(f"| [{label}] |" in syllabus for label in links)
    # Due riferimenti adiacenti verrebbero interpretati come un solo link Markdown.
    assert not re.search(r"\[F\d+\]\[F\d+\]", syllabus)
    assert "[FATTO]" in syllabus and "[IPOTESI]" in syllabus and "[NON TROVATO]" in syllabus


def test_meta_corso_e_nota_esame():
    meta = json.loads((ROOT / "graph/meta.json").read_text(encoding="utf-8"))
    assert meta["corso"]["docente"] == "Laura Po (modulo TW); Simone Calderara (titolare INF-37, modulo IA)"
    assert meta["corso"]["fonte_programma"] == F1
    assert "2024/25" in meta["corso"]["nota"]
    note = meta["nota_esame"]
    for term in ("[F1]", "0–23", "0–10", "8 minuti", "ON/OFF", "entrambi i moduli"):
        assert term in note
    assert "IPOTESI" in note and "2 ore" in note and "4 slide" in note
    assert "prove passate" not in note.lower()
    assert meta["trappole"] and all("[F1]" in trap["fonte"] for trap in meta["trappole"])
    assert all({"tema", "fonte", "trappola", "risposta"} <= set(trap) for trap in meta["trappole"])
    assert {"MDN", "RFC", "W3C", "FLASK", "GIT", "ECMA", "SQLITE", "PYTHON", "NUMPY", "SKLEARN", "REACT"} <= set(meta["testi"])


def test_solo_id_originari_nei_part_assegnati_a_x1():
    assert len(EXPECTED_PRIORITIES) == 40
    assert set(base_nodes()) == set(EXPECTED_PRIORITIES)


@pytest.mark.parametrize("node_id", sorted(EXPECTED_PRIORITIES))
def test_gruppo_priorita_e_motivazione_secondo_piano(node_id):
    node = base_nodes()[node_id]
    assert (node["gruppo"], node["priorita"]["livello"]) == EXPECTED_PRIORITIES[node_id]
    assert "[F1]" in node["priorita"]["motivazione"]
    assert "prove passate" not in node["priorita"]["motivazione"].lower()


def test_titolo_tesina_e_schema_documentale():
    assert base_nodes()["tesina-presentazione-8-minuti"]["title"] == "Tesina: presentazione PowerPoint (max 8 minuti)"
    properties = load_schema()["properties"]
    assert "[F1]" in properties["gruppo"]["description"]
    assert "frequenze" in properties["gruppo"]["description"]
    assert "punteggi per nodo" in properties["priorita"]["description"]
    assert properties["area"]["maximum"] == 7
    assert {f"X{i}" for i in range(1, 7)} <= set(properties["worker"]["enum"])


def test_nodi_presenti_documentati_con_gruppo_e_prerequisiti():
    text = read_doc("NODES.md").split("## Nodi pianificati", 1)[0]
    rows = markdown_rows(text)
    nodes = base_nodes()
    assert set(nodes) <= set(rows)
    for node_id, node in nodes.items():
        row = rows[node_id]
        assert row[2:5] == [node["gruppo"], node["priorita"]["livello"], node["tipo"]]
        for column, strength in ((5, "hard"), (6, "soft")):
            expected = {p["id"] for p in node["prerequisiti"] if p["forza"] == strength}
            assert prerequisite_ids(row[column]) == expected, (node_id, strength)
        assert row[7] == node["worker"]


def test_nodi_pianificati_contratto_e_stato():
    plan = read_doc("IMPROVEMENT_PLAN.md").split("### 1.2 Nuovi nodi", 1)[1].split("Campo `worker`", 1)[0]
    expected = markdown_rows(plan)
    assert len(expected) == 16
    assert Counter(row[7] for row in expected.values()) == {"X2": 8, "X3": 8}

    catalogue = read_doc("NODES.md")
    all_rows = markdown_rows(catalogue)
    available = {node["id"] for part in load_parts().values() for node in part}
    for node_id, source in expected.items():
        assert node_id in all_rows
        # Integrazione può spostare il nodo dalla tabella pianificata a quella
        # dei presenti; finché rimane pianificato verifichiamo l'intero contratto.
        row = all_rows[node_id]
        if len(row) == 9:
            assert row[2:6] == [source[1], source[2], source[3], source[4]]
            assert prerequisite_ids(row[6]) == prerequisite_ids(source[5])
            assert prerequisite_ids(row[7]) == prerequisite_ids(source[6])
            assert row[8] in {f"in arrivo {source[7]}", f"presente {source[7]}"}
        else:
            assert node_id in available


def test_conteggi_del_catalogo_per_la_baseline():
    nodes = list(base_nodes().values())
    assert Counter(node["gruppo"] for node in nodes) == {"A": 27, "B": 7, "C": 6}
    assert Counter(node["tipo"] for node in nodes) == {"concetto": 23, "abilita": 15, "tipo_esercizio": 2}
    assert sum(node["tempo_studio_min"] for node in nodes) == 1890
    # I conteggi testuali verranno aggiornati dall'integrazione quando arriveranno i nuovi nodi.
    if not any(name.endswith("-r2.json") or name == "area-7.json" for name in load_parts()):
        total_line = next(line for line in read_doc("NODES.md").splitlines() if line.startswith("| **Totale** |"))
        for value in ("**40**", "**27**", "**7**", "**6**", "**16**", "**56**", "31 h 30 min"):
            assert value in total_line


def test_testo_utente_originale_preservato():
    text = read_doc("MATERIALE_UTENTE.md")
    marker = "# Tecnologie Web — materiale dato dall'utente (24-25/10/2026)"
    assert text.startswith("> **Nota di contesto") and "[IPOTESI]" in text.split(marker, 1)[0]
    original = text[text.index(marker):].encode("utf-8")
    assert sha256(original).hexdigest() == ORIGINAL_MATERIALE_SHA256


def test_contratti_e_documenti_allineati():
    contracts = read_doc("CONTRACTS.md")
    for term in ("1–7", "area-N-r2.json", "area-2-r2.json", "X1", "X2", "X3", "X4", "X5", "X6", "QUIZ_FORMAT.md"):
        assert term in contracts
    assert "RFC 9110 definisce la semantica HTTP" in contracts
    assert "RFC 9112 definisce HTTP/1.1" in contracts
    assert "SCHEMA NON SICURO" in contracts
    assert "2024/25" in (ROOT / "README.md").read_text(encoding="utf-8")
    assert "2024/25" in read_doc("ARENA_PLAN.md")
    status = read_doc("STATUS.md")
    assert "2024/25" in status
    assert not re.search(r"\b(?:IdS|UML|GoF)\b", status)
