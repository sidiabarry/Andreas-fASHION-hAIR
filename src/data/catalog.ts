import raw from "./catalog.json";
import catalogEn from "../messages/catalog/en.json";
import catalogEs from "../messages/catalog/es.json";
import catalogFr from "../messages/catalog/fr.json";
import type { Locale } from "../i18n/locales";

/** Reihenfolge = Reihenfolge in Menü und Filtern. Extensions zuerst (Wunsch der Inhaberin). */
export const CATEGORY_IDS = ["extensions", "topper", "peruecken", "pony", "maenner", "pflege"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Product = {
  id: number;
  slug: string;
  /** Deutscher Produktname (Quelle: Export, übersetzt von der Live-Seite) */
  name: string;
  subtitle: string;
  category: CategoryId;
  /** Preis in Cent (Endpreis) */
  priceCents: number;
  /** Im Katalog als verkauft geführt (zusätzlich zum serverseitigen Verkauft-Status) */
  sold: boolean;
  length: string;
  base: string;
  color: string;
  texture: string;
  description: string;
  specs: string[];
  image: string;
  restyled: boolean;
  originals: string[];
  madeToOrder: boolean;
  /** Bestand laut Abgleich mit der Inhaberin. "unknown" = noch nicht abgeglichen (Anzeige: Verfügbarkeit wird persönlich bestätigt). */
  availability: "in_stock" | "made_to_order" | "unknown";
  /** Herkunft des Haars (vom Auftraggeber bestätigt 11/2026: brasilianisches Echthaar). null bei Pflegeprodukten. */
  origin: "Brasilien" | null;
  /** Sicherheits-/Gefahrstoffhinweise (GPSR, CLP). null = noch nicht geliefert. */
  safety: string | null;
  /**
   * Nettofüllmenge in Gramm für Ware, die nach Gewicht angeboten wird (Extensions-Packungen).
   * Gesetzt = Grundpreis „€ / 100 g“ wird neben dem Preis gezeigt. null/fehlt = kein Grundpreis (Schalter).
   */
  netWeightGrams?: number | null;
  /** Verkaufseinheit, auf die sich der Preis bezieht (Extensions): "pack" = je Packung, "set" = Set. Anzeige direkt am Preis. */
  priceUnit?: "pack" | "set" | null;
  /** Gewicht je Verkaufseinheit in Gramm (nur für die Anzeige „je Packung (50 g)“). */
  weightGrams?: number | null;
  /** Anzahl Teile eines Sets (nur priceUnit "set"). */
  setParts?: number | null;
};

export type ProductText = Pick<Product, "name" | "subtitle" | "description" | "specs">;

export const products: Product[] = raw as Product[];

/** Kategorien ohne Online-Produkte: nur Anfrage. Folgt den Daten: sobald eine Kategorie Produkte hat, ist sie kaufbar. */
export const INQUIRY_ONLY_CATEGORIES: readonly CategoryId[] = CATEGORY_IDS.filter((id) => !products.some((product) => product.category === id));

/** Grundpreis je 100 g in Cent (gerundet) oder null, wenn keine Nettofüllmenge hinterlegt ist. */
export function basePricePer100gCents(product: Pick<Product, "priceCents" | "netWeightGrams">): number | null {
  const grams = product.netWeightGrams;
  if (!grams || grams <= 0 || !Number.isFinite(grams)) return null;
  return Math.round((product.priceCents * 100) / grams);
}

const translations: Partial<Record<Locale, Record<string, ProductText>>> = {
  en: catalogEn as Record<string, ProductText>,
  es: catalogEs as Record<string, ProductText>,
  fr: catalogFr as Record<string, ProductText>,
};

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && (CATEGORY_IDS as readonly string[]).includes(value);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}

export function byCategory(id: CategoryId): Product[] {
  return products.filter((product) => product.category === id);
}

/** Jedes Haarteil existiert genau einmal. Pflegeprodukte, Extensions (Mengenware) und Maßanfertigungen sind keine Einzelstücke. */
export function isUnique(product: Product): boolean {
  return product.category !== "pflege" && product.category !== "extensions" && !product.madeToOrder;
}

/** Pflegeprodukte und Extensions dürfen mehrfach bestellt werden (max. 9 je Position). */
export const MAX_QUANTITY = 9;

/** Lokalisierter Produkttext. Deutsch ist die Quelle; fehlt eine Übersetzung, wird Deutsch gezeigt. */
export function productText(product: Product, locale: Locale): ProductText {
  if (locale === "de") {
    return { description: product.description, name: product.name, specs: product.specs, subtitle: product.subtitle };
  }
  const entry = translations[locale]?.[String(product.id)];
  if (!entry) {
    return { description: product.description, name: product.name, specs: product.specs, subtitle: product.subtitle };
  }
  return entry;
}

/** Startseite "Gerade im Atelier": acht Stücke, eines davon verkauft (Design-Brief). */
export const featuredIds = [414, 413, 287, 416, 99, 415, 73, 206];

export const featured: Product[] = featuredIds
  .map((id) => getProductById(id))
  .filter((product): product is Product => Boolean(product));

/** Kleine, serialisierbare Produktform für Client-Komponenten (Warenkorb). */
export type ProductLite = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  priceCents: number;
  unique: boolean;
  category: CategoryId;
};

export function toLite(product: Product, locale: Locale): ProductLite {
  const text = productText(product, locale);
  return {
    category: product.category,
    image: product.image,
    name: text.name,
    priceCents: product.priceCents,
    slug: product.slug,
    subtitle: text.subtitle,
    unique: isUnique(product),
  };
}

/** Produktliste für Abschnitte (z. B. Startseite). Verkaufte Stücke nur auf Wunsch. */
export function getProducts(options: { category?: CategoryId; limit?: number; includeSold?: boolean; exclude?: ReadonlySet<string> } = {}): Product[] {
  const list = products.filter(
    (product) =>
      (!options.category || product.category === options.category) &&
      (options.includeSold || !product.sold) &&
      !options.exclude?.has(product.slug),
  );
  return options.limit ? list.slice(0, options.limit) : list;
}
