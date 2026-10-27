<!-- generato da scripts/gen_docs.py: non modificare a mano -->

# Checklist di ripasso — Tecnologie Web UNIMORE

## Flashcard per ripasso SM-2

> Usa queste flashcard per il ripasso a intervalli (1-3-7-14 giorni).


### Protocollo HTTP: fondamenta del Web

**Fronte**: Che cosa definisce HTTP?

**Retro**: Un protocollo applicativo stateless con semantica di richieste e risposte tra client e server.


### Codici di stato HTTP (2xx, 3xx, 4xx, 5xx)

**Fronte**: 401, 403 e 404: quale distinzione?

**Retro**: 401: credenziali mancanti/non valide; 403: richiesta compresa ma rifiutata; 404: il target non è trovato o la sua esistenza non viene rivelata.


### HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave

**Fronte**: HTTP/2 vs HTTP/3: quale HOL rimane?

**Retro**: HTTP/2 multiplexa su TCP ma una perdita TCP può bloccare tutti gli stream; HTTP/3 usa stream QUIC, la cui perdita non blocca la consegna sugli altri stream.


### HTTP: Stateless vs Stateful

**Fronte**: HTTP stateless significa che non esistono sessioni?

**Retro**: No. HTTP non lega le richieste tra loro; un'applicazione può mantenere sessioni e ricostruire il contesto usando dati espliciti, spesso un cookie.


### Cookie e sessioni: gestione dello stato in HTTP

**Fronte**: Cookie e sessione: chi conserva che cosa?

**Retro**: Il browser conserva/invia il cookie. La sessione è stato applicativo, spesso sul server, raggiunto tramite un identificatore nel cookie.


### Multiplexing: HTTP/2 vs HTTP/3

**Fronte**: Dove compare il multiplexing in HTTP/2 e HTTP/3?

**Retro**: HTTP/2: stream/frame multipli sopra TCP, con HOL da perdita TCP. HTTP/3: stream QUIC sopra UDP, con consegna indipendente tra stream.


### QUIC: protocollo di trasporto per HTTP/3

**Fronte**: Che cosa aggiunge QUIC a UDP per HTTP/3?

**Retro**: Stream multiplexati, affidabilità e controllo del flusso/congestione, recupero delle perdite e TLS 1.3 integrato; UDP resta il veicolo dei datagrammi.


### Contenuto statico vs dinamico: differenze fondamentali

**Fronte**: Statico vs dinamico: qual è il criterio corretto?

**Retro**: Il momento/processo di generazione della rappresentazione. HTTP può consegnare entrambi; caching e personalizzazione vanno valutati separatamente.


### Modello TCP/IP e stack protocollare

**Fronte**: Dove si colloca HTTP nello stack TCP/IP?

**Retro**: Nel livello Applicazione. HTTP/1.1 e HTTP/2 usano normalmente TCP; HTTP/3 usa QUIC su UDP, poi IP e il livello di accesso alla rete.


### URI, URL, URN: differenze e sintassi

**Fronte**: URI, URL e URN: qual è la relazione?

**Retro**: URI identifica in generale. URL localizza o indica l'accesso; URN nomina in un namespace. URL e URN sono esempi di URI nell'uso didattico.


### Architettura 3-tier (orizzontale e verticale)

**Fronte**: Che cosa distingue 3-tier da scaling orizzontale/verticale?

**Retro**: 3-tier separa responsabilità logiche; scale-up aumenta risorse su una macchina; scale-out aggiunge istanze. La collocazione fisica è una decisione distinta.


### Codice 404 Not Found: significato e uso

**Fronte**: 404 vs 410: che cosa afferma ciascuno?

**Retro**: 404 non trova il target o ne nasconde l'esistenza, senza specificare se l'assenza sia permanente. 410 indica una risorsa nota come rimossa definitivamente.


### REST: principi e vincoli architetturali

**Fronte**: Qual è l'unico vincolo REST opzionale?

**Retro**: Code-on-demand. HATEOAS fa parte dell'interfaccia uniforme e non è opzionale nella formulazione rigorosa.


### REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)

**Fronte**: PUT vs PATCH: sostituzione, modifica parziale e idempotenza?

**Retro**: PUT sostituisce la rappresentazione del target ed è idempotente. PATCH applica un documento di modifiche; può essere idempotente, ma il metodo non lo garantisce.


### API Design: best practice RESTful

**Fronte**: Quali decisioni rendono prevedibile il design di una API?

**Retro**: Risorse/URI, metodi HTTP, rappresentazioni, status ed errori, autenticazione/autorizzazione, paginazione e politica di compatibilità/versionamento documentate.


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


### Flask: rotte e jsonify

**Fronte**: Flask: rotte e jsonify: qual è la definizione, lo scopo e un esempio?

**Retro**: Una rotta Flask associa un URL e, facoltativamente, metodi HTTP a una funzione Python; jsonify serializza dati Python compatibili in una risposta HTTP JSON. Il routing separa gli indirizzi dalle funzioni applicative; JSON consente a client diversi di scambiare dati strutturati con un formato interoperabile. GET /api/libri/7 restituisce con jsonify un oggetto che descrive il libro con identificativo 7.


### Flask: request e response

**Fronte**: Flask: request e response: qual è la definizione, lo scopo e un esempio?

