# R1 — Ricerca competitor: siti/app di studio con knowledge graph, percorsi e ripasso

> **Ruolo:** worker R1 (solo ricerca, nessun codice modificato). **Data verifica URL:** 27 ottobre 2026.
> **Metodo:** ho letto prima `docs/MATERIALE_UTENTE.md`, `docs/DIDATTICA.md`, `docs/SYLLABUS.md`, `docs/NODES.md`, `docs/CONTRACTS.md`, `docs/STATUS.md`, `web/ARCHITECTURE.md` e lezioni di esempio (`graph/lezioni/http-stateless-vs-stateful.json`, `graph/lezioni/rest-metodi-http.json`), e ho ispezionato `graph/graph.json`, `graph/quiz.json` e i moduli `web/` per la baseline (sezione 3.0). Ogni competitor è stato verificato aprendo davvero le pagine ufficiali citate (homepage, help center, documentazione o blog ufficiale). Non ho creato account, non ho installato app, non ho superato paywall: ciò che sta dietro login è dichiarato come limite.
> **Convenzioni:** **FATTO** = affermazione presente sulla pagina ufficiale citata accanto. **IPOTESI/Valutazione R1** = mia inferenza didattica o tecnica, non un dato del vendor. I numeri di marketing presenti sulle homepage (utenti, minuti, recensioni) **non** sono usati come prova di efficacia.

---

## 1. Sintesi in 10 righe

1. Il nostro progetto è già sopra la media dei competitor su struttura didattica della singola lezione (10 punti in `docs/DIDATTICA.md`), grafo dei prerequisiti con percorso topologico, SM-2 vero e simulatore a tempo: nessun competitor analizzato combina *tutte* queste cose su un syllabus d'esame specifico in italiano.
2. Il gap n.1 rispetto a Khan Academy è il **progresso binario** ("studiato sì/no"): Khan usa 5 livelli di padronanza per skill che salgono *e scendono* in base alle risposte, noi una spunta manuale — è la differenza tra "ho letto" e "so rispondere".
3. Il gap n.2 è la **sessione guidata quotidiana**: RemNote (piano dalla data d'esame), Duolingo (ripasso incorporato nel percorso), Brainscape ("Smart Study" interleaved in un tap) e Khan (Mastery Challenge a spirale) decidono *loro* cosa fare oggi; noi lasciamo la scelta allo studente tra grafo, percorso, ripasso e simulatore.
4. Il gap n.3 è il **simulatore**: oggi campiona 12 esercizi a caso e rende anche i quiz a scelta multipla come caselle di testo libero; Quizlet Test, Docsity Quiz e freeCodeCamp insegnano blueprint per argomento, tipi di domanda fedeli e report finale per area.
5. Il gap n.4 è **offline/PWA**: Anki, Obsidian e RemNote funzionano offline per design, web.dev insegna le PWA come corso; noi non abbiamo manifest né service worker e dipendiamo da 7 risorse CDN, quindi senza rete grafo e lezioni non partono.
6. Il gap n.5 è la **portabilità dei dati**: Anki esporta/sincronizza, Obsidian usa formati aperti locali; il nostro progresso vive in chiavi `localStorage` di un solo browser, senza export/import né export del mazzo verso Anki.
7. Sul **grafo** il pattern da copiare non è la "palla di peli" force-directed di Obsidian, ma il suo **grafo locale con profondità regolabile** e la triade di stati di Roadmap.sh (fatto/in corso/saltato), applicati al nostro layout dagre che resta didatticamente superiore perché mostra un ordine.
8. Sulla **memoria** i pattern con evidenza già dichiarata in `docs/DIDATTICA.md` (testing effect, spacing, interleaving) sono implementati meglio dai competitor in tre dettagli che ci mancano: interleaving automatico tra aree nella coda, domande a spirale su skill vecchie, e un limite giornaliero alle carte nuove (il manuale Anki avverte esplicitamente del sovraccarico da troppe carte nuove).
9. MDN, web.dev, freeCodeCamp, Exercism e Odin Project confermano che per le **abilità di codice** (il nostro Gruppo C + tesina da 10 punti) leggere non basta: "Test your skills", playground, workshop guidati e progetti con user story battono la sola lettura degli esempi — da trapiantare in forma minima statica (completion verificabili, snippet JS eseguibili in iframe sandbox).
10. Da **non** copiare: account/backend, classifiche, streak punitive, contenuti generati da AI o caricati dagli utenti (violerebbero la regola "mai inventare" di `docs/CONTRACTS.md`), blocchi duri da skill tree e l'algoritmo FSRS completo (richiede parametri appresi dalla storia dell'utente: il nostro SM-2 trasparente e testato è difendibile in sede di tesina).

---

## 2. Tabella confronti

Legenda: ● presente e centrale · ◐ presente in forma parziale/secondaria · ○ assente o non verificato sulle pagine aperte · — non applicabile. La riga **NOI** è la baseline verificata nel repo (dettagli in 3.0).

