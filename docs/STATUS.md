# Stato del progetto — round 2

## Riferimento

Il progetto segue **INF-37 2026/27, coorte 2024/25**, Ingegneria Informatica (MO): modulo TW della prof.ssa Laura Po e modulo IA del prof. Simone Calderara [F1], [F3], [F8]. Le modalità verificate, le ipotesi e i limiti per altre coorti sono descritti in [SYLLABUS.md](SYLLABUS.md) e [EXAM_FORMAT.md](EXAM_FORMAT.md).

## Disponibile sul ramo X1

- **40 nodi esistenti con lezione**, nelle aree 1–6; aree dichiarate 1–7. L'area 7 è prevista nei metadati ma non contiene ancora nodi.
- Priorità dei nodi e legenda A/B/C riallineate al programma [F1]; la tabella completa e i conteggi sono in [NODES.md](NODES.md).
- Identificativi e contratti per **16 nodi pianificati**: 8 TW in arrivo da X2 e 8 IA in arrivo da X3. Non sono lezioni già disponibili.
- Contratti, fonti e modalità d'esame documentati; build del grafo, documenti generati, web app statica, banca quiz e test sono già presenti nel repository.

## Lavoro ancora aperto

- **X4** deve riallineare e correggere le 40 lezioni esistenti: nel frattempo possono contenere formulazioni o priorità precedenti. L'esempio Flask/CRUD è una proposta didattica, non un vincolo per la tesina.
- **X2/X3** devono creare i nodi e le lezioni pianificati, compresa l'area IA; le slide ufficiali richiedono accesso Moodle e non sono pubbliche [F8], [F12].
- **X6** deve collegare la banca quiz al simulatore e aggiornare quiz e modalità; il timer già presente è un'**ipotesi**, non una durata ufficiale. **X5** cura i miglioramenti della web app.
- `scripts/gen_docs.py` conserva la vecchia legenda con percentuali: serve aggiornarlo in integrazione e rigenerare i documenti, non correggerli a mano. Il part esistente della tesina contiene ancora una checklist con **4 slide** non etichettate: è una **[IPOTESI]**, da chiarire nel relativo scope. Le lezioni preesistenti possono contenere altri esempi o priorità da riallineare con X4.
- **[NON TROVATO]** prove passate pubbliche, durata ufficiale dello scritto, numero ufficiale di slide e griglia dettagliata [F1], [F12]. Le percentuali degli appunti utente non sono dati ufficiali.
- **Verifica URL nella sandbox X1:** `python scripts/check_urls.py` ha restituito errori di connessione per tutte le 69 risorse uniche del grafo, perché i loro host non sono raggiungibili dall'ambiente. Nessun HTTP 200 è stato verificato da quel comando: va ripetuto da una rete abilitata. Gli errori non dimostrano che i link siano invalidi.

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