**Retro**: In Flask, `request` espone i dati HTTP in ingresso nel contesto della richiesta; una response è il messaggio HTTP in uscita, composto da status, header e corpo. Separare lettura, validazione e risposta rende esplicito il contratto dell’endpoint e permette di segnalare input errati senza confonderli con risorse mancanti. Una vista legge `request.args["q"]` dalla query string e restituisce `jsonify({"q": q}), 200`.


### Git: comandi base

**Fronte**: Git: branch, merge e pull request: qual è la definizione, lo scopo e un esempio?

**Retro**: Git è un sistema distribuito di controllo versione; un branch è un riferimento mobile a una linea di sviluppo, merge integra storie di commit e una pull request è una proposta di revisione e integrazione offerta da una piattaforma. I branch isolano il lavoro e i commit ne registrano la storia; revisione e integrazione esplicita riducono il rischio di introdurre modifiche non controllate. Si crea `feat/ricerca`, si pubblica con push e si propone una pull request da quel ramo verso `main`.


### SQLite: operazioni CRUD

**Fronte**: SQLite: operazioni CRUD: qual è la definizione, lo scopo e un esempio?

**Retro**: SQLite è un motore relazionale incorporabile che memorizza dati in un file senza richiedere un server database separato; CRUD indica Create, Read, Update e Delete. SQL consente operazioni dichiarative sui dati; le transazioni rendono controllabili le modifiche e i parametri separano i valori dalla query. Una connessione Python a SQLite inserisce un libro con INSERT, lo legge con SELECT, lo aggiorna con UPDATE e lo elimina con DELETE.


### Web Semantico: RDF, OWL, SPARQL

**Fronte**: Web Semantico: RDF, OWL, SPARQL: qual è la definizione, lo scopo e un esempio?

**Retro**: Il Web Semantico organizza dati del Web in forma interpretabile e collegabile; RDF modella affermazioni come triple, OWL esprime ontologie con semantica formale e SPARQL interroga grafi RDF. Identificatori e vocabolari condivisi facilitano integrazione e ragionamento sui dati oltre la semplice visualizzazione di pagine. RDF afferma che un libro ha un autore; OWL dichiara la classe Libro e SPARQL seleziona i libri pubblicati dopo il 2020.


### SPARQL: esempi di query

**Fronte**: SPARQL: esempi di query: qual è la definizione, lo scopo e un esempio?

**Retro**: SPARQL è il linguaggio di query per grafi RDF, basato su corrispondenza di pattern; può produrre soluzioni tabellari o grafi RDF a seconda della forma della query. Le query permettono di estrarre, verificare o trasformare informazioni in triple, senza codificare manualmente ogni relazione. Una SELECT trova libri e autori con `?libro ex:haAutore ?autore` e restituisce i valori associati alle variabili.


### Tesina: Progetto Flask + CRUD

**Fronte**: Come si progetta un CRUD Web affidabile?

**Retro**: Definire risorsa e contratto, separare client/server/dati, validare sul server, usare query parametrizzate, scegliere metodi e status coerenti e gestire gli errori nel client.


### Tesina: Domande di revisione codice

**Fronte**: Come spiegare una rotta durante una revisione?

**Retro**: Percorri gesto, richiesta, metodo e payload, validazione server, persistenza, status e aggiornamento della UI; esplicita errori e limiti.


### Tesina: Presentazione di 8 minuti con 4 slide

**Fronte**: Qual è il filo narrativo delle quattro slide?

**Retro**: Problema e obiettivi → architettura e flusso dati → codice significativo → demo o schermate; la traccia di tempo proposta è 1+2+3+2 minuti.


### IA: introduzione all’apprendimento automatico

**Fronte**: Perché il test non deve contribuire al preprocessing?

**Retro**: Per evitare leakage: i parametri della trasformazione si apprendono sul train e si applicano anche al test.


### IA: laboratorio Python e NumPy

**Fronte**: Come verifichi se un vettore scala le colonne di una matrice?

**Retro**: Confronta la lunghezza del vettore con l’ultima dimensione della matrice e applica le regole di broadcasting.


### IA: clustering e apprendimento non supervisionato

**Fronte**: Quali due passi alterna k-means?

**Retro**: Assegna i punti al centroide più vicino e aggiorna ogni centroide con la media dei punti assegnati.


### IA: riduzione della dimensionalità e PCA

**Fronte**: Perché il segno della componente principale può cambiare?

**Retro**: Una direzione e la sua opposta descrivono la stessa retta: la proiezione cambia segno, non la geometria.


### IA: supervisionato e classificazione lineare

**Fronte**: Come aggiorna il perceptron un esempio con margine non positivo?

**Retro**: Aggiunge `eta * y * x` ai pesi e `eta * y` al bias, con eta positivo.


### IA: apprendimento statistico e bayesiano

**Fronte**: Qual è l’ipotesi naive di naive Bayes?

**Retro**: Le feature sono indipendenti tra loro condizionatamente alla classe, non necessariamente in generale.


### IA: regressione lineare e minimi quadrati

**Fronte**: Come si calcola l’MSE?

**Retro**: Si eleva al quadrato ogni differenza fra target e previsione, quindi si fa la media dei quadrati.


### IA: quiz, laboratorio e lode dell’esame integrato

**Fronte**: Quali condizioni riporta [F1] per la lode finale?

**Retro**: 30 in entrambi i moduli, IA e TW, con la lode in almeno uno dei due.


### Rate limiting e sicurezza delle API

**Fronte**: 429, CORS e autenticazione: che cosa controllano?

