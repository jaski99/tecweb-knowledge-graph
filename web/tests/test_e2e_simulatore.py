"""Banca reale: interazioni native, modalità, consegna e persistenza su due viewport."""
import json
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess

import pytest
from playwright.sync_api import sync_playwright

WEB = Path(__file__).resolve().parent.parent
BANK = json.loads((WEB.parent / "graph/quiz.json").read_text())["elementi"]
GRAPH = json.loads((WEB.parent / "graph/graph.json").read_text())
# Il catalogo comprende anche esercizi aperti, non soltanto la banca quiz.
BY_ID = {
    f"{node['id']}#{index}": {**exercise, "tipo": "aperta", "nodo_id": node["id"]}
    for node in GRAPH["nodi"]
    for index, exercise in enumerate(node.get("esercizi", []))
    if exercise.get("testo", "").strip() and exercise.get("soluzione", "").strip()
}
BY_ID.update({item["id"]: item for item in BANK})
VIEWPORTS = {"mobile": {"width": 390, "height": 844}, "desktop": {"width": 1440, "height": 900}}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def imposta_seed(page, seed):
    """Il seed sta nelle opzioni avanzate, chiuse di default: le apre e lo imposta."""
    if not page.locator("#sim-avanzate").evaluate("d => d.open"):
        page.click("#sim-avanzate > summary")
    page.fill("#sim-seed", str(seed))


