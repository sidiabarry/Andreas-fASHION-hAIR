import { getTranslations } from "next-intl/server";

import { company, vatNoteKey } from "@/config/company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

/**
 * Pflichtangaben neben dem Preis (PAngV): Umsatzsteuer-Hinweis und Versandkosten.
 * Mit `basePriceCents` (aus `netWeightGrams`, siehe basePricePer100gCents) zusätzlich der Grundpreis je 100 g.
 */
export async function PriceNote({ locale, basePriceCents, unitLabel }: { locale: Locale; basePriceCents?: number | null; unitLabel?: string | null }) {
  const t = await getTranslations({ locale, namespace: "price" });
  const key = vatNoteKey(company);
  return (
    <small>
      {unitLabel ? <span style={{ display: "block" }}>{unitLabel}</span> : null}
      {basePriceCents ? <span style={{ display: "block" }}>{t("basePrice", { amount: formatPrice(basePriceCents, locale) })}</span> : null}
      {t(key ?? "unknownVat")} {t.rich("plusShipping", { link: (chunks) => <Link className="af-link" href="/versand-und-zahlung">{chunks}</Link> })}
    </small>
  );
}
