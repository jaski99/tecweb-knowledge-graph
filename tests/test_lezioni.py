"""Schema v4: lezioni complete con struttura in 10 punti secondo DIDATTICA.md."""
import copy
import os
import re
import pytest
from jsonschema import Draft202012Validator
from kg import load_graph, load_schema

G = load_graph()
NODES = G["nodi"]
IDS = {n["id"] for n in NODES}
WITH = [n for n in NODES if "lezione" in n]
LEZIONI_IDS = {n["id"] for n in WITH}
MERMAID_START = re.compile(r"^(flowchart|graph|classDiagram|sequenceDiagram|stateDiagram(-v2)?|erDiagram|gantt|pie|timeline|mindmap|gitGraph|journey|quadrantChart)\b")
BOOK_REFERRAL = re.compile(r"(vedi|consulta|leggi|rimando a(l)?|si veda)\s+(il\s+)?(libro|testo|manuale|capitolo|cap\.)", re.I)

# Nodi che NON hanno lezione (da completare in Fase 2)
NODI_SENZA_LEZIONE = sorted(IDS - LEZIONI_IDS)


def test_almeno_3_lezioni_seed():
    """Verifica che esistano almeno le 3 lezioni seed complete."""
    seed_ids = {"http-stateless-vs-stateful", "rest-metodi-http", "css-box-model"}
    assert seed_ids.issubset(LEZIONI_IDS), f"Mancano lezioni seed: {seed_ids - LEZIONI_IDS}"
    assert len(WITH) >= 3, f"Servono almeno 3 lezioni, ne abbiamo {len(WITH)}"


def test_lezioni_complete():
    """In Fase 2, TUTTI i 41 nodi devono avere lezione."""
    todo = sorted(IDS - LEZIONI_IDS)
    assert not todo, f"{len(todo)} nodi senza lezione: {', '.join(todo)}"


def _blocks(md):
    return re.findall(r"^```(\w*)\n(.*?)^```", md, re.S | re.M)


