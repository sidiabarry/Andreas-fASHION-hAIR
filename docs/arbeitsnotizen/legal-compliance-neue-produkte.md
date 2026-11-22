# legal-compliance: neue Produkte 422–428 (Extensions online, V-Toupet)

Stand 20.11.2026 · Branch `worktree-agent-a2a4bf96b920e1a0b`, Commit a3cf743 (basiert auf `claude/friendly-hopper-ktjxqu`, per Fast-Forward nachgezogen) · keine Rechtsberatung

## Wichtigste Vorgabe für shop-conversion

**Der Grundpreis darf nicht „X € / 100 g“ lauten, sondern muss „X € / 1 kg“ heißen.**
§ 5 Abs. 1 PAngV schreibt als Mengeneinheit 1 Kilogramm vor. 100 g ist nur bei *loser* Ware zulässig (§ 5 Abs. 2). Die Packungen sind Fertigpackungen (§ 2 Nr. 2 PAngV i. V. m. § 42 Abs. 1 MessEG). Die frühere 100-g-Ausnahme für Waren bis 250 g ist am 28.5.2022 entfallen. `check:launch` blockiert jetzt, sobald in `src/messages/**` (ohne `catalog/`), `src/components/**` oder `src/lib/**` „€ / 100 g“ oder „/ 100 g“ steht.

## 1. Grundpreis (§ 4 PAngV), Primärquelle abgerufen am 20.11.2026

| ID | Produkt | Gesamtpreis | Gewicht | Grundpreispflicht | Grundpreis |
|---|---|---|---|---|---|
| 422 | V-Toupet | 490,00 € | 117 g | **nein** (Stückware, das Gewicht beschreibt das Stück und ist keine Verkaufsmenge) | – |
| 423 | Clip-in-Set, 3 Tressen | 390,00 € | 194 g | **ja** | 2.010,31 € / 1 kg |
| 424 | Genius Weft Naturdunkelbraun | 115,00 € | 50 g | ja | 2.300,00 € / 1 kg |
| 425 | Genius Weft Blond Ombré | 135,00 € | 50 g | ja | 2.700,00 € / 1 kg |
| 426 | Genius Weft Kaffeebraun Ombré | 115,00 € | 50 g | ja | 2.300,00 € / 1 kg |
| 427 | Invisible Tape | 60,00 € | 25 g | ja | 2.400,00 € / 1 kg |
| 428 | Butterfly Weft Dunkelbraun | 130,00 € | 50 g | ja | 2.600,00 € / 1 kg |

Begründung: § 4 Abs. 1 PAngV gilt für Ware in Fertigpackungen, die „nach Gewicht … angeboten“ wird. Bei Extensions ist das Gewicht die herausgehobene Mengenangabe: Danach vergleichen Kundinnen und danach planen sie die Fülle. Laut IT-Recht Kanzlei (OLG-Rechtsprechung zur Flächenangabe) reicht eine herausgehobene Mengenangabe, die als Bewertungskriterium dient. Beim **Clip-in-Set** greift § 4 Abs. 3 Nr. 2 (verschiedenartige Erzeugnisse) nicht, denn es sind drei gleichartige Tressen. Wir gehen deshalb den vorsichtigen Weg und geben einen Grundpreis an. Abs. 3 Nr. 7 (kosmetische Mittel) passt nicht auf Haarteile. Beim **V-Toupet** ist kein Grundpreis nötig. Das Gewicht gehört dort nur in die Spezifikation („Gewicht: 117 g“), nicht als herausgestellte Mengenangabe neben den Preis.

**Technik:**
- `netWeightGrams` **nur** bei Gewichtsware setzen (Extensions/Clip-in). Beim Toupet `netWeightGrams` weglassen und das Gewicht in `specs` schreiben. Ein Grundpreis beim Toupet wäre nicht verboten, kann aber verwirren und wäre bei Rundungsfehlern angreifbar.
- Berechnung in Cent: `Math.round(priceCents * 1000 / netWeightGrams)`. Geprüft: 39000 → 201031 Cent = 2.010,31 €.
- Der Grundpreis enthält alle Preisbestandteile (§ 2 Nr. 4). Kleinunternehmerin: Am Grundpreis ist kein USt-Zusatz nötig, der Hinweis auf § 19 UStG gilt wie beim Gesamtpreis.

