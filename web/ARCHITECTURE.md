# Architettura della web app

L'app è statica, in italiano, senza backend né bundler. `index.html` carica
`js/main.js` come composition root; i contenuti arrivano da `graph.json`, copia
creata con `sh web/build.sh` a partire da `graph/graph.json`. Aree e nodi sono
letti dai dati, non da conteggi fissati nel codice.

## Strati

- `js/core/`: logica pura di grafo, filtri, stato, padronanza, sessione e
  backup. Le funzioni che necessitano di storage lo ricevono come dipendenza.
- `js/ui/`: presentazione e callback; i controlli condivisi sono separati dalle
  viste. `js/main.js` collega dati, storage, viste e registro.
- `modules/ripasso/`: mazzo, date, SM-2, persistenza e vista. I risultati del
  simulatore appartengono a X6: l'unica API letta da X5 è `leggiEsiti(storage)`
  in `modules/simulatore/esiti.js`. Finché il file manca, la build lo segnala
  e il caricamento opzionale non impedisce l'uso dell'app. Non si interpreta
  la struttura interna della banca quiz. La banca opzionale è caricata in
  parallelo al grafo: se non risponde, non trattiene le lezioni e il
  simulatore può ripiegare sugli esercizi del grafo.
- `modules/avvia.js` e `modules/registry.js`: navigazione delle viste aggiuntive
  per hash (`#/ripasso`, `#/simulatore`). Le lezioni usano `#/lezione/<id>`;
  `?sezione=richiamo` all'interno dell'hash apre direttamente il richiamo.

## Studio e ripasso

`ids-kg:completati:v1` resta compatibile con le vecchie spunte. La mappa
`ids-kg:stati-studio:v1` migra tali spunte e aggiunge «in corso» e «so già»;
quest'ultimo soddisfa i prerequisiti per i suggerimenti ma non viene marcato
come lezione completata. La modalità guidata evidenzia i nodi suggeriti: non
blocca mai l'apertura delle lezioni.

`mastery.js` deriva cinque livelli dai segnali manuali, dalle carte SM-2 e
dagli esiti X6; le soglie sono spiegate nella vista Progresso e non costituiscono
un voto né una previsione d'esame. Un errore può abbassare il livello. La
sessione giornaliera usa gli stessi dati, l'ordine topologico, la data facoltativa
e le stime presenti nei nodi. Il tempo scelto è indicativo: non si assume una
durata delle carte.

La chiave storica `ids.ripasso.v1` conserva carte, scadenze e limite di nuove
carte, globale per giorno e persistente fra filtri e riaperture. Le scadute
non sono limitate; a parità di scadenza/priorità la coda alterna aree e nodi.
Il retro delle checklist è il punto originale specifico, non un testo generato.
Previsione e carte con almeno tre errori sono informative: nessuna sospensione
è automatica.

## Grafo, lettore e accessibilità

Cytoscape e dagre sono isolati in `graph-view.js`. All'apertura la scala
privilegia etichette leggibili; «Adatta» mostra la mappa intera. Frecce e Invio
seguono gli archi e aprono le lezioni, con annuncio della selezione. L'elenco
è disponibile anche su desktop; legenda, profondità e filtri sono controllabili
da tastiera. Area, tipo, stato e padronanza hanno anche etichette testuali.

`lesson-view.js` compone la lezione. `markdown.js` usa marked, DOMPurify e
highlight.js locali; i diagrammi mermaid hanno cornice e zoom interni, e sono
ridisegnati al cambio tema. L'indice non cambia l'hash del router. Le frecce
precedente/successivo hanno sempre un testo visibile («Prec.»/«Succ.» nella barra
in alto su telefono, «Precedente»/«Successivo» con titolo breve in fondo) e un
aria-label con il titolo completo, calcolati in `js/core/lesson-nav-labels.js`.
Nel simulatore il seed è dentro «Opzioni avanzate», chiuse di default. Il tema
`ids-kg:tema:v1` è applicato prima del CSS; i token sono verificati per il
contrasto AA nei test.

## Dati e funzionamento offline

Il pannello «I tuoi dati» esporta un JSON versionato con le chiavi `ids-kg:*`
e i prefissi storici del ripasso e del simulatore. L'import valida il file
prima di scrivere, chiede conferma e tenta il ripristino se una scrittura
fallisce. Sono sovrascritte solo le chiavi presenti nel backup. Il mazzo Anki
TSV contiene fronte, retro e tag di area/nodo/gruppo. Non c'è sincronizzazione:
i dati restano sul dispositivo salvo esportazione esplicita.

`web/vendor/` contiene le distribuzioni fissate e relative licenze. La build
copia grafo e quiz e genera `precache.js` (non versionato) con un hash dei
contenuti e l'inventario dei file, inclusi i chunk mermaid e gli eventuali moduli
X6. `sw.js` installa atomicamente la nuova cache, elimina solo le vecchie cache
del proprio scope e usa cache-first per le risorse locali; se la cache non è
disponibile o la quota è piena, una risposta di rete valida resta utilizzabile.
Il manifest usa
percorsi relativi, quindi funziona anche in una sottocartella GitHub Pages.

L'uso offline richiede una prima visita online completata e un contesto sicuro
(HTTPS, oppure localhost per sviluppo). Il messaggio di rete non promette la
presenza di contenuti che non siano stati precedentemente salvati. La cache
non sostituisce il backup dei progressi.

## Verifica

```bash
python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh
python scripts/kg.py check
npm test --prefix web
pytest -q
```

I test Playwright coprono telefono 390×844, desktop 1440×900, tastiera,
interleaving, migrazione, backup, offline, banca quiz lenta e assenza di
overflow/errori JS. Sono incluse prove con nodi sintetici in area 7 e con un
grafo più grande.
Richiedono Playwright e Chromium installati; le dipendenze runtime sono locali.