# Lezioni seed e tutte le lezioni completate da W4: verifica integrale dello schema didattico v4.
@pytest.mark.parametrize("lezione_id", [
    "http-stateless-vs-stateful", "rest-metodi-http", "css-box-model",
    "tesina-progetto-flask-crud", "tesina-presentazione-8-minuti",
    "tesina-domande-revisione-codice", "tesina-esercitazione-guidata", "quiz-form",
])
def test_lezione_completa_v4(lezione_id):
    """Verifica che ogni lezione completata abbia tutti i campi obbligatori secondo DIDATTICA.md."""
    from kg import load_lessons
    lezioni = load_lessons()
    assert lezione_id in lezioni, f"Lezione {lezione_id} non trovata nei file"
    
    L = lezioni[lezione_id]
    
    # 1. perche_ti_serve
    assert "perche_ti_serve" in L, f"{lezione_id}: manca perche_ti_serve"
    assert 20 <= len(L["perche_ti_serve"]) <= 200, f"{lezione_id}: perche_ti_serve deve essere 20-200 caratteri"
    
    # 2. scenario_fil_rouge
    assert "scenario_fil_rouge" in L, f"{lezione_id}: manca scenario_fil_rouge"
    assert len(L["scenario_fil_rouge"]) >= 50, f"{lezione_id}: scenario_fil_rouge deve essere >=50 caratteri"
    
    # 3. definizione_esame
    assert "definizione_esame" in L, f"{lezione_id}: manca definizione_esame"
    def_esame = L["definizione_esame"]
    assert "definizione" in def_esame, f"{lezione_id}: manca definizione_esame.definizione"
    assert "scopo_vantaggio" in def_esame, f"{lezione_id}: manca definizione_esame.scopo_vantaggio"
    assert "esempio" in def_esame, f"{lezione_id}: manca definizione_esame.esempio"
    assert len(def_esame["definizione"]) >= 10, f"{lezione_id}: definizione_esame.definizione >=10"
    assert len(def_esame["scopo_vantaggio"]) >= 10, f"{lezione_id}: definizione_esame.scopo_vantaggio >=10"
    assert len(def_esame["esempio"]) >= 10, f"{lezione_id}: definizione_esame.esempio >=10"
    
    # 4. spiegazione
    assert "spiegazione" in L, f"{lezione_id}: manca spiegazione"
    md = L["spiegazione"]
    assert len(md) >= 1500, f"{lezione_id}: spiegazione >=1500 caratteri"
    assert md.count("```") % 2 == 0, f"{lezione_id}: blocchi di codice non chiusi"
    assert len(re.findall(r"^#{2,3} ", md, re.M)) >= 2, f"{lezione_id}: servono almeno 2 sottotitoli"
    blocks = _blocks(md)
    assert any(lang in ("java", "mermaid", "http", "css", "python", "javascript") for lang, _ in blocks), f"{lezione_id}: serve almeno un blocco code"
    for lang, body in blocks:
        if lang == "mermaid":
            assert MERMAID_START.match(body.strip()), f"{lezione_id}: mermaid tipo non riconosciuto"
    
    # 5. analogia
    assert "analogia" in L, f"{lezione_id}: manca analogia"
    analogia = L["analogia"]
    assert "testo" in analogia, f"{lezione_id}: manca analogia.testo"
    assert "limite" in analogia, f"{lezione_id}: manca analogia.limite"
    assert len(analogia["testo"]) >= 40, f"{lezione_id}: analogia.testo >=40"
    assert len(analogia["limite"]) >= 10, f"{lezione_id}: analogia.limite >=10"
    
    # 6a. worked_example
    assert "worked_example" in L, f"{lezione_id}: manca worked_example"
    we = L["worked_example"]
    assert "titolo" in we, f"{lezione_id}: manca worked_example.titolo"
    assert "problema" in we, f"{lezione_id}: manca worked_example.problema"
    assert "passi" in we, f"{lezione_id}: manca worked_example.passi"
    assert "soluzione" in we, f"{lezione_id}: manca worked_example.soluzione"
    assert "perche_funziona" in we, f"{lezione_id}: manca worked_example.perche_funziona"
    assert len(we["passi"]) >= 2, f"{lezione_id}: worked_example.passi >=2"
    
    # 6b. completion_problem
    assert "completion_problem" in L, f"{lezione_id}: manca completion_problem"
    cp = L["completion_problem"]
    assert "titolo" in cp, f"{lezione_id}: manca completion_problem.titolo"
    assert "testo" in cp, f"{lezione_id}: manca completion_problem.testo"
    assert "passi_mancanti" in cp, f"{lezione_id}: manca completion_problem.passi_mancanti"
    assert "soluzione" in cp, f"{lezione_id}: manca completion_problem.soluzione"
    assert len(cp["passi_mancanti"]) >= 1, f"{lezione_id}: completion_problem.passi_mancanti >=1"
    
    # 6c. esercizio_autonomo
    assert "esercizio_autonomo" in L, f"{lezione_id}: manca esercizio_autonomo"
    ea = L["esercizio_autonomo"]
    assert "titolo" in ea, f"{lezione_id}: manca esercizio_autonomo.titolo"
    assert "testo" in ea, f"{lezione_id}: manca esercizio_autonomo.testo"
    assert "suggerimento" in ea, f"{lezione_id}: manca esercizio_autonomo.suggerimento"
    assert "soluzione_attesa" in ea, f"{lezione_id}: manca esercizio_autonomo.soluzione_attesa"
    
    # 7. errori_trappole
    assert "errori_trappole" in L, f"{lezione_id}: manca errori_trappole"
    assert len(L["errori_trappole"]) >= 2, f"{lezione_id}: errori_trappole >=2"
    for err in L["errori_trappole"]:
        assert "errore" in err, f"{lezione_id}: manca errore.errore"
        assert "perche_sbagliato" in err, f"{lezione_id}: manca errore.perche_sbagliato"
        assert "distrattore" in err, f"{lezione_id}: manca errore.distrattore"
    
    # 8. mnemonica (opzionale)
    if "mnemonica" in L:
        assert 10 <= len(L["mnemonica"]) <= 500, f"{lezione_id}: mnemonica 10-500 caratteri"
    
    # 9. richiamo_attivo
    assert "richiamo_attivo" in L, f"{lezione_id}: manca richiamo_attivo"
    ra = L["richiamo_attivo"]
    assert "domande" in ra, f"{lezione_id}: manca richiamo_attivo.domande"
    assert "spiega_con_parole_tue" in ra, f"{lezione_id}: manca richiamo_attivo.spiega_con_parole_tue"
    assert "collegamenti_interleaving" in ra, f"{lezione_id}: manca richiamo_attivo.collegamenti_interleaving"
    assert 3 <= len(ra["domande"]) <= 5, f"{lezione_id}: richiamo_attivo.domande deve essere 3-5"
    assert len(ra["collegamenti_interleaving"]) >= 1, f"{lezione_id}: richiamo_attivo.collegamenti_interleaving >=1"
    for q in ra["domande"]:
        assert "domanda" in q and "risposta" in q, f"{lezione_id}: domanda deve avere domanda e risposta"
    for c in ra["collegamenti_interleaving"]:
        assert "nodo" in c and "collegamento" in c, f"{lezione_id}: collegamento deve avere nodo e collegamento"
    
    # 10a. riepilogo
    assert "riepilogo" in L, f"{lezione_id}: manca riepilogo"
    assert 40 <= len(L["riepilogo"]) <= 800, f"{lezione_id}: riepilogo 40-800 caratteri"
    assert len([r for r in L["riepilogo"].splitlines() if r.strip()]) <= 5, f"{lezione_id}: riepilogo max 5 righe"
    
    # 10b. flashcard
    assert "flashcard" in L, f"{lezione_id}: manca flashcard"
    fc = L["flashcard"]
    assert "fronte" in fc and "retro" in fc, f"{lezione_id}: flashcard deve avere fronte e retro"
    
    # 10c. checklist
    assert "checklist" in L, f"{lezione_id}: manca checklist"
    cl = L["checklist"]
    assert "so_fare" in cl and "so_dire" in cl, f"{lezione_id}: checklist deve avere so_fare e so_dire"
    assert len(cl["so_fare"]) >= 1 and len(cl["so_dire"]) >= 1, f"{lezione_id}: checklist.so_fare e so_dire >=1"


