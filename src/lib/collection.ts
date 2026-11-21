import { CATEGORY_IDS } from "@/data/catalog";
import type { CategoryId, Product } from "@/data/catalog";

/** Extensions-Methoden (Reihenfolge wie auf der Extensions-Seite). */
export const METHOD_IDS = ["butterfly", "genius", "invisible", "tape", "keratin", "clip"] as const;
export type MethodId = (typeof METHOD_IDS)[number];

export const COLOR_GROUP_IDS = ["blond", "braun", "kupfer", "schwarz", "grau", "andere"] as const;
export type ColorGroupId = (typeof COLOR_GROUP_IDS)[number];

export const LENGTH_BAND_IDS = ["kurz", "mittel", "lang"] as const;
export type LengthBandId = (typeof LENGTH_BAND_IDS)[number];

/** Grenzen der Längenbänder in cm: kurz bis 30, mittel 31–45, lang ab 46. */
export const LENGTH_BANDS = { kurz: { from: 0, to: 30 }, lang: { from: 46, to: Infinity }, mittel: { from: 31, to: 45 } } as const;

/** Methode einer Extensions-Packung aus dem Produktnamen. null bei allem anderen. */
export function methodOf(product: Pick<Product, "category" | "name">): MethodId | null {
  if (product.category !== "extensions") return null;
  const n = product.name.toLowerCase();
  if (n.includes("butterfly")) return "butterfly";
  if (n.includes("genius")) return "genius";
  if (n.includes("invisible")) return "invisible";
  if (n.includes("keratin") || n.includes("bonding")) return "keratin";
  if (n.includes("clip")) return "clip";
  if (n.includes("tape")) return "tape";
  return null;
}

const COLOR_WORDS: [string, ColorGroupId][] = [
  ["grau", "grau"],
  ["silber", "grau"],
  ["schwarz", "schwarz"],
  ["blond", "blond"],
  ["kupfer", "kupfer"],
  ["rot", "kupfer"],
  ["braun", "braun"],
];

/** Farbgruppe nach dem frühesten Farbwort („Kaffeebraun mit Kupfer-Ombré“ = braun, „Kupferbraun“ = kupfer). */
export function colorGroupOf(product: Pick<Product, "color">): ColorGroupId {
  const c = product.color.toLowerCase();
  let best: { at: number; group: ColorGroupId } | null = null;
  for (const [word, group] of COLOR_WORDS) {
    const at = c.indexOf(word);
    if (at >= 0 && (!best || at < best.at)) best = { at, group };
  }
  return best?.group ?? "andere";
}

export function lengthBandOf(product: Pick<Product, "length">): LengthBandId | null {
  const cm = Number.parseInt(product.length, 10);
  if (!Number.isFinite(cm) || cm <= 0) return null;
  if (cm <= LENGTH_BANDS.kurz.to) return "kurz";
  if (cm <= LENGTH_BANDS.mittel.to) return "mittel";
  return "lang";
}

export type CollectionFilter = { category: CategoryId | null; method: MethodId | null; color: ColorGroupId | null; length: LengthBandId | null };

export function filterProducts(list: Product[], filter: CollectionFilter): Product[] {
  return list.filter(
    (p) =>
      (!filter.category || p.category === filter.category) &&
      (!filter.method || methodOf(p) === filter.method) &&
      (!filter.color || colorGroupOf(p) === filter.color) &&
      (!filter.length || lengthBandOf(p) === filter.length),
  );
}

const pick = <T extends string>(ids: readonly T[], value: unknown): T | null => (typeof value === "string" && (ids as readonly string[]).includes(value) ? (value as T) : null);
export const parseMethod = (value: unknown) => pick(METHOD_IDS, value);
export const parseColorGroup = (value: unknown) => pick(COLOR_GROUP_IDS, value);
export const parseLengthBand = (value: unknown) => pick(LENGTH_BAND_IDS, value);

/** Standardreihenfolge: nach Kategorie (Extensions zuerst), innerhalb der Kategorie die Reihenfolge der Eingabe. Stabil. */
export function orderByCategory(list: Product[]): Product[] {
  const rank = (p: Product) => CATEGORY_IDS.indexOf(p.category);
  return list.slice().sort((a, b) => rank(a) - rank(b));
}

/** Verfügbare Optionen eines Filters (ohne die Auswahl dieses Filters selbst), mit Anzahl. Nur Optionen mit mindestens einem Treffer. */
export function facetCounts<T extends string>(list: Product[], ids: readonly T[], of: (p: Product) => T | null): { id: T; count: number }[] {
  return ids.map((id) => ({ count: list.filter((p) => of(p) === id).length, id })).filter((entry) => entry.count > 0);
}
