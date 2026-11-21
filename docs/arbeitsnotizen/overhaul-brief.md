# Overhaul-Brief (Orchestrator, 20.11.2026) – verbindlich für alle Agenten

## Ziel des Auftraggebers
Umsatz. Die beste Website im Markt: visuell auf höchstem Niveau, mit klarem rotem Faden und psychologisch fundierten, ehrlichen Verkaufshebeln.
**Rangfolge:**
1. Extensions (Hauptgeschäft)
2. Perücken und Topper
3. Maßanfertigung, immer sichtbar (Navigation, jede Produktseite, Footer)

Grundlage: `.coordination/findings/research-wettbewerb.md`. Lies dort die Abschnitte 3–6 (Muster, Informationsarchitektur, roter Faden, „nicht übernehmen“). Der stärkste deutsche Konkurrent ist Verlocke. Wir müssen ihn in Klarheit, Beratung und Bildsprache übertreffen.

## Harte Grenzen (aus CLAUDE.md, gelten weiter)
- Keine erfundenen Zahlen, Bewertungen, Garantien, Lieferzeiten oder Packungsempfehlungen.
- Kein Countdown, kein Streichpreis, kein „X Personen kauften“.
- Keine Drittanbieter im Browser.
- Fehlt eine Angabe von Andrea (z. B. „wie viele Packungen brauche ich“), bauen wir den Weg als Beratung („Andrea sagt Ihnen persönlich, wie viele Packungen Sie brauchen“, WhatsApp oder Anfrage) und erfinden keine Zahl.

## Erlaubte Verkaufshebel (ehrlich)
- **Klarheit statt Überforderung:** Spezifikation im Untertitel und an den Auswahl-Chips (Länge, Gramm, Teile).
- **Risikoumkehr:** Bezahlt wird erst nach Andreas persönlicher Bestätigung; dazu Rückgabe und Versand klar am Kaufknopf.
- **Echte Knappheit nur bei Einzelstücken** (Topper, Perücken); bei Extensions nie.
- **Autorität und Nähe:** Andrea mit eigener Geschichte, das Atelier in Iserlohn, eine echte Ansprechpartnerin.
- **Vorstellungskraft:** Das Ergebnis wird beschrieben („mehr Länge, mehr Fülle, mehr Sie selbst“), ohne Heilversprechen.
- **Ein Hauptknopf je Bildschirm.**
- **Sorgen vor dem Preis beantworten:** Farbe, Sichtbarkeit, Halt, Pflege.

## Farbnamen (entschieden nach Messung und Conversion, in catalog.json übernehmen)
| ID | neu |
|---|---|
| 422 | Dunkelblond mit hellen Reflexen |
| 423, 424, 428 | Naturdunkelbraun (unverändert) |
| 425 | Goldblond Ombré |
| 426 | Kaffeebraun mit Kupfer-Ombré, naturlockig |
| 427 | Hellblond Ombré mit dunklem Ansatz |

## Produktbilder 422–428 (fertig, in `public/assets/products/`)
- `<id>.jpg` ist das Hauptbild (Studio-Inszenierung), `<id>-2.jpg` das Zweitbild. In `catalog.json`: `image` = `/assets/products/<id>.jpg`, `restyled: true`. Das Zweitbild kommt in die Galerie, dahinter die Originalfotos.
- **Wichtig, rechtlich:** Bei diesen 7 Produkten ist das Studiobild eine KI-gestützte Inszenierung. Die Haarfarbe ist am Originalfoto gemessen und angeglichen (ΔE < 2), Form und Arrangement sind inszeniert. Die bestehende Bildunterschrift „am Haar wurde nichts verändert“ ist für diese Produkte **falsch** und muss je Produkt umschaltbar sein, z. B. über ein Katalogfeld `imageKind: "relit" | "staged"`. Text für staged: „Inszenierte Studioaufnahme. Die Haarfarbe ist am Originalfoto gemessen und abgeglichen. Das Originalfoto zeigt das Stück unbearbeitet.“ legal-compliance prüft den Text danach.

## Arbeitsteilung (parallel, keine Dateiüberschneidung)
**shop-conversion:**
- Informationsarchitektur in Header, Navigation und Footer (`src/components/site/**`)
- Kollektion: Extensions zuerst; Filter nach Methode, Farbgruppe, Länge
- Produktseite: Spezifikations-Chips, Galerie mit Zweitbild und Bildart-Hinweis, Streifen „Maßanfertigung“ auf jeder Produktseite, Beratungsknopf, Zubehör als Cross-Sell nur mit vorhandenen Katalogprodukten
- Neue Seite `/[locale]/extensions`: Methodenvergleich (nur Fakten aus Katalog und `docs/ANDREA-GESCHICHTE.md`), Farbhilfe (Tageslicht-Hinweis, Foto an Andrea per WhatsApp oder Anfrage), Packungsfrage als Beratung, Produktraster
- Neue Seite `/[locale]/massanfertigung`: Anfrage in Schritten (System, Länge, Farbe, Struktur, Menge, Foto-Hinweis), über das bestehende `InquiryForm` mit neuem Thema
- Farbnamen und Produkttexte 422–428 in `catalog.json`: verkaufsstark und rechtssicher (siehe `.coordination/findings/legal-compliance-neue-produkte.md`)
- Nachrichten-Namespaces: alles außer `home.*`, `hero.*`, `about.*`

**home-design:**
- Startseite und „Über Andrea“ komplett neu: roter Faden laut Research §5, verbunden mit dem Phönix-Konzept („wie neu geboren“), Extensions als erstes Kapitel
- Die vorhandenen, nicht eingebundenen Szenen (Hero mit Film, Partikelfeld, Szenen) nutzen, wo sie dienen, sonst ersetzen
- Die neuen Produktbilder sind die visuellen Stars
- Nachrichten-Namespaces: nur `home.*`, `hero.*`, `about.*`
- Links auf `/extensions` und `/massanfertigung` setzen; shop-conversion legt diese Routen parallel an

**Danach:** i18n (alle neuen Schlüssel en/fr/es, Katalog-Wörterbuch) → legal-compliance (Prüfung der Texte und Bildhinweise) → qa.
