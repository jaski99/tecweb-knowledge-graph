"""Il secondo modulo è facoltativo nell'interfaccia di studio, su telefono e desktop."""
import copy
import datetime as dt
import json
import re
import subprocess
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

sync_api = pytest.importorskip("playwright.sync_api")
WEB = Path(__file__).resolve().parent.parent
GRAPH = json.loads((WEB.parent / "graph/graph.json").read_text(encoding="utf-8"))
TW = [n for n in GRAPH["nodi"] if n["area"] != 7]
IA = [n for n in GRAPH["nodi"] if n["area"] == 7]
IA_INTRO = next(n for n in IA if n["id"] == "ia-introduzione-apprendimento")
VIEWPORTS = {"mobile": {"width": 390, "height": 844}, "desktop": {"width": 1440, "height": 900}}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@pytest.fixture(scope="module")
def base_url():
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


def nuovo_contesto(browser, viewport, **options):
    return browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile",
                               has_touch=viewport == "mobile", **options)


def errori_js(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    return errors


def wait_count(page, totale):
    page.wait_for_function("n => document.querySelector('#count')?.textContent === `${n}/${n} nodi visibili`", arg=totale)


def attiva_elenco(page, viewport):
    if viewport == "desktop" and not page.locator("#graph-mobile-list").is_visible():
        page.click("#graph-list-toggle")
    assert page.locator("#graph-mobile-list").is_visible()


def cambia_modulo(page, attivo, tastiera=False):
    if not page.locator("#backup-panel").evaluate("e => e.open"):
        page.locator("#backup-panel summary").click()
    checkbox = page.get_by_role("checkbox", name="Modulo IA (secondo semestre)")
    assert checkbox.is_checked() is not attivo
    with page.expect_navigation(wait_until="load"):
        if tastiera:
            checkbox.focus()
            checkbox.press("Space")
        else:
            checkbox.click()
    wait_count(page, len(GRAPH["nodi"]) if attivo else len(TW))
    assert page.evaluate("localStorage.getItem('tecweb.moduloIA')") == ("1" if attivo else "0")


def nessun_contenuto_ia(page, selectors):
    pattern = re.compile(r"\bIA\b|intelligenza artificiale|apprendimento automatico|\bia-[a-z]", re.I)
    for selector in selectors:
        text = page.locator(selector).text_content() or ""
        assert not pattern.search(text), (selector, text)


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_default_filtro_tutte_le_viste_e_switch_persistente(browser, base_url, viewport):
    context = nuovo_contesto(browser, viewport, service_workers="block")
    page = context.new_page()
    errors = errori_js(page)
    page.goto(base_url)
    wait_count(page, len(TW))
    assert page.evaluate("localStorage.getItem('tecweb.moduloIA')") is None
    assert page.locator('#filters [data-filter-group="aree"][data-filter-value="7"]').count() == 0
    assert page.locator('#graph-legend [data-legend="aree"][data-value="7"]').count() == 0
    assert page.locator("#progress .prog").count() == len([a for a in GRAPH["aree"] if a["id"] != 7]) + 1
    assert f"0/{len(TW)} · 0%" in page.locator("#progress").text_content()
    assert set(page.evaluate("window.cyInstance.nodes().map(n => n.id())")) == {n["id"] for n in TW}
    attiva_elenco(page, viewport)
    assert set(page.locator("#graph-mobile-list .graph-mobile-item").evaluate_all("xs => xs.map(x => x.dataset.nodeId)")) == {n["id"] for n in TW}
    assert page.locator("#path .path > li").count() == len(TW)
    nessun_contenuto_ia(page, ["#course", "#exam-note", "#filters", "#progress", "#today", "#graph-legend", "#graph-mobile-list", "#path", "#review"])
    assert "TW prevede scritto" in page.locator("#exam-note").text_content()

    # La ricerca non trova i nodi nascosti, anche se ne conosciamo il titolo.
    if viewport == "mobile":
        page.locator(".side details").first.locator("summary").click()
    page.locator("#search").fill("supervisionato classificazione lineare")
    page.wait_for_function("document.querySelector('#count').textContent.startsWith('0/')")
    assert page.locator("#graph-mobile-list .graph-mobile-item").count() == 0
    page.locator("#search").fill("")
    wait_count(page, len(TW))

    page.goto(base_url + "#/ripasso")
    page.wait_for_selector("#ripasso-titolo")
    nuove_tw = int(page.locator("#ripasso-nuove").inner_text())
    assert page.locator(".rip-area").count() == len(GRAPH["aree"]) - 1
    assert page.locator('#ripasso-filtro-area option[value="7"]').count() == 0
    nessun_contenuto_ia(page, ["#module-root"])

    page.goto(base_url)
    wait_count(page, len(TW))
    cambia_modulo(page, True, tastiera=True)
    assert page.locator('#filters [data-filter-group="aree"][data-filter-value="7"]').count() == 1
    assert page.locator('#graph-legend [data-legend="aree"][data-value="7"]').count() == 1
    assert f"0/{len(GRAPH['nodi'])} · 0%" in page.locator("#progress").text_content()
    assert page.locator("#path .path > li").count() == len(GRAPH["nodi"])
    assert IA_INTRO["title"] in page.locator("#path").text_content()
    assert "IA prevede quiz" in page.locator("#exam-note").text_content()
    assert set(page.evaluate("window.cyInstance.nodes().map(n => n.id())")) == {n["id"] for n in GRAPH["nodi"]}
    attiva_elenco(page, viewport)
    assert page.locator(f"#graph-mobile-list [data-node-id='{IA_INTRO['id']}']").count() == 1
    if viewport == "mobile":
        page.locator(".side details").first.locator("summary").click()
    page.locator('#filters [data-filter-group="aree"][data-filter-value="7"]').check()
    page.wait_for_function("n => document.querySelector('#graph-mobile-list .graph-mobile-items').children.length === n", arg=len(IA))
    assert page.locator("#path .path > li").count() == len(IA)
    page.locator('#filters [data-filter-group="aree"][data-filter-value="7"]').uncheck()
    wait_count(page, len(GRAPH["nodi"]))
    page.locator("#search").fill("supervisionato classificazione lineare")
    page.wait_for_selector("#graph-mobile-list [data-node-id='ia-supervisionato-classificazione-lineare']")
    page.wait_for_function("n => document.querySelector('#count').textContent !== `${n}/${n} nodi visibili`", arg=len(GRAPH["nodi"]))
    assert page.locator("#graph-mobile-list [data-node-id='ia-supervisionato-classificazione-lineare']").count() == 1
    page.goto(base_url + "#/ripasso")
    page.wait_for_selector("#ripasso-titolo")
    assert page.locator(".rip-area").count() == len(GRAPH["aree"])
    assert int(page.locator("#ripasso-nuove").inner_text()) > nuove_tw
    page.select_option("#ripasso-filtro-area", "7")
    assert "IA:" in page.locator(".rip-nodo").inner_text()

    page.goto(base_url)
    wait_count(page, len(GRAPH["nodi"]))
    cambia_modulo(page, False)
    page.reload()
    wait_count(page, len(TW))
    assert page.evaluate("localStorage.getItem('tecweb.moduloIA')") == "0"
    assert page.locator(f"#graph-mobile-list [data-node-id='{IA_INTRO['id']}']").count() == 0
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_link_diretto_mostra_avviso_e_pulsante_che_apre_la_lezione(browser, base_url, viewport):
    context = nuovo_contesto(browser, viewport, service_workers="block")
    page = context.new_page()
    errors = errori_js(page)
    page.goto(base_url + "#/lezione/" + IA_INTRO["id"])
    page.wait_for_selector("#attiva-modulo-ia")
    assert page.locator("#lesson-title").inner_text() == "Modulo IA (secondo semestre) disattivato"
    assert page.evaluate("document.activeElement.id") == "lesson-title"
    assert IA_INTRO["title"] not in page.locator("#lesson").inner_text()
    with page.expect_navigation(wait_until="load"):
        page.locator("#attiva-modulo-ia").click()
    page.wait_for_function("title => document.querySelector('#lesson-title')?.textContent === title", arg=IA_INTRO["title"])
    assert page.evaluate("localStorage.getItem('tecweb.moduloIA')") == "1"
    assert page.url.endswith("#/lezione/" + IA_INTRO["id"])
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_stati_ia_nascosti_non_alterano_quote_e_sopravvivono_agli_azzeramenti(browser, base_url, viewport):
    oggi = dt.date.today().isoformat()
    web = next(n for n in TW if n["checklist_ripasso"])
    ia_key = IA_INTRO["id"] + "#domanda-0"
    web_key = web["id"] + "#domanda-0"
    stato = {"ef": 2.5, "ripetizioni": 1, "intervallo": 1, "scadenza": oggi,
             "revisioni": 1, "errori": 0, "ultimoVoto": "bene"}
    ripasso = {"versione": 1, "carte": {ia_key: stato, web_key: stato}, "giorni": [oggi],
               "filtri": {"area": 7, "priorita": None}, "limiteNuove": 2,
               "nuovePerGiorno": {oggi: [ia_key, web_key]}}
    checklist = [f"{IA_INTRO['id']}#0", f"{web['id']}#0", "trappola#3", "trappola#5"]
    iniziali = {"ids.ripasso.v1": json.dumps(ripasso), "ids-kg:ripasso:v1": json.dumps(checklist),
                "ids-kg:completati:v1": json.dumps([IA_INTRO["id"]])}
    context = nuovo_contesto(browser, viewport, service_workers="block")
    context.add_init_script("const seed = " + json.dumps(iniziali) + "; for (const [k,v] of Object.entries(seed)) if (!localStorage.getItem(k)) localStorage.setItem(k,v);")
    page = context.new_page()
    errors = errori_js(page)
    page.on("dialog", lambda dialog: dialog.accept())
    page.goto(base_url)
    wait_count(page, len(TW))
    assert f"0/{len(TW)} · 0%" in page.locator("#progress").text_content()
    assert "1 carte dovute e 1 nuove disponibili" in page.locator("#today").text_content()
    page.locator("#tab-ripasso").click()
    page.get_by_role("button", name="Azzera checklist di ripasso").click()
    salvata = page.evaluate("JSON.parse(localStorage.getItem('ids-kg:ripasso:v1'))")
    assert sorted(salvata) == sorted([f"{IA_INTRO['id']}#0", "trappola#3"])

    page.goto(base_url + "#/ripasso")
    page.wait_for_selector("#ripasso-domanda")
    assert page.locator("#ripasso-filtro-area").input_value() == ""
    assert page.locator("#ripasso-serie").count() == 0  # La vecchia cronologia non distingue i moduli.
    assert "Nuove disponibili oggi: 1." in page.locator(".rip-filtri-nota").inner_text()
    assert page.locator("#ripasso-dovute").inner_text() == "1"
    nessun_contenuto_ia(page, ["#module-root"])
    page.click("#ripasso-azzera")
    salvato = page.evaluate("JSON.parse(localStorage.getItem('ids.ripasso.v1'))")
    assert salvato["carte"] == {ia_key: stato}
    assert salvato["nuovePerGiorno"][oggi] == [ia_key]
    assert salvato["giorni"] == [oggi]
    assert page.evaluate("JSON.parse(localStorage.getItem('ids-kg:completati:v1'))") == [IA_INTRO["id"]]

    page.goto(base_url)
    wait_count(page, len(TW))
    cambia_modulo(page, True)
    assert f"1/{len(GRAPH['nodi'])}" in page.locator("#progress").text_content()
    page.locator("#tab-ripasso").click()
    assert page.locator(".traps input").nth(3).is_checked()
    assert page.locator("#review").get_by_text(IA_INTRO["title"], exact=True).count() == 1
    page.goto(base_url + "#/ripasso")
    page.wait_for_selector("#ripasso-titolo")
    assert page.locator("#ripasso-dovute").inner_text() == "1"
    assert page.locator("#ripasso-serie").inner_text() == "1"
    assert page.locator(".rip-area[data-area='7']").count() == 1
    assert not errors, errors
    context.close()


def test_prerequisito_futuro_ia_non_blocca_ne_mostra_collegamenti_tw(browser, base_url):
    graph = copy.deepcopy(GRAPH)
    web = next(n for n in graph["nodi"] if n["id"] == "http-protocollo-base")
    web["prerequisiti"].append({"id": IA_INTRO["id"], "forza": "hard", "motivo": "Prerequisito IA di prova"})
    web["lezione"]["richiamo_attivo"].setdefault("collegamenti_interleaving", []).append(
        {"nodo": IA_INTRO["id"], "collegamento": "Collegamento IA di prova"})
    context = nuovo_contesto(browser, "desktop", service_workers="block")
    page = context.new_page()
    errors = errori_js(page)
    page.route("**/graph.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(graph, ensure_ascii=False)))
    page.goto(base_url)
    wait_count(page, len(TW))
    assert page.evaluate("id => window.cyInstance.edges().some(e => e.source().id() === id || e.target().id() === id)", IA_INTRO["id"]) is False
    page.click("#tab-percorso")
    row = page.locator(f"#chk-{web['id']}").locator("xpath=..")
    assert "prerequisiti mancanti" not in row.inner_text()
    row.get_by_role("button", name=f"Apri lezione: {web['title']}").click()
    page.wait_for_selector("#lesson-title")
    assert page.locator("#lesson-title").inner_text() == web["title"]
    assert IA_INTRO["title"] not in page.locator("#lesson").inner_text()
    assert "Collegamento IA di prova" not in page.locator("#lesson").inner_text()
    assert page.locator("#sec-prereq").count() == 0
    page.goto(base_url)
    wait_count(page, len(TW))
    cambia_modulo(page, True)
    page.goto(base_url + "#/lezione/" + web["id"])
    page.wait_for_selector("#sec-prereq")
    assert IA_INTRO["title"] in page.locator("#sec-prereq").inner_text()
    assert "Collegamento IA di prova" in page.locator("#sec-richiamo").inner_text()
    assert not errors, errors
    context.close()


def test_attivazione_dal_link_diretto_se_storage_non_salva(browser, base_url):
    context = nuovo_contesto(browser, "desktop", service_workers="block")
    context.add_init_script("""const originale = Storage.prototype.setItem;
      Storage.prototype.setItem = function(k, v) { if (k === 'tecweb.moduloIA') throw new Error('quota'); return originale.call(this, k, v); };""")
    page = context.new_page()
    errors = errori_js(page)
    page.goto(base_url + "#/lezione/" + IA_INTRO["id"])
    page.wait_for_selector("#attiva-modulo-ia")
    page.click("#attiva-modulo-ia")
    assert "non permette di salvare" in page.locator("#lesson [role='status']").inner_text()
    assert page.locator("#lesson-title").inner_text() == "Modulo IA (secondo semestre) disattivato"
    page.goto(base_url)
    wait_count(page, len(TW))
    page.locator("#backup-panel summary").click()
    page.locator("#modulo-ia-toggle").click()
    assert "non permette di salvare" in page.locator("#backup-panel [role='status']").inner_text()
    assert not page.locator("#modulo-ia-toggle").is_checked()
    assert not errors, errors
    context.close()


def test_switch_si_sincronizza_tra_schede(browser, base_url):
    context = nuovo_contesto(browser, "desktop", service_workers="block")
    page, seconda = context.new_page(), context.new_page()
    errors = errori_js(page)
    altri_errori = errori_js(seconda)
    page.goto(base_url)
    seconda.goto(base_url)
    wait_count(page, len(TW))
    wait_count(seconda, len(TW))
    cambia_modulo(page, True)
    wait_count(seconda, len(GRAPH["nodi"]))
    cambia_modulo(page, False)
    wait_count(seconda, len(TW))
    assert not errors and not altri_errori, (errors, altri_errori)
    context.close()


def test_switch_ia_funziona_anche_offline_dopo_il_precache(browser, base_url):
    context = nuovo_contesto(browser, "desktop")
    page = context.new_page()
    errors = errori_js(page)
    page.goto(base_url)
    wait_count(page, len(TW))
    page.wait_for_function("navigator.serviceWorker.controller !== null", timeout=30000)
    context.set_offline(True)
    cambia_modulo(page, True)
    page.goto(base_url + "#/lezione/" + IA_INTRO["id"])
    page.wait_for_function("title => document.querySelector('#lesson-title')?.textContent === title", arg=IA_INTRO["title"])
    assert not errors, errors
    context.close()
