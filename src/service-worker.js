/* global workbox */

const GITHUB_ORG = 'https://raw.githubusercontent.com/discordjs/';

// Set some basic config
workbox.setConfig({ debug: false });
workbox.core.setCacheNameDetails({
  prefix: 'djs',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime',
});

// Precache files
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Use the staleWhileRevalidate strategy by default
const defaultStrategy = workbox.strategies.staleWhileRevalidate({
  cacheName: 'djs-external-v1',
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 128,
      maxAgeSeconds: 60 * 60 * 24,
      purgeOnQuotaError: true,
    }),
    new workbox.cacheableResponse.Plugin({
      statuses: [0, 200],
    }),
  ],
});
workbox.routing.setDefaultHandler(
  args => {
    if (args.event.request.method === 'GET') return defaultStrategy.handle(args);
    return fetch(args.event.request);
  },
);

// Network-first for docs data pulled from GitHub
workbox.routing.registerRoute(
  new RegExp(`^${escapeURLChars(GITHUB_ORG)}.*\\.json`, 'i'),
  workbox.strategies.networkFirst({ cacheName: 'djs-docs-v1' }),
);

// Cache-first for CDNJS and Google Fonts files
workbox.routing.registerRoute(
  /^https:\/\/(?:fonts\.googleapis\.com|cdnjs\.cloudflare\.com).*/i,
  workbox.strategies.cacheFirst({ cacheName: 'djs-external-v1' }),
);

// Cache-first for images on the website itself
workbox.routing.registerRoute(
  new RegExp(`^${escapeURLChars(self.location.origin)}.*\\.(png|jpg|jpeg|gif|svg|ico)`, 'i'),
  workbox.strategies.cacheFirst({
    cacheName: 'djs-site-v1',
    plugins: [new workbox.expiration.Plugin({ maxAgeSeconds: 60 * 60 * 24 })],
  }),
);

// All other resources on the website itself use staleWhileRevalidate
workbox.routing.registerRoute(
  new RegExp(`^${escapeURLChars(self.location.origin)}.*`, 'i'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'djs-site-v1',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 128,
        maxAgeSeconds: 60 * 60 * 24,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// Skip waiting if requested
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Escapes a couple of regex characters common in URLs
function escapeURLChars(url) {
  return url.replace(/\//g, '\\/')
    .replace(/\./g, '\\.');
}
