/**
 * Serverseitige Berechnung einer Bestellung ausschließlich aus dem Katalog.
 * Clientwerte (Preise, Summen, Versand) werden nie übernommen.
 */
import { getProduct, isUnique, MAX_QUANTITY } from "../data/catalog";
import { shippingCents, zoneForCountry } from "../config/shipping";

export type OrderLineInput = { slug: string; quantity: number };

export type PricedLine = {
  slug: string;
  productId: number;
  name: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
  unique: boolean;
};

export type PricedOrder = {
  lines: PricedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  zone: "de" | "eu";
};

export type PriceError =
  | { code: "empty" }
  | { code: "unknown"; slug: string }
  | { code: "sold"; slugs: string[] }
  | { code: "quantity"; slug: string }
  | { code: "duplicate"; slug: string }
  | { code: "country" };

export function priceOrder(
  input: OrderLineInput[],
  countryCode: string,
  soldSlugs: ReadonlySet<string>,
): { ok: true; order: PricedOrder } | { ok: false; error: PriceError } {
  if (input.length === 0) return { error: { code: "empty" }, ok: false };
  const seen = new Set<string>();
  const lines: PricedLine[] = [];
  const sold: string[] = [];
  for (const item of input) {
    if (seen.has(item.slug)) return { error: { code: "duplicate", slug: item.slug }, ok: false };
    seen.add(item.slug);
    const product = getProduct(item.slug);
    if (!product) return { error: { code: "unknown", slug: item.slug }, ok: false };
    const unique = isUnique(product);
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > (unique ? 1 : MAX_QUANTITY)) {
      return { error: { code: "quantity", slug: item.slug }, ok: false };
    }
    if (product.sold || (unique && soldSlugs.has(product.slug))) sold.push(product.slug);
    lines.push({
      name: product.subtitle ? `${product.name}, ${product.subtitle}` : product.name,
      productId: product.id,
      quantity: item.quantity,
      slug: product.slug,
      totalCents: product.priceCents * item.quantity,
      unique,
      unitCents: product.priceCents,
    });
  }
  if (sold.length) return { error: { code: "sold", slugs: sold }, ok: false };
  const subtotalCents = lines.reduce((sum, line) => sum + line.totalCents, 0);
  const shipping = shippingCents(countryCode, subtotalCents);
  const zone = zoneForCountry(countryCode).id;
  if (shipping === null || zone === "world") return { error: { code: "country" }, ok: false };
  return {
    ok: true,
    order: { lines, shippingCents: shipping, subtotalCents, totalCents: subtotalCents + shipping, zone },
  };
}
