# Banca quiz e simulatore — formato v2

## Scopo e provenienza

`graph/quiz.json` è indipendente dal grafo. Radice invariata:
`{ "versione": 2, "descrizione": "…", "elementi": […] }`.
Lo schema Draft 2020-12 conserva la validazione della banca storica v1 e
aggiunge i quattro tipi v2. L’adattatore legge **elementi**, senza scartarne
nessuno, e mantiene anche gli esercizi aperti del grafo.

La banca di **fase A** comprende 42 elementi nelle aree 1–6, tutti collegati
a nodi preesistenti. I temi seguono il programma TW 2026/27 **[F1]**:
URI/HTTP/HTTP2, multi-livello, REST, HTML5/CSS/JS/AJAX/JSON, Flask, Git e tesina.
L’area 5 usa AJAX (non aggiunge RDF/SPARQL non elencati in [F1]).
Area 7 e nuovi nodi sono riservati alla fase B, dopo il via libera del coordinatore.

**Tutti i quesiti sono originali, non tratti da prove reali, non predittivi
delle domande del docente.** `origine: "originale"` e `fonte` lo dichiarano
in ogni elemento. [F1] giustifica il perimetro del programma, non attribuisce
al docente queste formulazioni o le definizioni tecniche elaborate.
I codici [F1], [F4], [F5] rimandano al registro delle fonti in
[`research/R3-programma-esame.md`](research/R3-programma-esame.md), §§3.2, 3.5.2, 3.7.
Non vengono aggiunti URL esterni alla banca.

### Q1–Q5 da R3 §3.5.2

- **Q1** `q1-programma`: scelta multipla sull’elenco ufficiale, con distrattori
  da programmi diversi e fuori contesto.
- **Q2** `q2-tecnologia-ruolo`: React, Flask, Git, AJAX. Area principale 4;
  ogni coppia collega il nodo preesistente pertinente, anche di altra area.
  React rimanda temporaneamente a `dom-virtual-dom`; il nodo React dedicato
  sarà usato in fase B. Il ruolo frontend è elaborazione didattica.
- **Q3** `q3-rotta-json`: completamento di una rotta Flask GET con jsonify;
  confronto testuale, nessuna esecuzione di codice.
- **Q4** `q4-tesina`, `q4-appunti`, `q4-intermedie`: tre vero/falso con
  giustificazione. Il formato binario non introduce una terza opzione assurda;
  i distrattori fuori contesto sono negli altri tipi.
- **Q5** `q5-mashup-eventi`: adattamento a scelta multipla della proposta
  aperta, sui nodi esistenti. **[IPOTESI didattica]** esplicita: le definizioni
  di mashup/event-driven/sensori non sono citazioni delle slide del docente.

## Campi comuni e vincoli

`id` univoco kebab-case; `tipo`; `area` intero **1–7**; `titolo`;
`nodo_id` esistente; metadati facoltativi `origine` (solo `originale`) e `fonte`.
Nella banca attuale i metadati sono sempre presenti.
Il nodo principale appartiene all’area dichiarata. Le coppie di un abbinamento
possono collegare altre aree (Q2 è trasversale).
Campi sconosciuti sono rifiutati. I test semantici integrano JSON Schema:
identificatori univoci, collegamenti al grafo, correttezza dei riferimenti,
congruenza dei segnaposto e varietà della posizione della risposta corretta.

### Scelta multipla

`domanda`, `opzioni` (3–6 oggetti `{id, testo, spiegazione?, tipo?}`),
`risposta_corretta` (ID, **non indice**), `spiegazione`.
`tipo` di un’opzione errata può essere `plausibile` o `fuori_contesto`.
La banca corrente spiega **ogni opzione**. Per v1 il feedback usa come fallback
la spiegazione generale. Il seed rimescola la presentazione, senza cambiare ID
né l’associazione alla spiegazione.

### Abbinamento

