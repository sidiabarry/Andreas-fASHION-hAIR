# legal-compliance: Prüfung nach dem Umbau (21.11.2026)

Branch: `worktree-agent-a6c708766abd44122` (Basis a490ae6, per Fast-Forward). Keine Rechtsberatung; vor dem Livegang anwaltlich prüfen lassen.

## Geändert

### Rechtstexte (eigener Bereich, alle 9 Sprachen)
- `agb.tsx`, `versand-zahlung.tsx` (de + en, fr, es, pt, it, nl, pl, tr): Lieferzeit Maßanfertigung jetzt **Gesamtlieferzeit innerhalb Deutschlands 15–20 Werktage**, ab dem Tag nach Eingang aller Angaben und (bei Vorkasse/PayPal) der Zahlung. Vorher: „fertigen wir in **etwa** …, den Versandtag teilen wir mit“. Das war unbestimmt (Art. 246a § 1 Abs. 1 Nr. 7 EGBGB) und passte nicht zur Oberfläche, die „Maßanfertigung 15–20 Werktage“ als Lieferzeit nennt. Ausland: Angabe vor Vertragsschluss.

### Produkttexte `src/data/catalog.json` (422–428) + catalog-copy en/fr/es + Grundtexte en/fr/es
- 422 headline „…aussieht, als wäre er immer Ihrer gewesen“ → „Ein Scheitel, der fällt wie Ihr eigenes Haar“ (kein „man sieht nichts“-Versprechen).
- 422 story: „ist in ihrem Atelier in Iserlohn entstanden, 46 cm natürliches Dunkelblond“ → „In ihrem Atelier in Iserlohn wartet dieses V-Toupet: 46 cm Dunkelblond mit hellen Reflexen“. Gründe: Ob Andrea das Stück selbst gefertigt hat, ist nicht belegt. „Natürlich“ deutet auf ungefärbtes Haar hin.
- 422 benefits: „ohne sichtbare Kante“ → „damit sich möglichst keine Kante abzeichnet“; „natürlichem Dunkelblond“ → „Dunkelblond“.
- 422 goodFor „**wieder** Fülle möchten“ → „sich dort **optisch mehr** Fülle wünschen“ (keine Lesart als Haarwuchs, HWG-Nähe).
- 423–428: Spec „Premium-Echthaar“ → „Echthaar“, Beschreibung „aus Premium-Echthaar“ → „aus Echthaar“. Dafür im Generator `scripts/catalog-i18n/{de,en,fr,es}.json` fünf Beschreibungsvorlagen ohne „Premium“ angepasst und `generate.mjs` neu ausgeführt (Rundlauf ok). Diese Vorlagen nutzen nur 423–428.
- 424/425/426/428: „Sie bekommen so viel Haar, wie Sie sich wünschen“ → „Sie kombinieren so viele Packungen, wie Sie für Ihr Ziel brauchen; wie viele das sind und ob genug vorrätig ist, sagt Andrea Ihnen persönlich.“ Der alte Satz versprach eine unbegrenzte Menge.
- 427 care: doppelte Zeile („Viele Hersteller empfehlen … 48 Stunden …“) entfernt. Die FAQ zum Widerruf nennt jetzt „14 Tage ab Erhalt“ und den Wertersatz mit konkreten Beispielen (Schutzfolie abgezogen, Tapes geklebt).
- 428 headline „Lange, volle Haare – Reihe für Reihe aufgebaut“ **bleibt**. Sie beschreibt das sichtbare Ergebnis einer Extension, nicht eine Wirkung am eigenen Haar, und „Reihe für Reihe“ macht das Hilfsmittel klar. Kein HWG-Bezug, weil keine Krankheit genannt ist.

