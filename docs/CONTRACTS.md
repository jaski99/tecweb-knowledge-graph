# Contratti del knowledge graph — Tecnologie Web

**Fonte unica di verità: `graph/graph.json`** (schema v3), **generato** da `graph/meta.json` + `graph/parts/area-N.json` + `graph/lezioni/<id>.json` con `python scripts/kg.py build`. Niente note Markdown. Gli archi NON sono memorizzati: si derivano da `prerequisiti` (arco `prerequisito.id → nodo`, sia hard sia soft).

## graph.json (radice)
```json
{ "versione": 3, "corso": {...}, "aree": [{"id":1,"titolo":"..."}, ... 6 aree],
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

## Lezione (v3) — il nodo deve bastare per imparare

| campo | regole |
|---|---|
| `intuizione` | 2-4 frasi: l'idea in parole semplici (≥80 caratteri) |
| `spiegazione` | markdown lungo e autosufficiente (≥1500 car.): `##`/`###`, ≥1 blocco ```java o ```mermaid; mermaid valido (niente etichette che iniziano con "1. ", niente `<` grezzi) |
| `analogia` | un'immagine della vita quotidiana, con il punto in cui l'analogia smette di valere |
| `collegamenti_prior` | ≥2 [{conoscenza, collegamento, nodo?}]: cosa sai già e come si aggancia; `nodo` = id esistente |
| `esempi_svolti` | [{titolo, problema, passi[≥2], soluzione, perche_funziona}]: **≥2** per abilita/tipo_esercizio, ≥1 per concetto |
| `errori_comuni` | ≥2 trappole concrete |
| `domande_autoverifica` | ≥3 [{domanda, risposta}], risposte complete |
| `riepilogo` | ≤5 righe |

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
  ]
}
```

## Esempio di lezione (v3, in graph/lezioni/http-stateless-vs-stateful.json)

```json
{
  "intuizione": "HTTP è come un sportello postale: ogni volta che fai una richiesta (consegna un pacco), il dipendente non si ricorda di te dalla volta precedente. Se vuoi che si ricordi (es. il tuo indirizzo), devi portarglielo scritto ogni volta (cookie) o mostrare un tesserino (token).",
  "spiegazione": "## HTTP Stateless: il principio fondamentale\n\nHTTP (Hypertext Transfer Protocol) è progettato per essere **stateless**, cioè senza memoria tra richieste consecutive. Questo significa che:\n\n1. Ogni richiesta HTTP è **indipendente** dalle altre\n2. Il server **non mantiene** informazioni sullo stato del client tra richieste\n3. Tutte le informazioni necessarie sono **contenute nella richiesta stessa**\n\n### Perché stateless?\n\n```mermaid\ngraph TD\n    A[Client] -->|Richiesta 1| B[Server]\n    A -->|Richiesta 2| B\n    B -->|Risposta 1| A\n    B -->|Risposta 2| A\n```\n\n- **Scalabilità**: i server possono gestire più client senza mantenere stato\n- **Semplificazione**: protocollo più semplice da implementare\n- **Affidabilità**: in caso di crash del server, non si perde lo stato\n\n### Come gestire lo stato?\n\n#### 1. Cookie (RFC 6265)\n```\nClient → Server: GET /carrello\nServer → Client: Set-Cookie: session_id=abc123; Path=/; HttpOnly\nClient → Server: GET /checkout (con Cookie: session_id=abc123)\n```\n\n#### 2. Token (JWT)\n```\nClient → Server: GET /api/data (con Authorization: Bearer eyJhbGc...)\n```\n\n#### 3. Parametri URL\n```\nGET /prodotto?id=123&session=abc123\n```\n\n#### 4. Sessioni server-side\n- Il client invia un session ID (via cookie o URL)\n- Il server mantiene lo stato in memoria/DB e lo associa al session ID\n",
  "analogia": "HTTP stateless è come un ristorante self-service: ogni volta che vuoi qualcosa, devi prendere un nuovo vassoio e riempirlo. Se vuoi che il ristorante si ricordi del tuo ordine precedente, devi portarti dietro lo scontrino (cookie) o avere un numero di tavolo (session ID). L'analogia smette di valere quando: nel web, lo stato può essere crittografato (JWT) e verificato senza bisogno di memoria server-side.",
  "collegamenti_prior": [
    {
      "conoscenza": "Protocollo HTTP",
      "collegamento": "HTTP è il protocollo base del web, e la sua natura stateless ne definisce il funzionamento.",
      "nodo": "http-protocollo-base"
    },
    {
      "conoscenza": "Client-server",
      "collegamento": "In un'architettura client-server, lo stateless riduce la complessità del server.",
      "nodo": "architettura-client-server"
    }
  ],
  "esempi_svolti": [
    {
      "titolo": "Autenticazione con cookie",
      "problema": "Un sito e-commerce vuole ricordare l'utente loggato tra le pagine.",
      "passi": [
        "1. Utente invia credenziali a /login",
        "2. Server verifica e genera session_id",
        "3. Server risponde con Set-Cookie: session_id=abc123",
        "4. Browser salva il cookie",
        "5. Browser invia automaticamente Cookie: session_id=abc123 in ogni richiesta successiva",
        "6. Server associa session_id all'utente loggato"
      ],
      "soluzione": "Il browser gestisce automaticamente i cookie. Il server può così identificare l'utente in ogni richiesta senza dover mantenere connessioni persistenti.",
      "perche_funziona": "I cookie sono salvati lato client e inviati automaticamente dal browser (se HttpOnly=false, accessibili anche a JavaScript)."
    }
  ],
  "errori_comuni": [
    "Confondere stateless con sessionless: HTTP è stateless ma NON sessionless (le sessioni esistono, solo non sono gestite dal protocollo).",
    "Pensare che i cookie siano sicuri: i cookie possono essere rubati (XSS, MITM) se non si usano HttpOnly e Secure flag."
  ],
  "domande_autoverifica": [
    {
      "domanda": "Cosa significa che HTTP è stateless?",
      "risposta": "Significa che il protocollo HTTP non mantiene alcuna informazione sullo stato del client tra richieste consecutive. Ogni richiesta è trattata come indipendente."
    },
    {
      "domanda": "Quali sono i 3 meccanismi principali per gestire lo stato in HTTP?",
      "risposta": "1) Cookie: dati salvati lato client e inviati automaticamente; 2) Token: stringhe crittografate (es. JWT) inviate nell'header Authorization; 3) Parametri URL: dati passati esplicitamente nell'URL."
    },
    {
      "domanda": "Qual è il vantaggio principale di un protocollo stateless?",
      "risposta": "La scalabilità: i server non devono mantenere informazioni sullo stato dei client, quindi possono gestire un numero molto maggiore di connessioni contemporanee."
    }
  ],
  "riepilogo": "HTTP è stateless per design. Lo stato si gestisce tramite cookie, token, o parametri URL. I cookie sono il meccanismo più comune per sessioni autenticate."
}
```
