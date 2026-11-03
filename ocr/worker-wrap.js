/* Lädt die Sprachdaten aus Base64-Textdateien (Artifacts liefern keine .gz-Dateien aus)
   und startet dann den eigentlichen Tesseract-Worker. */
(function () {
  var nativeFetch = self.fetch.bind(self);
  self.fetch = function (url, opts) {
    var u = String(url), m = u.match(/\/([A-Za-z_]+)\.traineddata(\.gz)?$/);
    if (!m) return nativeFetch(url, opts);
    var txtUrl = u.replace(/\/[A-Za-z_]+\.traineddata(\.gz)?$/, "/" + m[1] + ".traineddata.b64.txt");
    return nativeFetch(txtUrl).then(function (r) {
      if (!r.ok) return r;
      return r.text().then(function (t) {
        var bin = atob(t.replace(/\s+/g, "")), a = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
        return new Response(a, { status: 200, headers: { "Content-Type": "application/octet-stream" } });
      });
    });
  };
})();
importScripts("worker.min.js");
