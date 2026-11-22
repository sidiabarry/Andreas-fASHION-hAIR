import { company } from "@/config/company";
import { DELIVERY_DAYS_IN_STOCK, MADE_TO_ORDER_DAYS, SHIPPING_ZONES } from "@/config/shipping";
import type { Locale } from "@/i18n/locales";
import { formatPrice } from "@/lib/money";

/** Zahlen für die Texte der Startseite und von „Über Andréia“ – ausschließlich aus src/config. */
const range = ([a, b]: [number, number]) => `${a}–${b}`;

export function homeValues(locale: Locale) {
  const de = SHIPPING_ZONES.de;
  const eu = SHIPPING_ZONES.eu;
  return {
    carrier: company.shippingCarrier ?? "",
    custom: range(MADE_TO_ORDER_DAYS),
    deShip: de.priceCents === null ? "" : formatPrice(de.priceCents, locale),
    euShip: eu.priceCents === null ? "" : formatPrice(eu.priceCents, locale),
    freeFrom: de.freeFromCents === null ? "" : formatPrice(de.freeFromCents, locale),
    stock: range(DELIVERY_DAYS_IN_STOCK),
  };
}

export type HomeValues = ReturnType<typeof homeValues>;

/** WhatsApp-Link der Inhaberin; ohne Link führt die Beratung zum Anfrageformular. */
export const whatsappHref = company.social.whatsapp;

/** Öffnungszeiten aus der Firmenkonfiguration, z. B. „Mo.–Fr. 10:00–19:00 · Sa. 10:00–14:00“. */
export function openingHours(locale: Locale) {
  const day = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  // 2024-01-01 war ein Montag (ISO-Wochentag 1)
  const name = (iso: number) => day.format(new Date(Date.UTC(2024, 0, iso)));
  return company.openingHours
    .filter((h) => h.opens && h.closes && h.days.length)
    .map((h) => {
      const first = h.days[0];
      const last = h.days[h.days.length - 1];
      const days = first === last ? name(first) : `${name(first)}–${name(last)}`;
      return `${days} ${h.opens}–${h.closes}`;
    })
    .join(" · ");
}
