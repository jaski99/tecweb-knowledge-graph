<!-- generato da scripts/gen_docs.py: non modificare a mano -->

# Piano di studio — Tecnologie Web UNIMORE

Ordine topologico dei nodi (ogni prerequisito prima del nodo che lo usa); a parità di vincoli prima la priorità **ALTA**, poi area e id. Sessioni da circa 2 ore (un nodo non viene mai spezzato).


## Legenda

- **Gruppo A**: iper-riciclati (~65% dello scritto) - argomenti fondamentali

- **Gruppo B**: varianti (~20%) - argomenti occasionali

- **Gruppo C**: punti ciechi (~15%) - argomenti pratici da studiare attivamente


## Tempo totale per area

| area | titolo | nodi | A | B | C | tempo |
|---|---|---|---|---|---|---|
| 1 | Fondamenti rete e HTTP | 10 | 8 | 2 | 0 | 7 h 00 min |
| 2 | Architetture | 6 | 5 | 1 | 0 | 4 h 25 min |
| 3 | Front-end | 11 | 5 | 2 | 4 | 7 h 10 min |
| 4 | Back-end e strumenti | 5 | 4 | 1 | 0 | 4 h 00 min |
| 5 | Web semantico ed evoluzione | 3 | 1 | 0 | 2 | 2 h 25 min |
| 6 | Tesina | 5 | 4 | 1 | 0 | 6 h 30 min |
| 7 | Modulo IA (apprendimento automatico, per la lode) | 0 | 0 | 0 | 0 | 0 min |
| **Totale** | | 40 | **27** | **7** | **6** | **31 h 30 min** |

## Sessione 1 (1 h 35 min)

1. [ ] **Protocollo HTTP: fondamenta del Web** (`http-protocollo-base`) — area 1, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: —
2. [ ] **Codici di stato HTTP (2xx, 3xx, 4xx, 5xx)** (`codici-stato-http`) — area 1, gruppo A, concetto, priorità ALTA, 35 min. Prerequisiti: http-protocollo-base

## Sessione 2 (1 h 45 min)

3. [ ] **HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave** (`http-1-1-1-2-3-differenze`) — area 1, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: http-protocollo-base
4. [ ] **HTTP: Stateless vs Stateful** (`http-stateless-vs-stateful`) — area 1, gruppo A, concetto, priorità ALTA, 45 min. Prerequisiti: http-protocollo-base

## Sessione 3 (2 h 00 min)

5. [ ] **Cookie e sessioni: gestione dello stato in HTTP** (`cookie-sessioni-gestione-stato`) — area 1, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: http-stateless-vs-stateful
6. [ ] **Contenuto statico vs dinamico: differenze fondamentali** (`statico-vs-dinamico`) — area 1, gruppo A, concetto, priorità ALTA, 30 min. Prerequisiti: http-protocollo-base
7. [ ] **Modello TCP/IP e stack protocollare** (`tcp-ip-modello-livelli`) — area 1, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: —

## Sessione 4 (1 h 55 min)

8. [ ] **URI, URL, URN: differenze e sintassi** (`uri-url-urn-differenze`) — area 1, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: —
9. [ ] **Architettura 3-tier (orizzontale e verticale)** (`architettura-3-tier`) — area 2, gruppo A, concetto, priorità ALTA, 45 min. Prerequisiti: —
10. [ ] **Codice 404 Not Found: significato e uso** (`codice-404-not-found`) — area 2, gruppo A, abilita, priorità ALTA, 30 min. Prerequisiti: codici-stato-http

## Sessione 5 (1 h 40 min)

11. [ ] **REST: principi e vincoli architetturali** (`rest-principi`) — area 2, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: http-protocollo-base
12. [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)** (`rest-metodi-http`) — area 2, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: rest-principi

## Sessione 6 (1 h 30 min)

13. [ ] **API Design: best practice RESTful** (`api-design-best-practice`) — area 2, gruppo A, abilita, priorità ALTA, 50 min. Prerequisiti: rest-principi, rest-metodi-http
14. [ ] **CSS: Box Model** (`css-box-model`) — area 3, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: —

## Sessione 7 (1 h 50 min)

15. [ ] **CSS: origini, cascading e ereditarietà** (`css-origini-ereditarieta`) — area 3, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: —
16. [ ] **DOM e Virtual DOM** (`dom-virtual-dom`) — area 3, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: —

## Sessione 8 (1 h 35 min)

17. [ ] **HTML: form e accessibilità** (`html-form-accessibilita`) — area 3, gruppo A, abilita, priorità ALTA, 45 min. Prerequisiti: —
18. [ ] **JavaScript moderno: fetch, async/await** (`javascript-fetch-async-await`) — area 3, gruppo A, abilita, priorità ALTA, 50 min. Prerequisiti: —

## Sessione 9 (1 h 50 min)

