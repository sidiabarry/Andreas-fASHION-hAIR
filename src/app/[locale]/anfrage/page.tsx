import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { ContactLinks } from "@/components/site/ContactLinks";
import { company } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import { legalFor } from "@/content/legal-registry";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { INQUIRY_TOPICS } from "@/lib/validation";
import type { InquiryTopic } from "@/lib/validation";
import { siteMode } from "@/server/mode";

export async function generateMetadata({ params }: PageProps<"/[locale]/anfrage">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "inquiry" });
  return pageMetadata({ description: t("intro.beratung.lead"), locale: locale as Locale, path: "/anfrage", title: t("metaTitle") });
}

export default async function InquiryPage({ params, searchParams }: PageProps<"/[locale]/anfrage">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: "inquiry" });
  const topic: InquiryTopic = INQUIRY_TOPICS.includes(query.thema as InquiryTopic) ? (query.thema as InquiryTopic) : "beratung";
  const product = typeof query.produkt === "string" ? query.produkt.slice(0, 160) : "";
  const mode = siteMode();
  const available = mode.demo || mode.mail;

  return (
    <main className="af-page">
      <div className="af-wrap af-pdp">
        <div className="af-stack af-inquiry-intro">
          <p className="af-mono">{t("kicker")}</p>
          <h1 className="af-h2">{t(`intro.${topic}.title`)}</h1>
          <p className="af-lead">{t(`intro.${topic}.lead`)}</p>
          {product ? <p className="af-only">{t("about", { product })}</p> : null}
          <h2 className="af-h3">{t("contactAlt")}</h2>
          <ContactLinks />
        </div>
        {available ? (
          <InquiryForm b2bNotice={legalFor(locale).checkoutTextsFor(toLegalCompany()).b2bNotice} ownerEmail={company.email} product={product} topic={topic} />
        ) : (
          <div className="af-msg" data-kind="info" role="status">
            <h2 className="af-h3">{t("unavailableTitle")}</h2>
            <p>{t("unavailable")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
