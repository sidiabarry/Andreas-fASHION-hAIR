# Verkaufsrunde (shop-conversion)

## Entfernt
- Produktseite: Widerruf/Wertersatz-Hinweis bei Extensions (`product.extWithdrawal`), Packungs-Hinweis (`packQuestion`), „Verfügbarkeit bestätigen wir …“ (`availabilityUnknown`), Erklärabsatz unter dem Vergleichsslider (`compareNote*`).
- Produktseite: Trust-Block ohne Welt-Versand, Telefon, Atelier-Termin (nur noch Widerruf, Versand, Lieferzeit, Zahlung nach Bestätigung).
- Produktseite: separater „Frage stellen“-Link, wenn WhatsApp vorhanden ist; Eigenschaftenliste bei Extensions (steht schon in den Chips); Pflege-FAQ.
- Allgemeine FAQ-Einträge, wenn das Stück eigene FAQ hat (Widerruf und Zahlung bleiben immer).
- Produkte 422–428: Absicherungen („hängt davon ab“, „bespricht vor der Zahlung“, „laut Herstellern“, Bildschirm-Hinweis, Wertersatz in 427), technische Zusatzpunkte (25 g, Kante des Tapes), Fachleute-Hinweis bei Clip-in.
- Extensions-Seite: Bildschirm-Abweichungs-Hinweis, doppelte „Sechs Methoden“-Aussage. Startseite: Bildschirm-Hinweis im Farbfächer, „Prüfen Sie bevor …“-Hinweis in der Widerrufs-FAQ.

## Gekürzt
- Bildhinweise (KI-Inszenierung) auf einen Satz, Startseite ebenso.
- Produkttexte 422–428: je 3 Vorteile, 2 Pflegepunkte, 2–3 FAQ (alle vier Sprachen).
- Objections-Antworten (Farbe, Befestigung, Passform, Widerruf, Packungen), Sammlung-Lead und -Hinweis, Extensions-Lead, Maßanfertigungs-Streifen.

## Neu
- „Handgefertigt von Andrea in Iserlohn“ (`product.handmade`) unter dem Untertitel jedes Atelier-Produkts (nicht Walker Tape); Hero-Lead, Hero-Vertrauenszeile, Ribbon, Sammlung und Extensions-Hero nennen es ebenfalls.

## Unverändert, bewusst
- Preis, Grundpreis, § 19 UStG, Versandkosten-Link, Lieferzeiten, Herstellerzeile, Kasse und Bestellbutton, Rechtslinks, KI-Kennzeichen an Bildern.
- Warenkorb-Hinweis „nur auf diesem Gerät gespeichert“ (cart.storageNote) bleibt, falls Datenschutz sich darauf stützt – Legal bitte prüfen.
- Hinweis zur Prüfung vor Einarbeiten/Schutzfolie steht jetzt nur noch in der Widerrufsbelehrung. Frage an Legal: reicht das für den Wertersatz?
- `src/components/home/i18n/*.mjs` ist ein altes Generatorskript, wird nicht zur Laufzeit genutzt; nicht angepasst.
- Nicht überarbeitet: Über-Andrea-, Anfrage-, Kasse-Texte (rechtlich), Pflege-Produkte.
