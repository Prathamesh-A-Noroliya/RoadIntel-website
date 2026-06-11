const CACHE_NAME = "roadintel-offline-shell-v1";

const APP_SHELL = [
  "/",
  "/index.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    }),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cachedHome =
            (await caches.match("/")) || (await caches.match("/index.html"));

          return (
            cachedHome ||
            new Response("RoadIntel is offline. Please reconnect.", {
              status: 503,
              headers: {
                "Content-Type": "text/plain",
              },
            })
          );
        }
      })(),
    );

    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        if (
          networkResponse.ok &&
          request.url.startsWith(self.location.origin)
        ) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        return new Response("", {
          status: 504,
          statusText: "Offline",
        });
      }
    })(),
  );
});