| Prodotto | Grafo / percorso | Progresso / mastery | Ripasso spaziato | Quiz / simulazione esame | Codice pratico | Mobile / offline / PWA | Ricerca | Gamification | Apertura dati / export |
|---|---|---|---|---|---|---|---|---|---|
| **NOI (tecweb-kg)** | ● DAG prerequisiti + percorso topo | ◐ spunta binaria + % per area/tempo | ● SM-2 (4 voti) su ~365 carte | ● quiz 18 item + simulatore 2 h | ◐ esempi a passi, non eseguibili | ◐ responsive testato, ○ PWA/offline | ● full-text lezioni, tasto `/` | ◐ serie ripasso soft | ○ solo localStorage |
| Khan Academy | ◐ unità/skill, ○ mappa-grafo attuale* | ● 5 livelli, % mastery corso/unità | ● Mastery Challenge a spirale (>12 h) | ● esercizi, quiz, unit test, course challenge | ◐ corso computing, non approfondito | ○ non verificato | ○ non verificato | ◐ punti mastery | ○ account |
| Roadmap.sh | ● roadmap cliccabili ruolo/skill | ● tracking per nodo (account) | ○ | ◐ quiz/interviste dichiarati nei piani | ◐ progetti collegati alla roadmap | ○ non verificato | ● `Ctrl+K` visibile in pagina | ○ | ◐ contenuti community su GitHub |
| Brilliant | ◐ piano personalizzato del tutor | ● dashboard mastery dichiarata | ◐ practice personalizzata dichiarata | ● mastery assessments dichiarati | ● ambiente coding interattivo dichiarato | ◐ app (recensioni store citate) | ○ | ○ non in evidenza | ○ account |
| MDN Learn + Curriculum | ● moduli Getting started→Core→Extensions | ○ nessun tracking nella Learn aperta | ○ | ● "Test your skills" + Challenges | ● Playground (Play, Reset, soluzione) | ◐ skip link/ricerca in pagina | ● ricerca MDN | ○ | ● esempi su GitHub/ZIP |
| web.dev/learn | ● corsi a moduli sequenziali o liberi | ● "% completed", attività + quiz per corso | ○ | ◐ 1 quiz per corso (es. CSS/PWA) | ◐ articoli con attività | ● insegna PWA; ◐ suo offline non testato | ● ricerca con `/` in pagina | ○ | ○ sign-in per collezioni |
| freeCodeCamp | ● certificazioni a moduli | ● salvataggio con sign-in; quiz di modulo con soglia | ○ | ● quiz 20 domande (18/20), esame finale, 5 progetti | ● editor in-browser, workshop, lab con test | ○ non verificato | ○ non verificato | ◐ challenge del giorno | ◐ open source (repo curriculum) |
| Exercism | ● syllabus di concetti, sblocchi per prerequisiti | ● Learning Mode vs Practice Mode | ○ | ◐ esercizi con analisi automatica | ● editor in-browser + CLI locale + mentoring | ◐ codice locale via CLI | ○ non verificato | ○ | ○ account |
| The Odin Project | ● Foundations → 2 path ordinati | ◐ ordine consigliato esplicito | ○ | ○ non in evidenza sulle pagine aperte | ● progetti portfolio lungo il percorso | ○ non verificato | ○ non verificato | ○ | ◐ curriculum con risorse curate esterne |
| Anki | ○ mazzi/sottomazzi, non grafo | ● statistiche, limiti giornalieri | ● SM-2 **e** FSRS (desired retention) | ◐ filtered deck/cramming da manuale | — | ● desktop/mobile, sync AnkiWeb | ● ricerca nel manuale (browser carte) | ○ | ● import/export pacchetti e testo |
| Quizlet | ◐ set di studio, non grafo | ● Learn: piano per familiarità | ◐ dichiarata in homepage/app* | ● Test multimodale; Match a tempo | — | ◐ app mobile citate in homepage | ● libreria di set altrui | ● Live, Match con punteggi | ◐ set condivisi da utenti |
| RemNote | ◐ note collegate + tabelle/database | ● mastery tracking per topic dichiarato | ● carte che "risalgono al momento ottimale" | ● practice quiz per sezione | — | ● app desktop/mobile + offline dichiarato | ○ non verificato | ○ | ◐ importa da PDF/doc/slide (AI) |
| Brainscape | ◐ classi/mazzi (Knowledge Genome) | ● confidence 1–5, tempo stimato residuo | ● algoritmo su confidence rating | ◐ flashcard come retrieval | — | ◐ mobile in evidenza | ● libreria per soggetti | ● leaderboard, streak, reminder | ◐ import liste/banche domande |
| Obsidian | ● Graph view globale + **locale con profondità** | ○ (è un editor, non un tutor) | ○ nel core verificato | ○ | — | ● file locali, accesso offline | ● Search, gruppi-colore da query | ○ | ● Markdown locale, formati aperti |
| Duolingo | ● path lineare (ex albero skill) | ● livelli sbloccati nel path | ● spacing incorporato nel path | ● Legendary challenge per unità | — | ● app iOS/Android linkate | ○ | ● punti, quest, sfide mensili | ○ account |
| Docsity (Italia) | ○ documenti per università/professore | ◐ progressi quiz salvabili (account) | ○ | ● quiz per materia con argomenti/domande | ◐ video corsi con prove svolte | ◐ app AI linkata in homepage | ● ricerca documenti/università | ● punti download, Premium | ○ contenuti UGC a punti |
| Wikidata (infrastruttura, **non** app di studio) | ● grafo di entità (item/proprietà) interrogabile SPARQL | — | — | — | ◐ SPARQL query service | ◐ export formati standard | ● query service | — | ● CC0, linked open data |

\* Le celle marcate e i limiti sono spiegati nelle schede (sezione 3) e in "Cosa non ho trovato" (3.17). "Non verificato" **non** significa "assente nel prodotto": significa che non l'ho visto sulle pagine ufficiali che ho aperto senza account.

---

## 3. Analisi dettagliata con evidenze

### 3.0 Baseline: il nostro progetto oggi (FATTI dal repo)

Per confrontare onestamente serve fissare cosa **già abbiamo**, verificato in `graph/graph.json`, `graph/quiz.json`, `web/index.html`, `web/js/`, `web/modules/`:

