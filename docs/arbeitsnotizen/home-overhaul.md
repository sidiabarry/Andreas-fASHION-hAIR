# home-design: Startseite, „Über Andrea“, Effekt-Schicht (Overhaul)

Branch `worktree-agent-a35473f008fd6c4de`, Basis `claude/friendly-hopper-ktjxqu` (4df0dde; der Worktree stand anfangs auf dem alten `main` und wurde per Reset auf den Arbeitsbranch gesetzt, eigene Commits gab es da noch keine). `npm run verify` grün (35/35), `npm run build` grün, axe (WCAG 2.2 AA) ohne Verstöße auf `/de` 1440, `/de` 390 mit reduzierter Bewegung, `/de/ueber-andrea` 1440, `/en` 390. Kein horizontales Scrollen, keine Konsolenfehler.

## Roter Faden der Startseite (Research §5 + Phönix)

| # | Szene | Kaufhürde | Layout | Hauptknopf |
|---|---|---|---|---|
| 1 | Hero „Wie neu geboren. Mehr Länge. Mehr Fülle. Mehr Sie selbst.“ – Film in drei Kapiteln (Glut → Phönix → Haar), Partikelfeld | „Etwas Besonderes?“ | Vollbild-Film | Extensions entdecken → `/extensions` (daneben Maßanfertigung anfragen → `/massanfertigung`) |
| 2 | Vertrauensband (pausierbar) | „Seriös?“ | Laufband | – |
| 3 | **Kapitel I Extensions**: Vitrine mit den Studiobildern 423–428, Preis + Grundpreis je 1 kg (PAngV, über `unitInfo` und `product.*`-Schlüssel), Methoden, Salon-Link, Bildhinweis „Inszenierte Studioaufnahmen …“ | „Gibt es das für mich, was kostet es?“ | mitlaufende Textspalte + versetzte Vitrine (Handy: Wischreihe) | Alle Extensions ansehen → `/extensions` |
| 4 | Kommen Sie näher: Kino mit Kamerafahrt über die Detailbilder `-2.jpg` (Clip, Genius, Tape, Butterfly) | „Wie sieht das aus der Nähe aus?“ | Kinoformat 21:9 | (Textlink Methoden vergleichen) |
| 5 | Ihre Farbe. Ihre Menge.: Fächer aus echten Haar-Ausschnitten, letzter Streifen „Ihre Farbe nicht dabei? → Nach Maß“, Farbabgleich in 3 Schritten | Farbe, Packungszahl (keine erfundene Zahl: Andrea berät) | Fächer + Text | Foto an Andrea senden (WhatsApp; ohne Link: Formular) |
| 6 | **Kapitel II Topper und Perücken**: V-Toupet 422 groß + Einzelstücke 287/415/413 (ehrlich „Unikat“), vier Situationen als Wegweiser | „Welches Stück passt zu meiner Situation?“ | zentrierter Auftakt + Reihe | Topper und Perücken ansehen |
| 7 | **Kapitel III Maßanfertigung**: sechs Angaben (System, Länge, Farbe, Struktur, Menge, Foto), 15–20 Werktage aus `src/config/shipping.ts` | „Meine Farbe/Länge gibt es nicht“ | Band mit randlosem Werkstattbild | Maßanfertigung anfragen → `/massanfertigung` |
| 8 | Die Hand dahinter (Andrea, Zitat, Atelier, Öffnungszeiten aus `company.openingHours`) | „Versteht mich jemand?“ | Bild + Text | Andreas Geschichte lesen |
| 9 | Ihre Fragen, offen beantwortet (8 Fragen, FAQ-JSON-LD) | Farbe, Packungen, Methode, Sichtbarkeit, Lieferzeit, Bezahlung, Widerruf, Ausland | offenes Raster | Persönlich beraten lassen |
| 10 | Drei Schritte | „Was passiert nach dem Klick?“ | Zeitstrahl mit Goldfaden | Extensions entdecken |
| 11 | Abschluss „Wie neu geboren.“: **Haar-Simulation**, Strähnen fallen als Vorhang und ordnen sich zum Phönix | letzter Zweifel | Vollbild-WebGL | Extensions entdecken (+ Maßanfertigung) |

