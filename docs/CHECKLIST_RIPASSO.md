<!-- generato da scripts/gen_docs.py: non modificare a mano -->

# Checklist di ripasso — Tecnologie Web UNIMORE

## Flashcard per ripasso SM-2

> Usa queste flashcard per il ripasso a intervalli (1-3-7-14 giorni).


### HTTP: Stateless vs Stateful

**Fronte**: HTTP: stateless vs stateful - Qual e la differenza?

**Retro**: HTTP e STATLESS: il protocollo non mantiene stato. Le applicazioni possono essere STATEFUL usando cookie, token, URL params, o sessioni per mantenere lo stato tra richieste. Stateless = protocollo senza memoria; Stateful = applicazione con memoria.


### REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)

**Fronte**: REST: Quali sono i 5 metodi HTTP principali e le loro caratteristiche?

**Retro**: 1) GET: Read, safe, idempotente, 200 OK. 2) POST: Create, non idempotente, 201 Created. 3) PUT: Replace completa, non safe, idempotente, 200/204. 4) PATCH: Update parziale, non safe, non idempotente, 200/204. 5) DELETE: Delete, non safe, idempotente, 200/202/204.


### CSS: Box Model

**Fronte**: CSS Box Model: Quali sono i 4 componenti e come si calcola la dimensione totale?

**Retro**: 4 componenti: Content (contenuto), Padding (spazio interno), Border (bordo), Margin (spazio esterno). Dimensione box = width + padding-left + padding-right + border-left + border-right. Dimensione totale = dimensione box + margin-left + margin-right. Con box-sizing: border-box, width include gia padding e border.


## Checklist per area


## Area 1. Fondamenti rete e HTTP

### Protocollo HTTP: fondamenta del Web (priorità ALTA, gruppo A)

- [ ] Request-response model
- [ ] Stateless per design
- [ ] Porta 80 (HTTP), 443 (HTTPS)
- [ ] URI identifica la risorsa

### Codici di stato HTTP (2xx, 3xx, 4xx, 5xx) (priorità ALTA, gruppo A)

- [ ] 1xx: informazionali
- [ ] 2xx: successo (200, 201, 204)
- [ ] 3xx: reindirizzamento (301, 302, 304)
- [ ] 4xx: errore client (400, 401, 403, 404)
- [ ] 5xx: errore server (500, 502, 503)

### HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave (priorità ALTA, gruppo A)

- [ ] HTTP/1.0: connessioni non persistenti
- [ ] HTTP/1.1: persistenti, pipelining, chunked
- [ ] HTTP/2: multiplexing, HPACK, server push
- [ ] HTTP/3: QUIC su UDP, TLS integrato

### HTTP: Stateless vs Stateful (priorità ALTA, gruppo A)

- [ ] HTTP stateless per design
- [ ] Vantaggi: scalabilità, semplicità, affidabilità
- [ ] Meccanismi di stato: cookie, token, URL params, sessioni server-side
- [ ] Cookie: Set-Cookie (server→client), Cookie (client→server)

### Cookie e sessioni: gestione dello stato in HTTP (priorità ALTA, gruppo A)

- [ ] Cookie: Set-Cookie (server→client), Cookie (client→server)
- [ ] Attributi: Domain, Path, Max-Age/Expires, HttpOnly, Secure, SameSite
- [ ] Sessioni: session ID nei cookie + dati server-side
- [ ] Sicurezza: HttpOnly (no JS), Secure (HTTPS), SameSite (CSRF)

### Multiplexing: HTTP/2 vs HTTP/3 (priorità ALTA, gruppo A)

- [ ] HOL blocking: pacchetto perso blocca la coda
- [ ] HTTP/2: multiplexing a livello applicativo (stream)
- [ ] HTTP/3: multiplexing a livello trasporto (QUIC)

### Contenuto statico vs dinamico: differenze fondamentali (priorità ALTA, gruppo A)

