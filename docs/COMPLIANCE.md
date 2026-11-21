# Compliance-Grundlage – Andrea's Fashion Hair

**Stand:** 21.11.2026 (Abschnitt 4c neu) · **Arbeitsstand:** Deutsche Rechtstexte vollständig (`src/content/legal/*`). Übersetzungen vollständig: en, fr, es, pt, it, nl, pl, tr (siehe Abschnitt 9).

> **Wichtig – bitte zuerst lesen.** Die Texte sind sorgfältig nach der Rechtslage vom November 2026 erarbeitet und an den Gesetzestexten geprüft (Quellen: `docs/QUELLEN.md`). Sie sind aber **keine Rechtsberatung**. Vor dem Livegang muss eine Rechtsanwältin/ein Rechtsanwalt oder ein Rechtstexter-Dienst (z. B. Händlerbund, IT-Recht Kanzlei, Trusted Shops) die Texte und den Bestellprozess prüfen. Steuerfragen gehören zur Steuerberatung. Die Punkte unter „Von Anwalt prüfen lassen“ (Abschnitt 5) sind dabei besonders wichtig.

Inhaberin: **Andreia Pereira Da Costa**, Einzelunternehmen, Geschäftsbezeichnung „Andrea's Fashion Hair“, Flehmestr. 2, 58642 Iserlohn. Kleinunternehmerin nach § 19 UStG. Versand mit DHL. Öffentliche E-Mail: andreasfashionhair5@gmail.com.

---

## 1. Muss vor Livegang

| # | Aufgabe | Warum | Wer |
|---|---|---|---|
| 1 | **Rechtsprüfung** aller Texte und des Bestellablaufs durch Anwalt/Rechtstexter-Dienst; idealerweise mit Update-Service und Abmahnschutz. | Abmahnrisiko; Gesetze ändern sich laufend (2026 allein: Widerrufsbutton, Gewährleistungslabel, Verpackungsrecht). | Inhaberin |
| 2 | **Gewerbeanmeldung** prüfen: Name muss exakt „Andreia Pereira Da Costa“ lauten; Tätigkeit „Handel mit Haarersatz, Zubehör und Pflegeprodukten“ (plus ggf. Anpassung/Anfertigung). „Andrea's Fashion Hair“ und „HaarManufaktur“ dürfen als **Geschäftsbezeichnung** geführt werden, aber Impressum, AGB und Rechnungen müssen den **bürgerlichen Namen** nennen. | § 5 DDG; Einzelunternehmer firmieren ohne Handelsregister unter ihrem Namen. Die Schreibweise „Andrea“ weicht von „Andreia“ ab. | Inhaberin |
| 3 | **Handwerksrecht klären** (Handwerkskammer Südwestfalen): Reiner Handel mit fertigen Haarteilen ist Gewerbe. Wer Haarteile am Kunden anpasst, schneidet, färbt oder einarbeitet, übt ggf. Tätigkeiten des **Friseurhandwerks** aus (HwO Anlage A Nr. 38, zulassungspflichtig; einen eigenen Beruf „Perückenmacher“ führt die HwO nicht mehr). Ggf. Eintragung in die Handwerksrolle/Ausnahmebewilligung. | Ordnungswidrigkeit bei unerlaubter Handwerksausübung; bei Eintragung gehört die Kammer ins Impressum. | Inhaberin |
| 4 | **Finanzamt:** Kleinunternehmerregelung bestätigen lassen (Grenzen 2026: Vorjahresumsatz ≤ 25.000 €, laufendes Jahr ≤ 100.000 € – bei Überschreiten von 100.000 € endet die Regelung sofort). Steuernummer gehört **nicht** ins Impressum. Eine USt-IdNr. ist für Kleinunternehmer nicht Pflicht; falls eine erteilt ist, muss sie ins Impressum (§ 5 Abs. 1 Nr. 6 DDG). | Preisangaben „ohne USt nach § 19 UStG“ müssen stimmen. | Inhaberin + Steuerberatung |
| 5 | **Verpackungsregister LUCID** registrieren **und** Versandverpackungen bei einem dualen System lizenzieren; Mengen melden. Seit 12.8.2026 gilt die EU-Verpackungsverordnung (PPWR) mit neuem deutschen Durchführungsrecht – aktuelle Pflichten bei der ZSVR prüfen. | Ohne Registrierung Vertriebsverbot und Bußgeld. | Inhaberin |
| 6 | **Auftragsverarbeitungsverträge (Art. 28 DSGVO)** abschließen bzw. im Konto akzeptieren: Vercel (DPA), Supabase (DPA, Region **EU/Frankfurt** wählen), Resend (DPA; speichert in den USA, DPF-zertifiziert). Kopien ablegen. | Ohne AVV ist der Einsatz rechtswidrig; die Datenschutzerklärung behauptet, dass AVV bestehen. | Inhaberin |
| 7 | **E-Mail-Postfach:** Ein kostenloses Gmail-Konto bietet **keinen AVV** für geschäftliche Nutzung. Entweder Google Workspace (mit Datenverarbeitungszusatz) oder ein EU-Anbieter mit AVV (z. B. mailbox.org, IONOS, Posteo Business) – idealerweise mit eigener Domain. | Kundenkorrespondenz enthält personenbezogene Daten; Datenschutzerklärung nennt Google als Anbieter. | Inhaberin |
| 8 | **Zahlungsarten festlegen** (`payments` in `company.ts`), Bankverbindung/PayPal-Konto eintragen. Empfehlung: Abschnitt 3, Frage 3. | Solange `false`, zeigt die Website den Marker „Zahlungsart noch festzulegen“. | Inhaberin |
| 9 | **Rücksendekosten** entscheiden (`returnCosts`). | Muss in der Widerrufsbelehrung stehen; sonst trägt die Händlerin sie automatisch (§ 357 Abs. 5 BGB). | Inhaberin |
| 10 | **Verbraucherschlichtung** entscheiden (`disputeResolution`). | § 36 VSBG; siehe Frage 4. | Inhaberin |
| 11 | **„Made in Germany“:** Fertigungsnachweis (wo wird geknüpft/injiziert/genäht?) dokumentieren und aufbewahren. Die Aussage ist nur zulässig, wenn die prägenden Herstellungsschritte in Deutschland stattfinden; „100 % Echthaar“ und Haarherkunft ebenfalls belegen können. Schreibweise auf der Live-Seite korrigieren („MADE INGERMANY“). | Irreführung (§ 5 UWG) ist ein typischer Abmahngrund. | Inhaberin |
| 12 | **Website-Anpassungen** (Website-Agent): siehe Abschnitt 8. Besonders: Bestellbutton „Zahlungspflichtig bestellen“ statt „Verbindlich reservieren“; Widerrufsbutton; Gewährleistungslabel; widersprüchliche Versandkosten-/Lieferzeitangaben bereinigen. | § 312j Abs. 3/4 BGB: Ohne korrekten Button kommt **kein Vertrag** zustande. | Website |
| 13 | **GPSR/Produktangaben** für jedes Produkt: Hersteller (Name, Post- und E-Mail-Adresse), bei Herstellern außerhalb der EU die verantwortliche Person in der EU, Produktidentifikation, Warn- und Sicherheitshinweise **direkt im Angebot** (Prüfliste Abschnitt 6). | Art. 19 Verordnung (EU) 2023/988; Abmahnungen wegen fehlender Herstellerangaben sind verbreitet. | Inhaberin + Website |
| 14 | **Grundpreise** für Flüssigkleber und C-22 Lösungsmittel (je 1 Liter) und für das Klebeband 3/4" × 12 yd (je 1 Meter) angeben. Füllmengen der Flaschen klären. Klebestreifen (Stückware) brauchen keinen Grundpreis. | § 4 PAngV; Ausnahme nur unter 10 ml. | Inhaberin + Website |
| 15 | **Gefahrstoffe** (C-22 Lösungsmittel, Flüssigkleber): Sicherheitsdatenblatt beschaffen, CLP-Kennzeichnung prüfen, Versandfähigkeit mit DHL klären (Prüfliste Abschnitt 6). Bis zur Klärung diese Produkte nicht ins Ausland und nicht per Luftfracht versenden. | Gefahrgut- und Chemikalienrecht. | Inhaberin |
| 16 | **Lieferzeit:** Von der Inhaberin bestätigt: lagernde Ware **2–5 Werktage** Gesamtlieferzeit in Deutschland (`deliveryDays`), Maßanfertigung **15–20 Werktage** (`madeToOrderDays`). Diese Werte überall gleich verwenden (Produktseite, Bestellübersicht, FAQ). Für das Ausland nennen die Texte die Lieferzeit „vor Vertragsschluss“ – die Website muss sie dann tatsächlich vor dem Bestellbutton bzw. im individuellen Angebot nennen. | Art. 246a § 1 Abs. 1 Nr. 10 EGBGB: Termin, bis zu dem geliefert wird. | Inhaberin + Website |
| 17 | `effectiveDate` setzen, sobald die Texte live gehen. | Stand-Angabe. | Website |

