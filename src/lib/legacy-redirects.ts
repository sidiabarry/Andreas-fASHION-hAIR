/**
 * Weiterleitungen der alten Live-URLs (WooCommerce/Nuxt auf andreasfashionhair.de) auf die neue Seite.
 *
 * Zuordnung der Produkte über die WooCommerce-ID (databaseId), die im Export als `id` erhalten ist.
 * Name und Preis jedes Paares werden in tests/unit/redirects.test.ts zusätzlich gegengeprüft.
 * Quelle der alten Adressen: src/data/live-products-2026-11.json (aus /products der Live-Seite, 11/2026).
 *
 * Keine Pfad-Aliase: wird auch von next.config.ts geladen.
 */
import catalog from "../data/catalog.json";
import live from "../data/live-products-2026-11.json";

export type LegacyProduct = { id: number; slug: string; name: string; price: string; cats: string[] };
export type Redirect = { source: string; destination: string; permanent: true };

export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  toppers: "topper",
  "curtain-bangs": "pony",
  mannerhaarsysteme: "maenner",
  prosthetics: "maenner",
  wartungsprodukte: "pflege",
};

const L = "/de";

/** Alter Produkt-Slug → neuer Slug */
export function legacyProductMap(): Map<string, string> {
  const map = new Map<string, string>();
  const bySlug = new Map((catalog as { id: number; slug: string }[]).map((p) => [p.id, p.slug]));
  for (const old of live as LegacyProduct[]) {
    const target = bySlug.get(old.id);
    if (!target) throw new Error(`No catalog product for legacy id ${old.id}`);
    map.set(decodeURIComponent(old.slug), target);
  }
  return map;
}

/** Varianten eines Pfadsegments, wie Browser und Crawler es anfragen können. */
function segmentVariants(segment: string): string[] {
  const encoded = encodeURIComponent(segment);
  return Array.from(new Set([segment, encoded, encoded.toLowerCase().replace(/%[0-9a-f]{2}/gi, (m) => m.toLowerCase())]));
}

export function legacyRedirects(): Redirect[] {
  const out: Redirect[] = [];
  const add = (source: string, destination: string) => out.push({ destination, permanent: true, source });

  for (const [oldSlug, newSlug] of legacyProductMap()) {
    for (const variant of segmentVariants(oldSlug)) {
      // path-to-regexp: Sonderzeichen maskieren
      const safe = variant.replace(/[()[\]{}?*+:!]/g, (c) => `\\${c}`);
      add(`/product/${safe}`, `${L}/produkt/${newSlug}`);
    }
  }
  for (const [oldCat, newCat] of Object.entries(LEGACY_CATEGORY_MAP)) {
    add(`/product-category/${oldCat}`, `${L}/kollektion?kategorie=${newCat}`);
    add(`/product-category/${oldCat}/:rest*`, `${L}/kollektion?kategorie=${newCat}`);
  }
  add("/product-category/:rest*", `${L}/kollektion`);
  add("/product/:rest*", `${L}/kollektion`);
  add("/products", `${L}/kollektion`);
  add("/products/:rest*", `${L}/kollektion`);
  add("/categories", `${L}/kollektion`);
  add("/my-account", `${L}/kollektion`);
  add("/my-account/:rest*", `${L}/kollektion`);
  add("/wishlist", `${L}/kollektion`);
  add("/cart", `${L}/warenkorb`);
  add("/checkout", `${L}/warenkorb`);
  add("/about", `${L}/ueber-andrea`);
  add("/contact", `${L}/kontakt`);
  add("/shipping-returns", `${L}/versand-und-zahlung`);
  add("/privacy", `${L}/datenschutz`);
  add("/terms", `${L}/agb`);
  return out;
}
