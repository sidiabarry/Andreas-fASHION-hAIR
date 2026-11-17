# Startseite und „Über Andrea“ – Konzept

## Leitidee: Ein Besuch im Atelier

Die Besucherin betritt nachts ein Atelier. Es ist dunkel und still, nur Glut glimmt. Aus der Glut steigt Licht auf, sammelt sich zum Phönix und zerfällt in goldene Strähnen – Haar. Danach führt Andrea durch ihr Atelier: erst die Extensions (Länge, Fülle), dann das, was man fragt, bevor man kauft. Der Phönix („Wie neu geboren“) ist der Faden; er kehrt am Ende als verglühender Funkenkreis zurück.

Grundsätze: Licht statt Farbe. Gold nur als Licht (Kanten, Glut, Partikel, ein Knopf je Szene). Jede Szene hat eine Aufgabe in der Kaufentscheidung, einen Layouttyp und genau einen Hauptknopf. Nichts Wichtiges hinter Klicks.

## Typografie

- **Display:** Cormorant Garamond (OFL, über `next/font` selbst gehostet, Token `--af-display`) in 500, aufrecht und kursiv. Schlagzeilen mischen aufrecht und kursiv in einer Zeile („Mehr *Länge.* Mehr *Fülle.*“). Großgrade mit negativer Laufweite, `text-wrap: balance`.
- **Text:** Geist Sans; **Mikro-Beschriftungen und Preise:** Geist Mono in gesperrten Versalien.
- **Claim:** Pinyon Script nur für „HaarManufaktur“ (Logo des Fundaments).

## Farbe (Verfeinerung, Tokens ergänzt in `globals.css`)

Grund `#100e0d`, Fläche `#181513`, erhaben `#201c19`, Linie `#2c2622`, Text `#f4efe8`, gedämpft `#a89e94`, Gold `#e0a526`. Neu: `--af-champagne #f3dfb3` (Licht auf Gold, Text auf Gold-Verläufen nie), `--af-ember #c8642a` (Kupfer-Glut, nur dekorativ), `--af-gold-grad` (Champagner → Gold → Kupfer für Lichtkanten). Kontrast: Text immer `--af-ink`/`--af-muted` auf Grund (16,8:1 / 7,3:1), Gold-Schrift auf Grund 8,8:1, dunkle Schrift auf Gold 8,8:1.

## Material

Feine Körnung (SVG-Rauschen als Daten-URI, 4 % Deckkraft, fixiert), Vignette, radiale Lichtkegel je Szene, 1-px-Goldkanten mit Verlauf, Seidenglanz auf Karten (Glanzband, das bei `pointer:fine` dem Zeiger folgt und sonst langsam von selbst wandert).

## Bewegungssprache

- Easing `--af-ease` (0.22, 1, 0.36, 1) für Eintritte, `--af-ease-in-out` für Kamerafahrten.
- Eintritte: Wort für Wort, 60 ms Versatz, 900 ms, Maske von unten; Bilder öffnen sich mit einer Lichtkante (clip-path), 1,4 s.
- Automatik: Jede Szene spielt **einmal**, wenn sie zu 35 % sichtbar ist, und kommt dann zur Ruhe. Wiederkehrende Automatik (Methoden-Spotlight, Bedarfe, Ken Burns) läuft in 5–6-s-Takten, stoppt bei Fokus/Hover darin und mit dem globalen Pause-Schalter (WCAG 2.2.2).
- Partikel: ein seitenweites WebGL2-Feld (`src/components/fx`), Formen je Szene über `data-fx`; Morph 1,8 s mit Stagger und Spiralbogen.
- `prefers-reduced-motion` oder Schalter „Bewegung pausieren“: alles steht, statischer Phönix (SVG) + CSS-Glut, gleiche Inhalte.

## Szenen-Ablauf (Verkaufsgeschichte)

| # | Szene | Kaufhürde, die sie löst | Layouttyp | Partikel | Hauptknopf |
| --- | --- | --- | --- | --- | --- |
| 1 | **Ankunft** (automatisch, ~15 s) | „Ist das hier etwas Besonderes?“ | Vollbild-Film mit Kapitelstrichen | Glut → Phönix → Strähnen | Kollektion ansehen (+ WhatsApp-Beratung) |
| 2 | **Vertrauen in einem Atemzug** | „Wer steckt dahinter, ist das seriös?“ | laufendes Band (pausierbar) | – | – |
| 3 | **Extensions – Länge und Fülle** | „Gibt es das für mich, für jede Haarfarbe?“ | Bühne mit Methoden-Spotlight + Farbfächer | Tresse mit hängenden Strähnen | Extensions anfragen (+ Salon-Weg) |
| 4 | **Sieht das echt aus?** | „Man sieht es doch.“ | Kinoformat mit Ken-Burns-Fahrt und Untertiteln | Lichtkante | Nahaufnahmen ansehen → Kollektion |
| 5 | **Was fehlt Ihnen gerade?** | „Welches Stück ist für meine Situation?“ | Bedarfsliste links, Stücke rechts, automatisch rotierend | Strähnenwelle | Stück ansehen / in den Warenkorb |
| 6 | **Gerade im Atelier** | „Was kostet das? Ist es noch da?“ | Editoriale Galerie, Karten mit Goldlicht | Funkenstaub | In den Warenkorb |
| 7 | **Wie es hält und sich anfühlt** | „Hält das? Ist es kompliziert?“ | Drei automatische Mini-Sequenzen (Zeichnungen) | – | Fragen per WhatsApp |
| 8 | **Die Hand dahinter** | „Versteht mich da jemand?“ | Porträt-Erzählung mit Zitat | Phönix klein | Andreas Geschichte / Atelier-Termin |
| 9 | **Alle Bedenken, beantwortet** | Farbe, Sichtbarkeit, Halt, Lieferzeit, Rückgabe, Bezahlung | offenes Raster (nichts zugeklappt) | – | Persönlich beraten lassen |
| 10 | **Drei Schritte zu Ihrem Stück** | „Was passiert nach dem Klick?“ | Zeitstrahl mit goldenem Faden | Faden | Kollektion ansehen |
| 11 | **Abschluss: Der Spiegel** | letzter Zweifel | Vollbild-Bild mit Spiegelring | Ring → Phönix verglüht | Kollektion ansehen + WhatsApp |

**„Über Andrea“** erzählt in sieben Kapiteln (Rio mit 19 → Neuanfang in Deutschland → selbst betroffen → „Es muss echt sein“ → Atelier Iserlohn → Phönix → Antrieb) mit eigenem Layout je Kapitel und endet mit Vertrauen → Atelier-Termin/WhatsApp → Kollektion/Extensions.

## Runden

(siehe unten, wird je Runde ergänzt)
