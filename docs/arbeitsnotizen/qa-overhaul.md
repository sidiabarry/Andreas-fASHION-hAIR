# QA-Gesamtprüfung overhaul (Branch claude/friendly-hopper-ktjxqu, Port 3600)

## Prüfungen
- verify: GRÜN, 44/44 Tests, Lint und Typecheck ohne Fehler.
- build: GRÜN (Generating static pages 8/8). Hinweise sind Warnungen aus check:launch.
- check:launch: ROT im Warnmodus. Offene Pflichtangaben (✗): company.ts returnCosts, disputeResolution, legalEffectiveDate, paymentMethods, register (Handelsregister); Gewährleistungsgrafik fehlt (src/config/legal-assets.ts). Warnungen (!): vatId, GPSR bei Walker-Tape-Artikeln (220, 228, 234), Werbeaussagen bei 36 Produkten (docs/COMPLIANCE.md 4b), Verfügbarkeit "unknown", RESEND_API_KEY/MAIL_FROM/MAIL_TO_OWNER nicht gesetzt.
- HTTP-Status: alle Seiten 200, `/de/gibts-nicht` 404 (korrekt).
- Konsolenfehler/pageerror: keine, außer dem erwarteten 404-Ressourcenfehler auf `/de/gibts-nicht`.
- Horizontaler Überlauf: nur mobil `/fr` und `/es` Produkt 425 (scrollWidth 410 bei 390).
- Bilder ohne alt / naturalWidth 0: keine Treffer.
- Reduzierte Bewegung `/de` (1440): 0 canvas, Text vollständig lesbar (9107 Zeichen), keine Fehler.
- Tastatur `/de`: 25 Tab-Stopps, alle mit sichtbarem Fokus (outline/box-shadow).
- Deutsche Reste in fr/es (Start): keine Treffer für und/der/die/das/nicht/Ihre/mit/für.
- Leistung `/de` (390): LCP 208 ms, CLS 0, JS 12 Dateien 178 KB übertragen (569 KB dekodiert), CSS 20 KB übertragen (96 KB dekodiert).
- Leistung Produkt 425 (390): LCP 136 ms, CLS 0, JS 12 Dateien 4 KB übertragen (546 KB dekodiert, vermutlich Cache), CSS 65 KB dekodiert.

## Mängel
### blockierend
1. Kontrast, `/de` 1440×900, Abschnitt "steps__list" (`.steps__list > .h-in:nth-child(2) > .h-subtitle`, `.h-text`, nth-child(3) `.h-subtitle`). axe color-contrast: Kontrast 1.02 bis 1.57. Verstößt gegen Regel 6 (Kontrast laut Tokens).
2. Launch-Sperre, alle Seiten: check:launch meldet offene Rechtsangaben (siehe oben). Ohne Klärung nicht livefähig.

### sollte
3. axe label-content-name-mismatch (serious), alle Seiten, Desktop 3–7 Knoten, Mobil 2–6. Desktop: `.af-nav__right > details`. Mobil Produkt: `.af-bag` und Sprachwahl `div:nth-child(4) > .af-locale > summary`. Sichtbarer Text ist nicht im accessible name enthalten (WCAG 2.5.3).
4. Mobil 390×844, `/fr` und `/es` Produkt 425: horizontaler Überlauf 20 px durch `A.af-cta-frame` (right=410).

### Kleinigkeit
5. `/de/gibts-nicht` lädt erwartungsgemäß 404-Ressource, Konsole zeigt sie. Kein Mangel, nur Hinweis.
6. Desktop `/de`: `.ribbon__track` ragt bis x=5857 über den Viewport, horizontal aber ohne Überlauf (verborgen). Prüfen, ob overflow:hidden gewollt ist.

## Nicht geprüft / offen
- Bilder: auf allen Seiten keine img-Elemente gefunden, daher keine Aussage zu Lazy-Loading.
- Screenshots liegen in `/home/user/Andreas-fASHION-hAIR/.coordination/shots/` (29 Dateien).
- Rohdaten: /tmp/claude-0/-home-user-Andreas-fASHION-hAIR/12dae72f-717b-5aa8-b8e9-045c2dbd28bb/scratchpad/qa-result.json und qa-extra.json.
