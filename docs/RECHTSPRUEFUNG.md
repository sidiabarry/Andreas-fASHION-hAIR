# Rechtsprüfung vor dem Livegang (eine Seite für die Rechtsberatung)

Stand 22.11.2026. Shop: Andrea's Fashion Hair, Inhaberin Andreia Pereira Da Costa, Iserlohn, Kleinunternehmerin nach § 19 UStG. Rechtstexte in de/en/fr/es; maßgeblich ist Deutsch. Bitte diese vier Punkte prüfen und freigeben oder ändern.

## 1. Zahlungszeitpunkt (Vorkasse per Überweisung, PayPal)
- Wortlaut (`src/content/legal/versand-zahlung.tsx`): „Vorkasse per Überweisung – zahlbar sofort nach der Bestellung, spätestens 7 Tage nach der Auftragsbestätigung; Versand nach Zahlungseingang.“ Dazu: „Sie können sofort nach der Bestellung bezahlen oder nach unserer Auftragsbestätigung. Ist ein Stück nicht verfügbar, erstatten wir bereits gezahlte Beträge unverzüglich.“
- PayPal: Zahlungsaufforderung nach der Auftragsbestätigung.
- Auf der Bestellseite: QR-Code (GiroCode) mit IBAN, Betrag und Bestellnummer als Verwendungszweck.
- Frage: Passt das zum Vertragsschluss in den AGB (`src/content/legal/agb.tsx`, Erstattung bei Nichtverfügbarkeit)?

## 2. AGB-Einbeziehung ohne Häkchen
- Statt eines Pflicht-Häkchens steht direkt über dem Bestellknopf: „Mit Ihrer Bestellung gelten unsere AGB.“ (verlinkt; `checkout.agbNotice`). Der Knopf heißt „Zahlungspflichtig bestellen“.
- Frage: genügt das für § 305 Abs. 2 BGB und § 312j Abs. 3 BGB?

## 3. Packvideo (freiwilliges Angebot in der Kasse)
- Wortlaut: „Vor dem Versand ein kurzes Tageslichtvideo meines Stücks erhalten (kostenlos)“, Hinweis: „Andrea schickt es per WhatsApp an Ihre Telefonnummer, ca. 10 Sekunden.“
- Fragen: Ist ein Hinweis in der Datenschutzerklärung nötig (Telefonnummer an WhatsApp)? Ist es als Leistungsversprechen problematisch, falls es einmal ausbleibt?

## 4. Löschfristen
- Datenschutzerklärung (`src/content/legal/datenschutz.tsx`): Vertragsdaten bis Ablauf der Gewährleistung; Buchungsbelege 8 Jahre, Geschäftsbriefe 6 Jahre (§ 147 AO); Anfragen spätestens 12 Monate.
- Datenbank (`supabase/migrations/0001_init.sql`): Bestellungen sind für 10 Jahre nach Jahresende markiert, Anfragen für 12 Monate.
- Frage (gern mit der Steuerberatung): Welche Frist gilt für die Bestellzeilen? Danach wird die Spalte `orders.delete_after` angepasst.