### UI-Texte `src/messages/de.json` (+ en, fr, es sinngemäß)
- Bildhinweis: `product.imageNoteStaged`, `product.compareNoteStaged`, `product.imageAltStaged`, `home.ext.imageNote` → „**KI-gestützt** inszeniertes Studiobild: Haarfarbe am Originalfoto gemessen und angeglichen, **Form, Fülle und Anordnung inszeniert** und können vom Stück abweichen; Originalfotos in der Galerie“. Der alte Hinweis sagte weder „KI“ noch, dass die Form inszeniert ist.
- `home.ribbon.2` „Handwerk aus Rio de Janeiro“ → „Handwerk gelernt in Rio de Janeiro“ (konnte als Herkunft der Ware gelesen werden).
- `hero.lead` „persönlich auf Ihr Haar abgestimmt“ → „mit persönlicher Beratung zu Farbe und Menge“ (direkt bestellte Packungen werden nicht angepasst).
- `about.chapters.5.text`: „…und es **wiederbekommt**“ (zusammen mit Alopezie als Haarwuchs lesbar) → „…und sich mit einem passenden Haarteil wieder im Spiegel erkennt, fühlt sich oft wie neu geboren“.
- `about.colorsLabel` „in allen Tönen“ → „in vielen Tönen“.
- `objections.visibleA` (Nano-Skin) „sieht aus wie Ihre eigene Kopfhaut“ → „wirkt ähnlich wie eigene Kopfhaut … hängt auch von Farbe, Dichte und Sitz ab“.
- `objections.holdClips` „Das dauert Sekunden“ → ohne Zeitversprechen. Es widersprach der FAQ von 423 („die ersten Male dauern etwas länger“).
- `home.concerns.lead` „ohne Kleingedrucktes“ entfernt (es gibt AGB).
- `home.concerns.items.7.a` „in die EU **ab** {euShip}“ → „**für** {euShip}“ (Pauschale 15 €; „ab“ ist unbestimmt).
- `trust.delivery` „in der Regel“ entfernt (AGB nennen eine feste Frist).
- `product.extWithdrawal` „14 Tage“ → „14 Tage ab Erhalt der Ware“, fr „révoquer“ → „vous rétracter“.
- `home.custom.steps.1.text` „So lang, wie Sie es sich wünschen“ → „Ihre Wunschlänge. Was möglich ist, sagt Andrea Ihnen.“
- `home.custom.time`, `custom.timing`, `about.trust.2.text`: Lieferzeit statt „Fertigung“, Fristbeginn wie in den AGB. `custom.timing` (Seite /massanfertigung) nennt jetzt auch den **Widerrufsausschluss**.
- `meta.defaultDescription`: „Haar für Haar von Hand gefertigt“ (für das ganze Sortiment unbelegt) und „Jedes Stück ein Einzelstück“ (stimmt nicht für Packungen) → „…aus Echthaar, von der HaarManufaktur in Iserlohn. Jedes Haarteil ein Einzelstück.“ `footer.newsNote` und `newsletter.lead` sagen jetzt ebenso „Jedes Haarteil“.

### `scripts/check-launch.ts`
- „Premium“ in die Liste der Werbeaussagen aufgenommen (Hinweis). Die Prüfung erfasst jetzt auch headline, story, benefits, goodFor und faq.
- **Blockierend neu:** Heil-, Haarwuchs- und Krankenkassen-Aussagen in Katalog oder de.json; Herkunftsangabe zum Haar („brasilianisches Haar“ u. ä.); **GPSR-Herstellerangaben** fehlen (kein Feld `manufacturer`; betrifft derzeit 56 Produkte).

### Doku
- `docs/COMPLIANCE.md` Abschnitt 4c, `docs/QUELLEN.md` (KI-VO Art. 50, § 5 UWG, §§ 1, 3 HWG, Art. 246a EGBGB).

