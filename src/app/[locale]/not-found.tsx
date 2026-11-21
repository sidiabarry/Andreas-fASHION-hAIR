import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { HairStage } from "@/components/fx/HairStage";
import { Link } from "@/i18n/navigation";

/** 404: ruhige dunkle Bühne, das Haar der Startseite ordnet sich leise im Hintergrund. */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="af-lost">
      <title>{t("metaTitle")}</title>
      <meta content="noindex" name="robots" />
      <HairStage mscale={0.8} mx={0.5} my={0.22} scale={0.75} x={0.72} y={0.45} />
      <div className="af-wrap">
        <div className="af-lost__body">
          <p className="af-mono">{t("kicker")}</p>
          <h1 className="af-h1">{t("title")}</h1>
          <p className="af-lead">{t("lead")}</p>
          <div className="af-lost__links">
            <Link className="af-cta-gold" data-magnetic="" href="/kollektion">
              {t("cta")} <Arrow />
            </Link>
            <Link href="/extensions">{t("extensions")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
