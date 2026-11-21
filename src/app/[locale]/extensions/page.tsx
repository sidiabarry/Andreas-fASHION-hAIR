import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { CustomStrip } from "@/components/product/CustomStrip";
import { ExtensionsInquiry } from "@/components/product/ExtensionsInquiry";
import { ProductCard } from "@/components/product/ProductCard";
import { company } from "@/config/company";
import { byCategory } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { colorGroupOf, COLOR_GROUP_IDS, facetCounts, METHOD_IDS, methodOf } from "@/lib/collection";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

export async function generateMetadata({ params }: PageProps<"/[locale]/extensions">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "extensions" });
  return pageMetadata({ description: t("heroLead"), locale: locale as Locale, path: "/extensions", title: t("metaTitle") });
}

export default async function ExtensionsPage({ params }: PageProps<"/[locale]/extensions">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const sold = await soldSlugs();
  const packs = byCategory("extensions").filter((p) => !p.sold && !sold.has(p.slug));
  const colors = facetCounts(packs, COLOR_GROUP_IDS, colorGroupOf);

  return (
    <main className="af-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("common.home"), path: `/${locale}` },
          { name: t("extensions.title"), path: `/${locale}/extensions` },
        ])}
      />
      <div className="af-wrap">
        <header className="af-hub__hero">
          <p className="af-mono">{t("extensions.title")}</p>
          <h1 className="af-h1">{t("extensions.heroTitle")}</h1>
          <p className="af-lead">{t("extensions.heroLead")}</p>
          <div className="af-hub__cta">
            <a className="af-cta-gold af-glass af-glass--gold" href="#packungen">
              {t("extensions.shopCta")} <Arrow />
            </a>
            <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
              {t("extensions.adviceCta")}
            </Link>
          </div>
          <ul className="af-hub__facts">
            <li>{t("trust.atelier", { city: company.address.city })}</li>
            <li>{t("trust.payLater")}</li>
          </ul>
        </header>

        <section aria-labelledby="methods-title" className="af-hub__section">
          <h2 className="af-h2" id="methods-title">
            {t("extensions.methodsTitle")}
          </h2>
          <p className="af-lead">{t("extensions.methodsLead")}</p>
          <ul className="af-hubmethods">
            {METHOD_IDS.map((m) => {
              const count = packs.filter((p) => methodOf(p) === m).length;
              return (
                <li className="af-hubmethod" key={m}>
                  <h3 className="af-h3">{t(`extensions.${m}`)}</h3>
                  <p className="af-text">{t(`extensions.${m}Text`)}</p>
                  {count > 0 ? (
                    <Link className="af-cta-line" href={{ pathname: "/kollektion", query: { kategorie: "extensions", methode: m } }}>
                      {t("extensions.inShop", { count })} <Arrow />
                    </Link>
                  ) : (
                    <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
                      {t("extensions.onRequest")} <Arrow />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="color-title" className="af-hub__section af-hub__split">
          <div className="af-stack">
            <h2 className="af-h2" id="color-title">
              {t("extensions.colorTitle")}
            </h2>
            <p className="af-lead">{t("extensions.colorLead")}</p>
            {colors.length > 1 ? (
              <ul aria-label={t("collection.byColor")} className="af-facet__opts">
                {colors.map((c) => (
                  <li key={c.id}>
                    <Link className="af-pill" href={{ pathname: "/kollektion", query: { farbe: c.id, kategorie: "extensions" } }}>
                      {t(`collection.colors.${c.id}`)} <i>{c.count}</i>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <ol className="af-hubsteps">
            {(["light", "photo", "answer"] as const).map((step) => (
              <li key={step}>
                <b>{t(`extensions.colorSteps.${step}.title`)}</b>
                <span>{t(`extensions.colorSteps.${step}.text`)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pack-title" className="af-hub__section">
          <div className="af-consultcard">
            <div className="af-stack">
              <p className="af-mono">{t("extensions.packKicker")}</p>
              <h2 className="af-h2" id="pack-title">
                {t("extensions.packTitle")}
              </h2>
              <p className="af-lead">{t("extensions.packText")}</p>
            </div>
            <div className="af-consultcard__cta">
              {company.social.whatsapp ? (
                <a className="af-cta-gold af-glass af-glass--gold" href={company.social.whatsapp} rel="noopener noreferrer" target="_blank">
                  {t("extensions.packWhatsapp")} <span className="af-sr">{t("common.newTab")}</span>
                </a>
              ) : null}
              <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
                {t("extensions.packAsk")}
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="packs-title" className="af-hub__section" id="packungen">
          <h2 className="af-h2" id="packs-title">
            {t("extensions.productsTitle")}
          </h2>
          <div className="af-grid">
            {packs.map((product, index) => (
              <ProductCard key={product.slug} locale={locale} priority={index < 2} product={product} />
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link className="af-cta-line" href={{ pathname: "/kollektion", query: { kategorie: "extensions" } }}>
              {t("extensions.allPacks")} <Arrow />
            </Link>
          </p>
        </section>

        <div className="af-hub__section">
          <CustomStrip />
        </div>
        <div className="af-hub__section">
          <ExtensionsInquiry locale={locale} />
        </div>
      </div>
    </main>
  );
}
