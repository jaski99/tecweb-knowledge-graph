# Contratti del knowledge graph — Tecnologie Web

**Fonte unica di verità: `graph/graph.json`** (schema v4), **generato** da `graph/meta.json` + `graph/parts/area-N.json` + `graph/lezioni/<id>.json` con `python scripts/kg.py build`. Niente note Markdown. Gli archi NON sono memorizzati: si derivano da `prerequisiti` (arco `prerequisito.id → nodo`, sia hard sia soft).

## graph.json (radice)
```json
{ "versione": 4, "corso": {...}, "aree": [{"id":1,"titolo":"..."}, ... 6 aree],
  "testi": {"MDN": "...", ...}, "nota_esame": "...",
  "nodi": [ <nodo>, ... ordinati per (area, id) ] }
```

## Nodo — `schema/node.schema.json` (JSON Schema 2020-12, `additionalProperties: false`)

| campo | tipo | regole |
|---|---|---|
| `id` | string | kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$`, ≤64, unico, mai rinominato dopo il merge |
| `title` | string | italiano |
| `area` | int 1..6 | vedi aree (1=Fondamenti rete e HTTP, 2=Architetture, 3=Front-end, 4=Back-end e strumenti, 5=Web semantico, 6=Tesina) |
| `tipo` | `concetto` \| `abilita` \| `tipo_esercizio` | concetto = sapere; abilita = procedura; tipo_esercizio = famiglia di esercizi d'esame |
| `gruppo` | `A` \| `B` \| `C` | Classificazione dal materiale utente: A=iper-riciclati (~65%), B=varianti (~20%), C=punti ciechi (~15%) |
| `worker` | `W1` \| `W2` \| `W3` \| `W4` \| `W5` | Worker assegnato per la FASE 2: W1=area1-2, W2=area3, W3=area4-5, W4=area6-quiz, W5=webapp |
| `sapere` | string | 1-4 frasi, cosa si deve conoscere |
| `saper_fare` | string[] ≥1 | criteri osservabili (verbo d'azione), ~2-4 |
| `prerequisiti` | [{id, forza: hard\|soft, motivo}] | id esistenti, niente self-loop; **nessun ciclo considerando archi hard+soft**. hard = indispensabile; soft = utile |
| `esercizi` | [{tipo_esame, testo, soluzione}] | mini-esempi **svolti**: `tipo_esame` es. "scritto: domanda HTTP"; `soluzione` breve, passo-passo. **minItems 1** se `tipo` è `abilita` o `tipo_esercizio` |
| `checklist_ripasso` | string[] (opzionale) | punti flash per il ripasso finale |
| `tempo_studio_min` | int 5..600 | stima in minuti |
| `priorita` | {livello: alta\|media\|bassa, motivazione} | motivazione legata a programma + testi + gruppo A/B/C; **formato d'esame IPOTIZZATO** (vedi `nota_esame` in meta.json) |
| `risorse` | [{titolo, url, verificato: true}] ≥1 | solo URL reali controllati con `scripts/check_urls.py` (HTTP 200) |
| `lezione` | oggetto (opzionale nello schema, **obbligatorio per completezza**) | vedi sotto; sta in `graph/lezioni/<id>.json`, **mai inline nel part** |
| `riferimenti_testo` | [{libro, capitolo_o_sezione?}] | `libro` = chiave in `testi` (MDN, RFC, W3C, FLASK, GIT, ECMA, SQLite); capitolo SOLO se verificato su indice reale |

## Lezione (v4) — struttura in 10 punti secondo DIDATTICA.md

**Obiettivo**: massima ritenzione dopo una sola lettura attenta, con consolidamento tramite ripasso. Basato su evidenza scientifica (Dunlosky 2013, Sweller Cognitive Load Theory, Mayer Multimedia Learning, Bjork desirable difficulties, Roediger-Karpicke testing effect, Ebbinghaus/SM-2).

| # | campo | tipo | regole | obbligatorio |
|---|---|---|---|---|
| 1 | `perche_ti_serve` | string | 20-200 caratteri: dove esce all'esame, gruppo A/B/C, quanti punti vale | ✅ |
| 2 | `scenario_fil_rouge` | string | ≥50 caratteri: storia/scenario concreto (es. carrello e-commerce, biblioteca) riusato in tutto il corso | ✅ |
| 3 | `definizione_esame` | object | Regola dei 3 punti: `definizione` (≥10 car., da memorizzare), `scopo_vantaggio` (≥10 car.), `esempio` (≥10 car.) | ✅ |
| 4 | `spiegazione` | string | ≥1500 caratteri, a piccoli blocchi (un'idea per blocco, frasi brevi), `##`/`###`, ≥1 blocco ```java o ```mermaid; mermaid valido | ✅ |
| 5 | `analogia` | object | `testo` (≥40 car.: immagine quotidiana), `limite` (≥10 car.: dove smette di funzionare) | ✅ |
| 6a | `worked_example` | object | Esempio svolto: `titolo` (≥3), `problema` (≥20), `passi` (≥2, ogni passo ≥5), `soluzione` (≥10), `perche_funziona` (≥20) | ✅ |
| 6b | `completion_problem` | object | Passi mancanti: `titolo` (≥3), `testo` (≥20), `passi_mancanti` (≥1, ogni passo ≥5), `soluzione` (≥10) | ✅ |
| 6c | `esercizio_autonomo` | object | Esercizio autonomo: `titolo` (≥3), `testo` (≥20), `suggerimento` (≥10), `soluzione_attesa` (≥10) | ✅ |
| 7 | `errori_trappole` | array | ≥2 errori: ogni errore ha `errore` (≥10), `perche_sbagliato` (≥10), `distrattore` (≥5, fuori contesto) | ✅ |
| 8 | `mnemonica` | string | 10-500 caratteri: acronimi, loci, storiella (opzionale) | ❌ |
| 9 | `richiamo_attivo` | object | `domande` (3-5, ogni domanda/risposta ≥10), `spiega_con_parole_tue` (≥20), `collegamenti_interleaving` (≥1, ogni collegamento ≥20 con nodo esistente) | ✅ |
| 10a | `riepilogo` | string | 40-800 caratteri, ≤5 righe | ✅ |
| 10b | `flashcard` | object | `fronte` (≥5), `retro` (≥5) per ripasso SM-2 | ✅ |
| 10c | `checklist` | object | `so_fare` (≥1, ogni elemento ≥3), `so_dire` (≥1, ogni elemento ≥3) | ✅ |