@pytest.fixture(scope="module")
def base_url():
    subprocess.run(["sh", str(WEB / "build.sh")], check=True, capture_output=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(WEB)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{server.server_address[1]}/"
    server.shutdown()


@pytest.fixture(scope="module")
def browser():
    with sync_playwright() as p:
        instance = p.chromium.launch()
        yield instance
        instance.close()


def apri(browser, base_url, viewport, modalita="simulazione", seed="1"):
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile", has_touch=viewport == "mobile")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base_url + "#/simulatore")
    page.wait_for_selector("#sim-inizia")
    assert "ipotesi" in page.locator(".sim").inner_text().lower()
    page.select_option("#sim-modalita", modalita)
    page.fill("#sim-durata", "10")
    imposta_seed(page, seed)
    page.click("#sim-inizia")
    page.wait_for_selector(".sim-q")
    return context, page, errors


def rispondi(article, corretta=True):
    item = BY_ID[article.get_attribute("data-q")]
    if item["tipo"] == "scelta_multipla":
        oid = item["risposta_corretta"] if corretta else next(o["id"] for o in item["opzioni"] if o["id"] != item["risposta_corretta"])
        radio = article.locator(f'input[value="{oid}"]')
        radio.focus()
        radio.press("Space")
    elif item["tipo"] == "vero_falso":
        value = item["risposta_corretta"] if corretta else not item["risposta_corretta"]
        article.locator(f'input[value="{"vero" if value else "falso"}"]').check()
    elif item["tipo"] == "abbinamento":
        for i, pair in enumerate(item["abbinamenti"]):
            select = article.locator("select").nth(i)
            expected = pair["risposta_id"] if corretta else "distrattore-0"
            if i == 0:
                # Menu nativo, utilizzabile anche senza mouse o trascinamento.
                values = select.locator("option").evaluate_all("options => options.map(o => o.value)")
                select.focus()
                select.press("Home")
                for _ in range(values.index(expected)):
                    select.press("ArrowDown")
                assert select.input_value() == expected
            else:
                select.select_option(expected)
    elif item["tipo"] == "completamento_codice":
        for i, variants in enumerate(item["soluzioni"].values()):
            field = article.locator('input[type="text"]').nth(i)
            field.fill(variants[0] if corretta else "errato")
            field.press("Tab")
    elif item["tipo"] == "aperta":
        article.locator("textarea").fill(item["soluzione"] if corretta else "Risposta da rivedere")
    return item


def prova_tipologie(page):
    """Casi reali espliciti per tutti i tipi: non dipendono dalla fortuna di un seed."""
    scelti = {}
    for item in BANK:
        scelti.setdefault(item["tipo"], item)
    sample = list(scelti.values()) + [next(item for item in BANK if item["id"].startswith("q6-"))]
    page.evaluate("""async (elementi) => {
      localStorage.setItem('tecweb.moduloIA', '1');
      const { generaProva } = await import('./modules/simulatore/genera.js');
      const { creaSessione, mettiInPausa } = await import('./modules/simulatore/sessione.js');
      const prova = generaProva([], { quiz: {elementi}, quanti: elementi.length, seed: 3, modalita: 'allenamento', includiIA: true });
      const sessione = mettiInPausa(creaSessione(prova, Date.now()), Date.now());
      localStorage.setItem('tecweb:simulatore:v1', JSON.stringify(sessione));
    }""", sample)
    page.reload()
    page.wait_for_selector(".sim-q")
    return len(sample)


@pytest.mark.parametrize("viewport", VIEWPORTS)
def test_simulazione_senza_appunti_ripresa_consegna_report(browser, base_url, viewport):
    context, page, errors = apri(browser, base_url, viewport)
    assert page.locator("#sim-timer").inner_text().startswith("00:10:")
    assert "Senza appunti" in page.locator(".sim").inner_text()
    assert page.locator(".sim-soluzione-testo").count() == 0
    assert page.locator(".sim-q a").count() == 0
    articles = page.locator(".sim-q")
    totale = articles.count()
    assert page.locator(".sim-q fieldset legend").count() == totale
    ids = [a.get_attribute("data-q") for a in articles.all()]
    for article in articles.all():
        rispondi(article, corretta=False)
    assert page.locator(".sim-soluzione-testo").count() == 0
    assert page.evaluate("localStorage.getItem('ids-kg:esiti-quiz:v1')") is None
    page.click("#sim-pause")
    frozen = page.inner_text("#sim-timer")
    page.wait_for_timeout(1100)
    assert page.inner_text("#sim-timer") == frozen
    page.reload()
    page.wait_for_selector(".sim-q")
    assert [a.get_attribute("data-q") for a in page.locator(".sim-q").all()] == ids
    assert page.locator("#sim-timer").inner_text() == frozen
    assert page.locator('input[type="radio"]:checked').count() > 0
    page.click("#sim-consegna")
    assert page.locator(".sim-soluzione-testo").count() == totale
    assert "non viene calcolato un voto" in page.inner_text("#sim-riepilogo").lower()
    assert "Riapri questi nodi" in page.locator("#sim-report").inner_text()
    assert page.locator("#sim-report a").count() > 0
    history = page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")
    assert history and all(not e["corretto"] and e["modalita"] == "simulazione" for e in history)
    page.reload()
    page.wait_for_selector("#sim-report")
    assert len(page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")) == len(history)
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", VIEWPORTS)
def test_allenamento_feedback_tastiera_abbinamento_e_tipi_nuovi(browser, base_url, viewport):
    context, page, errors = apri(browser, base_url, viewport, "allenamento")
    totale = prova_tipologie(page)
    assert page.locator("#sim-timer").count() == 0
    kinds = set()
    for article in page.locator(".sim-q").all():
        item = rispondi(article)
        kinds.add(item["tipo"])
        assert "Risposta corretta" in article.locator(".sim-soluzione-testo").inner_text()
        if item["tipo"] == "scelta_multipla":
            assert article.locator(".sim-soluzione-testo li").count() == len(item["opzioni"])
        assert article.locator("fieldset").evaluate("el => el.disabled")
    assert {"scelta_multipla", "abbinamento", "vero_falso", "completamento_codice"} <= kinds
    history = page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")
    assert history and all(e["corretto"] and e["modalita"] == "allenamento" for e in history)
    page.reload()
    page.wait_for_selector(".sim-soluzione-testo")
    assert page.locator("fieldset:disabled").count() == totale
    page.click("#sim-consegna")
    assert len(page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")) == len(history)
    assert page.locator("#sim-report a").count() == 0
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    assert not errors, errors
    context.close()


def test_scadenza_consegna_automatica_senza_duplicazioni(browser, base_url):
    context, page, errors = apri(browser, base_url, "desktop")
    page.evaluate("""() => {
      const key = 'tecweb:simulatore:v1';
      const s = JSON.parse(localStorage.getItem(key));
      s.timer.startedAt = Date.now() - s.timer.durataMs - 1000;
      localStorage.setItem(key, JSON.stringify(s));
    }""")
    page.reload()
    page.wait_for_selector("#sim-report")
    history = page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")
    assert history and not any(e["corretto"] for e in history)
    page.reload()
    page.wait_for_selector("#sim-report")
    assert page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))") == history
    assert not errors, errors
    context.close()


def test_allenamento_errore_spiegato_e_storage_corrotto(browser, base_url):
    context, page, errors = apri(browser, base_url, "desktop", "allenamento")
    article = next(a for a in page.locator(".sim-q").all() if BY_ID[a.get_attribute("data-q")]["tipo"] == "scelta_multipla")
    item = rispondi(article, corretta=False)
    feedback = article.locator(".sim-soluzione-testo").inner_text()
    assert "non corretta" in feedback
    for option in item["opzioni"]:
        assert option["spiegazione"] in feedback
    history = page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")
    assert len(history) == 1 and history[0]["corretto"] is False
    page.evaluate("localStorage.setItem('tecweb:simulatore:v1', '{')")
    page.reload()
    page.wait_for_selector("#sim-inizia")
    assert not errors, errors
    context.close()


def test_nuova_sessione_impostazioni_visibili_coerenti(browser, base_url):
    context, page, errors = apri(browser, base_url, "desktop", "allenamento")
    page.on("dialog", lambda dialog: dialog.accept())
    page.click("#sim-nuova")
    page.wait_for_selector("#sim-inizia")
    assert page.locator("#sim-modalita").input_value() == "allenamento"
    assert page.locator("#sim-durata").input_value() == "10"
    page.select_option("#sim-modalita", "simulazione")
    page.click("#sim-inizia")
    page.wait_for_selector("#sim-timer")
    assert page.locator("#sim-timer").inner_text().startswith("00:10:")
    assert page.locator(".sim-soluzione-testo").count() == 0
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", VIEWPORTS)
def test_catalogo_senza_banca_gestisce_aperte_in_tutte_le_aree(browser, base_url, viewport):
    context = browser.new_context(viewport=VIEWPORTS[viewport], service_workers="block")
    page = context.new_page()
    page.route("**/quiz.json", lambda route: route.fulfill(json={
        "versione": 2, "descrizione": "Banca temporaneamente non disponibile", "elementi": [],
    }))
    page.goto(base_url + "#/simulatore")
    page.wait_for_selector("#sim-inizia")
    page.click("#sim-inizia")
    page.wait_for_selector(".sim-q")
    sessione = page.evaluate("JSON.parse(localStorage.getItem('tecweb:simulatore:v1'))")
    aree_catalogo = {node["area"] for node in GRAPH["nodi"] if node.get("esercizi") and node["area"] != 7 and not node["id"].startswith("ia-")}
    if len(sessione["prova"]["esercizi"]) >= len(aree_catalogo):
        assert {item["area"] for item in sessione["prova"]["esercizi"]} == aree_catalogo
    for article in page.locator(".sim-q").all():
        assert rispondi(article)["tipo"] == "aperta"
    page.click("#sim-consegna")
    page.wait_for_selector("#sim-report")
    assert page.locator(".sim-soluzione-testo").count() == len(sessione["prova"]["esercizi"])
    assert page.evaluate("localStorage.getItem('ids-kg:esiti-quiz:v1')") is None
    assert "da autovalutare" in page.locator("#sim-report").inner_text()
    context.close()


def assert_solo_tw(page):
    sessione = page.evaluate("JSON.parse(localStorage.getItem('tecweb:simulatore:v1'))")
    for item in sessione["prova"]["esercizi"]:
        assert item["area"] != 7
        assert not item["nodoId"].startswith("ia-")
    text = page.locator(".sim").inner_text()
    assert "Area 7" not in text
    assert "modulo IA" not in text
    assert "Q6" not in text
    assert page.locator('.sim a[href*="ia-"]').count() == 0
    return sessione


@pytest.mark.parametrize("viewport", VIEWPORTS)
def test_stato_vuoto_tre_simulazioni_solo_tw(browser, base_url, viewport):
    context = browser.new_context(viewport=VIEWPORTS[viewport])
    page = context.new_page()
    page.on("dialog", lambda dialog: dialog.accept())
    page.goto(base_url + "#/simulatore")
    page.wait_for_selector("#sim-inizia")
    assert page.evaluate("localStorage.getItem('tecweb.moduloIA')") is None
    tw = [i for i in BANK if i["area"] != 7 and not i["nodo_id"].startswith("ia-")]
    for seed in [1, 2, 3]:
        assert f"{len(tw)} quesiti della banca disponibili" in page.locator(".sim").inner_text()
        imposta_seed(page, str(seed))
        page.click("#sim-inizia")
        page.wait_for_selector(".sim-q")
        sessione = assert_solo_tw(page)
        page.click("#sim-consegna")
        page.wait_for_selector("#sim-report")
        assert_solo_tw(page)
        assert page.locator(".sim-q").count() == len(sessione["prova"]["esercizi"])
        history = page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))")
        assert all(not e["nodo_id"].startswith("ia-") for e in history)
        page.click("#sim-nuova")
        page.wait_for_selector("#sim-inizia")
    context.close()


