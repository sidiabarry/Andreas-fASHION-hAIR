# Hybrid-Farbzonen und Glas-Material (home-design, Farbauftrag)

Branch: siehe `git branch --show-current` im Worktree `agent-ab3d57fd6ab9dfaf1`. Basis: `claude/friendly-hopper-ktjxqu` @ 93b114a (Fast-Forward).
Commits: „Farbzonen: …“ und „Glas-Material: …“ (plus ggf. Feinschliff).

## 1. Farbzonen (Auftrag farbpsychologie.md, Abschn. 3 und 4)

### Technik
- `globals.css`, Abschnitt „Farbzonen (Hybrid)“ am Ende:
  - `.af-zone-light` setzt die bestehenden Tokens neu: `--af-bg #FAF6F0`, `--af-surface #F2EBE0`, `--af-raise/--af-card #FFFFFF`, `--af-ink #1C1815`, `--af-muted #5C5249`, `--af-gold/--af-gold-light #7A5600`, `--af-line #E3D8C8`, `--af-field-line #857868`, `--af-err #A4281F`, `--af-ok #2F6B3A`, `--af-focus #1C1815`, außerdem `--af-champagne`, `--h-champagne`, `--h-ember` (Startseite) auf Bronze. Alle Bausteine erben.
  - `.af-zone-dark` stellt die Bühne wieder her; automatisch auch für Bildflächen in hellen Zonen (`.af-card__media`, Zoom-Dialog), damit Plaketten auf Fotos dunkel bleiben.
  - Neue Tokens (nur ergänzt, nichts umbenannt): `--af-stage`, `--af-gold-stage` (#E0A526), `--af-paper`, `--af-paper-surface`, `--af-paper-card`, `--af-paper-ink`, `--af-gold-paper` (#7A5600), `--af-focus`, `--af-fade`, `--af-card`, `--af-zone-ground`, `--af-spring`. Der Fokusring liest jetzt `var(--af-focus, var(--af-gold))` (auf Dunkel unverändert Gold).
- Übergänge: `.af-zone-fade-top/-bottom` = warmer Verlauf (Bühne → Bernstein → Elfenbein), Breite `--af-fade` = clamp(80px, 8vw, 120px), liegt im Innenabstand (kein Text darauf). Ganz helle Seiten: Kopf- und Fußzeile bleiben Bühne, Kante als Gold-Haarlinie (`body:has(main.af-zone-light)`, `body:has(main[data-zone="light"])`).
- Scrollbalken: auf Seiten mit `main[data-zone="light"]` hell (Schacht #F2EBE0, Griff #857868); in hellen Zonen auch innere Scroller.

### Wo hell
| Bereich | Umsetzung |
| --- | --- |
| Kollektion | Kopf (H1, Lead, Hub-Link) bleibt Bühne; ab Werkzeugleiste/Filter/Raster/Maßanfertigungs-Streifen helles Band mit Verlauf oben |
| Produktseite | Galerie bleibt Bühne; Infospalte (Preis, Kaufknopf, Beratung, Vertrauen, FAQ) als Elfenbein-Blatt; am Handy randlos als Blatt unter der Galerie; darunter helles Band (Texte, Weitere Stücke, Zubehör) |
| Warenkorb, Kasse, Bestellbestätigung, Rechtstexte (LegalPage: Impressum, AGB, Datenschutz, Widerruf, Versand), Widerruf erklären, Kontakt, Anfrage | ganze `main` hell |
| Warenkorb-Schublade, feste Kaufleiste am Handy | hell (Elfenbein-Glas) |
| Startseite: „Fragen offen beantwortet“ (Concerns) | helles Band #F2EBE0 mit Verlauf oben und unten, liegt über dem Partikelfeld (z-index), damit kein Goldstaub über Fließtext läuft |
| Header, Footer, Hero, Markenstrecken, 404, Extensions-Hub, Maßanfertigung, Über Andrea | Bühne (unverändert) |

### Dunkel-Annahmen korrigiert
- Formularfelder (`input/textarea/select`, `af-ui-field`, `af-ui-select`, `af-ui-check`): weiß, Rahmen #857868 (3,99:1), Fokus dunkel + Bronze-Schein statt Goldglow; Häkchen/Radio gewählt in Tinte.
- Fokusring auf Hell: #1C1815, 2 px, 2 px Abstand, kein Goldhof.
- Karten: Bildfläche bleibt Bühne (Plaketten, Glanzlicht), dazu weicher warmer Schatten auf Hell.
- Cursor: FxUi setzt `data-zone="light"`, Punkt/Ring werden über hellen Zonen dunkel/bronze; Lupe bleibt (liegt über Bildern).
- Ladeanzeige (`af-ui-loading`): auf Hell bronzefarbene Glut; im dunklen Kaufknopf hell.
- Gold-Verläufe/Champagner-Akzente (`.h-title em`, Kapitelziffern, Streifen) auf Bronze umgestellt.
- `af-devnote` (nur Demo) hatte festen Dunkelrot-Grund → auf Hell #FBECE9.
- Auswahlzustände (Filter-Pille, Wizard-Wahl) in Tinte statt Gold („Gold nur als Licht“); Zweitaktionen (`af-drawer__add`) Rahmen in Tinte statt Gold.

### Kaufknopf (Variante A)
Fläche #1C1815 (als Rauchglas 95 %), Schrift #E0A526, Hover Bronze #7A5600 mit Weiß. Gilt für `af-cta-add`, `af-cta-band`, `af-cta-gold`, `af-sticky__btn`, `h-btn--gold` in hellen Zonen. Je Ansicht bleibt es bei genau einem primären Knopf (Produkt: In den Warenkorb ODER Im Warenkorb ODER Ähnliches anfragen; Warenkorb: Zur Kasse ODER Anfrage; Kasse: Bestellen). Die Kaufleiste am Handy erscheint nur, wenn der Kaufknopf aus dem Bild ist.

## 2. Glas-Material (Zusatzauftrag)

- `src/components/fx/GlassDefs.tsx` (Server-Komponente, im Layout): SVG-Filter `#af-glass-lens` (feTurbulence → feDisplacementMap → leichte Mattierung). Kein Skript.
- FxUi: setzt `html.af-lens` nur in Chromium (`navigator.userAgentData` + `CSS.supports`), sonst Fallback `blur() saturate()`. Glanzlicht folgt dem Zeiger über `--mx/--my` (nicht bei reduzierter Bewegung/Pause; dann steht es oben links).
- Klassen: `af-glass` (Rauchglas; in hellen Zonen automatisch Elfenbein-Glas), `af-glass--gold` (Goldlicht-Kante + Unterlicht; in heller Zone dunkles Rauchglas = Kaufknopf), `af-glass--ivory`, `af-glass--lens` (Lichtbrechung, nur kleine Flächen), `af-glass--badge`, `af-glass--caps`.
- Material: getönte Füllung + Glanzverlauf, Lichtkante oben (inset), dunkle Kante unten, Haarlinie, Gold-/Bronze-Unterlicht als 1-px-Verlauf. Kein Glow-Schatten, keine Verlaufsfläche.
- Form: `corner-shape: squircle` (Superellipse) wo unterstützt, sonst elliptische Radien 15px/19px; Plaketten 8px/10px.
- Bewegung: Feder (`--af-spring`), Druck = Linsenkompression `scale(0.975, 0.95)` mit innerem Schatten; Fokus = Lichtring (Abstand 2 px + Ring 4 px, auf Dunkel Gold mit weichem Schein, auf Hell Tinte).
- Typo/Optik: gesperrte Versalien (Geist, 0.17em) im Hero-Knopf und in der Kaufleiste, `text-box: trim-both cap alphabetic` für echte optische Mitte (Fallback Padding), Pfeil 0,5 px angehoben, Innenabstand bei Pfeil asymmetrisch (28/22 px).
- Eingesetzt: Hero (primär Glas mit Goldlicht + Lichtbrechung; sekundär Text mit Glasstab-Unterstrich), Kopfzeile (Glasleiste; Beratung, Merkliste, Menü als Glas; Sprachwahl und Warenkorb mit Lichtbrechung), Pause-/Wiederholen-Knöpfe im Hero und im Dock (Lichtbrechung), WhatsApp-Dock, Plaketten „KI-Inszenierung“/„Einzelstück“ (Kollektion und Startseite), Filter-Chips und Kategorie-Reiter (Elfenbein-Glas ohne backdrop-filter, da fester Grund), feste Kaufleiste am Handy, Warenkorb-Schublade (Elfenbein-Glas), alle bisherigen Gold-Pillen (`h-btn--gold`, `af-cta-gold`) sowie die hellen Kaufknöpfe.
- Leistung: Displacement nur auf ca. 6 kleinen Flächen (Hero-Knopf, Sprachwahl, Warenkorb, Pause/Wiederholen, Dock-Pause, Kaufknopf Handy). Große Flächen (Kopfzeile, Kaufleiste, Schublade) nur Weichzeichnen; Chips auf Elfenbein ohne backdrop-filter.

## 3. Prüfung
- `npm run verify` grün, `npm run build` grün (siehe Abschlusslauf).
- axe color-contrast nach vollständigem Scrollen + 3 s Wartezeit, 1440 und 390, mit Artikel im Warenkorb: Startseite, Kollektion, Produkt 425, Warenkorb, Kasse → 0 Verstöße (vor und nach dem Glas).
- Screenshots: `.coordination/findings/hybrid-vorher-nachher/`
  - `vorher-*` = Stand 93b114a, `nachher-*` = jetzt (Kollektion, Produkt 425, jeweils 1440 und 390, ganze Seite)
  - `nachher-kasse-*`, `nachher-home-*`, reduzierte Bewegung `nachher-rm-*`
  - Glas, 2×: `glas-vorher-*` (Stand nach Farbzonen, vor Glas) und `glas-nachher-*`: Hero-Knöpfe (+ Hover), Kopfzeile dunkel und hell, Kaufleiste am Handy.

## 4. Offene Fragen an Andrea / Auftraggeber
- Gefällt das Produkt-Infoblatt als „Papierkarte“ neben der dunklen Galerie, oder lieber eine durchgehend helle rechte Hälfte?
- Startseite: nur das Fragen-Band ist hell. Weitere Fließtext-Bänder (z. B. „Über Andrea“) wären möglich; bewusst nicht angefasst, weil dort die Atmosphäre trägt.
- Maßanfertigung, Extensions-Hub (mit FAQ) bleiben dunkel. Soll deren FAQ/Formular ebenfalls hell werden?
- Fotos: dunkle Studiobilder im hellen Raster wirken wie Schaufenster – bitte am echten Gerät ansehen.

## 5. Risiken / Hinweise für andere Bereiche
- Geänderte Fremdbereiche nur für Farbe/Zonen (laut Auftrag erlaubt): `kollektion/`, `produkt/`, `warenkorb/`, `kasse/`, `bestellung/`, `kontakt/`, `anfrage/`, `widerruf/erklaeren/`, `LegalPage`, `Header`, `LocaleSwitcher`, `CartDrawer`, `CartView`, `Checkout`, `AddToCart`, `StickyBuyBar`, `ProductCard`, `CustomWizard`, `ConsultBlock`, `extensions/`, `widerruf/`, `not-found` (nur Klassennamen ergänzt), `layout.tsx` (GlassDefs).
- `docs/DESIGN-TOKENS.md` müsste um die neuen Tokens und Zonenklassen ergänzt werden (nicht in meinem Schreibbereich).
- `corner-shape`/`text-box` sind neu (Chromium); andere Browser fallen sauber auf elliptische Radien/Padding zurück.
- `backdrop-filter: url()` ist Chromium-spezifisch; erkannt über `userAgentData`. Falls ein Chromium-Derivat das falsch rendert, zeigt es nur etwas stärkere Verzerrung in kleinen Knöpfen.
- Neue helle Seiten/Abschnitte bekommen die Zone einfach über `className="af-zone-light"` (ganze Seite zusätzlich `data-zone="light"` an `main`).