## 2. Soll bald (in den ersten Wochen)

- **Versicherungen:** Betriebshaftpflicht mit **Produkthaftpflicht** (Haarteile, Kleber und Lösungsmittel haben Hautkontakt; als Importeurin haftet man wie eine Herstellerin, § 4 Abs. 2 ProdHaftG).
- **Abmahnschutz:** Rechtstexte über einen Dienst mit Update-Service und Abmahnschutz beziehen oder prüfen lassen.
- **Verzeichnis der Verarbeitungstätigkeiten** (Art. 30 DSGVO): Bestellungen, Anfragen, Newsletter, Widerrufe, WhatsApp, Buchhaltung. Ein einfaches Dokument genügt.
- **Löschkonzept:** Anfragen ohne Vertrag nach Erledigung, spätestens 12 Monate; WhatsApp-Chats ebenso; unbestätigte Newsletter-Anmeldungen nach 30 Tagen; Rechnungen/Buchungsbelege 8 Jahre, Geschäftsbriefe 6 Jahre (§ 147 AO). Diese Fristen stehen so in der Datenschutzerklärung – sie müssen technisch umgesetzt werden (z. B. monatlicher Lösch-Job in Supabase).
- **Datenpannen-Prozess:** Bei einer Datenpanne Meldung an die LDI NRW innerhalb von 72 Stunden (Art. 33 DSGVO). Notfallkarte: Wer prüft? Wer meldet? Passwörter, 2-Faktor-Anmeldung bei Vercel, Supabase, Resend, PayPal, E-Mail.
- **Aufbewahrung:** Rechnungen (auch als Kleinunternehmerin mit Hinweis auf § 19 UStG), Kontoauszüge, Belege 8 Jahre; Bestätigungs-E-Mails 6 Jahre. E-Rechnung: Seit 1.1.2025 müssen Unternehmen E-Rechnungen **empfangen** können; im B2C-Geschäft bleiben Papier/PDF zulässig – Details mit der Steuerberatung.
- **Barrierefreiheit (BFSG):** Kleinstunternehmen (weniger als 10 Beschäftigte **und** höchstens 2 Mio. € Umsatz oder Bilanzsumme) sind für Dienstleistungen wie den Onlineshop ausgenommen. Die Ausnahme dokumentieren. Barrierearme Gestaltung trotzdem empfohlen.
- **Newsletter:** Double-Opt-in technisch nachweisbar speichern (Zeitpunkt Anmeldung, Bestätigung, IP optional). Keine Werbung an Bestandskunden ohne Einwilligung – die Bestandskundenausnahme des § 7 Abs. 3 UWG nutzen wir bewusst nicht.
- **Heilmittelwerberecht (HWG) und Krankenkasse:** Keine Heilversprechen („hilft gegen Haarausfall“). **Entscheidung der Inhaberin: keinerlei Aussagen zu Krankenkasse oder Kostenübernahme** – weder auf der Website noch in Mails oder Social Media. Die Rechtstexte enthalten keine solchen Aussagen.
- **Kosmetikrecht:** Prüfen, ob Kleber/Lösungsmittel als kosmetische Mittel gelten (Hautkontakt). Dann müssen sie im EU-Kosmetik-Portal (CPNP) notifiziert sein und eine verantwortliche Person in der EU haben – beim Hersteller/Importeur nachfragen.
- **Textilkennzeichnung:** Haarteile aus Menschenhaar sind nach unserer Einschätzung keine Textilerzeugnisse im Sinne der Verordnung (EU) Nr. 1007/2011 (Menschenhaar ist keine dort gelistete Textilfaser). Enthalten Basis oder Netz Textil (z. B. Lace aus Polyamid) mit mehr als 80 % Textilanteil am Gewicht, mit dem Rechtstexter klären.
- **Bewertungen:** Nur echte Bewertungen zeigen und angeben, ob und wie geprüft wird, dass sie von Käufern stammen (§ 5b Abs. 3 UWG). Keine „Bestseller“, „meistverkauft“ ohne Beleg.
- **Preise:** Keine Streich- oder „Sale“-Preise ohne Einhaltung von § 11 PAngV (niedrigster Preis der letzten 30 Tage). Derzeit nicht genutzt.

