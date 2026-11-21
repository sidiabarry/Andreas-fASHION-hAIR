import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { company } from "@/config/company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { organizationJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/kontakt">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ description: t("metaDescription"), locale: locale as Locale, path: "/kontakt", title: t("metaTitle") });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/kontakt">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const day = (d: number) => t(`days.${d}` as "days.1");
  return (
    <main className="af-page af-zone-light" data-zone="light">
      <JsonLd data={organizationJsonLd(locale as Locale)} />
      <div className="af-wrap">
        <p className="af-mono">{t("contact.kicker")}</p>
        <h1 className="af-h1" style={{ marginTop: 18 }}>
          {t("contact.title")}
        </h1>
        <p className="af-lead" style={{ marginTop: 22 }}>
          {t("contact.lead")}
        </p>
        <div className="af-contact">
          <div>
            <h2>{t("contact.studio")}</h2>
            <address style={{ fontStyle: "normal" }}>
              {company.brandName}
              <br />
              {company.address.street}
              <br />
              {company.address.postalCode} {company.address.city}
              <br />
              {company.address.country}
            </address>
          </div>
          <div>
            <h2>{t("contact.phone")}</h2>
            <p style={{ margin: 0 }}>
              <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
            </p>
            <h2 style={{ marginTop: 22 }}>{t("contact.email")}</h2>
            <p style={{ margin: 0 }}>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            {company.social.whatsapp ? (
              <>
                <h2 style={{ marginTop: 22 }}>WhatsApp</h2>
                <p style={{ margin: 0 }}>
                  <a href={company.social.whatsapp} rel="noopener noreferrer" target="_blank">
                    {t("contact.whatsapp")}
                    <span className="af-sr"> {t("common.newTab")}</span>
                  </a>
                </p>
                <p className="af-note">{t("contact.whatsappNote")}</p>
              </>
            ) : null}
          </div>
          <div>
            <h2>{t("contact.hours")}</h2>
            <dl className="af-hours">
              {company.openingHours.map((h) => (
                <div key={h.days.join()} style={{ display: "contents" }}>
                  <dt>{h.days.length > 1 ? t("days.range", { from: day(h.days[0]), to: day(h.days[h.days.length - 1]) }) : day(h.days[0])}</dt>
                  <dd>{h.opens && h.closes ? `${h.opens}–${h.closes}` : t("contact.closed")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <section aria-labelledby="write-title" className="af-review" style={{ marginTop: 44 }}>
          <h2 className="af-h3" id="write-title">
            {t("contact.formTitle")}
          </h2>
          <p className="af-text">{t("contact.formLead")}</p>
          <Link className="af-cta-gold af-glass af-glass--gold" href="/anfrage" style={{ justifySelf: "start" }}>
            {t("contact.formCta")} <Arrow />
          </Link>
        </section>
      </div>
    </main>
  );
}
