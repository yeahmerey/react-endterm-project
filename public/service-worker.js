const CACHE_NAME = "rick-morty-v1";
const API_CACHE = "rick-morty-api-v1";

const APP_SHELL = ["/", "/index.html", "/manifest.json", "/vite.svg"];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching app shell");
        // Используем addAll с обработкой ошибок для каждого файла
        return Promise.allSettled(
          APP_SHELL.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SW] Failed to cache ${url}:`, err);
            })
          )
        );
      })
      .then(() => {
        console.log("[SW] App shell cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Install failed:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] Service worker activated");
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        console.log("[SW] Offline navigation, serving cached index.html");
        return caches.match("/index.html");
      })
    );
    return;
  }

  if (url.origin === "https://rickandmortyapi.com") {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            if (request.method === "GET" && response.status === 200) {
              console.log("[SW] Caching API response:", url.pathname);
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            console.log("[SW] API offline, serving from cache:", url.pathname);
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return new Response(
                JSON.stringify({
                  results: [],
                  offline: true,
                  message: "No cached data available",
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );
            });
          });
      })
    );
    return;
  }

  event.respondWith(
    caches
      .match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log("[SW] Serving from cache:", url.pathname);
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (
            request.method === "GET" &&
            response.status === 200 &&
            (request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font")
          ) {
            console.log("[SW] Caching resource:", url.pathname);
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
      .catch((error) => {
        console.error("[SW] Fetch failed:", error);

        if (request.destination === "image") {
          return caches.match("/vite.svg");
        }

        return new Response("", { status: 503 });
      })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Skip waiting requested");
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    console.log("[SW] Caching additional URLs:", event.data.urls);
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