**Retro**: 429 segnala una policy di frequenza superata; CORS disciplina la lettura cross-origin nei browser; autenticazione identifica il client. L'autorizzazione e gli altri controlli restano responsabilità dell'API.


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


### JSON: formato dati per il Web

**Fronte**: JSON: formato dati per il Web: qual è la definizione, lo scopo e un esempio?

**Retro**: JSON (JavaScript Object Notation) è un formato testuale indipendente dal linguaggio per rappresentare valori strutturati: oggetti, array, stringhe, numeri, booleani e null. Un formato condiviso rende interoperabile lo scambio di dati tra client e server; parser e serializer convertono tra testo JSON e strutture native. La stringa `{"titolo":"Il Web","disponibile":true}` rappresenta un oggetto con due membri JSON.


### AJAX: Asynchronous JavaScript and XML

**Fronte**: AJAX: richieste asincrone con Fetch e XHR: qual è la definizione, lo scopo e un esempio?

**Retro**: AJAX è un insieme di tecniche per scambiare dati in modo asincrono con il server e aggiornare parti della pagina; oggi si usano spesso Fetch e JSON, anche se il nome conserva XML. Le richieste asincrone migliorano la continuità dell’interfaccia e riducono i ricaricamenti completi; non rendono la rete istantanea né eliminano gli errori HTTP. Un gestore invoca `fetch("/api/libri")`, controlla lo status, legge il JSON e aggiorna un elemento della pagina.


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

- [ ] HTTP è applicativo e request-response
- [ ] Metodo, target e header nella richiesta; stato e header nella risposta
- [ ] La rappresentazione può essere HTML, JSON o altro
- [ ] HTTP/1.1 e HTTP/2 usano normalmente TCP; HTTP/3 usa QUIC su UDP

### Codici di stato HTTP (2xx, 3xx, 4xx, 5xx) (priorità ALTA, gruppo A)

- [ ] 1xx informativo; 2xx successo; 3xx reindirizzamento o condizioni
- [ ] 4xx richiesta o risorsa; 5xx errore del server
- [ ] 401 riguarda credenziali; 403 rifiuto di accesso
- [ ] 404 non implica assenza permanente; valutare 410
- [ ] 304 è condizionale/cache, non un redirect ordinario

### HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave (priorità ALTA, gruppo A)

- [ ] HTTP/1.1: connessioni persistenti, pipelining senza multiplexing
- [ ] HTTP/2: framing binario, stream multiplexati, TCP HOL resta
- [ ] HTTP/3: QUIC su UDP, consegna indipendente per stream
- [ ] La semantica HTTP è condivisa tra le versioni

### HTTP: Stateless vs Stateful (priorità ALTA, gruppo A)

- [ ] HTTP non collega semanticamente richieste successive
- [ ] Cookie e sessione sono concetti diversi
- [ ] Il cookie può contenere un identificatore di sessione
- [ ] Una connessione persistente non rende HTTP stateful

### Cookie e sessioni: gestione dello stato in HTTP (priorità ALTA, gruppo A)

- [ ] Set-Cookie è nella risposta; Cookie è nella richiesta successiva
- [ ] La sessione può essere sul server; il cookie spesso contiene l’ID
- [ ] Secure limita l’invio a connessioni sicure
- [ ] HttpOnly limita la lettura tramite Document.cookie
- [ ] SameSite aiuta a ridurre alcuni invii cross-site, ma non è una difesa completa

### Multiplexing: HTTP/2 vs HTTP/3 (priorità ALTA, gruppo A)

- [ ] HTTP/1.1: pipelining con risposte ordinate, non multiplexing
- [ ] HTTP/2: multiplexing su TCP, TCP HOL resta
- [ ] HTTP/3: stream QUIC su UDP, consegna indipendente tra stream
- [ ] QUIC gestisce affidabilità; UDP da solo non la fornisce

### QUIC: protocollo di trasporto per HTTP/3 (priorità ALTA, gruppo A)

- [ ] QUIC è un protocollo sopra UDP, non un sinonimo di UDP
- [ ] HTTP/3 usa QUIC; i pacchetti sono instradati da IP
- [ ] Stream QUIC: consegna ordinata per stream
- [ ] TLS 1.3 integrato; 0-RTT condizionale e soggetto a replay

### Contenuto statico vs dinamico: differenze fondamentali (priorità ALTA, gruppo A)

- [ ] Statico/dinamico riguarda il processo di generazione
- [ ] HTML può essere un file pronto o essere generato da un template
- [ ] HTTP trasporta entrambi
- [ ] Caching dipende da header, variabilità, privacy e politica

### Modello TCP/IP e stack protocollare (priorità ALTA, gruppo A)

- [ ] Applicazione: HTTP, DNS
- [ ] Trasporto: TCP, UDP; QUIC opera sopra UDP
- [ ] Internet: IP e instradamento
- [ ] Accesso alla rete: Ethernet o Wi-Fi
- [ ] OSI e TCP/IP hanno corrispondenze approssimative

### URI, URL, URN: differenze e sintassi (priorità ALTA, gruppo A)

- [ ] URI identifica una risorsa in senso generale
- [ ] URL indica localizzazione o modalità di accesso
- [ ] URN nomina in uno spazio di nomi, non garantisce risoluzione
- [ ] Il frammento è interpretato dal client nelle richieste HTTP ordinarie


## Area 2. Architetture

### Architettura 3-tier (orizzontale e verticale) (priorità ALTA, gruppo A)

