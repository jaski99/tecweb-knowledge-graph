import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { avviaPWA, testoRete } from '../js/pwa.js';

test('stato offline e registrazione tollerante del service worker', async () => {
  const handlers = new Map(), calls = [];
  const win = { addEventListener: (k, f) => handlers.set(k, f), removeEventListener: (k) => handlers.delete(k) };
  const nav = { onLine: true, serviceWorker: { register: async (...args) => { calls.push(args); } } };
  const status = {};
  const destroy = avviaPWA({ win, nav, status });
  assert.equal(status.hidden, true); assert.equal(calls[0][0], './sw.js');
  nav.onLine = false; handlers.get('offline')();
  assert.match(status.textContent, /offline/); assert.equal(status.hidden, false);
  nav.onLine = true; handlers.get('online')(); assert.equal(status.hidden, true);
  destroy(); assert.equal(handlers.size, 0); assert.equal(testoRete(true), '');
});

test('manifest e dipendenze sono locali e versionati', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const manifest = JSON.parse(readFileSync(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /https?:\/\/(?:unpkg|cdn\.jsdelivr)/);
  assert.equal(manifest.scope, './'); assert.equal(manifest.icons.length, 2);
  assert.match(sw, /__KG_BUILD__\.versione/); assert.match(sw, /cache\.addAll/);
});
