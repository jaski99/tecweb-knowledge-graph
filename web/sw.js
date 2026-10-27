/* Precache atomica, versionata dal contenuto e confinata allo scope della PWA. */
importScripts('./precache.js');
const PREFIX = `tecweb-kg:${encodeURIComponent(self.registration.scope)}:`;
const CACHE = PREFIX + self.__KG_BUILD__.versione;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(self.__KG_BUILD__.files.map((path) => new URL(path, self.registration.scope).href));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    let cache = null;
    try {
      cache = await caches.open(CACHE);
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (cached) return cached;
    } catch { /* cache non disponibile: la rete può comunque aprire la lezione */ }
    try {
      const response = await fetch(request);
      if (response.ok && cache) {
        try { await cache.put(request, response.clone()); } catch { /* quota piena: mantieni la risposta di rete */ }
      }
      return response;
    } catch {
      if (request.mode === 'navigate' && cache) {
        try { return (await cache.match(new URL('./index.html', self.registration.scope).href)) || Response.error(); } catch { /* cache indisponibile */ }
      }
      return Response.error();
    }
  })());
});
