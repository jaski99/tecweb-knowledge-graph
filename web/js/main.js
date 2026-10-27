// Composition root: collega dati, stato e viste; nessuna lezione è bloccata.
import { graphUrls, quizUrls, STORAGE_KEYS } from './config.js';
import { loadGraph } from './data.js';
import { createState } from './core/state.js';
import { createSetStore } from './core/store.js';
import { createStudyStore } from './core/study-state.js';
import { padronanzaNodi } from './core/mastery.js';
import { caricaLettoreEsiti } from './core/esiti-reader.js';
import { emptyFilters, applyFilters } from './core/filters.js';
import { eventShouldFocusSearch } from './core/search.js';
import { createGraphView } from './ui/graph-view.js';
import { createGraphLegend } from './ui/graph-legend.js';
import { createMinimap } from './ui/minimap.js';
import { createGraphMobileList } from './ui/graph-mobile-list.js';
import { createDetailsView } from './ui/details.js';
import { createPathView } from './ui/path.js';
import { createProgressView } from './ui/progress-view.js';
import { createFiltersView } from './ui/filters-view.js';
import { createReviewView } from './ui/review.js';
import { createTodayView } from './ui/today.js';
import { createBackupView } from './ui/backup-view.js';
import { initTabs } from './ui/tabs.js';
import { createLessonView } from './ui/lesson-view.js';
import { parseRoute, lessonHash, nextToStudy } from './core/lesson.js';
import { h, clear } from './ui/dom.js';
import { avviaModuli } from '../modules/avvia.js';
import { costruisciMazzo } from '../modules/ripasso/mazzo.js';
import { leggiStato } from '../modules/ripasso/store.js';
import { createThemeController, syncThemeButtons } from './core/theme.js';
import { avviaPWA } from './pwa.js';

const $ = (s) => document.querySelector(s);

