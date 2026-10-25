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

**Fronte**: Box model: aree e formula della larghezza fino al bordo con content-box?

**Retro**: Aree: content, padding, border, margin. Con content-box la scatola fino al bordo vale width + padding sinistro e destro + border sinistro e destro; il margin è fuori dalla misura. Con border-box, width include già padding e border.


### CSS: origini, cascading e ereditarietà

**Fronte**: Cascata CSS: in che ordine si risolve un conflitto e come si calcola la specificità?

**Retro**: Origine e importanza (normali: browser, utente, autore; !important rovescia le origini), poi specificità ID-classi-tipi confrontata lessicograficamente, poi ordine di apparizione. Undici classi non battono un id.


### DOM e Virtual DOM

**Fronte**: DOM e Virtual DOM: definizioni e differenza in una frase?

**Retro**: Il DOM è l'albero di oggetti del browser che rappresenta la pagina viva e si manipola con le sue API. Il Virtual DOM è una copia leggera in memoria che il framework confronta tra un render e l'altro per applicare al DOM reale solo le differenze.


### HTML: form e accessibilità

**Fronte**: Form accessibile: che cosa devono avere tutti i controlli e chi legge name e label?

**Retro**: Ogni controllo vuole una label associata (for/id o wrapping) come nome accessibile per persone e tecnologie assistive, e un attributo name perché il valore venga inviato al server. Il placeholder non sostituisce la label.


### JavaScript moderno: fetch, async/await

**Fronte**: Fetch: qual è la sequenza corretta per leggere dati JSON in sicurezza?

**Retro**: await fetch per ottenere la Response, controllo di response.ok (gli stati di errore non causano rejected), poi await risposta.json() per i dati; il tutto in una funzione async con try/catch per rete, stati HTTP e JSON non valido.


### Tesina: Progetto Flask + CRUD

**Fronte**: Come si progetta un CRUD Web affidabile?

**Retro**: Definire risorsa e contratto, separare client/server/dati, validare sul server, usare query parametrizzate, scegliere metodi e status coerenti e gestire gli errori nel client.


### Tesina: Domande di revisione codice

**Fronte**: Come spiegare una rotta durante una revisione?

**Retro**: Percorri gesto, richiesta, metodo e payload, validazione server, persistenza, status e aggiornamento della UI; esplicita errori e limiti.


### Tesina: Presentazione di 8 minuti con 4 slide

**Fronte**: Qual è il filo narrativo delle quattro slide?

**Retro**: Problema e obiettivi → architettura e flusso dati → codice significativo → demo o schermate; la traccia di tempo proposta è 1+2+3+2 minuti.


### Canvas API: disegno 2D in HTML

**Fronte**: Canvas 2D: i quattro passi minimi per disegnare qualcosa?

**Retro**: 1) Elemento canvas con width/height (risoluzione). 2) Contesto con getContext('2d'). 3) Stato: fillStyle/strokeStyle. 4) Disegno: fillRect oppure beginPath + arc/lineTo + fill/stroke. Senza contesto non si disegna nulla.


### DHTML: Dynamic HTML

**Fronte**: DHTML: definizione e differenza rispetto ad AJAX?

**Retro**: DHTML = HTML, CSS e JavaScript sul DOM per pagine interattive lato client con ciò che è già nel browser. AJAX aggiunge richieste asincrone di dati nuovi al server senza ricaricare la pagina.


### Eventi: locali vs remoti

**Fronte**: Eventi locali contro remoti: criterio e quattro meccanismi per i remoti?

**Retro**: Criterio: dove nasce l'evento. Locali nel browser (click, input, submit) con addEventListener. Remoti dal server: polling (richieste periodiche), long polling (risposta trattenuta), SSE (flusso solo server verso client), WebSocket (persistente bidirezionale).


### Motore JavaScript: parser, AST, profiler, JIT

