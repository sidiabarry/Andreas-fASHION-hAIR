# shop-conversion: Shop-Umbau (Extensions zuerst)

Branch `worktree-agent-abe46350aca06e99c`. `npm run verify` grün (44 Tests), `npm run build` grün. Screenshots (1440/390) von Kollektion, /extensions, /massanfertigung, Produktseite 425 selbst geprüft und nachgebessert (Klassenkollision `af-methods`/`af-steps` mit globals.css behoben).

## Was geändert wurde
- **Navigation:** Extensions · Perücken & Topper · Maßanfertigung · Pflege & Zubehör · Über Andrea · Beratung (Kapsel). Footer: oben Maßanfertigungs-Band, Spalte Kollektion beginnt mit Extensions-Übersicht und endet mit Maßanfertigung. `footer.claim` neu (Extensions zuerst).
- **Kollektion:** Standardreihenfolge Extensions zuerst, innerhalb Kategorie Farben gemischt. Filter Methode (nur Extensions), Farbgruppe, Länge (bis 30 / 31–45 / ab 46 cm) als Links (`methode`, `farbe`, `laenge`), mit Anzahl, Zurücksetzen, Sortierung erhält Filter. Gefilterte Ansichten `noindex`. Logik rein in `src/lib/collection.ts` (getestet).
- **Produktseite:** Spezifikations-Chips (Methode, Länge, Packung/Set, Farbe, Struktur, Basis), Galerie Studio, Zweitbild, Originale, Bildart-Hinweis je `imageKind`, Vergleichsregler mit passendem Text, Packungsfrage als Beratung, Beratungsblock, Maßanfertigungs-Streifen (alle Haarprodukte), Zubehör (nur vorhandene Pflege-Produkte) bei Extensions, Frage „Wie viele Packungen?“ ohne Zahl.
- **/extensions:** Hero, Methoden mit Link auf gefilterte Kollektion oder Anfrage, Farbhilfe (Tageslicht, Foto an Andrea, Farbgruppen-Links), Packungsfrage als Beratung (WhatsApp/Anfrage), Produktraster, Maßanfertigungs-Streifen, Salon und Anfrageformular. `ExtensionsSection` entfernt.
- **/massanfertigung:** sechs Schritte (System, Länge, Farbe, Struktur, Menge, Kontakt) über `InquiryForm` (`wizard`) und `CustomWizard`. Funktioniert über bestehende Felder; ohne JavaScript nicht schrittweise.
- **Farbnamen 422–428** laut Briefing in `catalog.json` (Farbe, Untertitel, Beschreibung, Specs), `image`, `restyled`, `imageKind: "staged"`, `secondImage`. Slugs bewusst unverändert (enthalten alte Farbnamen, z. B. `...blond-ombre-425`).
- CSS in `src/components/shop.css` (kein Eingriff in `globals.css`).

## Struktur für die Verkaufstexte (Text-Agent)
Optionale Felder am Produkt in `src/data/catalog.json`: `headline`, `story`, `benefits[]` (3–5), `howItWorks`, `goodFor`, `care[]`, `faq[{q,a}]` (Typ `ProductCopy`). Darstellung: headline unter Untertitel, story ersetzt die Beschreibung, benefits/howItWorks/goodFor/care im Block „Das Stück im Detail“ unter dem Produkt, faq vor den allgemeinen Einwänden. Ohne Felder gilt die bisherige Darstellung.
Übersetzung: `src/messages/catalog-copy/<lang>.json`, `{ "<id>": { "headline": "...", ... } }`, je Feld überschreibend, Rest fällt auf Deutsch zurück (`productCopy(product, locale)`). Bewusst nicht in `messages/catalog/<lang>.json`, weil `scripts/catalog-i18n` diese Dateien neu erzeugt. Die Dateien sind derzeit `{}`.

## Für i18n: deutsche Platzhalter in fr/es
Neue Schlüssel (de und en sauber, fr/es = deutscher Text): `nav.wigs/custom/care`, `footer.claim` (geändert), `footer.extensionsHub`, `collection.*` (lead geändert, leadExtensions, hubLink, byMethod, byColor, byLength, filterGroups, any, reset, empty, colors.*, lengths.*), `extensions.*` (metaTitle, heroTitle, heroLead, shopCta, adviceCta, methodsLead, inShop, onRequest, colorTitle, colorLead, colorSteps.*, colorNote, packKicker, packTitle, packText, packWhatsapp, packAsk, productsTitle, allPacks), `product.*` (imageAltStaged, imageNoteRelit, imageNoteStaged, compareNoteStaged, packQuestion, consult*, accessories*, moreExtensions, spec.*, copy.*), `objections.packQ/packA`, gesamter Namespace `custom.*`. Produkttexte 422–428 in en/fr/es stehen weiter aus (Fallback Deutsch, `TRANSLATION_PENDING`).

## Bildart-Text zur Prüfung durch legal-compliance
`product.imageNoteStaged` (exakt der Wortlaut aus dem Briefing) unter der Galerie, plus `compareNoteStaged` am Vergleichsregler, `imageAltStaged` als Alt-Text. `imageNoteRelit` für alle anderen Studiobilder.

## Offene Fragen / Risiken
- `platform`: `src/app/sitemap.ts` kennt `/extensions` und `/massanfertigung` noch nicht (STATIC-Liste).
- `platform`: Das Formular hat keine eigenen Felder für System und Struktur. Sie stehen als eine Zeile in `product` („Genius Weft · System: genius · Struktur: wellig“). Vorschlag: Felder `system`, `structure` im Schema und in der Mail.
- Andrea: Lieferzeit Maßanfertigung steht aus `config/shipping.ts` (15–20 Werktage), gilt jetzt auch für Extensions-Anfragen. Bitte bestätigen.
- Andrea: Struktur „naturlockig“ bei 426 weiter unbestätigt (legal-Hinweis); Farbe 422 jetzt „Dunkelblond mit hellen Reflexen“ lt. Briefing.
- Bestehende Produkttexte enthalten noch „Premium-Echthaar“ (legal: nur mit Beleg). Der Text-Agent ersetzt sie.
- Menü „Perücken & Topper“ führt auf `?kategorie=topper`; Perücken, Pony, Männer erreicht man über die Kategorie-Tabs. Ein gemeinsamer Filter für beide wäre eine Erweiterung.
- Grundpreiszeile in Kollektionskarten bricht bei Sets in zwei Zeilen um (nur Optik).
- Kein Funktionstest des Wizards im Browser mit Absenden durchgeführt (Demo-Server lief, Seite lädt); bitte QA.