`istruzioni`, `opzioni: [{id, testo}]`,
`abbinamenti: [{elemento, risposta_id, spiegazione, nodo_id}]`,
`distrattori: [{testo, tipo, spiegazione}]`.
Almeno due coppie e due distrattori, almeno uno per categoria.
L’adattatore aggiunge i distrattori alle **alternative realmente selezionabili**,
con ID sintetici `distrattore-N` (riservati; non usarli nelle opzioni della banca).
Ogni coppia ha un menu nativo con etichetta; non è richiesto drag-and-drop.
La risposta è un oggetto `{ "0": "id-opzione", "1": "id-opzione" }`.

### Vero/falso

`affermazione`, `risposta_corretta: boolean`, `spiegazione`, `nodo_id`.
Due radio button nativi. `false` è una risposta completa, non una risposta vuota.

### Completamento codice

`linguaggio`, `codice_con_buchi`, `soluzioni`, `spiegazione`, `nodo_id`.
Esempio: `"codice_con_buchi": "return ___1___(item)"`,
`"soluzioni": {"1": ["jsonify"]}`.
Segnaposto `___1___`, `___2___`, …; chiavi numeriche positive e varianti
non vuote. L’insieme delle chiavi deve coincidere con quello dei segnaposto.
Si ignorano solo spazi iniziali/finali; mai valutazione permissiva o `eval`.
Risposte come `{ "1": "jsonify" }`; il codice non viene eseguito.

## Modalità, blueprint e report

- **Allenamento**: senza limite di tempo. Feedback testuale immediato alla
  prima risposta completa (per i campi testuali, alla conferma nativa/change).
  Dopo il feedback il quesito è bloccato: non si registrano tentativi artificiali
  ripetuti né si usa la soluzione appena vista per falsare il report.
- **Simulazione**: senza appunti **[F1]**; niente soluzioni o link alle lezioni
  durante lo svolgimento. Correzione solo alla consegna o allo scadere.
  Timer persistente e pausa disponibili come facilitazione didattica.
  Durata configurabile: **120 minuti / 2 ore è un’ipotesi**, non durata ufficiale.
- **Blueprint didattico**: round-robin tra aree disponibili, senza costanti sul
  loro numero; prima i quiz della banca, poi gli esercizi aperti. Con almeno un
  posto per area tutte sono rappresentate, con scarto massimo di uno finché
  nessuna area è esaurita. Nessuna proporzione è attribuita all’esame reale.
- Seed, selezione, ordine delle opzioni, risposte e timer si salvano localmente.
- Report per area: corrette, correggibili, aperte da autovalutare e
  **«Riapri questi nodi»** con link mirati agli errori. Le risposte mancanti sono
  non corrette. Le aperte non sono corrette automaticamente né registrate
  come successi/fallimenti. Nessun voto ufficiale o soglia di promozione.

## Contratto degli esiti (piano §3.2)

`web/modules/simulatore/esiti.js` esporta:

- `leggiEsiti(storage)` → array validato, copia, al massimo 2000 voci;
- `registraEsito(storage, esito)` → booleano di successo.

Chiave **`ids-kg:esiti-quiz:v1`**. Ogni voce contiene solo
`{item_id, nodo_id, corretto: boolean, modalita: "allenamento"|"simulazione", ts: ISO-8601}`.
Le più vecchie vengono scartate in ordine di inserimento. Errori dello storage
non interrompono il quiz; JSON corrotto restituisce un array vuoto, record
incompleti sono ignorati. Un abbinamento scrive una voce per coppia sul nodo
pertinente, mantenendo `item_id` del quesito. Sessione e marcatore di registrazione
impediscono duplicazioni a consegna/ricaricamento ordinari (non è una transazione
atomica tra le due chiavi localStorage).

## Verifica

`python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh`,
`python scripts/kg.py check`, `npm test --prefix web`, `pytest -q`.
Test Python su banca vera, schema e invarianti; Node su adattatore, seed,
correzione, report, timer, sessione ed esiti; Playwright su desktop e mobile,
tastiera, modalità, persistenza e consegna.
