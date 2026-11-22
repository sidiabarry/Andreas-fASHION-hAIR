import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ContactLinks } from "@/components/site/ContactLinks";
import { company } from "@/config/company";
import { deliveryParams } from "@/config/shipping";
import { toLegalCompany } from "@/config/legal-company";
import { legalFor } from "@/content/legal-registry";
import type { Locale } from "@/i18n/locales";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { siteMode } from "@/server/mode";

export async function generateMetadata({ params }: PageProps<"/[locale]/massanfertigung">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "custom" });
  return pageMetadata({ description: t("lead"), locale: locale as Locale, path: "/massanfertigung", title: t("metaTitle") });
}

export default async function CustomPage({ params, searchParams }: PageProps<"/[locale]/massanfertigung">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const query = await searchParams;
  const t = await getTranslations({ locale });
  const product = typeof query.produkt === "string" ? query.produkt.slice(0, 120) : "";
  const mode = siteMode();
  const available = mode.demo || mode.inquiry;

  return (
    <main className="af-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("common.home"), path: `/${locale}` },
          { name: t("custom.title"), path: `/${locale}/massanfertigung` },
        ])}
      />
      <div className="af-wrap af-pdp">
        <div className="af-stack af-inquiry-intro">
          <p className="af-mono">{t("custom.kicker")}</p>
          <h1 className="af-h2">{t("custom.title")}</h1>
          <p className="af-lead">{t("custom.lead")}</p>
          {product ? <p className="af-only">{t("inquiry.about", { product })}</p> : null}
          <p className="af-note">
            {t("custom.timing", deliveryParams())}{" "}
            <Link className="af-link" href="/widerruf">
              {t("home.concerns.returnsLink")}
            </Link>
          </p>
          <ol className="af-hubsteps af-hubsteps--plain">
            {(["system", "length", "color", "structure", "amount", "contact"] as const).map((step) => (
              <li key={step}>
                <b>{t(`custom.steps.${step}.title`)}</b>
              </li>
            ))}
          </ol>
          <h2 className="af-h3">{t("inquiry.contactAlt")}</h2>
          <ContactLinks />
        </div>
        {available ? (
          <InquiryForm b2bNotice={legalFor(locale).checkoutTextsFor(toLegalCompany()).b2bNotice} fixedTopic ownerEmail={company.email} product={product} topic="massanfertigung" wizard />
        ) : (
          <div className="af-msg" data-kind="info" role="status">
            <h2 className="af-h3">{t("inquiry.unavailableTitle")}</h2>
            <p>{t("inquiry.unavailable")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
