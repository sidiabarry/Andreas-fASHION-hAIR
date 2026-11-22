# Stand

Aktueller Stand, offene Punkte und Arbeitsweise: **`docs/UEBERGABE.md`** (21.11.2026).
Arbeitsnotizen der Agenten: `docs/arbeitsnotizen/`.

## Stand 21.11.2026 (Lichtatelier, produktionsreif im Code)

- Durchgehend hell, Schaufenster-Hero mit dem 15-s-Film, Seitenwechsel als Lichtöffnung vom Klickpunkt.
- Haar: alles feines Echthaar aus Vietnam (vom Auftraggeber bestätigt); „Premium-Echthaar“ entfernt.
- Zahlung: Überweisung per GiroCode (EPC-QR, ohne Drittanbieter) + Kopierfelder auf der Bestellbestätigung und in der Eingangsmail; IBAN der Inhaberin in `company.ts`. Zahlen sofort oder nach Andreas Bestätigung (AGB/Versand & Zahlung angepasst, de/en/fr/es).
- Kasse ohne Pflicht-Häkchen (AGB-Hinweis über dem Bestellknopf).
- Livebetrieb: Kasse öffnet sich automatisch, sobald in Vercel gesetzt sind: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Schema `supabase/migrations/0001_init.sql` einspielen), `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO_OWNER`, `IP_HASH_SECRET`, `SITE_URL`.