Maßanfertigung ist auf der Startseite fünfmal erreichbar (Hero, Farbfächer, Kapitel III, Abschluss, Ribbon-Text).

„Über Andrea“: Eröffnung mit Kapitel-Index, sieben Kapitel mit je eigenem Layout (Zahl „19“ · nur Text · Spiegel-Split · Haltungssatz · randloses Werkstattband · Phönix aus Haar (Simulation) · Farbreihe echter Stücke), dann Vertrauen, Atelier-Besuch (Adresse, Öffnungszeiten aus Config, WhatsApp), Abschluss mit Extensions + Maßanfertigung.

## Effekte (bewusst gewählt, jeder mit Bezug zur Geschichte)

1. **Haar-Simulation mit Federphysik** (`src/components/fx/hair/engine.ts`, `HairStage.tsx`): 260 Strähnen × 22 Glieder (Handy 130 × 16), Verlet-Integration mit Längen-Bedingungen, additive Goldlinien in WebGL2, ein Draw-Call. Zwei Ordnungen (Vorhang ↔ Phönix mit Flügelarm, Handschwingen, Flammenschweif, Hals), Morph beim Betreten/Verlassen der Szene. Zeiger = Wind, Scroll-Geschwindigkeit = Böe. Lädt erst ~1 Bildschirm vor der Szene (eigener Chunk, 8,2 KB), läuft nur sichtbar, stoppt bei verstecktem Tab. Automatische Drosselung: liegt die Bildzeit 90 Bilder lang über 26 ms, halbiert sich die Strähnenzahl. Reduzierte Bewegung/Pause: ein einziges, eingeschwungenes Standbild des Phönix. Ohne WebGL2: Bild `phoenix.jpg` (Symbolbild).
2. **Goldfeld** (bestehendes `fx/AtelierField`, jetzt eingebunden): Partikel formen je Szene Glut, Phönix, Strähnen, Tresse, Faden. **Fehler behoben:** destroy() gab den WebGL-Kontext frei, React StrictMode band danach dieselbe Leinwand erneut ein; der tote Kontext färbte die Seite weiß (Mischmodus „screen“). Jetzt bekommt jede Einbindung eine neue Leinwand, bei Fehler oder `webglcontextlost` wird sie entfernt.
3. **3D-Produktbühne** in der Extensions-Vitrine: Neigung zum Zeiger (CSS 3D), Lichtkegel folgt dem Zeiger, Parallaxe im Bild, Spiegelung auf dunklem Boden.
4. **Eigener Cursor mit Lupe** (`fx/FxUi.tsx`, global im Layout): Goldpunkt + Lichtring, wächst über Links, wird über `[data-lens]`-Bildern zur 2,4-fach-Lupe des echten Bildes. Nur `pointer: fine`, Eingabefelder behalten den Text-Cursor.
5. **Magnetische Hauptknöpfe** (`data-magnetic`), **Wort-für-Wort-Masken-Reveals**, Kapitelmarken I/II/III mit Lichtkante.
6. **Global (globals.css, nur ergänzt):** Scrollbar, Fokus-Lichthof, Tokens `--af-champagne`, `--af-ember`, `--af-gold-grad`, Seitenübergang (View Transitions, CSS vorbereitet), Formular- und Ladebausteine `af-ui-*`.

Bewusst **nicht** umgesetzt: three.js/OGL (die eigene WebGL2-Engine braucht 8 KB statt ~150 KB, keine neue Abhängigkeit), Shader-Übergänge zwischen Szenen (das Goldfeld verwandelt sich bereits zwischen den Szenen; ein zweiter Vollbild-Shader hätte das Budget auf Handys gesprengt).