- **Contenuti:** 40 nodi con 40 lezioni (`graph/lezioni/*.json`), 6 aree, Gruppi A=21/B=8/C=11, 25 archi di prerequisito (20 hard, 5 soft), 43 esercizi svolti nei nodi, tempo totale stimato 1.890 minuti (31,5 h, coerente con `docs/PIANO_STUDIO.md`). Ogni lezione segue i 10 punti di `docs/DIDATTICA.md` (perché ti serve, scenario fil rouge, definizione d'esame in 3 punti, spiegazione a blocchi, analogia con limite, worked example → completion problem → esercizio autonomo, errori/trappole con distrattori fuori contesto, mnemonica, richiamo attivo, riepilogo + flashcard + checklist "so fare/so dire").
- **Grafo:** Cytoscape + dagre da CDN (`web/index.html`), colore=area, forma=tipo, dimensione=priorità, archi hard pieni/soft tratteggiati, clic = chiusura dei prerequisiti (`web/js/core/prereq-path.js`), minimappa, lista testuale alternativa su mobile (`web/js/ui/graph-mobile-list.js`).
- **Percorso/progresso:** ordine topologico di Kahn coerente Python/JS (`web/js/core/topo.js`, `scripts/kg.py`), spunte in `localStorage`, badge "prerequisiti mancanti" (avviso **morbido**: la lezione si apre comunque), progresso per area con tempo residuo (`web/js/core/progress.js`), "Riprendi / prossima da studiare", "✓ Segna come studiato e vai alla prossima".
- **Ripasso:** mazzo costruito solo dai dati del grafo (domande di richiamo attivo + flashcard + punti checklist; replicando la logica di `web/modules/ripasso/mazzo.js` risultano **365 carte**), algoritmo SM-2 puro e testato con 4 voti e anteprima "tra X giorni" (`web/modules/ripasso/sm2.js`), filtri area/priorità, statistiche (dovute oggi, nuove, serie di giorni, % padronanza). La coda però è ordinata per ritardo poi **priorità → area → nodo** (`codaStudio`): è pratica "a blocchi" per area, non interleaving.
- **Quiz/simulatore:** banca separata di 18 elementi (12 scelta multipla, 6 abbinamenti con distrattori plausibili/fuori contesto, 3 per area, ognuno con spiegazione e `nodo_id`; `docs/QUIZ_FORMAT.md`). Simulatore 120 minuti con pausa/riprendi e confronto "tua risposta vs soluzione" (`web/modules/simulatore/`), volutamente **senza punteggio inventato**; però `generaProva` mescola causalmente l'intero pool e prende i primi 12 (nessun bilanciamento per area/gruppo/tipo) e la vista rende **ogni** esercizio con una `<textarea>`: anche gli item quiz perdono le opzioni cliccabili.
- **Ricerca:** full-text su tutto il testo delle lezioni con normalizzazione degli accenti e scorciatoia `/` (`web/js/core/search.js`, `web/js/core/filters.js`); filtri area/tipo/priorità/testo/solo-non-completati.
- **Accessibilità/mobile:** skip link, ruoli tab/tabpanel, ~45 attributi ARIA nelle viste, tema chiaro/scuro con contrasto AA verificato da test (`web/tests/theme.test.js`), `prefers-reduced-motion`, viewport e2e Playwright 390×844. Il grafo resta però un `<canvas>` con `role="img"` ed etichetta generica.
- **Assenze verificate (grep nel repo):** nessun `manifest`, nessun service worker, nessuna esportazione/importazione dei dati utente, nessun limite giornaliero di carte nuove, nessuna data d'esame/piano giornaliero, nessun livello di padronanza per nodo, nessuna stampa ottimizzata. Le 7 dipendenze CDN in `web/index.html` (Cytoscape, dagre, cytoscape-dagre, marked, DOMPurify, highlight.js + CSS) sono richieste a ogni caricamento.

**Valutazione R1:** didatticamente siamo già "il competitor da battere" sul singolo contenuto; perdiamo su *orchestrazione nel tempo* (mastery, piano giornaliero, interleaving, report d'errore) e su *robustezza d'uso reale* (offline, portabilità, accessibilità del grafo).

### 3.1 Khan Academy — mastery learning

- **FATTI:** la homepage dichiara "Practice and mastery-based learning", feedback immediato e percorso al proprio ritmo ([khanacademy.org](https://www.khanacademy.org/)). L'help center descrive 5 livelli per skill — *Not started, Attempted, Familiar, Proficient, Mastered* — che cambiano (su **e giù**) in base alle attività (esercizi, quiz, unit test, course challenge); la *Course/Unit Mastery %* conta solo le skill a *Proficient* o *Mastered*, con esempio numerico esplicito (5 skill su 20 = 25%) ([support.khanacademy.org — Course and Unit Mastery](https://support.khanacademy.org/hc/en-us/articles/115002552631-What-are-Course-and-Unit-Mastery)). Le *Mastery Challenge* sono ripasso a spirale personalizzato: 6 domande su 3 skill (2 per skill), sbloccate solo dopo >12 h dall'ultima e con almeno 3 skill *Familiar* e 1 *Proficient*; 2 giuste = sali, 2 sbagliate = scendi, 1+1 = resti ([support.khanacademy.org — Mastery Challenges](https://support.khanacademy.org/hc/en-us/articles/360037127892-What-are-Mastery-Challenges-in-course-mastery)).
- **Cosa funziona per la memoria:** la mastery è *evidence-based* (risposte, non dichiarazioni) e il ripasso è distanziato e mescolato per costruzione. È l'esatto opposto della spunta "studiato".
- **Limiti per noi:** sulle pagine aperte **non** ho trovato una "knowledge map" a grafo attuale (vedi 3.17): il modello è corso → unità → skill. Richiede account e una banca esercizi grande per skill.
- **Trapiantabile statico:** SÌ, in piccolo: 40 nodi, segnali già presenti (quiz per nodo, voti SM-2 aggregati per nodo, checklist, esercizi del simulatore) bastano per 4-5 livelli calcolati da funzioni pure.

### 3.2 Roadmap.sh — mappe di ruolo/skill

- **FATTI:** la homepage si presenta come "community created roadmaps, guides, and courses" con decine di roadmap per ruolo/skill e ricerca rapida `Ctrl+K` ([roadmap.sh](https://roadmap.sh/)). La pagina di una roadmap (es. Frontend) la descrive come "step by step guide" con progetti collegati e invito a tracciare il progresso ([roadmap.sh/frontend](https://roadmap.sh/frontend)). La pagina *About* dichiara che le roadmap sono interattive ("click and get resources"), curate dalla community, con possibilità di "track your progress as you follow a roadmap" ([roadmap.sh/about](https://roadmap.sh/about)).
- **Cosa funziona:** orientamento ("cosa imparo dopo?"), pannello del nodo con risorse, stato personale sulla mappa. **IPOTESI R1:** è una mappa di *copertura*, non un sistema di memorizzazione: nessun ripasso spaziato né verifica dell'apprendimento è descritto nelle pagine aperte; segnare "fatto" un nodo resta auto-dichiarato.
- **Limiti per noi:** ampiezza (carriere intere) vs profondità d'esame; contenuti ridotti a link esterni, l'opposto delle nostre lezioni autosufficienti vietate-rimandi da `docs/CONTRACTS.md`.
- **Trapiantabile statico:** stati multipli sul nodo, `% completata` sempre visibile sulla mappa, palette `Ctrl+K`.

### 3.3 Brilliant — tutor interattivo visivo

- **FATTI:** la homepage attuale presenta "Koji, your personal tutor": canvas interattiva condivisa, domande guida e hint invece della risposta, tracciamento di ciò che è padroneggiato/perso con piano costruito sulle lacune, dashboard in tempo reale, *mastery assessments* regolari con pratica mirata in caso di errore, ambiente di coding interattivo per CS ([brilliant.org](https://brilliant.org/)).
- **Cosa funziona per la memoria (dichiarato):** mai dare la risposta, hint graduati, valutazione di padronanza ricorrente. **Limite della mia verifica:** non ho potuto provare una lezione dall'interno; la meccanica fine dei corsi interattivi **non è verificata** da me (vedi 3.17).
- **Trapiantabile statico:** NO il tutor AI (backend/LLM); SÌ il principio già nostro "passi svelati uno alla volta, prova prima da solo" (`web/js/ui/lesson-view.js`) esteso a hint graduati nel completion problem.

### 3.4 MDN Learn + MDN Curriculum — riferimento + percorso

- **FATTI:** *Learn web development* è "a structured set of tutorials" da beginner a "comfortable", con moduli *Getting started / Core / Extensions* e sezione **Test your skills**: articoli frequenti su una singola feature (es. box model) e *Challenges* che combinano più feature; pulsante **Play** che apre il codice nel MDN Playground, **Reset** in caso di errore, soluzione consultabile in fondo; esempi scaricabili da GitHub anche come ZIP ([developer.mozilla.org — Learn](https://developer.mozilla.org/en-US/docs/Learn_web_development)). Il **Curriculum** separa il *cosa* (skill essenziali, self-paced, gratuito) dal *come*, con moduli numerati e descrizioni "al termine saprai…" ([developer.mozilla.org — Curriculum](https://developer.mozilla.org/en-US/curriculum/)).
- **Cosa funziona:** verifica immediata e manipolabile del codice dopo ogni unità; separazione reference/percorso (noi la abbiamo già: scheda nodo vs lezione).
- **Limiti per noi:** nessun progresso/mastery/ripasso sulle pagine aperte; è documentazione, non preparazione a un esame con gruppi A/B/C.
- **Trapiantabile statico:** SÌ in miniatura: snippet JS/HTML/CSS eseguibili in `<iframe sandbox srcdoc>` e completion con verifica, per i nodi abilità del Gruppo C.

### 3.5 web.dev/learn — corsi Google con progresso e quiz

- **FATTI:** la vetrina *Learn* elenca corsi per argomento (HTML, CSS, JavaScript, Accessibility, PWA, Testing…) da seguire "sequentially, or dip into the topics" ([web.dev/learn](https://web.dev/learn)). La pagina del corso CSS mostra "39 activities • 1 quiz" e "0% completed" con moduli numerati e check ([web.dev/learn/css](https://web.dev/learn/css)). Il corso PWA dichiara 25 attività + 1 quiz e capitoli dedicati a service worker, Cache Storage API, offline data, manifest e installabilità ([web.dev/learn/pwa](https://web.dev/learn/pwa)).
- **Cosa funziona:** granularità fine (un modulo = un'idea, come le nostre lezioni a blocchi), progresso visibile per corso, quiz di chiusura. È anche la nostra fonte tecnica autorevole per diventare PWA.
- **Limiti per noi:** orientato a chi lavora sul web, non a un esame; progresso legato all'account Google (sign-in e "collections" in pagina).
- **Trapiantabile statico:** conteggio attività per area + quiz di fine area; soprattutto la ricetta PWA (manifest + SW + cache) senza framework.

### 3.6 freeCodeCamp — certificazioni project-based con esame

- **FATTI:** la pagina curriculum elenca certificazioni (Responsive Web Design, JavaScript, Python, Back-End/APIs…) con invito "Sign in to save your progress" e *coding challenge of the day* ([freecodecamp.org/learn](https://www.freecodecamp.org/learn)). L'annuncio ufficiale della certificazione Python descrive la struttura a moduli: lezioni con 3 domande di comprensione finali, *workshop* guidati passo-passo, *lab* con user story e test da superare, pagina di *review* dei concetti, quiz da 20 domande con soglia 18/20, 5 progetti di certificazione che abilitano all'esame, editor Python che gira nel browser ([freecodecamp.org/news](https://www.freecodecamp.org/news/freecodecamps-new-python-certification-is-now-live/)).
- **Cosa funziona:** fading identico al nostro (teoria → guidato → autonomo con test) ma **verificato automaticamente**, soglia di modulo esplicita, progetto finale come prova di competenza (= la nostra tesina).
- **Limiti per noi:** scala enorme e account; l'esame certificativo richiede ambiente dedicato, fuori portata e fuori tema.
- **Trapiantabile statico:** la "review page" di fine modulo (≈ il nostro riepilogo per area), soglia trasparente per dichiarare un'area "pronta", user story spuntabili per il nodo tesina.

### 3.7 Exercism — syllabus di concetti con sblocchi

- **FATTI:** la homepage promette esercizi di coding con analisi automatica del codice, editor in-browser per tutti i linguaggi offerti, uso locale via CLI e mentoring umano gratuito ([exercism.org](https://exercism.org/)). La documentazione ufficiale spiega gli sblocchi: nei track con *Learning Exercises* completare un esercizio sblocca i successivi (*Learning Mode*, default); in *Practice Mode* tutto è sbloccato dall'inizio, e si può cambiare modalità dal track ([exercism.org/docs — Unlocking Exercises](https://exercism.org/docs/building/product/unlocking-exercises)).
- **Cosa funziona:** i prerequisiti sono **concetti**, non pagine: la mappa dei concetti è il syllabus. La doppia modalità risolve il conflitto guidato/libero.
- **Limiti/cautele:** la stessa documentazione avverte che gli utenti di ritorno possono trovare esercizi prima aperti ora **bloccati** in Learning Mode: prova che il lock duro è rischioso per chi ripassa mirato prima dell'esame.
- **Trapiantabile statico:** toggle esplicito "Percorso guidato / Esplora liberamente" che cambia solo *evidenziazione* e ordine consigliato, mai l'accesso alle lezioni.

### 3.8 The Odin Project — curriculum curato e progetti

- **FATTI:** il modello dichiarato è *Learn* (tutorial/blog/corsi esterni selezionati "in a logical order"), *Build* (decine di progetti da portfolio lungo il cammino), *Connect* (community) ([theodinproject.com](https://www.theodinproject.com/)). La struttura è *Foundations* comune, poi due *path* (Full Stack JavaScript, 7 corsi; Full Stack Ruby on Rails, 8 corsi) i cui corsi "should be taken in the order that they are displayed" ([theodinproject.com/paths](https://www.theodinproject.com/paths)).
- **Cosa funziona:** una sola scelta iniziale (il path), poi zero decision fatigue; il progetto come verifica. **IPOTESI R1:** per la *memorizzazione* di definizioni d'esame non aggiunge nulla rispetto a MDN (nessun ripasso/quiz in evidenza sulle pagine aperte); il valore è la curatela dell'ordine.
- **Trapiantabile statico:** già nostro (percorso unico). Da copiare solo il "ramo finale = progetto" reso più visibile: i 5 nodi di Area 6 come traguardo esplicito del percorso.

### 3.9 Anki — il riferimento del ripasso spaziato

- **FATTI:** il sito lo definisce un programma di flashcard che fa "spend more time on challenging material, and less on what you already know", con sync gratuita AnkiWeb tra dispositivi, media nelle carte, personalizzazione dei tempi di review, add-on e versioni desktop/mobile ([apps.ankiweb.net](https://apps.ankiweb.net/)). La FAQ ufficiale dichiara due algoritmi da Anki 23.10: SM-2 (con differenze documentate: 4 scelte di risposta, learning step configurabili, bonus per le risposte in ritardo ma ricordate, nessuna "punizione" dell'ease in fase di apprendimento) e **FSRS**, basato su Retrievability/Stability/Difficulty stimate dalla storia delle review con machine learning; con FSRS l'utente sceglie la *desired retention* e, a parità di ritenzione, fa meno review che con l'algoritmo di default ([docs.ankiweb.net — What spaced repetition algorithm](https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm)). Il manuale delle opzioni mazzo documenta i **limiti giornalieri** (nuove carte/giorno, max review/giorno) e avverte che introdurre troppe carte nuove travolge di review nei giorni seguenti ([docs.ankiweb.net — Deck Options](https://docs.ankiweb.net/manual/deck-options)).
- **Cosa funziona:** è lo standard di fatto; il nostro SM-2 (`web/modules/ripasso/sm2.js`) è già allineato nelle scelte chiave (4 voti, EF clampato).
- **Cosa non copiare / cautela:** FSRS completo richiede parametri appresi dalla storia personale: con ~365 carte e poche settimane all'esame, **IPOTESI R1** il guadagno non giustifica una scatola nera indifendibile in tesina. Invece: limite giornaliero carte nuove, previsione del carico dai dati di scadenza che già salviamo, ed **export del mazzo** per chi vuole continuare in Anki (import da file di testo/pacchetti è documentato nel manuale).
- **Nota accessibilità/offline:** app installata = offline nativo; è il benchmark che la nostra PWA deve avvicinare.

### 3.10 Quizlet — set di studio multimodali

- **FATTI:** la homepage promette di trasformare appunti in guide, flashcard, practice test e giochi, con ripassi rapidi "on the go" ([quizlet.com](https://quizlet.com/)). La pagina ufficiale delle modalità descrive: **Learn** (piano personalizzato sulla familiarità; domande flashcard/scelta multipla/scritte, con i tipi più difficili che diventano più frequenti man mano che rispondi giusto), **Test** (simula come andresti a un test in classe, tipi configurabili), **Flashcards** (shuffle, text-to-speech), **Match** (abbinamento contro il tempo con punteggi), **Quizlet Live** (gioco di classe a squadre) ([quizlet.com — Study Modes](https://quizlet.com/gb/features/study-modes)).
- **Cosa funziona per la memoria:** progressione di difficoltà *dentro la sessione* (riconoscimento → produzione scritta) e generazione di un test dai propri materiali.
- **Cosa non funziona / cautele:** Match premia la velocità, antitetica alla "regola dei 3 punti" delle nostre risposte aperte; la qualità dipende dai set creati dagli utenti (**IPOTESI R1** da modello UGC dichiarato: "flashcards created by other students" in homepage). Sulle pagine che ho aperto **non** documento un algoritmo di spacing tra giorni: non lo affermo né lo nego (vedi 3.17).
- **Trapiantabile statico:** nel simulatore, tipi di item configurabili e difficoltà crescente riutilizzando `graph/quiz.json` (scelta multipla → abbinamento → aperta breve).

### 3.11 RemNote — note + flashcard + data d'esame

- **FATTI:** la homepage dichiara: flashcard auto-generate per ripetizione spaziata da PDF/slide/documenti, practice quiz sezione per sezione, riassunti, **Mastery Tracking** per topic, **Exam Scheduler** ("Set your exam date and we'll tell you exactly what to study each day"), carte che "resurface at the optimal time", image occlusion e altri tipi di carta, app desktop/mobile e funzionamento offline con sync al ritorno online ([remnote.com](https://www.remnote.com/)).
- **Cosa funziona:** è l'unico che unisce esplicitamente *data d'esame → piano giornaliero*, ed è esattamente il nostro caso d'uso (scritto + tesina con tempo limitato, `docs/MATERIALE_UTENTE.md` sezione 3).
- **Cosa non copiare:** generazione AI di carte/quiz dai PDF (rischio allucinazioni; i nostri contenuti sono contratti verificati in `docs/CONTRACTS.md`) e l'editor di note generalista (noi abbiamo già le lezioni).
- **Trapiantabile statico:** campo "data dell'appello" in `localStorage` + ritmo richiesto = tempo residuo (`web/js/core/progress.js`) diviso per i giorni rimasti, con avviso onesto "a questo ritmo non copri il Gruppo A".

### 3.12 Brainscape — confidence-based repetition

- **FATTI:** la homepage dichiara apprendimento con ripetizione spaziata, libreria organizzata in classi/mazzi ("Knowledge Genome"), creazione rapida di carte anche con AI e import di liste/banche domande ([brainscape.com](https://www.brainscape.com/)). La pagina sul metodo spiega il ciclo: richiamo attivo → rivela la risposta → **autovalutazione di confidenza 1–5** (metacognizione) → l'algoritmo ripropone la carta "right before you'd forget it"; dichiara inoltre checkpoint di progresso, metrica "Estimated Time Left", pulsante **Smart Study** che mescola materie in interleaving con un tap, streak giornaliera, promemoria e leaderboard ([brainscape.com/spaced-repetition](https://www.brainscape.com/spaced-repetition)).
- **Cosa funziona:** la confidenza esplicita è la versione flashcard del nostro voto SM-2 a 4 livelli: siamo già vicini. Originali e utili: tempo residuo stimato e interleaving "a un tap".
- **Cosa non copiare:** leaderboard e "peer pressure" dichiarate come leva: per uno studente singolo pre-esame sono rumore; la streak va tenuta come informazione, non come minaccia.
- **Nota di metodo:** i numeri in pagina (utenti/ore risparmiate/studi) sono claim del vendor: li ho letti ma non li uso come evidenza.

### 3.13 Obsidian — grafo delle note (non un tutor)

- **FATTI:** la homepage dichiara note salvate **localmente** sul dispositivo, accessibili rapidamente anche offline, in formati aperti ("You own your data"), con *Links* tra note e *Graph* per visualizzare le relazioni ([obsidian.md](https://obsidian.md/)). La documentazione della Graph view precisa: cerchi=note, linee=link interni, dimensione del nodo cresce con le note che lo referenziano; hover evidenzia le connessioni, clic apre la nota; zoom con rotella o tasti `+`/`-`, spostamento con frecce (Shift = più veloce); impostazioni per filtri, **gruppi** colorati definiti da una ricerca, frecce di direzione, soglia di dissolvenza delle etichette, forze del layout; **Local Graph** che mostra solo le note connesse alla nota attiva con **profondità regolabile** via slider ([obsidian.md/help — Graph view](https://obsidian.md/help/plugins/graph)).
- **Cosa funziona:** esplorazione e sense-making; il grafo locale riduce il sovraccarico cognitivo. **Cosa non è:** un percorso di apprendimento (nessun ordine, prerequisito, verifica o ripasso nel core verificato) — il layout a forze non comunica "prima questo, poi quello".
- **Trapiantabile statico:** grafo locale con profondità 1/2/tutto attorno al nodo selezionato, backlink testuali ("questi nodi ti usano come prerequisito" — abbiamo già `successors()` in `web/js/core/topo.js`), navigazione da tastiera del grafo.

### 3.14 Duolingo — dal skill tree al path lineare

- **FATTI:** la homepage dichiara lezioni brevi con punti e livelli sbloccabili, apprendimento personalizzato e meccaniche di gioco con promemoria ([duolingo.com](https://www.duolingo.com/)). Il blog ufficiale sul redesign spiega il passaggio dal vecchio albero di skill (5 crown level + Legendary per skill) al **path lineare**: un livello del path = un crown level, ma i livelli di skill diverse sono **interspersed**; l'ordine è fondato sulla ripetizione spaziata, la *practice è incorporata nel path* (non devi tornare indietro alle skill "incrinate"), Stories e guidebook per unità entrano nel flusso ([blog.duolingo.com — new home screen](https://blog.duolingo.com/new-duolingo-home-screen-design/)).
- **Cosa funziona per la memoria:** la spaziatura non è una scheda separata che lo studente può ignorare: è l'ordine stesso del percorso.
- **Cosa non copiare:** linearità totale (noi dobbiamo permettere il ripasso mirato per gruppo/area), punti/quest/sfide come fine, qualsiasi penalità. Da copiare solo il principio: inserire nel percorso, a intervalli, richiami di nodi già fatti.

### 3.15 Docsity — preparazione esami universitari italiana (UGC)

- **FATTI:** la homepage italiana organizza l'offerta attorno a "Prepara i tuoi esami": ricerca documenti, ricerca per università, video corsi con "lezioni e prove svolte basate sui programmi universitari", quiz con domande d'esame, mappe mentali AI, domande/risposte della community; dichiara materiali condivisi dagli studenti e un'economia a **punti** per scaricare (punti guadagnati aiutando o con piano Premium) ([docsity.com/it](https://www.docsity.com/it/)). La pagina Quiz presenta quiz per materia creati da "Content Expert", indicando per ciascuno argomenti e numero di domande, con invito a registrarsi per salvare i progressi ([docsity.com/it/quiz](https://www.docsity.com/it/quiz/)).
- **Cosa funziona (contesto italiano):** aggancio per *ateneo/corso/professore* e prove reali: è il bisogno che il nostro Gruppo A/B/C soddisfa in forma strutturata. Dimostra la domanda di "domande vere + a che punto sono".
- **Cosa non copiare:** contenuti caricati dagli utenti senza verifica (copyright e affidabilità), punti/premium, distribuzione di appunti altrui. Il nostro posizionamento opposto — 40 nodi, fonti verificate con `scripts/check_urls.py`, spiegazioni per ogni distrattore — è il vantaggio da difendere.

### 3.16 Wikidata/Wikipedia — infrastruttura di knowledge graph, non app di studio

- **FATTI:** Wikidata si definisce "free and open knowledge base that can be read and edited by both humans and machines", archivio centrale dei dati strutturati dei progetti Wikimedia, con contenuti in licenza libera, esportabili in formati standard e interlinkabili come linked open data; dalla pagina principale si accede al **SPARQL query service** ([wikidata.org — Main Page](https://www.wikidata.org/wiki/Wikidata:Main_Page)).
- **Valore per noi:** non è un competitor di studio (nessun prerequisito didattico, quiz o progresso), ma è il *laboratorio reale* del nostro nodo Gruppo A `sparql-query-esempi`: linkare le query d'esempio della lezione al query service (solo link in uscita, nessuna chiamata live da integrare) rende il Web semantico manipolabile invece che solo definibile — materiale spendibile anche in tesina.

### 3.17 Cosa non ho trovato / non ho potuto verificare (dichiarazione esplicita)

1. **Khan Academy "knowledge map":** sulle pagine ufficiali attuali aperte non ho trovato una mappa a grafo delle conoscenze come interfaccia di studio corrente; il sistema documentato è mastery per unità/skill. Non affermo che non sia mai esistita né che non esista altrove nel prodotto: semplicemente non la propongo come modello verificato.
2. **Prodotto Wikimedia di "learning graph"** (prerequisiti + percorso + quiz costruito su Wikipedia/Wikidata): non trovato tra le pagine ufficiali aperte. Esiste l'infrastruttura dati (3.16), non un'app di studio ufficiale.
3. **Interno dei prodotti con account** (Brilliant, RemNote, Quizlet, Exercism, Roadmap.sh personalizzato): meccaniche fini, qualità reale degli item, comportamento mobile e offline effettivo **non testati**; ho usato solo pagine pubbliche ufficiali.
4. **Conformità WCAG dichiarata** dei competitor: non verificata (ho osservato solo segnali in pagina, es. skip link su MDN/web.dev/Khan). Nessun giudizio di conformità è espresso in questo documento.
5. **Prezzi e limiti dei piani** (freemium/premium): non confrontati perché variabili nel tempo e irrilevanti per una web app statica gratuita; dove incidono sulle UX (punti Docsity) li cito come modello, non come listino.
6. **Piattaforma istituzionale UNIMORE del corso** (eventuale pagina docente/Moodle): non confrontata; `docs/SYLLABUS.md` dichiara già che programma ufficiale, docente e formato d'esame "Tecnologie Web" non sono stati trovati e che scritto 23 pt + tesina 10 pt è un'**ipotesi** dal materiale utente. Le raccomandazioni sotto rispettano questa incertezza: nessuna proposta introduce punteggi "ufficiali".
7. **Prove di efficacia numeriche** dei competitor: non ho usato i numeri promozionali delle homepage come evidenza didattica; le uniche basi cognitive richiamate sono quelle già assunte dal progetto in `docs/DIDATTICA.md` (Dunlosky, Sweller, Mayer, Bjork, Roediger-Karpicke, spacing/SM-2).

---

## 4. Lista prioritizzata di miglioramenti concreti (statici, vanilla JS, GitHub Pages)

> Ordine = rapporto (impatto su voto × probabilità di uso reale) / sforzo. Sforzo: **S** ≤ ½ giornata, **M** 1–3 giorni, **L** > 3 giorni o contenuti nuovi. Ogni voce è realizzabile senza backend: solo `graph/*.json` già esistenti, funzioni pure in `web/js/core/` o moduli via registry (`web/modules/registry.js`), `localStorage`, test `node --test`. Nessuna voce richiede di modificare i contratti `graph/` salvo dove indicato esplicitamente.

### P1 — Livelli di padronanza per nodo invece della sola spunta (da Khan Academy) · **M**

- **Cosa:** derivare per ogni nodo un livello calcolato — `non-iniziato / visto / familiare / sicuro / padroneggiato` — da segnali già presenti: esiti dei quiz collegati (`nodo_id` in `graph/quiz.json`), stato SM-2 aggregato delle carte del nodo (già calcolabile con `web/modules/ripasso/statistiche.js`), checklist "so fare/so dire" completate, spunta percorso. Il livello può **scendere** se un quiz successivo va male (come Khan). Mostrarlo come etichetta testuale + icona (mai solo colore) in percorso, dettagli, grafo; aggiungerlo ai filtri ("solo non padroneggiati").
- **Dove:** nuovo `web/js/core/mastery.js` (funzione pura, testabile), persistenza segnali minimi in una chiave versionata in `web/js/config.js` (`STORAGE_KEYS`), integrazione in `web/js/core/progress.js`, `web/js/ui/path.js`, `web/js/ui/graph-view.js`, `web/js/ui/details.js`; test in `web/tests/mastery.test.js`. La spunta manuale resta come segnale debole "visto", non viene rimossa.
- **Perché aiuta il 30 e lode:** `docs/MATERIALE_UTENTE.md` stima ~65% dello scritto dal Gruppo A con definizioni da *memorizzare*; la spunta misura l'esposizione, non la capacità di risposta (illusione di competenza). Con la mastery lo studente vede quali dei 21 nodi A sono davvero a *sicuro/padroneggiato* e il "% padronanza Gruppo A" diventa la metrica onesta verso 20–22/23 allo scritto.

### P2 — "Sessione di oggi": piano giornaliero guidato con data d'esame e interleaving (da RemNote + Duolingo + Brainscape) · **M**

- **Cosa:** una CTA in home che compone in modo **deterministico e testabile** la sessione: (a) carte dovute di oggi (riusa `codaStudio`), (b) il prossimo nodo del percorso topologico non padroneggiato con prerequisiti hard soddisfatti (riusa `topoOrder` + `nextToStudy`), (c) 3–6 item di richiamo a spirale su nodi già visti di **aree diverse** (round-robin per area, mai due carte dello stesso nodo consecutive), entro un budget scelto (25/50/90 min). Campo opzionale "data dell'appello": ritmo necessario = tempo residuo di `progress.js` ÷ giorni rimasti, con avviso sobrio se il Gruppo A non è coperto in tempo.
- **Dove:** nuovo modulo `web/modules/oggi/` registrato via `web/modules/avvia.js` (pattern già usato da ripasso/simulatore) oppure funzione pura `web/js/core/session-plan.js` + rendering nel blocco `#resume` di `web/index.html` via `web/js/main.js`; la logica di interleaving va anche in `web/modules/ripasso/mazzo.js` (`codaStudio`) sostituendo l'ordine per blocchi di area con mescolamento controllato a parità di scadenza.
- **Perché aiuta il 30 e lode:** `docs/DIDATTICA.md` prescrive già "ripasso a intervalli (1-3-7-14 gg)" e "interleaving tra aree nei quiz", ma oggi nulla li *orchestra*: Duolingo e Khan dimostrano il pattern "spaziatura dentro il percorso, non in una scheda ignorabile". Con 31,5 h totali e piano in 4 step (`docs/MATERIALE_UTENTE.md`), togliere ogni giorno la domanda "cosa studio?" protegge la copertura completa A→C prima dell'appello.

### P3 — Simulatore con blueprint, item fedeli e report per area (da Quizlet Test + Docsity Quiz + freeCodeCamp) · **M** (report completo **L**)

- **Cosa:** tre interventi in ordine: (1) gli item `scelta_multipla` e `abbinamento` di `graph/quiz.json` diventano **interattivi** (opzioni cliccabili, abbinamenti selezionabili) invece di `<textarea>`; (2) `generaProva` campiona con **stratificazione** (almeno 1 item per area, peso maggiore Gruppo A, mix dichiarato aperte/chiuse/abbinamenti) con seme deterministico per i test; (3) al termine, report per area e gruppo con autovalutazione guidata delle aperte tramite rubrica a spunte "definizione / scopo-vantaggio / esempio" (la regola dei 3 punti) e CTA "Riapri questi nodi" + "Crea carte dagli errori". **Nessun punteggio ufficiale**: si mantiene la scelta onesta attuale, etichettando il risultato come autovalutazione.
- **Dove:** `web/modules/simulatore/genera.js`, `web/modules/simulatore/punteggio.js`, `web/modules/simulatore/view.js`, riuso di `graph/quiz.json` (nessuna modifica al formato); test in `web/tests/simulatore.test.js`.
- **Perché aiuta il 30 e lode:** allena i formati reali dichiarati nel materiale utente (abbinamenti con distrattori fuori contesto, aperte con regola dei 3 punti, 2 ore) e trasforma l'errore in percorso di recupero per nodo: è il feedback immediato e spiegato prescritto da `docs/DIDATTICA.md`, oggi presente nelle lezioni ma non aggregato nel simulatore.

### P4 — PWA offline vera e indipendenza dalle CDN (da web.dev/learn PWA + Anki/Obsidian) · **M** (vendor completo **L**)

- **Cosa:** fase 1: `manifest.webmanifest` (nome, icone da `web/favicon.svg`, tema coerente con `web/js/core/theme.js`) + service worker con precache versionata dell'app shell e di `graph.json`/`quiz.json` prodotti da `web/build.sh`, strategia cache-first per gli asset same-origin e messaggio chiaro "sei offline, stai usando i contenuti salvati". Fase 2: vendorizzare le 7 dipendenze CDN pinned (Cytoscape, dagre, cytoscape-dagre, marked, DOMPurify, highlight.js) in `web/vendor/` con licenze, eliminando i request cross-origin bloccanti.
- **Dove:** nuovi `web/manifest.webmanifest`, `web/sw.js`; registrazione in `web/js/main.js`; link manifest in `web/index.html`; hash di versione generato in `web/build.sh`; test e2e offline in `web/tests/` (Playwright, skip se assente come gli esistenti).
- **Perché aiuta il 30 e lode:** il ripasso SM-2 funziona solo se è quotidiano e ovunque (treno, aula, modalità aereo): oggi senza rete l'app non parte e la serie si rompe. È anche coerenza da esame di Tecnologie Web: service worker, Cache Storage e manifest sono tecnologie web lato client difendibili e dimostrabili in sede di tesina/revisione codice, anche se non risultano come nodo esplicito del syllabus ricostruito.

### P5 — Export/import del progresso ed export del mazzo per Anki (da Anki + Obsidian) · **S**

- **Cosa:** pannello "I tuoi dati" con: (a) esporta in un unico JSON versionato tutte le chiavi `ids-kg:*` (completati, checklist, stato SM-2 di `web/modules/ripasso/store.js`, sessione simulatore, tema, data d'esame) e reimporta con validazione e conferma; (b) "Scarica il mazzo per Anki" come file di testo tab-separated (fronte, retro, tag `area`/`nodo`/`gruppo`) generato da `costruisciMazzo`; (c) in alternativa/incollabile, copia-negli-appunti del riepilogo testuale.
- **Dove:** nuovo `web/js/core/backup.js` + UI minima in `web/js/main.js`/header e pulsante nella vista `web/modules/ripasso/view.js`; test di round-trip in `web/tests/backup.test.js`.
- **Perché aiuta il 30 e lode:** perdere settimane di scadenze SM-2 per un cambio browser/telefono poco prima dell'appello azzera il piano di ripasso; l'export verso Anki dà in più un canale mobile/offline maturo senza costruire sync. Difende il principio "i dati sono dello studente" che Obsidian/Anki rendono esplicito.

### P6 — Diagnostico iniziale "dove sei già forte?" (da Khan course challenge + Quizlet Learn) · **M**

- **Cosa:** test d'ingresso opzionale e annullabile di ~12–18 item: campione **stratificato** dai 18 item di `graph/quiz.json` e dalle domande di richiamo attivo (1–2 per area, priorità alta prima). Esito: propone mastery iniziale *familiare* per i nodi superati (mai *padroneggiato* senza verifica nel tempo) e un percorso accorciato; tutto modificabile a mano. Etichetta onesta: "campione indicativo, non copertura completa".
- **Dove:** riuso del motore quiz di P3; nuovo `web/js/core/diagnostic.js`; ingresso dalla home/`#resume`; scrive solo segnali di mastery (P1).
- **Perché aiuta il 30 e lode:** con 31,5 h di contenuti, ripartire da zero su nodi già noti (es. HTTP di base) ruba tempo ai punti ciechi del Gruppo C e alla tesina da 10 punti; il diagnostico concentra lo sforzo dove il materiale utente indica il maggior ritorno.

### P7 — Completamento verificabile e mini-playground per il Gruppo C (da MDN + freeCodeCamp + Exercism) · **M**

- **Cosa:** (a) il `completion_problem` di ogni lezione diventa compilabile: campi/risposta breve con verifica tollerante (normalizzazione già in `web/js/core/filters.js`) e hint graduati prima della soluzione; (b) per i soli nodi abilità JS/HTML/CSS (`javascript-fetch-async-await`, `ajax-fetch-xhr`, `canvas-api`, `css-box-model`, `dom-virtual-dom`) snippet modificabile eseguito in `<iframe sandbox srcdoc>` isolato, con Reset; (c) per Flask/Git (non eseguibili in browser) verifica a buchi sui template già presenti nelle lezioni (`flask-rotte-jsonify`, `git-comandi-base`). Nessun editor completo, nessuna esecuzione server.
- **Dove:** `web/js/ui/lesson-view.js` (blocchi `completion`/`autonomo`), riuso di `web/js/ui/code-block.js`; eventuale campo opzionale nelle lezioni solo se serve (intervento contenuti separato, contratto invariato per i nodi esistenti).
- **Perché aiuta il 30 e lode:** il Gruppo C è dichiarato "punti ciechi ~15%" da esercitare *praticamente* e alimenta la tesina (Flask CRUD, fetch, Git); worked example → completion → autonomo è già il nostro fading, ma oggi il completion si *legge*: renderlo verificabile chiude il ciclo leggere≠scrivere senza inseguire la scala di freeCodeCamp/Exercism.

### P8 — Grafo locale, stati sul nodo e legenda interattiva (da Obsidian Local Graph + Roadmap.sh) · **S/M**

- **Cosa:** attorno al nodo selezionato: profondità 1 / 2 / tutto; toggle "solo catena dei prerequisiti"; stato del nodo visibile anche sul grafo (mastery P1 come bordo/etichetta, non solo colore); legenda cliccabile (area, tipo, hard/soft, mastery) che applica i filtri esistenti; pulsante "Centra il prossimo da studiare"; backlink nel pannello dettagli: "Sblocca:" con i successori.
- **Dove:** `web/js/ui/graph-view.js`, `web/js/core/prereq-path.js`, `web/js/ui/details.js` (riuso `successors()` di `web/js/core/topo.js`), mini-controlli in `web/index.html` accanto a zoom; il layout resta dagre topologico.
- **Perché aiuta il 30 e lode:** le risposte aperte da 30 richiedono *collegamenti* (es. stateless → cookie → sessioni → REST): il grafo locale rende visibile il perché un prerequisito serve e cosa sblocca, senza la "palla di peli" del grafo globale di 40 nodi su mobile.

### P9 — Palette comandi `Ctrl/Cmd+K` sopra la ricerca esistente (da Roadmap.sh + Obsidian Quick Switcher) · **S**

- **Cosa:** overlay accessibile (ruolo combobox/listbox, frecce+Invio+Esc) che cerca in un unico posto: nodi, titoli di sezione delle lezioni, trappole (`trappole` in `graph/meta.json`/`graph.json`), voci di quiz; risultati recenti; invio apre `#/lezione/<id>` alla sezione giusta riusando `web/js/ui/toc.js`. Scorciatoia esistente `/` mantenuta.
- **Dove:** nuovo `web/js/ui/command-palette.js`, indice costruito in `web/js/data.js` riusando `lessonPlainText` (`web/js/core/search.js`); test in `web/tests/search.test.js`.
- **Perché aiuta il 30 e lode:** nel ripasso finale "PATCH vs PUT?" o "multiplexing trappola" deve costare 3 secondi, non una navigazione tra filtri e schede; aumenta anche l'uso reale delle trappole già scritte e finanziate dai contenuti.

### P10 — Accessibilità completa del grafo (da MDN/web.dev Accessibility + Obsidian tastiera) · **M**

- **Cosa:** equivalente testuale sempre disponibile (toggle "Vista elenco del grafo" che riusa `web/js/ui/graph-mobile-list.js` anche su desktop), navigazione da tastiera tra nodi vicini seguendo gli archi con focus visibile e Invio per aprire, codifica non solo-cromatica per area (etichetta `A1…A6` sui nodi come già nei badge), annuncio `aria-live` sobrio del nodo selezionato; test e2e di navigazione solo-tastiera.
- **Dove:** `web/js/ui/graph-view.js`, `web/js/ui/graph-mobile-list.js`, `web/css/style.css`, `web/tests/test_e2e_*.py`.
- **Perché aiuta il 30 e lode:** `html-form-accessibilita` è un nodo d'esame e la tesina prevede domande di revisione del codice: il sito stesso deve essere la prova. Inoltre rende il grafo (oggi `role="img"` opaco agli screen reader) utilizzabile da tutti, non solo decorativo.

### P11 — Stati `in corso / già so, salto` e modalità guidata/libera morbida (da Roadmap.sh + Exercism) · **S**

- **Cosa:** accanto a "studiato" aggiungere `in corso` e `so già (salto per ora)`; toggle "Percorso guidato" (evidenzia solo nodi con prerequisiti hard soddisfatti) vs "Esplora liberamente" (tutto visibile, come ora). **Mai** bloccare l'apertura di una lezione: si mantiene l'avviso soft attuale.
- **Dove:** estensione di `web/js/core/store.js` (mappa id→stato versionata, migrazione dal Set attuale), `web/js/ui/path.js`, `web/js/core/filters.js`.
- **Perché aiuta il 30 e lode:** chi ripassa mirato (es. solo Web semantico alla vigilia) non deve fingere di aver "completato" i prerequisiti; chi segue il percorso non si perde. Exercism documenta il rischio del lock duro: noi prendiamo la doppia modalità, non il lucchetto.

### P12 — Igiene del ripasso: tetto carte nuove, previsione carico, "carte sanguisuga" (da Anki) · **S**

- **Cosa:** (a) limite configurabile di carte nuove/giorno (default prudente, es. 20) con spiegazione in UI; (b) mini-previsione "prossimi 7 giorni: N carte dovute" calcolata dalle scadenze già salvate; (c) elenco "carte che sbagli sempre" (campo `errori` già presente nello stato SM-2: soglia esplicita, es. ≥3) con CTA verso la lezione e verso "spiega con parole tue". **Niente FSRS**: SM-2 resta l'algoritmo.
- **Dove:** `web/modules/ripasso/mazzo.js`, `web/modules/ripasso/statistiche.js`, `web/modules/ripasso/view.js`, `web/modules/ripasso/store.js`; test in `web/tests/ripasso.test.js`.
- **Perché aiuta il 30 e lode:** 365 carte introdotte troppo in fretta creano il picco di review che il manuale Anki mette esplicitamente in guardia dal creare; il carico prevedibile e le carte-problema isolate proteggono la costanza nelle ultime due settimane, quando la ritenzione del Gruppo A decide lo scritto.

### P13 — Backlink didattici, stampa "ultima settimana" e ponte Wikidata (da Obsidian + Wikidata) · **S**

- **Cosa:** (a) in fondo a ogni lezione: "Ti serve prima" (prerequisiti con motivo, già nei dati) e "Questo sblocca" (successori), più indice inverso dei `collegamenti_interleaving`; (b) CSS `@media print` per una scheda di 1–2 pagine per nodo/area (definizione d'esame, trappole, checklist, flashcard) generata dalla vista esistente; (c) nel solo nodo `sparql-query-esempi`, link in uscita al query service Wikidata con la query d'esempio precompilata (solo link, nessun fetch live).
- **Dove:** `web/js/ui/lesson-view.js`, `web/css/style.css` (sezione print), link come risorsa nella lezione `graph/lezioni/sparql-query-esempi.json` se il worker contenuti lo approva (altrimenti solo link statico generato dalla vista).
- **Perché aiuta il 30 e lode:** i collegamenti espliciti sono ciò che distingue la risposta da 30 (definizione + scopo + esempio + connessione) dal riepilogo; la stampa serve il ripasso senza schermo della vigilia; la query SPARQL reale trasforma un nodo Gruppo A da definizione memorizzata a strumento usato, riutilizzabile nella presentazione della tesina.

---

## 5. Cosa NON copiare (e perché)

1. **Account, backend, sync cloud, profili pubblici** (tutti i competitor maggiori): impossibili in una static app su GitHub Pages e inutili per un singolo studente; il trapianto corretto è export/import locale (P5), non un server.
2. **Classifiche, leghe, "peer pressure", punti/vite/cuori, notifiche colpevolizzanti** (Duolingo, Brainscape leaderboard, Quizlet Live/Match, punti Docsity): ottimizzano il ritorno giornaliero, non la qualità della risposta aperta; la nostra unica gamification difendibile è la padronanza misurata (P1) e la serie come *informazione*. Match contro il tempo va evitato in particolare: premia la velocità di riconoscimento, mentre l'esame premia definizioni esatte e complete.
3. **Contenuti generati da AI o caricati dagli utenti** (RemNote/Quizlet/Docsity AI, set e appunti UGC, generazione automatica di flashcard da PDF): violano la regola cardine di `docs/CONTRACTS.md` ("niente contenuti inventati, risorse verificate") e introducono diritti d'autore e affidabilità non controllabili. Lo stesso vale per **tutor AI/chat** (Brilliant Koji, Khanmigo citato in homepage Khan): senza backend non è fattibile; con backend non è verificabile.
4. **Lucchetti duri da skill tree / path totalmente lineare** (Exercism Learning Mode rigida, Duolingo path): la documentazione Exercism stessa avverte del problema per gli utenti di ritorno; alla vigilia dell'esame lo studente deve poter aprire *subito* il nodo che gli serve. Tenere l'avviso morbido "prerequisiti mancanti" (P11).
5. **FSRS completo o qualsiasi scheduler black-box** (Anki FSRS): richiede stima di parametri dalla storia personale; con 365 carte e orizzonte di settimane è sproporzionato e non spiegabile in revisione codice della tesina. SM-2 puro, testato e con intervalli mostrati in UI resta la scelta corretta (P12 aggiunge solo igiene operativa).
6. **Grafo force-directed libero come vista principale** (Obsidian Graph view globale): bello per scoprire pattern nelle proprie note, ma non comunica ordine né prerequisiti; con 40 nodi diventa decorazione. Da Obsidian si copia il *locale + profondità* (P8), non il layout.
7. **Ampiezza da catalogo** (Roadmap.sh decine di roadmap, librerie infinite di set/mazzi, Docsity per ogni materia): il nostro vantaggio è l'opposto — 40 nodi allineati a un programma e a prove analizzate. Aggiungere argomenti fuori syllabus "per completezza" diluisce il Gruppo A e contraddice `docs/SYLLABUS.md`.
8. **Video-first, editor cloud completi, mentoring umano, certificazioni con esami sorvegliati** (Odin/freeCodeCamp/Exercism nelle loro forme complete): richiedono piattaforme, account e persone; la versione statica sensata è solo il completamento verificabile e lo snippet isolato di P7.
9. **Modelli di business**: piani premium, limiti artificiali alle modalità di studio, punti per scaricare, paywall sui contenuti — incompatibili con uno strumento personale open su GitHub Pages e con l'obiettivo (un esame, non una retention metric).
10. **Metriche di vanità come prova**: utenti registrati, minuti di apprendimento, recensioni a 5 stelle lette sulle homepage non dimostrano che una funzionalità aiuti *questo* esame; ogni trapianto sopra è giustificato da `docs/DIDATTICA.md`, `docs/MATERIALE_UTENTE.md` e dai dati già nel repo, non dal successo commerciale del competitor.

---

*Fine rapporto R1. Nessun file fuori da `docs/research/R1-competitor.md` è stato modificato per questa ricerca; nessun URL è citato senza essere stato aperto il 27 ottobre 2026.*
