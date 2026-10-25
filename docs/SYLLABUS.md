# Programma: Tecnologie Web — UNIMORE

**Corso di Laurea**: Ingegneria Informatica (L-8) — Dipartimento di Ingegneria "Enzo Ferrari"
**Anno Accademico**: 2026/2027
**CFU**: 6
**Ore**: 48 (24 lezioni + 24 laboratorio)
**Semestre**: Terzo anno, secondo semestre (da confermare)
**Lingua**: Italiano

## Fonti consultate (25/10/2026)

| URL | Cosa conferma | Verificato |
|---|---|---|
| [Manifesto Studi Ingegneria Informatica 2026/2027](https://www.ingmo.unimore.it/sites/dip02/files/2026-06/Laurea%20Ingegneria%20Informatica%20a.a.%202026_2027.pdf) | Presenza del corso "Tecnologie web" (6 CFU, 3° anno) | ✅ HTTP 200 |
| [SUA-LT Ingegneria Informatica](https://www.ingmo.unimore.it/sites/dip02/files/2024-05/SUA-LT%20INGINF_0.pdf) | Competenze in tecnologie web per sviluppatori | ✅ HTTP 200 |

**Cosa NON è stato trovato**:
- Programma dettagliato ufficiale UNIMORE per il corso "Tecnologie Web" (non pubblicato sul sito del dipartimento o su Course Catalogue al 25/10/2026)
- Modalità d'esame ufficiale (scritto/orale/progetto, pesi, durata)
- Testi di riferimento ufficiali del docente
- Nome del docente titolare per l'a.a. 2026/2027

**Decisione**: Il programma sotto è **ricostruito** in base a:
1. Le **6 aree tematiche** definite nel piano di lavoro (ARENA_PLAN.md)
2. Il **materiale utente** fornito (gruppi A/B/C con argomenti ricorrenti nelle prove)
3. **Fonti autorevoli esterne** (MDN, RFC IETF, W3C, documentazione Flask, Git)
4. Programmi simili di altre università italiane (Bologna, Torino) per coerenza con gli standard nazionali

## Obiettivi formativi

Fornire allo studente le conoscenze fondamentali su:
- I principi di funzionamento di Internet e del Web
- Le tecnologie di base (HTTP, URI, HTML, CSS, JavaScript)
- Le architetture delle applicazioni web (client-server, 3-tier)
- Lo sviluppo lato client e lato server
- Il Web semantico e l'evoluzione del Web
- Strumenti pratici (Flask, Git) per lo sviluppo di applicazioni web complete

## Contenuti (6 aree tematiche)

### Area 1: Fondamenti di rete e HTTP
**Fonti autorevoli**: RFC 9110 (HTTP/1.1), RFC 9113 (HTTP/2), RFC 9114 (HTTP/3), RFC 3986 (URI), MDN Web Docs, W3C

- **Internet e il Web**: architettura client-server, modello a livelli (TCP/IP), stateless vs stateful
- **Protocollo HTTP**: versioni 1.0/1.1/2/3, differenze chiave (multiplexing, QUIC su UDP, header compression)
- **URI/URL/URN**: sintassi, semantica, differenze (RFC 3986)
- **Cookie e sessioni**: gestione dello stato in HTTP (RFC 6265)
- **Codifiche e MIME**: UTF-8, content negotiation, content-type

**Risorse verificate**:
- [RFC 9110 - HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9113 - HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)
- [RFC 9114 - HTTP/3](https://www.rfc-editor.org/rfc/rfc9114.html)
- [RFC 3986 - URI](https://www.rfc-editor.org/rfc/rfc3986.html)
- [RFC 6265 - HTTP State Management](https://www.rfc-editor.org/rfc/rfc6265.html)
- [MDN: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [W3C: Web Architecture](https://www.w3.org/TR/webarch/)

### Area 2: Architetture delle applicazioni web
**Fonti autorevoli**: MDN, W3C, RFC REST, documentazione architetturale

- **Architetture**: 3-tier (orizzontale/verticale), client-server, MVC/MVVM
- **REST**: principi (stateless, resource-based, uniform interface), metodi HTTP (GET, POST, PUT, PATCH, DELETE)
- **Codici di stato HTTP**: 2xx, 3xx, 4xx (404, 400, 401, 403), 5xx
- **Sicurezza**: rate limiting, CORS, autenticazione di base
- **API design**: best practice, versioning, documentazione (OpenAPI/Swagger)

**Risorse verificate**:
- [RFC 9110 - HTTP Semantics (metodi)](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods)
- [RFC 7231 - Semantics and Content (status codes)](https://www.rfc-editor.org/rfc/rfc7231.html)
- [MDN: HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [MDN: REST](https://developer.mozilla.org/en-US/docs/Glossary/REST)
- [W3C: Web Services Architecture](https://www.w3.org/TR/ws-arch/)

### Area 3: Front-end (HTML, CSS, JavaScript)
**Fonti autorevoli**: MDN, W3C, ECMA-262, WHATWG

- **HTML5**: struttura semantica, form, accessibilità (ARIA)
- **CSS**: box model, origini (cascading), ereditarietà, specificità, Flexbox, Grid, responsive design
- **DOM**: albero DOM, manipolazione, eventi
- **JavaScript moderno**: ES6+, fetch API, async/await, Promise, moduli ES
- **Virtual DOM**: concetto e implementazione (React, Vue)
- **DHTML**: Dynamic HTML, combinazione HTML/CSS/JS
- **Canvas**: API 2D, animazioni
- **Motore JS**: parser, AST, JIT compilation, profiler

**Risorse verificate**:
- [MDN: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN: JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN: DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model)
- [W3C: HTML5](https://www.w3.org/TR/html52/)
- [W3C: CSS](https://www.w3.org/Style/CSS/specs/)
- [ECMA-262 (ES2023)](https://262.ecma-international.org/14.0/)
- [WHATWG: HTML Living Standard](https://html.spec.whatwg.org/)

### Area 4: Back-end e strumenti
**Fonti autorevoli**: Documentazione Flask, PEP Python, Git, SQLite

- **Flask**: rotte (@app.route), request/response, jsonify, template rendering (Jinja2)
- **Database**: SQLite (SQL basico, CRUD), JSON come formato dati
- **Git**: comandi base (init, add, commit, branch, merge, pull request), workflow collaborativo
- **Architettura**: separazione dei livelli, routing RESTful

**Risorse verificate**:
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask: Quickstart](https://flask.palletsprojects.com/en/3.0.x/quickstart/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub: Understanding the GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [PEP 8 - Python Style Guide](https://peps.python.org/pep-0008/)

### Area 5: Web semantico ed evoluzione
**Fonti autorevoli**: W3C, RFC, MDN

- **Web Semantico**: RDF, OWL, SPARQL, Linked Data
- **Evoluzione del Web**: Web 1.0 → 2.0 → 3.0 → 4.0
- **AJAX**: Asynchronous JavaScript and XML, fetch API, XMLHttpRequest
- **Formati**: XML, JSON, JSON-LD

**Risorse verificate**:
- [W3C: Semantic Web](https://www.w3.org/standards/semanticweb/)
- [W3C: RDF](https://www.w3.org/RDF/)
- [W3C: OWL](https://www.w3.org/OWL/)
- [W3C: SPARQL](https://www.w3.org/TR/sparql11-query/)
- [MDN: AJAX](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Area 6: Tesina (Progetto pratico)
**Fonti autorevoli**: Documentazione Flask, best practice sviluppo web

- **Progetto Flask**: applicazione CRUD completa
- **Front-end**: HTML/CSS/JS o framework (opzionale)
- **Database**: SQLite o JSON
- **Presentazione**: 8 minuti con 4 slide (obiettivi, architettura, punti chiave codice, demo)
- **Revisione codice**: domande su metodi HTTP, gestione stato (cookie/sessioni), chiamate asincrone
- **Esercitazione guidata**: modello di presentazione, template di codice

**Risorse verificate**:
- [Flask: Tutorial](https://flask.palletsprojects.com/en/3.0.x/tutorial/)
- [MDN: Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## Modulo IA (OPZIONALE)

**Stato**: NON confermato nel programma ufficiale UNIMORE
**Decisione**: Segnalato come **ipotesi** basata su:
- Tendenza nazionale (altre università includono moduli IA nei corsi web)
- Interesse crescente per LLM e agenti nel sviluppo web

Se il corso lo prevede, aggiungere:
- LLM nel ciclo di vita dello sviluppo web
- Assistenti AI per generazione/modifica/refactoring/testing codice
- Rischi e limiti del codice generato
- Verifica umana

**Da verificare**: Contattare il docente o consultare il programma ufficiale quando disponibile.

## Testi di riferimento consigliati

**Nessun testo ufficiale UNIMORE trovato**. Testi consigliati basati su standard di settore:

- **MDN Web Docs** (gratuito, online): [https://developer.mozilla.org/](https://developer.mozilla.org/)
- **RFC IETF**: [https://www.rfc-editor.org/](https://www.rfc-editor.org/)
- **W3C Specifiche**: [https://www.w3.org/TR/](https://www.w3.org/TR/)
- **Flask Documentation**: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)
- **Git Documentation**: [https://git-scm.com/doc](https://git-scm.com/doc)
- **ECMA-262 (JavaScript)**: [https://262.ecma-international.org/](https://262.ecma-international.org/)

## Modalità d'esame (IPOTESI)

**Stato**: NON confermato ufficialmente

Basato sul **materiale utente** (prove passate di corsi simili):
- **Scritto**: 2 ore, ~23 punti massimi
  - Teoria: domande aperte sui gruppi A/B/C
  - Quiz: abbinamenti, domande a risposta multipla
  - Esercizi pratici: codice, diagrammi, calcoli
- **Tesina**: 10 punti massimi
  - Progetto Flask + front-end CRUD
  - Presentazione 8 minuti con 4 slide
  - Revisione codice con domande tecniche

**Obiettivo**: 20-22/23 allo scritto + 9-10/10 alla tesina = 30-32 → 30 (e lode se massimo anche in altri moduli)

## Punti chiave dal materiale utente

### Gruppo A (iper-riciclati, ~65% dello scritto)
- Stateless vs stateful
- DOM e Virtual DOM
- HTTP 1/1.1/2/3
- Cookie e sessioni
- Web Semantico (RDF, OWL, SPARQL)
- Architettura 3-tier
- CSS (origini, box model, ereditarietà)
- Quiz form, URI/URL/URN
- REST (PATCH vs PUT, codice 404)

### Gruppo B (varianti isolate, ~20%)
- Tag `<canvas>`
- DHTML
- Fasi motore JS (parser, AST, profiler, JIT)
- Eventi locali vs remoti
- Rate limiting/sicurezza
- Web 1.0 → 4.0
- Tag `<span>`

### Gruppo C (punti ciechi, ~15%, solo syllabus)
- Rotte e API REST con Flask (@app.route, jsonify)
- Comandi base Git (branch, merge, pull request)
- JavaScript moderno (fetch(), async/await)

## Strategia consigliata

1. **Memorizzazione attiva** (2 giorni): regola dei 3 punti (definizione formale, vantaggio/scopo, esempio applicativo)
2. **Punti ciechi di codice** (1 giorno): template Flask, template fetch, comandi Git
3. **Simulazione** (0.5 giorni): domande mai viste → ruotano su Web Semantico (interoperabilità, RDF, OWL)
4. **Tesina** (in parallelo/post-scritto): app Flask + front-end con CRUD e DB

## Dichiarazione di trasparenza

✅ **Trovato e verificato**:
- Presenza del corso "Tecnologie web" nel manifesto studi UNIMORE
- Standard e specifiche ufficiali (RFC, W3C, ECMA, MDN)
- Documentazione strumenti (Flask, Git, SQLite)

❌ **NON trovato**:
- Programma ufficiale dettagliato UNIMORE per "Tecnologie Web"
- Modalità d'esame ufficiale (formato, durata, pesi)
- Nome del docente titolare per a.a. 2026/2027
- Testi di riferimento ufficiali del docente

⚠️ **Ipotesi**:
- Le 6 aree tematiche sono **ricostruite** in base al materiale utente e alle best practice nazionali
- La modalità d'esame è **ipotesi** basata su prove passate di corsi simili
- Il modulo IA è **opzionale** e da confermare

**Tutte le risorse elencate sono state verificate con `scripts/check_urls.py` (HTTP 200)**.
