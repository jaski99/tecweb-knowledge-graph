# Piano di miglioramento — Round 2 (sintesi R1, R2, R3)

> Scritto il 27/10/2026 dal coordinatore. Fonti: `docs/research/R1-competitor.md` (R1), `docs/research/R2-manuali-didattica.md` (R2), `docs/research/R3-programma-esame.md` (R3, con fonti F1–F27). Regola di base: ciò che R3 marca **[FATTO]** si può scrivere come fatto citando la fonte (es. «[F1]»); **[IPOTESI]** va presentato come ipotesi; **[NON TROVATO]** non si inventa.
>
> **Decisione già presa (utente/coordinatore):** il sito include un **modulo IA di base** (area 7), perché la lode dell'esame integrato INF-37 richiede **30 in entrambi i moduli** (IA e TW) e la lode in almeno uno [F1].

## 0. Cosa cambia e perché (sintesi)

1. **Identità del corso sbagliata** (R3 §3.1): `docs/SYLLABUS.md` usa I215-020 «Programmazione per il web» (Django, orale). Il corso giusto è il modulo **Tecnologie Web** (prof.ssa **Laura Po**, 6 CFU/54 h) dell'integrato **[INF-37] Intelligenza Artificiale e Tecnologie Web** (12 CFU/108 h, titolare **Simone Calderara**, 3° anno Ingegneria Informatica MO, a.a. 2026/27) [F1][F8][F14].
2. **Formato d'esame reale TW** [F1]: scritto **0–23** (domande aperte e chiuse + esercizi per realizzare un'applicazione Web, **senza appunti**), tesina individuale **0–10** (~3 settimane, tecnologie a libera scelta, PowerPoint **max 8 minuti**, discussione di scelte e codice), **nessuna prova intermedia**. «2 ore» e «4 slide» sono **[NON TROVATO]** → marcarli come ipotesi.
3. **Modulo IA ufficiale** [F1]: apprendimento automatico (introduzione all'IA, teoria dell'apprendimento, supervisionato e classificazione lineare, apprendimento statistico/bayesiano, clustering/non supervisionato, regressione, riduzione delle dimensioni, laboratorio Python/numpy); verifica = **quiz chiusi** (voto in trentesimi) + **laboratorio ON/OFF**. Non riguarda LLM/agenti.
4. **Copertura**: mancano React, mashup, event-driven, sensori mobili, Python di base, servizi RESTful con Flask, Git collaborativo; sovrappesati RDF/OWL/SPARQL, HTTP/3/QUIC, canvas, DHTML, motore JS, Web 1.0–4.0 (R3 §2.2–2.4).
5. **Errori tecnici nelle lezioni** (R2 §3.2): RDF (soggetto anche blank node), DOM worked example (risultato 1 ≠ 3), URI relativo, margini negativi CSS, newline letterali in `codice-404-not-found`, cascata con `@layer`, Merge Patch, binding SPARQL, checkbox non inviata.
6. **Bug del simulatore** (R2 §3.3): `catalogoEsercizi` ignora `graph/quiz.json` (chiave `elementi`): 0 quesiti della banca usati; risposte corrette sempre `a`.
7. **Web app** (R1 §4): livelli di padronanza, sessione di oggi con data d'esame, PWA offline, backup/export Anki, grafo leggibile e accessibile, igiene del ripasso.

## 1. Nuovo significato di gruppi A/B/C e priorità

