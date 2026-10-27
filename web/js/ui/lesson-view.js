// Vista Lezione a tutta pagina: spiegazione completa, esempi svolti a passi, autoverifica, navigazione nel percorso.
import { h, clear, append } from './dom.js';
import { areaBadge, tipoBadge, prioBadge } from './badges.js';
import { formatMinuti } from '../core/progress.js';
import { lessonNav, hasLesson, createStepper, nextToStudy } from '../core/lesson.js';
import { navLabel } from '../core/lesson-nav-labels.js';
import { mdElement, renderMermaid, resetMermaid, setMermaidTheme } from './markdown.js';
import { enhanceCodeBlocks } from './code-block.js';
import { frameDiagrams, fitDiagrams } from './diagram.js';
import { bindSectionNav } from './toc.js';
import { syncThemeButtons } from '../core/theme.js';

export function createLessonView(root, graph, { onOpen, onClose, onToggleDone, onToggleTheme, onDataChange, onActivateIA, storage = globalThis.localStorage, closeLabel = '← Percorso' }) {
  const title = (id) => (graph.byId.get(id) || { title: id }).title;
  const lessonLink = (id, text) => h('button', { type: 'button', class: 'link', onclick: () => onOpen(id) }, text || title(id));
  const block = (cls, heading, ...body) => h('section', { class: `ls ${cls}`, id: `sec-${cls}` }, h('h2', {}, heading), ...body);

  function navButton(dir, target, where) {
    const label = navLabel(dir, target ? title(target) : null);
    const arrow = h('span', { 'aria-hidden': 'true' }, dir === 'prev' ? '←' : '→');
    const words = h('span', { class: 'nav-words' },
      h('span', { class: 'nav-full' }, label.full), h('span', { class: 'nav-short', 'aria-hidden': 'true' }, label.short),
      where === 'bottom' && label.title ? h('span', { class: 'nav-title' }, label.title) : null);
    return h('button', { type: 'button', class: `btn nav-${dir}${dir === 'next' ? ' primary' : ''}`, disabled: !target,
      onclick: () => target && onOpen(target), 'aria-label': label.aria },
    ...(dir === 'prev' ? [arrow, ' ', words] : [words, ' ', arrow]));
  }

  function navBar(nav, where) {
    return h('nav', { class: `ls-nav ${where}`, 'aria-label': where === 'top' ? 'Navigazione lezione' : 'Navigazione percorso' },
      navButton('prev', nav.prev, where),
      h('span', { class: 'muted' }, `${nav.pos}/${nav.total}`),
      navButton('next', nav.next, where));
  }

  function workedExample(ex, i) {
    const st = createStepper(ex.passi.length);
    const list = h('ol', { class: 'passi' });
    const sol = h('div', { class: 'ex-sol', hidden: true },
      h('h4', {}, 'Soluzione'), mdElement(ex.soluzione),
      h('h4', {}, 'Perché funziona'), mdElement(ex.perche_funziona));
    const btn = h('button', { type: 'button', class: 'btn primary' });
    const allBtn = h('button', { type: 'button', class: 'btn' }, 'Mostra tutto');
    const sync = () => {
      while (list.children.length < st.shown) {
        const k = list.children.length;
        const li = h('li', { tabindex: '-1' }, mdElement(ex.passi[k], { inline: true, tag: 'span', className: 'md-inline' }));
        list.append(li);
      }
      sol.hidden = !st.solutionShown;
      if (!sol.hidden) {
        frameDiagrams(sol);
        enhanceCodeBlocks(sol);
        renderMermaid(sol).then(() => fitDiagrams(sol)); // i diagrammi nascosti si disegnano solo quando visibili
      }
      btn.textContent = st.label();
      btn.disabled = st.finished;
      allBtn.hidden = st.finished;
    };
    btn.addEventListener('click', () => {
      const before = st.shown;
      st.next(); sync();
      (st.shown > before ? list.lastElementChild : sol).focus?.();
    });
    allBtn.addEventListener('click', () => { st.all(); sync(); });
    sol.tabIndex = -1;
    sync();
    return h('article', { class: 'worked', 'data-example': i },
      h('h3', {}, `Esempio ${i + 1}: ${ex.titolo}`),
      h('div', { class: 'problema' }, h('strong', {}, 'Problema. '), mdElement(ex.problema, { inline: true, tag: 'span', className: 'md-inline' })),
      list, h('div', { class: 'ex-actions' }, btn, allBtn), sol);
  }

  function lessonBodyV4(n) {
    const L = n.lezione;
    const checkedKey = `ids-kg:checklist:${n.id}:v1`;
    let saved = {};
    try { saved = JSON.parse(storage.getItem(checkedKey) || '{}'); } catch { saved = {}; }
    const checklist = (items, prefix) => h('ul', { class: 'lesson-checklist' }, items.map((text, i) => {
      const key = `${prefix}-${i}`;
      return h('li', {}, h('label', { class: 'check' }, h('input', {
        type: 'checkbox', checked: Boolean(saved[key]),
        onchange: (e) => {
          saved[key] = e.target.checked;
          try { storage.setItem(checkedKey, JSON.stringify(saved)); onDataChange?.(); } catch { /* storage non disponibile */ }
        },
      }), text));
    }));
    const def = L.definizione_esame || {};
    const ex = L.worked_example || {};
    const cp = L.completion_problem || {};
    const solo = L.esercizio_autonomo || {};
    const active = L.richiamo_attivo || {};
    const collegamenti = (active.collegamenti_interleaving || []).filter((c) => !graph.nodiInattivi?.has(c.nodo));
    const flash = L.flashcard || {};
    const an = L.analogia || {};
    const contrast = h('table', { class: 'contrast-table' },
      h('caption', {}, 'Confronto tra errori e concetti corretti'),
      h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Errore / distrattore'), h('th', { scope: 'col' }, 'Perché non è corretto'))),
      h('tbody', {}, (L.errori_trappole || []).map((item) => h('tr', {},
        h('td', {}, h('strong', {}, item.errore), h('br'), h('span', { class: 'muted' }, `Distrattore: ${item.distrattore}`)),
        h('td', {}, item.perche_sbagliato)))));
    const worked = ex.titolo ? workedExample({ ...ex, passi: ex.passi || [] }, 0) : null;
    return [
      block('intuizione', '💡 Perché ti serve', h('p', {}, L.perche_ti_serve)),
      block('scenario', '📖 Scenario fil rouge', h('p', {}, L.scenario_fil_rouge)),
      block('definizione', '🎯 Definizione da ricordare',
        h('dl', { class: 'definition-points' }, h('dt', {}, 'Definizione'), h('dd', {}, def.definizione),
          h('dt', {}, 'Scopo o vantaggio'), h('dd', {}, def.scopo_vantaggio), h('dt', {}, 'Esempio'), h('dd', {}, def.esempio))),
      block('analogia', '🔁 Analogia e limite', h('p', {}, an.testo), h('p', {}, h('strong', {}, 'Dove l’analogia non vale: '), an.limite)),
      block('spiegazione', '📘 Spiegazione', mdElement(L.spiegazione)),
      worked ? block('esempi', '✍️ Esempio svolto', h('p', {}, ex.problema), worked) : null,
      block('completion', '🧩 Completa i passaggi', h('h3', {}, cp.titolo), h('p', {}, cp.testo),
        h('ol', {}, (cp.passi_mancanti || []).map((step) => h('li', {}, step))),
        h('details', {}, h('summary', {}, 'Mostra soluzione'), mdElement(cp.soluzione))),
      block('autonomo', '📝 Esercizio autonomo', h('h3', {}, solo.titolo), h('p', {}, solo.testo),
        h('details', {}, h('summary', {}, 'Mostra un suggerimento'), h('p', {}, solo.suggerimento)),
        h('details', {}, h('summary', {}, 'Mostra soluzione attesa'), mdElement(solo.soluzione_attesa))),
      block('errori', '⚠️ Errori e trappole', contrast),
      L.mnemonica ? block('mnemonica', '🧠 Mnemonica', h('p', {}, L.mnemonica)) : null,
      block('richiamo', '🧠 Richiamo attivo',
        h('p', { class: 'muted' }, 'Prova a rispondere prima di rivelare la soluzione.'),
        h('ol', { class: 'quiz' }, (active.domande || []).map((q) => h('li', {}, h('p', { class: 'q' }, q.domanda),
          h('details', {}, h('summary', {}, 'Mostra risposta'), h('div', { class: 'quiz-answer' }, mdElement(q.risposta)),
            h('button', { type: 'button', class: 'btn', onclick: (e) => { e.target.closest('details').open = false; } }, 'Nascondi risposta'))))),
        active.spiega_con_parole_tue ? h('p', {}, h('strong', {}, 'Spiega con parole tue: '), active.spiega_con_parole_tue) : null,
        collegamenti.length ? h('ul', {}, collegamenti.map((c) => h('li', {},
          graph.byId.has(c.nodo) ? lessonLink(c.nodo) : c.nodo, ' — ', c.collegamento))) : null),
      block('riepilogo', '📌 Riepilogo', h('p', {}, L.riepilogo)),
      block('flashcard', '🃏 Flashcard per il ripasso', (() => {
        let retroVisibile = false;
        const button = h('button', { type: 'button', class: 'flashcard', 'aria-pressed': 'false', onclick: (e) => {
          retroVisibile = !retroVisibile;
          e.currentTarget.setAttribute('aria-pressed', String(retroVisibile));
          e.currentTarget.textContent = retroVisibile ? flash.retro : flash.fronte;
          e.currentTarget.setAttribute('aria-label', retroVisibile ? 'Retro della flashcard; tocca per tornare al fronte' : 'Fronte della flashcard; tocca per girare');
        } }, flash.fronte);
        button.setAttribute('aria-label', 'Fronte della flashcard; tocca per girare');
        return button;
      })()),
      block('checklist', '✅ Checklist: so fare / so dire',
        h('h3', {}, 'So fare'), checklist(L.checklist?.so_fare || [], 'fare'),
        h('h3', {}, 'So dire'), checklist(L.checklist?.so_dire || [], 'dire')),
    ].filter(Boolean);
  }

  function lessonBody(n) {
    const L = n.lezione;
    if (L.perche_ti_serve) return lessonBodyV4(n);
    return [
      block('intuizione', '💡 Perché ti serve', h('p', {}, L.intuizione)),
      block('analogia', '🔁 Analogia', h('p', {}, L.analogia)),
      block('prior', '🧩 Cosa sai già e come si collega', h('ul', {}, L.collegamenti_prior.filter((c) => !graph.nodiInattivi?.has(c.nodo)).map((c) => h('li', {},
        h('strong', {}, c.conoscenza), ' — ', c.collegamento, c.nodo ? h('span', {}, ' ', lessonLink(c.nodo, '→ ' + title(c.nodo))) : null)))),
      block('spiegazione', '📘 Spiegazione', mdElement(L.spiegazione)),
      block('esempi', '✍️ Esempi svolti', h('p', { class: 'muted' }, 'Prova a fare ogni passo da solo prima di rivelarlo.'), L.esempi_svolti.map(workedExample)),
      block('errori', '⚠️ Errori comuni', h('ul', {}, L.errori_comuni.map((e) => h('li', {}, mdElement(e, { inline: true, tag: 'span', className: 'md-inline' }))))),
      block('autoverifica', '✅ Autoverifica',
        h('p', { class: 'muted' }, 'La risposta resta nascosta finché non la chiedi. Puoi farla sparire di nuovo.'),
        h('ol', { class: 'quiz' }, L.domande_autoverifica.map((q) => h('li', {},
          h('p', { class: 'q' }, q.domanda),
          h('details', {},
            h('summary', {}, 'Mostra risposta'),
            h('div', { class: 'quiz-answer' }, mdElement(q.risposta)),
            h('button', { type: 'button', class: 'btn', onclick: (e) => { e.target.closest('details').open = false; } }, 'Nascondi risposta')))))),
      block('riepilogo', '📌 Riepilogo', h('ul', {}, L.riepilogo.split('\n').filter((r) => r.trim()).map((r) => h('li', {}, r)))),
    ];
  }

  function fallbackBody(n) {
    return [
      h('p', { class: 'todo' }, 'Lezione completa in preparazione. Intanto ecco la scheda sintetica.'),
      block('intuizione', 'Sapere', h('p', {}, n.sapere)),
      block('prior', 'Saper fare', h('ul', {}, n.saper_fare.map((s) => h('li', {}, s)))),
    ];
  }

  function commonTail(n) {
    return [
      (n.esercizi || []).length ? block('esercizi', '📝 Esercizi tipo d\u2019esame', n.esercizi.map((e) => h('article', { class: 'ex' },
        h('p', { class: 'muted' }, e.tipo_esame), h('p', {}, e.testo),
        h('details', {}, h('summary', {}, 'Mostra soluzione'), h('p', { class: 'sol' }, e.soluzione))))) : null,
      n.prerequisiti.length ? block('prereq', 'Prerequisiti', h('ul', {}, n.prerequisiti.map((p) => h('li', {}, lessonLink(p.id), ' ',
        h('span', { class: `badge forza-${p.forza}` }, p.forza === 'hard' ? 'indispensabile' : 'utile'))))) : null,
      block('approfondimento', 'Per approfondire (facoltativo)',
        h('ul', {}, n.risorse.map((r) => h('li', {}, h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer' }, r.titolo))),
          (n.riferimenti_testo || []).map((r) => h('li', {}, graph.testi[r.libro] || r.libro, r.capitolo_o_sezione ? ' — ' + r.capitolo_o_sezione : '')))),
    ];
  }

  // Fine lezione: un solo tocco per segnarla e passare alla prossima non ancora studiata del percorso.
  function finishBar(n, nav, done, esclusi) {
    const target = nextToStudy(graph.order, new Set([...done, ...esclusi, n.id]), n.id);
    const go = () => { onToggleDone(n.id, true); if (target) onOpen(target); };
    return h('div', { class: 'ls-finish' },
      h('button', { type: 'button', class: 'btn primary big', 'data-action': 'done-next', onclick: go },
        target ? '✓ Segna come studiato e vai alla prossima' : '✓ Segna come studiato'),
      target ? h('p', { class: 'muted' }, 'Prossima: ', h('strong', {}, title(target)), target !== nav.next ? ' (salta quelle già studiate)' : '') : h('p', { class: 'muted' }, 'Non ci sono altri nodi da studiare nel percorso.'));
  }

  let detachNav = () => {};
  let mediaToken = 0;
  return {
    async render(id, done, esclusi = done) {
      detachNav();
      detachNav = () => {};
      clear(root);
      const n = graph.byId.get(id);
      if (!n) {
        if (graph.nodiInattivi?.has(id) && onActivateIA) {
          const status = h('p', { role: 'status', class: 'error' });
          append(root,
            h('div', { class: 'ls-top' }, h('button', { type: 'button', class: 'btn', onclick: onClose }, closeLabel)),
            h('article', { class: 'lesson' },
              h('h1', { id: 'lesson-title', tabindex: '-1' }, 'Modulo IA (secondo semestre) disattivato'),
              h('button', { type: 'button', class: 'btn primary', id: 'attiva-modulo-ia', onclick: () => {
                if (!onActivateIA()) status.textContent = 'Il browser non permette di salvare la preferenza.';
              } }, 'Attiva il modulo IA'), status));
        } else append(root, h('p', { class: 'error' }, `Nodo "${id}" non trovato.`), h('button', { type: 'button', class: 'btn', onclick: onClose }, '← Torna al grafo'));
        return;
      }
      const nav = lessonNav(graph.order, id);
      const toc = h('nav', { class: 'toc', 'aria-label': 'Indice della lezione' });
      const progressLabel = h('p', { class: 'section-progress-label' });
      const progressFill = h('span');
      const progressBar = h('div', {
        class: 'section-progress-track', role: 'progressbar',
        'aria-valuemin': '1', 'aria-valuemax': '1', 'aria-valuenow': '1',
        'aria-label': 'Avanzamento nelle sezioni della lezione',
      }, progressFill);
      const article = h('article', { class: 'lesson', 'data-node': n.id },
        h('header', {},
          h('h1', { id: 'lesson-title', tabindex: '-1' }, n.title),
          h('p', { class: 'badges' }, areaBadge(n, graph.aree), tipoBadge(n), prioBadge(n), h('span', { class: 'badge' }, '⏱ ' + formatMinuti(n.tempo_studio_min)),
            hasLesson(n) ? null : h('span', { class: 'badge warn' }, 'lezione TODO')),
          h('label', { class: 'check big' }, h('input', { type: 'checkbox', checked: done.has(n.id), onchange: (e) => onToggleDone(n.id, e.target.checked) }), ' Ho capito: segna come completato')),
        ...(hasLesson(n) ? lessonBody(n) : fallbackBody(n)),
        ...commonTail(n));
      append(root,
        h('div', { class: 'ls-top' },
          h('button', { type: 'button', class: 'btn', onclick: onClose }, closeLabel),
          onToggleTheme ? h('div', { class: 'ls-tools' }, h('button', { type: 'button', class: 'btn', 'data-theme-toggle': '1', onclick: onToggleTheme })) : null,
          navBar(nav, 'top')),
        h('div', { class: 'section-progress' }, progressLabel, progressBar),
        h('div', { class: 'lesson-frame' },
          toc,
          h('div', { class: 'lesson-col' }, article, finishBar(n, nav, done, esclusi), navBar(nav, 'bottom'))),
      );
      detachNav = bindSectionNav(toc, { label: progressLabel, bar: progressBar, fill: progressFill }, article);
      syncThemeButtons(root.ownerDocument, root.ownerDocument.documentElement.dataset.theme || 'light');
      frameDiagrams(root);
      enhanceCodeBlocks(root);
      const token = ++mediaToken;
      await renderMermaid(root);
      if (token === mediaToken) fitDiagrams(root);
    },
    setTheme(name) { setMermaidTheme(name); },
    async refreshDiagrams(name) {
      const token = ++mediaToken;
      setMermaidTheme(name);
      resetMermaid(root);
      await renderMermaid(root);
      if (token === mediaToken) fitDiagrams(root);
    },
    focus() { root.querySelector('#lesson-title')?.focus({ preventScroll: true }); },
  };
}
