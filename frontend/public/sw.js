// Service Worker for Muthujaya Dairy Farm PWA
const CACHE_NAME = "muthujaya-dairy-v1";
const RUNTIME_CACHE = "runtime-cache";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fall back to cache
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
        });
        return cachedResponse;
      }

      // Network first strategy
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }

          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page or placeholder
          return new Response(
            JSON.stringify({
              error: "Network error",
              message: "Please check your internet connection",
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        });
    })
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Muthujaya Dairy";
  const options = {
    body: data.body || "New notification",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: data.url || "/",
    actions: [
      { action: "open", title: "Open App" },
      { action: "close", title: "Close" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow(event.notification.data || "/"));
  }
});

// Background sync event for offline orders
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-orders") {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  // Sync pending orders when back online
  const cache = await caches.open(RUNTIME_CACHE);
  const requests = await cache.keys();

  const orderRequests = requests.filter(
    (req) => req.url.includes("/api/orders") && req.method === "POST"
  );

  for (const request of orderRequests) {
    try {
      await fetch(request.clone());
      await cache.delete(request);
    } catch (error) {
      console.error("Failed to sync order:", error);
    }
  }
}
