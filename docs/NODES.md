# Elenco completo dei nodi — Tecnologie Web UNIMORE

**Fonte**: `graph/graph.json` (schema v3)
**Generato da**: `graph/meta.json` + `graph/parts/area-*.json`
**Ultimo aggiornamento**: 25/10/2026
**Totale nodi**: 39

## Legenda

- **Gruppo A** (iper-riciclati, ~65% dello scritto): argomenti fondamentali che compaiono sempre nelle prove
- **Gruppo B** (varianti isolate, ~20%): argomenti che compaiono occasionalmente
- **Gruppo C** (punti ciechi, ~15%): argomenti pratici non coperti dai gruppi A/B, da studiare attivamente
- **Worker**: W1-W5 come da ARENA_PLAN.md

## Mappa Nodi → Worker

| Worker | Ramo | Scope | Nodi assegnati |
|--------|------|-------|----------------|
| W1 | feat/contenuti-1-2 | Area 1 + Area 2 | 13 nodi |
| W2 | feat/contenuti-3 | Area 3 | 10 nodi |
| W3 | feat/contenuti-4-5 | Area 4 + Area 5 | 8 nodi |
| W4 | feat/contenuti-6-quiz | Area 6 + quiz | 4 nodi |
| W5 | feat/webapp | Web app | 0 nodi (web/) |

---

## Area 1: Fondamenti rete e HTTP (Worker W1)

| ID | Titolo | Gruppo | Tipo | Prerequisiti | Worker |
|---|---|---|---|---|---|
| http-protocollo-base | Protocollo HTTP: fondamenta del Web | A | concetto | - | W1 |
| http-stateless-vs-stateful | HTTP: Stateless vs Stateful | A | concetto | http-protocollo-base | W1 |
| tcp-ip-modello-livelli | Modello TCP/IP e stack protocollare | A | concetto | - | W1 |
| http-1-1-1-2-3-differenze | HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave | A | concetto | http-protocollo-base | W1 |
| quic-protocollo | QUIC: protocollo di trasporto per HTTP/3 | A | concetto | http-1-1-1-2-3-differenze | W1 |
| uri-url-urn-differenze | URI, URL, URN: differenze e sintassi | A | concetto | - | W1 |
| cookie-sessioni-gestione-stato | Cookie e sessioni: gestione dello stato in HTTP | A | concetto | http-stateless-vs-stateful | W1 |
| codici-stato-http | Codici di stato HTTP (2xx, 3xx, 4xx, 5xx) | A | concetto | http-protocollo-base | W1 |
| multiplexing-http-2-3 | Multiplexing: HTTP/2 vs HTTP/3 | A | abilita | http-1-1-1-2-3-differenze | W1 |

**Totale Area 1**: 9 nodi (7 gruppo A, 2 gruppo A)
**Tempo stimato**: ~5 ore

---

## Area 2: Architetture (Worker W1)

| ID | Titolo | Gruppo | Tipo | Prerequisiti | Worker |
|---|---|---|---|---|---|
| architettura-3-tier | Architettura 3-tier (orizzontale e verticale) | A | concetto | - | W1 |
| rest-principi | REST: principi e vincoli architetturali | A | concetto | http-protocollo-base | W1 |
| rest-metodi-http | REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE) | A | concetto | rest-principi | W1 |
| codice-404-not-found | Codice 404 Not Found: significato e uso | A | abilita | codici-stato-http | W1 |
| api-design-best-practice | API Design: best practice RESTful | A | abilita | rest-principi, rest-metodi-http | W1 |
| rate-limiting-sicurezza | Rate limiting e sicurezza delle API | B | concetto | api-design-best-practice | W1 |

**Totale Area 2**: 6 nodi (5 gruppo A, 1 gruppo B)
**Tempo stimato**: ~4 ore

---

## Area 3: Front-end (Worker W2)

| ID | Titolo | Gruppo | Tipo | Prerequisiti | Worker |
|---|---|---|---|---|---|
| html-form-accessibilita | HTML: form e accessibilita | A | abilita | - | W2 |
| css-box-model | CSS: Box Model | A | concetto | - | W2 |
| css-origini-ereditarieta | CSS: origini, cascading e ereditarieta | A | concetto | - | W2 |
| dom-virtual-dom | DOM e Virtual DOM | A | concetto | - | W2 |
| javascript-fetch-async-await | JavaScript moderno: fetch, async/await | C | abilita | - | W2 |
| dhtml-dynamic-html | DHTML: Dynamic HTML | B | concetto | dom-virtual-dom | W2 |
| canvas-api | Canvas API: disegno 2D in HTML | B | abilita | - | W2 |
| span-tag-uso | Tag span: uso e scopi | B | concetto | - | W2 |
| motore-js-parser-ast-jit | Motore JavaScript: parser, AST, profiler, JIT | B | concetto | - | W2 |
| eventi-locali-vs-remoti | Eventi: locali vs remoti | B | concetto | - | W2 |

**Totale Area 3**: 10 nodi (3 gruppo A, 5 gruppo B, 2 gruppo C)
**Tempo stimato**: ~6 ore

---

## Area 4: Back-end e strumenti (Worker W3)

| ID | Titolo | Gruppo | Tipo | Prerequisiti | Worker |
|---|---|---|---|---|---|
| flask-rotte-jsonify | Flask: rotte e jsonify | C | abilita | - | W3 |
| flask-request-response | Flask: request e response | C | abilita | flask-rotte-jsonify | W3 |
| sqlite-crud | SQLite: operazioni CRUD | C | abilita | - | W3 |
| git-comandi-base | Git: comandi base | C | abilita | - | W3 |
| json-formato-dati | JSON: formato dati per il Web | C | concetto | - | W3 |

