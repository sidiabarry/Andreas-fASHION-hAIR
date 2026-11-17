import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { legalFor } from "@/content/legal-registry";

import { WithdrawalForm } from "@/components/forms/WithdrawalForm";
import { company } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { siteMode } from "@/server/mode";

export async function generateMetadata({ params }: PageProps<"/[locale]/widerruf/erklaeren">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "withdrawal" });
  return pageMetadata({ description: t("lead"), locale: locale as Locale, path: "/widerruf/erklaeren", title: t("metaTitle") });
}

export default async function WithdrawalFunctionPage({ params, searchParams }: PageProps<"/[locale]/widerruf/erklaeren">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: "withdrawal" });
  const legal = legalFor(locale);
  const texts = legal.checkoutTextsFor(toLegalCompany());
  const mode = siteMode();
  const address = `${company.brandName}, ${company.address.street}, ${company.address.postalCode} ${company.address.city}`;
  const initialOrder = typeof query.bestellung === "string" && /^[A-Z0-9-]{1,40}$/.test(query.bestellung) ? query.bestellung : "";

  return (
    <main className="af-page">
      <div className="af-wrap af-pdp">
        <div className="af-stack af-inquiry-intro">
          <p className="af-mono">{t("kicker")}</p>
          <h1 className="af-h2">{legal.lang === locale ? texts.withdrawalButtonLabel : t("title")}</h1>
          <p className="af-lead">{t("lead")}</p>
          {legal.lang === locale && texts.withdrawalFormIntro ? <p className="af-text">{texts.withdrawalFormIntro}</p> : null}
          <p className="af-note">{t.rich("otherWays", { link: (chunks) => <Link className="af-link" href="/widerruf">{chunks}</Link> })}</p>
        </div>
        {mode.demo || mode.mail ? (
          <WithdrawalForm
            confirmLabel={legal.lang === locale ? texts.withdrawalConfirmLabel : t("confirm")}
            initialOrder={initialOrder}
            ownerAddress={address}
            ownerEmail={company.email}
          />
        ) : (
          <div className="af-msg" data-kind="info" role="status">
            <h2 className="af-h3">{t("unavailableTitle")}</h2>
            <p>{t("unavailable", { address, email: company.email })}</p>
          </div>
        )}
      </div>
    </main>
  );
}
