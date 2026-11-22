import { getTranslations } from "next-intl/server";

/** Modul 15: Gewicht im Vergleich. Nur mit echter Angabe im Katalog (netWeightGrams), nichts abgeleitet. */
export async function WeightCompare({ locale, grams }: { locale: string; grams: number }) {
  const t = await getTranslations({ locale, namespace: "pdp" });
  const phone = 200;
  const max = Math.max(phone, grams);
  return (
    <section aria-labelledby="weight-title" className="af-weight">
      <h2 className="af-h3" id="weight-title">
        {t("weightTitle")}
      </h2>
      <p className="af-text">{t("weightText", { grams })}</p>
      <div aria-hidden="true" className="af-weight__bars">
        <div>
          <span>{t("weightThis")}</span>
          <i style={{ width: `${Math.max(6, (grams / max) * 100)}%` }} />
          <b>{grams} g</b>
        </div>
        <div>
          <span>{t("weightPhone")}</span>
          <i style={{ width: `${(phone / max) * 100}%` }} />
          <b>≈ {phone} g</b>
        </div>
      </div>
    </section>
  );
}
