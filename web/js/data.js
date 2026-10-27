// Caricamento del grafo e della banca quiz opzionale, con tolleranza ai file assenti.
import { validateGraph } from './core/validate.js';
import { topoOrder } from './core/topo.js';

async function readJson(url, fetchFn) {
  const response = await fetchFn(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function readOptionalQuiz(urls, fetchFn) {
  for (const url of urls || []) {
    try { return await readJson(url, fetchFn); }
    catch { /* banca non ancora pubblicata o rete indisponibile */ }
  }
  return null;
}

/** Con deferQuiz le lezioni non aspettano una banca quiz lenta o irraggiungibile. */
export async function loadGraph(urls, fetchFn = fetch, quizUrls = null, { deferQuiz = false } = {}) {
  const tried = [];
  for (const url of urls) {
    let graph;
    try { graph = await readJson(url, fetchFn); }
    catch (e) { tried.push(`${url}: ${e.message}`); continue; }
    const prepared = prepare(graph);
    const quizPronto = readOptionalQuiz(quizUrls, fetchFn).then((quiz) => {
      if (quiz !== null) prepared.quiz = quiz;
      return quiz;
    });
    if (deferQuiz) prepared.quizPronto = quizPronto;
    else await quizPronto;
    return prepared;
  }
  throw new Error('Impossibile caricare graph.json (' + tried.join('; ') + ')');
}

export function prepare(g) {
  const errors = validateGraph(g);
  if (errors.length) { const e = new Error('graph.json non valido: ' + errors.slice(0, 5).join('; ')); e.validation = true; throw e; }
  const byId = new Map(g.nodi.map((n) => [n.id, n]));
  const order = topoOrder(g.nodi);
  return { ...g, byId, order };
}