**Regole trasversali**:
- Carico cognitivo basso: prima l'intuizione, poi i dettagli
- Prerequisiti richiamati in 1 riga all'inizio
- Terminologia coerente col gruppo A/B/C
- Niente contenuti inventati: solo ciò che risulta da programma, prove d'esame reali o `nota_esame`
- Risorse verificate (URL HTTP 200 via `scripts/check_urls.py`)
- Autosufficiente: niente rimandi al libro per capire ("vedi capitolo…" vietati)
- JavaScript/HTML/CSS moderno e verificabile negli esempi
- Esempi svolti con passi numerati e risultato verificabile
- Fading graduale: worked example → completion problem → esercizio autonomo

## Regole di qualità (testate dove possibile in `tests/test_lezioni.py`)

- **Autosufficiente**: niente rimandi al libro per capire ("vedi capitolo…", "consulta il testo…" sono vietati). I libri/risorse servono solo come approfondimento facoltativo (`risorse`, `riferimenti_testo`).
- **Mai inventare** fatti attribuiti al docente (cosa chiede, come valuta, preferenze): solo ciò che risulta da programma, prove d'esame reali o `nota_esame`; altrimenti dirlo esplicitamente come **ipotesi**.
- JavaScript/HTML/CSS moderno e verificabile negli esempi; esempi svolti con passi numerati e risultato verificabile.
- Completezza: `test_lezioni_complete` fallisce se un nodo non ha `lezione`; `KG_ALLOW_TODO=1` lo salta durante la stesura.

## Aree (6 aree per Tecnologie Web UNIMORE)

1. **Fondamenti rete e HTTP** — TCP/IP, HTTP 1/1.1/2/3, QUIC, multiplexing, stateless/stateful, cookie e sessioni, URI/URL/URN
2. **Architetture** — 3-tier orizzontale/verticale, REST (PATCH vs PUT, codici 404), API design, rate limiting, sicurezza
3. **Front-end** — HTML5/form, CSS (origini/box model/ereditarietà), DOM e Virtual DOM, DHTML, canvas, span, JS moderno (fetch/async-await), motore JS (parser/AST/profiler/JIT), eventi locali vs remoti
4. **Back-end e strumenti** — Flask (rotte/jsonify), SQLite/JSON, Git (branch/merge/pull request)
5. **Web semantico ed evoluzione** — RDF, OWL, SPARQL, Web 1.0-4.0, AJAX
6. **Tesina** — Progetto Flask + front-end CRUD, presentazione 8 minuti con 4 slide, domande revisione codice, esercitazione guidata

