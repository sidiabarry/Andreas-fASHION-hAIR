import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="af-page">
      <title>{t("metaTitle")}</title>
      <meta content="noindex" name="robots" />
      <div className="af-wrap af-empty">
        <p className="af-mono">{t("kicker")}</p>
        <h1 className="af-h1">{t("title")}</h1>
        <p className="af-lead">{t("lead")}</p>
        <Link className="af-cta-gold" href="/kollektion">
          {t("cta")} <Arrow />
        </Link>
      </div>
    </main>
  );
}
