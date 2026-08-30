const CACHE_NAME = "slb-futsal-v15-6b-pwa-1";
const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./version.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key === CACHE_NAME ? null : caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === "navigate";
  const isIndex = url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  const isVersion = url.pathname.endsWith("/version.json");

  if (isNavigation || isIndex || isVersion) {
    event.respondWith(
      fetch(event.request,{cache:"no-store"}).then(response => {
        if (response && response.status === 200) {
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy));
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then(cached => cached || caches.match("./index.html"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy));
        return response;
      });
    })
  );
});
