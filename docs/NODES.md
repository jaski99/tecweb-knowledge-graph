# Nodi e priorità — INF-37 2026/27

La scheda di riferimento è INF-37, **coorte 2024/25** [F1]. Il grafo contiene **40 nodi esistenti** con lezioni nelle aree 1–6; altri **16 sono pianificati, non ancora presenti**: 8 per X2 e 8 per X3. L’area 7 è dichiarata nei metadati, ma non ha ancora nodi. ID, aree, gruppi, tipi e prerequisiti dei nuovi nodi sono quelli vincolanti del [piano §1.2](IMPROVEMENT_PLAN.md#12-nuovi-nodi-contratto-id-area-gruppo-tipo-prerequisiti-gli-id-sono-definitivi).

## Legenda

- **A — alta priorità:** tema esplicitamente elencato in [F1] o base indispensabile per scritto/tesina. La classificazione di un esempio è una scelta didattica, non una promessa di domanda.
- **B — contesto utile:** prerequisito o approfondimento pertinente, ma non una voce specifica del programma.
- **C — opzionale:** dettaglio non elencato nel programma 2026/27. «Non elencato» non dimostra che il tema non possa essere mai trattato.
- **Hard / soft:** prerequisito indispensabile / utile. I tempi sono stime di studio del progetto, non durate dell’esame.
- Le percentuali 65/20/15 e le ricorrenze del [materiale utente](MATERIALE_UTENTE.md) sono **[IPOTESI]**, non la legenda corrente né dati verificati.

## Conteggi e tempi

| Area | Presenti | A | B | C | Tempo presente stimato | In arrivo | Totale previsto |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 — Fondamenti rete e HTTP | 10 | 8 | 2 | 0 | 7 h 00 min | 0 | 10 |
| 2 — Architetture | 6 | 5 | 1 | 0 | 4 h 25 min | 2 | 8 |
| 3 — Front-end | 11 | 5 | 2 | 4 | 7 h 10 min | 3 | 14 |
| 4 — Back-end e strumenti | 5 | 4 | 1 | 0 | 4 h 00 min | 3 | 8 |
| 5 — Web semantico ed evoluzione | 3 | 1 | 0 | 2 | 2 h 25 min | 0 | 3 |
| 6 — Tesina | 5 | 4 | 1 | 0 | 6 h 30 min | 0 | 5 |
| 7 — Modulo IA (apprendimento automatico) | 0 | 0 | 0 | 0 | 0 h 00 min | 8 | 8 |
| **Totale** | **40** | **27** | **7** | **6** | **31 h 30 min** | **16** | **56** |

Nei nodi presenti: **23 concetti, 15 abilità, 2 tipi di esercizio**. I 16 nodi in arrivo non hanno ancora tempi stimati: non sommarli al tempo presente.

## Nodi presenti

Le colonne riportano gruppo, livello di priorità e dipendenze effettive dei part esistenti; W1–W4 identificano i worker che hanno creato i nodi. Le lezioni esistenti sono in revisione da X4 e possono ancora esprimere priorità precedenti.

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
| `codice-404-not-found` | Codice 404 Not Found: significato e uso | A | alta | abilita | `codici-stato-http` | — | W1 |
| `rate-limiting-sicurezza` | Rate limiting e sicurezza delle API | B | media | concetto | — | `api-design-best-practice` | W1 |
| `rest-metodi-http` | REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE) | A | alta | concetto | `rest-principi` | — | W1 |
| `rest-principi` | REST: principi e vincoli architetturali | A | alta | concetto | `http-protocollo-base` | — | W1 |

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
| `javascript-fetch-async-await` | JavaScript moderno: fetch, async/await | A | alta | abilita | — | — | W2 |
| `motore-js-parser-ast-jit` | Motore JavaScript: parser, AST, profiler, JIT | C | bassa | concetto | — | — | W2 |
| `span-tag-uso` | Tag &lt;span&gt;: uso e scopi | C | bassa | concetto | — | — | W2 |
| `web-1-0-2-0-3-0-4-0` | Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0 | B | media | concetto | — | — | W2 |

### Area 4 — Back-end e strumenti