I gruppi restano nello schema (`A|B|C`) ma diventano **priorità di studio derivata dal programma ufficiale [F1]**, non «ricorrenza nelle prove passate» (le percentuali 65/20/15 di `MATERIALE_UTENTE.md` sono **ipotesi dell'utente**, da citare solo come tali). A = elencato esplicitamente in [F1] o indispensabile per lo scritto/tesina; B = approfondimento o contesto utile; C = fuori dal programma 2026/27 / opzionale.

### 1.1 Priorità dei nodi esistenti (applicata da X1 in `graph/parts`, testi coerenti da X4)

| Nodi | Gruppo nuovo | Priorità | Motivo |
|---|---|---|---|
| `git-comandi-base`, `flask-rotte-jsonify`, `flask-request-response`, `javascript-fetch-async-await`, `ajax-fetch-xhr`, `json-formato-dati` | A | alta | elencati in [F1] |
| `tesina-progetto-flask-crud`, `tesina-presentazione-8-minuti`, `tesina-domande-revisione-codice`, `tesina-esercitazione-guidata` | A | alta | tesina 0–10 [F1] |
| `eventi-locali-vs-remoti` | B | media | contesto del nuovo nodo event-driven |
| `quic-protocollo`, `multiplexing-http-2-3` | B | media | [F1] cita HTTP/2, non HTTP/3 |
| `sqlite-crud`, `quiz-form`, `rate-limiting-sicurezza`, `web-1-0-2-0-3-0-4-0` | B | media | prerequisito/contesto, non elencato |
| `web-semantico-rdf-owl`, `sparql-query-esempi`, `canvas-api`, `dhtml-dynamic-html`, `span-tag-uso`, `motore-js-parser-ast-jit` | C | bassa | non in [F1] 2026/27 (opzionali) |
| tutti gli altri | invariati | invariati | coerenti con [F1] |

Il titolo `tesina-presentazione-8-minuti` diventa «Tesina: presentazione PowerPoint (max 8 minuti)» (gli id **non cambiano mai**).

### 1.2 Nuovi nodi (contratto: id, area, gruppo, tipo, prerequisiti). Gli id sono definitivi.

Regola anti-collisione: i nuovi nodi stanno in **file part nuovi** (`graph/parts/area-N-r2.json`, ammessi dal test `test_parts_naming_and_area`) e i prerequisiti puntano **solo a nodi già su main**. Gli archi da nodi esistenti verso nodi nuovi li aggiunge l'integrazione (§5, I-2).

| id | area | file part | gruppo | tipo | prerequisiti hard | prerequisiti soft | worker |
|---|---|---|---|---|---|---|---|
| `architetture-mashup` | 2 | `area-2-r2.json` | A | concetto | `rest-principi`, `json-formato-dati` | `architettura-3-tier` | X2 |
| `sviluppo-event-driven` | 2 | `area-2-r2.json` | A | concetto | `dom-virtual-dom` | `eventi-locali-vs-remoti`, `javascript-fetch-async-await` | X2 |
| `html5-struttura-semantica` | 3 | `area-3-r2.json` | A | abilita | — | `html-form-accessibilita` | X2 |
| `react-componenti-jsx` | 3 | `area-3-r2.json` | A | abilita | `dom-virtual-dom`, `javascript-fetch-async-await` | `json-formato-dati` | X2 |
| `sensori-mobile-web` | 3 | `area-3-r2.json` | B | concetto | `sviluppo-event-driven` | `javascript-fetch-async-await` | X2 |
| `python-base-web` | 4 | `area-4-r2.json` | A | abilita | — | `json-formato-dati` | X2 |
| `servizi-restful-flask` | 4 | `area-4-r2.json` | A | tipo_esercizio | `flask-request-response`, `rest-metodi-http`, `json-formato-dati` | `javascript-fetch-async-await`, `codici-stato-http` | X2 |
| `git-workflow-collaborativo` | 4 | `area-4-r2.json` | A | abilita | `git-comandi-base` | — | X2 |
| `ia-introduzione-apprendimento` | 7 | `area-7.json` | A | concetto | — | — | X3 |
| `ia-python-numpy-lab` | 7 | `area-7.json` | A | abilita | — | — | X3 |
| `ia-supervisionato-classificazione-lineare` | 7 | `area-7.json` | A | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | X3 |
| `ia-bayes-apprendimento-statistico` | 7 | `area-7.json` | A | concetto | `ia-supervisionato-classificazione-lineare` | — | X3 |
| `ia-clustering-non-supervisionato` | 7 | `area-7.json` | A | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | X3 |
| `ia-regressione` | 7 | `area-7.json` | A | concetto | `ia-supervisionato-classificazione-lineare` | `ia-python-numpy-lab` | X3 |
| `ia-riduzione-dimensionalita` | 7 | `area-7.json` | A | concetto | `ia-introduzione-apprendimento` | `ia-python-numpy-lab` | X3 |
| `ia-esame-quiz-lab-lode` | 7 | `area-7.json` | A | tipo_esercizio | `ia-supervisionato-classificazione-lineare`, `ia-clustering-non-supervisionato` | `ia-regressione`, `ia-bayes-apprendimento-statistico`, `ia-riduzione-dimensionalita` | X3 |

Campo `worker` dei nodi nuovi = `X2` o `X3` (lo schema ammette W1–W5 e X1–X6). Riferimenti testo ammessi in `meta.json → testi`: `MDN, RFC, W3C, FLASK, GIT, ECMA, SQLITE, PYTHON, NUMPY, SKLEARN, REACT` (aggiunti nel commit di questo piano). Ogni lezione nuova segue `docs/DIDATTICA.md` e lo schema lezione v4 di `docs/CONTRACTS.md` (13 campi: `perche_ti_serve`, `scenario_fil_rouge`, `definizione_esame`, `spiegazione`, `analogia`, `worked_example`, `completion_problem`, `esercizio_autonomo`, `errori_trappole`, `richiamo_attivo`, `riepilogo`, `flashcard`, `checklist`). Le lezioni IA usano contenuti standard di ML con fonti libere (scikit-learn User Guide, NumPy docs) e dichiarano che **non** derivano dalle slide del prof. Calderara (non pubbliche [F12]).

## 2. Worker, scope esclusivo, ramo

Ogni chat Arena pusha **solo sul proprio ramo di sessione** `arena/<id>-tecweb-knowledge-graph` (mai su `main`). Il coordinatore apre la PR e fa il merge. Nessun file compare in due scope.

| Worker | Nome | Scope esclusivo (solo questi file) | Dipende da |
|---|---|---|---|
| **X1** | Programma e priorità | `docs/SYLLABUS.md`, `docs/EXAM_FORMAT.md`, `docs/STATUS.md`, `docs/NODES.md`, `docs/CONTRACTS.md`, `docs/TAXONOMY_NOTES.md`, `docs/ARENA_PLAN.md`, `README.md`, nota iniziale in `docs/MATERIALE_UTENTE.md` (senza alterare il testo dell'utente), `graph/meta.json` (corso, testi, nota_esame, trappole), `graph/parts/area-1.json` … `area-6.json` (solo nodi esistenti: gruppo, priorità, motivazione, titolo tesina), `schema/node.schema.json` (descrizioni), `scripts/check_urls.py` (solo documentazione), `tests/test_graph.py`, nuovo `tests/test_programma.py` | — |
| **X2** | Nuove lezioni TW | `graph/parts/area-2-r2.json`, `area-3-r2.json`, `area-4-r2.json`, `graph/lezioni/<8 nuovi id X2>.json`, nuovo `tests/test_lezioni_r2.py` | — |
| **X3** | Modulo IA | `graph/parts/area-7.json`, `graph/lezioni/ia-*.json`, nuovo `tests/test_area7_ia.py` | — |
| **X4** | Revisione lezioni esistenti | `graph/lezioni/<40 id esistenti>.json`, `tests/test_lezioni.py`, `tests/test_lezioni_area3.py`, nuovo `tests/test_lezioni_correzioni.py` | — |
| **X5** | Web app | tutto `web/**` **tranne** `web/modules/simulatore/**`, `web/tests/simulatore.test.js`, `web/tests/test_e2e_simulatore.py`; più `.github/workflows/pages.yml` | contratti §3 |
| **X6** | Banca quiz e simulatore | `graph/quiz.json`, `graph/quiz.schema.json`, `docs/QUIZ_FORMAT.md`, `tests/test_quiz.py`, `web/modules/simulatore/**`, `web/tests/simulatore.test.js`, `web/tests/test_e2e_simulatore.py` | contratti §3; fase b dopo X2+X3 |

**File generati** (`graph/graph.json`, `docs/PIANO_STUDIO.md`, `docs/CHECKLIST_RIPASSO.md`; `web/graph.json` e `web/quiz.json` non sono versionati): ogni worker li rigenera sul proprio ramo per avere i test verdi (`python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh`), ma **non sono di sua proprietà**. In integrazione il coordinatore (o la chat MAIN di integrazione) risolve ogni conflitto su questi file **rigenerandoli** da `main` aggiornato, mai a mano.

### X1 — Programma e priorità (R3 §4 voci 1–8, 12, 13; R2 P0 «riallineare CONTRACTS/SYLLABUS»)
- `SYLLABUS.md` riscritto: anagrafica INF-37/TW (§0.1), docenti, coorte dichiarata (R3 voce 12), contenuti ufficiali [F1], modalità d'esame (§0.2) con «2 ore»/«4 slide» marcati IPOTESI, testi = slide Moodle + tool + esercitazioni; MDN/RFC/W3C/Flask/Git come approfondimento; sezione modulo IA ufficiale + regola della lode; tabella FATTO/IPOTESI/NON TROVATO con link F1–F27 di R3; nessun riferimento a I215-020/Django come programma.
- `EXAM_FORMAT.md` riscritto per TW+IA (via residui UML/GoF/Java/BVA); `STATUS.md` ripulito dai residui IdS; `README.md` con coorte e link al piano.
- `meta.json`: `corso.docente` = «Laura Po (modulo TW); Simone Calderara (titolare INF-37, modulo IA)», `fonte_programma` = URL [F1], `nota` aggiornata; `nota_esame` e `trappole` riscritte su [F1] (niente «prove passate» come fatto).
- `graph/parts/area-1..6.json`: priorità/gruppi/motivazioni secondo §1.1 (motivazione con citazione «[F1]» dove pertinente).
- `NODES.md`: tabella completa con 40 nodi + 16 nodi nuovi di §1.2 (marcati «in arrivo X2/X3»), conteggi coerenti, nuova legenda A/B/C (§1).
- `CONTRACTS.md`: aree 1–7, worker X1–X6, regola part `area-N-r2.json`, RFC 9110 = semantica HTTP (9112 = HTTP/1.1), esempio di login marcato «schema non sicuro» o corretto (R2 §3.2), rimando a `QUIZ_FORMAT.md` per la banca quiz.
- Test: `tests/test_programma.py` (es. SYLLABUS non contiene «I215-020» come programma, contiene «INF-37», «Laura Po», «0–23»/«0-23», «0–10»/«0-10», «8 minuti»; nessuna «2 ore» non marcata IPOTESI; priorità dei nodi di §1.1 rispettate).

### X2 — Nuove lezioni TW (R3 §4 voce 7)
- 8 nodi di §1.2 con lezione v4 completa; contenuti tecnici da MDN, react.dev, docs.python.org, flask.palletsprojects.com, git-scm.com (URL verificati 200).
- `servizi-restful-flask` = esercizio guidato «crea e consuma» (rotte GET/POST/PUT/PATCH/DELETE con `jsonify`, codici 200/201/204/400/404, client `fetch`), coerente con lo scenario fil rouge esistente.
- `sensori-mobile-web`: solo API standard documentate su MDN (es. Geolocation, DeviceOrientation), con nota su permessi e contesto sicuro; il syllabus dice «accenno» → gruppo B.
- Test `tests/test_lezioni_r2.py`: 13 campi, mermaid valido, accenti, nessun punteggio inventato, risorse con host ammessi, prerequisiti esistenti e aciclici.

### X3 — Modulo IA (R3 §3.3, §4 voce 9; Q6)
- 8 nodi di §1.2 in `area-7.json` con lezioni v4: esempi numpy eseguibili (vettori, prodotto scalare, broadcasting, media/varianza), classificatore lineare e perceptron/regressione logistica come esempi standard, Bayes (teorema e naive Bayes), k-means, regressione lineare (minimi quadrati, MSE), PCA; overfitting, train/test split, metriche base (accuratezza, matrice di confusione).
- `ia-esame-quiz-lab-lode`: solo ciò che dice [F1] (quiz chiusi in trentesimi, laboratorio ON/OFF, media ponderata arrotondata per eccesso, lode = 30 in entrambi + lode in uno). Niente numero di domande, durata o punteggi non presenti.
- Ogni lezione IA ≥ 6 flashcard e ≥ 4 domande di richiamo a risposta chiusa (alimentano il ripasso). Test `tests/test_area7_ia.py` (come X2 + ogni snippet Python di `worked_example` eseguibile con numpy in un test).

### X4 — Revisione lezioni esistenti (R2 §3.2 e §4; R3 §2.4)
- Correzioni P0 di R2: `web-semantico-rdf-owl` (blank node), `dom-virtual-dom` (due `li` iniziali → 3, contatore 3), `uri-url-urn-differenze` (riferimento relativo vs URN), `css-box-model` (margini negativi 20/−8 → 12, tutti negativi), `codice-404-not-found` (newline reali), `html-form-accessibilita` (checkbox non inviata).
- P1 di R2: Merge Patch in `rest-metodi-http`, `@layer` in `css-origini-ereditarieta`, binding/OPTIONAL in `sparql-query-esempi`, richiesta browser→Flask→SQLite in `architettura-3-tier`, attribuzione Web 3.0 in `web-1-0-2-0-3-0-4-0`.
- Allineamento a §1.1: `perche_ti_serve` e testi che citano gruppi/priorità coerenti col programma [F1]; lezioni tesina: tecnologie a libera scelta, ~3 settimane, PowerPoint max 8 minuti, discussione codice; «4 slide» e «2 ore» solo come ipotesi; `eventi-locali-vs-remoti` rimanda a `sviluppo-event-driven` solo nel testo.
- Test `tests/test_lezioni_correzioni.py` con un'asserzione per ogni correzione (es. il JS del worked example DOM eseguito in Node dà 3).

### X5 — Web app (R1 P1, P2, P4, P5, P8, P10, P11, P12; R2 P1 ripasso)
In ordine: (1) supporto area 7 (7º colore in `AREA_COLORS`, etichetta «serve per la lode»), intestazione docente da `meta.corso.docente`; (2) etichette del grafo leggibili su desktop all'apertura + vista elenco anche su desktop + navigazione da tastiera (P8, P10); (3) livelli di padronanza `web/js/core/mastery.js` (P1) che legge gli esiti del simulatore (contratto §3.2) e lo stato SM-2; (4) «Sessione di oggi» con data d'esame (P2) e interleaving in `ripasso/mazzo.js`, retro specifici per le checklist (R2); (5) stati «in corso / so già» (P11); (6) igiene ripasso: tetto carte nuove, previsione 7 giorni, carte sanguisuga (P12); (7) backup/import JSON + export Anki TSV (P5); (8) PWA: manifest + service worker + dipendenze CDN vendorizzate (P4). Test node per ogni modulo nuovo + e2e Playwright.

### X6 — Banca quiz e simulatore (R2 P0/P1 simulatore; R3 §3.5.2 Q1–Q6; R1 P3)
- Fase a (subito): adattatore della banca reale `elementi` in `web/modules/simulatore/genera.js` (scelta multipla + abbinamento interattivi, `nodo_id`, spiegazioni); opzioni rimescolate con seed (corretta per id, non per posizione); modalità **allenamento** (feedback immediato spiegato) e **simulazione** (correzione a consegna, nessun voto ufficiale, durata configurabile marcata «ipotesi», «senza appunti»); blueprint stratificato per area; report per area con «Riapri questi nodi»; esiti salvati secondo §3.2. Nuovi tipi in `quiz.schema.json` (§3.1). Riscrittura banca sui temi ufficiali [F1] con Q1–Q5 di R3 (originali, marcati come non tratti da prove reali), distrattori `plausibile` e `fuori_contesto`; risposte corrette non sempre nella stessa posizione; ≥ 40 elementi su aree 1–6 riferiti a nodi già su main.
- Fase b (messaggio successivo, dopo il merge di X2 e X3): elementi per gli 8 nodi nuovi TW e per l'area 7 (quiz chiusi IA, Q6), copertura aree 1–7 in `tests/test_quiz.py`.

## 3. Contratti tra moduli

### 3.1 Banca quiz (`graph/quiz.json`, proprietario X6)
- Radice invariata `{versione, descrizione, elementi}`; `versione` può passare a 2 solo se X6 aggiorna schema, test e adattatore insieme.
- Tipi: `scelta_multipla`, `abbinamento` (esistenti), nuovi `vero_falso` (`affermazione`, `risposta_corretta: boolean`, `spiegazione`, `nodo_id`) e `completamento_codice` (`linguaggio`, `codice_con_buchi` con segnaposto `___1___`…, `soluzioni: {"1": [varianti accettate]}`, `spiegazione`, `nodo_id`). `area` 1–7. Ogni elemento ha `nodo_id` esistente nel grafo.
- Il simulatore (X6) è l'unico consumatore della struttura interna; il resto della web app legge solo gli esiti (§3.2).

### 3.2 Esiti dei quiz (scritti da X6, letti da X5)
- Chiave `localStorage`: `ids-kg:esiti-quiz:v1` (il prefisso `ids-kg:` è storico: non rinominarlo per non perdere i progressi).
- Valore: array JSON di `{ "item_id": string, "nodo_id": string, "corretto": boolean, "modalita": "allenamento"|"simulazione", "ts": ISO-8601 }`, al massimo 2000 voci (le più vecchie vengono scartate).
- X6 esporta da `web/modules/simulatore/esiti.js` le funzioni `registraEsito(storage, esito)` e `leggiEsiti(storage)`; X5 può importare **solo** `leggiEsiti` (unica dipendenza X5→X6). Fino al merge di X6, X5 la sostituisce nei test con un doppio che rispetta lo stesso formato.

### 3.3 Grafo e lezioni
- `graph/graph.json` resta la fonte unica, generata da `scripts/kg.py build` da `meta.json` + `parts/*.json` + `lezioni/*.json`. Schema nodo e lezione: `docs/CONTRACTS.md` (X1 aggiorna solo la documentazione: i campi non cambiano in questo round).
- La web app non deve dipendere dal numero di aree o di nodi (niente costanti 6 o 40).

## 4. Regole di qualità (tutti)
SOLID, moduli piccoli e coesi, basso accoppiamento, interfacce esplicite, aperto/chiuso, test per ogni modulo, nomi coerenti, nessun codice morto. Italiano con accenti corretti (è, perché, più, già, può, così). **Mai inventare** fatti attribuiti ai docenti, numeri, punteggi, durate o URL: ogni risorsa aperta e verificata (HTTP 200, `python scripts/check_urls.py`); nessun punteggio non presente nelle fonti di R3. Prima del push: `python scripts/kg.py check`, `npm test --prefix web`, `pytest -q` con Playwright installato (**0 failed, 0 skipped**, come la CI). CI del ramo verde. Report finale: SHA, URL del ramo, numero di test passati.

## 5. Ordine di merge e integrazione (coordinatore)

Ondata 1 in parallelo: X1, X2, X3, X4, X5, X6-fase-a. Merge su `main` nell'ordine:

1. **X1** (contratti, priorità, documenti)
2. **X4** (testi delle lezioni esistenti, coerenti con X1)
3. **X2** (nuovi nodi TW)
4. **X3** (area 7 IA)
5. **X6 fase a** (banca + simulatore)
6. **X5** (web app; usa `leggiEsiti` di X6)
7. **X6 fase b** (quiz su nodi nuovi e area 7; stesso ramo o nuova chat se la vecchia ha ~10 messaggi)
8. **Integrazione I** (coordinatore sulla box o chat MAIN nuova): I-1 dopo ogni merge `python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh`, conflitti sui file generati risolti rigenerando; I-2 archi da nodi esistenti verso nuovi: `flask-rotte-jsonify` hard `python-base-web`; `tesina-progetto-flask-crud` soft `servizi-restful-flask`, `git-workflow-collaborativo`; `ia-python-numpy-lab` soft `python-base-web`; `eventi-locali-vs-remoti` resta prerequisito soft di `sviluppo-event-driven`; I-3 aggiornare `docs/NODES.md` (nodi «in arrivo» → presenti) e la tabella dei tempi; I-4 suite completa (pytest + node --test + Playwright, 0 skipped), CI Pages verde, QA da utente sul sito pubblicato.

Dopo ogni merge: CI verde su `main` prima del merge successivo. Rotazione di una chat a ~10 messaggi o se ripete errori.

## 6. Modifiche abilitanti già fatte nel commit di questo piano (ondata 0, coordinatore)
- `schema/node.schema.json`: `area` 1–7; `worker` ammette anche X1–X6; `riferimenti_testo.libro` ammette `PYTHON`, `NUMPY`, `SKLEARN`, `REACT`.
- `graph/meta.json`: area 7 «Modulo IA (apprendimento automatico, per la lode)» e i 4 testi sopra.
- `tests/test_graph.py`: aree dichiarate = 1–7; i nodi usano solo aree dichiarate; nomi part `area-N.json` o `area-N-<suffisso>.json`.
- `tests/test_lezioni_area3.py`: area 3 con almeno 11 nodi (X2 ne aggiunge).
- File generati rigenerati. Suite locale: 168 passed, 0 skipped.
