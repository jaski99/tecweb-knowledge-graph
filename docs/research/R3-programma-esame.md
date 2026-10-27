# R3 — Programma reale dell'esame «Tecnologie Web» (UNIMORE)

> Ricerca effettuata il **27/10/2026**. Questo è l'unico file prodotto dall'incarico: **non modifica `graph/`, né il codice, né gli altri documenti**.
> **Legenda**: **[FATTO]** = pagina aperta davvero e contenuto letto; **[IPOTESI]** = inferenza, proposta originale o affermazione presente solo in fonti interne non verificabili; **[NON TROVATO]** = ricerca effettuata senza risultato pubblico verificabile.
> **Metodo**: gli snippet dei motori di ricerca sono serviti solo a scoprire URL. Ogni URL citato nel registro §3.7 è stato aperto con `fetch_page` (o con API GitHub per l'elenco dei repository) seguendo i redirect; nessun URL è stato inventato. Le fonti interne sono citate con percorsi del repo, non con URL esterni.

---

## 1. Sintesi in 10 righe

1. **[FATTO]** Il programma ufficiale 2026/27 per il nostro contesto è il modulo **«Tecnologie Web» (6 CFU, 54 ore)** dentro l'insegnamento integrato **«[INF-37] Intelligenza Artificiale e Tecnologie Web» (12 CFU, 108 ore, 3° anno, ciclo annuale unico 16/09/2026–04/06/2027)** del **Corso di Laurea in Ingegneria Informatica (MO), DIEF, UNIMORE** [F1][F2][F3].
2. **[FATTO]** La pagina ufficiale del Course Catalogue nomina **CALDERARA SIMONE** come titolare e **PO LAURA** come docente; Moodle conferma **Laura PO** per il modulo Tecnologie Web e **Simone Calderara** per Intelligenza Artificiale [F1][F8][F14].
3. **[FATTO]** I contenuti ufficiali TW 2026/27 sono: cenni storici, **URI/HTTP/HTTP/2**, sistemi multi-livello, **architetture mashup**, **sviluppo event-driven**, **HTML5/CSS/JavaScript/AJAX/JSON/React**, accenno ai **sensori mobili**, **Python + Flask** per creare/fruire **servizi RESTful**, **Git con branching/merge/pull request** [F1][F8].
4. **[FATTO]** L'esame TW 2026/27 è **prova scritta 0–23 punti** (domande aperte e chiuse + esercizi per realizzare un'applicazione Web, **senza appunti**) **+ tesina individuale 0–10 punti** (circa 3 settimane, PowerPoint di **massimo 8 minuti**, discussione di scelte progettuali e codice); **non sono previste prove intermedie** [F1].
5. **[FATTO]** Esiste un **modulo IA ufficiale**, non opzionale e non sugli LLM: 6 CFU/54 ore di machine learning (apprendimento supervisionato, classificazione lineare, Bayes, clustering, regressione, riduzione di dimensionalità, laboratorio Python/numpy), con quiz chiusi e prova di laboratorio ON/OFF [F1].
6. **[FATTO]** La **lode dell'esame integrato** richiede **30 in entrambi i moduli** e lode in almeno uno: puntare a «30 e lode» solo sul modulo TW non basta [F1].
7. **[FATTO]** Il materiale d'esame ufficiale sono **slide e materiale caricati progressivamente su Moodle**, i tool analizzati e le esercitazioni; **nessun libro di testo è nominato**. Le slide sono «prevalentemente in lingua inglese» [F1].
8. **[FATTO]** `docs/MATERIALE_UTENTE.md` azzecca i numeri chiave (23 + 10, 8 minuti, Flask, Git, JS moderno, lode legata all'IA); `docs/SYLLABUS.md` invece prende come riferimento **«Programmazione per il web» (I215-020)**, che è un **altro corso** del CdL Informatica con **Django, orale e progetto al 70%** [F5].
9. **[FATTO]** Nei 40 nodi di `docs/NODES.md` mancano o sono sottopesati temi ora ufficiali: **React, mashup, event-driven, sensori mobili, Python di base, servizi RESTful con Flask, workflow Git collaborativo, modulo IA**; al contrario **RDF/OWL/SPARQL, HTTP/3/QUIC, canvas, DHTML, Web 1.0–4.0** hanno priorità A o B ma non risultano nel syllabus 2026/27 [F1].
10. **[NON TROVATO]** Non ho trovato **testi pubblici di prove passate UNIMORE**, slide pubbliche del corso 2026/27 della prof.ssa Po, durata ufficiale dello scritto («2 ore» è ipotesi), numero ufficiale di slide («4 slide» è ipotesi), video/YouTube o forum pubblici del corso, né una pagina che spieghi il raccordo tra il manifesto 2026/27 e l'insegnamento integrato INF-37 [F6][F7][F12][F13].

---

## 2. Tabelle di confronto

### 2.1 Confronto generale: programma reale vs tre fonti del repo

| Voce | **Programma ufficiale 2026/27** [F1][F2][F3][F7][F8][F14] | `docs/MATERIALE_UTENTE.md` | `docs/SYLLABUS.md` | `docs/NODES.md` (40 nodi) | Azione |
|---|---|---|---|---|---|
| Nome esatto | Modulo **«Tecnologie Web»** dentro **[INF-37] Intelligenza Artificiale e Tecnologie Web**; UNIFIND riporta anche **10071 — Tecnologie Web** come «corso ad esaurimento» | «Tecnologie Web», docente non nominata | Dice che il nome ufficiale sarebbe **«Programmazione per il web» (I215-020)** | «Tecnologie Web UNIMORE» | Correggere `SYLLABUS.md`: I215-020 è un altro CdL [F5]. Dichiarare la coorte di riferimento. |
| CdL / anno | **Ingegneria Informatica (MO)**, L-8 nel manifesto, **3° anno**, ciclo annuale unico; modulo TW **6 CFU / 54 ore**, integrato **12 CFU / 108 ore** | Non indicato | Ingegneria Informatica L-8, ma **6 CFU / 48 ore**, «terzo anno, secondo semestre (da confermare)» | Nessuna anagrafica, solo 40 nodi | Allineare CFU/ore/periodo a 6/54 (modulo) e 12/108 (integrato), ciclo annuale. |
| Docente | **PO LAURA** (docente TW), **CALDERARA SIMONE** (titolare integrato / IA) | «la docente», senza nome | «Nome del docente titolare NON trovato» | Non presente | Inserire i nomi solo con [F1][F8][F14]. |
| Modulo IA | **Sì, ufficiale**: 6 CFU/54 ore di ML + numpy, quiz + lab ON/OFF; incide su media e lode | Citato solo come «massimo anche nel modulo di IA» | «OPZIONALE / NON confermato», con **LLM, agenti, rischi codice generato** | Nessun nodo IA | Sostituire l'ipotesi LLM con il modulo ML ufficiale; aggiungere nodi/area IA. |
| Backend | **Python + Flask**, creazione/fruizione di interfacce e **servizi RESTful** | Flask (`@app.route`, `jsonify`, `request`) | Flask, ma presenta Django come «ufficiale» | `flask-rotte-jsonify`, `flask-request-response` in **gruppo C** | Promuovere Flask/REST ad **A**; rimuovere Django dal programma TW. |
| Frontend | **HTML5, CSS, JavaScript, AJAX, JSON, React**, sensori mobili | HTML/CSS/JS, `fetch`, `async/await`, DOM, Virtual DOM, canvas, span | HTML5/CSS/JS/AJAX/React + ARIA, Flexbox, Grid, Canvas, DHTML, motore JS | 11 nodi, ma **React non è un nodo**, `javascript-fetch-async-await` e `ajax-fetch-xhr` sono C/B | Aggiungere nodo React; portare JS moderno, AJAX, JSON ad **A**; ridurre canvas/DHTML/motore JS. |
| Architetture | Multi-livello, **mashup**, **event-driven**, HTTP/2, URI | 3-tier, stateless/stateful, TCP/IP, cookie/sessioni | 3-tier, MVC/MVVM, CORS, OpenAPI, rate limiting | `architettura-3-tier` A, `eventi-locali-vs-remoti` B | Aggiungere **mashup** e **event-driven**; riclassificare eventi. |
| Git | **Tracciamento codice, branching, merge, pull request** | Comandi base + PR | Comandi base + GitHub flow | `git-comandi-base` **C** (la lezione contiene già branch/merge/PR) | Portare `git-comandi-base` ad **A**: è nel syllabus ufficiale. |
| Web Semantico | **Non elencato** nel 2026/27 | Gruppo A «iper-riciclato», RDF/OWL/SPARQL | Area 5 con RDF/OWL/SPARQL/Linked Data | `web-semantico-rdf-owl`, `sparql-query-esempi` **A** | Retrocedere a **C/opzionale** finché non arrivi una fonte ufficiale o una prova. |
| HTTP/3 / QUIC | Ufficiale cita **HTTP/2**, non HTTP/3 | Gruppo A (HTTP 1/1.1/2/3, QUIC) | Aree 1–2 con RFC 9114, multiplexing | `quic-protocollo`, `multiplexing-http-2-3`, `http-1-1-1-2-3-differenze` **A** | Tenere come **B/approfondimento**; HTTP/2 è il dato ufficiale. |
| Modalità esame | Scritto **0–23** + tesina **0–10**; no appunti; no prove intermedie; esercizi di realizzazione app Web | Scritto max 23 + tesina max 10, **«2 ore»**, presentazione **8 minuti / 4 slide** | «IPOTESI: scritto 2 ore ~23 + tesina 10» | Priorità «basata su prove passate» | Conservare 23/10/8 minuti (confermati); **rimuovere o marcare come IPOTESI** «2 ore» e «4 slide». |
| Tesina | Individuale, **tecnologie a libera scelta** (frase ufficiale tronca), ~3 settimane, **PowerPoint max 8 min**, discussione codice/scelte | App Flask + CRUD + SQLite/JSON, 4 slide | Progetto Flask + front-end CRUD, 8 minuti, 4 slide | 5 nodi tesina in **C** | Promuovere i nodi tesina ad **A**; non dare per scontato Flask/SQLite come vincolo. |
| Testi | **Slide/materiale Moodle + tool + esercitazioni**; eventuali libri/articoli indicati a lezione o per la tesina | Nessun testo | MDN, RFC, W3C, Flask, Git, ECMA, SQLite come «consigliati» | Risorse per nodo | Etichettare le risorse esterne come **approfondimento**, non «testi ufficiali del docente». |
| Materiali pubblici | Slide su **Moodle ad accesso riservato**; scheda pubblica Moodle con descrizione | PDF delle prove non disponibili | Dichiara «risorse verificate HTTP 200» | Risorse nei nodi | Aggiungere registro fonti con contenuto letto, non solo status code. |
| Prove passate | **Non trovate** | Analisi dell'utente su prove passate, senza PDF | «Basato su prove passate di corsi simili» | Priorità A/B/C con % 65/20/15 | Dichiarare A/B/C e le percentuali come **IPOTESI interna**. |

### 2.2 Copertura degli argomenti ufficiali nei 40 nodi

Legenda stato: ✅ coperto; 🟡 coperto solo in parte / priorità da alzare; ❌ mancante.

| Argomento ufficiale TW 2026/27 [F1] | Nodi esistenti | Stato | Priorità attuale | Priorità proposta | Azione concreta |
|---|---|---|---|---|---|
| Cenni storici del Web | `web-1-0-2-0-3-0-4-0` | 🟡 | B | B | Aggiungere breve richiamo storico; non servirà un nuovo nodo se si aggiorna quello esistente. |
| URI | `uri-url-urn-differenze` | ✅ | A | A | Mantenere. |
| HTTP e **HTTP/2** | `http-protocollo-base`, `http-1-1-1-2-3-differenze`, `multiplexing-http-2-3` | 🟡 | A | A | Rendere esplicito il focus HTTP/2; HTTP/3 come approfondimento. |
| Sistemi multi-livello | `architettura-3-tier` | ✅ | A | A | Mantenere. |
| **Architetture mashup** | — | ❌ | — | **A** | Nuovo nodo proposto `architetture-mashup` (aggregazione di dati/servizi esterni). |
| **Sviluppo event-driven** | `eventi-locali-vs-remoti` | 🟡 | B | **A** | Nuovo nodo `sviluppo-event-driven` o riscrittura di `eventi-locali-vs-remoti`. |
| HTML5 | `html-form-accessibilita`, `span-tag-uso`, `canvas-api` | 🟡 | A/B | A | Aggiungere HTML5 semantico di base; `span`/canvas restano dettagli. |
| CSS | `css-box-model`, `css-origini-ereditarieta` | ✅ | A | A | Mantenere; Flexbox/Grid non sono citati ufficialmente → opzionali. |
| JavaScript | `javascript-fetch-async-await`, `dom-virtual-dom`, `motore-js-parser-ast-jit` | 🟡 | C/A/B | **A** | Alzare `javascript-fetch-async-await`; motore JS → B/C. |
| AJAX | `ajax-fetch-xhr` | 🟡 | B | **A** | Alzare priorità. |
| JSON | `json-formato-dati` | 🟡 | C | **A** | Alzare priorità. |
| **React** | `dom-virtual-dom` (solo accenno) | ❌ | — | **A** | Nuovo nodo `react-componenti-jsx` (componenti, JSX, props/state: dettagli didattici = IPOTESI). |
| **Sensori dispositivi mobili** | — | ❌ | — | **B** | Nuovo nodo `sensori-mobile-web`; il syllabus dice solo «accenno», quindi priorità B. |
| **Python (introduzione)** | `tesina-progetto-flask-crud` (solo codice Flask) | ❌ | — | **A/B** | Nuovo nodo `python-base-web`; il syllabus integrato parla di introduzione a Python [F8]. |
| **Flask + servizi RESTful** | `flask-rotte-jsonify`, `flask-request-response`, `rest-principi`, `rest-metodi-http`, `api-design-best-practice` | 🟡 | C/A | **A** | Alzare Flask; aggiungere esercizio `servizi-restful-flask` (creare + consumare). |
| **Git: branching, merge, pull request** | `git-comandi-base` | 🟡 | C | **A** | Contenuto già presente nella lezione: basta alzare priorità e motivazione. |
| **Modulo IA ufficiale** | — | ❌ | — | **A per la lode** | Nuova area/nodi ML: serve per la condizione di lode [F1]. |
| Tesina ufficiale | `tesina-*` (5 nodi) | 🟡 | C | **A** | Aggiornare vincoli: tecnologie libere, ~3 settimane, max 8 min, discussione codice. |

### 2.3 Argomenti presenti nel repo ma **non risultanti** dal programma ufficiale 2026/27

| Argomento / nodo | Perché non risulta ufficiale | Classificazione | Priorità proposta |
|---|---|---|---|
| `web-semantico-rdf-owl`, `sparql-query-esempi` | Il syllabus 2026/27 elenca URI/HTTP/HTTP/2, HTML/CSS/JS/AJAX/JSON/React/Flask/Git, non RDF/OWL/SPARQL [F1]. Compare in programmi di **altri atenei** (es. UNIBO 2019/20) [F26]. | **Fuori programma** (o residuo di anni/altre università) | C / opzionale |
| `quic-protocollo`, parte HTTP/3 di `http-1-1-1-2-3-differenze`, `multiplexing-http-2-3` | Ufficiale cita **HTTP/2**, non HTTP/3/QUIC [F1]. | **Approfondimento** | B |
| `canvas-api`, `dhtml-dynamic-html`, `span-tag-uso`, `motore-js-parser-ast-jit` | Dettagli non elencati; HTML5/JS sì, ma non questa granularità [F1]. | **Dettaglio non ufficiale** | B/C |
| `web-1-0-2-0-3-0-4-0` | Ufficiale dice «cenni storici», non la tassonomia 1.0→4.0 [F1]. | **Ipotesi dal materiale utente** | B |
| `rate-limiting-sicurezza`, CORS/OpenAPI in `SYLLABUS.md` | Non elencati nel syllabus 2026/27 [F1]. | **Approfondimento** | B/C |
| `sqlite-crud` | I prerequisiti citano database/SQL, ma i contenuti TW non nominano SQLite [F1]. | **Prerequisito utile**, non contenuto ufficiale | B |
| `quiz-form` | Nessun «quiz/form» come formato d'esame ufficiale; lo scritto ha «domande chiuse» [F1]. | **Strumento di ripasso** | B |
| `statico-vs-dinamico`, `tcp-ip-modello-livelli`, `codici-stato-http`, `codice-404-not-found`, `cookie-sessioni-gestione-stato` | Non nominati esplicitamente; coerenti con HTTP/REST ma non garantiti [F1]. | **Contesto utile** | A/B, con motivazione aggiornata |
| MVC/ORM/JSP/Servlet/Django/jQuery/Bootstrap/cloud in `SYLLABUS.md` | Appartengono a **I215-020** [F5] o al **2025/26 di INF-37** [F4], non al TW 2026/27 [F1]. | **Da non copiare** | Rimuovere |
| UML, GoF, Java, black-box/BVA in `docs/EXAM_FORMAT.md` e richiami IdS in `docs/STATUS.md` | Nessun riscontro nel programma TW; sembrano residui di un altro corso. **[IPOTESI]** sulla provenienza. | **Residuo estraneo** | Rimuovere/marcare |
| «Modulo IA» con LLM/agenti/codice generato in `SYLLABUS.md` | L'IA ufficiale è ML con numpy, non LLM applicati al web [F1]. | **Ipotesi superata** | Sostituire |

### 2.4 Priorità da cambiare (sintesi operativa)

| Nodo / gruppo | Ora | Proposta | Motivo | Sforzo |
|---|---|---|---|---|
| `git-comandi-base` | C | **A** | Git con branching/merge/PR è testualmente nel syllabus [F1]. | S |
| `flask-rotte-jsonify`, `flask-request-response` | C | **A** | Flask è il backend ufficiale; lo scritto include esercizi di realizzazione app Web [F1]. | S |
| `javascript-fetch-async-await`, `ajax-fetch-xhr`, `json-formato-dati` | C/B | **A** | JS/AJAX/JSON sono elencati ufficialmente [F1]. | S |
| `tesina-*` (5 nodi) | C | **A** | La tesina vale 0–10 punti: è un terzo del punteggio TW [F1]. | S |
| `web-semantico-rdf-owl`, `sparql-query-esempi` | A | **C** | Non risultano nel 2026/27; sottraggono tempo a React/Flask/Git. | S |
| `quic-protocollo`, `multiplexing-http-2-3` | A | **B** | Ufficiale cita HTTP/2, non HTTP/3 [F1]. | S |
| `canvas-api`, `dhtml-dynamic-html`, `span-tag-uso`, `motore-js-parser-ast-jit` | B | **C** | Dettagli non ufficiali. | S |
| `dom-virtual-dom` | A | A + nodo React | Virtual DOM da solo non copre «React» [F1]. | M |
| `eventi-locali-vs-remoti` | B | **A** (riscritto) | Il syllabus parla di «sviluppo event-driven» [F1]. | M |
| `graph/meta.json` → `nota_esame` / `trappole` | Basata su A/B/C utente | Riscrivere sul syllabus | Le motivazioni di priorità devono citare [F1], non «prove passate» non disponibili. | M |

---

## 3. Analisi dettagliata con evidenze e URL

### 3.1 Perché c'erano tre «Tecnologie Web» diverse

Le ricerche iniziali («Tecnologie Web UNIMORE programma», «Tecnologie Web UNIMORE esame scritto tesina», «Tecnologie Web Flask Git UNIMORE», «Intelligenza Artificiale e Tecnologie Web Laura Po», «INF-37 UNIMORE», «Tecnologie Web UNIMORE prove passate») portano a **più corsi omonimi**:

- **[FATTO]** Moodle elenca 14 corsi con «Tecnologie Web» nel nome: `I215-008 Tecnologieweb` (CdL Informatica, docenti Canali/Capodieci, secondo ciclo), `IGM-28 TecnologieWeb e Internet of Things`, e `INF-37 Intelligenza Artificiale e TecnologieWeb` [F9]. La scheda pubblica di `I215-008` del 2024 conferma **NICOLA CAPODIECI** [F11].
- **[FATTO]** Il SECloud Lab descrive un «Tecnologie Web» per **Informatica (D.M.270/04)** con **Django, Ajax, JQuery, JavaScript, Bootstrap**, docente **Claudia Canali** [F16]; non è il nostro modulo.
- **[FATTO]** `docs/SYLLABUS.md` ha usato **[I215-020] Programmazione per il web**, che il catalogo colloca nel **CdL Informatica, anno di offerta 2027/2028, 6 CFU, 48 ore, esame orale, progetto al 70%, Django/MVC/ORM/jQuery/Bootstrap/cloud** [F5]. È un corso reale, ma **non** è il modulo TW 2026/27 di Ingegneria Informatica.
- **[FATTO]** Esiste anche un **2025/26** di INF-37 con **Python + Django, Servlet/JSP, React**, scritto 0–33 + laboratorio 0–33 + tesina **opzionale fino a +5** [F4]. Questo spiega perché vecchie fonti e appunti possano parlare di Django.
- **[FATTO]** Per il **2026/27**, invece, il catalogo e Moodle dicono **Flask** [F1][F8]. Il cambiamento di framework e di modalità d'esame è quindi **documentato**, non inventato.

**[IPOTESI]** La compresenza di (a) un manifesto 2026/27 con «Tecnologie web» **standalone da 6 CFU al 1° semestre del 3° anno** e «Intelligenza artificiale e apprendimento automatico» da 6 CFU al 2° semestre [F7], (b) INF-37 integrato da 12 CFU per la coorte 2024/25 [F3], e (c) UNIFIND «10071 — Tecnologie Web», 6 CFU/54 ore, «corso ad esaurimento» [F14], riflette **coorti/ordinamenti diversi**. La homepage del catalogo avvisa che l'offerta 2026–2027 «sarà disponibile quanto prima» [F6]: **[NON TROVATO]** un syllabus pubblico per il nuovo corso standalone e una pagina che spieghi il raccordo. Il progetto deve quindi dichiarare **a quale coorte si rivolge**; i numeri 23+10 e Flask sono quelli di INF-37 2026/27 [F1].

### 3.2 La scheda ufficiale 2026/27, punto per punto

**[FATTO]** [F1] e [F2] (due percorsi di studio, stesso syllabus) riportano:

- **Corso di studi**: Ingegneria Informatica (MO); **anno di corso 3**; **anno di offerta 2026/2027**; **periodo**: ciclo annuale unico **16/09/2026 – 04/06/2027**; **lingua** italiana; **SSD** ING-INF/05; **sede** Modena; **frequenza** non obbligatoria; **crediti** 12 CFU; **durata** 108 ore; **tipo esame** «Scritto» a livello aggregato; **titolari**: CALDERARA SIMONE, **docenti**: PO LAURA; **moduli**: «Intelligenza Artificiale e Apprendimento Automatico» e «Tecnologie Web» [F1][F2][F3].
- **Modulo Tecnologie Web**: **54 ore, 6 CFU, tenuto dalla prof. Po** [F1]; Moodle 2026 conferma «introduzione alla programmazione in Python e il web application framework Flask» [F8].
- **Contenuti** (parafrasi con citazioni brevi): «**Fondamenti Web e Architetture**: cenni storici, protocolli (URI, HTTP, HTTP/2) e progettazione di sistemi multi-livello, **architetture mashup** e **sviluppo event-driven**»; «**Sviluppo Frontend**: HTML5, CSS, JavaScript, AJAX, JSON e **React**, e accenno all'interazione con i sensori dei dispositivi mobili»; «**Sviluppo Backend e Servizi**: programmazione server-side con tecnologie Python (**Flask**), focalizzata sulla creazione e fruizione di interfacce e **servizi RESTful**»; «**Controllo Versione e Gestione Progetti (Git)**: tracciamento del codice, gestione del lavoro collaborativo (**branching, merge, pull request**)» [F1].
- **Prerequisiti**: «E' gradita una conoscenza di base di **database, linguaggio SQL, Java e Python**» [F1].
- **Didattica**: lezioni frontali con presentazioni PowerPoint «prevalentemente in lingua inglese» ed esercitazioni pratiche/laboratorio [F1].
- **Nota ufficiale**: «Il programma potrà subire integrazioni o modifiche in base ad esigenze contingenti o ai feedback degli studenti» [F1] → **[IPOTESI]** ricontrollare il syllabus prima dell'appello.

**[FATTO]** Verifica dell'apprendimento del modulo TW [F1]:

| Elemento | Testo ufficiale (breve citazione/parafrasi) |
|---|---|
| Prova scritta | «domande aperte e chiuse» + «esercizi che verifichino le conoscenze e la capacità di realizzare un'applicazione Web» |
| Punteggio scritto | «varia da **0 a 23 punti**» |
| Materiale | «**non è consentito** l'uso di appunti o altro materiale» |
| Tesina | «lavoro individuale che richiede circa **tre settimane**»; «ideazione e realizzazione di un'applicazione web»; «**tecnologie a libera scelta**» (frase ufficiale tronca) |
| Punteggio tesina | «varia da **0 a 10 punti**» |
| Presentazione | «PowerPoint di **massimo 8 minuti**» + «discutere scelte progettuali e codice con il docente», su appuntamento |
| Prove intermedie | «**Non sono previste** prove intermedie» |

**[IPOTESI]** L'aritmetica «23 + 10 = 33 → 30 e lode» di `docs/MATERIALE_UTENTE.md` è **coerente** con i due intervalli ufficiali, ma il syllabus non dice esplicitamente che i punteggi si sommano né come 33 venga ricondotto a 30: va presentata come **inferenza**, non come regola ufficiale. **[NON TROVATO]** «2 ore» di durata e «4 slide»: il catalogo fissa solo il **massimo 8 minuti** [F1].

### 3.3 Modulo IA e regola della lode: il punto più sottovalutato

**[FATTO]** Il modulo «Intelligenza Artificiale e Apprendimento Automatico» (54 ore, 6 CFU, prof. Simone Calderara) comprende: introduzione all'IA, teoria dei metodi di apprendimento, apprendimento supervisionato e classificazione lineare, apprendimento statistico e bayesiano, clustering/apprendimento non supervisionato, **metodi di regressione e riduzione delle dimensioni**, con laboratorio Python/**numpy** [F1]. La verifica è «esame scritto con domande chiuse in forma di quiz» + «prova di Laboratorio al calcolatore» come **idoneità ON/OFF**; il voto del modulo è determinato dai quiz in trentesimi [F1].

**[FATTO]** Regola finale [F1]: «Il voto complessivo del corso integrato sarà la **media ponderata** dei voti dei singoli moduli arrotondata per eccesso (un voto pari a 30 e Lode equivale a 30 ai fini della media). La **Lode finale** nell'esame integrato viene attribuita **esclusivamente se lo studente consegue 30 in entrambi i moduli, con la Lode in almeno uno dei due (IA e TW)**.»

Conseguenze pratiche:

- **[FATTO]** «30 e lode» **non** si ottiene con il solo modulo TW: serve anche il 30 nel modulo IA.
- **[FATTO]** Il «Modulo IA (OPZIONALE)» di `docs/SYLLABUS.md` (LLM nel ciclo di vita web, assistenti AI, rischi codice generato) **non corrisponde** al modulo IA ufficiale. È un'ipotesi di lavoro precedente, da sostituire.
- **[IPOTESI]** Per il nostro knowledge graph conviene una piccola area IA «ufficiale» anche se il progetto nasce sul modulo TW: è la condizione che sblocca la lode.

### 3.4 Testi consigliati e materiali pubblici

**[FATTO]** La sezione «Testi» di [F1] dice di prepararsi con «**le slide e il materiale fornito dai docenti durante le lezioni, oltre che i tool software analizzati, e le esercitazioni svolte**»; «Tutte le slide e il materiale didattico sono rese disponibili man mano che vengono affrontate durante le lezioni sul sito **MOODLE**»; «Materiali didattici aggiuntivi per l'approfondimento, come libri e articoli di ricerca saranno menzionati durante le lezioni o elencati come materiali per lo svolgimento della tesina». **Nessun titolo di libro è nominato** [F1].

**[FATTO]** La scheda Moodle pubblica del corso 2026 (`id=22244`) mostra descrizione e moduli, ma **non file**; la `course/view.php?id=22244` rimanda al **login UNIMORE** [F8][F12]. Stesso esito per il Moodle 25/26 linkato dal GitLab pubblico [F18][F27]. L'area pubblica ESSE3 non espone syllabus [F13]; il syllabus pubblico è quello del Course Catalogue [F1].

**[FATTO]** Esiste materiale pubblico **ma di un altro corso**: il GitLab `ncapodieci/techweb` dichiara «Materiali per il corso di Tecnologie Web», con cartelle `python/`, `django/`, `js/`, `slides/` [F17][F18]; l'elenco `slides/` contiene PDF Django, Django REST framework, JavaScript, Django Channels [F19]. Il README linka al Moodle **AA 25/26** [F18]. È coerente con `I215-008`/SECloud [F11][F16], **non** con il modulo Flask della prof.ssa Po.

**[FATTO]** Il sito personale della prof.ssa Po [F15] e UNIFIND [F14] confermano identità e insegnamenti, ma non pubblicano slide del corso. **[NON TROVATO]** una pagina `personale.unimore.it` con il programma: i vecchi URL indicati dai motori di ricerca reindirizzano a «Pagina non trovata».

### 3.5 Prove passate, struttura delle domande e nuove proposte

#### 3.5.1 Cosa si può dire senza inventare

**[NON TROVATO]** Nessun **testo/PDF pubblico di prove passate** riconducibile a «Tecnologie Web» UNIMORE (modulo Po) è stato trovato su unimore.it, Moodle pubblico, ESSE3, DIEF/DISMI, GitHub/GitLab, Studocu, Docsity, forum o YouTube. `docs/MATERIALE_UTENTE.md` dichiara a sua volta che i PDF non sono disponibili.

**[FATTO]** Terze parti contengono materiale omonimo ma **di altri atenei**: un quiz Studocu «Tecnologie Web - parte 1» è creato da appunti dell'**Università di Udine** [F24]; la pagina UNIMORE su Studocu è «**Tecnologia della comunicazione**», corso diverso [F25]; Docsity raccoglie prove di **UNIBO** [F26]. Non ne copio i testi: sono potenzialmente coperti da copyright e non attestano il nostro esame.

**[FATTO]** Una issue del progetto studentesco **TriviaMore** dichiara «in locale» **261 domande** per un insegnamento dismesso «Tecnologie Web» in `20-312` [F20][F21]: non è un archivio pubblico di prove, né una fonte ufficiale. Il repository documenta tipi generici `MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_ANSWER` [F22]: utile come **spunto progettuale**, non come formato d'esame UNIMORE. L'organizzazione GitHub non ufficiale `unimoreinginfo` elenca 15 repository pubblici, nessuno dedicato a TW [F23].

**[FATTO]** La **struttura verificata** resta quindi solo quella di [F1]: **domande aperte**, **domande chiuse**, **esercizi di realizzazione di un'applicazione Web** nello scritto; **discussione di scelte progettuali e codice** per la tesina; **quiz chiusi + laboratorio ON/OFF** nel modulo IA.

**[IPOTESI]** Gli «abbinamenti», i «quiz form», le percentuali 65/20/15 e i distrattori tipo «LAN tra i tipi di Web» o «Installazione Sistema Operativo tra le fasi di sviluppo» provengono da `docs/MATERIALE_UTENTE.md`: sono **ipotesi interne**, non formati ufficiali. Il repo ha già `graph/quiz.json` con **18 elementi** (12 `scelta_multipla`, 6 `abbinamento`) e un contratto in `docs/QUIZ_FORMAT.md` con distrattori `plausibile` / `fuori_contesto`.

#### 3.5.2 Proposte ORIGINALI di quiz/abbinamenti (IPOTESI — non tratte da prove reali)

Le proposte seguenti sono scritte ex novo, compatibili con `docs/QUIZ_FORMAT.md`, e usano distrattori **fuori contesto**. Servono ad allenare il programma ufficiale [F1]; **non predicono domande d'esame**.

**Q1 — Scelta multipla (area 1/4): «Programma ufficiale 2026/27».**  
Domanda: «Quale insieme di tecnologie è esplicitamente citato nel modulo TW 2026/27?»  
Opzioni: **A)** URI, HTTP/2, mashup, Flask, Git, React *(corretta)*; **B)** Servlet/JSP, Django, jQuery, Bootstrap *(è il 2025/26 o I215-020 [F4][F5])*; **C)** RDF, OWL, SPARQL, QUIC *(presente nel repo, non nel syllabus [F1])*; **D)** UML, Composite, JUnit, Maven *(residuo di `docs/EXAM_FORMAT.md`, fuori contesto)*.  
Spiegazione: A ricalca l'elenco di [F1]; B e C sono «plausibili ma datati/disallineati», D è deliberatamente estraneo.

