import { getTranslations } from "next-intl/server";

import { company, vatNoteKey } from "@/config/company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";

/** Pflichtangaben neben dem Preis (PAngV): Umsatzsteuer-Hinweis und Versandkosten. */
export async function PriceNote({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "price" });
  const key = vatNoteKey(company);
  return (
    <small>
      {t(key ?? "unknownVat")} {t.rich("plusShipping", { link: (chunks) => <Link className="af-link" href="/versand-und-zahlung">{chunks}</Link> })}
    </small>
  );
}