- [ ] Statico: contenuto fisso, uguale per tutti
- [ ] Dinamico: generato per ogni richiesta, personalizzato
- [ ] Esempi statico: HTML, CSS, JS, immagini
- [ ] Esempi dinamico: PHP, Python (Flask), Node.js, JSP

### Modello TCP/IP e stack protocollare (priorità ALTA, gruppo A)

- [ ] 4 livelli: Applicazione, Trasporto, Internet, Accesso rete
- [ ] HTTP al livello Applicazione
- [ ] TCP/UDP al livello Trasporto
- [ ] IP al livello Internet

### URI, URL, URN: differenze e sintassi (priorità ALTA, gruppo A)

- [ ] URI = identificatore generico
- [ ] URL = URI con posizione (scheme + authority)
- [ ] URN = URI senza posizione (identificatore persistente)
- [ ] Sintassi URI: scheme://authority/path?query#fragment

### QUIC: protocollo di trasporto per HTTP/3 (priorità MEDIA, gruppo A)

- [ ] QUIC = UDP + TLS 1.3 integrato
- [ ] 0-RTT: nessuna latenza per connessioni ripetute
- [ ] Niente head-of-line blocking
- [ ] Migrazione connessione senza reconnect


## Area 2. Architetture

### Architettura 3-tier (orizzontale e verticale) (priorità ALTA, gruppo A)

- [ ] 3 livelli: Presentazione, Logica, Dati
- [ ] Orizzontale: livelli su macchine diverse
- [ ] Verticale: tutti i livelli sulla stessa macchina
- [ ] Vantaggi: manutenibilità, scalabilità, separazione delle responsabilità

### Codice 404 Not Found: significato e uso (priorità ALTA, gruppo A)

- [ ] 404 = risorsa non trovata
- [ ] 410 = permanentemente rimossa
- [ ] Flask: abort(404) o return ..., 404
- [ ] Personalizzazione pagina 404

### REST: principi e vincoli architetturali (priorità ALTA, gruppo A)

- [ ] 6 vincoli: client-server, stateless, cacheability, uniform interface, layered, code-on-demand
- [ ] Uniform interface: URI + rappresentazioni + messaggi autosufficenti + HATEOAS
- [ ] REST ≠ SOAP (protocollo) ≠ GraphQL (query language)

### REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE) (priorità ALTA, gruppo A)

- [ ] GET: recupera, idempotente, safe
- [ ] POST: crea, non idempotente
- [ ] PUT: sostituisce completamente, idempotente
- [ ] PATCH: aggiorna parzialmente
- [ ] DELETE: elimina, idempotente

### API Design: best practice RESTful (priorità ALTA, gruppo A)

- [ ] URI: sostantivi, plurali, gerarchia
- [ ] Versioning: /v1/ o header Accept
- [ ] Paginazione: ?page=&per_page=
- [ ] Status: 200, 201, 400, 404, 500

### Rate limiting e sicurezza delle API (priorità MEDIA, gruppo B)

- [ ] Rate limiting: limiti per IP/utente/endpoint
- [ ] Autenticazione: API key, OAuth, JWT
- [ ] CORS: Cross-Origin Resource Sharing
- [ ] HTTPS: crittografia TLS


## Area 3. Front-end

### CSS: Box Model (priorità ALTA, gruppo A)

- [ ] Box model: content, padding, border, margin
- [ ] box-sizing: content-box (default), border-box
- [ ] Dimensione totale = width + padding*2 + border*2 (content-box)
- [ ] Trappola: margin non fa parte del box model

### CSS: origini, cascading e ereditarietà (priorità ALTA, gruppo A)

- [ ] Origini: author > user > user agent
- [ ] Cascading: !important > origine > specificità > ordine
- [ ] Specificità: ID=0,1,0,0; classe=0,0,1,0; tag=0,0,0,1
- [ ] Ereditarietà: color, font-family SÌ; margin, padding, border NO