Bewegung: Reduzierte Bewegung = vollwertige statische Fassung (Hero zeigt Poster „Haar“ mit allen Zeilen, Standbild-Phönix, keine Neigung/Magnet/Laufband; Bewegungsknöpfe im Hero ausgeblendet). Pause-Schalter: im Hero und dauerhaft im Dock unten rechts (WCAG 2.2.2), wirkt auf Film, Laufband, Kamerafahrt, Goldfeld, Haar.

## Messwerte (Produktions-Build, Headless-Chrome mit SwiftShader)

- LCP Desktop `/de`: 400 ms (Hero-Text), `/en` 390: 188 ms, `/de/ueber-andrea`: 168 ms (H1). `/de` 390 mit reduzierter Bewegung: 1,7 s (Poster Kapitel 3 statt 1; siehe Risiken).
- Kein CLS-Verursacher bekannt (Bilder mit festen Seitenverhältnissen, Filme erst nach dem Hydrieren über dem Poster).

## Dateien

- Neu: `src/components/home/{Chapter.tsx,home.css}`, `scenes/{ExtensionsChapter,Near,ColorFan,TopperChapter,Bespoke}.tsx`, `src/components/fx/{FxUi.tsx,HairStage.tsx,hair/engine.ts}`, `src/app/[locale]/ueber-andrea/about.css`
- Geändert: `page.tsx`, `ueber-andrea/page.tsx`, `Hero.tsx`, `scenes/Story.tsx`, `PieceCard.tsx`, `values.ts`, `fx/AtelierField.tsx`, `i18n/{de,en,apply}.mjs`, `src/messages/*.json` (nur `hero.*`, `home.*`, `about.*`), `globals.css` (nur angehängt), `layout.tsx` (nur `<FxUi />`)
- Entfernt (ersetzt): `HeroPlaceholder`, `Finder`, `NeedsCycler`, `MethodSpotlight`, `scenes/Extensions`, `scenes/Hold`
- Startseiten-Stile liegen in `src/components/home/home.css` (von Startseite und „Über Andrea“ importiert) statt in `globals.css`: weniger Konflikte mit parallelen Agenten, nur diese Seiten laden sie.

## Übersetzungen

- de und en vollständig (Quellen `src/components/home/i18n/{de,en}.mjs`, schreiben mit `node src/components/home/i18n/apply.mjs`).
- **fr und es: deutsche Platzhalter** für alle Schlüssel unter `hero.*`, `home.*`, `about.*` (`i18n/fr.mjs` und `es.mjs` re-exportieren `de.mjs`). Für i18n: eigene `fr.mjs`/`es.mjs` mit derselben Struktur anlegen, dann `apply.mjs` ausführen. `hero.ctaCollection` wird auch von Warenkorb/Kasse genutzt.
- Farbnamen an den Stücken kommen aus `productText(...).subtitle` (Katalog). Sobald shop-conversion die neuen Namen (Brief: 422 „Dunkelblond mit hellen Reflexen“ usw.) und i18n die Katalogtexte 422–428 einträgt, ändern sie sich hier automatisch.

## Für den Shop-Agenten (bitte übernehmen, ich fasse diese Dateien nicht an)

- `src/components/forms/**`, `components/cart/**` (Kasse), `components/site/NewsletterForm.tsx`: Eingabefelder `className="af-ui-field"`, Auswahllisten zusätzlich `af-ui-select`, Checkboxen/Radios `af-ui-check`, Ladezustand von Absende-Knöpfen `<span className="af-ui-loading" aria-hidden="true" />`.
- `components/product/Gallery.tsx` und `ProductCard.tsx`: Bildcontainer mit `data-lens` (Cursor-Lupe) und Karten-Bild mit `data-tilt` (3D-Neigung; CSS-Variablen `--rx/--ry` stehen für Glanzlicht bereit).
- Hauptkaufknopf (`AddToCart`, `StickyBuyBar`, Kasse): `data-magnetic`.
- `src/app/[locale]/not-found.tsx` (404) hat noch Standard-Optik; Vorschlag: dunkle Bühne mit `HairStage` (Vorhang, Morph 0); Zuständigkeit für die Datei bitte festlegen.

