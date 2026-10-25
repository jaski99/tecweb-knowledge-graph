// Simulatore di esercizi ricavati esclusivamente dal grafo, con sessione a tempo di due ore.
import { clear, h } from '../dom.js';
import { generaProva } from './genera.js';
import { leggiTimer, formatTempo } from './timer.js';
import {
  consegna, creaSessione, leggiRisposta, leggiSessione,
  mettiInPausa, riprendi, salvaSessione, scaduta, scriviRisposta, sessioneInCorsoValida,
} from './sessione.js';
import { etichettaEsito, riepilogoRisposte } from './punteggio.js';

export function createSimulatoreView() {
  return {
    id: 'simulatore',
    titolo: 'Simulatore · 2 ore',
    render(root, ctx) {
      const doc = ctx.document || root.ownerDocument;
      const win = doc.defaultView || globalThis;
      const graph = ctx.graph || { nodi: [], quiz: null };
      const storage = ctx.storage;
      const now = ctx.now || (() => Date.now());
      const ask = ctx.confirm || ((message) => win.confirm(message));
      let session = leggiSessione(storage);
      let timerHandle = null;
      let saveOk = true;
      if (session && session.fase === 'svolgimento' && !sessioneInCorsoValida(session, now())) session = scaduta(session);

      const persist = () => { saveOk = salvaSessione(storage, session); };
      const stopTimer = () => { if (timerHandle != null) win.clearInterval(timerHandle); timerHandle = null; };
      const torna = () => h('a', { class: 'btn', href: '#/' }, '← Torna al grafo');
      const saveNotice = () => saveOk ? null : h('p', { class: 'sim-gap', role: 'status' }, 'Il browser non è riuscito a salvare la sessione.');

      const avvia = () => {
        if (session && !ask('Sostituire la sessione salvata? Le risposte attuali verranno cancellate.')) return;
        const prova = generaProva(graph.nodi, { quiz: graph.quiz, now: now() });
        if (!prova.esercizi.length) { draw(); return; }
        session = creaSessione(prova, now());
        persist();
        draw();
      };

      const renderIntro = () => {
        const esercizi = graph.nodi.flatMap((n) => n.esercizi || []).filter((e) => e?.testo?.trim() && e?.soluzione?.trim()).length;
        return h('div', { class: 'module-page sim' },
          h('header', { class: 'mod-top' }, torna(), h('h1', { id: 'sim-titolo', tabindex: '-1' }, "Simulatore d’esame · 2 ore")),
          h('p', { class: 'sim-lead' }, 'Allenamento a tempo di 120 minuti. Le consegne e le soluzioni provengono dai campi esercizi del grafo; il simulatore non attribuisce punteggi né presume una struttura d’esame.'),
          h('p', {}, `${esercizi} esercizi svolti disponibili nel grafo${Array.isArray(graph.quiz) ? `; ${graph.quiz.length} elementi quiz caricati` : ''}.`),
          graph.nota_esame ? h('details', { class: 'note' }, h('summary', {}, 'Nota sulle informazioni d’esame'), h('p', {}, graph.nota_esame)) : null,
          session ? h('p', { class: 'muted' }, session.fase === 'consegnata' ? 'È disponibile la correzione della sessione precedente.' : 'È disponibile una sessione salvata in questo browser.') : null,
          saveNotice(),
          h('div', { class: 'sim-actions' },
            session?.fase === 'svolgimento' ? h('button', { class: 'btn primary', type: 'button', id: 'sim-riprendi', onclick: () => { session = riprendi(session, now()); persist(); draw(); } }, 'Riprendi la sessione') : null,
            session?.fase === 'consegnata' ? h('button', { class: 'btn primary', type: 'button', id: 'sim-correzione', onclick: draw }, 'Rivedi le soluzioni') : null,
            h('button', { class: `btn ${session ? '' : 'primary'}`, type: 'button', id: 'sim-inizia', onclick: avvia }, session ? 'Inizia una nuova sessione' : 'Inizia la sessione')));
      };

      const renderTimer = () => {
        const info = leggiTimer(session.timer, now());
        const cambia = () => {
          session = info.running ? mettiInPausa(session, now()) : riprendi(session, now());
          persist(); draw();
        };
        const submit = () => { session = consegna(session, now()); persist(); draw(); };
        return h('div', { class: 'sim-timer' },
          h('div', {}, h('p', { class: 'muted', id: 'sim-timer-note' }, info.running ? 'Tempo residuo: il timer continua anche se cambi scheda.' : 'Timer in pausa.'),
            h('p', { class: 'sim-clock', id: 'sim-timer', role: 'timer', 'aria-live': 'off' }, formatTempo(info.rimanenti))),
          h('div', { class: 'sim-timer-actions' },
            h('button', { class: 'btn', type: 'button', id: 'sim-pause', onclick: cambia }, info.running ? 'Pausa' : 'Riprendi'),
            h('button', { class: 'btn primary', type: 'button', id: 'sim-consegna', onclick: submit }, 'Consegna e mostra soluzioni')));
      };

      const renderExercise = (exercise, index, correction) => h('article', { class: 'sim-q', 'data-q': exercise.id },
        h('h3', {}, `${index + 1}. ${exercise.nodoTitolo || exercise.tipoEsame || 'Esercizio'}`),
        h('p', { class: 'muted' }, exercise.tipoEsame || 'Esercizio'),
        h('div', { class: 'sim-testo' }, exercise.testo),
        correction
          ? h('div', { class: 'sim-confronto' },
            h('section', { class: 'sim-box sim-tua' }, h('h4', {}, 'La tua risposta'), h('div', { class: 'sim-prosa' }, leggiRisposta(session, exercise.id).trim() || 'Nessuna risposta inserita.')),
            h('section', { class: 'sim-box sim-soluzione' }, h('h4', {}, 'Soluzione disponibile nel grafo'), h('div', { class: 'sim-prosa sim-soluzione-testo' }, exercise.soluzione)))
          : h('label', {}, 'La tua risposta', h('textarea', {
            class: 'sim-input', 'data-q': exercise.id,
            oninput: (event) => { session = scriviRisposta(session, exercise.id, event.target.value); persist(); },
          }, leggiRisposta(session, exercise.id))),
        exercise.nodoId && graph.byId?.has(exercise.nodoId)
          ? h('p', {}, 'Nodo: ', h('a', { href: `#/lezione/${encodeURIComponent(exercise.nodoId)}` }, exercise.nodoTitolo || exercise.nodoId)) : null);

      const renderSession = () => {
        const correction = session.fase === 'consegnata';
        const summary = riepilogoRisposte(session.prova.esercizi, session.risposte);
        return h('div', { class: 'module-page sim' },
          h('header', { class: 'mod-top' }, torna(), h('h1', { id: 'sim-titolo', tabindex: '-1' }, correction ? 'Correzione guidata' : "Simulatore d’esame"),
            h('button', { class: 'btn', type: 'button', id: 'sim-nuova', onclick: avvia }, 'Nuova sessione')),
          saveNotice(),
          correction ? h('p', { id: 'sim-riepilogo', class: 'sim-riepilogo' }, etichettaEsito(summary)) : renderTimer(),
          ...(!correction && leggiTimer(session.timer, now()).scaduto ? [h('p', { class: 'sim-gap', role: 'status' }, 'Tempo terminato: la sessione è stata consegnata.')]: []),
          h('p', { class: 'muted' }, `${session.prova.esercizi.length} esercizi selezionati. Il confronto delle risposte è autovalutativo: nessun voto viene calcolato.`),
          ...session.prova.esercizi.map((exercise, index) => renderExercise(exercise, index, correction)));
      };

      const draw = () => {
        stopTimer();
        if (session?.fase === 'svolgimento' && leggiTimer(session.timer, now()).scaduto) { session = scaduta(session); persist(); }
        clear(root);
        root.replaceChildren(session ? renderSession() : renderIntro());
        root.querySelector('h1')?.focus();
        if (session?.fase === 'svolgimento' && leggiTimer(session.timer, now()).running) {
          timerHandle = win.setInterval(() => {
            const info = leggiTimer(session.timer, now());
            const clock = root.querySelector('#sim-timer');
            if (clock) clock.textContent = formatTempo(info.rimanenti);
            if (info.scaduto) draw();
          }, 1000);
        }
      };

      draw();
      return stopTimer;
    },
  };
}
