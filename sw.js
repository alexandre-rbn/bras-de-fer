// Service worker minimal : rend l'appli installable et garde l'écran de démarrage en cache.
// Réseau d'abord : une mise à jour de index.html est prise en compte tout de suite.
const CACHE = 'bras-de-fer-v1';
const FICHIERS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png',
                  'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return; // Google : jamais intercepté
  e.respondWith(
    fetch(e.request)
      .then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request))
  );
});