| ID | Titolo | Gruppo | Priorità | Tipo | Hard | Soft | Worker |
|---|---|---|---|---|---|---|---|
| `flask-request-response` | Flask: request e response | A | alta | abilita | `flask-rotte-jsonify` | — | W3 |
| `flask-rotte-jsonify` | Flask: rotte e jsonify | A | alta | abilita | — | — | W3 |
| `git-comandi-base` | Git: comandi base | A | alta | abilita | — | — | W3 |
| `json-formato-dati` | JSON: formato dati per il Web | A | alta | concetto | — | — | W3 |
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
| `tesina-progetto-flask-crud` | Tesina: Progetto Flask + CRUD | A | alta | abilita | `flask-rotte-jsonify`, `sqlite-crud`, `javascript-fetch-async-await` | — | W4 |

### Area 7 — Modulo IA (apprendimento automatico)

Nessun nodo presente: vedi quelli in arrivo da X3.

## Nodi pianificati — non ancora presenti

I prerequisiti tra nuovi nodi assegnati allo stesso worker sono quelli espliciti della tabella 1.2 (ad esempio sensori → event-driven e dipendenze interne IA). I collegamenti da nodi già presenti ai nuovi sono compito dell’integrazione, non di X1.

| ID | Titolo | Area | Part | Gruppo | Tipo | Hard | Soft | Stato |
|---|---|---:|---|---|---|---|---|---|
| `architetture-mashup` | Architetture mashup | 2 | `area-2-r2.json` | A | concetto | `rest-principi`, `json-formato-dati` | `architettura-3-tier` | in arrivo X2 |
| `sviluppo-event-driven` | Sviluppo event-driven | 2 | `area-2-r2.json` | A | concetto | `dom-virtual-dom` | `eventi-locali-vs-remoti`, `javascript-fetch-async-await` | in arrivo X2 |
| `html5-struttura-semantica` | HTML5: struttura semantica | 3 | `area-3-r2.json` | A | abilita | — | `html-form-accessibilita` | in arrivo X2 |
| `react-componenti-jsx` | React: componenti e JSX | 3 | `area-3-r2.json` | A | abilita | `dom-virtual-dom`, `javascript-fetch-async-await` | `json-formato-dati` | in arrivo X2 |
| `sensori-mobile-web` | Sensori mobili e Web | 3 | `area-3-r2.json` | B | concetto | `sviluppo-event-driven` | `javascript-fetch-async-await` | in arrivo X2 |
| `python-base-web` | Python di base per il Web | 4 | `area-4-r2.json` | A | abilita | — | `json-formato-dati` | in arrivo X2 |
| `servizi-restful-flask` | Servizi RESTful con Flask | 4 | `area-4-r2.json` | A | tipo_esercizio | `flask-request-response`, `rest-metodi-http`, `json-formato-dati` | `javascript-fetch-async-await`, `codici-stato-http` | in arrivo X2 |
| `git-workflow-collaborativo` | Git: workflow collaborativo | 4 | `area-4-r2.json` | A | abilita | `git-comandi-base` | — | in arrivo X2 |
| `ia-introduzione-apprendimento` | IA: introduzione e apprendimento | 7 | `area-7.json` | A | concetto | — | — | in arrivo X3 |
| `ia-python-numpy-lab` | IA: laboratorio Python e NumPy | 7 | `area-7.json` | A | abilita | — | — | in arrivo X3 |
| `ia-supervisionato-classificazione-lineare` | IA: supervisionato e classificazione lineare | 7 | `area-7.json` | A | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | in arrivo X3 |
| `ia-bayes-apprendimento-statistico` | IA: apprendimento statistico e bayesiano | 7 | `area-7.json` | A | concetto | `ia-supervisionato-classificazione-lineare` | — | in arrivo X3 |
| `ia-clustering-non-supervisionato` | IA: clustering e apprendimento non supervisionato | 7 | `area-7.json` | A | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | in arrivo X3 |
| `ia-regressione` | IA: regressione | 7 | `area-7.json` | A | concetto | `ia-supervisionato-classificazione-lineare` | `ia-python-numpy-lab` | in arrivo X3 |
| `ia-riduzione-dimensionalita` | IA: riduzione della dimensionalità | 7 | `area-7.json` | A | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | in arrivo X3 |
| `ia-esame-quiz-lab-lode` | IA: quiz, laboratorio e lode | 7 | `area-7.json` | A | tipo_esercizio | `ia-supervisionato-classificazione-lineare`, `ia-clustering-non-supervisionato` | `ia-regressione`, `ia-bayes-apprendimento-statistico`, `ia-riduzione-dimensionalita` | in arrivo X3 |

Il progetto deve rigenerare i documenti derivati dopo l’integrazione. I contenuti, le date e i dettagli d’esame non specificati dalle fonti non vanno dedotti dai nomi dei nodi.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
