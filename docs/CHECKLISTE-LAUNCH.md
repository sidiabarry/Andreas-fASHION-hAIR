# Checkliste vor dem Livegang

`npm run check:launch` zeigt den aktuellen Stand automatisch. Ein Production-Deploy auf Vercel bricht ab, solange blockierende Punkte offen sind.

## Von Andreia / dem Betreiber zu liefern oder zu entscheiden

- [ ] **Handelsregister**: Gibt es einen Eintrag? Wenn nein, `register: false` in `src/config/company.ts`.
- [ ] **Rechtsform** „Einzelunternehmen“ (vom Auftraggeber angegeben) im Impressum so bestätigen
- [ ] **USt-IdNr./Wirtschafts-IdNr.** vorhanden? (bei Kleinunternehmerin nicht zwingend)
- [ ] **Rücksendekosten** bei Widerruf: Kundin oder Händlerin? (`returnCosts`)
- [ ] **Verbraucherschlichtung**: bereit oder nicht bereit? (`disputeResolution`)
- [ ] **Stand-Datum** der Rechtstexte beim Livegang (`legalEffectiveDate`)
- [ ] **Zahlungswege** festlegen (PayPal, Überweisung/Vorkasse, Rechnung) und Daten liefern (Bankverbindung, PayPal-Konto). Bis dahin bleibt die Online-Kasse in Production geschlossen.
- [ ] **Sicherheitsangaben (GPSR/CLP)** für die Pflegeprodukte, vor allem **C-22 Lösungsmittel** (Gefahrenhinweise vom Etikett, Hersteller mit Anschrift), außerdem Füllmengen für Grundpreise (Flüssigkleber, Lösungsmittel, Klebeband).
- [ ] **Gewährleistungsgrafik** (amtliche Farb-PNG nach DVO (EU) 2025/1960) für die Bestellübersicht; bis dahin steht dort der Hinweis als Text.
- [ ] **Versandkosten „ab 6 €“ / „ab 15 €“**: Die Live-Seite schreibt „ab“. Die Seite rechnet mit festen 6,00 € (DE, frei ab 150 €) und 15,00 € (EU). Bitte bestätigen oder Staffel nennen (`src/config/shipping.ts`).
- [ ] **Anrede „Andrea“**: Die Inhaberin heißt Andreia. Soll die Seite weiter „Andrea“ (Rufname/Markenname) verwenden, z. B. „Andrea bestätigt persönlich“, „Treffen Sie Andrea im Atelier“?
- [ ] **E-Mail-Adresse** öffentlich: andreasfashionhair5@gmail.com (gesetzt). Für den Versand eine Absenderadresse an der eigenen Domain (Resend).

## Von Andreia zu bestätigen (Aussagen auf der Seite, die aus dem Export stammen)

Diese Aussagen standen im Export bzw. auf der Live-Seite. Sie werden nur verwendet, weil sie von dort stammen; bitte bestätigen oder streichen lassen:

- „Mit neunzehn begann Andrea in Rio de Janeiro, mit Haaren zu arbeiten“ (Startseite, Phönix-Abschnitt)
- Zitat „Wenn das Haar wieder da ist, ist der Mensch ein anderer. Er ist wie neu geboren.“
- „Nano-Skin-Basis, jedes Haar einzeln von Hand injiziert“, „freier Scheitel“, „Befestigung mit Clips“ (Produktangaben)
- „Selbst aus der Nähe ist kein Rand und kein Knoten zu erkennen“ (FAQ)
- „diskret verpackt“ (Versandhinweis) – steht nicht auf der Live-Seite
- Maßanfertigung „15 bis 20 Tage“ (Katalog Produkt 238)
- Extensions in sechs Methoden (Butterfly Weft, Genius Weft, Invisible Tape, Tape-In, Keratin Bondings, Clip-In)
- „Made in Germany“ – vom Auftraggeber als belegbar bestätigt (11/2026)
- Versanddienstleister DHL – vom Auftraggeber bestätigt (11/2026)

## Technik und Konten

- [ ] Resend-Konto, Domain verifizieren, `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO_OWNER` in Vercel setzen
- [ ] `SITE_URL` und `IP_HASH_SECRET` setzen
- [ ] Auftragsverarbeitungsverträge: Vercel (Hosting), Resend (E-Mail); Angaben in `src/config/legal-company.ts` mit den Verträgen abgleichen
- [ ] Datenbank (Supabase) erst nach Abnahme: Migration `supabase/migrations/0001_init.sql`, Store-Klasse gegen `src/server/store.ts`

## Domain-Umzug

1. Neue Seite auf Vercel unter Vorschau-Adresse abnehmen.
2. Domain `andreasfashionhair.de` (und `www`) in Vercel hinzufügen, DNS umstellen.
3. Die alten Adressen werden automatisch mit 308 weitergeleitet (alle 50 Produkt-URLs, Kategorien, `/about`, `/contact`, `/shipping-returns`, `/privacy`, `/terms`, `/products`, `/categories`, `/my-account`, `/wishlist`). Geprüft in `tests/e2e/run.mjs`.
4. In der Google Search Console die neue Sitemap `/sitemap.xml` einreichen.
