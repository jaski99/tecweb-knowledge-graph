"""Validazione strutturale e semantica della banca quiz autonoma dal grafo."""
import copy
import json
import re
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
QUIZ_PATH = ROOT / "graph" / "quiz.json"
SCHEMA_PATH = ROOT / "graph" / "quiz.schema.json"
QUIZ = json.loads(QUIZ_PATH.read_text(encoding="utf-8"))
SCHEMA = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
GRAPH = json.loads((ROOT / "graph" / "graph.json").read_text(encoding="utf-8"))
NODE_BY_ID = {node["id"]: node for node in GRAPH["nodi"]}


def test_quiz_schema_is_valid():
    Draft202012Validator.check_schema(SCHEMA)


def test_quiz_matches_schema():
    errors = list(Draft202012Validator(SCHEMA).iter_errors(QUIZ))
    assert not errors, [f"{e.json_path}: {e.message}" for e in errors]


def test_quiz_rejects_unknown_fields():
    invalid = copy.deepcopy(QUIZ)
    invalid["campo_non_previsto"] = True
    assert list(Draft202012Validator(SCHEMA).iter_errors(invalid))


def test_ids_are_unique_and_all_areas_are_covered():
    items = QUIZ["elementi"]
    ids = [item["id"] for item in items]
    assert len(ids) == len(set(ids))
    assert {item["area"] for item in items} == set(range(1, 7))
    for area in range(1, 7):
        area_items = [item for item in items if item["area"] == area]
        assert any(item["tipo"] == "scelta_multipla" for item in area_items)
        assert any(item["tipo"] == "abbinamento" for item in area_items)


def test_choice_answers_and_node_links_are_valid():
    for item in QUIZ["elementi"]:
        if item["tipo"] != "scelta_multipla":
            continue
        option_ids = [option["id"] for option in item["opzioni"]]
        assert len(option_ids) == len(set(option_ids)), item["id"]
        assert item["risposta_corretta"] in option_ids, item["id"]
        assert item["nodo_id"] in NODE_BY_ID, item["id"]
        assert NODE_BY_ID[item["nodo_id"]]["area"] == item["area"], item["id"]
        assert item["spiegazione"].strip(), item["id"]


def test_matching_answers_distractors_and_node_links_are_valid():
    for item in QUIZ["elementi"]:
        if item["tipo"] != "abbinamento":
            continue
        option_ids = [option["id"] for option in item["opzioni"]]
        assert len(option_ids) == len(set(option_ids)), item["id"]
        assert {d["tipo"] for d in item["distrattori"]} >= {"plausibile", "fuori_contesto"}, item["id"]
        assert len({pair["elemento"] for pair in item["abbinamenti"]}) == len(item["abbinamenti"])
        for pair in item["abbinamenti"]:
            assert pair["risposta_id"] in option_ids, (item["id"], pair)
            assert pair["nodo_id"] in NODE_BY_ID, (item["id"], pair)
            assert NODE_BY_ID[pair["nodo_id"]]["area"] in range(1, 7), (item["id"], pair)
            assert pair["spiegazione"].strip(), (item["id"], pair)


def test_quiz_includes_distractors_from_outside_the_web_context():
    all_distractors = [d for item in QUIZ["elementi"] if item["tipo"] == "abbinamento" for d in item["distrattori"]]
    assert any(d["tipo"] == "fuori_contesto" for d in all_distractors)
    assert any(d["tipo"] == "plausibile" for d in all_distractors)


def test_fase_a_quaranta_originali_solo_nodi_esistenti():
    assert QUIZ["versione"] == 2
    assert len(QUIZ["elementi"]) >= 40
    for item in QUIZ["elementi"]:
        assert item["origine"] == "originale"
        assert "[F1]" in item["fonte"]
        assert item["nodo_id"] in NODE_BY_ID
        assert NODE_BY_ID[item["nodo_id"]]["area"] == item["area"]
        assert not item["nodo_id"].startswith("ia-")


def test_proposte_q1_q5_e_fonti_trasparenti():
    for q in range(1, 6):
        assert any(item["id"].startswith(f"q{q}-") for item in QUIZ["elementi"])
    q5 = next(item for item in QUIZ["elementi"] if item["id"].startswith("q5-"))
    assert "IPOTESI" in q5["domanda"] and "slide" in q5["spiegazione"]


def test_opzioni_spiegate_e_posizioni_variate():
    positions = set()
    for item in QUIZ["elementi"]:
        if item["tipo"] != "scelta_multipla":
            continue
        assert {o.get("tipo") for o in item["opzioni"]} >= {"plausibile", "fuori_contesto"}
        positions.add(next(i for i, o in enumerate(item["opzioni"]) if o["id"] == item["risposta_corretta"]))
        assert all(len(o["spiegazione"]) >= 10 for o in item["opzioni"])
    assert len(positions) >= 3
    assert len({i["risposta_corretta"] for i in QUIZ["elementi"] if i["tipo"] == "scelta_multipla"}) >= 3


def test_vero_falso_e_codice_validi():
    kinds = {item["tipo"] for item in QUIZ["elementi"]}
    assert {"vero_falso", "completamento_codice"} <= kinds
    for item in QUIZ["elementi"]:
        if item["tipo"] == "vero_falso":
            assert type(item["risposta_corretta"]) is bool
        if item["tipo"] == "completamento_codice":
            assert set(re.findall(r"___([1-9][0-9]*)___", item["codice_con_buchi"])) == set(item["soluzioni"])
            assert all(v and all(s.strip() for s in v) for v in item["soluzioni"].values())


@pytest.mark.parametrize("kind,field,value", [
    ("vero_falso", "risposta_corretta", "false"),
    ("vero_falso", "campo_ignoto", 1),
    ("completamento_codice", "soluzioni", {"1": []}),
    ("completamento_codice", "soluzioni", {"zero": ["GET"]}),
    ("completamento_codice", "codice_con_buchi", "senza segnaposto"),
    ("scelta_multipla", "area", 8),
    ("abbinamento", "nodo_id", ""),
])
def test_schema_rifiuta_nuovi_tipi_malformati(kind, field, value):
    invalid = copy.deepcopy(QUIZ)
    item = next(i for i in invalid["elementi"] if i["tipo"] == kind)
    item[field] = value
    assert not Draft202012Validator(SCHEMA).is_valid(invalid)


def test_schema_ammette_area_sette_senza_anticipare_la_banca_fase_b():
    fixture = copy.deepcopy(QUIZ)
    fixture["elementi"][0]["area"] = 7
    assert Draft202012Validator(SCHEMA).is_valid(fixture)


def test_id_distrattori_sintetici_riservati():
    for item in QUIZ["elementi"]:
        for option in item.get("opzioni", []):
            assert not option["id"].startswith("distrattore-")