**Totale Area 4**: 5 nodi (tutti gruppo C)
**Tempo stimato**: ~4 ore

---

## Area 5: Web semantico ed evoluzione (Worker W3)

| ID | Titolo | Gruppo | Tipo | Prerequisiti | Worker |
|---|---|---|---|---|---|
| web-semantico-rdf-owl | Web Semantico: RDF, OWL, SPARQL | A | concetto | - | W3 |
| sparql-query-esempi | SPARQL: esempi di query | A | abilita | web-semantico-rdf-owl | W3 |
| ajax-fetch-xhr | AJAX: Asynchronous JavaScript and XML | B | abilita | javascript-fetch-async-await | W3 |

**Totale Area 5**: 3 nodi (2 gruppo A, 1 gruppo B)
**Tempo stimato**: ~2.5 ore

---

## Area 6: Tesina (Worker W4)

| ID | Titolo | Gruppo | Tipo | Prerequisiti | Worker |
|---|---|---|---|---|---|
| tesina-progetto-flask-crud | Tesina: Progetto Flask + CRUD | C | abilita | flask-rotte-jsonify, sqlite-crud, javascript-fetch-async-await | W4 |
| tesina-presentazione-8-minuti | Tesina: Presentazione di 8 minuti con 4 slide | C | abilita | tesina-progetto-flask-crud | W4 |
| tesina-domande-revisione-codice | Tesina: Domande di revisione codice | C | tipo_esercizio | tesina-progetto-flask-crud, rest-metodi-http | W4 |
| tesina-esercitazione-guidata | Tesina: Esercitazione guidata e modello presentazione | C | tipo_esercizio | - | W4 |

**Totale Area 6**: 4 nodi (tutti gruppo C)
**Tempo stimato**: ~5 ore

---

## Nodi seed completi (esempi di qualita)

I seguenti nodi hanno **lezioni complete** (v3) che servono come modello di qualita per gli altri nodi:

1. **http-stateless-vs-stateful** (Area 1, Gruppo A)
   - Intuizione: sportello postale
   - Spiegazione: HTTP stateless, meccanismi di stato (cookie, token, URL params, sessioni)
   - Analogia: bar con carta d'identita
   - Collegamenti: protocollo HTTP, architettura client-server
   - Esempi svolti: autenticazione con cookie, JWT
   - Errori comuni: stateless vs sessionless, sicurezza cookie
   - Domande autoverifica: 5 domande
   - Riepilogo: concetto chiave

2. **rest-patch-vs-put** (Area 2, Gruppo A)
   - Intuizione: matrioska vs sostituzione completa
   - Spiegazione: PUT vs PATCH, idempotenza, JSON Patch/Merge Patch
   - Analogia: giardino (potare vs rasare tutto)
   - Collegamenti: metodi HTTP, REST principi, API design
   - Esempi svolti: aggiornamento parziale, sostituzione completa, creazione PUT vs POST
   - Errori comuni: confondere PUT e PATCH
   - Domande autoverifica: 5 domande
   - Riepilogo: quando usare PUT vs PATCH

3. **css-box-model** (Area 3, Gruppo A)
   - Intuizione: scatola da regalo
   - Spiegazione: 4 componenti (content, padding, border, margin), box-sizing
   - Analogia: matrioska
   - Collegamenti: CSS base, HTML structure
   - Esempi svolti: calcolo dimensioni, centrare box
   - Errori comuni: dimenticare padding/border, margin collapsing
   - Domande autoverifica: 6 domande
   - Riepilogo: box model e box-sizing

---

## Statistiche

| Metrica | Valore |
|---|---|
| **Totale nodi** | 39 |
| **Gruppo A** | 17 nodi (~44%) |
| **Gruppo B** | 10 nodi (~26%) |
| **Gruppo C** | 12 nodi (~31%) |
| **Concetti** | 20 nodi |
| **Abilita** | 15 nodi |
| **Tipo esercizio** | 4 nodi |
| **Tempo totale stimato** | ~21.5 ore |

---

## Ordine topologico consigliato

1. **Area 1**: Fondamenti rete e HTTP (prerequisito per tutto)
2. **Area 2**: Architetture (dipende da Area 1)
3. **Area 3**: Front-end (puo essere in parallelo con Area 2)
4. **Area 4**: Back-end e strumenti (dipende da Area 1-3)
5. **Area 5**: Web semantico (dipende da Area 1)
6. **Area 6**: Tesina (dipende da Area 1-5)

---

## Priorita d'esame

Basato sul **materiale utente** e sulle prove passate:

- **Priorita ALTA**: Gruppo A (17 nodi) + nodi gruppo C pratici (Flask, Git, JS moderno)
- **Priorita MEDIA**: Gruppo B (10 nodi)
- **Priorita BASSA**: Argomenti teorici meno frequenti

**Obiettivo**: Coprire tutti i nodi Gruppo A + Gruppo C per ottenere 20-22/23 allo scritto + 9-10/10 alla tesina = **30**

---

## Riferimenti

- `graph/graph.json` — Grafo completo con tutti i nodi
- `graph/meta.json` — Metadati del corso e aree
- `graph/parts/area-*.json` — Nodi per area
- `docs/SYLLABUS.md` — Programma dettagliato e fonti
- `docs/CONTRACTS.md` — Contratti e schema dei nodi
- `docs/MATERIALE_UTENTE.md` — Materiale fornito dall'utente

**Nota**: Questo file e generato manualmente. Per dati aggiornati, fare riferimento a `graph/graph.json`.