## 3. Offene Fragen an die Inhaberin (mit Empfehlung)

1. **Wer trägt die Rücksendekosten bei Widerruf?** – *Empfehlung:* Kundin trägt die unmittelbaren Kosten (`"customer"`); kulant im Einzelfall erstatten. Bei hochpreisigen Einzelstücken ist eine versicherte Rücksendung im Interesse beider – Hinweis auf der Retourenseite.
2. **Verbraucherschlichtung?** – Bei bis zu 10 Beschäftigten besteht keine Pflicht, sich zu erklären (§ 36 Abs. 3 VSBG). *Empfehlung:* `"not_willing"` – klar und kostenfrei. Wer teilnehmen will: `"willing"` (Universalschlichtungsstelle des Bundes in Kehl; für Unternehmen fallen Gebühren an).
3. **Zahlungsarten?** – *Empfehlung:* Vorkasse per Überweisung **und** PayPal; Kauf auf Rechnung (`bankTransfer`) erst später und nur für Stammkundschaft. PayPal-Zahlungsaufforderung erst nach Annahme der Bestellung.
4. **Lieferländer?** – *Empfehlung:* Zum Start nur Deutschland (`["DE"]`), EU auf Anfrage. Siehe Abschnitt 7.
5. **Welche Produkte werden versiegelt geliefert?** – Der Widerrufsausschluss für Hygieneware greift nur, wenn das Produkt tatsächlich **versiegelt** (z. B. Siegelaufkleber mit Hinweis „Nach Öffnen kein Widerruf“) ankommt. *Empfehlung:* Kleber, Klebebänder und Lösungsmittel versiegelt liefern; für Topper/Perücken siehe Abschnitt 5, Punkt 2.
6. **Ab wann gilt ein Produkt als Maßanfertigung?** – *Empfehlung:* Nur Produkte mit `madeToOrder: true` (z. B. „Maßgefertigte Haarprothese für Männer“). Das gilt auch für Extensions. Das „Echthaar-Haarsystem 20 cm“ wird „im Atelier angepasst“ – wird es vor dem Versand nach Kundenangaben verändert, ist es eine Anfertigung nach Kundenwunsch; dann vorab deutlich kennzeichnen. Sonst gilt das Widerrufsrecht.
7. **Lieferzeit?** – *Erledigt:* Inhaberin bestätigt **Werktage**: lagernd 2–5 Werktage (Deutschland), Maßanfertigung 15–20 Werktage. Alle Sprachfassungen verwenden den jeweiligen Begriff (business days, jours ouvrables, días hábiles, dias úteis, giorni lavorativi, werkdagen, dni robocze, iş günü).
8. **Woher stammt das Haar, wo wird gefertigt?** – Für „Made in Germany“ und GPSR-Herstellerangaben nötig. *Empfehlung:* Lieferanten- und Fertigungsnachweise ablegen.
9. **Kontakt-E-Mail-Anbieter?** – siehe Abschnitt 1, Nr. 7.
10. **Beschäftigte?** – Wenn mehr als 10 Personen: VSBG-Erklärung Pflicht, BFSG-Ausnahme prüfen.
11. **Social-Media-Profile:** Bei Instagram/Facebook braucht jedes geschäftliche Profil ein eigenes Impressum (Link auf die Impressumsseite in der Bio genügt, wenn er als „Impressum“ erkennbar ist). Für Facebook-Seiten besteht zudem eine gemeinsame Verantwortlichkeit mit Meta für Seiten-Statistiken (Art. 26 DSGVO).

