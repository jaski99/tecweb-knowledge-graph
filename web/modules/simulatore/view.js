import { moduloIAAttivo } from './modulo-ia.js';
// Vista orchestratrice: banca e correzione restano indipendenti dal DOM.
import { h } from '../dom.js';
import { generaProva, catalogoEsercizi } from './genera.js';
import { leggiTimer, formatTempo } from './timer.js';
import { consegna, creaSessione, leggiRisposta, leggiSessione, mettiInPausa,
  riprendi, salvaSessione, scaduta, scriviRisposta, sessionePerModulo } from './sessione.js';
import { etichettaEsito, riepilogoRisposte } from './punteggio.js';
import { rispostaCompleta, esitiItem, reportAree } from './correzione.js';
// Il lettore X5 può usare un doppio read-only: richiediamo il writer solo all’uso.
import * as storicoEsiti from './esiti.js';
import { controlliRisposta, feedbackItem, opzioniAvanzate } from './controlli.js';

export function createSimulatoreView() {
  return { id: 'simulatore', titolo: 'Quiz e simulatore', render(root, ctx) {
    const win = (ctx.document || root.ownerDocument).defaultView || globalThis;
    const graph = ctx.graph || { nodi: [] };
    const now = ctx.now || (() => Date.now());
    const storage = ctx.storage;
    const ask = ctx.confirm || ((text) => win.confirm(text));
    let includiIA = moduloIAAttivo(storage);
    let session = sessionePerModulo(leggiSessione(storage), includiIA);
    let timerHandle = null;
    let smontata = false;
    let saveOk = true;
    let modalita = 'simulazione';
    let minuti = 120;
    let seed = now();
    const stopTimer = () => { if (timerHandle !== null) win.clearInterval(timerHandle); timerHandle = null; };
    const persist = () => { saveOk = salvaSessione(storage, session) && saveOk; };
    const registra = (item) => {
      if (session.registrati?.[item.id]) return;
      for (const esito of esitiItem(item, session.risposte[item.id], session.prova.modalita || 'simulazione', new Date(now()).toISOString())) {
        if (!storicoEsiti.registraEsito?.(storage, esito)) saveOk = false;
      }
      session.registrati = { ...session.registrati, [item.id]: true };
    };
    const termina = (timeout = false) => {
      aggiornaModulo();
      if (!session) { draw(); return; }
      session = timeout ? scaduta(session) : consegna(session, now());
      session.prova.esercizi.forEach(registra);
      persist(); draw();
    };
    const avvia = () => {
      if (session && !ask('Sostituire la sessione salvata?')) return;
      session = creaSessione(generaProva(graph.nodi, { quiz: graph.quiz, includiIA: moduloIAAttivo(storage), seed, now: now(), durataMs: minuti * 60000, modalita }), now());
      if (modalita === 'allenamento') session = mettiInPausa(session, now());
      persist(); draw();
    };
    const torna = () => h('a', { class: 'btn', href: '#/' }, '← Torna al grafo');
    const titolo = (text) => h('header', { class: 'mod-top' }, torna(), h('h1', { id: 'sim-titolo', tabindex: '-1' }, text));
    const intro = () => h('div', { class: 'module-page sim' }, titolo('Quiz e simulatore'),
      h('p', {}, 'Quesiti originali di ripasso: non tratti da prove reali e non predittivi dell’esame. Programma: [F1], registro in docs/research/R3-programma-esame.md.'),
      h('p', {}, `${catalogoEsercizi([], graph.quiz, { includiIA }).length} quesiti della banca disponibili. Blueprint didattico: selezione bilanciata tra le aree disponibili, non distribuzione ufficiale.`),
      h('label', {}, 'Modalità ', h('select', { id: 'sim-modalita', onchange: (e) => { modalita = e.target.value; } },
        h('option', { value: 'simulazione', selected: modalita === 'simulazione' }, 'Simulazione'), h('option', { value: 'allenamento', selected: modalita === 'allenamento' }, 'Allenamento'))),
      h('p', {}, 'Allenamento: feedback immediato alla risposta completa. Simulazione: senza appunti [F1], soluzioni solo a consegna.'),
      h('label', {}, 'Durata in minuti (ipotesi didattica) ', h('input', { id: 'sim-durata', type: 'number', min: 1, max: 480, value: minuti, onchange: (e) => {
        minuti = Math.max(1, Math.min(480, Number(e.target.value) || 120)); e.target.value = minuti;
      } })),
      h('p', {}, '120 minuti / 2 ore è un’ipotesi configurabile: la durata ufficiale non è stata trovata. Nessun voto ufficiale viene calcolato.'),
      opzioniAvanzate(
        h('label', {}, 'Seed riproducibile ', h('input', { id: 'sim-seed', type: 'number', value: seed, onchange: (e) => { seed = Number(e.target.value) || 0; } })),
        h('p', { class: 'muted' }, 'Lo stesso seed genera la stessa selezione e lo stesso ordine dei quesiti: serve solo per rifare una prova identica.')),
      h('button', { class: 'btn primary', id: 'sim-inizia', type: 'button', onclick: avvia }, 'Inizia la sessione'));

    const esercizio = (item, index, correction) => {
      const feedback = h('div', { class: 'sim-feedback', 'aria-live': 'polite' });
      const shown = correction || session.confermate?.[item.id];
      if (shown) feedback.append(feedbackItem(item, session.risposte[item.id]));
      let controls;
      const cambia = (value) => {
        if (aggiornaModulo()) { draw(); return; }
        session = scriviRisposta(session, item.id, value);
        if (session.prova.modalita === 'allenamento' && rispostaCompleta(item, value) && item.tipo !== 'aperta') {
          session.confermate = { ...session.confermate, [item.id]: true };
          registra(item);
          controls.disabled = true;
          feedback.replaceChildren(feedbackItem(item, value));
        }
        persist();
      };
      controls = controlliRisposta(item, leggiRisposta(session, item.id), cambia, Boolean(shown));
      const article = h('article', { class: 'sim-q', 'data-q': item.id }, h('h3', {}, `${index + 1}. ${item.nodoTitolo}`),
        h('p', { class: 'sim-testo' }, item.testo), controls, feedback);
      if ((correction || session.prova.modalita === 'allenamento') && item.nodoId) article.append(h('a', {
        href: `#/lezione/${encodeURIComponent(item.nodoId)}`,
      }, 'Riapri il nodo'));
      return article;
    };
    const report = () => h('section', { id: 'sim-report' }, h('h2', {}, 'Report per area'),
      ...reportAree(session.prova.esercizi, session.risposte, { includiIA }).map((r) => h('section', {},
        h('h3', {}, `Area ${r.area}`), h('p', {}, `${r.corretti} corrette su ${r.totale - r.aperte} correggibili; ${r.aperte} aperte da autovalutare.`),
        h('h4', {}, 'Riapri questi nodi'), r.nodi.length ? h('ul', {}, ...r.nodi.map((id) => h('li', {}, h('a', {
          href: `#/lezione/${encodeURIComponent(id)}`,
        }, graph.byId?.get(id)?.title || id)))) : h('p', {}, 'Nessun errore rilevato nei quesiti correggibili.'))));
    const pagina = () => {
      const correction = session.fase === 'consegnata';
      const info = leggiTimer(session.timer, now());
      return h('div', { class: 'module-page sim' }, titolo(correction ? 'Correzione guidata' : `Quiz · ${session.prova.modalita || 'simulazione'}`),
        h('button', { class: 'btn', id: 'sim-nuova', onclick: () => {
          if (ask('Chiudere la sessione e scegliere nuove impostazioni?')) { session = null; draw(); }
        } }, 'Nuova sessione'),
        !saveOk ? h('p', { role: 'alert' }, 'Salvataggio locale non riuscito: conserva questa scheda aperta.') : null,
        correction ? h('p', { id: 'sim-riepilogo' }, etichettaEsito(riepilogoRisposte(session.prova.esercizi, session.risposte, { includiIA }))) : h('div', { class: 'sim-timer' },
          session.prova.modalita !== 'allenamento' ? h('div', {}, h('p', {}, 'Senza appunti [F1]. Durata: ipotesi didattica.'),
            h('p', { id: 'sim-timer', class: 'sim-clock', role: 'timer' }, formatTempo(info.rimanenti)),
            h('button', { class: 'btn', id: 'sim-pause', onclick: () => {
              session = info.running ? mettiInPausa(session, now()) : riprendi(session, now()); persist(); draw();
            } }, info.running ? 'Pausa' : 'Riprendi')) : h('p', {}, 'Allenamento senza limite di tempo. Feedback alla risposta completa.'),
          h('button', { class: 'btn primary', id: 'sim-consegna', onclick: () => termina() }, 'Consegna e mostra soluzioni')),
        correction ? report() : null,
        ...session.prova.esercizi.map((item, i) => esercizio(item, i, correction)));
    };
    const aggiornaModulo = () => {
      const attivo = moduloIAAttivo(storage);
      if (attivo === includiIA) return false;
      includiIA = attivo;
      session = sessionePerModulo(leggiSessione(storage), includiIA);
      return true;
    };
    const draw = () => {
      stopTimer();
      aggiornaModulo();
      if (session?.fase === 'svolgimento' && session.prova.modalita !== 'allenamento' && leggiTimer(session.timer, now()).scaduto) {
        session = scaduta(session); session.prova.esercizi.forEach(registra); persist();
      }
      root.replaceChildren(session ? pagina() : intro());
      root.querySelector('h1')?.focus();
      if (session?.fase === 'svolgimento' && session.prova.modalita !== 'allenamento' && leggiTimer(session.timer, now()).running) {
        timerHandle = win.setInterval(() => {
          const info = leggiTimer(session.timer, now());
          const clock = root.querySelector('#sim-timer');
          if (clock) clock.textContent = formatTempo(info.rimanenti);
          if (info.scaduto) termina(true);
        }, 1000);
      }
    };
    // La chiave può cambiare da un’altra scheda o dal controllo X5 nella stessa pagina.
    const verificaModulo = () => { if (!smontata && aggiornaModulo()) draw(); };
    const dopoInterazione = () => queueMicrotask(verificaModulo);
    const doc = root.ownerDocument;
    doc.addEventListener('change', dopoInterazione);
    doc.addEventListener('click', dopoInterazione);
    win.addEventListener('storage', verificaModulo);
    win.addEventListener('focus', verificaModulo);
    draw();
    return () => {
      smontata = true;
      stopTimer();
      doc.removeEventListener('change', dopoInterazione);
      doc.removeEventListener('click', dopoInterazione);
      win.removeEventListener('storage', verificaModulo);
      win.removeEventListener('focus', verificaModulo);
    };
  } };
}
