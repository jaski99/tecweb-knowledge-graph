"""Lezioni v4 dell'area 3, inclusi i nodi che saranno aggiunti da X2.

La completezza si verifica su tutti i nodi presenti, senza fissarne il numero.
Le soglie seguono il contratto comune delle lezioni, non requisiti aggiuntivi
che impedirebbero l'integrazione di lezioni v4 già valide.
"""
import json
import re

import pytest

from kg import LESSONS, load_graph

G = load_graph()
NODES = G["nodi"]
IDS = {n["id"] for n in NODES}


def _ids_area3(nodes):
    return sorted(n["id"] for n in nodes if n["area"] == 3)


AREA3 = _ids_area3(NODES)
BY_ID = {n["id"]: n for n in NODES}

CAMPI_OBBLIGATORI = {
    "perche_ti_serve", "scenario_fil_rouge", "definizione_esame",
    "spiegazione", "analogia", "worked_example", "completion_problem",
    "esercizio_autonomo", "errori_trappole", "richiamo_attivo",
    "riepilogo", "flashcard", "checklist",
}
MERMAID_START = re.compile(
    r"^(flowchart|graph|sequenceDiagram|stateDiagram(-v2)?|classDiagram|erDiagram|"
    r"gantt|pie|timeline|mindmap|gitGraph|journey|quadrantChart)\b"
)
# L'allowlist include le fonti tecniche previste per le lezioni X2.
# L'effettiva verifica HTTP delle singole risorse è separata (scripts/check_urls.py).
HOST_AMMESSI = {
    "developer.mozilla.org", "www.w3.org", "react.dev", "vuejs.org", "v8.dev",
    "docs.python.org", "flask.palletsprojects.com", "git-scm.com",
}
# Nessun punteggio puntuale inventato per un singolo nodo ("Vale 3-4 punti").
# La "regola dei 3 punti" di DIDATTICA.md non è un punteggio d'esame.
PUNTI_INVENTATI = re.compile(r"(?:vale|valgono)\s+[^.]{0,24}?\bpunti\b|\d+\s*[-–]\s*\d+\s*punti\b", re.I)
SENZA_ACCENTO = re.compile(r"\b(perche|puo|cosi|gia|piu|cioe)\b")


def _lezione(node_id):
    return json.loads((LESSONS / f"{node_id}.json").read_text(encoding="utf-8"))


def _blocks(md):
    return re.findall(r"^```(\w*)\n(.*?)^```", md, re.S | re.M)


def test_area3_ha_almeno_11_nodi():
    assert len(AREA3) >= 11


def test_area3_include_dinamicamente_nuovi_nodi():
    nuovi = [{"id": "esempio-nuovo", "area": 3}, {"id": "altra-area", "area": 4}]
    assert _ids_area3(NODES + nuovi) == sorted(AREA3 + ["esempio-nuovo"])


def test_area3_accetta_una_nuova_lezione_v4(tmp_path, monkeypatch):
    # Un esempio valido con JSX, diagramma invece della tabella e minimi v4:
    # non deve essere rifiutato dai vincoli aggiuntivi dei vecchi test.
    import sys

    esempio = _lezione("html-form-accessibilita")
    esempio["spiegazione"] = (
        "## Contesto\n\n" + "Una spiegazione didattica sul componente. " * 40
        + "\n\n## Esempio\n\n```jsx\nconst Libro = () => <p>Libro</p>;\n```\n"
        + "\n```mermaid\nflowchart LR\n    A[Stato] --> B[Vista]\n```\n"
    )
    esempio["worked_example"]["passi"] = esempio["worked_example"]["passi"][:2]
    esempio["errori_trappole"] = esempio["errori_trappole"][:2]
    node_id = "esempio-nuovo"
    (tmp_path / f"{node_id}.json").write_text(json.dumps(esempio, ensure_ascii=False), encoding="utf-8")
    monkeypatch.setattr(sys.modules[__name__], "LESSONS", tmp_path)
    monkeypatch.setitem(BY_ID, node_id, {"risorse": [{"url": "https://docs.python.org/3/", "verificato": True}]})
    test_lezione_area3_completa_v4(node_id)
    test_risorse_area3_solo_fonti_verificate(node_id)


@pytest.mark.parametrize("node_id", AREA3)
def test_ogni_nodo_area3_ha_lezione_nel_grafo(node_id):
    """L'ex xfail diventa pass: il nodo deve avere la lezione incorporata in graph.json."""
    assert (LESSONS / f"{node_id}.json").is_file(), f"manca graph/lezioni/{node_id}.json"
    assert "lezione" in BY_ID[node_id], f"{node_id}: lezione non incorporata (riesegui kg.py build)"


