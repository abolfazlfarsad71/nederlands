/* Nederlands app — service worker.
   Network-first: whenever the phone is online, the newest index.html is fetched
   and cached; offline, the last cached copy is served. Learner progress is in
   localStorage and is never touched by this worker. This file itself rarely
   needs changing — uploading a new index.html is enough for an update. */
const CACHE = 'nl-app-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cacheKey = req.url.split('?')[0];
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(req, { cache: 'no-store', signal: ctrl.signal });
      clearTimeout(t);
      if (res && res.ok) cache.put(cacheKey, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(cacheKey) || (req.mode === 'navigate' ? await cache.match('./index.html') || await cache.match('index.html') : null);
      return hit || new Response('Offline and not cached yet. Open the app once while online.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
