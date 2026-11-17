import { company } from "@/config/company";
import * as shipping from "@/config/shipping";
import type { Locale } from "@/i18n/locales";
import { formatPrice } from "@/lib/money";

/**
 * Zahlen für die Texte der Startseite – ausschließlich aus src/config. Lieferzeiten: Sobald das
 * Fundament `STOCK_DELIVERY_DAYS` / `MADE_TO_ORDER_DAYS` exportiert, gelten diese; bis dahin die von
 * der Inhaberin bestätigten Werte (ab Lager 2–5 Werktage, Maßanfertigung 15–20 Werktage).
 */
type Range = [number, number];
const cfg = shipping as unknown as Record<string, unknown>;
const isRange = (v: unknown): v is Range => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === "number");

const STOCK: Range = isRange(cfg.STOCK_DELIVERY_DAYS) ? cfg.STOCK_DELIVERY_DAYS : [2, 5];
const CUSTOM: Range = isRange(cfg.MADE_TO_ORDER_DAYS) ? cfg.MADE_TO_ORDER_DAYS : [15, 20];

const range = ([a, b]: Range) => `${a}–${b}`;

export function homeValues(locale: Locale) {
  const de = shipping.SHIPPING_ZONES.de;
  const eu = shipping.SHIPPING_ZONES.eu;
  return {
    carrier: company.shippingCarrier ?? "DHL",
    custom: range(CUSTOM),
    deShip: de.priceCents === null ? "" : formatPrice(de.priceCents, locale),
    euShip: eu.priceCents === null ? "" : formatPrice(eu.priceCents, locale),
    freeFrom: de.freeFromCents === null ? "" : formatPrice(de.freeFromCents, locale),
    stock: range(STOCK),
  };
}

export type HomeValues = ReturnType<typeof homeValues>;

/** WhatsApp-Link der Inhaberin; ohne Link führt die Beratung zum Anfrageformular. */
export const whatsappHref = company.social.whatsapp;