## 4. Risiko-Tabelle

| Thema | Risiko | Wie die Website es löst | Was die Inhaberin tun muss |
|---|---|---|---|
| Bestellbutton | Ohne „Zahlungspflichtig bestellen“ kein Vertrag; Abmahnung | `checkoutTexts.buyButton` | – |
| Vertragsschluss erst nach persönlicher Prüfung | Kundin hält Bestellung für Kauf; Widersprüche | AGB § 2, `confirmationNotice`, Eingangsbestätigung „keine Annahme“, Annahmefrist 3 Werktage | Innerhalb von 3 Werktagen annehmen oder absagen; Absage-Mail nutzen |
| Widerrufsbutton (§ 356a BGB, seit 19.6.2026) | Fehlt er, verlängert sich die Widerrufsfrist bis zu 12 Monate + 14 Tage; Abmahnung | „Vertrag widerrufen“ auf jeder Seite, Bestätigung „Widerruf bestätigen“, automatische Eingangsbestätigung mit Datum/Uhrzeit | Widerrufe prüfen und erstatten |
| Gewährleistungslabel (seit 27.9.2026) | Fehlende harmonisierte Mitteilung = Verstoß gegen Informationspflicht | Offizielle Grafik (DVO (EU) 2025/1960, Anhang I, deutsche Fassung, farbig) sichtbar vor dem Bestellbutton und als Anhang der Auftragsbestätigung | – |
| Hygiene-Ausschluss Widerruf | Ausschluss unwirksam, wenn nicht versiegelt oder nicht hygienekritisch | Belehrung nennt nur versiegelte und gekennzeichnete Produkte | Siegel tatsächlich anbringen; Produktseiten kennzeichnen |
| Live-Seite verlangt „ungetragen, Originalverpackung, intakte Siegel“ | Originalverpackung als **Bedingung** für den Widerruf ist unzulässig | Rücksendehinweis nur als Bitte | Formulierung auf der Live-Seite entfernen |
| Kleinunternehmerin | Falsche USt-Angaben | Verzweigung `smallBusiness` in allen Texten | Umsatzgrenzen überwachen; bei Wegfall `false` setzen und Preise anpassen |
| Versandkosten | „ab 6 €“ ist unbestimmt; Live-Seite sagt „inklusive“ | Feste Beträge aus `shippingRates` | Beträge bestätigen; widersprüchliche Angaben entfernen |
| Gesundheitsdaten (Art. 9 DSGVO) | Unrechtmäßige Verarbeitung sensibler Daten | Formulare fragen nicht danach; `healthDataNotice` unter Freitextfeldern; Löschzusage | Unaufgeforderte Gesundheitsangaben löschen |
| Drittlandtransfer (Vercel, Resend, Google, Meta) | Wegfall des DPF durch EuGH (Verfahren C-703/25 P anhängig) | Datenschutzerklärung nennt DPF und SCC | Bei EuGH-Urteil Anbieter/Texte prüfen |
| GPSR | Fehlende Herstellerangaben – Abmahnung, Behördenmaßnahmen | Produktdaten-Felder (Website) | Herstellerdaten je Produkt liefern |
| Gefahrstoffe (C-22, Kleber) | Versand-/Kennzeichnungsverstöße | Hinweis „Versandbeschränkungen auf Produktseite“ | SDB, CLP-Etikett, DHL-Freigabe prüfen |
| „Made in Germany“, „100 % Echthaar“ | Irreführende Werbung | – | Belege vorhalten |
| Verpackung | Vertriebsverbot ohne LUCID | – | Registrieren, lizenzieren, melden |
| Impressum | Fehlender bürgerlicher Name | Marker `ownerFullName` | Name ist bekannt – in `company.ts` eintragen |

## 4a. Ergänzungen (Stand 17.11.2026, nach Rückmeldung der Inhaberin)