@pytest.mark.parametrize("consegnata", [False, True])
def test_ia_opt_in_e_sessione_salvata_riaperta_senza_ia(browser, base_url, consegnata):
    context = browser.new_context(viewport=VIEWPORTS["desktop"])
    page = context.new_page()
    page.goto(base_url + "#/simulatore")
    page.wait_for_selector("#sim-inizia")
    page.evaluate("localStorage.setItem('tecweb.moduloIA', '1')")
    page.reload()
    page.wait_for_selector("#sim-inizia")
    assert f"{len(BANK)} quesiti della banca disponibili" in page.locator(".sim").inner_text()
    page.click("#sim-inizia")
    page.wait_for_selector(".sim-q")
    original = page.evaluate("JSON.parse(localStorage.getItem('tecweb:simulatore:v1'))")
    assert any(i["area"] == 7 for i in original["prova"]["esercizi"])
    if consegnata:
        page.click("#sim-consegna")
        page.wait_for_selector("#sim-report")
        assert "Area 7" in page.locator("#sim-report").inner_text()
        original = page.evaluate("JSON.parse(localStorage.getItem('tecweb:simulatore:v1'))")
    history = page.evaluate("localStorage.getItem('ids-kg:esiti-quiz:v1')")
    page.evaluate("localStorage.removeItem('tecweb.moduloIA')")
    page.reload()
    page.wait_for_selector(".sim-q")
    attesi = [i for i in original["prova"]["esercizi"] if i["area"] != 7]
    assert page.locator(".sim-q").count() == len(attesi)
    assert "Area 7" not in page.locator(".sim").inner_text()
    assert page.locator('.sim a[href*="ia-"]').count() == 0
    assert page.evaluate("localStorage.getItem('ids-kg:esiti-quiz:v1')") == history
    page.evaluate("localStorage.setItem('tecweb.moduloIA', '1')")
    page.reload()
    page.wait_for_selector(".sim-q")
    assert page.locator(".sim-q").count() == len(original["prova"]["esercizi"])
    context.close()



