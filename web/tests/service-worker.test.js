import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('service worker: precache versionata, rimozione selettiva e cache-first nello scope', async () => {
  const handlers = {}, stores = new Map(), added = [], deleted = [];
  const scope = 'https://example.test/app/';
  const prefix = `tecweb-kg:${encodeURIComponent(scope)}:`;
  const cacheFor = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const contents = stores.get(name);
    return {
      async addAll(urls) { added.push(...urls); for (const url of urls) contents.set(url, { marker: 'cached' }); },
      async match(req) { return contents.get(typeof req === 'string' ? req : req.url); },
      async put(req, response) { contents.set(req.url, response); },
    };
  };
  stores.set(prefix + 'old', new Map()); stores.set('altro-progetto', new Map());
  const caches = { open: async (n) => cacheFor(n), keys: async () => [...stores.keys()], delete: async (n) => { deleted.push(n); stores.delete(n); } };
  let network = 0;
  const self = { registration: { scope }, __KG_BUILD__: { versione: 'new', files: ['./', './index.html', './graph.json'] },
    addEventListener: (event, cb) => { handlers[event] = cb; }, skipWaiting: async () => {}, clients: { claim: async () => {} } };
  const worker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  runInNewContext(worker, { self, caches, URL, Response, importScripts() {},
    fetch: async () => { network++; return { ok: true, clone() { return this; } }; } });
  const wait = async (event) => { let promise; handlers[event]({ waitUntil: (p) => { promise = p; } }); await promise; };
  await wait('install');
  assert.deepEqual(added, [scope, scope + 'index.html', scope + 'graph.json']);
  await wait('activate');
  assert.deepEqual(deleted, [prefix + 'old']); assert.ok(stores.has('altro-progetto'));
  let response;
  handlers.fetch({ request: { method: 'GET', url: scope + 'graph.json', mode: 'cors' }, respondWith: (p) => { response = p; } });
  assert.equal((await response).marker, 'cached'); assert.equal(network, 0);
  response = null;
  handlers.fetch({ request: { method: 'GET', url: 'https://example.test/other/graph.json', mode: 'cors' }, respondWith: (p) => { response = p; } });
  assert.equal(response, null);
});

test('service worker: quota o cache indisponibile non blocca la risposta di rete', async () => {
  const handlers = {}, scope = 'https://example.test/app/';
  const self = { registration: { scope }, __KG_BUILD__: { versione: 'v', files: [] }, addEventListener: (k, fn) => { handlers[k] = fn; } };
  const response = { ok: true, marker: 'rete', clone() { return this; } };
  let brokenOpen = false;
  const caches = { open: async () => {
    if (brokenOpen) throw Error('cache non disponibile');
    return { match: async () => null, put: async () => { throw Error('quota'); } };
  } };
  runInNewContext(readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), { self, caches, URL, Response, importScripts() {}, fetch: async () => response });
  const request = { method: 'GET', url: scope + 'lezione.js', mode: 'cors' };
  for (const broken of [false, true]) {
    brokenOpen = broken;
    let output;
    handlers.fetch({ request, respondWith: (p) => { output = p; } });
    assert.equal((await output).marker, 'rete');
  }
});