**Q2 — Abbinamento (area 2/3/4): «Tecnologia → ruolo ufficiale».**  
Termini: `React` → frontend a componenti; `Flask` → backend/servizi RESTful; `Git` → branching/merge/pull request; `AJAX` → interazione asincrona client-side.  
Distrattori `fuori_contesto`: «Installazione del sistema operativo = fase dello sviluppo Web»; «LAN = una versione del Web»; «Composite = pattern per servizi RESTful»; «SPARQL = formato JSON».  
Distrattore `plausibile`: «Django = framework Python del modulo TW 2026/27» (falso: è nel 2025/26 e in I215-020 [F4][F5]).

**Q3 — Completamento codice / chiusa (area 4): «Rotta REST con Flask».**  
Consegna: «Completa una rotta che espone una risorsa in formato JSON.» Soluzione attesa (originale): `@app.route('/api/items/<int:id>', methods=['GET'])` + `return jsonify(item), 200`.  
Distrattori: `methods=['SMTP']` (protocollo di posta, fuori contesto), `return render_template(..., status=404)` (confonde template e codice di stato), `methods=['PATCH']` con sostituzione completa della risorsa (confonde PATCH/PUT), `@app.route` con `SELECT * FROM` (confonde SQL e routing).

**Q4 — Vero/Falso con giustificazione (area 6).**  
«La tesina TW 2026/27 è facoltativa e può aggiungere fino a 5 punti.» → **Falso**: era il 2025/26 [F4]; nel 2026/27 la tesina fa parte della verifica e vale **0–10** [F1].  
«Allo scritto TW 2026/27 si possono consultare slide e appunti.» → **Falso** [F1] (era consentito nella prova di laboratorio 2025/26 [F4]).  
«Sono previste prove intermedie.» → **Falso** [F1].  
Distrattore fuori contesto da offrire come terza opzione: «La prova si svolge su carta A3 con diagrammi UML» (da `docs/EXAM_FORMAT.md`, non pertinente).

