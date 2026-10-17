/* Nederlands app — service worker (v2).
   App files: network-first — whenever the phone is online the newest index.html is fetched and cached; offline, the
   last cached copy is served. Audio (audio/*.mp3): cache-first — a lesson's recordings are downloaded once and then
   served from the cache, with byte-range support so the media player can seek inside a file, online or offline.
   Learner progress is in localStorage and is never touched by this worker. */
const CACHE = 'nl-app-v3';
const AUDIO = 'nl-audio-v1';
const filling = new Set();
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== AUDIO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function audioResponse(req) {
  const key = req.url.split('?')[0];
  const cache = await caches.open(AUDIO);
  let full = await cache.match(key);
  if (!full) {
    // not cached yet: answer this request straight from the network (so the first clip plays at once)
    // and download the whole file into the cache in the background for next time
    if (!filling.has(key)) { filling.add(key); fetch(key, { cache: 'no-store' }).then(r => { if (r && r.ok) return cache.put(key, r); }).catch(() => { }).finally(() => filling.delete(key)); }
    return fetch(req);
  }
  const buf = await full.arrayBuffer();
  const total = buf.byteLength;
  const range = req.headers.get('range');
  if (!range) return new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': String(total), 'Accept-Ranges': 'bytes' } });
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let s = m && m[1] ? parseInt(m[1], 10) : 0, e = m && m[2] ? parseInt(m[2], 10) : total - 1;
  if (m && !m[1] && m[2]) { s = Math.max(0, total - parseInt(m[2], 10)); e = total - 1; }
  e = Math.min(e, total - 1);
  if (s > e) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + total } });
  return new Response(buf.slice(s, e + 1), { status: 206, headers: { 'Content-Type': 'audio/mpeg', 'Content-Range': 'bytes ' + s + '-' + e + '/' + total, 'Content-Length': String(e - s + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (/\.mp3(\?|$)/.test(req.url)) { e.respondWith(audioResponse(req)); return; }
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