- [ ] 3 tier logici: presentazione, logica applicativa, dati
- [ ] I tier possono essere co-locati o distribuiti
- [ ] Scale-up verticale: più risorse alla stessa macchina
- [ ] Scale-out orizzontale: più istanze per distribuire il carico

### Codice 404 Not Found: significato e uso (priorità ALTA, gruppo A)

- [ ] 404: target non trovato o esistenza non rivelata
- [ ] 410: risorsa nota come rimossa definitivamente
- [ ] 403: accesso rifiutato, non risorsa assente
- [ ] Flask: status HTTP nella tupla di risposta o tramite abort

### REST: principi e vincoli architetturali (priorità ALTA, gruppo A)

- [ ] Vincoli: client-server, stateless, cache, interfaccia uniforme, livelli, code-on-demand
- [ ] Code-on-demand è l’unico vincolo opzionale
- [ ] Interfaccia uniforme: risorsa, rappresentazione, messaggi auto-descrittivi, hypermedia
- [ ] REST non è un protocollo né un formato JSON

### REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE) (priorità ALTA, gruppo A)

- [ ] GET è safe e idempotente; POST non è garantito idempotente
- [ ] PUT sostituisce la rappresentazione ed è idempotente
- [ ] PATCH applica un documento con semantica definita dal media type; idempotenza non garantita
- [ ] DELETE è idempotente quanto all’effetto, anche se le risposte successive possono differire
- [ ] Safe non significa privo di log o di effetti tecnici

### API Design: best practice RESTful (priorità ALTA, gruppo A)

- [ ] Il percorso identifica una risorsa; il metodo indica l’intento
- [ ] Documentare media type, status ed errori
- [ ] Definire limiti, ordine e continuazione della paginazione
- [ ] Versionamento e nomi delle collezioni sono scelte da documentare
- [ ] Validare input e autorizzare ogni operazione

### Rate limiting e sicurezza delle API (priorità MEDIA, gruppo B)

- [ ] Policy: chiave, soglia, finestra/algoritmo
- [ ] 429 Too Many Requests; Retry-After può indicare l’attesa
- [ ] Contatori coordinati se l’API ha più istanze
- [ ] CORS disciplina la lettura cross-origin nei browser
- [ ] TLS, autenticazione, autorizzazione e validazione hanno ruoli distinti


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

- [ ] @app.route/@app.get associa URL e metodi a una vista
- [ ] I parametri dinamici sono passati alla funzione secondo il converter
- [ ] jsonify restituisce JSON; status HTTP distingue successo ed errore

### Flask: request e response (priorità ALTA, gruppo C)

- [ ] request.args: query string; request.form: campi form; get_json: body JSON
- [ ] Validare tipo, presenza e vincoli prima di usare l’input
- [ ] Response: status, header e corpo; 400 input errato, 404 risorsa assente

### Git: comandi base (priorità ALTA, gruppo C)

- [ ] branch/switch: creare e cambiare linea di sviluppo
- [ ] merge integra nel branch corrente; gestire conflitti con status/add
- [ ] push pubblica; pull aggiorna; pull request è una funzione della piattaforma

### SQLite: operazioni CRUD (priorità ALTA, gruppo C)

- [ ] CRUD: INSERT, SELECT, UPDATE, DELETE
- [ ] Usare placeholder ? e parametri per i valori SQL
- [ ] Confermare la transazione e chiudere la connessione

### JSON: formato dati per il Web (priorità MEDIA, gruppo C)

- [ ] JSON: oggetti, array, stringhe, numeri, booleani e null
- [ ] Python: dumps/loads per stringa, dump/load per file
- [ ] Validare i dati dopo il parsing; JSON non è un database


## Area 5. Web semantico ed evoluzione

### Web Semantico: RDF, OWL, SPARQL (priorità ALTA, gruppo A)

- [ ] RDF: triple soggetto-predicato-oggetto e grafi
- [ ] OWL: classi, proprietà e assiomi con semantica formale
- [ ] SPARQL: query dei grafi RDF

### SPARQL: esempi di query (priorità ALTA, gruppo A)

- [ ] SELECT produce soluzioni; ASK verifica esistenza; CONSTRUCT crea un grafo
- [ ] Le variabili uguali collegano pattern; FILTER restringe i risultati
- [ ] ORDER BY rende esplicito l’ordinamento

### AJAX: Asynchronous JavaScript and XML (priorità MEDIA, gruppo B)

- [ ] Fetch è Promise-based; XHR usa eventi/callback
- [ ] Controllare response.ok: 4xx/5xx non rifiutano fetch automaticamente
- [ ] Leggere il body e aggiornare il DOM in modo sicuro


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


## Area 7. Modulo IA (apprendimento automatico, per la lode)

### IA: introduzione all’apprendimento automatico (priorità ALTA, gruppo A)

- [ ] Dati etichettati e non etichettati
- [ ] Train, validazione, test e leakage
- [ ] Accuratezza e righe/colonne della matrice di confusione

### IA: laboratorio Python e NumPy (priorità ALTA, gruppo A)

- [ ] Array, shape e assi
- [ ] Prodotto scalare rispetto a prodotto elemento per elemento
- [ ] Broadcasting, media e varianza

### IA: clustering e apprendimento non supervisionato (priorità ALTA, gruppo A)

- [ ] Gruppi non supervisionati e scelta di k
- [ ] Assegnazione, media e inerzia
- [ ] Scala delle feature e inizializzazione