async function main() {
  avviaPWA({ win: window, nav: navigator, status: $('#offline-status') });
  let graph;
  try { graph = await loadGraph(graphUrls(), fetch, quizUrls(), { deferQuiz: true }); }
  catch (e) { $('#status').textContent = e.message; $('#status').classList.add('error'); return; }
  $('#status').textContent = '';
  $('#exam-note').textContent = graph.nota_esame || '';
  $('#course').textContent = [graph.corso?.nome, graph.corso?.docente].filter(Boolean).join(' — ');

  const mediaMobile = matchMedia('(max-width: 720px)');
  if (mediaMobile.matches) document.querySelectorAll('.side details').forEach((d) => { d.open = false; });
  const doneStore = createSetStore(localStorage, STORAGE_KEYS.done);
  const reviewStore = createSetStore(localStorage, STORAGE_KEYS.review);
  const studyStore = createStudyStore(localStorage, STORAGE_KEYS.studyStates, doneStore);
  const state = createState({ filters: emptyFilters(), done: doneStore.values(), statiStudio: studyStore.values(), selected: null,
    depth: 'tutto', soloPrerequisiti: false, forze: new Set(['hard', 'soft']), guidata: false });
  const mazzo = costruisciMazzo(graph.nodi);
  let leggiEsiti = null;
  const dataChanged = () => state.set({});
  const select = (id) => state.set({ selected: id });
  const setStatus = (id, stato) => {
    const salvato = studyStore.set(id, stato);
    $('#status').textContent = salvato ? '' : 'Il browser non ha salvato lo stato di studio; potrebbe andare perso al ricaricamento.';
    state.set({ done: doneStore.values(), statiStudio: studyStore.values() });
  };
  const toggleDone = (id, on) => setStatus(id, on ? 'completato' : 'non-iniziato');
  const openLesson = (id) => { location.hash = lessonHash(id); };
  const details = createDetailsView($('#details'), graph, { onSelect: select, onToggleDone: toggleDone, onSetStatus: setStatus,
    onClose: () => state.set({ selected: null }), onOpenLesson: openLesson });
  const lesson = createLessonView($('#lesson'), graph, { onOpen: openLesson, onClose: () => { location.hash = '#/percorso'; },
    onToggleDone: toggleDone, onDataChange: dataChanged, storage: localStorage, onToggleTheme: () => theme.toggle() });
  const views = [
    createGraphView($('#cy'), graph, { onSelect: select, onOpen: openLesson }),
    createPathView($('#path'), graph, { onSelect: select, onToggleDone: toggleDone, onSetStatus: setStatus, onOpenLesson: openLesson }),
    createProgressView($('#progress'), graph),
    createReviewView($('#review'), graph, reviewStore, { onSelect: select }),
  ];
  const filtersView = createFiltersView($('#filters'), graph, { initial: emptyFilters(), onChange: (filters) => state.set({ filters }) });
  const [graphView] = views;
  window.cyInstance = graphView.cytoscape; // API per i test del layout esistenti
  const graphList = createGraphMobileList($('#graph-mobile-list'), graph, { onSelect: select, onOpen: openLesson });
  let elencoDesktop = false;
  const syncList = () => {
    const visible = mediaMobile.matches || elencoDesktop;
    $('#graph-mobile-list').hidden = !visible;
    $('#graph-list-toggle').setAttribute('aria-expanded', String(visible));
    $('#graph-list-toggle').textContent = visible ? 'Nascondi elenco del grafo' : 'Vista elenco del grafo';
  };
  $('#graph-list-toggle').addEventListener('click', () => { elencoDesktop = !elencoDesktop; syncList(); });
  mediaMobile.addEventListener?.('change', syncList);
  syncList();
  const legend = createGraphLegend($('#graph-legend'), graph, {
    onFilter: (key, value) => filtersView.toggle(key, value),
    onEdge: (val) => { const forze = new Set(state.get().forze); forze.has(val) ? forze.delete(val) : forze.add(val); state.set({ forze }); },
    onDepth: (depth) => state.set({ depth }), onPrereq: (soloPrerequisiti) => state.set({ soloPrerequisiti }),
    onCenter: () => { const id = nextToStudy(graph.order, satisfied(state.get()), null); if (id) select(id); },
  });
  document.querySelectorAll('input[name="path-mode"]').forEach((input) => input.addEventListener('change', () => state.set({ guidata: input.value === 'guidata' })));

  const themeBtn = h('button', { type: 'button', class: 'btn', 'data-theme-toggle': '1' });
  $('#theme').append(themeBtn);
  const theme = createThemeController({ storage: localStorage, prefersDark: matchMedia('(prefers-color-scheme: dark)').matches,
    media: matchMedia('(prefers-color-scheme: dark)'), apply(name) {
      document.documentElement.dataset.theme = name; syncThemeButtons(document, name); graphView.setTheme(name);
      if ($('#lesson').hidden) lesson.setTheme(name); else lesson.refreshDiagrams(name);
    } });
  themeBtn.addEventListener('click', () => theme.toggle());
  const minimap = createMinimap($('#minimap'), graphView.cytoscape);
  theme.subscribe(() => minimap.redraw());
  $('#zoom-in').addEventListener('click', () => graphView.zoomBy(1.25));
  $('#zoom-out').addEventListener('click', () => graphView.zoomBy(1 / 1.25));
  $('#zoom-fit').addEventListener('click', () => graphView.fit());
  const readLast = () => { try { return localStorage.getItem(STORAGE_KEYS.last); } catch { return null; } };
  const saveLast = (id) => { try { localStorage.setItem(STORAGE_KEYS.last, id); } catch { /* storage non disponibile */ } };
  function satisfied(s) { return new Set([...s.done, ...Object.entries(s.statiStudio).filter(([, v]) => v === 'so-gia').map(([id]) => id)]); }
  const renderResume = (s) => {
    const box = $('#resume'); clear(box);
    const complete = satisfied(s), last = graph.byId.has(readLast()) ? readLast() : null;
    const next = nextToStudy(graph.order, complete, null);
    const btn = (id, label, cls) => h('button', { type: 'button', class: `btn ${cls}`, onclick: () => openLesson(id) }, label, h('strong', {}, graph.byId.get(id).title));
    if (last && !complete.has(last)) box.append(btn(last, '▶ Riprendi: ', 'primary'));
    if (next && next !== last) box.append(btn(next, last && !complete.has(last) ? 'Prossima da studiare: ' : '▶ Inizia: ', last && !complete.has(last) ? '' : 'primary'));
    if (!next) box.append(h('p', { class: 'muted' }, 'Non ci sono altri nodi da studiare nel percorso; puoi usare il ripasso.'));
    box.hidden = !box.children.length;
  };
  const today = createTodayView($('#today'), graph, { storage: localStorage, carte: mazzo, onOpen: openLesson, onChange: dataChanged });
  createBackupView($('#backup-panel'), { storage: localStorage, getEsitiReader: () => leggiEsiti,
    confirm: (msg) => window.confirm(msg), reload: () => location.reload() });
  initTabs(document, (name) => { if (name === 'grafo') graphView.resize(); });
  const moduli = avviaModuli({ document, graph, storage: localStorage, toggleTheme: () => theme.toggle(), onDataChange: dataChanged });
  syncThemeButtons(document, theme.get());

  const render = (s) => {
    const checklist = new Set();
    for (const n of graph.nodi) {
      try { if (Object.values(JSON.parse(localStorage.getItem(`ids-kg:checklist:${n.id}:v1`) || '{}')).some((v) => v === true)) checklist.add(n.id); }
      catch { /* checklist corrotta: non influenza la padronanza */ }
    }
    let esiti = [];
    try { const letti = leggiEsiti?.(localStorage); if (Array.isArray(letti)) esiti = letti; } catch { /* X6 assente o storage non disponibile */ }
    const mastery = padronanzaNodi(graph.nodi, { done: s.done, statiStudio: s.statiStudio, checklist, esiti, carte: mazzo, statiCarte: leggiStato(localStorage).carte });
    const visible = new Set(applyFilters(graph.nodi, s.filters, s.done, mastery, s.statiStudio).map((n) => n.id));
    const vm = { ...s, visible, mastery };
    views.forEach((v) => (v.update || v.render).call(v, vm));
    graphList.update(vm); legend.update(vm);
    details.render(s.selected, s.done, mastery, s.statiStudio);
    today.render(vm); renderResume(s);
    const nodo = graph.byId.get(s.selected);
    $('#graph-announcement').textContent = nodo ? `Nodo selezionato: ${nodo.title}, area ${nodo.area}.` : '';
    $('#count').textContent = `${visible.size}/${graph.nodi.length} nodi visibili`;
  };
  state.subscribe(render);
  render(state.get());
  // Il modulo opzionale viene caricato dopo il primo render: non ritarda mai le lezioni.
  caricaLettoreEsiti(Boolean(globalThis.__KG_BUILD__?.esitiDisponibili)).then((reader) => { leggiEsiti = reader; if (reader) dataChanged(); });

  const route = async () => {
    const moduloAttivo = moduli.mostra(location.hash);
    document.body.classList.toggle('module-mode', moduloAttivo);
    const r = parseRoute(location.hash);
    document.body.classList.toggle('lesson-mode', Boolean(r));
    $('#lesson').hidden = !r;
    if (r) {
      saveLast(r.id); state.set({ selected: r.id });
      const drawn = lesson.render(r.id, state.get().done, satisfied(state.get()));
      scrollTo(0, 0); lesson.focus();
      if (r.sezione === 'richiamo') $('#sec-richiamo')?.scrollIntoView({ block: 'start' });
      await drawn;
    } else if (location.hash === '#/percorso') {
      $('#tab-percorso').click();
      const last = readLast(), item = last && document.getElementById(`chk-${last}`);
      if (item) item.closest('li').scrollIntoView({ block: 'center' });
    } else { graphView.resize(); }
    // I risultati registrati da X6 sono letti quando si torna a una vista.
    if (!moduloAttivo) dataChanged();
  };
  addEventListener('hashchange', route); route();
  addEventListener('keydown', (e) => {
    if (eventShouldFocusSearch(e) && !document.body.classList.contains('lesson-mode')) {
      const input = document.getElementById('search');
      if (input) { e.preventDefault(); input.focus(); input.select(); }
      return;
    }
    if (e.key !== 'Escape') return;
    if (e.target?.closest?.('textarea, input, select')) { if (e.target.id === 'search') e.target.blur(); return; }
    if (parseRoute(location.hash)) location.hash = '#/percorso';
    else if (document.body.classList.contains('module-mode')) location.hash = '#/';
    else if (state.get().selected) state.set({ selected: null });
  });
}
main();
