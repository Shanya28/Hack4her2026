const CACHE = "ayidote-v2";
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
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            if (cacheable(response)) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(() =>
            event.request.mode === "navigate" ? caches.match("./") : Response.error(),
          ),
    ),
  );
});
