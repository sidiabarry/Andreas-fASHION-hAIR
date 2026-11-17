import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { legalFor } from "@/content/legal-registry";

import { Arrow } from "@/components/Arrow";
import { LegalPage } from "@/components/site/LegalPage";
import { toLegalCompany } from "@/config/legal-company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/widerruf">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({ description: t("withdrawalDescription"), locale: locale as Locale, path: "/widerruf", title: t("withdrawal") });
}

export default async function WithdrawalPolicyPage({ params }: PageProps<"/[locale]/widerruf">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const legal = legalFor(locale);
  const muster = legal.fillWiderrufsformular(toLegalCompany());
  return (
    <LegalPage fields={["ownerFullName"]} locale={locale as Locale} page="widerruf" title={t("withdrawal")}>
      <div className="af-hero-actions" style={{ marginTop: 36 }}>
        <Link className="af-cta-gold" href="/widerruf/erklaeren">
          {t("withdrawCta")} <Arrow />
        </Link>
      </div>
      {muster.lines.length ? (
        <section aria-labelledby="muster-title" className="af-prose af-review" lang={legal.lang} style={{ marginTop: 44 }}>
          <h2 id="muster-title" style={{ marginTop: 0 }}>
            {muster.title}
          </h2>
          {muster.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>
      ) : null}
    </LegalPage>
  );
}