**Q5 — Domanda aperta breve (area 2/3).**  
«Spiega la differenza tra un'**architettura mashup** e lo **sviluppo event-driven**, e indica un esempio di interazione con sensori mobili coerente con il syllabus.»  
Risposta attesa: mashup = combinazione di dati/servizi provenienti da più sorgenti; event-driven = flusso governato da eventi/produttori-consumatori; sensori = sorgenti di eventi/dati lato client. **[IPOTESI didattica]**: il syllabus nomina i tre concetti ma non le definizioni, quindi la formulazione esatta va validata con le slide ufficiali.

**Q6 — Abbinamento (area IA, per la lode).**  
Termini: `classificazione lineare` → apprendimento supervisionato; `clustering` → apprendimento non supervisionato; `numpy` → laboratorio Python; `quiz chiusi` → voto del modulo IA in trentesimi.  
Distrattori fuori contesto: «LLM = tecnica di clustering ufficiale del modulo»; «Agente AI = strumento di branching Git»; «PowerPoint = formato del file `.ipynb`».  
Serve a ricordare che la lode richiede **anche** il modulo IA [F1].

### 3.6 Dichiarazione esplicita di ciò che NON ho trovato

- **[NON TROVATO]** Testi/PDF **pubblici** di prove passate UNIMORE per il modulo TW della prof.ssa Po; nessun «tema d'esame» verificabile.
- **[NON TROVATO]** Slide/esercizi **pubblici** del corso 2026/27 INF-37: Moodle richiede login [F12]; la scheda pubblica [F8] non allega file.
- **[NON TROVATO]** Durata ufficiale dello scritto: «2 ore» è solo in `docs/MATERIALE_UTENTE.md` / `docs/SYLLABUS.md`.
- **[NON TROVATO]** Numero ufficiale di slide della tesina: «4 slide» è un'ipotesi interna; ufficiale è solo «PowerPoint di massimo 8 minuti» [F1].
- **[NON TROVATO]** Libri di testo ufficiali nominati; solo slide, tool, esercitazioni e eventuali libri/articoli comunicati a lezione [F1].
- **[NON TROVATO]** Una pagina che concili manifesto 2026/27 [F7], INF-37 integrato [F1][F3] e UNIFIND 10071 «corso ad esaurimento» [F14]; la coorte esatta del progetto resta **[IPOTESI]**.
- **[NON TROVATO]** Syllabus dettagliato nell'area pubblica ESSE3 [F13]; il dettaglio è sul Course Catalogue.
- **[NON TROVATO]** Video YouTube, canale docente o forum pubblico riconducibili al corso; le ricerche YouTube hanno restituito omonimi non pertinenti.
- **[NON TROVATO]** Nei domini DIEF/DISMI un programma TW alternativo: solo manifesto, documenti SUA e pagine Erasmus; nessun nuovo syllabus rispetto a [F1].
- **[NON TROVATO]** Conferma ufficiale di HTTP/3, QUIC, Web Semantico/RDF/OWL/SPARQL, canvas, DHTML, motore JS parser/AST/JIT, rate limiting, Web 1.0–4.0, ARIA, Flexbox/Grid, CORS, OpenAPI, JSON-LD, SQLite nel programma 2026/27 [F1].
- **[NON TROVATO]** Conferma che la tesina debba usare Flask/SQLite: il testo ufficiale dice «tecnologie a libera scelta» (con frase tronca) [F1].
- **[NON TROVATO]** Conferma delle percentuali 65/20/15 e dei gruppi A/B/C come fatti d'esame: sono l'analisi dell'utente.
- **[NON TROVATO]** Conferma del «modulo IA» come LLM/agenti per lo sviluppo web: l'IA ufficiale è ML [F1].

