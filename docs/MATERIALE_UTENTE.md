> **Nota di contesto (round 2):** il testo originale dell'utente qui sotto è conservato integralmente. La scheda ufficiale INF-37 2026/27 della coorte 2024/25 conferma scritto 0–23, tesina 0–10 e PowerPoint di massimo 8 minuti; prevede anche il modulo IA e una specifica regola per la lode [F1]. Le percentuali, le ricorrenze delle domande, la scaletta di 4 slide e la conversione dei punteggi riportate sotto sono **[IPOTESI]**, non regole ufficiali verificate. La durata dello scritto è **[NON TROVATO]**; Flask e SQLite sono esempi, non tecnologie obbligatorie. Il programma, i limiti delle fonti e il significato aggiornato di A/B/C sono in [SYLLABUS.md](SYLLABUS.md) e [NODES.md](NODES.md).

# Tecnologie Web — materiale dato dall'utente (24-25/10/2026)
Fonte: appunti/analisi dell'utente sulle prove passate (PDF delle prove NON disponibili sulla box, solo questa analisi). Docente: la "docente" (nome non indicato).

## 1. Punteggio (matematica del 30 e lode)
- Scritto max 23 punti: teoria, quiz, esercizi pratici. Senza tesina il massimo è 23/30.
- Tesina individuale max 10 punti: progetto web + presentazione di 8 minuti. È la leva per passare da 21-23 a 30/30L.
- Obiettivo: 20-22/23 allo scritto e 9-10/10 alla tesina. Totale 30-32 = 30 (la lode se si ottiene il massimo anche nel modulo di IA).
- Stima: studio mirato PDF ~16 pt (teoria iper-riciclata); punti ciechi syllabus ~5-6 pt (Flask, Git, JS pratico); tesina+presentazione 9-10 pt.

## 2. Copertura PDF (prove) vs syllabus
- Gruppo A, iper-riciclati (~65% dello scritto): stateless vs stateful; DOM e Virtual DOM; HTTP 1/1.1/2/3; cookie e sessioni; Web Semantico (RDF, OWL, SPARQL); architettura 3-tier (orizzontale/verticale); CSS (origini, box model, ereditarietà); quiz form, URI/URL/URN, REST (PATCH, 404). Strategia: memorizzare le definizioni esatte delle prove, con parole chiave ed esempi (es. carrello e-commerce).
- Gruppo B, varianti isolate (~20%): tag <canvas>; DHTML; fasi motore JS (parser, AST, profiler, JIT); eventi locali vs remoti; rate limiting/sicurezza; Web 1.0 -> 4.0; tag <span>. Strategia: ripasso rapido.
- Gruppo C, punti ciechi (~15%, solo syllabus): rotte e API REST con Flask (@app.route, jsonify); comandi base Git (branch, merge, pull request); JavaScript moderno (fetch(), async/await). Strategia: esercitazione pratica ~3 ore.

## 3. Piano in 4 step
1. Memorizzazione attiva (2 giorni): regola dei 3 punti per ogni risposta aperta: definizione formale (es. "il DOM è un albero che descrive la struttura gerarchica..."), vantaggio/scopo ("permette a JS di modificare dinamicamente il contenuto"), esempio applicativo (span per evidenziare una parola, carrello e-commerce). Quiz e schemi: abbinamenti statico/dinamico, stack TCP/IP, fasi AJAX.
2. Punti ciechi di codice (1 giorno): template Flask, template fetch, comandi Git.
3. Simulazione e gestione novità (0,5 giorni): domanda mai vista -> se è Web Semantico ruota su interoperabilità, RDF, OWL, comprensione del significato da parte delle macchine. Scartare le trappole negli abbinamenti: la docente inserisce opzioni estranee (es. "LAN" tra i tipi di Web, "Installazione Sistema Operativo" tra le fasi di sviluppo web); se un'opzione esce dal contesto web, scartarla.
4. Tesina (in parallelo/post-scritto): app web Flask (backend) + HTML/CSS/JS o React (frontend) con CRUD e DB semplice (SQLite o JSON). Presentazione PowerPoint, rigorosi 8 minuti: slide 1 (1 min) obiettivi e problema; slide 2 (2 min) architettura a 3 tier Client / Server Flask / Database; slide 3 (3 min) punti chiave del codice (rotte REST, sessione/cookie, chiamate asincrone); slide 4 (2 min) demo dal vivo o screen. Revisione codice: saper spiegare dove si usano i metodi HTTP (GET, POST, PATCH) e come è gestito lo stato lato client o server.

## Template codice dell'utente
```python
from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/api/resource', methods=['PATCH'])  # PATCH per aggiornamenti parziali
def update_resource():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Not Found'}), 404
    return jsonify({'message': 'Updated'}), 200
```
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/resource');
    if (!response.ok) throw new Error('Errore 404');
    const data = await response.json();
    document.querySelector('#output').textContent = data.message;
  } catch (error) { console.error(error); }
}
```
Git: git init, git add ., git commit -m "", git branch <nome>, git checkout <nome>, git merge <nome>; pull request = richiesta di unire modifiche da un ramo all'altro previa revisione.

## 4. Cheat sheet anti-errore
- Aggiornamento parziale REST: PATCH (non PUT, che sostituisce l'intera risorsa).
- Risorsa non trovata: 404 Not Found.
- URI = categoria generale; URL = dove si trova la risorsa e come accedervi (indirizzo di casa); URN = identifica in modo univoco e persistente senza posizione (codice fiscale).
- Box model CSS: margin, padding, border, content. Non include color o script.
- Ereditarietà CSS: non tutte le proprietà sono ereditabili (margin e padding del box model non si ereditano).
- Multiplexing: HTTP/2 e HTTP/3 (non HTTP/1.0 né 1.1).
- HTTP/3: abbandona TCP, usa QUIC su UDP.