- **Versand weltweit (DHL-Vertrag inkl. Ausland):** DE 6,00 €, frei ab 150,00 €; EU 15,00 € (Standardwert – die Live-Seite sagt „ab 15 €“: „ab“ ist nach PAngV/Art. 246a Abs. 1 Nr. 7 EGBGB zu unbestimmt; wenn die EU-Preise je Land schwanken, eine Länder-Tabelle in `shippingRates` bzw. auf der Versandseite pflegen). Außerhalb der EU: Versandkosten und Lieferzeit werden **vor Vertragsschluss** individuell genannt. Technisch heißt das: Für Drittländer darf der Shop keinen Bestellbutton ohne konkreten Versandpreis zeigen – stattdessen Anfrage, individuelles Angebot und Bestellung erst mit genanntem Gesamtpreis. Zölle, Einfuhrumsatzsteuer und Gebühren im Bestimmungsland trägt die Kundin; AGB § 4 und die Versandseite weisen darauf hin (Art. 246a § 1 Abs. 1 Nr. 7 EGBGB: Hinweis, dass solche Kosten anfallen können).
- **Kleinunternehmerin und Auslandsversand:** EU-Lieferungen an Privatkunden bleiben in Deutschland steuerfrei (§ 19 UStG), solange die EU-weite Fernverkaufsschwelle von 10.000 € netto im Vorjahr und laufenden Jahr nicht überschritten ist (§ 3c Abs. 4 UStG). Ab Überschreiten gilt die Umsatzsteuer des Bestimmungslandes: Registrierung im OSS-Verfahren beim BZSt, Preise müssten dann für EU-Kunden Umsatzsteuer enthalten (Texte auf `smallBusiness: false` bzw. Länderlogik umstellen). Alternative: EU-Kleinunternehmerregelung (§ 19a UStG, BZSt). Drittland-Lieferungen sind Ausfuhrlieferungen – Ausfuhrnachweis (DHL-Zollpapiere) aufbewahren. Mit der Steuerberatung klären, bevor nennenswert ins Ausland verkauft wird.
- **Extensions (Butterfly Weft, Genius Weft, Invisible Tape, Tape-In, Keratin-Bondings, Clip-in):** Gleiche Logik wie bei Haarteilen. Kein pauschaler Widerrufsausschluss. Ausschluss nur, wenn (a) nach Kundenvorgabe gefärbt, zugeschnitten oder angefertigt (§ 312g Abs. 2 Nr. 1 BGB – in der Belehrung ergänzt) oder (b) versiegelt geliefert, hygienisch sensibel und entsiegelt (Nr. 3; z. B. Tape-In/Invisible Tape mit Klebefläche, Keratin-Bondings – Siegel tatsächlich anbringen und auf der Produktseite kennzeichnen). Clip-ins ohne Siegel: normales Widerrufsrecht. GPSR-Angaben (Hersteller, Warnhinweise zu Kleber/Keratin/Hitze beim Einarbeiten) je Produkt ergänzen. Bei Einarbeitung im Salon: Handwerksfrage wie oben (Friseurhandwerk).
- **Salons und Friseure (B2B):** AGB § 1 stellt klar, dass die AGB nur für Verbraucher gelten; Unternehmer erhalten ein individuelles Angebot (`checkoutTexts.b2bNotice`). Für B2B-Angebote sollte die Inhaberin eigene kurze Liefer- und Zahlungsbedingungen haben (Muster beim Rechtstexter-Dienst). Für Kleinunternehmerin: Rechnungen an Salons ohne USt mit Hinweis auf § 19 UStG.
- **Ratenzahlung über PayPal (standardmäßig aus, `payments.paypalInstallments`):** Baustein in AGB § 5 und auf der Versandseite vorbereitet: Kreditgeber ist PayPal, Bonitätsprüfung durch PayPal, die Inhaberin gewährt keinen Kredit. **Vor Aktivierung prüfen lassen:** (1) ob die Inhaberin durch das Anbieten als Kreditvermittlerin gilt (§ 655a BGB; Gewerbeerlaubnis nach § 34c GewO ist für Händler, die nur als Annex vermitteln, in der Regel nicht erforderlich – bestätigen lassen); (2) Werbung mit Raten („ab X € im Monat“) löst die Pflichtangaben für Verbraucherkredit-Werbung aus (§ 17 PAngV: Sollzinssatz, Nettodarlehensbetrag, effektiver Jahreszins, repräsentatives Beispiel) – PayPal stellt dafür eigene Banner/Texte bereit; keine eigenen Ratenbeträge bewerben. (3) PayPal-Händlerbedingungen für Ratenzahlung beachten.

## 4b. Extensions im Onlineverkauf und V-Toupet (Stand 20.11.2026)

- **Grundpreis (§ 4 Abs. 1 PAngV):** Pflicht für alle Extensions-Packungen (Genius Weft, Butterfly Weft, Invisible Tape je 25/50 g) und für das Clip-in-Set 194 g: Bei Extensions ist das Gewicht die herausgehobene Mengenangabe, nach der die Kundin vergleicht. Das Clip-in-Set ist keine Ausnahme nach Abs. 3 Nr. 2 (drei gleichartige Tressen, keine „verschiedenartigen Erzeugnisse“). Abs. 3 Nr. 7 (kosmetische Mittel) greift nicht: Haarteile sind keine Stoffe oder Gemische. **Kein** Grundpreis beim V-Toupet (Einzelstück, das Gewicht beschreibt nur das Stück).
- **Bezugsgröße 1 kg (§ 5 Abs. 1 PAngV).** „je 100 g“ ist nur bei loser Ware zulässig (Abs. 2). `check:launch` blockiert, wenn in `src/messages`, `src/components` oder `src/lib` „€ / 100 g“ steht.
- **Ort:** überall, wo der Preis der Packung steht (Produktseite, Kollektionskarten, Startseiten-Teaser, Suche, Warenkorb, Bestellübersicht), sichtbar und nicht nur im Tooltip.
- **Widerruf:** Normales Widerrufsrecht. Ausschluss nur bei Färbung/Zuschnitt nach Kundenwunsch (§ 312g Abs. 2 Nr. 1 BGB) oder bei tatsächlich versiegelter, entsiegelter Hygieneware (Nr. 3). Die Belehrung deckt das bereits ab. Bei Tapes schützt eher der Wertersatz (Schutzfolie abgezogen, geklebt) als der Hygiene-Ausschluss.
- **Werbeaussagen (§ 5 UWG):** „Man sieht nichts“ und „niemand sieht einen Übergang“ (bisher in 36 Produkttexten) sind absolute Versprechen; „Double Drawn“, „ungefärbt“, „naturbelassen“ sind nachprüfbare Beschaffenheitsangaben und nur mit Lieferantenbeleg zulässig. `check:launch` listet betroffene Produkte als Hinweis.
- **„Einzelstück“** nur bei Ware, die es tatsächlich einmal gibt; bei Packungsware mit mehreren Packungen nicht anzeigen.

