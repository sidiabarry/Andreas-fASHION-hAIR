import { getTranslations } from "next-intl/server";

import type { ProductCopy } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";

/**
 * Ausführliche Verkaufstexte (nur, wenn am Produkt hinterlegt) als zugeklappte Abschnitte im Frageblock,
 * damit die Seite auf dem Handy kurz bleibt. Headline und Story stehen oben auf der Seite.
 */
export async function ProductCopyBlock({ copy, locale }: { copy: ProductCopy; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "product.copy" });
  const items: { key: string; title: string; body: React.ReactNode }[] = [];
  const list = (entries: string[]) => (
    <ul className="af-copy__list">
      {entries.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  if (copy.benefits?.length) items.push({ body: list(copy.benefits), key: "benefits", title: t("benefits") });
  if (copy.howItWorks) items.push({ body: <p>{copy.howItWorks}</p>, key: "how", title: t("how") });
  if (copy.goodFor) items.push({ body: <p>{copy.goodFor}</p>, key: "good", title: t("good") });
  if (copy.care?.length) items.push({ body: list(copy.care), key: "care", title: t("care") });
  return (
    <>
      {items.map((item) => (
        <details key={item.key}>
          <summary>
            <h3 className="af-faq__q">{item.title}</h3>
            <i aria-hidden="true" />
          </summary>
          {item.body}
        </details>
      ))}
    </>
  );
}
