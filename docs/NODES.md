# Catalogo dei nodi e priorità

Il grafo contiene **56 nodi presenti con lezione**, distribuiti in sette aree. Gli 8 nodi TW di X2 sono nei part `area-2-r2.json`, `area-3-r2.json` e `area-4-r2.json`; gli 8 nodi IA di X3 sono in `area-7.json`. I prerequisiti puntano al nodo da studiare prima; hard e soft partecipano entrambi all’ordine topologico.

## Legenda

- **A — alta**: tema esplicitamente elencato nel programma ufficiale [F1] o indispensabile per scritto/tesina.
- **B — media**: approfondimento o contesto utile.
- **C — bassa**: argomento non elencato nel programma 2026/27 o opzionale.

I gruppi sono **priorità di studio**, non percentuali o frequenze accertate delle domande. Le tecnologie della tesina sono a libera scelta; Flask e CRUD sono esempi, non obblighi [F1]. Il modulo IA è parte dell’integrato, non opzionale; l’area 7 raccoglie i suoi nodi di studio.

## Riepilogo per area

| Area | Nodi presenti | A | B | C | Stima di studio |
|---|---:|---:|---:|---:|---:|
| 1 — Fondamenti rete e HTTP | 10 | 8 | 2 | 0 | 7 h 00 min |
| 2 — Architetture | 8 | 7 | 1 | 0 | 5 h 45 min |
| 3 — Front-end | 14 | 7 | 3 | 4 | 9 h 05 min |
| 4 — Back-end e strumenti | 8 | 7 | 1 | 0 | 6 h 25 min |
| 5 — Web semantico ed evoluzione | 3 | 1 | 0 | 2 | 2 h 25 min |
| 6 — Tesina | 5 | 4 | 1 | 0 | 6 h 30 min |
| 7 — Modulo IA (apprendimento automatico) | 8 | 8 | 0 | 0 | 6 h 40 min |
| **Totale** | **56** | **42** | **8** | **6** | **43 h 50 min** |

Per tipo: **32 concetti**, **20 abilità**, **4 tipi di esercizio**. I tempi sono somme di stime di studio, non durate ufficiali dell’esame. [F1] indica per la tesina un PowerPoint di **massimo 8 minuti**; quattro slide e una ripartizione dei minuti sono solo **[IPOTESI]** del materiale utente.

## Nodi presenti

### Area 1 — Fondamenti rete e HTTP

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `codici-stato-http` | Codici di stato HTTP (2xx, 3xx, 4xx, 5xx) | A | alta | concetto | — | `http-protocollo-base` | W1 |
| `cookie-sessioni-gestione-stato` | Cookie e sessioni: gestione dello stato in HTTP | A | alta | concetto | `http-stateless-vs-stateful` | — | W1 |
| `http-1-1-1-2-3-differenze` | HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave | A | alta | concetto | `http-protocollo-base` | — | W1 |
| `http-protocollo-base` | Protocollo HTTP: fondamenta del Web | A | alta | concetto | — | — | W1 |
| `http-stateless-vs-stateful` | HTTP: Stateless vs Stateful | A | alta | concetto | `http-protocollo-base` | — | W1 |
| `multiplexing-http-2-3` | Multiplexing: HTTP/2 vs HTTP/3 | B | media | abilita | `http-1-1-1-2-3-differenze` | — | W1 |
| `quic-protocollo` | QUIC: protocollo di trasporto per HTTP/3 | B | media | concetto | `http-1-1-1-2-3-differenze` | — | W1 |
| `statico-vs-dinamico` | Contenuto statico vs dinamico: differenze fondamentali | A | alta | concetto | — | `http-protocollo-base` | W1 |
| `tcp-ip-modello-livelli` | Modello TCP/IP e stack protocollare | A | alta | concetto | — | — | W1 |
| `uri-url-urn-differenze` | URI, URL, URN: differenze e sintassi | A | alta | concetto | — | — | W1 |

### Area 2 — Architetture

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `api-design-best-practice` | API Design: best practice RESTful | A | alta | abilita | `rest-principi`, `rest-metodi-http` | — | W1 |
| `architettura-3-tier` | Architettura 3-tier (orizzontale e verticale) | A | alta | concetto | — | — | W1 |
| `architetture-mashup` | Architetture mashup: comporre servizi e dati | A | alta | concetto | `rest-principi`, `json-formato-dati` | `architettura-3-tier` | X2 |
| `codice-404-not-found` | Codice 404 Not Found: significato e uso | A | alta | abilita | `codici-stato-http` | — | W1 |
| `rate-limiting-sicurezza` | Rate limiting e sicurezza delle API | B | media | concetto | — | `api-design-best-practice` | W1 |
| `rest-metodi-http` | REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE) | A | alta | concetto | `rest-principi` | — | W1 |
| `rest-principi` | REST: principi e vincoli architetturali | A | alta | concetto | `http-protocollo-base` | — | W1 |
| `sviluppo-event-driven` | Sviluppo event-driven: eventi, handler e stato | A | alta | concetto | `dom-virtual-dom` | `eventi-locali-vs-remoti`, `javascript-fetch-async-await` | X2 |