## 4c. Prüfung nach dem Umbau (Stand 21.11.2026)

- **KI-gestützte Studiobilder (`imageKind: "staged"`):** Hinweis muss „KI-gestützt“ und „Form, Fülle und Anordnung inszeniert“ sagen (§ 5 UWG; Art. 50 Abs. 4 KI-VO spricht für eine Offenlegungspflicht, weil die Bilder einem real existierenden Gegenstand ähneln). Er steht unmittelbar am Bild: Produktgalerie (`product.imageNoteStaged`), Vergleichsregler (`product.compareNoteStaged`), Startseiten-Vitrine (`home.ext.imageNote`), Alt-Text überall (`product.imageAltStaged`). Offen (Website): Reglerbeschriftung „Studiolicht“ passt bei inszenierten Bildern nicht; kurze sichtbare Kennzeichnung auf Karten, wenn das Bild dort das Hauptbild ist.
- **„Premium-Echthaar“:** unbelegte Qualitätsstufe → bei 423–428 nur „Echthaar“. Für alle übrigen Produkte gleich verfahren, bis ein Lieferantennachweis vorliegt; `check:launch` listet „Premium“ als Hinweis.
- **Herkunft:** keine Herkunftsangabe zum Haar; „Handwerk aus Rio de Janeiro“ war als Produktherkunft missverständlich → „Handwerk gelernt in Rio de Janeiro“. „Entstanden im Atelier“ nur, wenn Andrea das Stück selbst gefertigt hat (Frage offen, auch für GPSR-Hersteller).
- **HWG-Nähe:** Alopezie nur als Situation; kein „Haar wiederbekommen“ in Verbindung mit Krankheit. `check:launch` blockiert bei Heil-, Haarwuchs- und Krankenkassen-Aussagen.
- **Lieferzeit Maßanfertigung:** einheitlich als Gesamtlieferzeit innerhalb Deutschlands, ab Vorliegen aller Angaben und (bei Vorkasse/PayPal) der Zahlung, ohne „etwa“ und ohne „in der Regel“ (Art. 246a § 1 Abs. 1 Nr. 7 EGBGB).
- **GPSR:** `check:launch` blockiert, solange kein Feld `manufacturer` je Produkt gepflegt ist.

## 5. Von Anwalt prüfen lassen (mit Begründung)

1. **Mehrere Waren, getrennte Lieferung:** Die Belehrung kombiniert Gestaltungshinweis 1 b und 1 c in einem Satz. Das ist verbreitete Praxis, weicht aber vom reinen Muster ab (Verlust der Gesetzlichkeitsfiktion möglich). Alternative: Lieferung immer in einer Sendung und nur 1 b verwenden.
2. **Widerruf bei Toppern/Perücken/Haarsystemen:** Ob § 312g Abs. 2 Nr. 3 BGB (Hygiene) bei versiegelt geliefertem Haarersatz greift, ist – soweit ersichtlich – nicht höchstrichterlich entschieden; der BGH legt die Ausnahme eng aus (Matratze, VIII ZR 194/16). Die Texte behaupten den Ausschluss daher **nicht pauschal** für Haarteile, sondern nur für versiegelte, gekennzeichnete Produkte. Anwaltlich klären, ob und wie Haarersatz versiegelt werden kann.
3. **Vertragsschluss-Mechanik:** Bestellung = Angebot; Annahme durch Auftragsbestätigung oder Versand innerhalb von 3 Werktagen (Annahmefrist nach § 308 Nr. 1 BGB). Die Gestaltung ist üblich; bei „Zahlung erst nach Annahme“ entsteht kein Widerspruch zum Button „Zahlungspflichtig bestellen“, weil die Kundin mit der Bestellung bereits ein bindendes, auf Zahlung gerichtetes Angebot abgibt.
4. **Kauf auf Rechnung (`bankTransfer`) mit Ablehnungsvorbehalt:** Die Klausel muss transparent sein; prüfen lassen, wenn diese Zahlungsart aktiviert wird.
5. **Freiwillig mitgeteilte Gesundheitsdaten:** Die Zusage „nicht verwenden und löschen; Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO, wenn ausnahmsweise nötig“ ist eine vorsichtige Lösung; die Rechtslage zur „aufgedrängten“ sensiblen Information ist nicht abschließend geklärt.
6. **Gmail und WhatsApp Business:** Ob der Einsatz ohne AVV überhaupt zulässig ist (Gmail kostenlos) bzw. wie WhatsApp Business datenschutzkonform genutzt wird (Kontaktabgleich!), ist umstritten. Empfehlung: E-Mail-Anbieter mit AVV, WhatsApp nur auf einem separaten Geschäftsgerät ohne Adressbuch-Freigabe.
7. **Weitergabe der E-Mail an DHL nur mit Einwilligung:** Teile der Literatur halten Art. 6 Abs. 1 lit. b oder f DSGVO für ausreichend; die Einwilligungslösung ist die vorsichtigere.
8. **Haftungsklausel (§ 11 AGB):** Entspricht der gängigen, von der Rechtsprechung akzeptierten Formulierung; trotzdem prüfen lassen.

