const CACHE = "ayidote-v3";
const SHELL = ["./", "./manifest.webmanifest", "./icon.svg", "./favicon.png"];

const cacheable = (response) => response && (response.ok || response.type === "opaque");

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

// The page sends the files it loaded before this worker took control, so the
// app works offline right after the first visit.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "precache" || !Array.isArray(data.urls)) return;
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        data.urls.map((url) =>
          cache.match(url).then(
            (hit) =>
              hit ||
              fetch(url)
                .then((response) => (cacheable(response) ? cache.put(url, response) : undefined))
                .catch(() => undefined),
          ),
        ),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith("http")) return;

  const fromNetwork = () =>
    fetch(request).then((response) => {
      if (cacheable(response)) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    });

  // The page itself: network first, so a new version shows up as soon as the
  // phone is online; the cached copy is the offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fromNetwork().catch(() =>
        caches.match(request).then((cached) => cached || caches.match("./")),
      ),
    );
    return;
  }

  // Everything else (hashed scripts, styles, fonts): cache first.
  event.respondWith(
    caches.match(request).then((cached) => cached || fromNetwork().catch(() => Response.error())),
  );
});