## Antworten auf die Prüffragen
1. **422–428:** Siehe oben. „Premium-Echthaar“ lässt sich nur mit einem Beleg sicher formulieren, also mit einer konkreten, nachprüfbaren Eigenschaft vom Lieferanten (z. B. „Remy, Schuppenschicht gleich ausgerichtet“). Bis dahin nur „Echthaar“. „Premium“ als bloße Anpreisung im Fließtext wäre eher hinnehmbar, in der Spezifikationsliste wirkt es aber wie eine Qualitätsstufe.
2. **Bildhinweis:** Der alte Text reichte nicht (kein „KI“, Form nicht erwähnt). Er gehört **unmittelbar ans Bild**, überall wo das inszenierte Bild groß erscheint: Produktgalerie (vorhanden), Vergleichsregler (vorhanden), Startseiten-Vitrine (vorhanden, `xc__fine` direkt unter den Karten), Alt-Text überall. Auf Kollektionskarten fehlt eine **sichtbare** Kennzeichnung (dort nur Alt-Text). Siehe Vorschlag unten.
3. **Startseite/Über Andrea:** Keine Heilversprechen gefunden. Zwei Formulierungen waren lesbar als Wirkung bzw. Herkunft (Phönix-Kapitel, „Handwerk aus Rio“), beide korrigiert. Andreas eigene Betroffenheit ist korrekt eingeordnet: in ihrer Stimme, als Erfahrung, ohne Produktversprechen, und gemäß `docs/ANDREA-GESCHICHTE.md` freigegeben. Erfundene Fakten habe ich nicht gefunden. Alle Angaben (19 Jahre, Rio, Pflege, rund drei Jahre Atelier, Sauna) stehen in der Quelle.
4. **/extensions und /massanfertigung:** 15–20 Werktage stehen nur bei Maßanfertigung, ab Lager 2–5. /massanfertigung nennt jetzt den Widerrufsausschluss, aber **ohne Link** (Vorschlag unten). Das Anfrageformular schließt keinen Vertrag; der Ausschluss muss deshalb **auch im Angebot bzw. in der Auftragsbestätigung** an die Kundin stehen (Art. 246a § 1 Abs. 3 EGBGB).
5. **Grundpreis:** vorhanden auf Karte, Startseiten-Vitrine, Produktseite (PriceNote), Warenkorb, Drawer und Kasse. **Fehlt**: StickyBuyBar (Produktseite), „Zuletzt angesehen“ (RecentlyViewed) und die Auswahlliste im Anfrageformular. Die Drawer-Vorschläge (Pflege, Flüssigkeiten je Liter) sind COMPLIANCE Nr. 14.

## Vorschläge außerhalb meines Bereichs (exakt)
- `src/components/product/StickyBuyBar.tsx`: neben `{price}` die Zeile aus `unitText(t, unit, locale)` zeigen; Prop `unit` von `produkt/[slug]/page.tsx` mit `unitInfo(product)` durchreichen. (§ 4 Abs. 1 PAngV: Grundpreis in unmittelbarer Nähe jedes Gesamtpreises.)
- `src/components/product/RecentlyViewed.tsx` Z. 34: nach dem Preis `p.unit ? unitText(...)` ausgeben (`ProductLite` hat `unit`).
- `src/components/forms/InquiryForm.tsx` Z. 179: dasselbe für `item.unit`.
- `src/app/[locale]/produkt/[slug]/page.tsx` Z. 150–157 (CompareSlider): bei `kind === "staged"` `studioLabel` und Überschrift nicht „Studiolicht“. Neue Schlüssel `product.compareStudioStaged` = „KI-Inszenierung“ (en „AI staging“, fr „Mise en scène IA“, es „Escenificación IA“) und `product.compareTitleStaged` = „KI-Inszenierung und Originalfoto im Vergleich“.
- `src/components/product/ProductCard.tsx`: bei `imageKindOf(product) === "staged"` ein kleines sichtbares Etikett am Bild, z. B. neuer Schlüssel `product.flagStaged` = „KI-Inszenierung“. Empfehlung, weil Art. 50 Abs. 4 KI-VO die Offenlegung spätestens beim ersten Kontakt mit dem Bild verlangt.
- `src/app/[locale]/massanfertigung/page.tsx` Z. 46: hinter `custom.timing` einen Link `<Link href="/widerruf">` mit dem vorhandenen Schlüssel `home.concerns.returnsLink` („Widerruf im Detail“).
- `src/data/catalog.ts`: optionales Feld `manufacturer: { name; address; email } | null` am `Product` und Anzeige auf der Produktseite (GPSR Art. 19). `check:launch` prüft das Feld bereits.
- Katalog außerhalb 422–428 (zuständig: shop-conversion bzw. Andrea): „Premium-Echthaar“/„100 % Premium-Echthaar“ bei 44 Produkten (Liste über `npm run check:launch`); „…wie Ihr eigener Haarwuchs wirkt“ und „der Spiegel zeigt …“ in 419, 417, 287, 241 sind absolute Erscheinungsversprechen → z. B. „…wirkt der Ansatz sehr natürlich“; Herstellerbeschreibung `menSystem` „damit niemand einen Übergang sieht“ (bereits als Hinweis gelistet).

