# Stato del progetto — round 2

## Riferimento

Il progetto segue **INF-37 2026/27, coorte 2024/25**, Ingegneria Informatica (MO): modulo TW della prof.ssa Laura Po e modulo IA del prof. Simone Calderara [F1], [F3], [F8]. Le modalità verificate, le ipotesi e i limiti per altre coorti sono descritti in [SYLLABUS.md](SYLLABUS.md) e [EXAM_FORMAT.md](EXAM_FORMAT.md).

## Disponibile

- **56 nodi con lezione** nelle aree 1–7: i 40 iniziali rivisti da X4, 8 nuovi nodi TW di X2 e 8 IA di X3. Conteggi, tempi stimati e prerequisiti sono in [NODES.md](NODES.md).
- Priorità A/B/C riallineate al programma [F1] anche nella legenda del piano generato. Le quattro slide e la loro ripartizione sono **[IPOTESI]** del materiale utente; [F1] conferma solo il limite di **massimo 8 minuti** per il PowerPoint.
- Gli archi I-2 collegano le basi Python a Flask e al laboratorio IA e aggiungono alla tesina i prerequisiti soft su servizi RESTful e Git. Flask/CRUD sono un esempio didattico, non un vincolo della tesina.
- La web app include i miglioramenti X5, librerie locali e PWA; contratti, fonti, build del grafo, banca quiz e test sono presenti.

## Lavoro ancora aperto

- **X6** deve estendere la banca e il simulatore: l'adattatore corrente non legge il formato `elementi` della banca, che copre solo le aree 1–6. Il timer della simulazione è un'**ipotesi**, non una durata ufficiale.
- **[NON TROVATO]** prove passate pubbliche, durata ufficiale dello scritto, numero ufficiale di slide e griglia dettagliata [F1], [F12]. Le percentuali degli appunti utente non sono dati ufficiali; le slide interne richiedono accesso Moodle [F12].
- **Verifica URL nella sandbox corrente:** `python scripts/check_urls.py` ha restituito 93 errori di connessione su 93 risorse uniche e nessuna risposta OK. Nessun HTTP 200 è stato verificato da quel comando: ripetere il controllo da una rete abilitata. Gli errori non dimostrano che i link siano invalidi.

Il piano vincolante, gli scope e l'ordine di integrazione sono in [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md).

## Comandi di verifica

```bash
python scripts/kg.py build && python scripts/gen_docs.py build && sh web/build.sh
python scripts/kg.py check
npm test --prefix web
pytest -q
python scripts/check_urls.py  # rete necessaria; controlla le risorse dei nodi
```

`check_urls.py` controlla lo stato delle risorse nel grafo, non il contenuto delle pagine né tutti gli URL dei documenti. Per l'e2e sono necessari Playwright e Chromium; i risultati dei test vanno riferiti dopo l'esecuzione, senza considerare i test saltati come superati.

[F1]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/2026/27352/2022/10000?annoOrdinamento=2022>
[F3]: <https://unimore.coursecatalogue.cineca.it/corsi/2024/10296/insegnamenti/10001>
[F8]: <https://moodle.unimore.it/course/info.php?id=22244>
[F12]: <https://moodle.unimore.it/course/view.php?id=22244>
