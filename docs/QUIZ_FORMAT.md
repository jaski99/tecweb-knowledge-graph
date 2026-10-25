# Formato della banca quiz

La banca condivisa è `graph/quiz.json`; il contratto JSON Schema è `graph/quiz.schema.json` (Draft 2020-12). Non è parte di `graph/graph.json`: può essere caricata e validata separatamente. I testi sono in italiano UTF-8.

## Struttura radice

```json
{
  "versione": 1,
  "descrizione": "Banca di ripasso per le sei aree del corso.",
  "elementi": []
}
```

La versione identifica il formato, non un’edizione dell’esame. `elementi` contiene quesiti `scelta_multipla` o insiemi di `abbinamento`. Gli ID sono univoci nella banca e in kebab-case. Ogni quesito deve dichiarare `area` (da 1 a 6), `titolo` e collegarsi a un ID di nodo già presente nel grafo.

## Scelta multipla

```json
{
  "id": "a2-put-patch",
  "tipo": "scelta_multipla",
  "area": 2,
  "titolo": "Sostituzione e modifica parziale",
  "domanda": "Quale metodo ...?",
  "opzioni": [
    {"id": "a", "testo": "..."},
    {"id": "b", "testo": "..."},
    {"id": "c", "testo": "..."}
  ],
  "risposta_corretta": "a",
  "spiegazione": "La risposta è corretta perché ...",
  "nodo_id": "rest-metodi-http"
}
```

`opzioni` contiene da 3 a 6 scelte con identificatori distinti; `risposta_corretta` deve corrispondere a uno di quegli identificatori. Una spiegazione motivata accompagna ogni risposta. La spiegazione chiarisce il concetto e, quando utile, perché il distrattore più allettante non è corretto. I distrattori possono essere vicini al tema o deliberatamente estranei, ma non devono risultare ambigui.

## Abbinamento

```json
{
  "id": "match-a2",
  "tipo": "abbinamento",
  "area": 2,
  "titolo": "Abbinamento: API e architetture",
  "istruzioni": "Abbina i termini alle descrizioni; scarta i distrattori.",
  "opzioni": [{"id": "a", "testo": "..."}, {"id": "b", "testo": "..."}, {"id": "c", "testo": "..."}],
  "distrattori": [
    {"testo": "Descrizione plausibile ma non corretta per questi termini.", "tipo": "plausibile"},
    {"testo": "Informazione estranea all’area di studio.", "tipo": "fuori_contesto"}
  ],
  "abbinamenti": [
    {"elemento": "PUT", "risposta_id": "b", "spiegazione": "PUT ha ...", "nodo_id": "rest-metodi-http"}
  ]
}
```

`opzioni` contiene le descrizioni valide disponibili; ogni riga di `abbinamenti` indica un termine, la descrizione attesa, la spiegazione e il nodo collegato. `distrattori` documenta alternative non corrette: `plausibile` è pertinente ma confondibile; `fuori_contesto` appartiene a un tema estraneo. L’interfaccia può mescolare entrambe le categorie alle opzioni valide. Ogni abbinamento ha una spiegazione autonoma, così il feedback resta utile anche senza il docente.

## Regole di qualità e validazione

- Coprire tutte le sei aree, con almeno una domanda a scelta multipla e un insieme di abbinamenti per ciascuna.
- Usare quesiti univoci, distrattori credibili e almeno un distrattore fuori contesto negli abbinamenti; evitare risposte che diventano corrette solo grazie a supposizioni non dichiarate.
- Ogni scelta corretta e ogni abbinamento devono includere una spiegazione e un `nodo_id` esistente. Le relazioni si controllano nei test Python, oltre alla validazione strutturale JSON Schema.
- Non inserire punteggi, date, citazioni o dettagli d’esame non verificati. Le attività sulla tesina sono esercizi di studio basati sul materiale utente, non predizioni di domande ufficiali.
- Validare con `pytest -q`; i test della banca sono in `tests/test_quiz.py`. Schema e dati sono validi anche indipendentemente con `jsonschema.Draft202012Validator`.

## Aggiunta proposta a `docs/CONTRACTS.md`

Nel riepilogo di integrazione, aggiungere una sezione che dichiari `graph/quiz.json` come banca versionata separata da `graph/graph.json`, `graph/quiz.schema.json` come schema dedicato, e `docs/QUIZ_FORMAT.md` come specifica; precisare che i test verificano ID univoci, copertura delle aree, riferimenti a nodi esistenti e spiegazioni per ogni risposta. `CONTRACTS.md` non è stato modificato in questo intervento.
