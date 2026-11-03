/* PDF Werkbank – Offline-Speicher. Bei jeder neuen Version VERSION erhöhen. */
const VERSION = "pdf-werkbank-2.5";
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "manifest-oled.webmanifest", "manifest-linien.webmanifest", "manifest-gold.webmanifest", "manifest-eselsohr.webmanifest", "icons/oled-32.png", "icons/oled-180.png", "icons/oled-192.png", "icons/linien-32.png", "icons/linien-180.png", "icons/linien-192.png", "icons/gold-32.png", "icons/gold-180.png", "icons/gold-192.png", "icons/eselsohr-32.png", "icons/eselsohr-180.png", "icons/eselsohr-192.png", "lib/pdf-lib.min.js", "lib/fontkit.umd.min.js", "lib/pdf.min.js", "lib/pdf.worker.min.js", "lib/jszip.min.js", "lib/Sortable.min.js", "fonts/ui/bricolage-grotesque-latin-600-normal.woff2", "fonts/ui/bricolage-grotesque-latin-700-normal.woff2", "fonts/ui/ibm-plex-sans-latin-400-normal.woff2", "fonts/ui/ibm-plex-sans-latin-500-normal.woff2", "fonts/ui/ibm-plex-sans-latin-600-normal.woff2", "fonts/ui/ibm-plex-mono-latin-400-normal.woff2", "fonts/ui/ibm-plex-mono-latin-500-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; }).catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })));
});
