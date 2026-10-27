# Note di reverse engineering: withmarbleapp/os-taxonomy

Fonte: https://github.com/withmarbleapp/os-taxonomy (commit `3637235924f85df829bb9512a8180b0aa0f2d5cf`, clonato il 24/10/2026).
Licenze: dati ODbL, contenuti CC BY-SA 4.0. **Non copiamo dati**, solo idee di struttura.

## Struttura
- `data/topics.json` → `{version, topicCount, topics:[...]}`: i **nodi** (1.842 "micro-topic").
- `data/dependencies.json` → **archi** separati dai nodi: `{topicId, prerequisiteId, strength: hard|soft, reason}` (3.919 archi, DAG).
- `data/curriculum-standards.json`, `clusters.json`, `teaching-research.json`: allineamento a standard, sintesi per dominio, ricerca didattica (copertura parziale dichiarata).
- `schema/*.schema.json`: JSON Schema per ogni file; `manifest.json` con conteggi e checksum SHA-256.

## Nodo (micro-topic)
Campi: `id` opaco (`mt_...`), `type` (CONCEPTUAL / PROCEDURAL / REPRESENTATIONAL / LANGUAGE / META), `subject`, `domain`, `name`,
`description` (tipicamente 10-30 parole), `ageRangeStart/End`, `centrality`, `evidence` (≈3 criteri osservabili di padronanza), `assessmentPrompt`, `standards` (link a fonti).

## Osservazioni utili
- **Granularità**: un nodo = una singola idea insegnabile e verificabile con ~3 evidenze; ≈2,1 prerequisiti medi per nodo (max 9).
- **Conoscenze vs abilità**: separate tramite `type` (CONCEPTUAL = sapere, PROCEDURAL = saper fare) e rese operative da `evidence` (verbi osservabili: "write", "predict", "explain").
- **Prerequisiti**: arco con `strength` (hard 59% / soft 41%) e `reason` di una riga; grafo garantito aciclico.
- **Tracciabilità**: ogni nodo collegato agli standard da cui è derivato; i report dichiarano esplicitamente cosa NON è coperto.
- **Riuso**: "riusa un topic se valuta lo stesso concetto"; niente duplicati per contesto diverso.

## Cosa adottiamo (vedi CONTRACTS.md)
| os-taxonomy | ids-kg |
|---|---|
| `type` CONCEPTUAL/PROCEDURAL | `tipo` concetto / abilita (+ `tipo_esercizio`) |
| `description` | `sapere` |
| `evidence` | `saper_fare` (criteri osservabili) |
| `dependencies.json` | `prerequisiti` inline; archi derivati |
| `standards` | `risorse` (URL verificati) + `riferimenti_testo` |
| `domain` | `area` 1..7 del progetto, incluse tesina e modulo IA |
| DAG + JSON Schema + validazione | test pytest (schema, id, prerequisiti, aciclicità, topo) |

Differenze volute: prerequisiti inline nei part, con `forza` hard/soft e `motivo`; ID leggibili in kebab-case invece che opachi. I gruppi A/B/C rappresentano priorità di studio rispetto al programma [F1], non frequenze di domande: vedi [NODES.md](NODES.md).

## Ricerca didattica (`data/teaching-research.json`, ri-studiato in Fase 4)
Record per topic (copertura parziale, ~1.049/1.842): `pedagogy{summary` (markdown ~2.000 car., la "lezione" vera e propria), `bestPractices[5]`, `keyRepresentations[4]`, `commonMisconceptions[5]}`, `learn`/`assess` (risorse), `sources`, `confidence`, `provenance`. Separa il "cosa" (topic + evidence) dal "come si insegna".

Adottiamo l'idea, non i dati, nell'oggetto `lezione` v4: summary → `spiegazione`; keyRepresentations → diagrammi Mermaid e codice; commonMisconceptions → `errori_trappole`; assess → `richiamo_attivo`; in più `analogia`, `worked_example`, `completion_problem` ed `esercizio_autonomo`. Il contratto completo è in [CONTRACTS.md](CONTRACTS.md). La lezione deve bastare da sola, senza rimandi alle fonti per capire.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