## Offene Fragen an Andrea (mit Empfehlung)
1. **15–20 Werktage bei Maßanfertigung: bis zur Zustellung oder bis zum Versand?** Ich habe es als Gesamtlieferzeit festgelegt, wie Sie es im Gespräch als Lieferzeit genannt haben. Meinen Sie nur die Fertigung, dann besser „20–25 Werktage“ als Lieferzeit angeben. *Empfehlung:* Gesamtlieferzeit mit Puffer.
2. **Haben Sie das V-Toupet (422) und die Extensions 423–428 selbst gefertigt?** Davon hängen „gefertigt/entstanden im Atelier“ und die GPSR-Herstellerangabe ab. Bei zugekaufter Ware brauchen wir Name, Anschrift und E-Mail des Herstellers, bei Herstellern außerhalb der EU auch die verantwortliche Person in der EU. *Empfehlung:* Lieferantenrechnungen und Datenblätter ablegen.
3. **Was heißt „Premium“ bei Ihrem Haar?** Gibt der Lieferant Remy, Schuppenschicht oder Behandlung schriftlich an, verwenden wir genau diese Angabe. *Empfehlung:* bis dahin nur „Echthaar“.
4. **Wie viele Packungen sind je Farbe vorrätig?** Gibt es nur wenige, sollte die Menge im Shop begrenzt werden (derzeit bis 9 je Position).
5. **Werden Tapes (427) versiegelt geliefert?** Nur dann greift der Hygiene-Ausschluss (Nr. 3), sonst nur der Wertersatz. Gibt es Sicherheitshinweise zum Klebstoff der Tapes (Allergene)? Sie gehören laut GPSR ins Angebot.

## Risiken
- Die Formulierung zur KI-Kennzeichnung stützt sich auf eine Sekundärquelle zu Art. 50 KI-VO, weil EUR-Lex beim Abruf leer war. Vor dem Livegang am Amtsblatt gegenprüfen. Ob Produktinszenierungen „Deepfakes“ im Sinne von Art. 3 Nr. 60 sind, ist ungeklärt. Der Hinweis ist vorsorglich und wegen § 5 UWG ohnehin sinnvoll.
- Solange StickyBuyBar und RecentlyViewed keinen Grundpreis zeigen, bleibt ein PAngV-Risiko (typischer Abmahngrund).
- `check:launch` blockiert jetzt zusätzlich bei GPSR. Das ist beabsichtigt, bis Herstellerangaben vorliegen.
- Die Übersetzungen der Lieferzeitklausel in pt/it/nl/pl/tr hat kein muttersprachlicher Jurist geprüft.
- Screenshots (Desktop 1440, Handy 390) geprüft: Produktseite 423, Startseiten-Vitrine, /massanfertigung. Die längeren Hinweise brechen sauber um.
