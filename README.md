# PDF Werkbank

Ein kostenloser PDF-Editor für iPhone, iPad und jeden Browser. Bearbeiten, unterschreiben, scannen, schwärzen, Formulare ausfüllen, zusammenfügen und umwandeln – **alles läuft auf dem Gerät**. Es gibt keinen Server, kein Konto und keinen Upload.

**Zur App:** https://mrkero.github.io/PDF-Werkbank/

Mit ❤️ gemacht von Kerem.

---

## Funktionen

**Dokumente**
- PDFs, Fotos, Word- (.docx), Text- und HTML-Dateien öffnen und als PDF anlegen
- Bibliothek mit allen Dokumenten: suchen, sortieren, umbenennen, duplizieren, löschen
- Mehrere PDFs in beliebiger Reihenfolge zusammenfügen
- Automatisches Speichern auf dem Gerät, „Zuletzt“-Liste, Offline-Nutzung

**Seiten**
- Übersicht mit Formatangabe (z. B. A4) und Infos zu jeder Seite
- Lesemodus mit Zoom (zwei Finger, am PC Strg + Mausrad) und markierbarem Text zum Kopieren
- Drehen, duplizieren, sortieren per Ziehen, löschen, umkehren, extrahieren
- Neue Seiten: leer, liniert, kariert, Punktraster, Millimeterpapier, Notenlinien, Cornell – in DIN A3–A6, Letter und Legal, mit wählbarer Papierfarbe
- Favoriten und Gliederung (wird als Lesezeichen in die PDF geschrieben)

**Bearbeiten**
- Kugelschreiber, Fineliner, Bleistift, Marker, Lineal mit Längenanzeige, Radierer
- Formen: Rechteck, Kreis, Ellipse, Linie, Pfeile, Koordinatensystem, Markierfläche
- Text einfügen mit 22 Schriftfamilien sowie eigenen TTF/OTF-Schriften
- **Text ändern**: erkennt Schriftart, Stil, Größe und Farbe des Originals und entfernt den alten Text wirklich aus der Datei
- **Schwärzen**: löscht Text endgültig aus dem PDF-Inhalt
- Bilder, Tabellen (mit automatischer Größenanpassung), Notizen, Stempel, gespeicherte Unterschriften
- Messen mit Kalibrieren, Maßstab und Verhältnis
- Zuschneiden, Zwei-Finger-Zoom, Rückgängig/Wiederholen

**Scannen & Texterkennung**
- Scanner mit automatischer Eckenerkennung, Entzerrung und Filtern
- Texterkennung (OCR) für Deutsch und Englisch, direkt auf dem Gerät – macht Scans durchsuchbar und kopierbar

**Formulare**
- PDF-Formulare erkennen und ausfüllen (Textfelder, Kästchen, Optionsfelder, Auswahllisten)
- Gespeicherte PDF bleibt ausfüllbar oder wird auf Wunsch fest eingefügt

**Speichern & Umwandeln**
- Seitenzahlen, Kopf- und Fußzeile mit `{seite}`, `{seiten}`, `{datum}`, `{name}`, Wasserzeichen, anderes DIN-Format, Papierfarbe
- Verlustfreie Kompression, Passwortschutz (AES-256), geschützte PDFs entsperren
- Aufteilen (nach Seitenzahl oder Kapiteln), mehrere Seiten pro Blatt
- PDF zu Bildern (JPG/PNG), PDF zu Word (.docx), PDF zu Text
- Zwei Fassungen vergleichen (Textunterschiede), beschädigte PDFs reparieren

---

## Auf dem iPhone wie eine App nutzen

1. Seite in **Safari** öffnen.
2. Optional: unter **Einstellungen → App-Symbol** eines der vier Symbole wählen (OLED-Schwarz, Linien, Gold, Eselsohr).
3. **Teilen** → **Zum Home-Bildschirm**.

Die App startet dann im Vollbild mit dem gewählten Symbol und läuft nach dem ersten Laden komplett offline.

> **Wichtig:** Die Home-Bildschirm-App hat auf iOS einen **eigenen Speicher**, getrennt von Safari. Dokumente, die du in Safari angelegt hast, siehst du dort nicht – und umgekehrt. Wer das Symbol vom Home-Bildschirm löscht, löscht damit auch die darin gespeicherten Dokumente. Ein Symbolwechsel wird auf iOS erst sichtbar, wenn man die App neu zum Home-Bildschirm hinzufügt – vorher wichtige Dokumente sichern.

## Lokal ausprobieren

```bash
python3 -m http.server 8000
```
Dann `http://localhost:8000` öffnen. Ein Doppelklick auf `index.html` reicht nicht, weil Browser dann das Laden von Schriften und der Texterkennung blockieren.

---

## Datenschutz

Die App ist so gebaut, dass sie **ohne fremde Dienste** auskommt.

