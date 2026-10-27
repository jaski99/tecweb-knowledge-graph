import { h } from '../dom.js';
import { correggi } from './correzione.js';

export function controlliRisposta(item, risposta, cambia, disabled = false) {
  const attrs = { disabled };
  const group = h('fieldset', attrs, h('legend', {}, item.nodoTitolo || item.id));
  const radio = (id, testo, value) => h('label', { class: 'sim-opzione' }, h('input', {
    type: 'radio', name: `risposta-${item.id}`, value: id, checked: risposta === value,
    onchange: () => cambia(value),
  }), ` ${testo}`);
  if (item.tipo === 'scelta_multipla') group.append(...item.opzioni.map((o) => radio(o.id, o.testo, o.id)));
  else if (item.tipo === 'vero_falso') group.append(radio('vero', 'Vero', true), radio('falso', 'Falso', false));
  else if (item.tipo === 'abbinamento') item.abbinamenti.forEach((pair, i) => {
    group.append(h('label', { class: 'sim-opzione' }, pair.elemento, h('select', {
      'aria-label': `Abbina ${pair.elemento}`,
      onchange: (event) => { risposta = { ...risposta, [i]: event.target.value }; cambia(risposta); },
    }, h('option', { value: '' }, 'Scegli una descrizione'), ...item.opzioni.map((o) => h('option', {
      value: o.id, selected: risposta?.[i] === o.id,
    }, o.testo)))));
  });
  else if (item.tipo === 'completamento_codice') {
    group.append(h('pre', {}, h('code', {}, item.codice_con_buchi)));
    Object.keys(item.soluzioni).forEach((k) => group.append(h('label', { class: 'sim-opzione' }, `Completamento ${k}`, h('input', {
      type: 'text', value: risposta?.[k] || '', autocomplete: 'off', spellcheck: false,
      onchange: (event) => { risposta = { ...risposta, [k]: event.target.value }; cambia(risposta); },
    }))));
  } else group.append(h('label', {}, 'La tua risposta', h('textarea', {
    class: 'sim-input', oninput: (event) => cambia(event.target.value),
  }, risposta || '')));
  return group;
}

export function feedbackItem(item, risposta) {
  const result = correggi(item, risposta);
  const box = h('section', { class: 'sim-soluzione-testo', role: 'status' },
    h('h4', {}, result === null ? 'Confronto autovalutativo' : result ? 'Risposta corretta' : 'Risposta non corretta o incompleta'),
    h('p', {}, item.soluzione));
  if (item.tipo === 'scelta_multipla') box.append(h('ul', {}, ...item.opzioni.map((o) => h('li', {},
    `${o.id === item.risposta_corretta ? 'Corretta' : 'Non corretta'}: ${o.testo}. ${o.spiegazione || item.spiegazione}`))));
  if (item.tipo === 'vero_falso') box.append(h('p', {}, `Risposta attesa: ${item.risposta_corretta ? 'Vero' : 'Falso'}.`));
  if (item.tipo === 'abbinamento') {
    box.append(h('ul', {}, ...item.abbinamenti.map((p) => h('li', {},
      `${p.elemento} → ${item.opzioni.find((o) => o.id === p.risposta_id)?.testo}. ${p.spiegazione}`)),
    ...item.distrattori.map((d) => h('li', {}, `Distrattore ${d.tipo}: ${d.testo}. ${d.spiegazione}`))));
  }
  if (item.tipo === 'completamento_codice') box.append(h('ul', {}, ...Object.entries(item.soluzioni).map(([k, v]) => h('li', {}, `${k}: ${v.join(' / ')}`))));
  return box;
}
