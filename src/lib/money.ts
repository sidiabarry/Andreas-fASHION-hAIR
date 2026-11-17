import { LOCALE_TAGS } from "../i18n/locales";
import type { AnyLocale } from "../i18n/locales";

/** Preis in Cent → "1.234,56 €" (de-DE) bzw. lokales Format. Währung bleibt immer EUR. */
export function formatPrice(cents: number, locale: AnyLocale = "de"): string {
  if (!Number.isInteger(cents)) throw new RangeError("cents must be an integer");
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
  }).format(cents / 100);
}
