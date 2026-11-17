import raw from "./catalog.json";
import catalogEn from "../messages/catalog/en.json";
import type { Locale } from "../i18n/locales";

export const CATEGORY_IDS = ["topper", "peruecken", "pony", "maenner", "pflege"] as const;
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
  /** Sicherheits-/Gefahrstoffhinweise (GPSR, CLP). null = noch nicht geliefert. */
  safety: string | null;
};

export type ProductText = Pick<Product, "name" | "subtitle" | "description" | "specs">;

export const products: Product[] = raw as Product[];

const translations: Partial<Record<Locale, Record<string, ProductText>>> = {
  en: catalogEn as Record<string, ProductText>,
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

/** Jedes Haarteil existiert genau einmal. Pflegeprodukte und Maßanfertigungen sind keine Einzelstücke. */
export function isUnique(product: Product): boolean {
  return product.category !== "pflege" && !product.madeToOrder;
}

/** Pflegeprodukte dürfen mehrfach bestellt werden (max. 9 je Position). */
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
