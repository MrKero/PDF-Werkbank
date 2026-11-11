/* PDF Werkbank – Offline-Speicher und Aktualisierung. Bei jeder neuen Version VERSION erhöhen. */
const VERSION = "pdf-werkbank-2.9", ASSETS = "pw-assets-1", META = "pw-meta";
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "manifest-oled.webmanifest", "manifest-linien.webmanifest", "manifest-gold.webmanifest", "manifest-eselsohr.webmanifest", "icons/oled-32.png", "icons/oled-180.png", "icons/oled-192.png", "icons/linien-32.png", "icons/linien-180.png", "icons/linien-192.png", "icons/gold-32.png", "icons/gold-180.png", "icons/gold-192.png", "icons/eselsohr-32.png", "icons/eselsohr-180.png", "icons/eselsohr-192.png", "lib/pdf-lib.min.js", "lib/fontkit.umd.min.js", "lib/pdf.min.js", "lib/pdf.worker.min.js", "lib/jszip.min.js", "lib/Sortable.min.js", "fonts/ui/bricolage-grotesque-latin-600-normal.woff2", "fonts/ui/bricolage-grotesque-latin-700-normal.woff2", "fonts/ui/ibm-plex-sans-latin-400-normal.woff2", "fonts/ui/ibm-plex-sans-latin-500-normal.woff2", "fonts/ui/ibm-plex-sans-latin-600-normal.woff2", "fonts/ui/ibm-plex-mono-latin-400-normal.woff2", "fonts/ui/ibm-plex-mono-latin-500-normal.woff2"];
// kleine Merkliste im Cache: welche Version benutzt wird ("cur") und ob automatisch aktualisiert wird ("auto")
async function meta(k, v) { const c = await caches.open(META); if (v === undefined) { const r = await c.match("__pw/" + k); return r ? r.text() : null; } await c.put("__pw/" + k, new Response(String(v))); }
async function tidy(cur) { const keep = new Set([VERSION, cur, ASSETS, META]); for (const k of await caches.keys()) if (!keep.has(k)) await caches.delete(k); }
self.addEventListener("install", e => { e.waitUntil((async () => { const c = await caches.open(VERSION); await c.addAll(PRECACHE.map(u => new Request(u, { cache: "reload" }))); await self.skipWaiting(); })()); });
self.addEventListener("activate", e => { e.waitUntil((async () => {
  const cur = await meta("cur"), auto = (await meta("auto")) !== "false";
  const use = !cur || auto || !(await caches.has(cur)) ? VERSION : cur;   // Automatik aus: bei der bisherigen Version bleiben
  await meta("cur", use); await tidy(use); await self.clients.claim();
})()); });
self.addEventListener("message", e => { const d = e.data || {}, port = e.ports && e.ports[0]; e.waitUntil((async () => {
  if (d.t === "auto") await meta("auto", d.v ? "true" : "false");
  if (d.t === "apply") { await meta("cur", VERSION); await tidy(VERSION); }
  if (port) port.postMessage({ cur: (await meta("cur")) || VERSION, latest: VERSION, auto: (await meta("auto")) !== "false" });
})()); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const rel = url.pathname.slice(new URL(self.registration.scope).pathname.length);
  if (/^(fonts\/(?!ui\/)|ocr\/)/.test(rel) || rel === "lib/tesseract.min.js" || rel === "lib/mammoth.browser.min.js") {   // Offline-Vorrat, versionsunabhängig
    e.respondWith(caches.open(ASSETS).then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  e.respondWith((async () => {
    const cur = (await meta("cur")) || VERSION, c = await caches.open(cur);
    let hit = await c.match(req, { ignoreSearch: true });
    if (!hit && req.mode === "navigate") hit = (await c.match("index.html")) || (await c.match("./"));
    if (hit) return hit;
    try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }
    catch (err) { const fb = req.mode === "navigate" ? await caches.match("index.html") : null; if (fb) return fb; throw err; }
  })());
});