### DOM e Virtual DOM (priorità ALTA, gruppo A)

- [ ] DOM: albero di nodi (elementi, testo, commenti)
- [ ] Manipolazione: createElement, appendChild, removeChild, innerHTML
- [ ] Virtual DOM: copia in memoria per ottimizzazione
- [ ] Diffing: confronto tra Virtual DOM vecchi/nuovi
- [ ] Reconciliation: applicazione differenze al DOM reale

### HTML: form e accessibilità (priorità ALTA, gruppo A)

- [ ] Form: input, textarea, select, button, checkbox, radio
- [ ] Accessibilità: label per ogni input
- [ ] Associazione: for/id o wrapping
- [ ] Validazione: required, minlength, pattern

### JavaScript moderno: fetch, async/await (priorità ALTA, gruppo C)

- [ ] fetch(): API moderna per HTTP requests
- [ ] Response.ok: verifica status 200-299
- [ ] response.json(): parse JSON body
- [ ] async/await: sintassi sincrona per codice asincrono
- [ ] try/catch: gestione errori

### Canvas API: disegno 2D in HTML (priorità MEDIA, gruppo B)

- [ ] <canvas> elemento HTML
- [ ] getContext('2d') per contesto 2D
- [ ] Metodi: fillRect, strokeRect, arc, beginPath, fill, stroke
- [ ] Animazioni: requestAnimationFrame

### DHTML: Dynamic HTML (priorità MEDIA, gruppo B)

- [ ] DHTML = HTML + CSS + JavaScript
- [ ] Manipolazione DOM dinamica
- [ ] Eventi: mouseover, mouseout, click, etc.
- [ ] DHTML ≠ AJAX (DHTML è client-side, AJAX include server-side)

### Eventi: locali vs remoti (priorità MEDIA, gruppo B)

- [ ] Eventi locali: click, mouseover, keydown, submit, load, scroll
- [ ] Eventi remoti: WebSocket, SSE, polling, long polling
- [ ] WebSocket: bidirezionale, full-duplex
- [ ] SSE: server→client, solo testuale, auto-reconnect

### Motore JavaScript: parser, AST, profiler, JIT (priorità MEDIA, gruppo B)

- [ ] 5 fasi: Parsing → Interpretazione → Profiling → JIT Compilation → Esecuzione
- [ ] AST: Abstract Syntax Tree (rappresentazione strutturata del codice)
- [ ] JIT: Just-In-Time compilation (codice caldo → codice macchina)
- [ ] V8: Ignition (interprete) + TurboFan (JIT)

### Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0 (priorità MEDIA, gruppo B)

- [ ] Web 1.0: statico, lettura, HTML base
- [ ] Web 2.0: dinamico, lettura/scrittura, AJAX, social
- [ ] Web 3.0: semantico, Linked Data, AI, personalizzazione
- [ ] Web 4.0: ubiquo, IoT, AI generativa

### Tag <span>: uso e scopi (priorità BASSA, gruppo B)

- [ ] <span> = elemento inline generico
- [ ] Usi: styling, raggruppamento, attributi semantici
- [ ] Niente significato semantico di default
- [ ] Inline: non introduce interruzione di riga


## Area 4. Back-end e strumenti

### Flask: rotte e jsonify (priorità ALTA, gruppo C)

- [ ] @app.route('percorso') per definire rotte
- [ ] methods=['GET', 'POST', ...] per limitare i metodi
- [ ] jsonify() per convertire Python → JSON
- [ ] Parametri URL: <tipo:nome> (es. <int:id>, <string:nome>)

### Flask: request e response (priorità ALTA, gruppo C)

- [ ] request.args: query string (GET)
- [ ] request.form: dati form (POST, application/x-www-form-urlencoded)
- [ ] request.json: body JSON (POST, application/json)
- [ ] request.cookies: cookie in entrata
- [ ] make_response: creare risposte personalizzate

