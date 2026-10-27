// Controlli dei filtri: il metodo toggle consente alla legenda di usare gli stessi filtri.
import { h, append } from './dom.js';
import { TIPO_LABEL, PRIO_LABEL } from '../config.js';

export function createFiltersView(root, graph, { onChange, initial }) {
  const f = { ...initial, aree: new Set(initial.aree), tipi: new Set(initial.tipi), priorita: new Set(initial.priorita) };
  const emit = () => onChange({ ...f, aree: new Set(f.aree), tipi: new Set(f.tipi), priorita: new Set(f.priorita) });
  const group = (legend, key, items) => h('fieldset', {}, h('legend', {}, legend),
    items.map(([val, label]) => h('label', { class: 'chip' },
      h('input', { type: 'checkbox', 'data-filter-group': key, 'data-filter-value': String(val), onchange: (e) => { e.target.checked ? f[key].add(val) : f[key].delete(val); emit(); } }), ' ', label)));
  let t;
  const stato = (val, label) => h('label', { class: 'chip' },
    h('input', { type: 'radio', name: 'stato-studio', value: val, checked: f.stato === val, onchange: () => { f.stato = val; emit(); } }), ' ', label);
  append(root,
    h('label', { class: 'search' }, h('span', { class: 'sr-only' }, 'Cerca nel titolo, nel sapere e nella lezione'),
      h('input', { id: 'search', type: 'search', autocomplete: 'off', placeholder: 'Cerca titolo, sapere, lezione…  (/)',
        'aria-keyshortcuts': '/', oninput: (e) => { clearTimeout(t); t = setTimeout(() => { f.q = e.target.value; emit(); }, 120); } })),
    group('Area', 'aree', graph.aree.map((a) => [a.id, `${a.id}. ${a.titolo}${a.id === 7 ? ' — serve per la lode [F1]' : ''}`])),
    group('Tipo', 'tipi', Object.entries(TIPO_LABEL)),
    group('Priorità', 'priorita', Object.entries(PRIO_LABEL)),
    h('fieldset', {}, h('legend', {}, 'Stato'),
      stato('tutti', 'Tutti'), stato('aperti', 'Da studiare'), stato('fatti', 'Già studiati'),
      stato('in-corso', 'In corso'), stato('so-gia', 'So già')),
    h('label', { class: 'chip' }, h('input', { id: 'filter-mastery', type: 'checkbox', onchange: (e) => { f.soloNonPadroneggiati = e.target.checked; emit(); } }), ' Solo non padroneggiati'),
  );
  return {
    toggle(key, value) {
      if (key === 'soloNonPadroneggiati') {
        f.soloNonPadroneggiati = !f.soloNonPadroneggiati;
        root.querySelector('#filter-mastery').checked = f.soloNonPadroneggiati;
      } else if (f[key] instanceof Set) {
        f[key].has(value) ? f[key].delete(value) : f[key].add(value);
        for (const input of root.querySelectorAll(`[data-filter-group="${key}"]`)) input.checked = f[key].has(key === 'aree' ? Number(input.dataset.filterValue) : input.dataset.filterValue);
      }
      emit();
    },
  };
}
