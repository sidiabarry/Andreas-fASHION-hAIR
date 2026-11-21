# Übergabe – Stand 21.11.2026

Für die Weiterarbeit in einem neuen Chat. Zuerst lesen: `CLAUDE.md` (Regeln, Agenten, Befehle), dann diese Datei.

## Wo der Stand liegt

- Branch **`claude/friendly-hopper-ktjxqu`**, alles gepusht. `main` ist älter (Stand vor dem Umbau). **Nichts ist live**, kein Vercel-Projekt angelegt.
- `npm run verify` grün (44 Tests), `npm run build` grün, `npm run check:launch`: **keine blockierenden Punkte** (nur Hinweise).
- Arbeitsnotizen aller Agenten (Recherchen, Briefings, Prüfberichte): `docs/arbeitsnotizen/`.

## Was gebaut ist

- **Shop-Ausrichtung:** Extensions zuerst → Perücken & Topper → Maßanfertigung (immer sichtbar: Menü, jede Produktseite, Footer). Seiten `/extensions` (Hub) und `/massanfertigung` (Anfrage in 6 Schritten).
- **7 neue Produkte 422–428** (V-Toupet + 6 Extensions), Mengenware mit Grundpreis je 1 kg, Verkaufstexte (Felder `headline/story/benefits/howItWorks/goodFor/care/faq`), alle 4 Sprachen. Briefing und Fakten: `docs/arbeitsnotizen/neue-produkte-2026-11.md`.
- **Produktbilder 422–428:** KI-Inszenierung (GPT Image 2.6 über Higgsfield), Haarfarbe gemessen und auf das Originalfoto korrigiert (ΔE < 2). Werkzeuge: `scripts/produktbilder/`. Gekennzeichnet als „KI-Inszenierung“, Originalfotos in der Galerie.
- **Startseite und „Über Andrea“:** Phönix-Faden, Kapitel I–III, Haar-Simulation in WebGL (eigene Engine, `src/components/fx/hair/`), 3D-Neigung, Cursor-Lupe, magnetische Knöpfe, Seitenübergänge (View Transitions).
- **Farbzonen nach Farbpsychologie** (`docs/arbeitsnotizen/farbpsychologie.md`): dunkle Bühnen (Marke, Galerie, Header/Footer), warm-helle Zonen `.af-zone-light` (Produktraster, Kaufspalte, Warenkorb, Kasse, Rechtstexte).
- **Glas-Designsystem** `af-glass` (Rauch-/Elfenbein-Glas, Lichtbrechung in Chromium) für Knöpfe, Kopfzeile, Plaketten, Filter, Kaufleiste, Schublade.
- **Recht:** Rücksendekosten Kundin, kein Handelsregister, keine Schlichtung, Zahlung PayPal + Vorkasse (Zahlungsdaten kommen mit der Auftragsbestätigung), Stand Rechtstexte 21.11.2026, Andrea Herstellerin aller Haarprodukte (GPSR), amtliche Gewährleistungsgrafik eingebunden. Walker-Tape-Pflegeprodukte ausgeblendet (`hidden: true`).
- **Übersetzungen:** de, en, fr, es vollständig.

## Grundsätze des Auftraggebers

- Ziel ist **Verkauf**. Der Kundin nur zeigen, was rechtlich nötig ist oder verkauft – keine Absicherungsfloskeln.
- Gestaltung „all out“: eigenständig, nichts darf generisch/KI-haft wirken.
- Farben der Produktbilder müssen dem Original entsprechen.
- Herkunft des Haars **nicht** Brasilien (keine Herkunftsangabe). Alles von Andrea handgefertigt.

## Offen

1. **Hauptknopf auf der Startseite** („Extensions entdecken“) ist als Rauchglas zu leise – Vorschlag: goldgetöntes Glas mit leuchtender Kante.
2. **Glas-Vorlage aus ChatGPT:** Der Auftraggeber hat dort eine Glas-Fassung; Screenshots/Code fehlen noch, dann angleichen.
3. Wirkung dunkler Produktfotos im hellen Raster auf echtem Handy prüfen; Lighthouse Mobile messen.
4. Vor dem Livegang: Mail-Zugangsdaten (Resend) in Vercel, `SITE_URL`, `IP_HASH_SECRET`, Vercel-Projekt anlegen, Domain umziehen. Optional: übrige 44 Altprodukte mit „Premium-Echthaar“ (unbelegt) bereinigen; Gewährleistungsgrafik auch in en/fr/es.
5. Startseiten-Hinweis von QA: `docs/arbeitsnotizen/qa-overhaul.md`.

## Arbeitsweise

Orchestrator verteilt an die Agenten in `.claude/agents/` (eigene Worktrees, `npm run wt:prepare`), merged und pusht. Agenten-Worktrees starten auf altem `main` – im Auftrag immer sagen, dass sie den Arbeitsbranch per Fast-Forward hereinziehen. Nach Servertests `pkill -f next-server`.
