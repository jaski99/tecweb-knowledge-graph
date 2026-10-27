// Percorso in ordine topologico; la modalità guidata suggerisce, non blocca.
import { h, clear } from './dom.js';
import { areaBadge, tipoBadge, prioBadge, masteryBadge } from './badges.js';
import { prerequisitiSoddisfatti } from '../core/study-state.js';
import { studyStatusSelect } from './study-status.js';
import { formatMinuti } from '../core/progress.js';
import { hasLesson } from '../core/lesson.js';

export function createPathView(root, graph, { onSelect, onToggleDone, onOpenLesson, onSetStatus }) {
  return {
    render({ visible, done, selected, statiStudio = {}, mastery = new Map(), guidata = false }) {
      const ids = graph.order.filter((id) => visible.has(id));
      const active = root.ownerDocument.activeElement?.id;
      clear(root);
      if (!ids.length) { root.append(h('p', { class: 'muted' }, 'Nessun nodo corrisponde ai filtri.')); return; }
      root.append(h('ol', { class: 'path' }, ids.map((id) => {
        const n = graph.byId.get(id);
        const blocked = !prerequisitiSoddisfatti(n, statiStudio);
        return h('li', { class: ['step', done.has(id) && 'done', id === selected && 'sel', guidata && !blocked && !done.has(id) && statiStudio[id] !== 'so-gia' && 'recommended'].filter(Boolean).join(' ') },
          h('input', { type: 'checkbox', id: `chk-${id}`, checked: done.has(id), 'aria-label': `Segna come completato: ${n.title}`, onchange: (e) => onToggleDone(id, e.target.checked) }),
          h('div', {},
            h('button', { type: 'button', class: 'link title', onclick: () => onSelect(id) }, n.title),
            onOpenLesson ? h('button', { type: 'button', class: 'lesson-chip' + (hasLesson(n) ? ' ready' : ''), 'aria-label': `Apri lezione: ${n.title}`, onclick: () => onOpenLesson(id) }, hasLesson(n) ? '📖 Lezione' : '📖 Scheda') : null,
            onSetStatus ? studyStatusSelect(n, statiStudio[id], onSetStatus) : null,
            h('div', { class: 'badges' }, areaBadge(n, graph.aree), tipoBadge(n), prioBadge(n), masteryBadge(mastery.get(id)),
              h('span', { class: 'badge' }, '⏱ ' + formatMinuti(n.tempo_studio_min)),
              blocked && !done.has(id) ? h('span', { class: 'badge warn', title: 'Prerequisiti indispensabili non completati' }, 'prerequisiti mancanti') : null,
              guidata && !blocked && !done.has(id) && statiStudio[id] !== 'so-gia' ? h('span', { class: 'badge' }, 'consigliato nel percorso guidato') : null)));
      })));
      if (active?.startsWith('status-') || active?.startsWith('chk-')) root.ownerDocument.getElementById(active)?.focus({ preventScroll: true });
    },
  };
}