### Area 3 — Front-end

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `canvas-api` | Canvas API: disegno 2D in HTML | C | bassa | abilita | — | — | W2 |
| `css-box-model` | CSS: Box Model | A | alta | concetto | — | — | W2 |
| `css-origini-ereditarieta` | CSS: origini, cascading e ereditarietà | A | alta | concetto | — | — | W2 |
| `dhtml-dynamic-html` | DHTML: Dynamic HTML | C | bassa | concetto | `dom-virtual-dom` | — | W2 |
| `dom-virtual-dom` | DOM e Virtual DOM | A | alta | concetto | — | — | W2 |
| `eventi-locali-vs-remoti` | Eventi: locali vs remoti | B | media | concetto | — | — | W2 |
| `html-form-accessibilita` | HTML: form e accessibilità | A | alta | abilita | — | — | W2 |
| `html5-struttura-semantica` | HTML5: struttura semantica della pagina | A | alta | abilita | — | `html-form-accessibilita` | X2 |
| `javascript-fetch-async-await` | JavaScript moderno: fetch, async/await | A | alta | abilita | — | — | W2 |
| `motore-js-parser-ast-jit` | Motore JavaScript: parser, AST, profiler, JIT | C | bassa | concetto | — | — | W2 |
| `react-componenti-jsx` | React: componenti, JSX, props e stato | A | alta | abilita | `dom-virtual-dom`, `javascript-fetch-async-await` | `json-formato-dati` | X2 |
| `sensori-mobile-web` | Sensori nel Web mobile: posizione e orientamento | B | media | concetto | `sviluppo-event-driven` | `javascript-fetch-async-await` | X2 |
| `span-tag-uso` | Tag &lt;span&gt;: uso e scopi | C | bassa | concetto | — | — | W2 |
| `web-1-0-2-0-3-0-4-0` | Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0 | B | media | concetto | — | — | W2 |

### Area 4 — Back-end e strumenti

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `flask-request-response` | Flask: request e response | A | alta | abilita | `flask-rotte-jsonify` | — | W3 |
| `flask-rotte-jsonify` | Flask: rotte e jsonify | A | alta | abilita | `python-base-web` | — | W3 |
| `git-comandi-base` | Git: comandi base | A | alta | abilita | — | — | W3 |
| `git-workflow-collaborativo` | Git: workflow collaborativo con branch, merge e pull request | A | alta | abilita | `git-comandi-base` | — | X2 |
| `json-formato-dati` | JSON: formato dati per il Web | A | alta | concetto | — | — | W3 |
| `python-base-web` | Python di base per applicazioni Web | A | alta | abilita | — | `json-formato-dati` | X2 |
| `servizi-restful-flask` | Servizi RESTful con Flask: crea e consuma API | A | alta | tipo_esercizio | `flask-request-response`, `rest-metodi-http`, `json-formato-dati` | `javascript-fetch-async-await`, `codici-stato-http` | X2 |
| `sqlite-crud` | SQLite: operazioni CRUD | B | media | abilita | — | — | W3 |

### Area 5 — Web semantico ed evoluzione

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `ajax-fetch-xhr` | AJAX: Asynchronous JavaScript and XML | A | alta | abilita | `javascript-fetch-async-await` | — | W3 |
| `sparql-query-esempi` | SPARQL: esempi di query | C | bassa | abilita | `web-semantico-rdf-owl` | — | W3 |
| `web-semantico-rdf-owl` | Web Semantico: RDF, OWL, SPARQL | C | bassa | concetto | — | — | W3 |

### Area 6 — Tesina

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `quiz-form` | Quiz e form: domande a scelta multipla e raccolta risposte | B | media | abilita | `html-form-accessibilita` | `javascript-fetch-async-await` | W4 |
| `tesina-domande-revisione-codice` | Tesina: Domande di revisione codice | A | alta | tipo_esercizio | `tesina-progetto-flask-crud` | `rest-metodi-http` | W4 |
| `tesina-esercitazione-guidata` | Tesina: Esercitazione guidata e modello presentazione | A | alta | tipo_esercizio | — | — | W4 |
| `tesina-presentazione-8-minuti` | Tesina: presentazione PowerPoint (max 8 minuti) | A | alta | abilita | `tesina-progetto-flask-crud` | — | W4 |
| `tesina-progetto-flask-crud` | Tesina: Progetto Flask + CRUD | A | alta | abilita | `flask-rotte-jsonify`, `sqlite-crud`, `javascript-fetch-async-await` | `servizi-restful-flask`, `git-workflow-collaborativo` | W4 |

### Area 7 — Modulo IA (apprendimento automatico)

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `ia-bayes-apprendimento-statistico` | IA: apprendimento statistico e bayesiano | A | alta | concetto | `ia-supervisionato-classificazione-lineare` | — | X3 |
| `ia-clustering-non-supervisionato` | IA: clustering e apprendimento non supervisionato | A | alta | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | X3 |
| `ia-esame-quiz-lab-lode` | IA: quiz, laboratorio e lode dell’esame integrato | A | alta | tipo_esercizio | `ia-supervisionato-classificazione-lineare`, `ia-clustering-non-supervisionato` | `ia-regressione`, `ia-bayes-apprendimento-statistico`, `ia-riduzione-dimensionalita` | X3 |
| `ia-introduzione-apprendimento` | IA: introduzione all’apprendimento automatico | A | alta | concetto | — | — | X3 |
| `ia-python-numpy-lab` | IA: laboratorio Python e NumPy | A | alta | abilita | — | `python-base-web` | X3 |
| `ia-regressione` | IA: regressione lineare e minimi quadrati | A | alta | concetto | `ia-supervisionato-classificazione-lineare` | `ia-python-numpy-lab` | X3 |
| `ia-riduzione-dimensionalita` | IA: riduzione della dimensionalità e PCA | A | alta | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | X3 |
| `ia-supervisionato-classificazione-lineare` | IA: supervisionato e classificazione lineare | A | alta | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | X3 |

Il grafo e i documenti derivati si rigenerano dalle sorgenti: vedi [CONTRACTS.md](CONTRACTS.md). I dettagli d’esame non specificati dalle fonti non vanno dedotti dai nomi dei nodi.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
