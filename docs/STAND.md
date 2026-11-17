# Stand

Branch `nextjs`. Zuletzt aktualisiert beim jeweiligen Push.

## Steht (lauffähig, Build grün)

- Next.js 16, de/en, alle Routen erreichbar: Start (statischer Platzhalter-Hero bis der Design-Agent übernimmt), Kollektion mit Filter/Sortierung, Produktseite, Warenkorb, Kasse (Demo), Bestätigung (mit Code), Anfrage, Über Andrea, Kontakt, Impressum, Datenschutz, AGB, Widerrufsbelehrung, Versand und Zahlung, Widerrufsfunktion, 404.
- Rechtstexte des Rechtsagenten eingebunden (de maßgeblich, en übersetzt; andere Sprachen fallen auf Deutsch mit Hinweis zurück).
- Weiterleitungen aller alten Live-URLs (67 Prüfungen grün), Spracherkennung (22 grün), Tastatur (7), Kaufablauf inkl. Doppelverkauf-Schutz (12).
- Unit-Tests 29/29.

## Nächste Schritte

1. Rechtstexte-Stand `origin/legal-texts` erneut mergen (weitere Sprachen), Gewährleistungslabel.
2. Produktseite/Kasse-Conversion: feste Kaufleiste, Warenkorb-Schublade, einseitige Gastkasse, Merkliste/Zuletzt angesehen, Original-Vergleich, Einwände am Produkt.
3. Übrige Sprachen (fr, es, pt, it, nl, pl, tr).
4. Vollständiger Playwright-Lauf (alle Seiten × 4 Viewports, axe, CLS).

## Grenze zum Design-Agenten

Startseite: `src/app/[locale]/page.tsx`, `src/components/home/**`, `src/components/fx/**`, `src/styles/home.css`, Nachrichten `home.*`/`hero.*`. Schnittstellen in `docs/ARCHITEKTUR.md`, Tokens in `docs/DESIGN-TOKENS.md`.
