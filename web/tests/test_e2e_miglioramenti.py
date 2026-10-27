"""Contratti X5 su telefono e desktop, incluso l'uso offline dopo il precache."""
import copy
import datetime as dt
import json
import subprocess
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

sync_api = pytest.importorskip("playwright.sync_api")
WEB = Path(__file__).resolve().parent.parent
GRAPH = json.loads((WEB.parent / "graph/graph.json").read_text(encoding="utf-8"))
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


def controlli(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    return errors


def no_overflow(page):
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")


def graph_con_area_ia():
    graph = copy.deepcopy(GRAPH)
    graph["corso"]["docente"] = "Docente di prova dai metadati"
    node = copy.deepcopy(graph["nodi"][0])
    node.update(id="ia-nodo-di-prova", title="Nodo IA di prova", area=7, prerequisiti=[])
    graph["nodi"].append(node)
    return graph


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_area7_elenco_stati_piano_e_lezioni_sempre_accessibili(browser, base_url, viewport):
    graph = graph_con_area_ia()
    old_id = graph["nodi"][0]["id"]
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile", has_touch=viewport == "mobile", service_workers="block")
    context.add_init_script(f"localStorage.setItem('ids-kg:completati:v1', {json.dumps(json.dumps([old_id]))});")
    page = context.new_page()
    errors = controlli(page)
    page.route("**/graph.json", lambda route: route.fulfill(status=200, content_type="application/json", body=json.dumps(graph, ensure_ascii=False)))
    page.goto(base_url)
    page.wait_for_selector("#resume:not([hidden])")
    assert "Docente di prova dai metadati" in page.inner_text("#course")
    assert "serve per la lode" in page.locator("#filters").text_content()
    if viewport == "desktop":
        assert page.evaluate("window.cyInstance.zoom() * 15 >= 13")
        page.click("#graph-list-toggle")
    assert page.locator("#graph-mobile-list").is_visible()
    assert "serve per la lode" in page.locator("#graph-mobile-list").inner_text()
    page.locator("#graph-legend summary").click()
    page.locator('[data-legend="aree"][data-value="7"]').click()
    assert page.locator("#graph-mobile-list .graph-mobile-item").count() == sum(1 for n in graph["nodi"] if n["area"] == 7)
    assert "Nodo IA di prova" in page.locator("#graph-mobile-list").inner_text()
    page.locator('[data-legend="aree"][data-value="7"]').click()

    data_esame = (dt.date.today() + dt.timedelta(days=10)).isoformat()
    page.locator("#exam-date").fill(data_esame)
    page.locator("#exam-date").press("Tab")
    page.select_option("#today-budget", "50")
    assert "ritmo indicativo" in page.locator("#today").inner_text()
    page.click("#tab-percorso")
    page.locator('input[name="path-mode"][value="guidata"]').check()
    assert page.locator(".step.recommended").count() > 0
    status = page.locator(f"#status-{old_id}")
    assert status.input_value() == "completato"
    status.select_option("so-gia")
    assert page.evaluate("id => !JSON.parse(localStorage.getItem('ids-kg:completati:v1')).includes(id)", old_id)
    page.reload()
    page.wait_for_selector("#resume:not([hidden])")
    assert page.locator("#exam-date").input_value() == data_esame
    page.click("#tab-percorso")
    assert page.locator(f"#status-{old_id}").input_value() == "so-gia"
    # Anche un nodo con prerequisiti mancanti apre direttamente la lezione.
    blocked = next(n for n in graph["nodi"] if any(p["forza"] == "hard" for p in n["prerequisiti"]))
    page.get_by_role("button", name=f"Apri lezione: {blocked['title']}").click()
    page.wait_for_selector("#lesson-title")
    assert page.locator("#lesson-title").inner_text() == blocked["title"]
    no_overflow(page)
    assert not errors, errors
    context.close()


def test_grafo_da_tastiera_e_legenda(browser, base_url):
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    page = context.new_page()
    errors = controlli(page)
    page.goto(base_url)
    page.wait_for_selector("#cy canvas")
    # Solo tastiera dalla pagina, senza focus() o click sul grafo.
    for _ in range(150):
        page.keyboard.press("Tab")
        if page.evaluate("document.activeElement.id") == "cy":
            break
    assert page.evaluate("document.activeElement.id") == "cy"
    page.keyboard.press("ArrowDown")
    page.wait_for_function("document.querySelector('#graph-announcement').textContent.includes('Nodo selezionato')")
    assert page.evaluate("document.activeElement.id") == "cy"
    selected = page.evaluate("window.cyInstance.$(':selected').first().id()")
    page.keyboard.press("Enter")
    page.wait_for_selector("#lesson-title")
    assert f"#/lezione/{selected}" in page.url
    no_overflow(page)
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_tetto_nuove_backup_anki_e_previsione(browser, base_url, viewport, tmp_path):
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile", has_touch=viewport == "mobile", service_workers="block", accept_downloads=True)
    page = context.new_page()
    errors = controlli(page)
    page.goto(base_url)
    page.wait_for_selector("#resume:not([hidden])")
    date = (dt.date.today() + dt.timedelta(days=20)).isoformat()
    page.locator("#exam-date").fill(date)
    page.locator("#exam-date").press("Tab")
    page.locator("#backup-panel summary").click()
    page.set_input_files("#backup-import", {"name": "non-valido.json", "mimeType": "application/json", "buffer": b"{non-json"})
    page.wait_for_function("document.querySelector('#backup-panel [role=status]').textContent.includes('JSON non valido')")
    assert page.evaluate("localStorage.getItem('ids-kg:data-esame:v1')") == date
    with page.expect_download() as saved:
        page.click("#backup-export")
    backup = saved.value
    path = tmp_path / "backup.json"
    backup.save_as(path)
    assert json.loads(path.read_text())["dati"]["ids-kg:data-esame:v1"] == date
    page.evaluate("localStorage.setItem('ids-kg:data-esame:v1', '2027-01-01')")
    page.once("dialog", lambda dialog: dialog.accept())
    page.set_input_files("#backup-import", str(path))
    page.wait_for_function("date => localStorage.getItem('ids-kg:data-esame:v1') === date", arg=date)
    page.wait_for_selector("#exam-date")
    page.goto(base_url + "#/ripasso")
    page.wait_for_selector("#ripasso-limite")
    page.locator("#ripasso-limite").fill("1")
    page.locator("#ripasso-limite").press("Tab")
    assert "di 1" in page.locator("#ripasso-sessione").inner_text()
    page.click("#ripasso-mostra")
    page.click("[data-voto=bene]")
    page.wait_for_selector("#ripasso-fatto")
    page.reload()
    page.wait_for_selector("#ripasso-fatto")
    assert "Nuove disponibili oggi: 0" in page.locator(".rip-filtri-nota").inner_text()
    assert page.locator(".rip-previsione li").count() == 7
    with page.expect_download() as exported:
        page.click("#anki-export")
    path_tsv = tmp_path / "anki.tsv"
    exported.value.save_as(path_tsv)
    lines = path_tsv.read_text(encoding="utf-8").splitlines()
    assert lines[0] == "#separator:tab" and len(lines[3].split("\t")) == 3
    no_overflow(page)
    assert not errors, errors
    context.close()


# Il doppio resta verificato anche dopo il merge; quando X6 è presente si
# esegue lo stesso scenario anche con il suo lettore reale, senza test saltati.
LETTORI_ESITI = ["doppio"] + (["reale"] if (WEB / "modules/simulatore/esiti.js").is_file() else [])


@pytest.mark.parametrize("lettore", LETTORI_ESITI)
def test_esiti_x6_con_doppio_e_regressione(browser, base_url, lettore):
    node_id = GRAPH["nodi"][0]["id"]
    quiz = [{"item_id": "item-a", "nodo_id": node_id, "corretto": True, "modalita": "allenamento", "ts": "2026-01-01T10:00:00Z"}]
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    page = context.new_page()
    errors = controlli(page)
    if lettore == "doppio":
        page.route("**/precache.js", lambda r: r.fulfill(status=200, content_type="application/javascript", body="globalThis.__KG_BUILD__={esitiDisponibili:true};"))
        # Il simulatore X6 importa anche registraEsito dallo stesso modulo:
        # il doppio deve esporre entrambi i nomi del contratto pubblico.
        doppio = """
          export const CHIAVE_ESITI = 'ids-kg:esiti-quiz:v1';
          export function leggiEsiti(s) { return JSON.parse(s.getItem(CHIAVE_ESITI) || '[]'); }
          export function registraEsito(s, e) {
            try { s.setItem(CHIAVE_ESITI, JSON.stringify([...leggiEsiti(s), e].slice(-2000))); return true; }
            catch { return false; }
          }
        """
        page.route("**/modules/simulatore/esiti.js", lambda r: r.fulfill(status=200, content_type="application/javascript", body=doppio))
    page.add_init_script(f"if (!localStorage.getItem('ids-kg:esiti-quiz:v1')) localStorage.setItem('ids-kg:esiti-quiz:v1', {json.dumps(json.dumps(quiz))});")
    page.goto(base_url)
    page.wait_for_function("id => window.cyInstance?.getElementById(id).data('label').includes('Familiare')", arg=node_id)
    errore = {"item_id": "item-b", "nodo_id": node_id, "corretto": False, "modalita": "simulazione", "ts": "2026-01-02T10:00:00Z"}
    result = page.evaluate("""async esito => {
      const { registraEsito, leggiEsiti } = await import('./modules/simulatore/esiti.js');
      return { salvato: registraEsito(localStorage, esito), esiti: leggiEsiti(localStorage) };
    }""", errore)
    assert result["salvato"] and result["esiti"][-1] == errore
    page.locator('#module-nav a[href="#/ripasso"]').click()
    page.wait_for_selector("#ripasso-titolo")
    page.locator("#module-root .module-home").click()
    page.wait_for_function("!document.body.classList.contains('module-mode')")
    page.wait_for_function("id => window.cyInstance?.getElementById(id).data('label').includes('Visto')", arg=node_id)
    assert not errors, errors
    context.close()


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_pwa_offline_grafo_lezione_e_ripasso(browser, base_url, viewport):
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile", has_touch=viewport == "mobile")
    page = context.new_page()
    errors = controlli(page)
    requests = []
    page.on("request", lambda request: requests.append(request.url))
    page.goto(base_url)
    page.wait_for_selector("#resume:not([hidden])")
    page.wait_for_function("navigator.serviceWorker.controller !== null", timeout=30000)
    assert page.evaluate("async () => (await caches.keys()).some(k => k.startsWith('tecweb-kg:'))")
    context.set_offline(True)
    page.reload()
    page.wait_for_selector("#resume:not([hidden])")
    page.wait_for_function("!document.querySelector('#offline-status').hidden")
    assert "offline" in page.locator("#offline-status").inner_text().lower()
    page.goto(base_url + "#/lezione/http-stateless-vs-stateful")
    page.wait_for_selector("#lesson-title")
    page.wait_for_selector("pre.mermaid svg", timeout=30000)
    assert page.locator("pre.mermaid-off").count() == 0
    no_overflow(page)
    page.goto(base_url + "#/ripasso")
    page.wait_for_selector("#ripasso-domanda")
    page.click("#ripasso-mostra")
    assert page.locator("#ripasso-risposta").inner_text().strip()
    no_overflow(page)
    assert all(url.startswith(base_url) or url.startswith("blob:") or url.startswith("data:") for url in requests), requests
    assert not errors, errors
    context.close()


def test_carte_sanguisuga_con_collegamento_al_richiamo(browser, base_url):
    node = next(n for n in GRAPH["nodi"] if n["lezione"].get("richiamo_attivo", {}).get("domande"))
    card_id = f"{node['id']}#domanda-0"
    today = dt.date.today().isoformat()
    dati = {"versione": 1, "carte": {card_id: {"ef": 1.8, "ripetizioni": 0, "intervallo": 0, "scadenza": today,
             "revisioni": 3, "errori": 3, "ultimoVoto": "ancora"}}, "giorni": [today], "filtri": {"area": None, "priorita": None}}
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    context.add_init_script(f"if (!localStorage.getItem('ids.ripasso.v1')) localStorage.setItem('ids.ripasso.v1', {json.dumps(json.dumps(dati))});")
    page = context.new_page()
    errors = controlli(page)
    page.goto(base_url + "#/ripasso")
    page.wait_for_selector(".rip-sanguisughe li")
    assert node["title"] in page.locator(".rip-sanguisughe").inner_text()
    page.get_by_role("link", name="Spiega con parole tue").click()
    page.wait_for_selector("#sec-richiamo")
    assert "?sezione=richiamo" in page.url
    assert page.locator("#lesson-title").inner_text() == node["title"]
    no_overflow(page)
    assert not errors, errors
    context.close()


def test_grafo_cresce_senza_assunzioni_sul_numero_di_nodi(browser, base_url):
    graph = graph_con_area_ia()
    for i in range(20):
        node = copy.deepcopy(graph["nodi"][-1])
        node.update(id=f"ia-prova-{i}", title=f"Nodo IA aggiuntivo {i}", prerequisiti=[])
        graph["nodi"].append(node)
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    page = context.new_page()
    errors = controlli(page)
    page.route("**/graph.json", lambda r: r.fulfill(status=200, content_type="application/json", body=json.dumps(graph, ensure_ascii=False)))
    page.goto(base_url)
    page.wait_for_selector("#cy canvas")
    assert page.evaluate("window.cyInstance.nodes().length") == len(graph["nodi"])
    assert page.evaluate("window.cyInstance.zoom()") >= 0.9
    page.click("#graph-list-toggle")
    assert page.locator("#graph-mobile-list .graph-mobile-item").count() == len(graph["nodi"])
    page.click("#zoom-fit")
    overlaps = page.evaluate("""() => {
      const ns = window.cyInstance.nodes(); let count = 0;
      for (let i=0; i<ns.length; i++) for (let j=i+1; j<ns.length; j++) {
        const a=ns[i].renderedBoundingBox(), b=ns[j].renderedBoundingBox();
        if (a.x1<b.x2 && a.x2>b.x1 && a.y1<b.y2 && a.y2>b.y1) count++;
      }
      return count;
    }""")
    assert overlaps == 0
    no_overflow(page)
    assert not errors, errors
    context.close()


def test_quiz_che_non_risponde_non_blocca_la_lezione(browser, base_url):
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    page = context.new_page()
    errors = controlli(page)
    # La richiesta della banca resta volutamente in sospeso; il grafo è servito normalmente.
    requests = []
    page.route("**/quiz.json", lambda route: requests.append(route))
    page.goto(base_url + "#/lezione/http-stateless-vs-stateful", wait_until="domcontentloaded")
    page.wait_for_selector("#lesson-title", timeout=8000)
    assert page.locator("#lesson-title").inner_text()
    no_overflow(page)
    assert not errors, errors
    requests[0].fulfill(status=200, content_type="application/json", body='{"elementi":[]}')
    context.close()


def test_simulatore_non_blocca_le_altre_viste_quando_quiz_non_risponde(browser, base_url):
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    page = context.new_page()
    errors = controlli(page)
    requests = []
    page.route("**/quiz.json", lambda route: requests.append(route))
    page.goto(base_url + "#/simulatore", wait_until="domcontentloaded")
    page.get_by_role("status").filter(has_text="Caricamento della banca quiz").wait_for()
    # Si può cambiare vista senza attendere la banca; il caricamento tardivo
    # non deve rimontare il simulatore sulla pagina del grafo.
    page.locator("#module-root .module-home").click()
    page.wait_for_function("document.getElementById('module-root').hidden")
    requests[0].fulfill(status=200, content_type="application/json", body='{"elementi":[]}')
    page.wait_for_timeout(100)
    assert page.locator("#module-root").is_hidden()
    page.locator('#module-nav a[href="#/simulatore"]').click()
    page.wait_for_selector("#sim-titolo")
    no_overflow(page)
    assert not errors, errors
    context.close()


def test_simulatore_usa_esercizi_se_banca_quiz_restasse_in_sospeso(browser, base_url):
    context = browser.new_context(viewport=VIEWPORTS["desktop"], service_workers="block")
    page = context.new_page()
    errors = controlli(page)
    requests = []
    page.route("**/quiz.json", lambda route: requests.append(route))
    page.goto(base_url + "#/simulatore", wait_until="domcontentloaded")
    page.wait_for_selector("#sim-inizia", timeout=8000)
    page.click("#sim-inizia")
    page.wait_for_selector("#sim-timer")
    requests[0].fulfill(status=200, content_type="application/json", body='{"elementi":[]}')
    page.wait_for_timeout(100)
    assert page.locator("#sim-timer").is_visible()  # nessun rimontaggio della sessione in corso
    no_overflow(page)
    assert not errors, errors
    context.close()