@pytest.mark.parametrize("node_id", AREA3)
def test_lezione_area3_completa_v4(node_id):
    L = _lezione(node_id)
    assert CAMPI_OBBLIGATORI <= set(L), f"{node_id}: campi mancanti {CAMPI_OBBLIGATORI - set(L)}"

    assert 20 <= len(L["perche_ti_serve"]) <= 200
    assert len(L["scenario_fil_rouge"]) >= 50
    de = L["definizione_esame"]
    assert all(len(de[k]) >= 10 for k in ("definizione", "scopo_vantaggio", "esempio"))

    md = L["spiegazione"]
    assert len(md) >= 1500, f"{node_id}: spiegazione troppo corta"
    assert md.count("```") % 2 == 0, f"{node_id}: recinti di codice non chiusi"
    assert len(re.findall(r"^#{2,3} ", md, re.M)) >= 2, f"{node_id}: servono sottotitoli"
    blocks = _blocks(md)
    assert any(lang in ("html", "css", "javascript", "js", "jsx", "mermaid", "python", "http", "java")
               for lang, _ in blocks), f"{node_id}: serve almeno un blocco di codice o mermaid"
    for lang, body in blocks:
        if lang == "mermaid":
            assert MERMAID_START.match(body.strip()), f"{node_id}: mermaid non riconosciuto"

    assert len(L["analogia"]["testo"]) >= 40 and len(L["analogia"]["limite"]) >= 10
    we = L["worked_example"]
    assert len(we["passi"]) >= 2 and len(we["soluzione"]) >= 10 and len(we["perche_funziona"]) >= 20
    cp = L["completion_problem"]
    assert len(cp["passi_mancanti"]) >= 1 and len(cp["soluzione"]) >= 10
    ea = L["esercizio_autonomo"]
    assert len(ea["testo"]) >= 20 and len(ea["suggerimento"]) >= 10 and len(ea["soluzione_attesa"]) >= 10

    assert len(L["errori_trappole"]) >= 2
    for err in L["errori_trappole"]:
        assert len(err["errore"]) >= 10 and len(err["perche_sbagliato"]) >= 10 and len(err["distrattore"]) >= 5

    ra = L["richiamo_attivo"]
    assert 3 <= len(ra["domande"]) <= 5
    for q in ra["domande"]:
        assert len(q["domanda"]) >= 10 and len(q["risposta"]) >= 10
    assert len(ra["spiega_con_parole_tue"]) >= 20
    assert len(ra["collegamenti_interleaving"]) >= 1
    for c in ra["collegamenti_interleaving"]:
        assert c["nodo"] in IDS, f"{node_id}: interleaving verso nodo inesistente {c['nodo']}"
        assert len(c["collegamento"]) >= 20

    assert 40 <= len(L["riepilogo"]) <= 800
    assert len([r for r in L["riepilogo"].splitlines() if r.strip()]) <= 5
    assert len(L["flashcard"]["fronte"]) >= 5 and len(L["flashcard"]["retro"]) >= 5
    assert len(L["checklist"]["so_fare"]) >= 1 and len(L["checklist"]["so_dire"]) >= 1


@pytest.mark.parametrize("node_id", AREA3)
def test_lezione_area3_senza_punteggi_inventati(node_id):
    testo = json.dumps(_lezione(node_id), ensure_ascii=False)
    assert not PUNTI_INVENTATI.search(testo), f"{node_id}: punteggio d'esame non documentato nei docs"


@pytest.mark.parametrize("node_id", AREA3)
def test_lezione_area3_italiano_con_accenti(node_id):
    """Controllo grossolano anti-regressione sugli accenti nei campi di testa e coda."""
    L = _lezione(node_id)
    campi = [L["perche_ti_serve"], L["definizione_esame"]["definizione"], L["riepilogo"]]
    for testo in campi:
        assert not SENZA_ACCENTO.search(testo), f"{node_id}: parola senza accento in: {testo[:80]}"
    assert "è" in L["definizione_esame"]["definizione"] or "è" in L["spiegazione"]


@pytest.mark.parametrize("node_id", AREA3)
def test_risorse_area3_solo_fonti_verificate(node_id):
    for r in BY_ID[node_id]["risorse"]:
        m = re.match(r"^https://([^/]+)/", r["url"])
        assert m, f"{node_id}: URL non https: {r['url']}"
        assert m.group(1) in HOST_AMMESSI, f"{node_id}: host non ammesso/verificato {m.group(1)}"
        assert r["verificato"] is True


def test_css_box_model_modello_corretto():
    """La lezione modello rivista da W2: niente punti inventati, margin spiegato con precisione."""
    testo = json.dumps(_lezione("css-box-model"), ensure_ascii=False)
    assert "Vale 3-4 punti" not in testo
    assert "quarta area del box model" in testo
    assert "margin collapsing" in testo.casefold() or "Margin collapsing" in testo
