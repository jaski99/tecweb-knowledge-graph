"""Verifica il rendering di tutti i campi v4 in viewport mobile e desktop."""
import json
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import pytest

sync_api = pytest.importorskip("playwright.sync_api")
WEB = Path(__file__).resolve().parent.parent
ROOT = WEB.parent
VIEWPORTS = {"mobile": {"width": 390, "height": 844}, "desktop": {"width": 1440, "height": 900}}

LESSON = {
    "perche_ti_serve": "Serve per capire e applicare il concetto durante lo studio del Web.",
    "scenario_fil_rouge": "Una biblioteca online consente al lettore di cercare e prenotare un libro in modo affidabile.",
    "definizione_esame": {"definizione": "Definizione precisa del concetto da ricordare.", "scopo_vantaggio": "Il vantaggio è rendere il comportamento comprensibile.", "esempio": "Un esempio è la richiesta inviata dal browser."},
    "spiegazione": "## Idea principale\n\nUna descrizione introduttiva con dettagli sufficienti per lo studio.\n\n### Passaggi\n\nIl flusso è composto da una richiesta e da una risposta osservabile.\n\n```js\nconst risposta = await fetch('/api/libri');\n```\n\n```mermaid\nflowchart LR\n  Browser --> Server\n```\n",
    "analogia": {"testo": "È come chiedere un libro al banco della biblioteca e ricevere una risposta.", "limite": "La rete non è un banco fisico."},
    "worked_example": {"titolo": "Richiedere un libro", "problema": "Il lettore vuole ottenere l’elenco dei libri disponibili.", "passi": ["Individuare la risorsa richiesta.", "Inviare la richiesta al server."], "soluzione": "Il server restituisce una rappresentazione dei libri.", "perche_funziona": "La richiesta identifica la risorsa e la risposta comunica il risultato."},
    "completion_problem": {"titolo": "Completa la richiesta", "testo": "Completa i passaggi per chiedere i libri disponibili.", "passi_mancanti": ["Inviare la richiesta all’endpoint corretto."], "soluzione": "Si invia GET /api/libri e si interpreta la risposta."},
    "esercizio_autonomo": {"titolo": "Descrivi la risposta", "testo": "Spiega come il client usa i dati restituiti dal server.", "suggerimento": "Pensa al formato dei dati e alla vista.", "soluzione_attesa": "Il client interpreta i dati e aggiorna la vista."},
    "errori_trappole": [{"errore": "Confondere richiesta e risposta.", "perche_sbagliato": "Sono messaggi distinti con direzioni diverse.", "distrattore": "Il compilatore crea una tabella."}, {"errore": "Pensare che la rete sia sempre affidabile.", "perche_sbagliato": "La comunicazione può fallire o essere ritardata.", "distrattore": "La tastiera è wireless."}],
    "mnemonica": "Richiesta parte, risposta torna.",
    "richiamo_attivo": {"domande": [{"domanda": "Quale messaggio invia il client?", "risposta": "Invia una richiesta al server."}, {"domanda": "Che cosa contiene la risposta?", "risposta": "Contiene l’esito della richiesta."}, {"domanda": "Perché distinguere i due messaggi?", "risposta": "Per descrivere correttamente il flusso."}], "spiega_con_parole_tue": "Spiega il flusso al lettore della biblioteca.", "collegamenti_interleaving": [{"nodo": "http-stateless-vs-stateful", "collegamento": "Questo concetto si collega alla comunicazione HTTP tra client e server."}]},
    "riepilogo": "Il client invia una richiesta. Il server elabora la risorsa. La risposta comunica l’esito. Il formato aiuta a interpretare i dati.",
    "flashcard": {"fronte": "Qual è la direzione della richiesta?", "retro": "Dal client al server."},
    "checklist": {"so_fare": ["Individuare la risorsa richiesta."], "so_dire": ["Descrivere richiesta e risposta."]},
}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@pytest.fixture(scope="module")
def base_url():
    import subprocess
    subprocess.run(["sh", str(WEB / "build.sh")], check=True, capture_output=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(WEB)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{server.server_address[1]}/"
    server.shutdown()


@pytest.fixture(scope="module")
def browser():
    with sync_api.sync_playwright() as p:
        instance = p.chromium.launch()
        yield instance
        instance.close()


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_lezione_v4_tutti_i_campi(browser, base_url, viewport):
    graph = json.loads((ROOT / "graph" / "graph.json").read_text(encoding="utf-8"))
    node = next(item for item in graph["nodi"] if item["id"] == "http-stateless-vs-stateful")
    node["lezione"] = LESSON
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile", has_touch=viewport == "mobile")
    page = context.new_page()
    page.route("**/graph.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(graph, ensure_ascii=False)))
    page.goto(f"{base_url}#/lezione/{node['id']}")
    page.wait_for_selector("#lesson-title")
    for selector in [".scenario", ".definizione", ".spiegazione", ".analogia", ".completion", ".autonomo", ".errori table", ".richiamo", ".riepilogo", ".flashcard", ".checklist"]:
        assert page.locator(selector).count() > 0, selector
    assert page.locator("article.worked .passi li").count() == 0
    assert page.locator(".completion details").first.evaluate("el => !el.open")
    assert page.locator(".richiamo details").first.evaluate("el => !el.open")
    card = page.locator(".flashcard").first
    assert card.inner_text() == LESSON["flashcard"]["fronte"]
    card.click()
    assert card.inner_text() == LESSON["flashcard"]["retro"]
    checklist = page.locator(".lesson-checklist input").first
    checklist.check()
    page.reload()
    page.wait_for_selector(".lesson-checklist input")
    assert page.locator(".lesson-checklist input").first.is_checked()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    context.close()
