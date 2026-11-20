import { getTranslations } from "next-intl/server";

import type { ProductCopy } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";

/** Ausführliche Verkaufstexte (nur, wenn am Produkt hinterlegt). Headline und Story stehen oben auf der Seite, FAQ im Frageblock. */
export async function ProductCopyBlock({ copy, locale }: { copy: ProductCopy; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "product.copy" });
  const has = copy.benefits?.length || copy.howItWorks || copy.goodFor || copy.care?.length;
  if (!has) return null;
  return (
    <section aria-label={t("title")} className="af-copy">
      {copy.benefits?.length ? (
        <div>
          <h2 className="af-mono">{t("benefits")}</h2>
          <ul className="af-copy__list">
            {copy.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {copy.howItWorks ? (
        <div>
          <h2 className="af-mono">{t("how")}</h2>
          <p className="af-text">{copy.howItWorks}</p>
        </div>
      ) : null}
      {copy.goodFor ? (
        <div>
          <h2 className="af-mono">{t("good")}</h2>
          <p className="af-text">{copy.goodFor}</p>
        </div>
      ) : null}
      {copy.care?.length ? (
        <div>
          <h2 className="af-mono">{t("care")}</h2>
          <ul className="af-copy__list">
            {copy.care.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