**Nodo "Modulo IA"**: SOLO se il corso lo prevede (verificare in SYLLABUS.md). Altrimenti **non includere** e segnalarlo come ipotesi.

## Mappa aree → testi

| area | testi | fonti |
|---|---|---|
| 1 | MDN, RFC, W3C | HTTP, URI, TCP/IP, cookie |
| 2 | MDN, RFC, W3C | REST, API, architetture |
| 3 | MDN, W3C, ECMA | HTML, CSS, JavaScript, DOM |
| 4 | FLASK, GIT, SQLite | Flask, Git, database |
| 5 | W3C, MDN, RFC | RDF, OWL, SPARQL, AJAX |
| 6 | FLASK, MDN | Progetto pratico, presentazione |

**N.B.**: I "testi" sono fonti autorevoli online (MDN, RFC, W3C, ecc.), non libri cartacei. Tutti i riferimenti sono URL verificati (HTTP 200).

## Worker Fase 2 (da ARENA_PLAN.md)

| id | ramo | scope esclusivo |
|----|------|-----------------|
| W1 | feat/contenuti-1-2 | graph/parts/area-1.json, area-2.json (+ lezioni) |
| W2 | feat/contenuti-3 | graph/parts/area-3.json |
| W3 | feat/contenuti-4-5 | graph/parts/area-4.json, area-5.json |
| W4 | feat/contenuti-6-quiz | graph/parts/area-6.json, banca quiz/abbinamenti (con distrattori fuori contesto) e flashcard in graph/ |
| W5 | feat/webapp | web/ (grafo, percorso, progresso, filtri, ricerca, tema, lettore lezioni, simulatore esame 2h, ripasso SM-2), testi UI italiani |

## Convenzioni

