"""Contratto X3: lezioni IA, carte di ripasso ed esempi NumPy eseguibili.

I link sono controllati offline contro l'insieme delle pagine consultate; la
verifica HTTP effettiva è distinta ed è svolta con scripts/check_urls.py.
I cinque richiami chiusi e la flashcard v4 diventano sei carte distinte nel
mazzo SM-2 reale, senza cambiare lo schema che prevede una sola flashcard.
"""

import contextlib
import io
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urlsplit

import numpy as np
import pytest
from jsonschema import Draft202012Validator

from kg import build, load_lessons, load_parts, load_schema, topo_order


ROOT = Path(__file__).resolve().parent.parent
INTRO = "ia-introduzione-apprendimento"
LAB = "ia-python-numpy-lab"
CLASS = "ia-supervisionato-classificazione-lineare"
BAYES = "ia-bayes-apprendimento-statistico"
CLUSTER = "ia-clustering-non-supervisionato"
REGRESSION = "ia-regressione"
PCA = "ia-riduzione-dimensionalita"
EXAM = "ia-esame-quiz-lab-lode"

# Contratto dei prerequisiti della tabella 1.2, inclusa la forza di ogni arco.
CONTRACT = {
    INTRO: ("concetto", {}),
    LAB: ("abilita", {}),
    CLASS: ("concetto", {INTRO: "hard", LAB: "soft"}),
    BAYES: ("concetto", {CLASS: "hard"}),
    CLUSTER: ("concetto", {INTRO: "hard", LAB: "soft"}),
    REGRESSION: ("concetto", {CLASS: "hard", LAB: "soft"}),
    PCA: ("concetto", {INTRO: "hard", LAB: "soft"}),
    EXAM: ("tipo_esercizio", {CLASS: "hard", CLUSTER: "hard", REGRESSION: "soft", BAYES: "soft", PCA: "soft"}),
}
LESSON_FIELDS = {
    "perche_ti_serve", "scenario_fil_rouge", "definizione_esame", "spiegazione",
    "analogia", "worked_example", "completion_problem", "esercizio_autonomo",
    "errori_trappole", "richiamo_attivo", "riepilogo", "flashcard", "checklist",
}
# URL canonici delle pagine ufficiali effettivamente aperte per questa area.
CONSULTED_URLS = {
    "https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022",
    "https://scikit-learn.org/stable/user_guide.html",
    "https://scikit-learn.org/stable/common_pitfalls.html",
    "https://scikit-learn.org/stable/modules/model_evaluation.html",
    "https://scikit-learn.org/stable/modules/linear_model.html",
    "https://scikit-learn.org/stable/modules/naive_bayes.html",
    "https://scikit-learn.org/stable/modules/clustering.html",
    "https://scikit-learn.org/stable/modules/decomposition.html",
    "https://numpy.org/doc/stable/user/quickstart.html",
    "https://numpy.org/doc/stable/user/basics.broadcasting.html",
    "https://docs.python.org/3/tutorial/",
}
NODE_LINE = r'[A-Za-z][A-Za-z0-9]*(?:\["[^"\n<>]+"\])?'
EDGE = re.compile(rf"^\s*({NODE_LINE})\s+-->\s+({NODE_LINE})\s*$")
NODE = re.compile(r'^([A-Za-z][A-Za-z0-9]*)(?:\["([^"\n<>]+)"\])?$')
FENCE = re.compile(r"^```([^\n]*)\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)
ACCENTS = re.compile(r"\b(?:perche|piu|gia|puo|cosi)\b|\be'(?=\s|$)", re.IGNORECASE)


@pytest.fixture(scope="module")
def area_nodes():
    return {node["id"]: node for node in load_parts()["area-7.json"]}


@pytest.fixture(scope="module")
def lessons():
    all_lessons = load_lessons()
    return {node_id: all_lessons[node_id] for node_id in CONTRACT}


def strings(value):
    """Attraversa solo i valori testuali, non i nomi dei campi JSON."""
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)


def fenced_blocks(value, language):
    return [body for text in strings(value) for lang, body in FENCE.findall(text)
            if lang.strip().lower() == language]


