# Contratti del knowledge graph — round 2

Il piano vincolante è [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md); programma e incertezze sono in [SYLLABUS.md](SYLLABUS.md). I dati leggibili dall'app hanno una sola fonte: **`graph/graph.json` generato**, non modificato a mano. Le sorgenti sono `graph/meta.json`, tutti i `graph/parts/area-*.json` e `graph/lezioni/<id>.json`.

```bash
python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh
python scripts/kg.py check
```

`graph.json` contiene i metadati, le aree e i nodi ordinati per `(area, id)`; il valore `versione` proviene da `meta.json` (attualmente 3), mentre lo **schema del nodo e della lezione è v4**. Gli archi non sono memorizzati separatamente: `prerequisito.id → nodo`, sia hard sia soft.

## File part e ID

- Ogni part è un array JSON di nodi con `area` uguale al numero del file. Sono ammessi `area-N.json` e `area-N-<suffisso>.json`, con `N` da 1 a 7; per i nuovi nodi TW usare il modello `area-N-r2.json`: `area-2-r2.json`, `area-3-r2.json` e `area-4-r2.json` per X2. X3 usa `area-7.json`.
- Gli ID sono univoci tra **tutti i part**, in kebab-case, al più 64 caratteri, e non cambiano dopo il merge. Le lezioni stanno in `graph/lezioni/<id>.json`, mai inline nei part.
- I prerequisiti devono esistere nel grafo complessivo e non introdurre cicli, anche combinando archi hard e soft. Per lavorare in parallelo, i prerequisiti verso altri worker puntano a ID già presenti su `main`; i nodi assegnati allo **stesso worker** possono dipendere tra loro come previsto dalla tabella 1.2 del piano (ad esempio `sensori-mobile-web` → `sviluppo-event-driven` e le dipendenze interne IA). L'integrazione aggiunge gli archi dai nodi esistenti verso i nuovi secondo §5 del piano.
- I nuovi ID, tipi, gruppi e prerequisiti sono definiti in [IMPROVEMENT_PLAN.md §1.2](IMPROVEMENT_PLAN.md#12-nuovi-nodi-contratto-id-area-gruppo-tipo-prerequisiti-gli-id-sono-definitivi); lo stato dei nodi è in [NODES.md](NODES.md).

## Nodo — `schema/node.schema.json`

JSON Schema Draft 2020-12, `additionalProperties: false`. I dettagli e i limiti formali risiedono nello schema; questa tabella ne riassume l'interfaccia.

| Campo | Tipo e vincoli | Significato |
|---|---|---|
| `id`, `title` | stringhe | ID stabile univoco e titolo italiano. |
| `area` | intero 1–7 | Area dichiarata nei metadati. |
| `gruppo` | `A` \| `B` \| `C` | Priorità di studio rispetto al programma [F1]: A = esplicito o indispensabile; B = contesto utile; C = opzionale/non elencato. Non sono frequenze d'esame. |
| `tipo` | `concetto` \| `abilita` \| `tipo_esercizio` | Conoscenza, procedura o famiglia di esercizi. |
| `worker` | `W1`–`W5`, `X1`–`X6` | Autore/worker di round 1 o 2; non comporta un cambio di ID. |
| `sapere`, `saper_fare` | stringa e array non vuoto | Conoscenze e criteri osservabili. |
| `prerequisiti` | array di `{id, forza, motivo}` | `forza` è `hard` o `soft`; ID esistenti, niente self-loop né cicli. |
| `esercizi` | array di `{tipo_esame, testo, soluzione}` | Esempi svolti; almeno uno per `abilita` e `tipo_esercizio`. Non spacciarli per prove reali. |
| `tempo_studio_min` | intero 5–600 | Stima di studio, non durata ufficiale dell'esame. |
| `priorita` | `{livello, motivazione}` | Livello `alta`, `media` o `bassa`, motivato dal programma e dalla funzione didattica, senza inventare punteggi o ricorrenze. |
| `risorse` | array non vuoto di `{titolo, url, verificato}` | URL pertinenti, aperti e verificati; `verificato` è `true`. Il controllo HTTP non sostituisce la lettura. |
| `riferimenti_testo` | array di `{libro, capitolo_o_sezione?}` | Chiave dichiarata nei metadati: `MDN`, `RFC`, `W3C`, `FLASK`, `GIT`, `ECMA`, `SQLITE`, `PYTHON`, `NUMPY`, `SKLEARN`, `REACT`; sezione solo se verificata. Sono approfondimenti, non testi ufficiali assegnati. |
| `checklist_ripasso` | array di stringhe, opzionale | Spunti per il ripasso. |
| `lezione` | oggetto, opzionale nello schema | Obbligatorio per la completezza; inserito dalla build dal file separato. |

## Lezione v4 — 13 campi obbligatori

Seguire [DIDATTICA.md](DIDATTICA.md), lo schema e i test: spiegazioni autosufficienti, scenario coerente, esempi verificabili, richiamo attivo e nessun fatto inventato. Non assegnare punti al singolo nodo se la fonte non li specifica.

| Campo | Contratto sintetico |
|---|---|
| `perche_ti_serve` | Stringa 20–200 caratteri: utilità e gruppo, senza punteggi non documentati. |
| `scenario_fil_rouge` | Stringa di almeno 50 caratteri, scenario concreto ricorrente. |
| `definizione_esame` | Oggetto con `definizione`, `scopo_vantaggio`, `esempio`. La regola dei tre elementi è un metodo didattico, non una griglia ufficiale. |
| `spiegazione` | Stringa di almeno 1500 caratteri, organizzata in blocchi; i test richiedono sottotitoli e almeno un blocco di codice o Mermaid valido. |
| `analogia` | Oggetto con `testo` e `limite`. |
| `worked_example` | Oggetto con `titolo`, `problema`, `passi`, `soluzione`, `perche_funziona`. |
| `completion_problem` | Oggetto con `titolo`, `testo`, `passi_mancanti`, `soluzione`. |
| `esercizio_autonomo` | Oggetto con `titolo`, `testo`, `suggerimento`, `soluzione_attesa`. |
| `errori_trappole` | Almeno due oggetti `{errore, perche_sbagliato, distrattore}`; sono esempi didattici, non preferenze attribuite alla docente. |
| `richiamo_attivo` | Oggetto con 3–5 `domande` domanda/risposta, `spiega_con_parole_tue` e almeno un `collegamenti_interleaving`. |
| `riepilogo` | Stringa 40–800 caratteri, al più cinque righe. |
| `flashcard` | **Un oggetto** `{fronte, retro}`, non un array. |
| `checklist` | Oggetto con array non vuoti `so_fare` e `so_dire`. |

`mnemonica` è facoltativa. Il ripasso può creare ulteriori carte dalle domande di richiamo e dalla checklist del nodo. **Limite da coordinare:** il piano richiede almeno sei flashcard per le lezioni IA, ma lo schema v4 ammette un solo oggetto `flashcard`; non cambiare il formato unilateralmente. Chiarire con il coordinatore se la richiesta si riferisce alle carte complessive di ripasso o richiede una modifica concordata del contratto.

## Aree e riferimenti

| Area | Ambito del grafo | Riferimenti tecnici di approfondimento |
|---|---|---|
| 1 | Fondamenti di rete e HTTP | MDN, RFC, W3C |
| 2 | Architetture e servizi REST | MDN, RFC, W3C |
| 3 | Front-end | MDN, W3C, ECMA, REACT |
| 4 | Back-end e strumenti | PYTHON, FLASK, GIT, SQLITE |
| 5 | Web semantico ed evoluzione; AJAX | W3C, MDN, RFC |
| 6 | Tesina e pratica | FLASK, MDN; tecnologie a libera scelta [F1] |
| 7 | Modulo IA ufficiale: apprendimento automatico | PYTHON, NUMPY, SKLEARN; lezioni in arrivo X3 |

La presenza di un argomento nel grafo non lo rende parte del programma ufficiale: ad esempio RDF/OWL/SPARQL e HTTP/3 sono approfondimenti non elencati in [F1]. La **RFC 9110 definisce la semantica HTTP**, la **RFC 9112 definisce HTTP/1.1**; non chiamare la 9110 una specifica esclusiva di HTTP/1.1.

### Esempio di login: schema non sicuro

```python
# SCHEMA NON SICURO, da NON usare come autenticazione:
sessione = {"utente": "alice"}  # non verifica alcuna credenziale
```

Attribuire un utente a una sessione senza verificare le credenziali non autentica nessuno. Un'implementazione reale richiede, tra l'altro, verifica sicura delle password, gestione e scadenza della sessione, HTTPS, cookie adeguatamente protetti e difese CSRF. HTTP stateless non impedisce di conservare lo stato applicativo sul server; un JWT firmato non è necessariamente cifrato.

## Banca quiz ed esiti

La banca è separata dal grafo: `graph/quiz.json`, `graph/quiz.schema.json`, specifica [QUIZ_FORMAT.md](QUIZ_FORMAT.md). Il formato attuale è `{versione, descrizione, elementi}`, con scelta multipla e abbinamento nelle aree 1–6. I quesiti sono esercizi originali, non prove ufficiali.

**Contratto previsto per X6**, non ancora implementato: nuovi tipi `vero_falso` e `completamento_codice`, copertura 1–7 e riferimenti a nodi esistenti, con schema, banca e adattatore aggiornati insieme. X6 scrive gli esiti in `localStorage` alla chiave storica `ids-kg:esiti-quiz:v1`: array di `{item_id, nodo_id, corretto, modalita, ts}`; modalità `allenamento` o `simulazione`, `ts` ISO-8601, massimo 2000 voci. X6 esporta `registraEsito(storage, esito)` e `leggiEsiti(storage)` da `web/modules/simulatore/esiti.js`; X5 importa solo `leggiEsiti`. Dettagli in [IMPROVEMENT_PLAN.md §3](IMPROVEMENT_PLAN.md#3-contratti-tra-moduli).

## Worker e integrazione

| Worker | Scope di riferimento |
|---|---|
| X1 | Programma, priorità dei nodi esistenti, contratti e relativi test. |
| X2 | Nuovi part e lezioni TW di §1.2, relativi test. |
| X3 | Part e lezioni IA di §1.2, relativi test. |
| X4 | Revisione delle 40 lezioni esistenti e relativi test. |
| X5 | Web app e workflow assegnati, escluso il simulatore di X6. |
| X6 | Banca quiz, schema, documentazione, simulatore e relativi test. |

I percorsi esclusivi esatti sono nel [piano, §2](IMPROVEMENT_PLAN.md#2-worker-scope-esclusivo-ramo). L'ordine è **X1 → X4 → X2 → X3 → X6 fase a → X5 → X6 fase b → integrazione**. Ognuno lavora solo sul proprio ramo di sessione; il coordinatore gestisce PR e merge. Il coordinatore rigenera `graph/graph.json`, `docs/PIANO_STUDIO.md` e `docs/CHECKLIST_RIPASSO.md` dopo i merge, anziché risolverli a mano.

## Validazione

- `python scripts/kg.py check`: il grafo deve coincidere con la build.
- `pytest -q`: schema, ID univoci nei part, aree dichiarate, prerequisiti esistenti e DAG hard+soft, risorse, lezioni, documenti e test e2e Playwright.
- `npm test --prefix web`: test dei moduli JavaScript.
- `python scripts/check_urls.py`: controllo online dei soli URL `risorse` del grafo generato, HEAD con fallback GET e redirect; considera valido qualsiasi codice inferiore a 400. Non controlla le fonti nei documenti né il contenuto: aprire ogni nuova risorsa, verificare HTTP 200 finale e pertinenza. Un errore di rete non dimostra che la pagina sia inesistente.
- `python scripts/topo.py`: ordine deterministico con priorità a parità di vincoli.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