19. [ ] **Flask: rotte e jsonify** (`flask-rotte-jsonify`) — area 4, gruppo A, abilita, priorità ALTA, 60 min. Prerequisiti: —
20. [ ] **Flask: request e response** (`flask-request-response`) — area 4, gruppo A, abilita, priorità ALTA, 50 min. Prerequisiti: flask-rotte-jsonify

## Sessione 10 (2 h 05 min)

21. [ ] **Git: comandi base** (`git-comandi-base`) — area 4, gruppo A, abilita, priorità ALTA, 50 min. Prerequisiti: —
22. [ ] **JSON: formato dati per il Web** (`json-formato-dati`) — area 4, gruppo A, concetto, priorità ALTA, 30 min. Prerequisiti: —
23. [ ] **AJAX: Asynchronous JavaScript and XML** (`ajax-fetch-xhr`) — area 5, gruppo A, abilita, priorità ALTA, 45 min. Prerequisiti: javascript-fetch-async-await

## Sessione 11 (2 h 00 min)

24. [ ] **Tesina: Esercitazione guidata e modello presentazione** (`tesina-esercitazione-guidata`) — area 6, gruppo A, tipo_esercizio, priorità ALTA, 60 min. Prerequisiti: —
25. [ ] **Multiplexing: HTTP/2 vs HTTP/3** (`multiplexing-http-2-3`) — area 1, gruppo B, abilita, priorità MEDIA, 30 min. Prerequisiti: http-1-1-1-2-3-differenze
26. [ ] **QUIC: protocollo di trasporto per HTTP/3** (`quic-protocollo`) — area 1, gruppo B, concetto, priorità MEDIA, 30 min. Prerequisiti: http-1-1-1-2-3-differenze

## Sessione 12 (1 h 40 min)

27. [ ] **Rate limiting e sicurezza delle API** (`rate-limiting-sicurezza`) — area 2, gruppo B, concetto, priorità MEDIA, 40 min. Prerequisiti: api-design-best-practice
28. [ ] **Eventi: locali vs remoti** (`eventi-locali-vs-remoti`) — area 3, gruppo B, concetto, priorità MEDIA, 30 min. Prerequisiti: —
29. [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0** (`web-1-0-2-0-3-0-4-0`) — area 3, gruppo B, concetto, priorità MEDIA, 30 min. Prerequisiti: —

## Sessione 13 (50 min)

30. [ ] **SQLite: operazioni CRUD** (`sqlite-crud`) — area 4, gruppo B, abilita, priorità MEDIA, 50 min. Prerequisiti: —

## Sessione 14 (3 h 00 min)

31. [ ] **Tesina: Progetto Flask + CRUD** (`tesina-progetto-flask-crud`) — area 6, gruppo A, abilita, priorità ALTA, 180 min. Prerequisiti: flask-rotte-jsonify, sqlite-crud, javascript-fetch-async-await

## Sessione 15 (1 h 45 min)

32. [ ] **Tesina: Domande di revisione codice** (`tesina-domande-revisione-codice`) — area 6, gruppo A, tipo_esercizio, priorità ALTA, 45 min. Prerequisiti: tesina-progetto-flask-crud, rest-metodi-http
33. [ ] **Tesina: presentazione PowerPoint (max 8 minuti)** (`tesina-presentazione-8-minuti`) — area 6, gruppo A, abilita, priorità ALTA, 60 min. Prerequisiti: tesina-progetto-flask-crud

## Sessione 16 (1 h 55 min)

34. [ ] **Quiz e form: domande a scelta multipla e raccolta risposte** (`quiz-form`) — area 6, gruppo B, abilita, priorità MEDIA, 45 min. Prerequisiti: html-form-accessibilita, javascript-fetch-async-await
35. [ ] **Canvas API: disegno 2D in HTML** (`canvas-api`) — area 3, gruppo C, abilita, priorità BASSA, 40 min. Prerequisiti: —
36. [ ] **DHTML: Dynamic HTML** (`dhtml-dynamic-html`) — area 3, gruppo C, concetto, priorità BASSA, 30 min. Prerequisiti: dom-virtual-dom

## Sessione 17 (1 h 55 min)

37. [ ] **Motore JavaScript: parser, AST, profiler, JIT** (`motore-js-parser-ast-jit`) — area 3, gruppo C, concetto, priorità BASSA, 35 min. Prerequisiti: —
38. [ ] **Tag <span>: uso e scopi** (`span-tag-uso`) — area 3, gruppo C, concetto, priorità BASSA, 20 min. Prerequisiti: —
39. [ ] **Web Semantico: RDF, OWL, SPARQL** (`web-semantico-rdf-owl`) — area 5, gruppo C, concetto, priorità BASSA, 60 min. Prerequisiti: —

## Sessione 18 (40 min)

40. [ ] **SPARQL: esempi di query** (`sparql-query-esempi`) — area 5, gruppo C, abilita, priorità BASSA, 40 min. Prerequisiti: web-semantico-rdf-owl