**Wo (§ 4 Abs. 1: „Anbieten“ und „Werbung unter Angabe von Preisen“, „unmissverständlich, klar erkennbar und gut lesbar“):**
- Produktseite: direkt unter oder neben dem Preis, auf einen Blick erfassbar. **Pflicht.**
- Kollektionskarten, Startseiten-Teaser, Suchergebnisse, „ähnliche Produkte“, also jede Stelle mit Preis: **Pflicht**. Alternativ dort keinen Preis zeigen.
- Warenkorb und Bestellübersicht vor „Zahlungspflichtig bestellen“: **dringend empfohlen**, weil das noch zum Angebot gehört. So ist man auf der sicheren Seite.
- Nicht nur per Tooltip oder Mouseover (LG Bochum laut IT-Recht Kanzlei), nicht kleiner als gut lesbar.
- JSON-LD (`unitPricingMeasure`) ist optional, keine Pflicht.

**Exakte Formulierungen (de):**
- Preiszeile Produktseite/Karte: `115,00 €`, darunter `je Packung 50 g · 2.300,00 € / 1 kg`
- Clip-in-Set: `390,00 €`, darunter `Set (3 Tressen) 194 g · 2.010,31 € / 1 kg`
- Warenkorbzeile: `Genius Weft, 50 g · 2.300,00 € / 1 kg`
- Vorschlag für Message-Schlüssel: `product.unitPrice` = `"{amount} / 1 kg"`, `product.packSize` = `"je Packung {grams} g"`, `product.setSize` = `"Set ({pieces} Tressen) {grams} g"`. en: `"{amount} / 1 kg"`, `"per pack {grams} g"`, `"set ({pieces} wefts) {grams} g"`; fr: `"{amount} / 1 kg"`, `"par paquet {grams} g"`, `"lot ({pieces} trames) {grams} g"`; es: `"{amount} / 1 kg"`, `"por paquete {grams} g"`, `"set ({pieces} cortinas) {grams} g"`. Die fr- und es-Fassungen sollte das i18n-Team prüfen.

## 2. Widerruf / Hygiene

- **Kein pauschaler Ausschluss.** § 312g Abs. 2 Nr. 3 BGB setzt dreierlei voraus: Die Ware wird versiegelt geliefert, sie ist aus Hygienegründen nicht rückgabefähig, **und** das Siegel wurde entfernt. Der BGH legt das eng aus (Matratze, VIII ZR 194/16).
  - Weft-Tressen (Genius, Butterfly) und Clip-ins lassen sich reinigen, ein Ausschluss greift also nicht.
  - Invisible Tape: Ein Ausschluss käme höchstens bei tatsächlich angebrachtem Siegel in Frage und ist rechtlich unsicher. Besser schützt der **Wertersatz** (§ 357a Abs. 1 BGB), wenn Schutzfolien abgezogen oder Tapes verklebt wurden.
- **Die bestehende Widerrufsbelehrung passt.** Sie deckt bereits ab:
  - Extensions, die nach Vorgabe gefärbt, zugeschnitten oder angefertigt werden (Nr. 1),
  - versiegelte, gekennzeichnete Hygieneware (Nr. 3),
  - den Wertverlust,
  - den Rücksendehinweis „nicht schneiden, färben, waschen oder kleben“.

  Eine Textänderung ist **nicht nötig**, also stehen auch keine Übersetzungen aus.
- **Hinweis am Produkt (Extensions 423–428), exakt:**
  > Sie können Ihre Bestellung innerhalb von 14 Tagen widerrufen. Bitte prüfen Sie Farbe und Länge, bevor Sie Tressen kürzen, einarbeiten oder Schutzfolien abziehen – für einen Wertverlust durch eine Nutzung, die über die Prüfung hinausgeht, kommen Sie nach der Widerrufsbelehrung auf.
- **Keinen** Siegel- oder „kein Widerruf“-Hinweis zeigen, solange Andrea nicht bestätigt, dass tatsächlich versiegelt wird (siehe Fragen).

