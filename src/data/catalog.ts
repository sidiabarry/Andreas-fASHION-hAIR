import raw from "./catalog.json";
import catalogEn from "../messages/catalog/en.json";
import catalogEs from "../messages/catalog/es.json";
import catalogFr from "../messages/catalog/fr.json";
import copyEn from "../messages/catalog-copy/en.json";
import copyEs from "../messages/catalog-copy/es.json";
import copyFr from "../messages/catalog-copy/fr.json";
import type { Locale } from "../i18n/locales";

/** Reihenfolge = Reihenfolge in Menü und Filtern. Extensions zuerst (Wunsch der Inhaberin). */
export const CATEGORY_IDS = ["extensions", "topper", "peruecken", "pony", "maenner", "pflege"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/**
 * Optionale Verkaufstexte je Produkt (Deutsch = Quelle, in catalog.json am Produkt).
 * Fehlt ein Feld, gilt die bisherige Darstellung. Übersetzungen je Produkt-ID in
 * src/messages/catalog-copy/<lang>.json (nur die Felder, die überschrieben werden; der Rest fällt auf Deutsch zurück).
 * Bewusst getrennt von messages/catalog/<lang>.json, weil scripts/catalog-i18n diese Dateien neu erzeugt.
 */
export type ProductCopy = {
  /** Eine Zeile unter dem Namen. */
  headline?: string;
  /** 2–3 Sätze: Ergebnis und Vorstellungskraft, ohne Heilversprechen. */
  story?: string;
  /** 3–5 Punkte. */
  benefits?: string[];
  /** 2–4 Sätze zur Methode. */
  howItWorks?: string;
  /** Für wen das Stück passt, 1–2 Sätze. */
  goodFor?: string;
  /** Pflegehinweise als Liste. */
  care?: string[];
  /** Zusätzliche Fragen und Antworten, stehen vor den allgemeinen Einwänden. */
  faq?: { q: string; a: string }[];
};
export const COPY_FIELDS = ["headline", "story", "benefits", "howItWorks", "goodFor", "care", "faq"] as const satisfies readonly (keyof ProductCopy)[];

/** Bildart des Hauptbilds: "relit" = nur neu ausgeleuchtet, "staged" = inszenierte Studioaufnahme (Farbe am Original gemessen). */
export type ImageKind = "relit" | "staged";

export type Product = ProductCopy & {
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
  /** Art des Studiobilds (nur bei restyled). Fehlt das Feld, gilt "relit". */
  imageKind?: ImageKind | null;
  /** Zweites Studiobild, steht in der Galerie direkt hinter dem Hauptbild. */
  secondImage?: string | null;
  /** Aus dem Shop genommen (Daten bleiben erhalten). Auftraggeber 21.11.2026: Walker-Tape-Produkte. */
  hidden?: boolean;
  /** GPSR Art. 19: "atelier" = von Andrea selbst gefertigt (Angaben aus company.ts; vom Auftraggeber bestätigt 21.11.2026). */
  manufacturer?: "atelier" | null;
  originals: string[];
  madeToOrder: boolean;
  /** Bestand laut Abgleich mit der Inhaberin. "unknown" = noch nicht abgeglichen (Anzeige: Verfügbarkeit wird persönlich bestätigt). */
  availability: "in_stock" | "made_to_order" | "unknown";
  /** Herkunft des Haars. Vom Auftraggeber bestätigt (21.11.2026): alles Echthaar aus Vietnam, besonders fein. Pflege: null. */
  origin: "Vietnam" | null;
  /** Sicherheits-/Gefahrstoffhinweise (GPSR, CLP). null = noch nicht geliefert. */
  safety: string | null;
  /**
   * Nettofüllmenge in Gramm für Ware, die nach Gewicht angeboten wird (Extensions-Packungen).
   * Gesetzt = Grundpreis „€ / 1 kg“ wird neben dem Preis gezeigt. null/fehlt = kein Grundpreis (Schalter).
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

export function imageKindOf(product: Pick<Product, "restyled" | "imageKind">): ImageKind | null {
  return product.restyled ? (product.imageKind ?? "relit") : null;
}

/** Bilder in Galerie-Reihenfolge: Studio-Hauptbild, Zweitbild, dann die unbearbeiteten Originalfotos. */
export function galleryImages(product: Product): { src: string; kind: "studio" | "original" }[] {
  if (!product.restyled) {
    const list = product.originals.length ? product.originals : [product.image];
    return list.map((src) => ({ kind: "original", src }));
  }
  return [
    { kind: "studio", src: product.image },
    ...(product.secondImage ? [{ kind: "studio" as const, src: product.secondImage }] : []),
    ...product.originals.map((src) => ({ kind: "original" as const, src })),
  ];
}

export const products: Product[] = (raw as Product[]).filter((product) => !product.hidden);

/** Kategorien, in denen es sichtbare Produkte gibt (Filter, Footer, Sitemap). */
export const VISIBLE_CATEGORY_IDS = CATEGORY_IDS.filter((id) => products.some((product) => product.category === id));

/** Kategorien ohne Online-Produkte: nur Anfrage. Folgt den Daten: sobald eine Kategorie Produkte hat, ist sie kaufbar. */
export const INQUIRY_ONLY_CATEGORIES: readonly CategoryId[] = CATEGORY_IDS.filter((id) => !products.some((product) => product.category === id));

/** Grundpreis je 1 kg in Cent (gerundet; § 5 Abs. 1 PAngV, Fertigpackungen) oder null, wenn keine Nettofüllmenge hinterlegt ist. */
export function basePricePerKgCents(product: Pick<Product, "priceCents" | "netWeightGrams">): number | null {
  const grams = product.netWeightGrams;
  if (!grams || grams <= 0 || !Number.isFinite(grams)) return null;
  return Math.round((product.priceCents * 1000) / grams);
}

/** Angaben neben dem Preis: Verkaufseinheit mit Gewicht und Grundpreis je 1 kg. null = keine Angabe. */
export type UnitInfo = { kind: "pack" | "set"; grams: number; parts: number; baseCents: number | null };

export function unitInfo(product: Product): UnitInfo | null {
  if (!product.priceUnit || !product.weightGrams) return null;
  return { baseCents: basePricePerKgCents(product), grams: product.weightGrams, kind: product.priceUnit, parts: product.setParts ?? 0 };
}

const translations: Partial<Record<Locale, Record<string, ProductText>>> = {
  en: catalogEn as Record<string, ProductText>,
  es: catalogEs as Record<string, ProductText>,
  fr: catalogFr as Record<string, ProductText>,
};

const copyTranslations: Partial<Record<Locale, Record<string, ProductCopy>>> = {
  en: copyEn as Record<string, ProductCopy>,
  es: copyEs as Record<string, ProductCopy>,
  fr: copyFr as Record<string, ProductCopy>,
};

/** Verkaufstexte in der Sprache: je Feld die Übersetzung, sonst der deutsche Text; null, wenn nichts hinterlegt ist. */
export function productCopy(product: Product, locale: Locale): ProductCopy | null {
  const merged: ProductCopy = {};
  const override = locale === "de" ? undefined : copyTranslations[locale]?.[String(product.id)];
  for (const field of COPY_FIELDS) {
    const value = override?.[field] ?? product[field];
    if (Array.isArray(value) ? value.length : value) (merged as Record<string, unknown>)[field] = value;
  }
  return Object.keys(merged).length ? merged : null;
}

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
  unit: UnitInfo | null;
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
    unit: unitInfo(product),
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