def run_python_snippets(worked_example):
    """Esegue ogni blocco Python indipendente con NumPy effettivamente installato."""
    snippets = fenced_blocks(worked_example, "python") + fenced_blocks(worked_example, "py")
    assert snippets, "Manca il codice Python nell'esempio svolto"
    scopes = []
    for index, snippet in enumerate(snippets):
        scope = {"__name__": "__main__"}
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compile(snippet, f"<worked-example-{index}>", "exec"), scope)
        # Non accettiamo un esempio che non usi NumPy davvero.
        assert scope.get("np") is np
        scopes.append(scope)
    return scopes


def test_esattamente_nodi_e_file_assegnati(area_nodes):
    paths = {p.stem for p in (ROOT / "graph" / "lezioni").glob("ia-*.json")}
    assert set(area_nodes) == set(CONTRACT) == paths
    assert len(load_parts()["area-7.json"]) == len(CONTRACT)


@pytest.mark.parametrize("node_id", CONTRACT)
def test_schema_e_prerequisiti(node_id, area_nodes, lessons):
    node = area_nodes[node_id]
    expected_kind, expected_pre = CONTRACT[node_id]
    assert (node["area"], node["gruppo"], node["tipo"], node["worker"]) == (7, "A", expected_kind, "X3")
    pre = node["prerequisiti"]
    assert len(pre) == len(expected_pre)
    assert {p["id"]: p["forza"] for p in pre} == expected_pre
    assert all(len(p["motivo"]) >= 5 for p in pre)
    assert node["priorita"]["livello"] == "alta"
    assert "[F1]" in node["priorita"]["motivazione"]
    assert "stima" in node["priorita"]["motivazione"].lower()
    assert "lezione" not in node
    assert not list(Draft202012Validator(load_schema()).iter_errors({**node, "lezione": lessons[node_id]}))


def test_prerequisiti_esistenti_e_grafo_aciclico(area_nodes):
    graph = build()
    ids = {node["id"] for node in graph["nodi"]}
    assert set(area_nodes) <= ids
    order = topo_order(graph["nodi"])
    position = {node_id: index for index, node_id in enumerate(order)}
    for node in area_nodes.values():
        for pre in node["prerequisiti"]:
            assert pre["id"] in ids
            assert position[pre["id"]] < position[node["id"]]


@pytest.mark.parametrize("node_id", CONTRACT)
def test_tutti_i_campi_didattici_e_fonti(node_id, lessons):
    lesson = lessons[node_id]
    assert set(lesson) == LESSON_FIELDS
    assert 20 <= len(lesson["perche_ti_serve"]) <= 200
    assert len(lesson["scenario_fil_rouge"]) >= 50
    assert "biblioteca" in lesson["scenario_fil_rouge"].lower()
    assert len(lesson["spiegazione"]) >= 1500
    assert len(re.findall(r"^#{2,3} ", lesson["spiegazione"], re.MULTILINE)) >= 2
    assert lesson["spiegazione"].startswith("Prerequisiti:")
    assert "[F1]" in lesson["spiegazione"]
    assert "[F12]" in lesson["spiegazione"]
    assert re.search(r"non (?:deriva|dalle|sulle)", lesson["spiegazione"], re.IGNORECASE)
    assert "slide" in lesson["spiegazione"].lower()
    assert len(lesson["worked_example"]["passi"]) >= 2
    assert lesson["completion_problem"]["passi_mancanti"]
    assert lesson["esercizio_autonomo"]["soluzione_attesa"]
    assert len(lesson["errori_trappole"]) >= 2
    assert len(lesson["riepilogo"].splitlines()) <= 5
    assert lesson["checklist"]["so_fare"] and lesson["checklist"]["so_dire"]
    ids = set(CONTRACT) | {n["id"] for n in build()["nodi"]}
    for link in lesson["richiamo_attivo"]["collegamenti_interleaving"]:
        assert link["nodo"] in ids
        assert len(link["collegamento"]) >= 20