### Git: comandi base (priorità ALTA, gruppo C)

- [ ] init: inizializza repository
- [ ] add: aggiungi file allo staging area
- [ ] commit: salva cambiamenti localmente
- [ ] branch: gestione rami
- [ ] checkout/switch: cambia branch
- [ ] merge: unisci branch
- [ ] push/pull: sincronizzazione con remote
- [ ] clone: copia repository
- [ ] Pull request: richiesta di merge su GitHub (non comando Git)

### SQLite: operazioni CRUD (priorità ALTA, gruppo C)

- [ ] CRUD: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE)
- [ ] sqlite3: connect(), cursor(), execute(), commit(), close()
- [ ] Parametri sicuri: ? placeholder per evitare SQL injection
- [ ] Flask-SQLAlchemy: ORM per Flask

### JSON: formato dati per il Web (priorità MEDIA, gruppo C)

- [ ] JSON: JavaScript Object Notation
- [ ] Sintassi: {chiave: valore, ...}
- [ ] Tipi: string, number, boolean, null, object, array
- [ ] Python: json.dumps() (ser), json.loads() (deser)
- [ ] JavaScript: JSON.stringify(), JSON.parse()


## Area 5. Web semantico ed evoluzione

### Web Semantico: RDF, OWL, SPARQL (priorità ALTA, gruppo A)

- [ ] Web Semantico: dati comprensibili dalle macchine
- [ ] RDF: Resource Description Framework (triple: soggetto-predicato-oggetto)
- [ ] OWL: Web Ontology Language (ontologie, gerarchie)
- [ ] SPARQL: query language per RDF
- [ ] Linked Data: collegamento dati da fonti diverse

### AJAX: Asynchronous JavaScript and XML (priorità MEDIA, gruppo B)

- [ ] AJAX: Asynchronous JavaScript And XML (ma usa JSON)
- [ ] API: XMLHttpRequest (legacy), fetch() (moderna)
- [ ] Passaggi: crea → invia → aspetta → elabora → aggiorna DOM
- [ ] Asincrono: non blocca l'interfaccia utente

### SPARQL: esempi di query (priorità MEDIA, gruppo A)

- [ ] SELECT ?var WHERE { pattern }
- [ ] Triple pattern: ?s ?p ?o
- [ ] FILTER: condizionare risultati
- [ ] OPTIONAL: risultati opzionali
- [ ] UNION: combinare pattern

### Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0 (priorità MEDIA, gruppo B)

- [ ] Web 1.0: statico, lettura, HTML base
- [ ] Web 2.0: dinamico, user-generated, AJAX, social
- [ ] Web 3.0: semantico, Linked Data, AI
- [ ] Web 4.0: ubiquo, IoT, AI generativa


## Area 6. Tesina

### Tesina: Progetto Flask + CRUD (priorità ALTA, gruppo C)

- [ ] Backend: Flask + rotte RESTful
- [ ] Front-end: HTML/CSS/JS + fetch
- [ ] Database: SQLite o JSON
- [ ] CRUD: Create, Read, Update, Delete

### Tesina: Domande di revisione codice (priorità ALTA, gruppo C)

- [ ] Metodi HTTP: GET, POST, PUT, PATCH, DELETE
- [ ] Stato: client-side vs server-side
- [ ] Chiamate asincrone: fetch, async/await
- [ ] Error handling: try/catch, status code

### Tesina: Presentazione di 8 minuti con 4 slide (priorità ALTA, gruppo C)

- [ ] 8 minuti totali
- [ ] 4 slide: obiettivi, architettura, codice, demo
- [ ] Tempi: 1 + 2 + 3 + 2 minuti
- [ ] Demo dal vivo o screen

### Quiz e form: domande a scelta multipla e raccolta risposte (priorità MEDIA, gruppo C)

- [ ] Quiz: domande + opzioni + risposta corretta
- [ ] Form: input radio/checkbox per risposte
- [ ] JavaScript: logica valutazione
- [ ] Feedback: immediato per ogni domanda