### IA: riduzione della dimensionalità e PCA (priorità ALTA, gruppo A)

- [ ] Centratura con statistiche del train
- [ ] Componenti ortogonali e varianza spiegata
- [ ] Proiezione, ricostruzione e leakage

### IA: supervisionato e classificazione lineare (priorità ALTA, gruppo A)

- [ ] Score lineare e soglia
- [ ] Aggiornamento del perceptron
- [ ] Train/test e matrice di confusione

### IA: apprendimento statistico e bayesiano (priorità ALTA, gruppo A)

- [ ] Prior, likelihood, evidenza e posterior
- [ ] Indipendenza condizionata delle feature
- [ ] Smoothing ed errori di stima

### IA: regressione lineare e minimi quadrati (priorità ALTA, gruppo A)

- [ ] Target numerico e retta di regressione
- [ ] Minimi quadrati e intercetta
- [ ] MSE su dati non usati nel fit

### IA: quiz, laboratorio e lode dell’esame integrato (priorità ALTA, gruppo A)

- [ ] Quiz chiusi in trentesimi e laboratorio ON/OFF [F1]
- [ ] Media ponderata arrotondata per eccesso [F1]
- [ ] Lode: 30 in entrambi e lode in almeno uno [F1]


## Trappole d'esame

- [ ] **Protocollo HTTP: fondamenta del Web**: Confondere HTTP con il formato HTML → HTTP definisce lo scambio; HTML è uno dei possibili formati della rappresentazione trasferita.
- [ ] **Protocollo HTTP: fondamenta del Web**: Dire che ogni versione di HTTP usa messaggi testuali sul filo → HTTP/2 e HTTP/3 usano framing binario pur conservando la semantica HTTP.
- [ ] **Protocollo HTTP: fondamenta del Web**: Confondere il protocollo applicativo con il trasporto → HTTP definisce lo scambio applicativo; TCP o QUIC/UDP trasferiscono i dati secondo la versione.
- [ ] **Codici di stato HTTP (2xx, 3xx, 4xx, 5xx)**: Usare 401 e 403 come sinonimi → 401 riguarda credenziali di autenticazione mancanti/non valide; 403 riguarda un rifiuto di autorizzazione.
- [ ] **Codici di stato HTTP (2xx, 3xx, 4xx, 5xx)**: Interpretare 404 come rimozione permanente → 404 non distingue assenza temporanea e permanente; 410 può indicare una rimozione nota come definitiva.
- [ ] **Codici di stato HTTP (2xx, 3xx, 4xx, 5xx)**: Dire che ogni 3xx è un redirect verso un nuovo URL → 304 Not Modified è una risposta di validazione della cache e non richiede un nuovo target.
- [ ] **HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave**: Attribuire multiplexing a HTTP/1.1 → Il pipelining non rimuove l'ordine delle risposte; HTTP/2 aggiunge stream multiplexati.
- [ ] **HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave**: Dire che HTTP/2 risolve il blocco da perdita TCP → Tutti gli stream condividono la consegna ordinata del flusso TCP sottostante.
- [ ] **HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave**: Dire che HTTP/3 elimina ogni forma di latenza → QUIC riduce il blocco tra stream, ma perdita, congestione e latenza di rete restano possibili.
- [ ] **HTTP: Stateless vs Stateful**: Confondere stateless con sessionless → HTTP non gestisce la sessione come parte della semantica, ma l'applicazione può aggiungere cookie e session store.
- [ ] **HTTP: Stateless vs Stateful**: Dire che ogni cookie contiene l'intera sessione → Spesso contiene un identificatore; i dati possono rimanere sul server. Un cookie non è automaticamente una sessione.
- [ ] **HTTP: Stateless vs Stateful**: Dire che un JWT è sempre cifrato → La firma protegge l'integrità, non la riservatezza; un JWT firmato può essere leggibile da chi lo possiede.
- [ ] **Cookie e sessioni: gestione dello stato in HTTP**: Confondere cookie e sessione → Il cookie è memorizzato/inviato dal browser; la sessione è un contesto applicativo che può essere conservato sul server.
- [ ] **Cookie e sessioni: gestione dello stato in HTTP**: Dire che HttpOnly impedisce qualsiasi XSS → Impedisce la lettura tramite Document.cookie ma non blocca uno script malevolo dal compiere azioni nella pagina.
- [ ] **Cookie e sessioni: gestione dello stato in HTTP**: Dire che Secure cifra il cookie → Secure limita l'invio a connessioni sicure; la cifratura in transito è fornita da TLS in HTTPS.
- [ ] **Multiplexing: HTTP/2 vs HTTP/3**: Confondere connessione persistente con multiplexing → Una connessione HTTP/1.1 può restare aperta senza gestire stream indipendenti intercalati.
- [ ] **Multiplexing: HTTP/2 vs HTTP/3**: Dire che HTTP/2 non soffre mai di HOL → La perdita su TCP blocca il flusso ordinato sottostante e quindi la consegna agli stream.
- [ ] **Multiplexing: HTTP/2 vs HTTP/3**: Attribuire l'affidabilità a UDP → UDP trasporta datagrammi; QUIC implementa affidabilità, flusso e recupero delle perdite sopra UDP.
- [ ] **QUIC: protocollo di trasporto per HTTP/3**: Trattare QUIC come un alias di UDP → QUIC è un protocollo con affidabilità, stream e sicurezza che usa UDP come veicolo.
- [ ] **QUIC: protocollo di trasporto per HTTP/3**: Attribuire a UDP la cifratura TLS → La protezione crittografica è integrata da QUIC con TLS 1.3, non dal protocollo UDP.
- [ ] **QUIC: protocollo di trasporto per HTTP/3**: Promettere sempre 0-RTT → L'invio anticipato dipende da una ripresa e comporta rischi di replay; non è garantito per ogni connessione.
- [ ] **Contenuto statico vs dinamico: differenze fondamentali**: Dire che statico significa identico per sempre → Un file può essere sostituito o variato nel tempo; statico descrive la strategia di generazione, non l'immutabilità assoluta.
- [ ] **Contenuto statico vs dinamico: differenze fondamentali**: Dire che le risposte dinamiche non possono essere memorizzate → Possono essere cacheabili se freschezza e ambito di riuso sono corretti per quella risposta.
- [ ] **Contenuto statico vs dinamico: differenze fondamentali**: Classificare una pagina solo dall'estensione HTML → HTML può essere un file statico o il risultato di un template generato dal server.
- [ ] **Modello TCP/IP e stack protocollare**: Collocare TCP al livello Internet → TCP offre un servizio di trasporto tra processi; IP si occupa dell'indirizzamento e dell'inoltro tra reti.
- [ ] **Modello TCP/IP e stack protocollare**: Trattare OSI e TCP/IP come identici → Sono modelli con diverso numero di livelli e corrispondenze solo approssimative.
- [ ] **Modello TCP/IP e stack protocollare**: Dire che HTTP/3 usa direttamente TCP → HTTP/3 usa QUIC su UDP; HTTP/2 usa TCP.
- [ ] **URI, URL, URN: differenze e sintassi**: Usare URI e URL come sinonimi perfetti → URI è il termine generale; esistono URI che non localizzano una risorsa web, come un URN.
- [ ] **URI, URL, URN: differenze e sintassi**: Dire che il frammento viene sempre spedito al server → Nelle richieste HTTP ordinarie il frammento è gestito dal client e non fa parte del target inviato al server.
- [ ] **URI, URL, URN: differenze e sintassi**: Garantire che un URN sia sempre risolvibile → Il namespace assegna un nome; la raggiungibilità o la risoluzione richiede un meccanismo ulteriore.
- [ ] **Architettura 3-tier (orizzontale e verticale)**: Dire che orizzontale significa tier su macchine diverse → La scalabilità orizzontale aggiunge istanze; la collocazione fisica dei tier è una decisione distinta.
- [ ] **Architettura 3-tier (orizzontale e verticale)**: Dire che verticale significa tutti i tier sulla stessa macchina → Lo scale-up aumenta le risorse di una macchina; i tier possono essere co-locati o distribuiti in entrambi i casi.
- [ ] **Architettura 3-tier (orizzontale e verticale)**: Consentire al browser di collegarsi direttamente al database → Esporrebbe credenziali e dati; il server applicativo deve applicare validazione e autorizzazione.
- [ ] **Codice 404 Not Found: significato e uso**: Usare 404 per indicare sempre una cancellazione definitiva → 404 non distingue assenza temporanea e permanente; 410 può indicare una rimozione nota come definitiva.
- [ ] **Codice 404 Not Found: significato e uso**: Restituire un corpo d'errore con status 200 → Lo status comunica successo e può indurre il client a trattare l'errore come una risposta valida.
- [ ] **Codice 404 Not Found: significato e uso**: Confondere 404 con 403 → 403 esprime un rifiuto di accesso; 404 comunica che il target non è trovato o che la sua esistenza viene nascosta.
- [ ] **REST: principi e vincoli architetturali**: Dire che REST è un protocollo o un formato JSON → REST è uno stile architetturale; HTTP e JSON possono essere usati per implementarlo ma non lo definiscono da soli.
- [ ] **REST: principi e vincoli architetturali**: Dire che HATEOAS è opzionale → È parte dell'interfaccia uniforme nella formulazione REST rigorosa; code-on-demand è opzionale.
- [ ] **REST: principi e vincoli architetturali**: Interpretare stateless come assenza di dati persistenti → REST non vieta database o stato delle risorse; richiede che ogni richiesta porti il contesto necessario.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Dire che PUT e PATCH sono sinonimi → PUT sostituisce la rappresentazione corrente; PATCH applica un documento di modifiche con semantica definita dal suo formato.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Dichiarare PATCH sempre non idempotente → PATCH non è garantito idempotente ma una patch di assegnazione ripetuta può lasciare invariato lo stato finale.
- [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)**: Dire che ogni PUT richiede tutte le colonne interne → PUT sostituisce le rappresentazioni HTTP del target; i campi e le regole dipendono dal contratto della risorsa, non dallo schema interno del database.
- [ ] **API Design: best practice RESTful**: Considerare /v1 obbligatorio in REST → La versione nell'URI è una strategia possibile di compatibilità, non un vincolo del protocollo HTTP o di REST.
- [ ] **API Design: best practice RESTful**: Usare un verbo nell'URI per ogni azione → Nelle API orientate alle risorse, il percorso identifica la risorsa e il metodo HTTP esprime l'intento; le convenzioni vanno documentate.
- [ ] **API Design: best practice RESTful**: Restituire sempre 200 e mettere l'errore nel testo → Lo status HTTP è una parte del contratto usata da client e intermediari e deve riflettere l'esito.
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
- [ ] **Flask: rotte e jsonify**: Restituire un dizionario Python credendo che sia testo HTML. → Il client si aspetta JSON; una risposta HTML non rispetta il formato concordato dell’endpoint.
- [ ] **Flask: rotte e jsonify**: Usare 404 per ogni input non valido. → 404 riguarda la risorsa non trovata; un corpo malformato è tipicamente un errore di richiesta, per esempio 400.
- [ ] **Flask: rotte e jsonify**: Pensare che jsonify memorizzi i dati nel database. → jsonify serializza la risposta, non fornisce persistenza né accesso al database.
- [ ] **Flask: request e response**: Usare 404 per un JSON malformato. → La rotta esiste ma la richiesta è errata: 400 è più adatto; 404 riguarda la risorsa non trovata.
- [ ] **Flask: request e response**: Leggere sempre il body con `request.form` anche se il client invia JSON. → I dati sono in formati diversi: form e JSON hanno media type e decoder differenti.
- [ ] **Flask: request e response**: Restituire 200 anche quando una prenotazione viene creata. → 201 descrive la creazione riuscita; lo status è parte del contratto della risposta.
- [ ] **Git: comandi base**: Dire che `git pull` crea una pull request. → `git pull` aggiorna il repository locale; una PR è una richiesta gestita dalla piattaforma di hosting.
- [ ] **Git: comandi base**: Eseguire merge mentre si è sul branch sorgente pensando di integrare main nel branch destinazione. → Il merge integra il branch nominato nel branch corrente; va prima selezionata la destinazione.
- [ ] **Git: comandi base**: Credere che un push equivalga a un merge. → Push pubblica commit sul remote; non integra da solo il branch in main.
- [ ] **SQLite: operazioni CRUD**: Inserire input utente concatenandolo nella query. → Il dato può essere interpretato come SQL; i placeholder separano codice e valore.
- [ ] **SQLite: operazioni CRUD**: Dimenticare WHERE in UPDATE o DELETE. → La query potrebbe modificare o cancellare tutte le righe della tabella.
- [ ] **SQLite: operazioni CRUD**: Pensare che `with conn` chiuda automaticamente la connessione. → Il context manager gestisce la transazione; la connessione resta da chiudere esplicitamente.
- [ ] **Web Semantico: RDF, OWL, SPARQL**: Dire che RDF è un linguaggio di query. → RDF è un modello di rappresentazione; il linguaggio di query dei grafi RDF è SPARQL.
- [ ] **Web Semantico: RDF, OWL, SPARQL**: Dire che OWL è soltanto sinonimo di RDF. → OWL è un linguaggio ontologico con semantica formale nell’ecosistema RDF; i ruoli sono distinti.
- [ ] **Web Semantico: RDF, OWL, SPARQL**: Pensare che un reasoner deduca qualsiasi significato umano implicito. → Il reasoner segue assiomi formali e semantica del linguaggio, non conoscenza informale non modellata.
- [ ] **SPARQL: esempi di query**: Dimenticare che variabili uguali collegano triple. → Variabili con lo stesso nome sono la condizione di join; variabili diverse non impongono uguaglianza.
- [ ] **SPARQL: esempi di query**: Affermare che i risultati sono sempre ordinati. → L’ordine non è garantito senza una clausola `ORDER BY`.
- [ ] **SPARQL: esempi di query**: Usare SELECT quando la domanda richiede solo vero/falso. → ASK restituisce un booleano di esistenza; SELECT genera soluzioni tabellari.
- [ ] **Tesina: Progetto Flask + CRUD**: Inviare al database direttamente i valori del form → Il client è sotto il controllo dell’utente: i dati vanno validati sul server.
- [ ] **Tesina: Progetto Flask + CRUD**: Usare PUT come sinonimo automatico di aggiornamento parziale → PUT sostituisce la rappresentazione secondo il contratto; PATCH serve agli aggiornamenti parziali.
- [ ] **Tesina: Progetto Flask + CRUD**: Restituire un corpo insieme a 204 → 204 indica che la risposta non contiene contenuto; usa un altro status se invii una rappresentazione.
- [ ] **Tesina: Domande di revisione codice**: Dire che fetch lancia un errore per ogni status 4xx → Una risposta 404 è una risposta HTTP; occorre controllare response.ok o status.
- [ ] **Tesina: Domande di revisione codice**: Definire PUT e PATCH equivalenti → PUT sostituisce la rappresentazione secondo il contratto, PATCH applica una modifica parziale.
- [ ] **Tesina: Domande di revisione codice**: Dire che il cookie conserva automaticamente lo stato nel server → Il cookie è trasmesso dal browser; il server deve definire e gestire il meccanismo di sessione.
- [ ] **Tesina: Presentazione di 8 minuti con 4 slide**: Riempire ogni slide di codice → Il testo fitto distrae dall’argomento e non aiuta a capire una scelta.
- [ ] **Tesina: Presentazione di 8 minuti con 4 slide**: Presentare i tempi proposti come valutazione ufficiale → La scansione 1+2+3+2 compare nel materiale utente ma non è stata verificata come regola ufficiale.
- [ ] **Tesina: Presentazione di 8 minuti con 4 slide**: Affidarsi a una demo mai provata → Un guasto interrompe il discorso e impedisce di verificare il flusso.
- [ ] **IA: introduzione all’apprendimento automatico**: Calcolare la media di normalizzazione su train e test insieme. → Il test influenzerebbe un parametro appreso: è leakage.
- [ ] **IA: introduzione all’apprendimento automatico**: Considerare l’accuratezza perfetta sul train una prova di generalizzazione. → Il modello può aver memorizzato rumore e peggiorare su dati nuovi.
- [ ] **IA: laboratorio Python e NumPy**: Scambiare `*` per il prodotto scalare di due vettori. → `*` è elemento per elemento; `@` somma i prodotti nel caso di vettori.
- [ ] **IA: laboratorio Python e NumPy**: Assumere che il broadcasting funzioni con qualunque shape. → Dalle dimensioni finali, ogni coppia deve essere uguale oppure una delle due deve valere uno.
- [ ] **IA: clustering e apprendimento non supervisionato**: Interpretare gli indici dei cluster come etichette vere. → Gli indici identificano gruppi prodotti dall’algoritmo; non contengono da soli un significato umano.
- [ ] **IA: clustering e apprendimento non supervisionato**: Pensare che k-means trovi sempre il minimo globale. → L’inizializzazione e la geometria dei dati possono portare a soluzioni locali diverse.
- [ ] **IA: riduzione della dimensionalità e PCA**: Ricalcolare media e componenti sul test prima di valutarlo. → Usare il test nel fit della trasformazione provoca leakage; riusa le quantità apprese sul train.
- [ ] **IA: riduzione della dimensionalità e PCA**: Dire che la componente di massima varianza è sempre la più predittiva. → La PCA non usa il target: la variabilità maggiore può essere irrilevante per la previsione.
- [ ] **IA: supervisionato e classificazione lineare**: Dire che la regressione logistica predice necessariamente un valore continuo come target. → Nel caso discusso usa probabilità e soglia per classificare.
- [ ] **IA: supervisionato e classificazione lineare**: Usare il test per aggiornare i pesi del perceptron. → Il test non sarebbe più indipendente e la valutazione sarebbe distorta.
- [ ] **IA: apprendimento statistico e bayesiano**: Scambiare `P(classe | feature)` con `P(feature | classe)`. → Posterior e likelihood condizionano su eventi diversi e non coincidono in generale.
- [ ] **IA: apprendimento statistico e bayesiano**: Sostenere che le feature naive siano sempre indipendenti senza condizioni. → L’ipotesi è indipendenza delle feature una volta fissata la classe.
- [ ] **IA: regressione lineare e minimi quadrati**: Confondere l’MSE con la media degli errori con segno. → L’MSE eleva al quadrato ogni errore prima di calcolare la media; gli errori opposti non si cancellano.
- [ ] **IA: regressione lineare e minimi quadrati**: Valutare la generalizzazione sugli stessi dati usati per stimare la retta. → Gli errori di train non sono una valutazione indipendente su dati nuovi.
- [ ] **IA: quiz, laboratorio e lode dell’esame integrato**: Sommare ON/OFF come se fosse un punteggio numerico. → La scheda descrive il laboratorio come idoneità, mentre il voto IA è determinato dai quiz [F1].
- [ ] **IA: quiz, laboratorio e lode dell’esame integrato**: Attribuire la lode integrata con 30 in entrambi ma senza lode nei moduli. → La scheda richiede anche la lode in almeno uno dei moduli [F1].
- [ ] **IA: quiz, laboratorio e lode dell’esame integrato**: Arrotondare la media ponderata all’intero più vicino. → La scheda specifica arrotondamento per eccesso, non arrotondamento al più vicino [F1].
- [ ] **Rate limiting e sicurezza delle API**: Dire che il rate limiting ferma ogni DDoS → Limita richieste secondo una policy, ma un attacco distribuito richiede ulteriori difese di rete e disponibilità.
- [ ] **Rate limiting e sicurezza delle API**: Usare CORS come sistema di autenticazione → CORS è applicato dai browser per l'accesso cross-origin; non dimostra l'identità del client e non blocca client non-browser.
- [ ] **Rate limiting e sicurezza delle API**: Contare solo in memoria su ogni istanza → Un client può distribuire il traffico tra processi e aggirare contatori separati; il servizio deve coordinare lo stato del limite.
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
- [ ] **JSON: formato dati per il Web**: Scrivere `True`, `False` e `None` come token JSON. → La sintassi JSON usa `true`, `false` e `null`; i token Python non sono validi in JSON.
- [ ] **JSON: formato dati per il Web**: Aggiungere commenti o virgole finali a un documento JSON. → Non fanno parte della grammatica JSON standard e causano errori di parsing.
- [ ] **JSON: formato dati per il Web**: Pensare che JSON valido significhi dati sicuri o corretti. → JSON garantisce la sintassi, non schema applicativo, autorizzazione o sicurezza.
- [ ] **AJAX: Asynchronous JavaScript and XML**: Dire che AJAX deve ricevere XML. → XML è nel nome storico; la tecnica può usare JSON o altri formati.
- [ ] **AJAX: Asynchronous JavaScript and XML**: Credere che fetch rifiuti automaticamente la Promise con status 404. → Una risposta HTTP 404 normalmente risolve la Promise; si deve controllare `response.ok` o `status`.
- [ ] **AJAX: Asynchronous JavaScript and XML**: Inserire titoli ricevuti con `innerHTML` senza sanificazione. → Testo remoto può contenere markup non attendibile; `textContent` lo tratta come testo.
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