## Offene Fragen und Hinweise

**An die Plattform:** Seitenübergänge brauchen `experimental.viewTransition: true` in `next.config.ts` und `<ViewTransition>` (React 19.3 exportiert es) um `{children}` im Layout. Die CSS-Animation („alte Seite verglüht, neue steigt auf“, reduzierte Bewegung aus) steht schon in `globals.css`. Ich habe es nicht ohne Freigabe eingeschaltet.

**An Andrea (nichts erfunden, darum offen):**
1. Herkunft des Haars: laut Auftraggeber **nicht** Brasilien, alle Herkunftsangaben auf Startseite/Über Andrea sind entfernt. In `docs/ANDREA-GESCHICHTE.md` steht noch „brasilianisches Echthaar“, ebenso evtl. im Katalog (`origin: "Brasilien"`) und in anderen Nachrichten. Bitte dort korrigieren (Zuständige: Doku/shop-conversion/legal).
2. Darf auf der Seite stehen, dass Extensions „fachgerecht eingearbeitet“ werden, und arbeitet Andrea selbst ein oder empfiehlt sie Salons? (Frage „Welche Methode passt zu mir?“)
3. Ein echtes Foto von Andrea oder dem Atelier: Alle Stimmungsbilder (Spiegel, Werkstatt, Phönixflügel) sind Symbolbilder und so gekennzeichnet.
4. Struktur von 426 (lockig) ist laut legal unbestätigt. Ich nenne keine Struktur; das Studiobild zeigt Locken.

**Rechtliche Punkte für legal-compliance:**
- „14 Tage Rückgabe“ wird nicht mehr als Vorteil beworben (Werbung mit Selbstverständlichkeiten), sondern nur in der Fragen-Antwort als gesetzliches Widerrufsrecht mit dem Wertersatz-Hinweis aus eurer Notiz.
- Bildhinweis an der Vitrine: „Inszenierte Studioaufnahmen. Die Haarfarbe ist am Originalfoto gemessen und abgeglichen. Die Originalfotos finden Sie auf der jeweiligen Produktseite.“ Bitte prüfen. Die Startseite zeigt die Studiobilder `/assets/products/<id>.jpg` direkt (unabhängig vom Katalogfeld `image`).
- Preise mit Grundpreis je 1 kg an jedem Extension-Preis, darunter `PriceNote` (Kleinunternehmer-Hinweis, Versandkosten-Link). V-Toupet ohne Grundpreis.
- Kein „Einzelstück“ bei Extensions, kein „unsichtbar“, kein „von Hand gefertigt“ auf Extensions bezogen, keine Herkunft.

## Risiken

- **Routen `/extensions` und `/massanfertigung`** baut shop-conversion; bis zum Merge führen die Knöpfe auf die 404-Seite.
- **GPU-Last:** Goldfeld und Haar-Simulation können gleichzeitig laufen (nur im Abschluss bzw. Phönix-Kapitel). Beide stoppen außerhalb des Bildes, die Haar-Simulation drosselt sich selbst. Auf echten Mittelklasse-Handys noch nicht gemessen (nur Headless-SwiftShader); bitte qa mit echtem Gerät/Lighthouse Mobile prüfen.
- **LCP bei reduzierter Bewegung auf dem Handy** (1,7 s): Dort startet der Hero direkt mit Poster 3, das nicht vorgeladen wird. Verbesserung: bei reduzierter Bewegung serverseitig nicht unterscheidbar; ggf. Poster 3 zusätzlich mit `fetchPriority="high"` laden (kostet Bandbreite für alle).
- Der eigene Cursor blendet den System-Cursor nur bei `pointer: fine` aus; bei Fehlern im Skript bleibt der System-Cursor (die Klasse wird erst nach dem Start gesetzt).
- `next dev` legt im Worktree `AGENTS.md` an; die Datei habe ich jeweils gelöscht, nicht committet.