def test_cambio_chiave_nella_stessa_pagina_aggiorna_il_perimetro(browser, base_url):
    context, page, errors = apri(browser, base_url, "desktop")
    page.evaluate("""() => {
      const button = document.createElement('button');
      button.id = 'controllo-modulo-test';
      button.textContent = 'Controllo modulo';
      button.addEventListener('click', () => {
        if (localStorage.getItem('tecweb.moduloIA') === '1') localStorage.removeItem('tecweb.moduloIA');
        else localStorage.setItem('tecweb.moduloIA', '1');
      });
      document.body.prepend(button);
    }""")
    page.click("#controllo-modulo-test")
    # Genera con il nuovo perimetro, senza ricaricare pagina o importare codice X5.
    page.on("dialog", lambda dialog: dialog.accept())
    page.click("#sim-nuova")
    page.wait_for_selector("#sim-inizia")
    page.click("#sim-inizia")
    page.wait_for_selector(".sim-q")
    original = page.evaluate("JSON.parse(localStorage.getItem('tecweb:simulatore:v1'))")
    assert any(i["area"] == 7 for i in original["prova"]["esercizi"])
    page.click("#controllo-modulo-test")
    assert page.locator(".sim-q").count() == sum(i["area"] != 7 for i in original["prova"]["esercizi"])
    page.click("#sim-consegna")
    page.wait_for_selector("#sim-report")
    assert "Area 7" not in page.locator(".sim").inner_text()
    assert all(not e["nodo_id"].startswith("ia-") for e in page.evaluate("JSON.parse(localStorage.getItem('ids-kg:esiti-quiz:v1'))"))
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", VIEWPORTS)
def test_seed_in_opzioni_avanzate_chiuse_di_default(browser, base_url, viewport):
    context = browser.new_context(viewport=VIEWPORTS[viewport])
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base_url + "#/simulatore")
    page.wait_for_selector("#sim-inizia")
    avanzate = page.locator("#sim-avanzate")
    assert avanzate.evaluate("d => d.tagName") == "DETAILS"
    assert not avanzate.evaluate("d => d.open")
    assert not page.locator("#sim-seed").is_visible()
    assert page.locator("#sim-avanzate > summary").inner_text().strip() == "Opzioni avanzate"
    page.click("#sim-avanzate > summary")
    assert page.locator("#sim-seed").is_visible()
    page.click("#sim-avanzate > summary")
    assert not page.locator("#sim-seed").is_visible()
    assert not errors, errors
    context.close()