@pytest.mark.parametrize("node_id", CONTRACT)
def test_mermaid_usa_un_sottoinsieme_sintattico_valido(node_id, lessons):
    """Controlla integralmente i flowchart usati, non solo la parola iniziale.

    Il sottoinsieme accettato è: flowchart LR e archi fra ID con etichette
    dichiarate una volta o ripetute coerentemente, senza markup nelle etichette.
    """
    explanation = lessons[node_id]["spiegazione"]
    assert explanation.count("```") % 2 == 0
    diagrams = fenced_blocks(explanation, "mermaid")
    assert diagrams
    for diagram in diagrams:
        lines = [line.strip() for line in diagram.splitlines() if line.strip()]
        assert lines[0] == "flowchart LR"
        labels = {}
        referenced = set()
        assert len(lines) > 1
        for line in lines[1:]:
            match = EDGE.fullmatch(line)
            assert match, f"Arco Mermaid non valido: {line}"
            for side in match.groups():
                parsed = NODE.fullmatch(side)
                assert parsed
                node_name, label = parsed.groups()
                referenced.add(node_name)
                if label is not None:
                    assert node_name not in labels or labels[node_name] == label
                    labels[node_name] = label
        assert referenced == set(labels), "Ogni nodo del diagramma deve avere un'etichetta"


@pytest.mark.parametrize("node_id", CONTRACT)
def test_accenti_e_assenza_di_punteggi_inventati(node_id, area_nodes, lessons):
    # Numeri nei dataset fittizi sono consentiti; non sono punteggi d'esame.
    text = "\n".join(strings(area_nodes[node_id])) + "\n" + "\n".join(strings(lessons[node_id]))
    assert not ACCENTS.search(text)
    assert not any(bad in text for bad in ("Ã", "â€™", "�"))
    assert not re.search(r"\b\d+\s*(?:punti|punt[oio]|/\s*30)\b", text, re.IGNORECASE)
    assert "[F1]" in text


def test_esame_solo_fatti_f1_senza_numeri_non_documentati(lessons):
    exam = "\n".join(strings(lessons[EXAM]))
    without_citations = re.sub(r"\[F(?:1|12)\]", "", exam)
    # L'unico voto numerico usato negli esempi è il 30 della regola di [F1].
    assert set(re.findall(r"\d+", without_citations)) == {"30"}
    for phrase in ("trentesimi", "ON/OFF", "media ponderata", "per eccesso", "almeno uno"):
        assert phrase.lower() in exam.lower()
    assert "non" in exam.lower() and "numero di domande" in exam.lower()
    assert "durata" in exam.lower()


@pytest.mark.parametrize("node_id", CONTRACT)
def test_risorse_e_riferimenti_consultati(node_id, area_nodes):
    node = area_nodes[node_id]
    assert node["risorse"]
    for resource in node["risorse"]:
        url = resource["url"]
        assert resource["verificato"] is True
        assert url in CONSULTED_URLS
        assert urlsplit(url).scheme == "https"
        assert resource["titolo"].strip()
    assert {ref["libro"] for ref in node["riferimenti_testo"]} <= {"SKLEARN", "NUMPY", "PYTHON"}
    for ref in node["riferimenti_testo"]:
        expected_host = {"SKLEARN": "scikit-learn.org", "NUMPY": "numpy.org", "PYTHON": "docs.python.org"}[ref["libro"]]
        assert any(urlsplit(r["url"]).hostname == expected_host for r in node["risorse"])


def test_tutte_le_fonti_tecniche_sono_rappresentate(area_nodes):
    refs = {ref["libro"] for node in area_nodes.values() for ref in node["riferimenti_testo"]}
    assert refs == {"SKLEARN", "NUMPY", "PYTHON"}
    assert any("[F1]" in r["titolo"] for r in area_nodes[EXAM]["risorse"])


@pytest.mark.parametrize("node_id", CONTRACT)
def test_cinque_domande_chiuse_e_flashcard_distinta(node_id, lessons):
    lesson = lessons[node_id]
    questions = lesson["richiamo_attivo"]["domande"]
    assert len(questions) == 5
    assert {item["risposta"][0] for item in questions} == {"A", "B", "C"}
    for item in questions:
        for letter in ("A", "B", "C"):
            assert f"{letter})" in item["domanda"]
        assert re.match(r"^[ABC]\) .{9,}", item["risposta"])
    card = lesson["flashcard"]
    assert len(card["fronte"]) >= 5 and len(card["retro"]) >= 5
    assert card["fronte"] not in {question["domanda"] for question in questions}


