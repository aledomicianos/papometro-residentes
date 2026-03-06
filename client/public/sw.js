/// <reference lib="webworker" />

const CACHE_NAME = 'papometro-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  (event as ExtendableEvent).waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  (self as ServiceWorkerGlobalScope).skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  (event as ExtendableEvent).waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
    ),
  );
  (self as ServiceWorkerGlobalScope).clients.claim();
});

// Fetch strategy:
// - API calls: network-first (fall through to cache on failure)
// - Static assets: cache-first
self.addEventListener('fetch', (event) => {
  const req = (event as FetchEvent).request;
  const url = new URL(req.url);

  // API requests: network-first
  if (url.pathname.startsWith('/api')) {
    (event as FetchEvent).respondWith(
      fetch(req).catch(() => caches.match(req) as Promise<Response>),
    );
    return;
  }

  // Static assets: cache-first
  (event as FetchEvent).respondWith(
    caches.match(req).then(
      (cached) => cached ?? fetch(req).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return response;
      }),
    ),
  );
});
