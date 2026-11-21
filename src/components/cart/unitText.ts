import type { UnitInfo } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { formatPrice } from "@/lib/money";

type RootT = (key: string, values?: Record<string, string | number>) => string;

/** „je Packung 50 g · 2.300,00 € / 1 kg“ für Warenkorb, Drawer und Kasse (Grundpreis auch vor der Bestellung sichtbar). */
export function unitText(t: RootT, unit: UnitInfo, locale: Locale): string {
  const size = unit.kind === "set" ? t("product.setSize", { grams: unit.grams, pieces: unit.parts }) : t("product.packSize", { grams: unit.grams });
  return unit.baseCents ? `${size} · ${t("product.unitPrice", { amount: formatPrice(unit.baseCents, locale) })}` : size;
}