- Alle Dokumente werden ausschließlich auf dem Gerät verarbeitet und nirgendwohin hochgeladen.
- Kein Konto, keine Werbung, kein Tracking, keine Analyse, keine Fehlerberichte, keine Cookies.
- Alle Programmbausteine, Schriften und die Texterkennung liegen im Repository – es gibt **keine Abfragen an CDNs, Google Fonts oder andere Anbieter**. Eine Content-Security-Policy in `index.html` verbietet das zusätzlich.
- Gespeichert wird nur im Browser des Geräts (IndexedDB, localStorage): Dokumente, Unterschriften, eigene Schriften, Suchverlauf, Einstellungen. Beim Löschen der Browserdaten sind sie weg.
- Passwörter geschützter PDFs werden nicht gespeichert.

**Welche Anfragen es gibt:** nur an die eigene Adresse (`https://mrkero.github.io/PDF-Werkbank/`). Der Webhoster sieht dabei wie bei jeder Webseite IP-Adresse, Uhrzeit und Gerätetyp, aber nie Inhalte deiner Dokumente.

| Wann | Was wird geladen |
|---|---|
| Beim ersten Öffnen | `index.html`, `lib/`, `fonts/ui/`, `icons/`, Manifest, `sw.js` |
| Direkt danach im Hintergrund | **alle** Schriften aus `fonts/` und die Texterkennung aus `ocr/` (zusammen ca. 30 MB). Eine Leiste zeigt den Fortschritt; wird die App vorher geschlossen, geht es beim nächsten Start weiter. |
| Bei späteren Starts | kurze Prüfung, ob es eine neue Version gibt |
| Speichern | nichts – die Datei entsteht auf dem Gerät |
| Links in den Einstellungen | fremde Seiten öffnen sich nur beim Antippen (ohne Referrer) |

## Aufbau

```
index.html            App (Oberfläche und Logik)
sw.js                 Offline-Cache (Service Worker)
manifest*.webmanifest Angaben für „Zum Home-Bildschirm“ (eine Datei je Symbol)
icons/                App-Symbole: oled, linien, gold, eselsohr (32/180/192/512 px)
lib/                  Programmbausteine (pdf.js, pdf-lib, fontkit, JSZip, SortableJS, Tesseract.js, Mammoth)
fonts/                Mitgelieferte Schriften, fonts/ui/ für die Oberfläche
ocr/                  Texterkennung: Kern (WebAssembly) und Sprachdaten Deutsch/Englisch
```

Die Sprachdaten liegen als Base64-Text vor; `ocr/worker-wrap.js` wandelt sie beim Laden zurück.

---

## Verwendete freie Software

| Baustein | Zweck | Lizenz |
|---|---|---|
| [pdf.js](https://github.com/mozilla/pdf.js) 3.11 | Anzeigen, Text lesen, Suche | Apache-2.0 |
| [pdf-lib](https://github.com/cantoo-scribe/pdf-lib) 2.11 (Cantoo) | PDFs erstellen, ändern, verschlüsseln | MIT |
| [fontkit](https://github.com/cantoo-scribe/fontkit) (Cantoo) | Schriften einbetten | MIT |
| [Tesseract.js](https://github.com/naptha/tesseract.js) 7 | Texterkennung | Apache-2.0 |
| [tessdata](https://github.com/tesseract-ocr/tessdata_best) | Sprachdaten Deutsch/Englisch | Apache-2.0 |
| [JSZip](https://github.com/Stuk/jszip) 3.10 | ZIP- und Word-Dateien | MIT |
| [SortableJS](https://github.com/SortableJS/Sortable) 1.15 | Sortieren per Ziehen | MIT |
| [Mammoth](https://github.com/mwilliamson/mammoth.js) 1.11 | Word-Dateien einlesen | BSD-2-Clause |

**Schriften:** [Google Fonts](https://fonts.google.com) (Roboto, Open Sans, Lato, Montserrat, Inter, Noto Sans/Serif, Merriweather, EB Garamond, Caveat, Source Sans 3, Poppins), [Liberation Fonts](https://github.com/liberationfonts/liberation-fonts), [Carlito und Caladea](https://github.com/googlefonts/carlito), [DejaVu](https://dejavu-fonts.github.io), [Latin Modern](https://www.gust.org.pl/projects/e-foundry/latin-modern); Oberfläche: Bricolage Grotesque, IBM Plex Sans/Mono über [Fontsource](https://fontsource.org). Alle unter der SIL Open Font License bzw. freien Lizenzen; Details in `fonts/LICENSES.txt` und `ocr/LICENSES.txt`.

---

## Grenzen

- Texterkennung funktioniert gut bei gedrucktem Text, kaum bei Handschrift und Formeln.
- Beim Schwärzen von Scans bleibt das Foto unter dem Balken erhalten – dafür „Als Bild sichern“ nutzen.
- „PDF zu Word“ übernimmt Text, Absätze und Überschriften, aber keine Bilder und kein Layout.
- Unterschriften sind einfache Bild-Unterschriften, keine qualifizierte elektronische Signatur.
- Daten liegen nur im Browser – wichtige Dokumente zusätzlich als Datei sichern.
