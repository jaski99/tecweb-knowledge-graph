# tecweb-kg — Knowledge graph per Tecnologie Web e IA (UNIMORE)

Progetto di studio per **[INF-37] Intelligenza Artificiale e Tecnologie Web**, offerta **2026/27** di Ingegneria Informatica (MO), **coorte 2024/25**. Il modulo Tecnologie Web è della prof.ssa **Laura Po** (6 CFU/54 ore); l'integrato è di **12 CFU/108 ore**, con il prof. **Simone Calderara** titolare e docente del modulo IA [F1], [F8]. Se appartieni alla coorte del nuovo manifesto 2026/27, verifica il tuo piano: il raccordo con INF-37 non è stato trovato [F7].

Il [programma](docs/SYLLABUS.md) distingue fatti ufficiali, ipotesi e informazioni non trovate; il [formato d'esame](docs/EXAM_FORMAT.md) descrive TW e IA. I gruppi A/B/C sono **priorità di studio**, non frequenze accertate di domande. Il [piano di miglioramento](docs/IMPROVEMENT_PLAN.md) definisce scope e ordine di integrazione.

- [Elenco nodi e priorità](docs/NODES.md) — 40 nodi presenti e 16 pianificati per X2/X3.
- [Contratti del grafo](docs/CONTRACTS.md) — schema del nodo v4, aree, lezioni e build.
- [Stato e limiti](docs/STATUS.md) · [Piano Arena](docs/ARENA_PLAN.md) · [Materiale utente originale](docs/MATERIALE_UTENTE.md).

## Web app

App statica in italiano con grafo dei prerequisiti, percorso, progresso locale, lezioni, ripasso e simulatore. Le librerie dell'interfaccia sono caricate da CDN; la connessione è necessaria. La banca e il simulatore hanno limitazioni note, descritte nello [stato del progetto](docs/STATUS.md); il timer non è una durata d'esame ufficiale.

```bash
sh web/build.sh
cd web && python3 -m http.server 8000
```

Aprire `http://localhost:8000` sul computer che esegue il server. `?graph=URL` permette di selezionare un grafo alternativo. I progressi restano nel `localStorage` del browser.

## Build e test

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt playwright
.venv/bin/python -m playwright install --with-deps chromium

.venv/bin/python scripts/kg.py build
.venv/bin/python scripts/gen_docs.py build
sh web/build.sh
.venv/bin/python scripts/kg.py check
npm test --prefix web
.venv/bin/pytest -q
.venv/bin/python scripts/check_urls.py  # online
```

`graph/graph.json` è generato da `graph/meta.json`, `graph/parts/*.json` e `graph/lezioni/<id>.json`; i documenti `PIANO_STUDIO.md` e `CHECKLIST_RIPASSO.md` sono generati dal grafo. Integrazione e conflitti sui file generati si risolvono rigenerandoli. `check_urls.py` controlla le risorse dei nodi, non il contenuto delle pagine né tutte le fonti documentali. Serve comunque aprire le fonti e verificare che siano pertinenti.

## Struttura

```text
graph/                 Metadati, part per area, lezioni, grafo e banca quiz
schema/                Schema JSON dei nodi e delle lezioni
scripts/               Build, documenti, ordine topologico e controllo URL
docs/                  Programma, contratti, piano, stato e ricerche
tests/                 Test Python del grafo e dei contenuti
web/                   Web app statica, test Node e test e2e Playwright
```

La pagina GitHub Pages viene pubblicata dal workflow su `main`. Per contribuire nel round corrente rispettare gli scope in [IMPROVEMENT_PLAN.md](docs/IMPROVEMENT_PLAN.md), verificare build e test e consegnare le modifiche sul proprio ramo di sessione.

## Licenza

MIT License — il file `LICENSE` è da aggiungere.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
[F7]: <https://www.ingmo.unimore.it/sites/dip02/files/2026-06/Laurea%20Ingegneria%20Informatica%20a.a.%202026_2027.pdf>
[F8]: <https://moodle.unimore.it/course/info.php?id=22244>
