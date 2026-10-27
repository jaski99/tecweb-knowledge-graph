// Controllo condiviso da percorso e dettagli, senza dipendenze tra le viste.
import { h } from './dom.js';
import { STATI_STUDIO } from '../core/study-state.js';

export function opzioniStato(stato) {
  return Object.entries(STATI_STUDIO).map(([value, label]) => ({ value, label, selected: (stato || 'non-iniziato') === value }));
}

export function studyStatusSelect(n, stato, onSetStatus, prefix = 'status') {
  return h('label', { class: 'study-status' }, h('span', { class: 'sr-only' }, `Stato di studio: ${n.title}`),
    h('select', { id: `${prefix}-${n.id}`, 'aria-label': `Stato di studio: ${n.title}`, onchange: (e) => onSetStatus(n.id, e.target.value) },
      opzioniStato(stato).map(({ value, label, selected }) => h('option', { value, selected }, label))));
}
