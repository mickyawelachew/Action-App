const CACHE_NAME = "pwa-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles/calendar.css",
  "/styles/general.css",
  "/styles/info.css",
  "/styles/login.css",
  "/styles/todo.css",
  "/app.js",
  "/notes.js",
  "/todo.js",
  "/calendar.js",
  "/images/Action-logo.png",
  "/images/Action-logo-ico.ico",
  "/images/Action-logo-lowres.png",
  "/images/Action-logo-webp.webp",
  "/images/Action-logo-svg.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
