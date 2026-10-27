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
| 1 | Fondamenti rete e HTTP | 10 | 10 | 0 | 0 | 7 h 00 min |
| 2 | Architetture | 6 | 5 | 1 | 0 | 4 h 25 min |
| 3 | Front-end | 11 | 4 | 6 | 1 | 7 h 10 min |
| 4 | Back-end e strumenti | 5 | 0 | 0 | 5 | 4 h 00 min |
| 5 | Web semantico ed evoluzione | 3 | 2 | 1 | 0 | 2 h 25 min |
| 6 | Tesina | 5 | 0 | 0 | 5 | 6 h 30 min |
| 7 | Modulo IA (apprendimento automatico, per la lode) | 8 | 8 | 0 | 0 | 6 h 40 min |
| **Totale** | | 48 | **29** | **8** | **11** | **38 h 10 min** |

## Sessione 1 (1 h 35 min)

1. [ ] **Protocollo HTTP: fondamenta del Web** (`http-protocollo-base`) — area 1, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: —
2. [ ] **Codici di stato HTTP (2xx, 3xx, 4xx, 5xx)** (`codici-stato-http`) — area 1, gruppo A, concetto, priorità ALTA, 35 min. Prerequisiti: http-protocollo-base

## Sessione 2 (1 h 45 min)

3. [ ] **HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3: differenze chiave** (`http-1-1-1-2-3-differenze`) — area 1, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: http-protocollo-base
4. [ ] **HTTP: Stateless vs Stateful** (`http-stateless-vs-stateful`) — area 1, gruppo A, concetto, priorità ALTA, 45 min. Prerequisiti: http-protocollo-base

## Sessione 3 (1 h 50 min)

5. [ ] **Cookie e sessioni: gestione dello stato in HTTP** (`cookie-sessioni-gestione-stato`) — area 1, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: http-stateless-vs-stateful
6. [ ] **Multiplexing: HTTP/2 vs HTTP/3** (`multiplexing-http-2-3`) — area 1, gruppo A, abilita, priorità ALTA, 30 min. Prerequisiti: http-1-1-1-2-3-differenze
7. [ ] **QUIC: protocollo di trasporto per HTTP/3** (`quic-protocollo`) — area 1, gruppo A, concetto, priorità ALTA, 30 min. Prerequisiti: http-1-1-1-2-3-differenze

## Sessione 4 (1 h 50 min)

8. [ ] **Contenuto statico vs dinamico: differenze fondamentali** (`statico-vs-dinamico`) — area 1, gruppo A, concetto, priorità ALTA, 30 min. Prerequisiti: http-protocollo-base
9. [ ] **Modello TCP/IP e stack protocollare** (`tcp-ip-modello-livelli`) — area 1, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: —
10. [ ] **URI, URL, URN: differenze e sintassi** (`uri-url-urn-differenze`) — area 1, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: —

## Sessione 5 (2 h 15 min)

11. [ ] **Architettura 3-tier (orizzontale e verticale)** (`architettura-3-tier`) — area 2, gruppo A, concetto, priorità ALTA, 45 min. Prerequisiti: —
12. [ ] **Codice 404 Not Found: significato e uso** (`codice-404-not-found`) — area 2, gruppo A, abilita, priorità ALTA, 30 min. Prerequisiti: codici-stato-http
13. [ ] **REST: principi e vincoli architetturali** (`rest-principi`) — area 2, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: http-protocollo-base

## Sessione 6 (2 h 10 min)

14. [ ] **REST: metodi HTTP (GET, POST, PUT, PATCH, DELETE)** (`rest-metodi-http`) — area 2, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: rest-principi
15. [ ] **API Design: best practice RESTful** (`api-design-best-practice`) — area 2, gruppo A, abilita, priorità ALTA, 50 min. Prerequisiti: rest-principi, rest-metodi-http
16. [ ] **CSS: Box Model** (`css-box-model`) — area 3, gruppo A, concetto, priorità ALTA, 40 min. Prerequisiti: —

## Sessione 7 (1 h 50 min)

17. [ ] **CSS: origini, cascading e ereditarietà** (`css-origini-ereditarieta`) — area 3, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: —
18. [ ] **DOM e Virtual DOM** (`dom-virtual-dom`) — area 3, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: —

## Sessione 8 (1 h 35 min)

19. [ ] **HTML: form e accessibilità** (`html-form-accessibilita`) — area 3, gruppo A, abilita, priorità ALTA, 45 min. Prerequisiti: —
20. [ ] **JavaScript moderno: fetch, async/await** (`javascript-fetch-async-await`) — area 3, gruppo C, abilita, priorità ALTA, 50 min. Prerequisiti: —

## Sessione 9 (1 h 50 min)

21. [ ] **Flask: rotte e jsonify** (`flask-rotte-jsonify`) — area 4, gruppo C, abilita, priorità ALTA, 60 min. Prerequisiti: —
22. [ ] **Flask: request e response** (`flask-request-response`) — area 4, gruppo C, abilita, priorità ALTA, 50 min. Prerequisiti: flask-rotte-jsonify

## Sessione 10 (1 h 40 min)

23. [ ] **Git: comandi base** (`git-comandi-base`) — area 4, gruppo C, abilita, priorità ALTA, 50 min. Prerequisiti: —
24. [ ] **SQLite: operazioni CRUD** (`sqlite-crud`) — area 4, gruppo C, abilita, priorità ALTA, 50 min. Prerequisiti: —

## Sessione 11 (1 h 40 min)