def test_almeno_sei_carte_distinte_nel_mazzo_reale(area_nodes, lessons):
    nodes = [{**node, "lezione": lessons[node_id]} for node_id, node in area_nodes.items()]
    js = """
        import { costruisciMazzo } from './web/modules/ripasso/mazzo.js';
        let data = '';
        for await (const chunk of process.stdin) data += chunk;
        console.log(JSON.stringify(costruisciMazzo(JSON.parse(data))));
    """
    result = subprocess.run(["node", "--input-type=module", "-e", js], cwd=ROOT,
                            input=json.dumps(nodes, ensure_ascii=False), text=True,
                            check=True, capture_output=True)
    cards = json.loads(result.stdout)
    for node_id in CONTRACT:
        # Le carte checklist non entrano nel conteggio: hanno retro generico.
        selected = [c for c in cards if c["nodoId"] == node_id and c["tipo"] in {"domanda", "flashcard"}]
        assert len(selected) >= 6
        assert len({c["id"] for c in selected}) == len(selected)
        assert len({c["domanda"] for c in selected}) == len(selected)
        assert all(c["domanda"].strip() and c["risposta"].strip() for c in selected)


@pytest.mark.parametrize("node_id", [INTRO, LAB, CLASS, BAYES, CLUSTER, REGRESSION, PCA])
def test_ogni_snippet_python_svolto_si_esegue_con_numpy(node_id, lessons):
    scopes = run_python_snippets(lessons[node_id]["worked_example"])
    assert len(scopes) == 1  # Se si aggiungono esempi, aggiornarne anche gli esiti verificati.
    scope = scopes[0]
    if node_id == INTRO:
        np.testing.assert_array_equal(scope["matrice"], [[1, 1], [1, 1]])
        assert scope["accuratezza"] == pytest.approx(0.5)
    elif node_id == LAB:
        np.testing.assert_allclose(scope["scalato"], [[2, 1], [6, 2], [10, 3]])
        np.testing.assert_allclose(scope["medie"], [3, 4])
        np.testing.assert_allclose(scope["varianze"], [8 / 3, 8 / 3])
        assert scope["scalare"] == pytest.approx(3)
    elif node_id == CLASS:
        np.testing.assert_allclose(scope["w"], [2, 0])
        assert scope["b"] == pytest.approx(-1)
        np.testing.assert_allclose(scope["score"], [-1, 5])
        np.testing.assert_array_equal(scope["previsto"], [-1, 1])
        assert scope["accuratezza"] == pytest.approx(1)
    elif node_id == BAYES:
        np.testing.assert_allclose(scope["score"], [0.09, 0.12])
        np.testing.assert_allclose(scope["posteriori"], [3 / 7, 4 / 7])
        assert scope["classe"] == 1
    elif node_id == CLUSTER:
        np.testing.assert_array_equal(scope["gruppi"], [0, 0, 1, 1])
        np.testing.assert_allclose(scope["centri"], [[1, 2], [9, 8]])
        assert scope["inerzia"] == pytest.approx(4)
    elif node_id == REGRESSION:
        np.testing.assert_allclose(scope["coefficienti"], [1, 2])
        np.testing.assert_allclose(scope["previsto"], [7, 9])
        assert scope["mse"] == pytest.approx(0.5)
    elif node_id == PCA:
        np.testing.assert_allclose(scope["media"], [2, 2])
        np.testing.assert_allclose(np.abs(scope["componente"]), [2 ** -0.5, 2 ** -0.5])
        np.testing.assert_allclose(scope["ricostruito"], scope["X_train"], atol=1e-12)
        assert scope["quota"] == pytest.approx(1)
        np.testing.assert_allclose(np.abs(scope["test_proiettato"]), [2 * np.sqrt(2)])


def test_esempio_sulle_regole_non_inventa_codice_o_punteggi(lessons):
    worked = lessons[EXAM]["worked_example"]
    assert not fenced_blocks(worked, "python")
    assert "30 e lode" in worked["problema"]
    assert "[F1]" in worked["soluzione"]
