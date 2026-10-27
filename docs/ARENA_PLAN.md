# Piano Arena — Tecnologie Web e IA

Il piano operativo vincolante del round 2, inclusi contratti, scope dettagliati e ordine di merge, è [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md). Questo documento ne è una guida sintetica, non una variante.

## Obiettivo e fonti

Il sito aiuta a studiare l'integrato **INF-37 2026/27**, Ingegneria Informatica (MO), nella scheda per la **coorte 2024/25**: Tecnologie Web, prof.ssa Laura Po, e modulo IA, prof. Simone Calderara [F1], [F3], [F8]. Chi segue il manifesto delle nuove immatricolazioni deve verificare la propria coorte [F7]. Il [syllabus](SYLLABUS.md) distingue fatti, ipotesi e informazioni non trovate; il [materiale utente](MATERIALE_UTENTE.md) è conservato con la sua nota di contesto, non è l'unica fonte.

A/B/C sono priorità didattiche rispetto a [F1]: A = esplicito o indispensabile, B = contesto utile, C = opzionale/non elencato. Non sono frequenze accertate di domande. Le sette aree e le lezioni in arrivo sono elencate in [NODES.md](NODES.md); l'area 7 è il modulo IA ufficiale, non un'ipotesi su LLM.

## Worker del round 2

| Worker | Responsabilità | Confini principali |
|---|---|---|
| X1 | Programma, priorità e contratti | Documenti, metadati, priorità dei nodi esistenti e relativi test. |
| X2 | Nuove lezioni TW | Nuovi part `area-2-r2.json`, `area-3-r2.json`, `area-4-r2.json`, lezioni e test assegnati. |
| X3 | Modulo IA | Nuovo part `area-7.json`, lezioni IA e test assegnati. |
| X4 | Revisione dei contenuti esistenti | Lezioni dei 40 nodi esistenti e relativi test. |
| X5 | Web app | `web/` e workflow assegnati, escluse le parti del simulatore riservate a X6. |
| X6 | Quiz e simulatore | Banca, schema, documentazione, simulatore e relativi test; fase b dopo X2 e X3. |

Per i percorsi esatti e il contratto degli esiti consultare [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md#2-worker-scope-esclusivo-ramo). Gli ID nuovi sono definitivi; i nuovi part evitano collisioni, mentre gli archi da nodi esistenti a nodi nuovi sono compito dell'integrazione.

## Consegna e integrazione

Ogni worker usa soltanto il proprio ramo di sessione `arena/*` e i file assegnati; il coordinatore gestisce PR e merge. L'ordine è **X1 → X4 → X2 → X3 → X6 fase a → X5 → X6 fase b → integrazione**. I file generati `graph/graph.json`, `docs/PIANO_STUDIO.md` e `docs/CHECKLIST_RIPASSO.md` si rigenerano, non si risolvono a mano; il coordinatore li rigenera in integrazione.

```bash
python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh
python scripts/kg.py check
npm test --prefix web
pytest -q  # con Playwright e Chromium installati: nessun test saltato
python scripts/check_urls.py  # controllo online delle risorse del grafo
```

Qualità: moduli piccoli e coesi, basso accoppiamento, interfacce chiare, test per ogni modulo, italiano corretto, risorse verificabili e nessuna attribuzione non documentata a docenti o prove. Un controllo HTTP non sostituisce la lettura della fonte.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
[F3]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/10001>
[F7]: <https://www.ingmo.unimore.it/sites/dip02/files/2026-06/Laurea%20Ingegneria%20Informatica%20a.a.%202026_2027.pdf>
[F8]: <https://moodle.unimore.it/course/info.php?id=22244>