25. [ ] **Web Semantico: RDF, OWL, SPARQL** (`web-semantico-rdf-owl`) — area 5, gruppo A, concetto, priorità ALTA, 60 min. Prerequisiti: —
26. [ ] **SPARQL: esempi di query** (`sparql-query-esempi`) — area 5, gruppo A, abilita, priorità ALTA, 40 min. Prerequisiti: web-semantico-rdf-owl

## Sessione 12 (3 h 00 min)

27. [ ] **Tesina: Progetto Flask + CRUD** (`tesina-progetto-flask-crud`) — area 6, gruppo C, abilita, priorità ALTA, 180 min. Prerequisiti: flask-rotte-jsonify, sqlite-crud, javascript-fetch-async-await

## Sessione 13 (1 h 45 min)

28. [ ] **Tesina: Domande di revisione codice** (`tesina-domande-revisione-codice`) — area 6, gruppo C, tipo_esercizio, priorità ALTA, 45 min. Prerequisiti: tesina-progetto-flask-crud, rest-metodi-http
29. [ ] **Tesina: Presentazione di 8 minuti con 4 slide** (`tesina-presentazione-8-minuti`) — area 6, gruppo C, abilita, priorità ALTA, 60 min. Prerequisiti: tesina-progetto-flask-crud

## Sessione 14 (1 h 50 min)

30. [ ] **IA: introduzione all’apprendimento automatico** (`ia-introduzione-apprendimento`) — area 7, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: —
31. [ ] **IA: laboratorio Python e NumPy** (`ia-python-numpy-lab`) — area 7, gruppo A, abilita, priorità ALTA, 60 min. Prerequisiti: —

## Sessione 15 (1 h 40 min)

32. [ ] **IA: clustering e apprendimento non supervisionato** (`ia-clustering-non-supervisionato`) — area 7, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: ia-introduzione-apprendimento, ia-python-numpy-lab
33. [ ] **IA: riduzione della dimensionalità e PCA** (`ia-riduzione-dimensionalita`) — area 7, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: ia-introduzione-apprendimento, ia-python-numpy-lab

## Sessione 16 (1 h 45 min)

34. [ ] **IA: supervisionato e classificazione lineare** (`ia-supervisionato-classificazione-lineare`) — area 7, gruppo A, concetto, priorità ALTA, 55 min. Prerequisiti: ia-introduzione-apprendimento, ia-python-numpy-lab
35. [ ] **IA: apprendimento statistico e bayesiano** (`ia-bayes-apprendimento-statistico`) — area 7, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: ia-supervisionato-classificazione-lineare

## Sessione 17 (2 h 05 min)

36. [ ] **IA: regressione lineare e minimi quadrati** (`ia-regressione`) — area 7, gruppo A, concetto, priorità ALTA, 50 min. Prerequisiti: ia-supervisionato-classificazione-lineare, ia-python-numpy-lab
37. [ ] **IA: quiz, laboratorio e lode dell’esame integrato** (`ia-esame-quiz-lab-lode`) — area 7, gruppo A, tipo_esercizio, priorità ALTA, 35 min. Prerequisiti: ia-supervisionato-classificazione-lineare, ia-clustering-non-supervisionato, ia-regressione, ia-bayes-apprendimento-statistico, ia-riduzione-dimensionalita
38. [ ] **Rate limiting e sicurezza delle API** (`rate-limiting-sicurezza`) — area 2, gruppo B, concetto, priorità MEDIA, 40 min. Prerequisiti: api-design-best-practice

## Sessione 18 (2 h 15 min)

39. [ ] **Canvas API: disegno 2D in HTML** (`canvas-api`) — area 3, gruppo B, abilita, priorità MEDIA, 40 min. Prerequisiti: —
40. [ ] **DHTML: Dynamic HTML** (`dhtml-dynamic-html`) — area 3, gruppo B, concetto, priorità MEDIA, 30 min. Prerequisiti: dom-virtual-dom
41. [ ] **Eventi: locali vs remoti** (`eventi-locali-vs-remoti`) — area 3, gruppo B, concetto, priorità MEDIA, 30 min. Prerequisiti: —
42. [ ] **Motore JavaScript: parser, AST, profiler, JIT** (`motore-js-parser-ast-jit`) — area 3, gruppo B, concetto, priorità MEDIA, 35 min. Prerequisiti: —

## Sessione 19 (1 h 45 min)

43. [ ] **Evoluzione del Web: 1.0 → 2.0 → 3.0 → 4.0** (`web-1-0-2-0-3-0-4-0`) — area 3, gruppo B, concetto, priorità MEDIA, 30 min. Prerequisiti: —
44. [ ] **JSON: formato dati per il Web** (`json-formato-dati`) — area 4, gruppo C, concetto, priorità MEDIA, 30 min. Prerequisiti: —
45. [ ] **AJAX: Asynchronous JavaScript and XML** (`ajax-fetch-xhr`) — area 5, gruppo B, abilita, priorità MEDIA, 45 min. Prerequisiti: javascript-fetch-async-await

## Sessione 20 (2 h 05 min)

46. [ ] **Quiz e form: domande a scelta multipla e raccolta risposte** (`quiz-form`) — area 6, gruppo C, abilita, priorità MEDIA, 45 min. Prerequisiti: html-form-accessibilita, javascript-fetch-async-await
47. [ ] **Tesina: Esercitazione guidata e modello presentazione** (`tesina-esercitazione-guidata`) — area 6, gruppo C, tipo_esercizio, priorità MEDIA, 60 min. Prerequisiti: —
48. [ ] **Tag <span>: uso e scopi** (`span-tag-uso`) — area 3, gruppo B, concetto, priorità BASSA, 20 min. Prerequisiti: —
