"""Regressione: nessuna vista principale mostra testo tecnico 'null', 'undefined' o 'NaN'.

Element.append(null) scrive "null" come testo: il difetto era visibile nella
Sessione di oggi con localStorage vuoto. Il controllo gira su telefono e desktop,
con modulo IA nascosto (default) e attivo (tecweb.moduloIA = '1').
"""
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
MODI = {"default": None, "ia-attivo": "1"}

# Testi visibili fuori da codice e campi: un nodo di testo che è solo il token
# è sempre un difetto; nelle parti "di interfaccia" (non lezione/quesiti, dove
# null e undefined possono essere argomento di studio) basta la parola.
SCANSIONE = r"""() => {
  const TOKEN = /^(null|undefined|NaN)$/, PAROLA = /\b(null|undefined|NaN)\b/;
  const CONTENUTO = 'article.lesson, .sim-q, .sim-feedback, .rip-carta, #details section, pre, code, kbd, samp';
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const el = n.parentElement, t = n.nodeValue.trim();
    if (!t || !el || el.closest('script, style, textarea, template, pre, code')) continue;
    if (!el.checkVisibility({ visibilityProperty: true })) continue;
    if (TOKEN.test(t) || (!el.closest(CONTENUTO) && PAROLA.test(t))) out.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}: ${t.slice(0, 80)}`);
  }
  return out;
}"""


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
    with sync_api.sync_playwright() as p:
        instance = p.chromium.launch()
        yield instance
        instance.close()


def pagina(browser, base_url, viewport, modulo_ia):
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile",
                                  has_touch=viewport == "mobile", service_workers="block")
    script = "localStorage.clear();" + (f"localStorage.setItem('tecweb.moduloIA', '{modulo_ia}');" if modulo_ia else "")
    context.add_init_script(f"if (!sessionStorage.getItem('pulito')) {{ {script} sessionStorage.setItem('pulito', '1'); }}")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(base_url)
    page.wait_for_function("() => /nodi visibili/.test(document.querySelector('#count')?.textContent || '')")
    return context, page, errors


def vai(page, base_url, route, selector):
    page.goto(base_url + route)
    page.wait_for_selector(selector, state="visible")
    page.wait_for_timeout(200)


def senza_testo_tecnico(page, vista):
    trovati = page.evaluate(SCANSIONE)
    assert trovati == [], f"{vista}: testo tecnico visibile {trovati}"


@pytest.mark.parametrize("modo", MODI)
@pytest.mark.parametrize("viewport", VIEWPORTS)
def test_viste_principali_senza_null_undefined_nan(browser, base_url, viewport, modo):
    context, page, errors = pagina(browser, base_url, viewport, MODI[modo])
    try:
        assert page.evaluate("localStorage.getItem('tecweb.moduloIA')") == MODI[modo]
        page.wait_for_selector("#today h2")
        senza_testo_tecnico(page, "home")

        # Pannello dettagli di ogni nodo: i nodi foglia (senza "Sblocca") o senza
        # testi di riferimento mostravano "null" come figlio diretto del pannello.
        voci = page.locator("#graph-mobile-list .graph-mobile-item")
        if not voci.first.is_visible():
            page.click("#graph-list-toggle")
        for i in range(voci.count()):
            nodo = voci.nth(i).get_attribute("data-node-id")
            voci.nth(i).click()
            page.wait_for_function("id => document.querySelector('#details:not([hidden]) [data-node], #details:not([hidden])') && "
                                   "document.querySelector('#graph-mobile-list [aria-pressed=\"true\"]')?.dataset.nodeId === id", arg=nodo)
            senza_testo_tecnico(page, f"dettagli {nodo}")

        vai(page, base_url, "#/percorso", "#path .path, ol.path")
        senza_testo_tecnico(page, "percorso")

        nodo = GRAPH["nodi"][0]["id"] if MODI[modo] else next(n["id"] for n in GRAPH["nodi"] if n["area"] != 7)
        vai(page, base_url, f"#/lezione/{nodo}", "#lesson-title")
        senza_testo_tecnico(page, "lezione")

        vai(page, base_url, "#/simulatore", "#sim-inizia")
        senza_testo_tecnico(page, "simulatore (impostazioni)")
        page.select_option("#sim-modalita", "allenamento")
        imposta_seed(page, "1")
        page.click("#sim-inizia")
        page.wait_for_selector(".sim-q")
        senza_testo_tecnico(page, "simulatore (prova)")

        vai(page, base_url, "#/ripasso", "#ripasso-titolo")
        senza_testo_tecnico(page, "ripasso")
        assert errors == []
    finally:
        context.close()