### Tesina: Esercitazione guidata e modello presentazione (priorità MEDIA, gruppo C)

- [ ] Scegli tema adatto
- [ ] Progetta database
- [ ] Implementa endpoint
- [ ] Testa con Postman/curl


## Trappole d'esame

- [ ] **HTTP: Stateless vs Stateful**: Confondere stateless con sessionless → HTTP e stateless (il protocollo non mantiene stato), ma le applicazioni web NON sono sessionless. Lo stateless si riferisce al protocollo, non all applicazione. HTTP e stateless ma non sessionless.
- [ ] **HTTP: Stateless vs Stateful**: Pensare che i cookie siano sicuri di default → I cookie senza HttpOnly possono essere rubati tramite XSS (JavaScript malizioso). Senza Secure, possono essere intercettati su connessioni non HTTPS. Senza SameSite, sono vulnerabili a CSRF.
- [ ] **HTTP: Stateless vs Stateful**: Usare JWT senza scadenza → I token senza scadenza (exp claim) sono un rischio di sicurezza: se compromessi, possono essere usati all infinito. Inoltre, non c e modo di invalidarli prima della scadenza.
- [ ] **HTTP: Stateless vs Stateful**: Memorizzare dati sensibili nei JWT → I JWT sono base64 encoded, NON crittografati (a meno che non si usi JWE). Chiunque puo decodificarli e leggere il payload. Non memorizzare mai password, PII, o dati sensibili.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Usare PUT quando si vogliono aggiornare solo alcuni campi → PUT sostituisce completamente la risorsa: se non fornisci tutti i campi, i campi mancanti verranno impostati a null o al valore di default, causando perdita di dati.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Usare PATCH quando si vuole sostituire completamente la risorsa → PATCH aggiorna parzialmente: se il client non fornisce tutti i campi necessari, la risorsa potrebbe rimanere in uno stato incompleto o inconsistente.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Non fornire tutti i campi in una richiesta PUT → PUT sostituisce completamente la risorsa. Se non fornisci tutti i campi obbligatori, la risorsa sara incompleta dopo l aggiornamento.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Usare POST per creare una risorsa con URI noto → POST e per creare risorse quando il server decide l URI. Se il client conosce gia l URI completo (es. /users/123), deve usare PUT.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Pensare che PATCH sia sempre idempotente → PATCH non e necessariamente idempotente. Se l implementazione incrementa un valore (es. eta += 1), eseguire PATCH piu volte produce risultati diversi.
- [ ] **CSS: Box Model**: Dimenticare che padding e border vengono aggiunti alla width con box-sizing: content-box (default) → Questo porta a dimensioni totali maggiore di quella attesa. Se vuoi un box di 200px totale, devi impostare width a 200px - padding - border, che e controintuitivo.
- [ ] **CSS: Box Model**: Pensare che margin faccia parte delle dimensioni del box → Il margin e spazio esterno e non contribuisce alla dimensione del box stesso. Tuttavia, influisce sullo spazio totale occupato nel layout.
- [ ] **CSS: Box Model**: Non usare box-sizing: border-box → Questo costringe a calcolare manualmente le dimensioni totali ogni volta, portando a errori e frustrazione. box-sizing: border-box e la soluzione standard moderna.
- [ ] **CSS: Box Model**: Applicare width e height a elementi inline (span, a) → Gli elementi inline ignorano width e height. Per applicare dimensioni, devi usare display: inline-block o block.
- [ ] **CSS: Box Model**: Dimenticare il margin collapsing → I margin verticali adiacenti si fondono, portando a spazi minori di quelli attesi. Questo puo rompere il layout.
- [ ] **CSS: Box Model**: Confondere padding con margin → Padding e spazio interno tra content e border (mostra lo sfondo), margin e spazio esterno fuori dal border (non mostra lo sfondo).
