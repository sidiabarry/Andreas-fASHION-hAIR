# Design-Tokens

Alle Tokens stehen als CSS-Variablen in `src/app/globals.css` unter `:root`. **Ergänzen ist erlaubt, umbenennen nicht** (andere Bereiche hängen daran).

## Farben (Palette aus dem design-brief, Kontrast geprüft)

| Token | Wert | Verwendung | Kontrast auf `--af-bg` |
| --- | --- | --- | --- |
| `--af-bg` | `#100e0d` | Grund | – |
| `--af-surface` | `#181513` | Flächen | – |
| `--af-raise` | `#201c19` | erhöhte Flächen (Menüs) | – |
| `--af-line` | `#2c2622` | Haarlinien (dekorativ) | – |
| `--af-field-line` | `#857a70` | Rahmen von Eingabefeldern, Pillen | 4,6:1 (≥ 3:1, WCAG 1.4.11) |
| `--af-ink` | `#f4efe8` | Text | 16,8:1 |
| `--af-muted` | `#a89e94` | Nebentext | 7,3:1 (AA ✓, keine Anpassung nötig) |
| `--af-gold` | `#e0a526` | einziger Akzent | 8,8:1 (AA ✓) |
| `--af-gold-light` / `--af-gold-deep` | `#f0c45a` / `#b9851a` | Verlauf im Namenszug | – |
| `--af-ok` / `--af-err` | `#9fc5a2` / `#e79a8c` | Status | 10,1:1 / 8,6:1 |

Gold-Button: dunkle Schrift `#100e0d` auf Gold = 8,8:1. Das Logo-SVG nutzt `#E8AE23`.

## Schrift (`src/app/fonts.ts`, selbst gehostet über next/font, OFL)

| Token | Schrift | Verwendung |
| --- | --- | --- |
| `--af-sans` | Geist | Oberfläche, Fließtext |
| `--af-mono` | Geist Mono | Preise, Mikro-Beschriftungen |
| `--af-display` | Cormorant Garamond (500/600, kursiv) | Namenszug, editoriale Überschriften |
| `--af-script` | Pinyon Script | Claim „HaarManufaktur“ |

Alle mit `latin-ext` (Polnisch, Türkisch).

## Bewegung

| Token | Wert |
| --- | --- |
| `--af-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` (Standard aus dem Export) |
| `--af-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--af-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--af-dur-fast` / `--af-dur` / `--af-dur-slow` | 180 / 360 / 600 ms |

`prefers-reduced-motion: reduce` setzt alle Animationen und Übergänge global auf praktisch 0.

## Maße

`--af-radius-s|…|xl` (12/16/22/28 px), `--af-space-1…9` (4–96 px), `--af-section` (Abschnittsabstand), `--af-nav-h` (72 px, fixierte Kopfleiste), `--af-touch` (44 px Mindestzielgröße), `--af-wrap` (Inhaltsbreite).

## Lichtatelier (hell, seit 21.11.2026)

Der Auftraggeber wollte die Seite durchgehend hell („hell ist fröhlicher und hebt die Kauflaune“). Die frühere Hybrid-Lösung (dunkle Bühnen, helle Zonen) ist damit aufgehoben: `:root` und `.af-zone-light` tragen dieselben hellen Werte.

| Token | Wert | Verwendung |
| --- | --- | --- |
| `--af-bg` / `--af-surface` / `--af-raise` | `#fbf7f1` / `#f5ede3` / `#ffffff` | Elfenbein, Sand, Karten |
| `--af-ink` / `--af-muted` | `#1e1813` / `#685b50` | Text 16,5:1 / Nebentext 6,2:1 |
| `--af-gold` | `#8c5e06` | Gold als **Text und Linie** (5,3:1) |
| `--af-gold-fill` + `--af-on-gold` | `#e8ae23` + `#1e1813` | Gold als **Fläche**, Schrift immer dunkel (8,8:1) |
| `--af-cream` / `--af-blush` | `#f8eed9` / `#f7e4d8` | warme Lichtschimmer |
| `--af-shadow-s/-/-l` | warme Schatten | Karten, Kacheln, Bilder |
| `--af-focus` | `#1e1813` | Fokusring |

- **Glas:** `.af-glass` ist Elfenbein-Glas, `.af-glass--gold` goldgetöntes Glas mit leuchtender Lichtkante und dunkler Schrift (Hauptknöpfe), gewählte Filter dunkles Glas. Plaketten auf Bildern sind Elfenbein-Glas.
- **Dunkle Inseln** nur, wo Text auf einem Foto steht: `.af-ondark` (Film-Kachel, Maßanfertigungs-Kachel im Hero) und die gerahmte Abschlusskarte `.close` der Startseite.
- **Hero „Schaufenster“** (`HeroShowcase.tsx`, `.af-hx*`): Versprechen mit Live-Zahl echter Einzelstücke und Einstiegen nach Bedarf, der Film „Wie neu geboren“ als eine 15-s-Datei (`public/assets/world/journey*.mp4`, quadratisch zugeschnitten) mit Kapitelstrichen und Pause-Knopf, Extensions mit Preis und Grundpreis im Wechsel, Kachel Maßanfertigung.
