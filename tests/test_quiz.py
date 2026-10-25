"""Validazione strutturale e semantica della banca quiz autonoma dal grafo."""
import copy
import json
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
            assert NODE_BY_ID[pair["nodo_id"]]["area"] == item["area"], (item["id"], pair)
            assert pair["spiegazione"].strip(), (item["id"], pair)


def test_quiz_includes_distractors_from_outside_the_web_context():
    all_distractors = [d for item in QUIZ["elementi"] if item["tipo"] == "abbinamento" for d in item["distrattori"]]
    assert any(d["tipo"] == "fuori_contesto" for d in all_distractors)
    assert any(d["tipo"] == "plausibile" for d in all_distractors)
