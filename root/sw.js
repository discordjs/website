const GITHUB_ORG = 'https://raw.githubusercontent.com/discordjs/';

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  event.respondWith(url.origin === location.origin ? cacheFirst(req) : networkFirst(req));
});

async function fetchAndCache(req, cacheName) {
  const res = await fetch(req);
  const cache = await caches.open(cacheName);
  cache.put(req, res.clone());
  return res;
}

async function cacheFirst(req) {
  return await caches.match(req) || fetchAndCache(req, 'site');
}

async function networkFirst(req) {
  try {
    return await fetchAndCache(req, req.url.startsWith(GITHUB_ORG) ? 'data' : 'external');
  } catch (e) {
    return caches.match(req);
  }
}
