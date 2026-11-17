# Architektur

## Überblick

- **Next.js 16 App Router**, alle Seiten unter `src/app/[locale]/` (dynamisch gerendert, weil jede Antwort eine eigene CSP-Nonce bekommt).
- **Server Components** überall, Client Components nur für Warenkorb, Kasse, Formulare, Menü, Sprachumschalter, Galerie, Sortierung.
- **Mehrsprachigkeit** mit `next-intl`: Präfix immer (`/de`, `/en` …), deutsche Pfadnamen in allen Sprachen. `src/proxy.ts` leitet Pfade ohne Präfix um: Cookie `NEXT_LOCALE` (nur nach ausdrücklicher Wahl im Umschalter) → `Accept-Language` → Land (`x-vercel-ip-country`) → Englisch. Bei der Erkennung wird **kein** Cookie gesetzt.
- **Keine Drittanbieter-Anfragen im Browser**: Schriften selbst gehostet (next/font lädt sie beim Build), keine Analyse, keine Einbettungen, Social-Links sind reine Links. Deshalb **kein Cookie-Banner**: Es gibt nur das Sprach-Cookie nach ausdrücklicher Wahl und den Warenkorb im `localStorage` – beides technisch notwendig für einen ausdrücklich gewünschten Dienst (§ 25 Abs. 2 Nr. 2 TDDDG).

## Schnittstellen für die Startseite (Design-Agent)

Die Startseite gehört dem Design-Agenten: `src/app/[locale]/page.tsx`, `src/components/home/**`, `src/components/fx/**`, `src/styles/home.css`, Nachrichten unter `home.*` (und `hero.*`) in `src/messages/*.json`.

| Baustein | Import | Hinweis |
| --- | --- | --- |
| Warenkorb (Client) | `useCart()` aus `@/components/cart/CartProvider` | `add(slug)`, `has(slug)`, `count`, `items`, `lookup(slug)`; `add` zeigt automatisch den Hinweis „liegt im Warenkorb“ |
| In-den-Warenkorb-Knopf (Client) | `AddToCart` aus `@/components/product/AddToCart` | Props `slug`, `unique`, `price` (formatiert) |
| Katalog (Server) | `getProducts({ category, limit, includeSold, exclude })`, `getProduct(slug)`, `getProductById(id)`, `featured`, `CATEGORY_IDS` aus `@/data/catalog` | |
| Produkttexte je Sprache | `productText(product, locale)` | Name, Untertitel, Beschreibung, Eigenschaften |
| Verkauft-Status (Server) | `soldSlugs()` aus `@/server/sold` | Set der serverseitig verkauften Einzelstücke |
| Produktkarte (Server) | `ProductCard` aus `@/components/product/ProductCard` | Props `product`, `locale`, `sold?`, `priority?` |
| Preis | `formatPrice(cents, locale)` aus `@/lib/money` | immer EUR |
| Preis-Pflichtangaben | `PriceNote` aus `@/components/product/PriceNote` | § 19 UStG + Versandkosten-Link |
| Firmendaten | `company` aus `@/config/company` | Adresse, Telefon, E-Mail, Social, Träger (DHL), `madeInGermany` |
| Versand | `SHIPPING_ZONES`, `shippingCents`, `HANDLING_DAYS` aus `@/config/shipping` | |
| Links | `Link`, `useRouter`, `usePathname` aus `@/i18n/navigation` | sprachbewusst, `href="/kollektion"` ohne Präfix |
| Texte | `useTranslations` (Client) / `getTranslations` (Server) aus `next-intl` | |
| Logo | `Logo` aus `@/components/Logo` | Varianten `mark`, `lockup`, `wordmark` |
| JSON-LD | `JsonLd` + `organizationJsonLd(locale)` | |

## Daten und Betrieb

- **Katalog**: `src/data/catalog.json` (Quelle, Deutsch). Übersetzte Produkttexte werden aus `scripts/catalog-i18n/<lang>.json` erzeugt (`npm run i18n:catalog`, Rundlauf-Kontrolle gegen Deutsch).
- **Store**: `src/server/store.ts` (Schnittstelle). Derzeit nur `store-memory.ts` (Demo). Production hat keine Datenbank → Kasse geschlossen, Bestellen per Anfrage.
- **Doppelverkauf-Schutz**: Demo-Store prüft und reserviert alle Einzelstücke in einem synchronen Abschnitt (kein `await` dazwischen); getestet mit 25 gleichzeitigen Bestellungen. Für Postgres liegt die atomare Funktion `place_order` mit Primärschlüssel je Stück in `supabase/migrations/0001_init.sql`.
- **Preise**: werden serverseitig ausschließlich aus dem Katalog berechnet (`src/lib/order.ts`), Clientwerte werden ignoriert.
- **Formulare**: Server Actions (`src/server/actions.ts`), zod-Validierung, Längenbegrenzung, Honeypot, Mindestzeit (2 s), Rate-Limit je IP-Hash (5 pro 10 Minuten, im Speicher je Server-Instanz), Idempotenzschlüssel in der Kasse.
- **Bestätigungsseite**: `/bestellung/AF-XXXXXX?code=<256-Bit-Token>`; gespeichert wird nur der SHA-256-Hash des Codes, Vergleich zeitkonstant; Seite `noindex`, `Referrer-Policy: no-referrer`.
- **E-Mail**: Resend über HTTPS (`src/server/mail.ts`). Ohne Schlüssel wird nichts versendet und der Status „nicht_konfiguriert“ geführt; in Production sind Formulare ohne Mail-Dienst abgeschaltet und zeigen Telefon/E-Mail.
- **Logs**: keine personenbezogenen Daten (nur HTTP-Status bei Mail-Fehlern).

## Sicherheit

- CSP je Anfrage mit Nonce (`script-src 'self' 'nonce-…' 'strict-dynamic'`, kein `unsafe-inline` für Skripte; Stile brauchen `unsafe-inline` wegen Inline-Stilattributen), `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`.
- HSTS (2 Jahre, preload), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (Kamera, Mikrofon, Ort, Zahlung u. a. aus), `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`.
- Server Actions prüfen die Herkunft (Next.js), alle Eingaben werden validiert.

## Funnel-Messung

Noch nicht eingebaut. Vorgesehen: serverseitiger, cookieloser Zähler nur aggregierter Ereignisse (Produktansicht, In den Warenkorb, Kasse begonnen, Bestellung abgeschickt, Anfrage) ohne IDs und ohne IP; im Demo-Modus aus. Muss vor Aktivierung in der Datenschutzerklärung genannt werden. Vercel Web Analytics ist bewusst nicht eingebaut.
