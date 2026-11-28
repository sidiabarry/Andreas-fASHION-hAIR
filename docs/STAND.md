# Stand

Aktueller Stand, offene Punkte und Arbeitsweise: **`docs/UEBERGABE.md`** (21.11.2026).
Arbeitsnotizen der Agenten: `docs/arbeitsnotizen/`.

## Stand 28.11.2026 (Produktseite in drei Ebenen)

Auftrag: Produktseiten waren zu lang, die Entscheidung soll schneller fallen, ohne Information zu verlieren.

- **Ebene 1, entscheiden in 10 s** (bis zum Kaufknopf): Bild/Film, Name, Preis mit Grundpreis, Merkmal-Chips (bei Extensions auch „Einsetzen: selbst/Fachfrau“ und „Tragen: täglich/dauerhaft“), Farbe mit Echtfarbfeld und Hinweis zu Bildschirmabweichungen, drei Kurzvorteile, Kaufknopf mit Zahlung/Widerruf/Lieferzeit in je einer Zeile.
- **Ebene 2, sicher in 60 s:** eine Beratungszeile („Unsicher bei Farbe oder Menge?“ → WhatsApp, Merkliste, Teilen).
- **Ebene 3, Tiefe auf Abruf:** eigenes Band unter dem Kaufbereich mit vier Bereichen: „Über dieses Stück“ (Geschichte, So funktioniert es, Für wen, alle Vorteile, Eigenschaften), „Pflege“, „Häufige Fragen“, „Versand, Rückgabe und Bezahlung“. Am Handy zugeklappt, am Desktop offen in zwei Spalten (Baymard: am Desktop „Expanded Sections“, am Handy bei langen Seiten zugeklappt; `OpenDetailsOnWide`). Kein Text gelöscht, nur umsortiert.
- Überzeile „Handgefertigt von Andréia in Iserlohn“ statt Kategorie/Technik (Kategorie steht in der Brotkrume, Technik im Namen). Brotkrume am Handy einzeilig, kleinere Vorschaubilder.
- Kaufleiste am Handy erscheint nach dem ersten Bildschirm, sobald der Hauptknopf nicht zu sehen ist; Grundpreis darin immer vollständig (PAngV), auf schmalen Handys ohne Produktnamen.
- Messung (iPhone 13, Wörter vor dem Kaufknopf / Bildschirme bis zum Knopf / Klappbereiche): 422 231→85 / 3,4→2,5 / 10→4; 423 184→86 / 3,1→2,4 / 10→4; 426 228→90 / 3,4→2,4 / 12→4.

## Stand 27.11.2026 (Produktseiten, Extensions-Seite, neue Produktbilder)

- **Live seit 28.11.2026:** Production-Deploy dieses Stands (Branch `claude/blissful-shannon-5zfiik`) auf https://andreas-fashion-hair.vercel.app (Vercel-Projekt `andreas-fashion-hair`). Eigene Domain noch nicht verbunden (Schritt 8 in `docs/LIVEGANG.md`).

- **Neue Produktbilder 422–428** von der Inhaberin (fertig bearbeitet, unverändert übernommen, `public/assets/products/<id>-<n>.webp`) sind die Hauptbilder. Alte KI-Studiobilder und Rohfotos entfernt. Ergänzt um ausgewählte, nur in Licht/Weißabgleich entwickelte Atelierfotos (`<id>-atelier-<n>.jpg`, `scripts/produktbilder/entwickeln.py`).
- **Filme:** 422 V-Toupet (24,9 s) und 426 Locken (12,3 s), stabilisiert, in Remotion geschnitten, nahtlose Schleife (`scripts/produktfilme/`). In der Galerie als zweites Element, mit Pause-Knopf.
- **Produkt 426 (braune Ombré-Locken) ist „Extra dünnes Tressenband“** (Auftraggeber), neue Methode `thin` in Filter, Finder, Vergleich. 424 und 425 bleiben Genius Weft.
- **Farbtreue:** Haarfarbe aus den Rohfotos gemessen (Weißabgleich über das Laken, Lab je Helligkeitsstufe), Bilder 422, 425, 426, 427, 428 im Farbton angeglichen (ΔE vorher 3,4–5,2; Helligkeit unverändert; Puppe, Karten, Clips per Strukturmaske geschützt). 423 und 424 lagen schon unter ΔE 2. Gemessene Echtfarbe als Farbfeld (`swatch`) auf der Produktseite. Werkzeug: `scripts/produktbilder/farbtreue.py`.
- **Studio/Original-Schalter** in der Kollektion entfernt.
- **Produktseite:** wischbare Galerie mit Beschriftung je Bild (KI-bearbeitet / Atelierfoto / Film), Farbzeile mit echter Strähne + Hinweis zu Bildschirmabweichungen, bei Extensions „Auch in anderen Farben auf Anfrage“, drei sichtbare Vorteile, Sicherheiten am Kaufknopf, „Die Technik dahinter“, Wunschfarben-Streifen. Rohfotos nur noch, wo es keine bearbeiteten Bilder gibt.
- **Extensions-Seite neu:** Hero mit Atelierfilm, Technik-Leiste (läuft mit), Technik-Finder (3 Fragen), sieben Technik-Kapitel mit Bild, Nahaufnahme, Querschnitt-Skizze, Fakten, Vorteilen, „Gut zu wissen“ und Packungen, Vergleichstabelle, Farbe auf Anfrage, Shop, FAQ (mit FAQPage-JSON-LD). Tape-In und Keratin: keine Packung, „Auf Anfrage“, dargestellt als Skizze (keine KI-Bilder).
- **Kopfzeile:** „Extensions“ klappt ein Menü mit Bildern aller sieben Techniken auf (Maus und Tastatur, Escape schließt).
- Offen: Rohfotos dunkler Tresse am Bügel (WA0015/17/18) und lockiges Clip-in-Set (WA0034–38) keinem Katalogprodukt sicher zuzuordnen; nicht verwendet.

## Stand 21.11.2026 (Lichtatelier, produktionsreif im Code)

- Durchgehend hell, Schaufenster-Hero mit dem 15-s-Film, Seitenwechsel als Lichtöffnung vom Klickpunkt.
- Haar: alles feines Echthaar aus Vietnam (vom Auftraggeber bestätigt); „Premium-Echthaar“ entfernt.
- Zahlung: Überweisung per GiroCode (EPC-QR, ohne Drittanbieter) + Kopierfelder auf der Bestellbestätigung und in der Eingangsmail; IBAN der Inhaberin in `company.ts`. Zahlen sofort oder nach Andreas Bestätigung (AGB/Versand & Zahlung angepasst, de/en/fr/es).
- Kasse ohne Pflicht-Häkchen (AGB-Hinweis über dem Bestellknopf).
- Livebetrieb: Kasse öffnet sich automatisch, sobald in Vercel gesetzt sind: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Schema `supabase/migrations/0001_init.sql` einspielen), `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO_OWNER`, `IP_HASH_SECRET`, `SITE_URL`.
