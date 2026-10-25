# Piano di lavoro Arena (divide et impera) — Tecnologie Web

Repo: https://github.com/jaski99/tecweb-knowledge-graph (main = integrato, Pages da main via .github/workflows/pages.yml)
Obiettivo: sito di studio italiano (knowledge graph + web app statica) per l'esame Tecnologie Web UNIMORE, mira 30 e lode.
Materiale utente: docs/MATERIALE_UTENTE.md (unica fonte sull'esame; nessun PDF delle prove). Il resto va cercato sul web (programma ufficiale UNIMORE se identificabile, MDN, RFC IETF, W3C, doc Flask, Git) e dichiarato in docs/SYLLABUS.md insieme a cio' che NON si trova. Mai inventare fatti attribuiti alla docente, numeri o URL: ogni risorsa verificata con scripts/check_urls.py (HTTP 200).

## Fasi
1. FASE 1 (chat PRINCIPALE, ramo main): ripulire lo scaffold ereditato da Ingegneria del Software (graph/, docs/, web/ testi, test, README) sostituendo terminologia IdS con Tecnologie Web; scrivere docs/SYLLABUS.md, aggiornare docs/CONTRACTS.md e schema/node.schema.json se serve, creare graph/meta.json (aree 1-6 sotto) e l'ELENCO DEI NODI con id stabili e prerequisiti in docs/NODES.md (aree, id, titolo, gruppo A/B/C, prerequisiti hard/soft senza cicli, ramo assegnato). Far passare tutti i test (anche con 0-1 nodi seed) e fare push su main. Poi fermarsi e riportare.
2. FASE 2 (worker in parallelo, un ramo ciascuno, scope esclusivo): vedi tabella.
3. FASE 3 (chat principale): merge, test, deploy Pages, QA screenshot mobile 390x844 e desktop 1440x900 in docs/screens/.

## Aree
1 Fondamenti rete e HTTP (stateless/stateful, TCP/IP, HTTP 1/1.1/2/3, QUIC, multiplexing, cookie e sessioni, URI/URL/URN)
2 Architetture (3-tier orizzontale/verticale, REST: PATCH vs PUT, codici 404, API, rate limiting/sicurezza)
3 Front-end (HTML/form, CSS origini/box model/ereditarieta', DOM e Virtual DOM, DHTML, canvas, span, JS moderno fetch/async-await, motore JS parser/AST/profiler/JIT, eventi locali vs remoti)
4 Back-end e strumenti (Flask rotte/jsonify, SQLite/JSON, Git branch/merge/pull request)
5 Web semantico ed evoluzione (RDF, OWL, SPARQL, Web 1.0-4.0, AJAX)
6 Tesina (progetto Flask + front-end CRUD, presentazione 8 minuti con 4 slide, domande di revisione codice, esercitazione guidata + modello presentazione)
Nodo "Modulo IA" SOLO se il corso lo prevede (verificare); altrimenti segnalarlo in SYLLABUS.md come ipotesi.

## Worker Fase 2
| id | ramo | scope esclusivo |
|----|------|-----------------|
| W1 | feat/contenuti-1-2 | graph/parts/area-1.json, area-2.json (+ lezioni) |
| W2 | feat/contenuti-3 | graph/parts/area-3.json |
| W3 | feat/contenuti-4-5 | graph/parts/area-4.json, area-5.json |
| W4 | feat/contenuti-6-quiz | graph/parts/area-6.json, banca quiz/abbinamenti (con distrattori fuori contesto) e flashcard in graph/ |
| W5 | feat/webapp | web/ (grafo, percorso, progresso, filtri, ricerca, tema, lettore lezioni, simulatore esame 2h, ripasso SM-2), testi UI italiani |

## Contenuto di ogni nodo (lezione completa e autosufficiente)
intuizione, spiegazione estesa con esempi di codice/diagrammi mermaid corretti, analogia, collegamenti a conoscenze precedenti, esempi svolti con passi, errori comuni (incluse trappole negli abbinamenti), domande di autoverifica con risposta, riepilogo, prerequisiti hard/soft senza cicli, priorita' d'esame motivata sui gruppi A/B/C, tempo di studio, risorse gratuite verificate.

## Qualita'
SOLID, moduli piccoli e coesi, basso accoppiamento, aperto/chiuso, test per ogni modulo (pytest, node --test, Playwright), nomi coerenti, niente codice morto. Tutti i test verdi prima di ogni push. Testi in italiano.

## Consegna di ogni chat
Codice + test + push sul proprio ramo + riepilogo breve (cosa fatto, come testare, limiti).
