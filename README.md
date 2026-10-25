# tecweb-kg — Knowledge Graph per Tecnologie Web (UNIMORE)

**Fonte unica**: `graph/graph.json` (schema v3).

Vedi:
- `docs/CONTRACTS.md` — Contratti del knowledge graph
- `docs/SYLLABUS.md` — Programma del corso e fonti
- `docs/ARENA_PLAN.md` — Piano di lavoro e fasi
- `docs/MATERIALE_UTENTE.md` — Materiale fornito dall'utente
- `docs/STATUS.md` — Stato del progetto

## Web App (`web/`)

App statica in italiano, vanilla JS a moduli ES, nessuna build obbligatoria (Cytoscape.js + dagre da CDN).

- **Avvio locale**:
  ```bash
  cd web && python3 -m http.server 8000
  ```
  → <http://localhost:8000> (carica `../graph/graph.json` se servi dalla root del repo)
  
- **Override graph**: `?graph=URL` per caricare un grafo personalizzato

- **Viste**:
  - Grafo interattivo (colore = area, forma = tipo, archi hard pieni / soft tratteggiati)
  - Dettagli al clic con informazioni complete
  - Percorso in ordine topologico con spunte (localStorage)
  - Progresso per area con tempo residuo
  - Filtri (area, tipo, priorità, testo, solo non completati)
  - Checklist di ripasso

- **Moduli**:
  - `js/core/` — Logica pura (topo, validate, filters, progress, store, state)
  - `js/data.js` — Caricamento e validazione
  - `js/ui/` — Viste (una per file)
  - `js/main.js` — Composition root

- **Test**:
  ```bash
  cd web && node --test tests/*.test.js
  ```

## Deploy (GitHub Pages)

- Workflow: `.github/workflows/pages.yml`
- Su push a `main`: check + test → copia `graph.json` → pubblica `web/` su GitHub Pages
- In Settings → Pages: selezionare "GitHub Actions"

## Comandi utili

```bash
# Setup ambiente
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Build knowledge graph
.venv/bin/python scripts/kg.py build

# Esegui test
.venv/bin/pytest -q

# Check URL (richiede rete)
.venv/bin/python scripts/check_urls.py

# Ordine topologico
.venv/bin/python scripts/topo.py
```

## Struttura del repository

```
.
├── graph/                  # Knowledge graph
│   ├── graph.json          # Grafo completo (generato)
│   ├── meta.json           # Metadati del corso
│   ├── parts/              # Nodi per area
│   │   ├── area-1.json     # Fondamenti rete e HTTP
│   │   ├── area-2.json     # Architetture
│   │   ├── area-3.json     # Front-end
│   │   ├── area-4.json     # Back-end e strumenti
│   │   ├── area-5.json     # Web semantico ed evoluzione
│   │   └── area-6.json     # Tesina
│   └── lezioni/            # Lezioni complete (v3)
│       └── <id>.json       # Lezione per ogni nodo
├── docs/                   # Documentazione
│   ├── CONTRACTS.md       # Contratti
│   ├── SYLLABUS.md        # Programma e fonti
│   ├── ARENA_PLAN.md      # Piano di lavoro
│   ├── MATERIALE_UTENTE.md # Materiale utente
│   └── STATUS.md          # Stato progetto
├── schema/                 # Schema JSON
│   └── node.schema.json    # Schema per i nodi
├── scripts/                # Script Python
│   ├── kg.py               # Build del grafo
│   ├── topo.py             # Ordine topologico
│   └── check_urls.py       # Verifica URL
├── tests/                  # Test pytest
│   └── test_*.py           # Test vari
├── web/                    # Web app statica
│   ├── js/                 # Codice JavaScript
│   ├── css/                # Stili CSS
│   └── index.html          # Pagina principale
└── requirements.txt        # Dipendenze Python
```

## Contribuire

1. **Fork** il repository
2. **Crea un branch** per la tua feature (`git checkout -b feat/nome-feature`)
3. **Commit** le modifiche (`git commit -m 'Aggiunto: ...'`)
4. **Push** sul branch (`git push origin feat/nome-feature`)
5. **Apri una Pull Request**

**Regole**:
- Tutti i test devono passare (`pytest -q`)
- Le URL devono essere verificabili (`scripts/check_urls.py`)
- Seguire i contratti in `docs/CONTRACTS.md`
- Codice in italiano, commenti in italiano

## Licenza

MIT License — vedi file `LICENSE` (da aggiungere).