- **id**: `kebab-case` italiano, senza prefisso area (l'area è un campo). Pattern: `http-stateless-vs-stateful`, `rest-patch-vs-put`, `html-form-accessibilita`, `flask-rotte-jsonify`, `web-semantico-rdf`, `tesina-progetto-flask-crud`
- **Lingua contenuti**: italiano; termini tecnici inglesi ammessi (HTTP, REST, DOM, CSS, ecc.)
- **Gruppo**: A, B, o C in base a MATERIALE_UTENTE.md
- **Prerequisiti cross-area**: ammessi (es. area 4 → area 3 per Flask che usa HTML/JS), ma solo verso id già presenti su `main` o nello stesso ramo

## Regole per i rami contenuti

- Ogni ramo contenuti scrive **SOLO** in `graph/parts/area-N.json` delle proprie aree
- Rami lezioni (`feat/lezioni-*`): creano **solo** `graph/lezioni/<id>.json` dei propri id
- Ogni file part è un **array JSON di nodi**; ogni nodo ha `area == N` del file
- Vietato modificare a mano `graph/graph.json`, `graph/meta.json`, `schema/` o i part di altre aree: modifiche a contratti/meta solo su `main`
- Prima di ogni commit: `python scripts/kg.py build` (rigenera `graph.json`) e `pytest -q` (verde)
- `python scripts/kg.py check` fallisce se `graph.json` non è aggiornato
- Prerequisiti verso altre aree: solo id già presenti su `main`
- In caso di conflitto su `graph.json` al merge: prendere qualsiasi versione e rieseguire `kg.py build`

## Regole/validazione

- `pytest` (offline): schema valido, ogni nodo conforme, **6 aree dichiarate**, id unici, prerequisiti esistenti, niente self-loop, **niente cicli (hard+soft)**, ordine topologico generabile e coerente, ≥1 risorsa per nodo, `riferimenti_testo.libro` dichiarato in `testi`, abilità/tipo_esercizio con ≥1 esercizio svolto, part nominati `area-N.json` con area coerente, `graph.json` uguale all'output di `kg.py build`
- `python scripts/check_urls.py` (online, fuori dai test): HEAD→GET, exit 1 su 4xx/5xx/errori
- `python scripts/topo.py`: ordine di studio (Kahn deterministico per area, id) con tempo totale

## Esempio di nodo (minimo)

```json
{
  "id": "http-stateless-vs-stateful",
  "title": "HTTP: Stateless vs Stateful",
  "area": 1,
  "gruppo": "A",
  "tipo": "concetto",
  "sapere": "HTTP è stateless per design: ogni richiesta è indipendente. Lo stato (sessioni) viene gestito tramite cookie, token JWT, o parametri URL.",
  "saper_fare": [
    "Spiegare perché HTTP è stateless",
    "Elencare i meccanismi per gestire lo stato in HTTP",
    "Distinguere autenticazione da autorizzazione"
  ],
  "prerequisiti": [],
  "esercizi": [
    {
      "tipo_esame": "scritto: domanda teorica",
      "testo": "Perché HTTP è definito stateless? Come si gestisce lo stato?",
      "soluzione": "HTTP è stateless perché il server non mantiene informazioni tra richieste. Lo stato si gestisce con: 1) Cookie (lato client, RFC 6265), 2) Token (JWT, Bearer), 3) Parametri URL, 4) Sessioni server-side (con session ID nei cookie)."
    }
  ],
  "tempo_studio_min": 45,
  "priorita": {
    "livello": "alta",
    "motivazione": "Gruppo A (materiale utente, ~65% dello scritto). Argomento fondamentale per comprendere HTTP."
  },
  "risorse": [
    {
      "titolo": "MDN: HTTP - Stateless",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#http_is_stateless_but_not_sessionless",
      "verificato": true
    },
    {
      "titolo": "RFC 9110 - HTTP/1.1 Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "verificato": true
    }
  ],
  "riferimenti_testo": [
    {"libro": "MDN"},
    {"libro": "RFC"}
  ],
  "checklist_ripasso": [
    "HTTP stateless per design",
    "Meccanismi di stato: cookie, token, sessioni",
    "Cookie: Set-Cookie (server→client), Cookie (client→server)"
  ],
  "worker": "W1"
}
```

## Esempio di lezione (v4, in graph/lezioni/http-stateless-vs-stateful.json)

```json
{
  "perche_ti_serve": "Argomento FONDAMENTALE che esce in TUTTE le prove scritte (Gruppo A, ~65%). Vale 3-4 punti: se non lo sai, non passi l'esame. Esce anche nelle domande orali di tesina.",
  "scenario_fil_rouge": "Immagina un e-commerce come Amazon. Quando aggiungi un prodotto al carrello, poi passi alla cassa, poi torni indietro e aggiungi un altro prodotto, il carrello si ricorda di tutti i prodotti. Ma HTTP di base non ha memoria: è come se ogni volta che parli con il commesso, lui non si ricordasse di te. Come fa Amazon a ricordarsi del tuo carrello?",
  "definizione_esame": {
    "definizione": "HTTP è un protocollo stateless: il server non mantiene alcuna informazione sullo stato del client tra richieste consecutive.",
    "scopo_vantaggio": "Permette scalabilità massima: i server possono gestire milioni di client senza mantenere connessioni aperte, riducendo complessità e costo infrastrutturale.",
    "esempio": "Quando fai login su un sito, il server ti riconosce non perché si ricorda di te (stateless), ma perché tu gli mandi un 'biglietto' (cookie o token) con ogni richiesta che certificano la tua identità."
  },
  "spiegazione": "## HTTP Stateless: il principio che ha rivoluzionato il Web\n\nHTTP (Hypertext Transfer Protocol) è progettato per essere **stateless** (senza stato). Questo significa che:\n\n### I 3 pilastri dello stateless\n\n1. Ogni richiesta è indipendente\n2. Nessuna memoria server-side\n3. Tutte le informazioni viaggiano con la richiesta\n\n### Perché stateless?\n\n- Scalabilità: i server possono gestire un numero molto maggiore di client\n- Semplificazione: protocollo più semplice da implementare\n- Affidabilità: in caso di crash del server, non si perde lo stato delle sessioni\n\n```mermaid\ngraph TD\n    A[Client] -->|Richiesta 1| B[Server]\n    A -->|Richiesta 2| B\n    B -->|Risposta 1| A\n    B -->|Risposta 2| A\n```\n\n### Meccanismi per gestire lo stato\n\n#### 1. Cookie (RFC 6265)\nI cookie sono piccoli frammenti di dati che il server invia al client tramite header Set-Cookie.\n\n#### 2. Token JWT\nI token sono stringhe crittografate che contengono claims e sono firmate digitalmente.\n\n#### 3. Parametri URL\nLo stato viene passato esplicitamente nell'URL tramite query string.\n\n#### 4. Sessioni server-side\nIl client invia un session ID, e il server mantiene lo stato in memoria o in un database.",
  "analogia": {
    "testo": "HTTP stateless è come un ristorante self-service: ogni volta che vuoi qualcosa, devi prendere un nuovo vassoio e riempirlo. Il cuoco non si ricorda di te dalla volta precedente.",
    "limite": "Nel web, i token JWT possono contenere informazioni crittografate che il server può verificare senza dover mantenere una lista di client."
  },
  "worked_example": {
    "titolo": "Autenticazione completa con cookie in Flask",
    "problema": "Implementare un sistema di autenticazione dove l'utente fa login e il server ricorda l'utente tramite cookie in tutte le pagine successive.",
    "passi": [
      "Creare endpoint /login che accetta POST con username e password",
      "Validare le credenziali",
      "Generare un session ID univoco",
      "Salvare i dati della sessione lato server",
      "Impostare cookie con Set-Cookie header",
      "Creare endpoint /profile che richiede autenticazione"
    ],
    "soluzione": "from flask import Flask, request, make_response, jsonify\nimport secrets\nsessions = {}\n@app.route('/login', methods=['POST'])\ndef login():\n    session_id = secrets.token_hex(16)\n    sessions[session_id] = {'username': 'alice', 'logged_in': True}\n    response = make_response(jsonify({'message': 'Login successful'}))\n    response.set_cookie('session_id', session_id, httponly=True, secure=True)\n    return response",
    "perche_funziona": "Il browser salva automaticamente il cookie session_id e lo invia in ogni richiesta successiva allo stesso dominio."
  },
  "completion_problem": {
    "titolo": "Completare l'autenticazione con JWT",
    "testo": "Il codice seguente implementa l'autenticazione con JWT, ma mancano 3 passi fondamentali.",
    "passi_mancanti": [
      "Verificare che il token JWT sia valido e non scaduto",
      "Estrare il payload dal token",
      "Gestire il caso in cui il token è scaduto o non valido"
    ],
    "soluzione": "import jwt\ntry:\n    data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])\n    current_user = data['username']\nexcept jwt.ExpiredSignatureError:\n    return jsonify({'error': 'Token expired'}), 401"
  },
  "esercizio_autonomo": {
    "titolo": "Implementare gestione sessioni con Redis",
    "testo": "Modifica il sistema di autenticazione con cookie per usare Redis invece di un dizionario Python.",
    "suggerimento": "Usa la libreria redis-py. I comandi utili sono: redis.setex(key, 3600, value) per salvare con scadenza.",
    "soluzione_attesa": "import redis\nr = redis.Redis(host='localhost', port=6379)\n@app.route('/login', methods=['POST'])\ndef login():\n    session_id = secrets.token_hex(16)\n    r.setex(f'session:{session_id}', 3600, username)\n    response = make_response(jsonify({'message': 'Login successful'}))\n    response.set_cookie('session_id', session_id, httponly=True)\n    return response"
  },
  "errori_trappole": [
    {
      "errore": "Confondere stateless con sessionless",
      "perche_sbagliato": "HTTP è stateless (il protocollo non mantiene stato), ma le applicazioni web NON sono sessionless. Lo stateless si riferisce al protocollo, non all'applicazione.",
      "distrattore": "HTTP è sessionless perché non ha sessioni"
    },
    {
      "errore": "Pensare che i cookie siano sicuri di default",
      "perche_sbagliato": "I cookie senza HttpOnly possono essere rubati tramite XSS. Senza Secure, possono essere intercettati su connessioni non HTTPS.",
      "distrattore": "I cookie sono sempre sicuri"
    }
  ],
  "mnemonica": "State Less Every Second: HTTP è Stateless, Libero, Efficiente, Scalabile.",
  "richiamo_attivo": {
    "domande": [
      {
        "domanda": "Cosa significa che HTTP è stateless?",
        "risposta": "Significa che il protocollo HTTP non mantiene alcuna informazione sullo stato del client tra richieste consecutive."
      },
      {
        "domanda": "Quali sono i 4 meccanismi principali per gestire lo stato in HTTP?",
        "risposta": "1) Cookie, 2) Token JWT, 3) Parametri URL, 4) Sessioni server-side"
      },
      {
        "domanda": "Qual è il vantaggio principale di un protocollo stateless?",
        "risposta": "La scalabilità: i server non devono mantenere informazioni sullo stato dei client."
      }
    ],
    "spiega_con_parole_tue": "Prova a spiegare a un amico perché quando chiudi il browser e riapri Amazon, il tuo carrello c'è ancora.",
    "collegamenti_interleaving": [
      {
        "nodo": "http-protocollo-base",
        "collegamento": "HTTP stateless è una proprietà fondamentale del protocollo HTTP."
      },
      {
        "nodo": "architettura-client-server",
        "collegamento": "In un'architettura client-server, lo stateless permette ai server di gestire molti client senza mantenere connessioni aperte."
      }
    ]
  },
  "riepilogo": "HTTP è stateless per design: il server non si ricorda di te tra richieste. Lo stato si gestisce tramite cookie, token, parametri URL, o sessioni server-side.",
  "flashcard": {
    "fronte": "HTTP: stateless vs stateful - Qual è la differenza?",
    "retro": "HTTP è STATLESS: il protocollo non mantiene stato. Le applicazioni possono essere STATEFUL usando cookie, token, URL params, o sessioni per mantenere lo stato tra richieste."
  },
  "checklist": {
    "so_fare": [
      "Implementare autenticazione con cookie in Flask",
      "Creare e validare token JWT",
      "Configurare attributi di sicurezza dei cookie"
    ],
    "so_dire": [
      "Spiegare perché HTTP è stateless e quali vantaggi porta",
      "Elencare e confrontare i 4 meccanismi per gestire lo stato",
      "Spiegare la differenza tra stateless e sessionless"
    ]
  }
}
```

---

## Banca Quiz — Formato ufficiale

La banca quiz è **separata** da `graph/graph.json` e versionata in:
- **File dati**: `graph/quiz.json` (banca di quesiti)
- **Schema**: `graph/quiz.schema.json` (Draft 2020-12, JSON Schema)
- **Specifica**: `docs/QUIZ_FORMAT.md` (formato dettagliato)

### Struttura radice (`graph/quiz.json`)
```json
{
  "versione": 1,
  "descrizione": "Banca di ripasso per le sei aree del corso.",
  "elementi": [...]
}
```

### Tipi di quesito

#### 1. Scelta multipla
```json
{
  "id": "a2-put-patch",
  "tipo": "scelta_multipla",
  "area": 2,
  "titolo": "Sostituzione e modifica parziale",
  "domanda": "Quale metodo HTTP...?",
  "opzioni": [
    {"id": "a", "testo": "..."},
    {"id": "b", "testo": "..."}
  ],
  "risposta_corretta": "a",
  "spiegazione": "La risposta è corretta perché...",
  "nodo_id": "rest-metodi-http"
}
```
- `opzioni`: 3-6 scelte con ID distinti
- `risposta_corretta`: deve corrispondere a un ID in `opzioni`
- `spiegazione`: motivazione per la risposta corretta
- `nodo_id`: collegamento a nodo esistente in `graph/graph.json`

#### 2. Abbinamento
```json
{
  "id": "match-a2",
  "tipo": "abbinamento",
  "area": 2,
  "titolo": "Abbinamento: API e architetture",
  "istruzioni": "Abbina i termini alle descrizioni; scarta i distrattori.",
  "opzioni": [{"id": "a", "testo": "..."}],
  "distrattori": [
    {"testo": "...", "tipo": "plausibile"},
    {"testo": "...", "tipo": "fuori_contesto"}
  ],
  "abbinamenti": [
    {"elemento": "PUT", "risposta_id": "b", "spiegazione": "...", "nodo_id": "rest-metodi-http"}
  ]
}
```
- `distrattori.tipo`: `plausibile` (pertinente ma confondibile) o `fuori_contesto` (estraneo al tema)
- Ogni `abbinamento` ha `spiegazione` autonoma

### Regole di qualità
- Coprire **tutte le 6 aree** con almeno 1 scelta multipla e 1 abbinamento per area
- Ogni quesito deve dichiarare `area` (1-6) e `nodo_id` esistente
- ID univoci in kebab-case
- Validazione: `jsonschema.Draft202012Validator` + test in `tests/test_quiz.py`
- Test verificano: ID univoci, copertura aree, riferimenti a nodi esistenti, spiegazioni per ogni risposta

### Differenze da `graph/graph.json`
- **Separazione**: `quiz.json` non è parte di `graph.json` (può essere aggiornato indipendentemente)
- **Schema dedicato**: `quiz.schema.json` definisce il formato specifico per i quiz
- **Validazione**: I test Python verificano coerenza con il grafo (nodi esistenti, aree valide)