**Fronte**: Pipeline di un motore JS: fasi in ordine e nomi V8?

**Retro**: Parser (costruisce l'AST), interprete Ignition (bytecode eseguito subito), profiler/feedback (parti calde e tipi osservati), compilatore JIT TurboFan (codice macchina per le parti calde), con deottimizzazione se le assunzioni cadono.


### Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0

**Fronte**: Web 1.0, 2.0, 3.0, 4.0: l'idea chiave di ciascuna fase?

**Retro**: 1.0 leggo: documenti statici, sola lettura. 2.0 scrivo: partecipazione e contenuti degli utenti. 3.0 significo: web semantico, dati riusabili (RDF). 4.0 seguo: ubiquo e intelligente, tra dispositivi connessi e assistenza personalizzata.


### Quiz e form: domande a scelta multipla e raccolta risposte

**Fronte**: Come strutturare e valutare un quiz accessibile?

**Retro**: Raggruppa le opzioni con fieldset/legend, associa label e radio con name condiviso, gestisci il caso vuoto e comunica feedback testuale in un’area live.


### Tesina: Esercitazione guidata e modello presentazione

**Fronte**: Qual è la sequenza di lavoro proposta per la tesina?

**Retro**: Requisito e modello dati → endpoint e test → interfaccia → CRUD e casi d’errore → demo e presentazione.


### Tag <span>: uso e scopi

**Fronte**: Span contro div: livello, contenuto e riga?

**Retro**: Span: inline, resta nella riga, contiene testo e inline (phrasing content). Div: block, occupa una riga propria, contiene interi blocchi (flow content). Entrambi generici, senza significato proprio.


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

- [ ] Quattro aree dall'interno: content, padding, border, margin
- [ ] Il padding mostra lo sfondo dell'elemento; il margin è trasparente e fuori dalla scatola
- [ ] content-box (iniziale): width = solo content; border-box: width = content + padding + border
- [ ] Margin collapsing: margin verticali adiacenti si fondono nel più grande

### CSS: origini, cascading e ereditarietà (priorità ALTA, gruppo A)

- [ ] Origini normali dalla più debole: user agent, user, author; con !important l'ordine si rovescia
- [ ] Risoluzione dei conflitti: origine/importanza, specificità, ordine di apparizione
- [ ] Specificità in tre colonne (ID, classi, tipi): 11 classi non battono 1 ID
- [ ] Ereditarietà: color e font sì; margin, padding, border no (forzabili con inherit)

### DOM e Virtual DOM (priorità ALTA, gruppo A)

- [ ] DOM: albero di nodi del documento, API del browser indipendente da JavaScript
- [ ] Manipolazione: querySelector, createElement, appendChild, remove, textContent contro innerHTML
- [ ] Virtual DOM: descrizione leggera in memoria sincronizzata con il DOM reale
- [ ] Ciclo dei framework: render, diffing/reconciliation, patch delle sole differenze

### HTML: form e accessibilità (priorità ALTA, gruppo A)

- [ ] Controlli: input, select, textarea, button; radio con stesso name in un fieldset
- [ ] Invio: coppie nome-valore dall'attributo name; id serve a label, CSS e JavaScript
- [ ] GET: dati nell'URL per le letture; POST: dati nel corpo per scritture e dati sensibili
- [ ] Label per ogni controllo (for/id o wrapping): il placeholder non la sostituisce
- [ ] Validazione nel browser per il feedback; il server rivalida sempre

### JavaScript moderno: fetch, async/await (priorità ALTA, gruppo C)

- [ ] Doppio await: prima la Response, poi il corpo con response.json()
- [ ] fetch è rejected per errori di rete, non per 404 o 500: controllare response.ok
- [ ] Promise: pending, fulfilled, rejected; settled = conclusa in uno dei due modi
- [ ] async restituisce sempre una Promise; await sospende solo quella funzione
- [ ] POST JSON: method, Content-Type: application/json, body con JSON.stringify

### Canvas API: disegno 2D in HTML (priorità MEDIA, gruppo B)

- [ ] <canvas>: bitmap disegnata via script; contenuto interno come riserva (fallback)
- [ ] getContext('2d') restituisce il contesto con stato e metodi di disegno
- [ ] Percorsi: beginPath, arc, lineTo, poi fill o stroke; angoli in radianti
- [ ] Attributi width/height = risoluzione; CSS width/height = dimensione in pagina
- [ ] Animazione: clearRect e ridisegno coordinati da requestAnimationFrame

### DHTML: Dynamic HTML (priorità MEDIA, gruppo B)

- [ ] DHTML = HTML + CSS + JavaScript sul DOM, non un linguaggio nuovo
- [ ] Dinamicità lato client: eventi, classi che cambiano, contenuti mostrati e nascosti
- [ ] Solo presentazione al passaggio del mouse: spesso basta il CSS :hover
- [ ] DHTML contro AJAX: AJAX aggiunge richieste asincrone di dati al server

### Eventi: locali vs remoti (priorità MEDIA, gruppo B)

- [ ] Criterio: dove nasce l'evento (client contro server o altri sistemi)
- [ ] Locali: addEventListener; fasi cattura, target, bubbling; preventDefault contro stopPropagation
- [ ] Polling e long polling: richieste del client, con o senza risposta trattenuta
- [ ] SSE: EventSource, solo server verso client, riconnessione automatica
- [ ] WebSocket: handshake HTTP, poi canale persistente bidirezionale

### Motore JavaScript: parser, AST, profiler, JIT (priorità MEDIA, gruppo B)

- [ ] Pipeline: parser e AST, bytecode interpretato, profiler/feedback, JIT, deottimizzazione
- [ ] AST: albero della struttura del programma, distinto da bytecode e codice macchina
- [ ] JIT Just-In-Time: compila durante l'esecuzione solo le parti calde
- [ ] In V8: Ignition è l'interprete del bytecode, TurboFan il compilatore ottimizzante
- [ ] Il motore implementa il linguaggio; il DOM lo fornisce il browser, non il motore

### Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0 (priorità MEDIA, gruppo B)

- [ ] Etichette descrittive di tendenze, non versioni rilasciate: le fasi convivono
- [ ] 1.0 leggo: statico, sola lettura; 2.0 scrivo: partecipazione e contenuti degli utenti
- [ ] 3.0 significo: web semantico e dati riusabili (RDF); 4.0 seguo: ubiquo e intelligente
- [ ] Negli abbinamenti scarta i distrattori fuori contesto (per esempio LAN)

### Tag <span>: uso e scopi (priorità BASSA, gruppo B)

- [ ] <span>: inline, resta in riga, contiene solo phrasing content
- [ ] Usi: stile su un frammento, attributo lang, aggancio per JavaScript
- [ ] Prima l'elemento semantico (strong, em, mark, code): lo span solo se manca
- [ ] Contro <div>: il div è il contenitore generico a blocco e va a capo
- [ ] width ed height sullo span non contano finché display resta inline


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
- [ ] **CSS: Box Model**: Includere color, background o script tra le componenti del box model negli abbinamenti → Le componenti (aree) del box model sono esattamente quattro: content, padding, border e margin. Colore e sfondo sono proprietà che si dipingono dentro la scatola, non aree della scatola.
- [ ] **CSS: Box Model**: Sommare due margin verticali adiacenti aspettandosi la somma → Per il margin collapsing, margin-top e margin-bottom di blocchi adiacenti nel flusso normale si fondono nel valore più grande. Due margin da 20px danno 20px di spazio, non 40.
- [ ] **CSS: Box Model**: Dire che width include sempre padding e border → Con il valore iniziale box-sizing: content-box, width misura solo il content. Padding e border sono inclusi in width solo con box-sizing: border-box.
- [ ] **CSS: Box Model**: Confondere padding e margin rispetto allo sfondo → Il padding è dentro la scatola e mostra lo sfondo dell'elemento; il margin è fuori dal bordo, è trasparente e lascia vedere lo sfondo del contenitore. Se vuoi spazio colorato attorno al testo, serve il padding.
- [ ] **CSS: Box Model**: Applicare width e margin-top a uno span aspettandosi effetto sul layout → Span è inline non sostituito: width e height non si applicano e i margin verticali non spostano le righe. Per dimensionarlo serve display: inline-block o block.
- [ ] **CSS: origini, cascading e ereditarietà**: Sommare la specificità come numero decimale e concludere che 11 classi battono 1 id → Il confronto è lessicografico per colonne ID, classi, tipi: la prima colonna decide prima delle altre. 0-11-0 perde contro 1-0-0 perché nessun numero di classi colma la colonna degli id.
- [ ] **CSS: origini, cascading e ereditarietà**: Credere che margin, padding e border si ereditino dai genitori → Sono proprietà non ereditarie: sui figli, senza dichiarazioni dirette, valgono i valori iniziali. Si ereditano soprattutto le proprietà tipografiche come color e font-family; per forzare le altre serve il valore inherit.
- [ ] **CSS: origini, cascading e ereditarietà**: Dire che con !important vince sempre l'autore sulle altre origini → Con !important l'ordine delle origini si rovescia: tra le dichiarazioni importanti vincono user agent e user sull'author. Il rovesciamento serve a proteggere esigenze di browser e utente, per esempio di accessibilità.
- [ ] **CSS: origini, cascading e ereditarietà**: Pensare che il valore ereditato dal genitore batta una regola diretta poco specifica → L'ereditarietà interviene solo se la cascata non produce dichiarazioni per quella proprietà sull'elemento. Qualsiasi dichiarazione diretta, anche del foglio del browser, ha la precedenza sul valore ereditato.
- [ ] **CSS: origini, cascading e ereditarietà**: Confondere l'ordine di apparizione con il criterio principale di risoluzione dei conflitti → L'ordine di apparizione decide solo a parità di origine, importanza e specificità. Scrivere una regola dopo non la fa vincere contro un selettore più specifico o contro un'origine più forte.
- [ ] **DOM e Virtual DOM**: Dire che il DOM fa parte del linguaggio JavaScript → Il DOM è una Web API fornita dal browser, indipendente dal linguaggio: JavaScript la usa, ma il linguaggio ECMAScript in sé (per esempio in Node.js) non include document né i nodi della pagina.
- [ ] **DOM e Virtual DOM**: Presentare il Virtual DOM come sostituto che elimina il DOM reale → Il Virtual DOM è solo una descrizione in memoria: ciò che l'utente vede è sempre il DOM reale del browser, aggiornato applicando le differenze nella fase di patch. Senza DOM reale non ci sarebbe pagina.
- [ ] **DOM e Virtual DOM**: Affermare che il Virtual DOM è sempre più veloce di qualsiasi manipolazione diretta → Costruire e confrontare alberi virtuali ha un costo; un aggiornamento manuale mirato può fare meno lavoro. Il vantaggio certo è il modello dichiarativo che tiene interfaccia e stato allineati con meno codice fragile.
- [ ] **DOM e Virtual DOM**: Usare innerHTML e textContent come se fossero intercambiabili → innerHTML analizza la stringa come HTML e costruisce nodi: con testo proveniente dall'utente può iniettare markup (XSS). textContent inserisce testo puro e va preferito quando il contenuto non è markup fidato.
- [ ] **DOM e Virtual DOM**: Confondere l'albero DOM con il sorgente HTML della pagina → Il sorgente è il testo ricevuto; il DOM è l'albero di oggetti costruito dal browser con il parsing, che poi JavaScript può modificare. Dopo le modifiche i due non coincidono più: la pagina visualizzata segue il DOM.
- [ ] **HTML: form e accessibilità**: Usare il placeholder come unica etichetta del campo → Il placeholder è un esempio che sparisce durante la digitazione e non è un nome affidabile per le tecnologie assistive. Ogni controllo vuole una label permanente, collegata con for e id oppure per wrapping.
- [ ] **HTML: form e accessibilità**: Dimenticare l'attributo name e dare solo l'id al controllo → L'invio del form costruisce coppie a partire dai name: senza name il valore non parte nemmeno. L'id serve a label, CSS e JavaScript, non al server.
- [ ] **HTML: form e accessibilità**: Credere che la validazione nel browser renda sicuri i dati → Required, pattern e controlli JavaScript vivono nel client e si possono aggirare inviando una richiesta costruita a mano. La validazione lato client serve all'esperienza utente; il server deve sempre rivalidare.
- [ ] **HTML: form e accessibilità**: Scrivere method="patch" in un form per aggiornare una risorsa REST → I form HTML supportano nativamente get e post. PATCH, PUT e DELETE verso un'API si inviano con JavaScript (fetch), oppure il server deve accettare un POST e interpretarlo lato suo.
- [ ] **HTML: form e accessibilità**: Lasciare un button senza type dentro il form per un'azione secondaria → Senza type, un button dentro un form si comporta come submit e invia i dati. Per azioni JavaScript che non devono inviare va scritto esplicitamente type="button".
- [ ] **JavaScript moderno: fetch, async/await**: Aspettarsi che fetch fallisca da solo quando il server risponde 404 → La Promise di fetch diventa rejected per i fallimenti nel completare la richiesta (come gli errori di rete), non per gli stati HTTP di errore: un 404 produce una Response normale. Va controllato response.ok o response.status e gestito esplicitamente.
- [ ] **JavaScript moderno: fetch, async/await**: Dimenticare await davanti a risposta.json() → json() restituisce una Promise, non i dati già interpretati: senza await ottieni la Promise e ogni accesso ai campi dà undefined. La lettura del corpo è il secondo tempo asincrono dopo l'arrivo della Response.
- [ ] **JavaScript moderno: fetch, async/await**: Usare await in una funzione normale o pensare che blocchi tutta la pagina → await sta nelle funzioni async (o al livello più alto dei moduli) e sospende solo quella funzione: il browser continua a disegnare e a gestire gli eventi durante l'attesa.
- [ ] **JavaScript moderno: fetch, async/await**: Presentare async/await come alternativa che sostituisce le Promise → async/await è sintassi costruita sulle Promise: una funzione async restituisce una Promise e await ne attende la conclusione. Cambia la leggibilità, non il meccanismo sottostante.
- [ ] **JavaScript moderno: fetch, async/await**: Mandare un corpo JSON dimenticando intestazione o serializzazione → Nel body va una stringa prodotta con JSON.stringify e l'intestazione Content-Type: application/json dice al server come interpretarla. Senza, il server può non riconoscere i dati o leggerli nel formato sbagliato.
- [ ] **Tesina: Progetto Flask + CRUD**: Inviare al database direttamente i valori del form → Il client è sotto il controllo dell’utente: i dati vanno validati sul server.
- [ ] **Tesina: Progetto Flask + CRUD**: Usare PUT come sinonimo automatico di aggiornamento parziale → PUT sostituisce la rappresentazione secondo il contratto; PATCH serve agli aggiornamenti parziali.
- [ ] **Tesina: Progetto Flask + CRUD**: Restituire un corpo insieme a 204 → 204 indica che la risposta non contiene contenuto; usa un altro status se invii una rappresentazione.
- [ ] **Tesina: Domande di revisione codice**: Dire che fetch lancia un errore per ogni status 4xx → Una risposta 404 è una risposta HTTP; occorre controllare response.ok o status.
- [ ] **Tesina: Domande di revisione codice**: Definire PUT e PATCH equivalenti → PUT sostituisce la rappresentazione secondo il contratto, PATCH applica una modifica parziale.
- [ ] **Tesina: Domande di revisione codice**: Dire che il cookie conserva automaticamente lo stato nel server → Il cookie è trasmesso dal browser; il server deve definire e gestire il meccanismo di sessione.
- [ ] **Tesina: Presentazione di 8 minuti con 4 slide**: Riempire ogni slide di codice → Il testo fitto distrae dall’argomento e non aiuta a capire una scelta.
- [ ] **Tesina: Presentazione di 8 minuti con 4 slide**: Presentare i tempi proposti come valutazione ufficiale → La scansione 1+2+3+2 compare nel materiale utente ma non è stata verificata come regola ufficiale.
- [ ] **Tesina: Presentazione di 8 minuti con 4 slide**: Affidarsi a una demo mai provata → Un guasto interrompe il discorso e impedisce di verificare il flusso.
- [ ] **Canvas API: disegno 2D in HTML**: Disegnare sull'elemento canvas senza ottenere il contesto → L'elemento è solo l'area: i metodi di disegno stanno sul contesto restituito da getContext('2d'). Chiamare fillRect sull'elemento è un errore, perché quel metodo sull'elemento non esiste.
- [ ] **Canvas API: disegno 2D in HTML**: Confondere attributi width/height del canvas con le omonime proprietà CSS → Gli attributi definiscono la risoluzione della bitmap (predefiniti 300 per 150), il CSS la dimensione di visualizzazione. Se differiscono, la bitmap viene scalata e appare sfocata o deformata.
- [ ] **Canvas API: disegno 2D in HTML**: Trattare le forme disegnate come oggetti cliccabili e spostabili → Il modello è immediato: restano solo i pixel, non oggetti forma. Per spostare qualcosa si cancella e si ridisegna; per intercettare un click su una forma si calcolano le coordinate a mano.
- [ ] **Canvas API: disegno 2D in HTML**: Dimenticare beginPath() tra forme indipendenti → Il percorso corrente accumula i tratti: senza beginPath, il nuovo arco o segmento si collega ai precedenti e fill/stroke li disegnano come un'unica figura, con linee e riempimenti indesiderati.
- [ ] **Canvas API: disegno 2D in HTML**: Scrivere contenuti importanti solo sul canvas senza alternativa accessibile → Il canvas è una bitmap: le tecnologie assistive non ricavano informazioni sugli oggetti disegnati e il testo rasterizzato perde leggibilità ingrandendolo. Servono testo di riserva o alternative equivalenti per i contenuti significativi.
- [ ] **DHTML: Dynamic HTML**: Definire DHTML come un linguaggio di programmazione o una nuova versione di HTML → DHTML è un termine collettivo storico per l'uso combinato di HTML, CSS e JavaScript con il DOM. Non ha una sua sintassi né una sua specifica: le tecnologie restano quelle, già note singolarmente.
- [ ] **DHTML: Dynamic HTML**: Affermare che con DHTML la pagina ottiene dati aggiornati dal server senza ricaricarsi → Quello è il contributo di AJAX (richieste asincrone di dati). Il DHTML da solo trasforma ciò che è già arrivato nel browser: struttura, stili e contenuti locali.
- [ ] **DHTML: Dynamic HTML**: Credere che ogni effetto dinamico richieda JavaScript, compreso un rollover → Effetti di sola presentazione legati a stati come il passaggio del mouse si esprimono in CSS con :hover. JavaScript serve quando l'effetto dipende da una logica o da uno stato da elaborare.
- [ ] **DHTML: Dynamic HTML**: Negli abbinamenti, associare DHTML a opzioni fuori dal contesto web → È la trappola segnalata nel materiale di studio: opzioni come reti locali o installazione di sistemi operativi sono distrattori fuori contesto. DHTML coinvolge solo HTML, CSS, JavaScript e DOM nel browser.
- [ ] **Eventi: locali vs remoti**: Classificare il click come evento remoto perché la pagina arriva da un server → Il criterio è l'origine dell'evento, non quella della pagina: il click nasce dall'interazione dell'utente nel browser ed è gestito localmente dai listener. Remoto è ciò che nasce fuori dal client e deve viaggiare sulla rete.
- [ ] **Eventi: locali vs remoti**: Descrivere i Server-Sent Events come canale bidirezionale → SSE è un flusso unidirezionale dal server al client (EventSource, formato text/event-stream): la pagina non può inviare messaggi su quel canale. Per la bidirezionalità continua serve WebSocket, oppure normali richieste separate dal client.
- [ ] **Eventi: locali vs remoti**: Presentare il polling come aggiornamento in tempo reale senza costi → Il polling interroga a intervalli: tra un controllo e l'altro le novità aspettano, e molti controlli tornano a vuoto consumando richieste. È semplice, ma né istantaneo né gratuito.
- [ ] **Eventi: locali vs remoti**: Confondere preventDefault e stopPropagation → preventDefault annulla l'azione predefinita del browser (per esempio l'invio del form); stopPropagation interrompe la propagazione dell'evento ad altri nodi. Scambiarli lascia partire invii indesiderati o non ferma i listener degli antenati.
- [ ] **Eventi: locali vs remoti**: Pensare che con HTTP ordinario il server possa avvisare la pagina quando vuole → Nel modello richiesta-risposta di HTTP è il client a iniziare: il server non apre conversazioni. Per questo servono polling, long polling, oppure canali persistenti come SSE e WebSocket (questo dopo un handshake iniziale via HTTP).
- [ ] **Motore JavaScript: parser, AST, profiler, JIT**: Dire che il parser esegue il codice JavaScript → Il parser analizza il testo sorgente e costruisce l'AST, segnalando gli errori di sintassi. L'esecuzione comincia dopo, con l'interprete che gira sul bytecode generato a partire dall'AST.
- [ ] **Motore JavaScript: parser, AST, profiler, JIT**: Confondere l'AST con il codice macchina o con il bytecode → L'AST è la rappresentazione ad albero della struttura del programma, ancora indipendente dalla macchina. Il bytecode è una rappresentazione compatta eseguita dall'interprete; il codice macchina è il prodotto finale del JIT per le parti calde.
- [ ] **Motore JavaScript: parser, AST, profiler, JIT**: Pensare che il JIT compili tutto il programma prima di iniziare a eseguirlo → Just-In-Time significa durante l'esecuzione e in modo selettivo: si comincia interpretando il bytecode e si compila in codice macchina solo ciò che il profiler segnala come caldo. Compilare tutto prima è la strategia AOT, diversa.
- [ ] **Motore JavaScript: parser, AST, profiler, JIT**: Attribuire il DOM al motore JavaScript → Il motore implementa il linguaggio ECMAScript; il DOM lo fornisce il browser che ospita il motore, come precisa la documentazione ufficiale di V8. In Node.js, infatti, document non esiste.
- [ ] **Motore JavaScript: parser, AST, profiler, JIT**: Credere che una volta ottimizzato, il codice resti tale per sempre → Le ottimizzazioni JIT sono speculative, basate sui tipi osservati dal feedback: se arriva un valore di tipo diverso, il motore deottimizza e torna al bytecode per mantenere il risultato corretto.
- [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0**: Trattare Web 1.0, 2.0, 3.0, 4.0 come versioni ufficiali rilasciate in date precise → Sono etichette descrittive di tendenze, con confini sfumati e fasi che convivono: nessun organismo le rilascia e le datazioni sono solo indicative. Le domande si risolvono con le caratteristiche, non con gli anni.
- [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0**: Attribuire i contenuti generati dagli utenti al Web 1.0 → Il Web 1.0 è di sola lettura: pochi autori, pagine statiche uguali per tutti. Partecipazione, profili e contenuti degli utenti sono la firma del Web 2.0.
- [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0**: Rispondere sul Web 3.0 con significati diversi dal web semantico del materiale del corso → Nel materiale di studio del corso (SYLLABUS e MATERIALE_UTENTE) il 3.0 è il Web semantico: dati condivisi e riusabili tra applicazioni con formati comuni come RDF e significato elaborabile dalle macchine. È in quel quadro che vanno date le risposte.
- [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0**: Far entrare negli abbinamenti opzioni fuori contesto come LAN o fasi di installazione → Sono i distrattori segnalati dal materiale di studio: termini di reti locali o di sistemi operativi non sono generazioni del Web. Un'opzione che non riguarda contenuti, interazione, dati o servizi web va scartata immediatamente.
- [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0**: Credere che una nuova generazione elimini del tutto le precedenti → Le fasi si sovrappongono: oggi convivono pagine statiche, applicazioni partecipative e dati semantici. Descrivono modelli d'uso prevalenti in un periodo, non sostituzioni complete.
- [ ] **Quiz e form: domande a scelta multipla e raccolta risposte**: Affidarsi al solo colore per il feedback → Il significato deve essere comunicato anche con testo, perché il colore da solo non è sufficiente.
- [ ] **Quiz e form: domande a scelta multipla e raccolta risposte**: Usare name diversi per ogni radio della stessa domanda → Si perderebbe il comportamento di selezione esclusiva nativo del gruppo.
- [ ] **Quiz e form: domande a scelta multipla e raccolta risposte**: Trattare il submit vuoto come risposta errata → La mancata scelta è un caso distinto e può richiedere un messaggio di completamento.
- [ ] **Tesina: Esercitazione guidata e modello presentazione**: Implementare tutte le funzioni prima di provarne una → Gli errori precoci si accumulano e diventano più difficili da isolare.
- [ ] **Tesina: Esercitazione guidata e modello presentazione**: Copiare il modello di slide senza adattarlo al progetto → Il racconto deve corrispondere a componenti e comportamenti realmente presenti.
- [ ] **Tesina: Esercitazione guidata e modello presentazione**: Considerare una demo riuscita come test completo → La demo mostra un percorso; non verifica automaticamente input invalidi e fallimenti.
- [ ] **Tag <span>: uso e scopi**: Dire che lo span introduce un'interruzione di riga come il div → Lo span è inline: resta nel flusso del testo senza andare a capo. Il div è il contenitore generico a blocco e forza una riga propria. Confondere i due livelli è la trappola centrale negli abbinamenti su questo tag.
- [ ] **Tag <span>: uso e scopi**: Usare lo span per rendere un testo importante o enfatizzato → Importanza ed enfasi sono significati, e hanno i loro elementi: strong ed em. Lo span non rappresenta nulla: con uno stile lo fai solo sembrare importante per chi vede, senza dirlo a chi usa tecnologie assistive.
- [ ] **Tag <span>: uso e scopi**: Costruire pulsanti con span cliccabili invece di button o a → Lo span non è focalizzabile, non risponde alla tastiera come un controllo e non espone un ruolo adeguato. Un'azione vuole un button, un collegamento vuole un a con href.
- [ ] **Tag <span>: uso e scopi**: Aspettarsi che uno span rispetti width ed height senza cambiare display → Come elemento inline non sostituito, lo span ignora width, height e margini verticali ai fini del layout. Per dimensionarlo occorre display: inline-block o block.
- [ ] **Tag <span>: uso e scopi**: Mettere blocchi come div o paragrafi dentro uno span → Il modello di contenuto dello span è il phrasing content (testo ed elementi inline). Contenuti a blocco dentro uno span sono markup non valido e producono comportamenti imprevedibili.