## 3. Werbeaussagen (§ 5 Abs. 2 Nr. 1 UWG: Beschaffenheit, Zusammensetzung, Herstellungsverfahren, zu erwartende Ergebnisse)

| Aussage | Risiko | Sichere Formulierung |
|---|---|---|
| „Man sieht nichts, wenn man es trägt“ (427) | **hoch**: absolutes Ergebnisversprechen, hängt von Haar, Einarbeitung und Frisur ab | „Flache, schmale Tapes, die sich bei fachgerechter Einarbeitung unauffällig ins eigene Haar einfügen.“ Kein „unsichtbar“, kein „man sieht nichts“. Der Produktname „Invisible Tape“ ist als Methodenbezeichnung in Ordnung. |
| „niemand sieht einen Übergang“ (bestehende Texte, **36** Topper/Perücken) | mittel bis hoch, gleicher Typ | „Der Übergang zum eigenen Haar ist fein und unauffällig.“ Liegt außerhalb dieses Auftrags, `check:launch` meldet es aber als Hinweis. Bitte an die Katalog-Zuständigen weitergeben. |
| „Premium-Echthaar“ / „Top-Qualität“ | gering, gilt als reklamehafte Anpreisung; bei Echthaar wird es aber als Qualitätsstufe verstanden (Remy/Kutikula?) | „Echthaar“ plus belegbare Fakten (Länge, Gewicht, Farbe). „Premium-Echthaar“ nur weiterverwenden, wenn Andrea sagen kann, was es auszeichnet. „Top-Qualität“ weglassen. |
| „Double Drawn (bis in die Spitzen gleichmäßig voll)“ (424) | mittel: Fachbegriff mit festem Inhalt (kurze Haare aussortiert); „gleichmäßig voll“ ist absolut | Nur mit Lieferantenangabe: „Double Drawn: kürzere Haare sind aussortiert, die Längen bleiben bis in die Spitzen dicht.“ Ohne Beleg weglassen. |
| „naturbelassen, ungefärbt“ (424) | **hoch** bei „naturbelassen“, denn Echthaar-Extensions sind fast immer behandelt (Waschen, Dämpfen, Säurebad); „ungefärbt“ ist nachprüfbar | Nur mit Lieferantenbeleg: „Naturfarbe, ungefärbt“. „Naturbelassen“ streichen, außer der Lieferant bestätigt schriftlich, dass keine chemische Behandlung stattfand. |
| „Einzelstück“ (`flagUnique`, `uniqueMsg`) sowie „Jedes Stück … existiert genau einmal“ und „von Hand gefertigt“ (Seitentexte) | **hoch** bei Packungsware mit mehreren Packungen: Fake-Knappheit (CLAUDE.md Regel 2) und Irreführung über die Herstellung | Bei 423–428 kein Einzelstück-Flag, solange mehrere Packungen vorrätig sind. Allgemeine Texte („von Hand gefertigt“, „Haar für Haar“) nicht auf Extensions beziehen. |
| Locken bei 426 | Struktur unbestätigt | Keine Strukturangabe, bis Andrea sie bestätigt. Ist das Haar glatt, Fotos mit gestylten Locken als „gestylt“ kennzeichnen. |

## 4. check:launch (umgesetzt in `scripts/check-launch.ts`)

- Als Gewichtsware gilt: Kategorie `extensions` **oder** der Name enthält Genius/Butterfly Weft, Invisible Tape, Tape-In, Clip-In, Bonding oder Extension. Dafür wird geprüft:
  - fehlendes oder ungültiges `netWeightGrams` → **blockierend** (Grundpreis nicht berechenbar)
  - leere `color` → **blockierend** (wesentliche Eigenschaft nach Art. 246a § 1 Abs. 1 Nr. 1 EGBGB, nötig für den Farbabgleich zwischen Packungen)