## 6. Prüflisten Produkte

**GPSR (Verordnung (EU) 2023/988, Art. 19) – je Produkt im Angebot sichtbar:**
- [ ] Hersteller: Name/Marke, Postanschrift, E-Mail oder Website. Fertigt die Inhaberin selbst (z. B. Maßanfertigung), ist sie Herstellerin.
- [ ] Hersteller außerhalb der EU (z. B. Walker Tape, USA): Name und Anschrift der verantwortlichen Person in der EU. Kauft die Inhaberin direkt im Nicht-EU-Ausland ein, ist sie selbst Importeurin mit eigenen Pflichten.
- [ ] Produktidentifikation (Typ, Artikelnummer o. Ä.), Abbildung.
- [ ] Warn- und Sicherheitshinweise in deutscher Sprache (bei Klebern/Lösungsmitteln vom Etikett übernehmen).
- [ ] Gebrauchsanleitung/Pflegehinweise auf Deutsch beilegen.

**Gefahrstoffe – C-22 Lösungsmittel und Flüssigkleber (nur Prüfliste, keine Aussage auf der Website):**
- [ ] Aktuelles Sicherheitsdatenblatt (deutsch) beim Lieferanten anfordern; Einstufung nach CLP-Verordnung (EG) Nr. 1272/2008 prüfen (Entzündbarkeit, Hautreizung, Sensibilisierung durch Duftstoffe wie Limonen?).
- [ ] Ist das Produkt eingestuft, müssen **Gefahrenpiktogramme, Signalwort und H-Sätze** auch im Onlineangebot stehen (Art. 48 CLP-VO für Werbung/Fernabsatz) und das Etikett deutschsprachig sein.
- [ ] Versand: Entzündbare Flüssigkeiten sind Gefahrgut (ADR/IATA). DHL Paket national nimmt Gefahrgut nur eingeschränkt (z. B. als begrenzte Menge mit Vertrag) an; **Luftfracht/Ausland meist ausgeschlossen**. Bei DHL Geschäftskundenservice klären.
- [ ] Abgabebeschränkungen (Chemikalien-Verbotsverordnung) und Altersgrenzen prüfen – nach derzeitiger Kenntnis für diese Produktart nicht einschlägig, aber vom Sicherheitsdatenblatt abhängig.
- [ ] Kosmetikrecht (CPNP-Notifizierung) prüfen, siehe Abschnitt 2.

**Preisangaben (PAngV):** Gesamtpreis; Hinweis auf § 19 UStG; Versandkosten; Grundpreis bei Volumen-/Längenware (siehe Abschnitt 1 Nr. 14); keine Streichpreise ohne 30-Tage-Referenz.

## 7. Verkauf in andere Länder

*Empfehlung:* Zum Start nur **Deutschland** aktivieren, EU-Lieferungen auf Anfrage; Drittländer erst nach Steuer- und Zollberatung.

- **Zwingendes Verbraucherrecht:** Richtet sich der Shop auf ein Land aus (z. B. durch Sprachfassungen, Lieferung, Versandkosten), bleibt Verbrauchern dort der Schutz ihres Heimatrechts erhalten (Art. 6 Rom-I-VO). AGB § 14 berücksichtigt das. Die EU-Mindeststandards (14 Tage Widerruf, 2 Jahre Gewährleistung) sind gleich; einzelne Länder gehen weiter (z. B. längere Gewährleistungsfristen in den Niederlanden für langlebige Waren, Garantie-Hinweispflichten in Frankreich).
- **Sprache:** Rechtlich maßgeblich ist die deutsche Fassung (Vertragssprache Deutsch). Die Übersetzungen dienen dem Verständnis. Wer gezielt in anderen Ländern verkauft, sollte prüfen lassen, ob Pflichtinformationen dort in der Landessprache gegeben werden müssen (z. B. Frankreich: Loi Toubon).
- **Umsatzsteuer:** Als Kleinunternehmerin sind EU-Fernverkäufe in Deutschland steuerfrei, solange die EU-weite Schwelle von 10.000 € (§ 3c UStG) nicht überschritten wird. Darüber gilt die Umsatzsteuer des Bestimmungslandes (Registrierung im OSS-Verfahren); die deutsche Kleinunternehmerregelung hilft dann nicht. Die EU-Kleinunternehmerregelung (§ 19a UStG, Registrierung beim BZSt) ist eine eigene Option – mit Steuerberatung entscheiden.
- **Drittländer (z. B. Schweiz, UK, USA):** Einfuhrumsatzsteuer und Zoll trägt in der Regel die Empfängerin – vorher deutlich darauf hinweisen (in AGB und Versandseite enthalten). Zollinhaltserklärung erforderlich.
- **Sendungsverfolgung:** Für hochpreisige Einzelstücke immer versichert und mit Sendungsverfolgung versenden (DHL Paket International).
- **Tatsächliche DHL-Länder:** Vor Aktivierung eines Landes prüfen, ob DHL dorthin Pakete (und ggf. Gefahrgut) befördert; Lösungsmittel/Kleber nur nach Klärung.
- **Verpackung:** Bei regelmäßigem Versand in andere EU-Länder können dort eigene Verpackungspflichten (Registrierung/Bevollmächtigter) bestehen.

