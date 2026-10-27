"""Regressioni delle lezioni esistenti: esempi, programma e precedenze.

I dati vengono letti dalle lezioni, non da copie di test. Le verifiche browser
sono offline, salvo quella sul renderer Markdown effettivamente usato dal sito.
"""
import json
import re
import sqlite3
import subprocess
import sys
import threading
import types
from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urljoin

import pytest
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "graph" / "lezioni"
WEB = ROOT / "web"


def lezione(node_id):
    return json.loads((LESSONS / f"{node_id}.json").read_text(encoding="utf-8"))


def blocchi(testo, linguaggio):
    pattern = rf"```{re.escape(linguaggio)}\n(.*?)\n```"
    return re.findall(pattern, testo, re.DOTALL)


def esegui_node(javascript, dati):
    risultato = subprocess.run(
        ["node", "-e", javascript, json.dumps(dati, ensure_ascii=False)],
        check=True, capture_output=True, text=True, timeout=10,
    )
    return json.loads(risultato.stdout)


@pytest.fixture(scope="module")
def browser():
    with sync_playwright() as playwright:
        istanza = playwright.chromium.launch()
        yield istanza
        istanza.close()


@pytest.fixture
def pagina(browser):
    page = browser.new_page()
    yield page
    page.close()


class ServerSilenzioso(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@pytest.fixture(scope="module")
def sito():
    subprocess.run(["sh", str(WEB / "build.sh")], check=True, capture_output=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(ServerSilenzioso, directory=str(WEB)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_address[1]}/"
    server.shutdown()
    thread.join()
    server.server_close()


def test_rdf_soggetto_blank_node_e_turtle_con_prefisso():
    spiegazione = lezione("web-semantico-rdf-owl")["spiegazione"]
    turtle, = blocchi(spiegazione, "turtle")
    assert "soggetto** può essere un IRI o un **blank node**" in spiegazione
    assert "**predicato** è un IRI" in spiegazione
    assert re.search(r"^@prefix ex: <https://example\.org/biblioteca/>\s*\.$", turtle, re.MULTILINE)
    assert re.search(r"^_:[A-Za-z][\w-]*\s+ex:haAutore\s+ex:ada\s*\.$", turtle, re.MULTILINE)
    assert "non sono, da soli, vincoli di validazione" in spiegazione.casefold()


class CarrelloHTML(HTMLParser):
    """Legge dal markup dell'esercizio i valori iniziali usati dal doppio DOM."""

    def __init__(self):
        super().__init__()
        self.in_carrello = False
        self.in_conteggio = False
        self.righe = 0
        self.conteggio = ""
        self.pulsante = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "ul" and attrs.get("id") == "carrello":
            self.in_carrello = True
        elif tag == "li" and self.in_carrello:
            self.righe += 1
        elif tag == "span" and attrs.get("id") == "conteggio":
            self.in_conteggio = True
        elif tag == "button" and attrs.get("id") == "aggiungi":
            self.pulsante = True

    def handle_endtag(self, tag):
        if tag == "ul":
            self.in_carrello = False
        elif tag == "span":
            self.in_conteggio = False

    def handle_data(self, data):
        if self.in_conteggio:
            self.conteggio += data


def test_dom_esempio_js_in_node_aggiunge_terza_riga():
    esempio = lezione("dom-virtual-dom")["worked_example"]
    markup, = blocchi(esempio["problema"], "html")
    codice, = blocchi(esempio["soluzione"], "javascript")
    parser = CarrelloHTML()
    parser.feed(markup)
    assert parser.pulsante and (parser.righe, parser.conteggio.strip()) == (2, "2")

    driver = """
const iniziale = JSON.parse(process.argv[1]);
const lista = {
  children: Array.from({length: iniziale.righe}, () => ({tagName: 'li'})),
  appendChild(item) { this.children.push(item); }
};
const contatore = {textContent: iniziale.conteggio};
const bottone = {addEventListener(tipo, callback) {
  if (tipo !== 'click') throw new Error('evento inatteso');
  this.click = callback;
}};
const elementi = {carrello: lista, conteggio: contatore, aggiungi: bottone};
const document = {
  getElementById(id) { return elementi[id]; },
  createElement(tagName) { return {tagName, textContent: ''}; }
};
""" + codice + """
bottone.click();
console.log(JSON.stringify({righe: lista.children.length,
  conteggio: contatore.textContent, ultima: lista.children.at(-1)}));
"""
    risultato = esegui_node(driver, {"righe": parser.righe, "conteggio": parser.conteggio.strip()})
    assert risultato == {"righe": 3, "conteggio": "3", "ultima": {"tagName": "li", "textContent": "Dune - 14,90 euro"}}
    assert "tre `li`" in esempio["soluzione"]
    assert "non garantisce il minimo globale" in lezione("dom-virtual-dom")["spiegazione"]


def test_dom_esempio_nel_browser(pagina):
    esempio = lezione("dom-virtual-dom")["worked_example"]
    markup, = blocchi(esempio["problema"], "html")
    codice, = blocchi(esempio["soluzione"], "javascript")
    pagina.set_content(markup)
    pagina.add_script_tag(content=codice)
    assert pagina.locator("#carrello > li").count() == 2
    assert pagina.locator("#conteggio").inner_text() == "2"
    pagina.locator("#aggiungi").click()
    assert pagina.locator("#carrello > li").count() == 3
    assert pagina.locator("#conteggio").inner_text() == "3"


def test_uri_riferimento_relativo_non_e_urn():
    testo = lezione("uri-url-urn-differenze")["spiegazione"]
    assert "un URN è un esempio di URI" in testo
    assert "un URN o un riferimento relativo" not in testo
    assert "non è un URI nella grammatica formale" in testo
    assert urljoin("https://biblioteca.example/", "/catalogo/libri/42") == "https://biblioteca.example/catalogo/libri/42"
    assert "diventa `https://biblioteca.example/catalogo/libri/42`" in testo


@pytest.mark.parametrize("primo,secondo,atteso", [(30, 20, 30), (20, -8, 12), (-20, -8, -20)])
def test_css_margin_collapsing_nel_browser(pagina, primo, secondo, atteso):
    testo = lezione("css-box-model")["spiegazione"]
    assert "20px e −8px" in testo and "12px" in testo
    assert "−20px e −8px" in testo and "−20px" in testo
    pagina.set_content(f"""
      <div id="contenitore">
        <div id="primo" style="height:10px; margin-bottom:{primo}px"></div>
        <div id="secondo" style="height:10px; margin-top:{secondo}px"></div>
      </div>
    """)
    distanza = pagina.evaluate("""() => {
      const a = document.querySelector('#primo').getBoundingClientRect();
      const b = document.querySelector('#secondo').getBoundingClientRect();
      return b.top - a.bottom;
    }""")
    assert distanza == atteso


def test_404_tabella_markdown_renderizzata(pagina, sito):
    spiegazione = lezione("codice-404-not-found")["spiegazione"]
    assert "\\n" not in spiegazione
    assert "| Caso | Stato tipico | Perché |\n|---|---|---|" in spiegazione
    pagina.goto(f"{sito}#/lezione/codice-404-not-found")
    tabella = pagina.locator(".spiegazione .md table").first
    tabella.wait_for(timeout=20000)
    assert tabella.locator("thead th").all_inner_texts() == ["Caso", "Stato tipico", "Perché"]
    assert tabella.locator("tbody tr").count() == 5
    assert "404" in tabella.locator("tbody tr").nth(1).inner_text()


def test_form_checkbox_invio_e_tastiera(pagina):
    esempio = lezione("html-form-accessibilita")["worked_example"]
    markup, = blocchi(esempio["soluzione"], "html")
    pagina.set_content(markup)
    checkbox = pagina.locator('input[name="newsletter"]')
    dati = "() => Object.fromEntries(new FormData(document.querySelector('form')))"
    assert not checkbox.is_checked()
    assert "newsletter" not in pagina.evaluate(dati)
    checkbox.focus()
    pagina.keyboard.press("Space")
    assert checkbox.is_checked()
    assert pagina.evaluate(dati)["newsletter"] == "si"
    pagina.keyboard.press("Space")
    assert "newsletter" not in pagina.evaluate(dati)
    assert "non selezionata non viene inviata" in esempio["problema"]
    espressione = re.search(r'`(newsletter = request\.form\.get\("newsletter"\) == "si")`', esempio["soluzione"])
    assert espressione
    for form, atteso in (({}, False), ({"newsletter": "si"}, True)):
        scope = {"request": types.SimpleNamespace(form=form)}
        exec(espressione.group(1), scope)
        assert scope["newsletter"] is atteso


def merge_patch(target, patch):
    """Algoritmo RFC 7396, usato come oracolo per gli esempi della lezione."""
    if not isinstance(patch, dict):
        return patch
    risultato = dict(target) if isinstance(target, dict) else {}
    for key, value in patch.items():
        if value is None:
            risultato.pop(key, None)
        else:
            risultato[key] = merge_patch(risultato.get(key), value)
    return risultato


def test_rest_merge_patch_rimuove_null_e_sostituisce_array():
    spiegazione = lezione("rest-metodi-http")["spiegazione"]
    prima, dopo = [json.loads(x) for x in blocchi(spiegazione, "json")]
    patch = json.loads(re.search(r'La patch `({[^`]+})`', spiegazione).group(1))
    assert "application/merge-patch+json" in spiegazione
    assert prima == {"titolo": "A", "note": "x", "tag": ["a", "b"]}
    assert merge_patch(prima, patch) == dopo == {"titolo": "A", "tag": ["c"]}
    assert "Altri formati di patch hanno regole differenti" in spiegazione
    esercizio = lezione("rest-metodi-http")["esercizio_autonomo"]
    esempi = [json.loads(x) for x in re.findall(r'\{[^{}]*\}', esercizio["testo"])]
    assert merge_patch(*esempi) == {"titolo": "B", "tag": ["d"]}


def test_css_layer_precede_specificita_e_inverte_important(pagina):
    spiegazione = lezione("css-origini-ereditarieta")["spiegazione"]
    css, = [x for x in blocchi(spiegazione, "css") if "@layer" in x]
    assert "prossimità di scope" in spiegazione.casefold()
    pagina.set_content('<p id="prezzo" class="prezzo">9,90 euro</p><style></style>')

    def colore(regole):
        pagina.locator("style").evaluate("(el, css) => el.textContent = css", regole)
        return pagina.locator("#prezzo").evaluate("el => getComputedStyle(el).color")

    assert colore(css) == "rgb(0, 0, 255)"  # tema: blue nonostante l'ID in base
    assert colore(css + "\n.prezzo { color: green; }") == "rgb(0, 128, 0)"
    importanti = css.replace("color: red;", "color: red !important;").replace("color: blue;", "color: blue !important;")
    assert colore(importanti) == "rgb(255, 0, 0)"  # base: primo layer con !important
    assert colore(importanti + "\n.prezzo { color: green !important; }") == "rgb(255, 0, 0)"

    esercizio, = blocchi(lezione("css-origini-ereditarieta")["esercizio_autonomo"]["testo"], "css")
    pagina.set_content('<p id="nome" class="nome">Ada</p><style></style>')
    pagina.locator("style").evaluate("(el, css) => el.textContent = css", esercizio)
    nome = pagina.locator("#nome")
    assert nome.evaluate("el => getComputedStyle(el).color") == "rgb(255, 165, 0)"
    pagina.locator("style").evaluate("(el, css) => el.textContent = css", esercizio.replace(" !important", ""))
    assert nome.evaluate("el => getComputedStyle(el).color") == "rgb(128, 0, 128)"


def test_sparql_binding_e_optional_filter_interni_ed_esterni():
    spiegazione = lezione("sparql-query-esempi")["spiegazione"]
    turtle, = blocchi(spiegazione, "turtle")
    select, interno, esterno = blocchi(spiegazione, "sparql")
    assert 'ex:libro1 a ex:Libro' in turtle and 'ex:sottotitolo "Guida pratica"' in turtle
    assert 'ex:libro2 a ex:Libro' in turtle
    assert "FILTER(?anno >= 2020)" in select
    assert '| ex:libro1 | "Il Web" | ex:ada | 2021 |' in spiegazione
    assert re.search(r"OPTIONAL\s*\{[^}]*FILTER\([^}]+\)[^}]*\}", interno, re.DOTALL)
    assert re.search(r"OPTIONAL\s*\{[^}]+\}\s*FILTER\(", esterno, re.DOTALL)
    assert '| ex:libro2 | non legata |' in spiegazione
    parte_esterna = spiegazione.split("Spostando lo stesso filtro **fuori**", 1)[1]
    assert '| ex:libro1 | "Guida pratica" |' in parte_esterna
    assert '| ex:libro2 | non legata |' not in parte_esterna
    assert "variabile non legata" in parte_esterna
    esercizio = lezione("sparql-query-esempi")["esercizio_autonomo"]
    query, = blocchi(esercizio["soluzione_attesa"], "sparql")
    assert re.search(r"OPTIONAL\s*\{[^}]+\}\s*FILTER\(BOUND\(\?sottotitolo\)\)", query)
    assert 'soltanto `ex:libro1` con "Guida pratica"' in esercizio["soluzione_attesa"]


def test_percorso_flask_sqlite_esegue_query_e_controlla_status(tmp_path, monkeypatch, pagina):
    spiegazione = lezione("architettura-3-tier")["spiegazione"]
    codice, = blocchi(spiegazione, "python")
    client, = blocchi(spiegazione, "javascript")
    assert "WHERE id = ?" in codice and "(book_id,)" in codice
    assert "browser (presentazione) → route" in spiegazione

    class FlaskFinto:
        def __init__(self, nome):
            self.nome = nome

        def get(self, route):
            assert route == "/api/libri/<int:book_id>"
            return lambda funzione: funzione

    def jsonify_finto(*args, **kwargs):
        return args[0] if args else kwargs

    flask = types.ModuleType("flask")
    flask.Flask = FlaskFinto
    flask.jsonify = jsonify_finto
    monkeypatch.setitem(sys.modules, "flask", flask)
    monkeypatch.chdir(tmp_path)
    with sqlite3.connect("biblioteca.db") as conn:
        conn.execute("CREATE TABLE libri (id INTEGER PRIMARY KEY, titolo TEXT NOT NULL)")
        conn.execute("INSERT INTO libri (id, titolo) VALUES (?, ?)", (42, "Il Web"))
    namespace = {}
    exec(codice, namespace)
    leggi = namespace["leggi_libro"]
    assert leggi(42) == ({"id": 42, "titolo": "Il Web"}, 200)
    assert leggi(99) == ({"errore": "libro non trovato"}, 404)
    assert leggi(0) == ({"errore": "identificatore non valido"}, 400)

    # La route HTTP è simulata, ma esegue il codice reale con SQLite; il
    # browser esegue lo script originale, inclusa l'invocazione di mostraLibro.
    def instrada(route):
        if route.request.url.endswith("/api/libri/42"):
            dati, status = leggi(42)
            route.fulfill(status=status, json=dati)
        else:
            route.fulfill(content_type="text/html", body=f'<p id="titolo"></p><script>{client}</script>')

    pagina.route("https://biblioteca.example/**", instrada)
    pagina.goto("https://biblioteca.example/")
    pagina.wait_for_function("document.getElementById('titolo').textContent === 'Il Web'")
    assert pagina.locator("#titolo").inner_text() == "Il Web"

    driver = """
const dati = JSON.parse(process.argv[1]);
const titolo = {textContent: ''};
const document = {getElementById(id) { if (id !== 'titolo') throw new Error(id); return titolo; }};
async function fetch(url) {
  if (url !== '/api/libri/42') throw new Error(url);
  return {ok: dati.status === 200, status: dati.status, async json() { return dati.libro; }};
}
""" + client + """
mostraLibro().then(() => console.log(JSON.stringify({titolo: titolo.textContent})))
  .catch(e => console.log(JSON.stringify({errore: e.message})));
"""
    assert esegui_node(driver, {"status": 200, "libro": {"titolo": "Il Web"}}) == {"titolo": "Il Web"}
    assert esegui_node(driver, {"status": 404, "libro": {}}) == {"errore": "HTTP 404"}


def test_web_3_non_attribuito_al_corso():
    lezione_web = lezione("web-1-0-2-0-3-0-4-0")
    testo = json.dumps(lezione_web, ensure_ascii=False)
    assert "convenzione di questa lezione" in testo
    assert "non una definizione attribuita al corso" in testo
    assert "Tim Berners-Lee" in testo and "W3C nel 2009" in testo
    assert "R2 §2, fonte 36" in testo
    assert "Web3" in testo and "blockchain" in testo and "R2 §3, fonte 51" in testo
    assert "nel quadro del corso" not in testo.casefold()
    assert "nel materiale del corso" not in testo.casefold()
    assert "[F1]" in testo


GRUPPI = {
    "A": {
        "http-protocollo-base", "http-stateless-vs-stateful", "tcp-ip-modello-livelli",
        "http-1-1-1-2-3-differenze", "uri-url-urn-differenze", "cookie-sessioni-gestione-stato",
        "codici-stato-http", "statico-vs-dinamico", "architettura-3-tier", "rest-principi",
        "rest-metodi-http", "codice-404-not-found", "api-design-best-practice",
        "html-form-accessibilita", "css-box-model", "css-origini-ereditarieta", "dom-virtual-dom",
        "javascript-fetch-async-await", "flask-rotte-jsonify", "flask-request-response",
        "git-comandi-base", "json-formato-dati", "ajax-fetch-xhr", "tesina-progetto-flask-crud",
        "tesina-presentazione-8-minuti", "tesina-domande-revisione-codice", "tesina-esercitazione-guidata",
    },
    "B": {
        "quic-protocollo", "multiplexing-http-2-3", "eventi-locali-vs-remoti", "rate-limiting-sicurezza",
        "sqlite-crud", "quiz-form", "web-1-0-2-0-3-0-4-0",
    },
    "C": {
        "web-semantico-rdf-owl", "sparql-query-esempi", "canvas-api", "dhtml-dynamic-html",
        "span-tag-uso", "motore-js-parser-ast-jit",
    },
}


@pytest.mark.parametrize("gruppo,node_id", [(gruppo, node_id) for gruppo, ids in GRUPPI.items() for node_id in sorted(ids)])
def test_priorita_testuale_allineata_al_piano(gruppo, node_id):
    testo = lezione(node_id)["perche_ti_serve"]
    assert f"Gruppo {gruppo}" in testo
    assert "[F1]" in testo
    assert 20 <= len(testo) <= 200


def test_nessuna_pretesa_di_prove_passate_o_punteggi_per_nodo():
    vietati = re.compile(r"esami passati|prove passate|iper.riciclat|punti ciechi|\b(?:65|20|15)%|\b\d+\s*(?:[-–]\s*\d+\s*)?punti\b", re.I)
    for ids in GRUPPI.values():
        for node_id in ids:
            testo = json.dumps(lezione(node_id), ensure_ascii=False)
            assert not vietati.search(testo), node_id


@pytest.mark.parametrize("node_id", sorted(n for n in GRUPPI["A"] if n.startswith("tesina-")))
def test_tesina_fatti_ufficiali_e_scelta_libera(node_id):
    testo = lezione(node_id)["spiegazione"]
    assert "individuale" in testo and "circa tre settimane" in testo
    assert "tecnologie a libera scelta" in testo
    assert "PowerPoint di massimo 8 minuti" in testo
    assert "discussione delle scelte progettuali e del codice [F1]" in testo
    assert "non un obbligo del programma" in testo
    assert not re.search(r"\b(?:2|due) ore\b", testo, re.I)
    for riga in testo.splitlines():
        if re.search(r"\b(?:4|quattro) slide\b", riga, re.I):
            assert "IPOTESI" in riga


def test_event_driven_e_solo_un_rimando_testuale():
    eventi = lezione("eventi-locali-vs-remoti")
    assert "`sviluppo-event-driven`" in eventi["spiegazione"]
    assert all(c["nodo"] != "sviluppo-event-driven" for c in eventi["richiamo_attivo"]["collegamenti_interleaving"])
