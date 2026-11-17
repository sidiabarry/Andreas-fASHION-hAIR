# Andrea's Fashion Hair

Quellcode der Website, live unter https://andreas-atelier.higgsfield.app

Gebaut mit TanStack Start (React 19), server-gerendert, als ein Cloudflare Worker. Die Seite besteht aus einem scroll-gesteuerten Hero-Film, einer vollständigen Produktkollektion, Warenkorb, Bestellabwicklung und Anfrageformularen.

## Struktur

```
src/
  routes/            Seiten (Datei-basiertes Routing)
    index.tsx        Startseite mit dem Scroll-Film und allen Abschnitten
    kollektion.tsx   Kollektion mit Kategoriefilter
    produkt.$slug.tsx Produktseite
    warenkorb.tsx    Warenkorb und Kasse
    bestellung.$id.tsx Bestellbestätigung
    anfrage.tsx      Beratung, Extensions, Maßanfertigung, Salons
    __root.tsx       Grundgerüst, Kopf-Daten, Navigation, Warenkorb-Kontext
  components/
    scroll-scrub/    Laufzeit des Scroll-Films (nicht ändern)
    site/            Navigation, Footer, Warenkorb, Produktkarte
  data/
    catalog.json     Alle 50 Produkte mit Preisen und Angaben
    catalog.ts       Zugriff und Preisformatierung
  lib/
    shop.functions.ts Server-Funktionen für Bestellung, Anfrage, Newsletter
    bindings.server.ts Zugriff auf die Cloudflare-Bindungen
  scroll-scrub-scenes.ts Kapitel und Markenfarben des Films
  site.css           Farben, Typografie und Komponenten
  app-meta.json      Titel, Beschreibung, Vorschaubild, Favicon
public/assets/
  world/             Der Hero-Film (drei Kapitel, je Desktop und Mobil)
  products/          Die 44 neu ausgeleuchteten Produktfotos
  originals/         Andreas unbearbeitete Fotos, auf jeder Produktseite
  content/           Handwerk, Phönix, Extensions, Spiegel
  brand/             Phönix-Logo und Favicon
migrations/0001_init.sql Tabellen für Bestellungen, Anfragen, Newsletter
docs/design-brief.md  Konzept, Farben, Typografie, Aufbau
```

## Lokal starten

```bash
bun install
bun run dev
```

Zum Prüfen: `bun run typecheck` und `bun run check:ui`.

## Was zum Betrieb nötig ist

- **Datenbank:** `app.manifest.json` aktiviert D1. Die Tabellen entstehen aus `migrations/0001_init.sql`.
- **Bestellungen und Anfragen** werden gespeichert, aber niemand wird benachrichtigt. Für E-Mails an Andrea und an die Kundin fehlt ein Mail-Dienst und ein Schlüssel dafür.
- **Zahlung:** PayPal ist als Wunsch wählbar, es wird nichts abgebucht. Für echte Zahlungen fehlt ein Anbieter-Schlüssel.
- **Rechtstexte:** Impressum, Datenschutz, AGB und Widerrufsbelehrung fehlen, weil die Firmendaten nicht vorlagen.

## Hinweis zum Repository

Dieses Repository enthält den Quellcode der Website. Die internen Bau-Pakete der Hosting-Plattform (Verzeichnis `packages/`) sind bewusst nicht enthalten, deshalb lässt sich `bun install` hier nicht vollständig ausführen. Als Referenz und Sicherung des Codes ist es vollständig; zum Deployen wird die Plattform benötigt, die die Website erzeugt hat.