def test_tutte_le_lezioni_complete():
    """Verifica che TUTTI i 41 nodi abbiano lezione (Fase 2 completata)."""
    todo = sorted(IDS - LEZIONI_IDS)
    assert not todo, f"{len(todo)} nodi senza lezione: {', '.join(todo)}"


def test_almeno_3_lezioni_seed():
    """Verifica che le lezioni siano in file separati e non inline."""
    from kg import load_parts, load_lessons
    ids = {n["id"] for part in load_parts().values() for n in part}
    inline = [n["id"] for part in load_parts().values() for n in part if "lezione" in n]
    assert not inline, f"lezioni inline nei part (spostale in graph/lezioni/<id>.json): {inline}"
    assert set(load_lessons()) <= ids, set(load_lessons()) - ids


def test_campi_didattica_nelle_lezioni_seed():
    """Valida che le 3 lezioni seed abbiano i campi DIDATTICA (struttura in 10 punti)."""
    from kg import load_lessons
    lezioni = load_lessons()
    seed_ids = {"http-stateless-vs-stateful", "rest-metodi-http", "css-box-model"}
    
    campi_obbligatori = {
        "perche_ti_serve", "scenario_fil_rouge", "definizione_esame",
        "spiegazione", "analogia", "worked_example", "completion_problem",
        "esercizio_autonomo", "errori_trappole", "richiamo_attivo",
        "riepilogo", "flashcard", "checklist"
    }
    
    for seed_id in seed_ids:
        assert seed_id in lezioni, f"Lezione {seed_id} non trovata"
        mancanti = campi_obbligatori - set(lezioni[seed_id].keys())
        assert not mancanti, f"Lezione {seed_id}: mancanti campi DIDATTICA: {mancanti}"


@pytest.mark.parametrize("lezione_id", ["http-stateless-vs-stateful", "rest-metodi-http", "css-box-model"])
def test_definizione_esame_regola_3_punti(lezione_id):
    """Verifica che definizione_esame abbia i 3 punti: definizione, scopo_vantaggio, esempio."""
    from kg import load_lessons
    lezioni = load_lessons()
    def_esame = lezioni[lezione_id].get("definizione_esame", {})
    assert "definizione" in def_esame, f"{lezione_id}: manca definizione_esame.definizione"
    assert "scopo_vantaggio" in def_esame, f"{lezione_id}: manca definizione_esame.scopo_vantaggio"
    assert "esempio" in def_esame, f"{lezione_id}: manca definizione_esame.esempio"


@pytest.mark.parametrize("lezione_id", ["http-stateless-vs-stateful", "rest-metodi-http", "css-box-model"])
def test_richiamo_attivo_completo(lezione_id):
    """Verifica che richiamo_attivo abbia domande, spiega_con_parole_tue e collegamenti."""
    from kg import load_lessons
    lezioni = load_lessons()
    ra = lezioni[lezione_id].get("richiamo_attivo", {})
    assert "domande" in ra, f"{lezione_id}: manca richiamo_attivo.domande"
    assert "spiega_con_parole_tue" in ra, f"{lezione_id}: manca richiamo_attivo.spiega_con_parole_tue"
    assert "collegamenti_interleaving" in ra, f"{lezione_id}: manca richiamo_attivo.collegamenti_interleaving"
    assert 3 <= len(ra["domande"]) <= 5, f"{lezione_id}: richiamo_attivo.domande deve avere 3-5 domande"
    assert len(ra["collegamenti_interleaving"]) >= 1, f"{lezione_id}: richiamo_attivo.collegamenti_interleaving deve avere >=1 collegamento"
