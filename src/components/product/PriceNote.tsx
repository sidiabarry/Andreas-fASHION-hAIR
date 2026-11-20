import { getTranslations } from "next-intl/server";

import { company, vatNoteKey } from "@/config/company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import type { UnitInfo } from "@/data/catalog";
import { formatPrice } from "@/lib/money";

/**
 * Pflichtangaben neben dem Preis (PAngV): Umsatzsteuer-Hinweis und Versandkosten.
 * Mit `unit` (aus `unitInfo`) zusätzlich Verkaufseinheit und Grundpreis je 1 kg.
 */
export async function PriceNote({ locale, unit }: { locale: Locale; unit?: UnitInfo | null }) {
  const t = await getTranslations({ locale, namespace: "price" });
  const tp = await getTranslations({ locale, namespace: "product" });
  const key = vatNoteKey(company);
  const unitLine = unit
    ? [unit.kind === "set" ? tp("setSize", { grams: unit.grams, pieces: unit.parts }) : tp("packSize", { grams: unit.grams }), unit.baseCents ? tp("unitPrice", { amount: formatPrice(unit.baseCents, locale) }) : null]
        .filter(Boolean)
        .join(" · ")
    : null;
  return (
    <small>
      {unitLine ? <span style={{ display: "block" }}>{unitLine}</span> : null}
      {t(key ?? "unknownVat")} {t.rich("plusShipping", { link: (chunks) => <Link className="af-link" href="/versand-und-zahlung">{chunks}</Link> })}
    </small>
  );
}
