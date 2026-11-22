import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

/** „Private Beratung“ (Text von der Live-Seite). */
export async function ConsultBlock() {
  const t = await getTranslations("consult");
  return (
    <section aria-labelledby="consult-title" className="af-section af-surface">
      <div className="af-wrap af-stack af-rise" style={{ maxWidth: 820, textAlign: "center", justifyItems: "center", display: "grid" }}>
        <p className="af-mono">{t("kicker")}</p>
        <h2 className="af-h2" id="consult-title">
          {t("title")}
        </h2>
        <p className="af-lead">{t("lead")}</p>
        <Link className="af-cta-gold af-glass af-glass--gold" href="/anfrage">
          {t("cta")} <Arrow />
        </Link>
      </div>
    </section>
  );
}