## 8. Hinweise für die Website (Integration)

- **Rechtsseiten:** `src/content/legal/<seite>.tsx` (Deutsch, maßgeblich) und `src/content/legal/<lang>/<seite>.tsx`. Props: `company: Company` aus `company-type.ts`.
- **Marker:** `<mark data-missing="…">` bei fehlenden Pflichtangaben. In Production den Build abbrechen oder die Seite sperren, wenn ein Marker gerendert wird.
- **Neue/optionale Felder** in `Company`: `payments`, `returnCosts`, `disputeResolution`, `siteUrl`, `withdrawalUrl`, `shippingRates`, `deliveryDays` (ersetzt `processingDays`), `madeToOrderDays`, `payments.paypalInstallments`, `effectiveDate`, `social`.
- **Bestellübersicht:** `summaryNotes` und die **Gewährleistungsgrafik** (offizielle deutsche Farb-PNG nach DVO (EU) 2025/1960 Anhang I, unverändert, gut lesbar, nicht nur als Link/Thumbnail) direkt **über** dem Button „Zahlungspflichtig bestellen“. Pflicht-Checkbox nur für AGB; Widerrufs- und Datenschutzhinweis als Text. Optionale Checkboxen (DHL-E-Mail, Newsletter) nicht vorangekreuzt.
- **Widerrufsfunktion:** Schaltfläche „Vertrag widerrufen“ im Footer **jeder** Seite (gut sichtbar, nicht versteckt), Formular mit Name, Bestellnummer/-angaben (auch einzelne Artikel), E-Mail; dann „Widerruf bestätigen“; sofort Mail `withdrawalReceived` mit Datum und Uhrzeit (Zeitzone Europe/Berlin). Kein Login verlangen. Die Belehrung verweist auf diese Schaltfläche bzw. `withdrawalUrl`.
- **E-Mails:** `orderReceived` sofort; `orderAccepted` mit Anhängen (AGB, Widerrufsbelehrung + Formular, Gewährleistungsgrafik) = Vertragsbestätigung auf dauerhaftem Datenträger (§ 312f Abs. 2 BGB); `orderDeclined` bei Nichtverfügbarkeit.
- **Live-Seite bereinigen:** „Verbindlich reservieren“ → „Zahlungspflichtig bestellen“; „Versand innerhalb Deutschlands inklusive“ (Produktseite/Warenkorb) widerspricht 6,00 € Versand; „2 bis 5 Werktage“ vereinheitlichen; „Originalverpackung“ nicht als Widerrufsbedingung; „MADE INGERMANY“; Hinweis „Versand mit DHL, weltweit“ ist laut Inhaberin zutreffend; für Drittländer keine Bestellung ohne vorher genannten Versandpreis (siehe 4a). „2 bis 5 Werktage“ auf der Live-Seite an die bestätigte Angabe „2–5 Werktage“ anpassen; „Fertigung in 15 bis 20 Tagen“ im Katalog auf „Werktagen“ ändern.
- **Gesundheitsdaten:** `healthDataNotice` unter jedem Freitextfeld (Anfrage, Bestellnotiz, Maßanfertigung).

## 9. Übersetzungen

- Vollständige Komfortübersetzungen aller fünf Rechtsseiten, des Widerrufsformulars und der Checkout-Texte liegen in `src/content/legal/<lang>/` (en, fr, es, pt, it, nl, pl, tr) mit identischer Schnittstelle. Jede Seite beginnt mit dem Hinweis, dass die deutsche Fassung rechtsverbindlich ist.
- Die Widerrufsbelehrungen und Formulare folgen dem Wortlaut des Anhangs I der Verbraucherrechte-Richtlinie 2011/83/EU in der jeweiligen Amtssprache, soweit bekannt; Fachbegriffe: EN „right of withdrawal“, FR „droit de rétractation“, ES „derecho de desistimiento“, PT „direito de livre resolução“, IT „diritto di recesso“, NL „herroepingsrecht“, PL „prawo odstąpienia od umowy“, TR „cayma hakkı“ (für Türkisch gibt es keine EU-Amtsfassung).
- **Von Anwalt/Übersetzer prüfen lassen:** Die Übersetzungen sind sorgfältig, aber nicht von muttersprachlichen Juristen geprüft. Vor gezielter Vermarktung in einem Land die jeweilige Fassung prüfen lassen – insbesondere Widerrufsbelehrung und Button-Beschriftungen.
- **Button-Beschriftungen in Fremdsprachen:** § 312j Abs. 3 BGB verlangt „zahlungspflichtig bestellen“ oder eine **entsprechend eindeutige** Formulierung. Für die Sprachfassungen wurden die Formulierungen der Richtlinie (Art. 8 Abs. 2 RL 2011/83/EU, z. B. „Order with obligation to pay“, „Commande avec obligation de paiement“) verwendet. Für die Widerrufsfunktion (§ 356a BGB) entsprechend „Withdraw from contract“/„Confirm withdrawal“ usw.
- Platzhalter `{agb}`, `{widerruf}`, `{datenschutz}` in den Checkout-Texten: Die Website setzt den Link mit dem Seitentitel der jeweiligen Sprache ein; die Sätze sind darauf ausgelegt.
