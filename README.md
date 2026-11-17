# Andrea's Fashion Hair

Website der HaarManufaktur Andrea's Fashion Hair (Iserlohn): Echthaar-Topper, Perücken, Pony, Haarsysteme und Pflege. Next.js 16 (App Router, TypeScript), mehrsprachig (`/de`, `/en`, weitere folgen), gebaut für Vercel.

## Schnellstart

```bash
npm install
npm run dev              # http://localhost:3000 – Demo-Modus mit kompletter Kasse
```

Prüfen:

```bash
npm run lint             # ESLint (Next-Regeln, React-Hooks)
npm run typecheck        # tsc --noEmit
npm test                 # Unit-Tests (Node-Testrunner): Versand, Warenkorb, Bestellung, Doppelverkauf, Weiterleitungen, Übersetzungen
npm run build            # Production-Build (enthält check:launch im Warnmodus)
AFH_DEMO=1 npm run start -- -p 3500
NODE_PATH=<pfad-zu-playwright>/node_modules npm run test:e2e        # Playwright gegen http://localhost:3500
npm run check:launch     # listet fehlende Pflichtangaben, Exit-Code 1 solange etwas Blockierendes fehlt
```

## Betriebsarten

| Umgebung | Kasse | Formulare (Anfrage, Widerruf) | Hinweis |
| --- | --- | --- | --- |
| Entwicklung (`npm run dev`), Vercel-Vorschau, `AFH_DEMO=1` | Demo: kompletter Ablauf Warenkorb → Kasse → Bestätigung, Daten nur im Speicher | Demo: im Speicher, Mail nur falls Resend konfiguriert | sichtbarer „Demo“-Hinweis |
| Production (`VERCEL_ENV=production` bzw. `next start` ohne `AFH_DEMO`) | **geschlossen**: „Bestellen derzeit per Anfrage“ mit Telefon, E-Mail, WhatsApp, Anfrageformular | per E-Mail (Resend). Ohne Mail-Schlüssel wird statt des Formulars direkt Telefon/E-Mail angezeigt – nie stiller Datenverlust | kein Demo-Hinweis |

Eine Datenbank ist bewusst noch nicht angeschlossen (Entscheidung nach Abnahme der Seite). Die Schnittstelle `src/server/store.ts` und die Migration `supabase/migrations/0001_init.sql` sind vorbereitet.

## Umgebungsvariablen (nur Namen; Werte in Vercel eintragen)

Siehe `.env.example`:

- `SITE_URL` – öffentliche Adresse (canonical, Sitemap, Links in E-Mails)
- `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO_OWNER` – E-Mail-Versand über Resend
- `IP_HASH_SECRET` – Schlüssel zum Hashen von IP-Adressen für das Rate-Limit
- `AFH_DEMO` – nur lokal, Demo-Modus für `next start`

## Deploy auf Vercel

1. Projekt aus dem GitHub-Repository importieren (Framework: Next.js, Node ≥ 22.18).
2. Umgebungsvariablen setzen (Production und Preview getrennt).
3. **Production-Sperre:** `npm run build` ruft `scripts/check-launch.ts --ci` auf. In Vorschau und lokal warnt das nur; bei `VERCEL_ENV=production` bricht der Build ab, solange Pflichtangaben fehlen (Firmendaten in `src/config/company.ts`, Rechtstexte, Sicherheitsangaben für das C-22-Lösungsmittel, Mail-Schlüssel). So kann keine Seite mit fehlenden oder erfundenen Pflichtangaben live gehen.
4. Domain `andreasfashionhair.de` erst nach Abnahme umziehen; die alten URLs (`/products`, `/product/…`, `/about` …) werden per 308 auf `/de/…` weitergeleitet (`src/lib/legacy-redirects.ts`).

## Resend einrichten

1. Konto bei resend.com, Domain `andreasfashionhair.de` verifizieren (SPF/DKIM-Einträge beim DNS-Anbieter).
2. API-Schlüssel mit Sendeberechtigung erzeugen → `RESEND_API_KEY`.
3. `MAIL_FROM` z. B. `Andrea's Fashion Hair <bestellung@andreasfashionhair.de>`, `MAIL_TO_OWNER` = Postfach der Inhaberin.
4. Auftragsverarbeitungsvertrag mit Resend abschließen (die Datenschutzerklärung nennt den Dienst).

## Supabase (später)

Vorbereitet, nicht verdrahtet: `supabase/migrations/0001_init.sql` (RLS an, keine öffentlichen Policies, atomare Funktion `place_order` mit Primärschlüssel je Einzelstück gegen Doppelverkauf). Anschluss: Klasse gegen `src/server/store.ts` implementieren, nur serverseitig mit Service-Role-Key.

## Struktur

```
src/
  app/[locale]/        Seiten (deutsche Pfade in allen Sprachen)
  components/          Kopf, Fuß, Warenkorb, Kasse, Formulare, Logo (einzige Stelle des Markenzeichens)
  config/              company.ts (Firmendaten), shipping.ts (Versand), legal-company.ts (Übergabe an Rechtstexte)
  content/legal/       Rechtstexte (Rechtsagent; Deutsch maßgeblich, Übersetzungen in Unterordnern)
  data/                catalog.json (50 Produkte, Quelle), Live-Daten für Weiterleitungen
  i18n/                Sprachen, Erkennung, Routing
  lib/                 reine Logik (Warenkorb, Preise, Validierung, SEO)
  messages/            Oberflächentexte je Sprache; catalog/<lang>.json Produkttexte (generiert)
  server/              Server Actions, Demo-Store, Mail, Sicherheit
  proxy.ts             Spracherkennung und CSP-Nonce
scripts/               check-launch, Katalog-Übersetzung, Marken-Grafiken
supabase/migrations/   vorbereitetes Datenbankschema
tests/unit, tests/e2e  Tests
docs/                  design-brief, ARCHITEKTUR, CHECKLISTE-LAUNCH, COMPLIANCE (Rechtsagent)
```

Produkttexte anderer Sprachen werden aus Wörterbüchern erzeugt: `npm run i18n:catalog` (bricht ab, wenn die deutsche Rückübersetzung nicht zeichengleich mit dem Original ist).