### 3.7 Registro delle fonti con URL verificati (aperti il 27/10/2026)

| ID | URL aperto | Cosa conferma | Caveat |
|---|---|---|---|
| F1 | [Course Catalogue — INF-37, a.a. 2026/27, percorso ordinario](<https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>) | Syllabus completo: 12 CFU/108h, 3° anno, docenti, contenuti, 23+10, tesina, IA, testi, lode | Testo con alcune frasi tronche/typo; «programma potrà subire modifiche» |
| F2 | [Course Catalogue — INF-37, percorso Accademia Militare](<https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10001?schemaid=22867#3>) | Stesso programma per un altro percorso | Duplica F1, utile come controprova |
| F3 | [Piani di studio — Ingegneria Informatica (MO), coorte 2024/25](<https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/10001>) | INF-37 al 3° anno: 12 CFU, 108 ore, ciclo annuale, offerta 2026/27 | Non è il manifesto della coorte 2026 |
| F4 | [Course Catalogue — INF-37, a.a. 2025/26](<https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2025/27352/2022/10000?annoOrdinamento=2022>) | Versione precedente: Django, Servlet/JSP, scritto 0–33 + lab 0–33 + tesina opzionale +5 | **Non** usare per il 2026/27 |
| F5 | [Course Catalogue — I215-020 Programmazione per il web](<https://unimore.coursecatalogue.cineca.it/corsi/2025/10959/insegnamenti/2027/28671/2025/10000?annoOrdinamento=2025&coorte=2025>) | CdL Informatica, 2027/28, 6 CFU/48h, orale, progetto 70%, Django/MVC/ORM/jQuery/Bootstrap/cloud | È il corso citato per errore in `SYLLABUS.md` |
| F6 | [Course Catalogue — homepage](<https://unimore.coursecatalogue.cineca.it/>) | «L'offerta formativa 2026-2027 ... sarà disponibile quanto prima» | Spiega perché manca il piano della coorte 2026 |
| F7 | [Manifesto Ingegneria Informatica 2026/27 (PDF)](<https://www.ingmo.unimore.it/sites/dip02/files/2026-06/Laurea%20Ingegneria%20Informatica%20a.a.%202026_2027.pdf>) | L-8, 180 CFU, «Tecnologie web» 6 CFU al 1° semestre del 3° anno; IA/apprendimento automatico 6 CFU al 2° | Rappresentazione non coincidente con INF-37 integrato |
| F8 | [Moodle — info corso 2026 INF-37 (id 22244)](<https://moodle.unimore.it/course/info.php?id=22244>) | Moduli IA (Calderara) e TW (Laura Po), 6 CFU/54h ciascuno, «Python e Flask» | Pagina pubblica senza allegati |
| F9 | [Moodle — ricerca «Tecnologie Web»](<https://moodle.unimore.it/course/search.php?search=Tecnologie%20Web&perpage=all>) | 14 corsi omonimi; distingue I215-008, IGM-28, INF-37 | Nome solo non basta a identificare il corso |
| F10 | [Moodle — info corso 2025 INF-37 (id 17399)](<https://moodle.unimore.it/course/info.php?id=17399>) | Obiettivi generali 2025/26, teacher list | Nessun programma dettagliato |
| F11 | [Moodle — info I215-008 (id 15028)](<https://moodle.unimore.it/course/info.php?id=15028>) | Corso «Tecnologie web» 2024 con Nicola Capodieci | Altro CdL/altro corso |
| F12 | [Moodle — view corso 2026 (id 22244)](<https://moodle.unimore.it/course/view.php?id=22244>) | Apertura verificata: **redirect al login UNIMORE** | Impossibile leggere slide senza credenziali |
| F13 | [ESSE3 — area pubblica](<https://www.esse3.unimore.it/Root.do>) | Portale pubblico con informazioni di accesso, nessun syllabus | La didattica pubblica è su Course Catalogue |
| F14 | [UNIFIND — PO Laura](<https://unimore.unifind.cineca.it/get/person/090944>) | Identità, DIEF, contatti, insegnamento «10071 — Tecnologie Web» 6 CFU/54h, ciclo annuale 2026/27, «corso ad esaurimento» | Etichetta ambigua, non sostituisce il syllabus |
| F15 | [Sito personale — Laura Po](<https://sites.google.com/view/laurapo/home>) | Profilo e afferenza DIEF | Nessuna pagina didattica/slide trovata |
| F16 | [SECloud Lab — Teachings](<https://secloud.ing.unimore.it/teachings/>) | «Tecnologie Web» per Informatica con Django/Ajax/jQuery/Bootstrap, docente Claudia Canali | Non è il modulo TW 2026/27 |
| F17 | [GitLab UNIMORE — ncapodieci/techweb](<https://git.hipert.unimore.it/ncapodieci/techweb>) | Repo pubblico «Materiali per il corso di Tecnologie Web» con `python/`, `django/`, `js/`, `slides/` | Materiale Django, non Flask/Po |
| F18 | [GitLab — README del repo](<https://git.hipert.unimore.it/ncapodieci/techweb/-/blob/main/README.md>) | Struttura cartelle e link al Moodle AA 25/26 (`id=18403`) | Il link Moodle richiede login [F27] |
| F19 | [GitLab — cartella `slides/`](<https://git.hipert.unimore.it/ncapodieci/techweb/-/tree/main/slides>) | PDF pubblici: Django, Django REST framework, JavaScript, Django Channels, esercizi DTL | Slide pubbliche ma di altro corso |
| F20 | [TriviaMore — issue #187](<https://github.com/MarinCervinschi/TriviaMore/issues/187>) | Dichiara «in locale» 261 domande per «Tecnologie Web» in `20-312` | DB locale, non prove pubbliche, non ufficiale |
| F21 | [TriviaMore — repository](<https://github.com/MarinCervinschi/TriviaMore>) | Progetto studentesco open source di quiz/flashcard per UniMore | Non è fonte d'esame |
| F22 | [TriviaMore — question-format.md](<https://github.com/MarinCervinschi/TriviaMore/blob/staging/.claude/skills/generate-questions/references/question-format.md>) | Tipi generici `MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_ANSWER` e regole di qualità | Linee guida del progetto, non formato UNIMORE |
| F23 | [GitHub — org `unimoreinginfo`](<https://github.com/unimoreinginfo>) | 15 repository pubblici studenteschi; nessuno dedicato a TW nell'elenco | Org non ufficiale |
| F24 | [Studocu — quiz «Tecnologie Web - parte 1»](<https://www.studocu.com/it/quiz/tecnologie-web-parte-1/6357015>) | Quiz derivato da appunti dell'**Università di Udine** | Altro ateneo; non copiato |
| F25 | [Studocu — corso UNIMORE «Tecnologia della comunicazione»](<https://www.studocu.com/it/course/universita-degli-studi-di-modena-e-reggio-emilia/tecnologia-della-comunicazione/1705590>) | Corso UNIMORE con nome simile ma diverso | Non è Tecnologie Web |
| F26 | [Docsity — esami Programmazione e Tecnologie Web UNIBO](<https://www.docsity.com/it/universita/it/alma-mater-studiorum-universita-di-bologna-unibo/esami/programmazione-e-tecnologie-web-unibo/>) | Raccolta di prove/appunti dell'**Università di Bologna** | Altro ateneo; non copiato |
| F27 | [Moodle — view corso AA 25/26 (id 18403)](<https://moodle.unimore.it/course/view.php?id=18403>) | Apertura verificata: **login richiesto** | Conferma che il repo GitLab non rende pubbliche le slide Moodle |

### 3.8 Ricerche effettuate (per tracciabilità)

- «Tecnologie Web UNIMORE programma»; «Tecnologie Web UNIMORE esame scritto tesina»; «Tecnologie Web Flask Git UNIMORE» (tre query suggerite).
- «site:unimore.it Tecnologie Web», «site:unimore.coursecatalogue.cineca.it INF-37», «site:esse3.unimore.it Tecnologie Web», «site:moodle.unimore.it Tecnologie Web», «site:ingmo.unimore.it Tecnologie Web», «site:dief.unimore.it Laura Po», «site:dismi.unimore.it Tecnologie Web».
- «Intelligenza Artificiale e Tecnologie Web Laura Po programma esame», «Laura Po Tecnologie Web tesina 23 10», «Tecnologie Web UNIMORE prove passate / temi d'esame PDF», «site:github.com UNIMORE Tecnologie Web quiz», «site:youtube.com Tecnologie Web Unimore Laura Po», «site:studocu.com / site:docsity.com UNIMORE Tecnologie Web Po», «TriviaMore Tecnologie Web 261 domande».
- Nessun risultato utile su forum/YouTube dedicati; i risultati YouTube erano canali personali con nomi simili ma non pertinenti.

---

## 4. LISTA PRIORITIZZATA di miglioramenti concreti per il progetto

> **Nota**: in questo turno **nessuna delle modifiche sotto è stata applicata** (vincolo: produrre un solo file, non toccare `graph/`). Sono proposte ordinate per impatto sul voto.
> **Sforzo**: S = fino a ~1 ora; M = mezza giornata/1 giorno; L = più giorni o richiede accesso/credenziali.

| # | Priorità | Cosa cambiare | Dove nel repo | Perché aiuta a prendere 30 e lode | Sforzo |
|---|---|---|---|---|---|
| 1 | **P0** | Riscrivere l'anagrafica del corso: nome esatto **INF-37 / modulo Tecnologie Web**, CdL Ingegneria Informatica (MO), 3° anno, 12 CFU integrati / 6 CFU+54h modulo, ciclo annuale 2026/27, docenti Po e Calderara; rimuovere l'affermazione «il corso ufficiale si chiama Programmazione per il web». | `docs/SYLLABUS.md` (intestazione, tabella fonti, «Nota importante»); `README.md` (riferimento a SYLLABUS); `graph/meta.json` → `corso` **(in un secondo turno)** | Elimina l'errore di identità del corso: studiare Django/orale invece di Flask/scritto+tesina farebbe perdere punti veri. | **S** |
| 2 | **P0** | Sostituire la sezione «Modulo IA (OPZIONALE)» con il **modulo IA ufficiale**: ML 6 CFU/54h, numpy, argomenti e quiz+lab ON/OFF; aggiungere la regola di **lode = 30 in entrambi i moduli**. | `docs/SYLLABUS.md`; `docs/MATERIALE_UTENTE.md` (punto 1); `docs/NODES.md` (nota finale) | È la condizione ufficiale per la lode [F1]: senza il modulo IA il «30 e lode» è irraggiungibile anche con 33/33 su TW. | **S** |
| 3 | **P0** | Aggiornare la «Modalità d'esame (IPOTESI)»: mantenere **scritto 0–23 + tesina 0–10**, aggiungere **no appunti**, **no prove intermedie**, **~3 settimane**, **PowerPoint max 8 min**, **discussione codice/scelte**, **tecnologie libere**; **marcare «2 ore» e «4 slide» come IPOTESI** o rimuoverli. | `docs/SYLLABUS.md`; `docs/MATERIALE_UTENTE.md`; `docs/EXAM_FORMAT.md` (attualmente di un altro corso) | Allena sul formato reale: esercizi di coding senza materiale e difesa del progetto, non su durate inventate. | **S** |
| 4 | **P0** | Riscrivere i «Testi consigliati»: **nessun libro ufficiale**; fonti primarie = slide/materiale Moodle + tool + esercitazioni; MDN/RFC/W3C/Flask/Git diventano «risorse di approfondimento verificate». | `docs/SYLLABUS.md` (sez. Testi); `graph/meta.json` → `testi` **(secondo turno)** | Evita di studiare capitoli di standard non richiesti al posto delle slide del docente, che il syllabus indica come base d'esame. | **S** |
| 5 | **P0** | Aggiungere una tabella **FATTI / IPOTESI / NON TROVATO** con il registro fonti di questo R3; rimuovere i «✅ HTTP 200» generici o affiancarli alla data di apertura e al contenuto letto. | `docs/SYLLABUS.md` (nuova sezione); `docs/STATUS.md` (contraddizione: dice «programma ufficiale (sito docente)» mentre SYLLABUS dice «non trovato»); `scripts/check_urls.py` (documentare che controlla solo lo status) | Rende auditabile ogni numero: non si ripeterà l'errore di prendere un corso omonimo come «ufficiale». | **S** |
| 6 | **P0** | **Promuovere ad A** i nodi ufficiali oggi C/B: `git-comandi-base`, `flask-rotte-jsonify`, `flask-request-response`, `javascript-fetch-async-await`, `ajax-fetch-xhr`, `json-formato-dati`, `tesina-*`; aggiornare le motivazioni di priorità citando il syllabus [F1] invece delle «prove passate». | `docs/NODES.md`; `graph/parts/area-3.json`, `area-4.json`, `area-5.json`, `area-6.json`; `graph/meta.json` → `nota_esame` **(secondo turno)** | Sposta ore di studio sui 23 punti dello scritto e sui 10 della tesina: è il moltiplicatore più diretto del voto. | **M** |
| 7 | **P0** | Creare i **nodi mancanti ufficiali** (id suggeriti, non creati): `react-componenti-jsx`, `architetture-mashup`, `sviluppo-event-driven`, `sensori-mobile-web`, `python-base-web`, `servizi-restful-flask`; riscrivere `eventi-locali-vs-remoti` in chiave event-driven. | `graph/parts/area-2.json`, `area-3.json`, `area-4.json`; `graph/lezioni/<id>.json`; `docs/NODES.md` **(secondo turno)** | Copre l'intero elenco di [F1]: React, mashup, event-driven e Git sono gli argomenti più a rischio di domanda a sorpresa. | **M** |
| 8 | **P1** | **Retrocedere** a C/opzionale i temi non ufficiali: `web-semantico-rdf-owl`, `sparql-query-esempi`, `quic-protocollo`, parti HTTP/3, `canvas-api`, `dhtml-dynamic-html`, `span-tag-uso`, `motore-js-parser-ast-jit`, `web-1-0-2-0-3-0-4-0`, `rate-limiting-sicurezza`; mantenere `sqlite-crud` come prerequisito B. | `docs/NODES.md`; `graph/parts/area-1.json`, `area-2.json`, `area-3.json`, `area-5.json`; `graph/meta.json` → `trappole` **(secondo turno)** | Libera tempo per Flask/React/Git/mashup; evita di presentare RDF/OWL come «Gruppo A» quando non è nel programma. | **S** |
| 9 | **P1** | Inserire una piccola **area IA ufficiale** nel KG (anche solo 5–6 nodi: supervised/linear classification, Bayes, clustering, regressione/dimensioni, numpy lab, quiz+lab ON/OFF) con collegamento alla regola di lode. | `graph/parts/area-7.json` (nuovo), `graph/meta.json` → `aree`, `docs/NODES.md`, `docs/PIANO_STUDIO.md` **(secondo turno)** | Trasforma la lode da slogan a percorso di studio: il voto finale è la media ponderata dei due moduli [F1]. | **M** |
| 10 | **P1** | Aggiornare il simulatore: timer/esercizi **senza appunti**, sezione «esercizio di realizzazione app Web», e una checklist tesina con 3 settimane / 8 minuti / domande su codice e scelte progettuali; aggiungere badge «anche modulo IA» per la lode. | `web/` (simulatore, ripasso, checklist), `docs/CHECKLIST_RIPASSO.md`, `docs/PIANO_STUDIO.md` | Simulare le condizioni reali (no appunti, difesa del codice) è il modo più economico di guadagnare gli ultimi punti. | **M** |
| 11 | **P1** | Aggiungere a `graph/quiz.json` le **proposte originali Q1–Q6** di §3.5.2, con `distrattori.tipo = "fuori_contesto"`; se si vogliono vero/falso e completamento codice, estendere prima schema e test. | `graph/quiz.json`; `graph/quiz.schema.json`; `docs/QUIZ_FORMAT.md`; `tests/test_quiz.py` **(secondo turno)** | Aumenta il richiamo attivo sui temi ufficiali e allena a scartare opzioni estranee, come segnalato dal materiale utente. | **S/M** |
| 12 | **P1** | Dichiarare esplicitamente la **coorte**: «questo KG segue INF-37 2026/27 (coorte 2024/25) con Flask e 23+10; se sei nel nuovo piano del manifesto 2026/27, verifica il syllabus della tua coorte». | `README.md`; `docs/SYLLABUS.md`; `docs/ARENA_PLAN.md`; `docs/STATUS.md` | Evita di mescolare due assetti ufficiali diversi [F1][F7][F14] e di preparare l'esame sbagliato. | **S** |
| 13 | **P2** | Ripulire i **residui di Ingegneria del Software**: `docs/EXAM_FORMAT.md` (UML, GoF, Java, BVA), `docs/STATUS.md` (IdS AI-native, 75 lezioni), e correggere l'incongruenza «Gruppo B 8 nodi» vs «9 nodi» in `docs/NODES.md`. | `docs/EXAM_FORMAT.md`, `docs/STATUS.md`, `docs/NODES.md` | Rimuove falsi segnali di priorità: diagrammi UML e pattern GoF non sono nel programma TW [F1]. | **M** |
| 14 | **P2** | Con credenziali studentesche, scaricare le **slide Moodle 2026/27** e mappare ogni PDF a un nodo; aggiungere solo i link che si aprono davvero, con data di verifica. | `docs/research/` (nuovo registro materiali), `graph/parts/*.json` → `risorse` **(secondo turno)** | Le slide sono la fonte primaria d'esame [F1]: coprirebbero il divario tra syllabus sintetico e domande reali. Richiede accesso, quindi sforzo L. | **L** |

---

## 5. Cosa NON copiare

1. **Non copiare `I215-020 — Programmazione per il web`** nel programma di Tecnologie Web: è CdL **Informatica**, anno di offerta **2027/28**, 48 ore, **orale**, progetto al **70%**, **Django/MVC/ORM/jQuery/Bootstrap/cloud** [F5]. È la fonte dell'errore principale in `docs/SYLLABUS.md`.
2. **Non copiare il programma INF-37 del 2025/26**: prevedeva **Django e Servlet/JSP**, scritto 0–33 + laboratorio 0–33 + tesina **opzionale +5** [F4]. Nel 2026/27 è **Flask + Git** con **scritto 0–23 + tesina 0–10** [F1].
3. **Non copiare le slide del GitLab `ncapodieci/techweb`** come se fossero il materiale della prof.ssa Po: sono PDF **Django/JS** legati a `I215-008` e al Moodle 25/26 [F17][F18][F19][F27]; il SECloud Lab le descrive per il CdL Informatica con la prof.ssa Canali [F16].
4. **Non copiare `docs/EXAM_FORMAT.md` e i residui IdS di `docs/STATUS.md`**: use case/class/sequence diagram, pattern GoF, Java, black-box/BVA, «IdS AI-native» non hanno riscontro nel syllabus TW 2026/27 [F1]. **[IPOTESI]** sono resti dello scaffold precedente.
5. **Non copiare prove o quiz di altri atenei** (Studocu UniUd [F24], Docsity UNIBO [F26], pagine UNIMORE «Tecnologia della comunicazione» [F25]) spacciandoli per prove UNIMORE. Non riprodurre testi potenzialmente coperti da copyright: qui sono citate solo brevi espressioni del syllabus pubblico.
6. **Non copiare il «modulo IA» come LLM/agenti/codice generato**: il modulo ufficiale è machine learning con numpy [F1]. I temi LLM possono restare solo come **approfondimento opzionale dichiarato**.
7. **Non copiare come fatti ufficiali**: «scritto di 2 ore», «4 slide», «65/20/15%», «tesina obbligatoriamente Flask+SQLite», «senza tesina il massimo è 23/30», «HTTP/3 e Web Semantico sono nel programma». Sono inferenze o ipotesi interne finché una fonte ufficiale non le conferma.
8. **Non copiare la tabella «✅ HTTP 200» di `docs/SYLLABUS.md` come prova di contenuto**: `scripts/check_urls.py` verifica lo status code, non cosa c'è scritto nella pagina. Il controllo corretto è «URL aperto + contenuto letto + data», come nel registro §3.7.
9. **Non copiare i «261 quiz in locale» di TriviaMore** [F20] come banca pubblica di prove passate: sono dati locali di un progetto studentesco [F21]; i tipi di domanda in [F22] sono linee guida generiche, non il formato d'esame UNIMORE.
10. **Non copiare distrattori o domande da `graph/quiz.json` senza aggiornarli**: oggi 18 elementi (12 scelta multipla, 6 abbinamento) includono RDF/SPARQL e HTTP/3 con priorità A; vanno riscritti con il programma ufficiale e nuovi distrattori fuori contesto.

---

### Nota finale di trasparenza

- **[FATTO]** Tutte le affermazioni numeriche su CFU, ore, punteggi, date e docenti provengono da [F1], [F2], [F3], [F7], [F8] o [F14]; le citazioni letterali sono brevi estratti di pagine istituzionali pubbliche.
- **[IPOTESI]** Le proposte di nuovi nodi, le definizioni didattiche di mashup/event-driven/React, i quiz Q1–Q6, la ricostruzione della coorte e la provenienza dei residui IdS sono **elaborazioni originali**, non fatti attribuiti al docente.
- **[NON TROVATO]** Tutto ciò che è elencato al §3.6 resta dichiaratamente non trovato: in particolare **prove passate pubbliche, slide pubbliche del corso 2026/27, durata dello scritto e testi ufficiali nominati**.
- **[FATTO]** Il syllabus ufficiale avvisa che il programma può cambiare [F1]: prima dell'esame, rivalidare [F1] e le slide Moodle con le credenziali del corso.

---

<!-- Definizioni dei riferimenti: rendono cliccabili i codici F1–F27 usati nel testo. Gli URL sono gli stessi aperti e registrati al §3.7. -->
[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
[F2]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10001?schemaid=22867#3>
[F3]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/10001>
[F4]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2025/27352/2022/10000?annoOrdinamento=2022>
[F5]: <https://unimore.coursecatalogue.cineca.it/corsi/2025/10959/insegnamenti/2027/28671/2025/10000?annoOrdinamento=2025&coorte=2025>
[F6]: <https://unimore.coursecatalogue.cineca.it/>
[F7]: <https://www.ingmo.unimore.it/sites/dip02/files/2026-06/Laurea%20Ingegneria%20Informatica%20a.a.%202026_2027.pdf>
[F8]: <https://moodle.unimore.it/course/info.php?id=22244>
[F9]: <https://moodle.unimore.it/course/search.php?search=Tecnologie%20Web&perpage=all>
[F10]: <https://moodle.unimore.it/course/info.php?id=17399>
[F11]: <https://moodle.unimore.it/course/info.php?id=15028>
[F12]: <https://moodle.unimore.it/course/view.php?id=22244>
[F13]: <https://www.esse3.unimore.it/Root.do>
[F14]: <https://unimore.unifind.cineca.it/get/person/090944>
[F15]: <https://sites.google.com/view/laurapo/home>
[F16]: <https://secloud.ing.unimore.it/teachings/>
[F17]: <https://git.hipert.unimore.it/ncapodieci/techweb>
[F18]: <https://git.hipert.unimore.it/ncapodieci/techweb/-/blob/main/README.md>
[F19]: <https://git.hipert.unimore.it/ncapodieci/techweb/-/tree/main/slides>
[F20]: <https://github.com/MarinCervinschi/TriviaMore/issues/187>
[F21]: <https://github.com/MarinCervinschi/TriviaMore>
[F22]: <https://github.com/MarinCervinschi/TriviaMore/blob/staging/.claude/skills/generate-questions/references/question-format.md>
[F23]: <https://github.com/unimoreinginfo>
[F24]: <https://www.studocu.com/it/quiz/tecnologie-web-parte-1/6357015>
[F25]: <https://www.studocu.com/it/course/universita-degli-studi-di-modena-e-reggio-emilia/tecnologia-della-comunicazione/1705590>
[F26]: <https://www.docsity.com/it/universita/it/alma-mater-studiorum-universita-di-bologna-unibo/esami/programmazione-e-tecnologie-web-unibo/>
[F27]: <https://moodle.unimore.it/course/view.php?id=18403>
