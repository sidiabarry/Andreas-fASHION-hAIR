# Design-Tokens

Alle Tokens stehen als CSS-Variablen in `src/app/globals.css` unter `:root`. **Ergänzen ist erlaubt, umbenennen nicht** (andere Bereiche hängen daran).

## Farben: „Lichtatelier“ (hell, seit Nov. 2026; Kontrast geprüft)

Hell, weil es fröhlicher wirkt und die Kauflaune hebt. Warmes Elfenbein statt Weiß, Gold bleibt der einzige Akzent.

| Token | Wert | Verwendung | Kontrast auf `--af-bg` |
| --- | --- | --- | --- |
| `--af-bg` | `#fbf7f1` | Grund (Elfenbein) | – |
| `--af-surface` | `#f5ede3` | Flächen (Sand) | – |
| `--af-raise` | `#ffffff` | Karten, Felder, Menüs | – |
| `--af-line` | `#e8ddd0` | Haarlinien (dekorativ) | – |
| `--af-field-line` | `#8f7f70` | Rahmen von Eingabefeldern, Pillen | 3,6:1 (≥ 3:1, WCAG 1.4.11) |
| `--af-ink` | `#1e1813` | Text | 16,5:1 |
| `--af-muted` | `#685b50` | Nebentext | 6,2:1 (5,2:1 auf Sand) |
| `--af-gold` | `#8c5e06` | Gold als **Text und Linie** (Preise, Kicker, Hover) | 5,3:1 (4,5:1 auf Champagner) |
| `--af-gold-fill` | `#e8ae23` | Gold als **Fläche** (Buttons, Zähler, Punkte), Logo-Gold | nur mit `--af-on-gold` darauf |
| `--af-on-gold` | `#1e1813` | Schrift auf Gold | 8,8:1 auf `--af-gold-fill` |
| `--af-gold-light` / `--af-gold-deep` | `#f4cf72` / `#a8740f` | Verläufe, Auswahl | – |
| `--af-champagne` / `--af-blush` | `#f8eed9` / `#f7e4d8` | warme Lichtschimmer, Flächenverläufe | – |
| `--af-night` | `#16110d` | Hintergrund hinter den (dunkel fotografierten) Bildern | – |
| `--af-ok` / `--af-err` | `#2e6b3c` / `#b0392a` | Status | 6,0:1 / 5,7:1 |
| `--af-shadow-s` / `--af-shadow` / `--af-shadow-l` | warme Schatten | Karten, Panels, Bilder | – |

**Regel:** Gold-Fläche immer mit dunkler Schrift (`--af-on-gold`), nie helle Schrift auf Gold. Gold als Text nur über `--af-gold`.

**Dunkle Inseln:** Wo Text auf einem dunklen Foto steht (Schlussbild „Der Spiegel wartet“), setzt die Klasse `.af-ondark` die Tokens lokal auf hell um (`--af-ink`, `--af-muted`, `--af-gold`, `--af-line`).

**Motiv Bogen:** `.af-arch` (+ `.af-arch-frame` für die goldene Kontur) ist die Spiegelform im Hero und in der Phönix-Geschichte.

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