- „€ / 100 g“ in `src/messages` (ohne `catalog/`), `src/components` oder `src/lib` → **blockierend**
- Absolute oder belegbedürftige Werbeaussagen im Katalog → Hinweis (derzeit 36 Produkte mit „niemand sieht“)
- Mit Testdaten geprüft (Weft ohne Gewicht und Farbe, Datei mit „/ 100 g“), danach zurückgesetzt.
- Die fehlende Farbe beim **V-Toupet (422)** blockiert bewusst **nicht**, weil auch Bestandsprodukte ohne Farbe sind. Trotzdem vor dem Livegang nachtragen.
- Schema-Annahme: Das Feld heißt `netWeightGrams` (Zahl, Gramm), die Kategorie voraussichtlich `extensions`. Weicht das ab, bitte melden.

## 5. Rechtstexte

Es ist keine Anpassung nötig:
- AGB, Versand- und Widerrufsseite enthalten keine Aussage „Extensions nur auf Anfrage“ (per Grep geprüft).
- Widerrufsbelehrung und AGB § 8 decken Anfertigungen nach Kundenwunsch ab.
- Die Lieferzeit für lagernde Ware (2–5 Werktage) gilt auch für Packungen.

**Optional** (nicht umgesetzt, weil 8 Übersetzungen folgen müssten): im Rücksendehinweis „einarbeiten oder Schutzfolien abziehen“ ergänzen. Der Produkthinweis oben reicht aus.

Aktualisierte Docs:
- `docs/COMPLIANCE.md`: neuer Abschnitt 4b
- `docs/QUELLEN.md`: §§ 2, 4, 5 PAngV, § 42 MessEG, § 5 UWG, § 312g BGB, IT-Recht Kanzlei, Abruf 20.11.2026
- `docs/CHECKLISTE-LAUNCH.md`

## Fragen an Andrea (mit Empfehlung)

1. **Welche Farbe hat das V-Toupet (422)?** Empfehlung: Andreas eigener Wortlaut (z. B. „Blond mit Strähnen“), aber nur, wenn sie ihn bestätigt.
2. **Sind es wirklich 50 g bzw. 25 g netto je Packung** (nur Haar, ohne Karte und Verpackung)? Packt Andrea selbst ab? Dann ist sie Abpackerin, und die Füllmengenangabe auf der Packung (MessEG/FPackV) muss stimmen. Empfehlung: Lieferantenetikett fotografieren und ablegen.
3. **Gibt es Belege für „Double Drawn“, „ungefärbt“, „naturbelassen“ und „Premium“** (Lieferantenspezifikation)? Empfehlung: Ohne schriftlichen Beleg weglassen.
4. **Wie viele Packungen sind vorrätig?** Davon hängt ab, ob „Einzelstück“ erscheinen darf (bei mehreren Packungen: nein).
5. **Werden Tapes oder Packungen versiegelt geliefert?** Empfehlung: Keinen Widerrufsausschluss nutzen, stattdessen den Hinweis auf Wertersatz.
6. **Wird Haar auf Bestellung gefärbt oder gekürzt?** Dann als Anfertigung kennzeichnen (Widerrufsausschluss Nr. 1) und vorab deutlich darauf hinweisen.
7. **Ist Andrea bei Invisible Tape mit „fügt sich unauffällig ein“ statt „man sieht nichts“ einverstanden?** Dasselbe gilt für „niemand sieht einen Übergang“ in den bisherigen Topper-Texten.
8. **Wer ist Hersteller der Extensions (GPSR)?** Gebraucht werden Name, Anschrift und E-Mail des Herstellers bzw. der verantwortlichen Person in der EU sowie Warnhinweise zu Kleber (Tape) und Hitze. Fehlen sie, fehlen die Pflichtangaben nach Art. 19 GPSR.

## Risiken

- Die Packungen und das Clip-in-Set als „nach Gewicht angeboten“ einzuordnen, ist eine vorsichtige Auslegung. Zu Extensions speziell gibt es keine Rechtsprechung (Websuche ohne Treffer). Ein überflüssiger, aber korrekter Grundpreis schadet nicht. Ein falscher (100 g) ist abmahnfähig.
- Werbeaussagen ohne Beleg sind ein typischer Abmahngrund. Die 36 Bestandstexte mit „niemand sieht“ haben dasselbe Risiko.
- Bestehende Seitentexte (Einzelstück, handgefertigt) passen nicht zu zugekaufter Packungsware.
