// Presentazione del piano; persistenza e callback sono iniettate.
import { h, fill } from './dom.js';
import { pianoOggi, BUDGET_SESSIONE } from '../core/session-plan.js';
import { STORAGE_KEYS } from '../config.js';
import { formatMinuti } from '../core/progress.js';
import { isIsoDay, toIsoDay } from '../../modules/ripasso/giorni.js';
import { leggiStato } from '../../modules/ripasso/store.js';

export function descriviRitmo(piano) {
  if (piano.giorni === null) return 'Inserisci la data per calcolare il ritmo sui tempi stimati dei nodi ancora da studiare.';
  if (piano.giorni <= 0) return 'La data è oggi o è già trascorsa: aggiorna l’appello per calcolare il ritmo.';
  return `Mancano ${piano.giorni} giorni. Tempo stimato residuo: ${formatMinuti(piano.minResidui)}; ritmo indicativo: ${piano.ritmo} min al giorno.`;
}

export function createTodayView(root, graph, { storage, carte, onOpen, onChange, now = () => new Date() }) {
  const read = (key) => { try { return storage.getItem(key) || ''; } catch { return ''; } };
  const save = (key, value) => { try { value ? storage.setItem(key, value) : storage.removeItem(key); return true; } catch { return false; } };
  let error = false;
  return {
    render({ mastery, statiStudio }) {
      const oggi = toIsoDay(now());
      const dataEsame = read(STORAGE_KEYS.examDate);
      const savedBudget = Number(read(STORAGE_KEYS.dailyBudget));
      const budget = BUDGET_SESSIONE.includes(savedBudget) ? savedBudget : BUDGET_SESSIONE[0];
      const piano = pianoOggi({ nodi: graph.nodi, ordine: graph.order, padronanza: mastery, statiStudio, carte,
        datiRipasso: leggiStato(storage), oggi, dataEsame, budget });
      fill(root,
        h('div', { class: 'today-heading' }, h('h2', {}, 'Sessione di oggi'), h('span', { class: 'muted' }, 'Un suggerimento modificabile, non un obbligo.')),
        h('div', { class: 'today-options' },
          h('label', {}, 'Data dell’appello (facoltativa)', h('input', { id: 'exam-date', type: 'date', value: isIsoDay(dataEsame) ? dataEsame : '',
            onchange: (e) => { error = !save(STORAGE_KEYS.examDate, e.target.value); onChange(); root.querySelector('#exam-date')?.focus(); } })),
          h('label', {}, 'Tempo disponibile indicativo', h('select', { id: 'today-budget', onchange: (e) => {
            error = !save(STORAGE_KEYS.dailyBudget, e.target.value); onChange(); root.querySelector('#today-budget')?.focus();
          } }, BUDGET_SESSIONE.map((n) => h('option', { value: String(n), selected: n === budget }, `${n} min`))))),
        error ? h('p', { class: 'error', role: 'status' }, 'Non è stato possibile salvare le preferenze in questo browser.') : null,
        h('p', { class: 'muted' }, 'Il tempo scelto orienta gli spunti: le carte non hanno una durata stimata e la sessione può richiedere più tempo.'),
        h('p', {}, `${piano.dovute.length} carte dovute e ${piano.nuove} nuove disponibili nel limite di oggi. `,
          h('a', { href: '#/ripasso' }, 'Vai al ripasso')),
        piano.prossimo ? h('p', {}, 'Prossimo nodo consigliato: ',
          h('button', { type: 'button', class: 'link', onclick: () => onOpen(piano.prossimo.id) }, piano.prossimo.title),
          piano.prossimo.tempo_studio_min > budget ? ' (la stima del nodo supera il tempo scelto: puoi dividerlo o aprirlo comunque)' : '')
          : h('p', { class: 'muted' }, 'Nessun nuovo nodo consigliato: puoi comunque aprire qualunque lezione.'),
        h('p', { class: 'muted' }, descriviRitmo(piano)),
        piano.avvisoA ? h('p', { class: 'today-warning' }, 'Con il tempo indicato, le stime residue dei nodi di gruppo A superano il tempo disponibile fino all’appello. Rivedi il piano: è solo una stima.') : null,
        piano.spirale.length ? h('details', {}, h('summary', {}, `Richiamo a spirale: ${piano.spirale.length} spunti da nodi già visti`),
          h('ol', { class: 'today-spiral' }, piano.spirale.map((c) => h('li', {},
            h('strong', {}, `Area ${c.area} · ${c.nodoTitolo}`), h('p', {}, c.domanda),
            h('details', {}, h('summary', {}, 'Mostra il riferimento'), h('p', {}, c.risposta)),
            h('button', { type: 'button', class: 'link', onclick: () => onOpen(c.nodoId) }, 'Apri la lezione')))))
          : h('p', { class: 'muted' }, 'Gli spunti a spirale compariranno quando avrai visto alcuni nodi.'),
      );
    },
  };
}
