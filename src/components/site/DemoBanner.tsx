import { getTranslations } from "next-intl/server";

/** Sichtbarer Hinweis im Demo-Modus (Entwicklung/Vorschau). In Production nie gerendert. */
export async function DemoBanner() {
  const t = await getTranslations("common");
  return (
    <aside aria-label={t("demoLabel")} className="af-demo">
      <b>{t("demoLabel")}</b>
      {t("demoText")}
    </aside>
  );
}
