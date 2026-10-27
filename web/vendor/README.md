# Dipendenze vendorizzate

Distribuzioni pubblicate nel registro npm, versioni fissate; vengono servite dallo
stesso sito, senza CDN. Sono inclusi soltanto i file di esecuzione necessari e
le licenze in `THIRD-PARTY-LICENSES.txt` (incluse quelle dei pacchetti transitivi
risolti durante la preparazione delle distribuzioni).

| Pacchetto npm | Versione | File |
|---|---:|---|
| cytoscape | 3.30.2 | `cytoscape.min.js` |
| dagre | 0.8.5 | `dagre.min.js` |
| cytoscape-dagre | 2.5.0 | `cytoscape-dagre.js` |
| marked | 12.0.2 | `marked.min.js` |
| dompurify | 3.1.6 | `purify.min.js` |
| @highlightjs/cdn-assets | 11.10.0 | `highlight.min.js`, `highlight-github.min.css` |
| mermaid | 11.4.1 | `mermaid/`, inclusi i chunk caricati dinamicamente |

La licenza di ciascuna distribuzione e le notifiche delle sue dipendenze sono
conservate nel file delle licenze. I file sono quelli degli archivi npm, non
copie modificate a mano.
