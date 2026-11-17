import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { CompareSlider } from "@/components/product/CompareSlider";
import { Gallery } from "@/components/product/Gallery";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { TrustFacts } from "@/components/product/TrustFacts";
import { ViewTracker } from "@/components/product/ViewTracker";
import { WishlistButton } from "@/components/product/WishlistButton";
import { PriceNote } from "@/components/product/PriceNote";
import { ProductCard } from "@/components/product/ProductCard";
import { company } from "@/config/company";
import { deliveryParams } from "@/config/shipping";
import { byCategory, getProduct, isUnique, productText } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { formatPrice } from "@/lib/money";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

export async function generateMetadata({ params }: PageProps<"/[locale]/produkt/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const text = productText(product, locale as Locale);
  return pageMetadata({
    description: text.description,
    image: product.image,
    locale: locale as Locale,
    path: `/produkt/${product.slug}`,
    title: `${text.name}, ${text.subtitle}`,
  });
}

export default async function ProductPage({ params }: PageProps<"/[locale]/produkt/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations({ locale });
  const text = productText(product, locale);
  const sold = await soldSlugs();
  const isSold = product.sold || sold.has(product.slug);
  const unique = isUnique(product);
  const price = formatPrice(product.priceCents, locale);
  const images = product.restyled ? [product.image, ...product.originals] : product.originals.length ? product.originals : [product.image];
  const shots = images.map((src, index) => ({
    alt:
      product.restyled && index === 0
        ? t("product.imageAlt", { name: text.name, subtitle: text.subtitle })
        : t("product.originalAlt", { index: product.restyled ? index : index + 1, name: text.name, subtitle: text.subtitle }),
    label: t("product.showImage", { index: index + 1, total: images.length }),
    src,
  }));
  const more = byCategory(product.category)
    .filter((item) => item.slug !== product.slug && !item.sold && !sold.has(item.slug))
    .slice(0, 4);
  const delivery = deliveryParams();
  const hasNano = product.specs.some((spec) => spec.startsWith("Nano-Skin"));
  const hasClips = product.specs.includes("Befestigung mit Clips");
  const hair = product.category !== "pflege";
  const objections = [
    ...(hasNano ? [{ a: t("objections.visibleA"), q: t("objections.visibleQ") }] : []),
    ...(hair ? [{ a: t("objections.colorA"), q: t("objections.colorQ") }] : []),
    ...(hair ? [{ a: hasClips ? t("objections.holdClips") : t("objections.holdOther"), q: t("objections.holdQ") }] : []),
    ...(hair ? [{ a: product.base ? t("objections.fitBase", { base: product.base }) : t("objections.fitNoBase"), q: t("objections.fitQ") }] : []),
    ...(hair ? [{ a: t("objections.careA"), q: t("objections.careQ") }] : []),
    { a: t("objections.returnA"), q: t("objections.returnQ") },
    { a: t("objections.payA"), q: t("objections.payQ") },
  ];
  const base = siteUrl();

  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: { "@type": "Brand", name: company.brandName },
    category: t(`categories.${product.category}.label`),
    description: text.description,
    image: images.map((src) => `${base}${src}`),
    name: `${text.name}, ${text.subtitle}`,
    offers: {
      "@type": "Offer",
      availability: isSold ? "https://schema.org/SoldOut" : product.madeToOrder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      seller: { "@type": "Organization", name: company.brandName },
      url: `${base}/${locale}/produkt/${product.slug}`,
    },
    sku: String(product.id),
  };

  return (
    <main className="af-page">
      <JsonLd data={productJson} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("common.home"), path: `/${locale}` },
          { name: t("collection.title"), path: `/${locale}/kollektion` },
          { name: t(`categories.${product.category}.label`), path: `/${locale}/kollektion?kategorie=${product.category}` },
          { name: text.name, path: `/${locale}/produkt/${product.slug}` },
        ])}
      />
      <ViewTracker slug={product.slug} />
      <div className="af-wrap">
        <nav aria-label={t("common.breadcrumb")} className="af-crumb">
          <ol>
            <li>
              <Link href="/kollektion">{t("collection.title")}</Link>
            </li>
            <li>
              <Link href={{ pathname: "/kollektion", query: { kategorie: product.category } }}>{t(`categories.${product.category}.label`)}</Link>
            </li>
            <li aria-current="page">{text.name}</li>
          </ol>
        </nav>

        <div className="af-pdp">
          <div className="af-pdp__gallery">
            <Gallery closeLabel={t("product.zoomClose")} hint={t("product.zoomHint")} shots={shots} zoomLabel={t("product.zoom")} />
            {product.restyled && product.originals[0] ? (
              <section aria-labelledby="compare-title" className="af-stack" style={{ "--gap": "12px" } as React.CSSProperties}>
                <h2 className="af-mono" id="compare-title">
                  {t("product.compareTitle")}
                </h2>
                <CompareSlider
                  label={t("product.compareLabel")}
                  original={product.originals[0]}
                  originalLabel={t("product.compareOriginal")}
                  studio={product.image}
                  studioLabel={t("product.compareStudio")}
                />
                <p className="af-note">{t("product.compareNote")}</p>
              </section>
            ) : null}
          </div>

          <div className="af-pdp__info">
            <div>
              <p className="af-mono">{t(`categories.${product.category}.label`)}</p>
              <h1 className="af-h2" style={{ marginTop: 14 }}>
                {text.name}
              </h1>
              <p className="af-lead" style={{ marginTop: 10 }}>
                {text.subtitle}
              </p>
            </div>

            <div className="af-pdp__price">
              {price}
              <PriceNote locale={locale} />
            </div>

            {isSold ? (
              <p className="af-msg">{t("product.soldMsg")}</p>
            ) : unique ? (
              <p className="af-only">{t("product.uniqueMsg")}</p>
            ) : product.madeToOrder ? (
              <p className="af-only">{t("product.customMsg", delivery)}</p>
            ) : null}
            {!isSold && product.availability === "unknown" ? <p className="af-note">{t("product.availabilityUnknown")}</p> : null}
            {product.origin === "Brasilien" ? <p className="af-note af-gold">{t("product.originBrazil")}</p> : null}

            <p className="af-text">{text.description}</p>

            {isSold ? (
              <Link className="af-cta-band" href={{ pathname: "/anfrage", query: { produkt: `${text.name}, ${text.subtitle}`, thema: "massanfertigung" } }}>
                {t("product.similar")} <Arrow />
              </Link>
            ) : (
              <div className="af-buyrow" id="buy-anchor">
                <AddToCart price={price} slug={product.slug} unique={unique} />
              </div>
            )}
            <div className="af-pdp__secondary">
              <WishlistButton slug={product.slug} />
              {company.social.whatsapp ? (
                <a className="af-chip" href={company.social.whatsapp} rel="noopener noreferrer" target="_blank">
                  <span>{t("product.askWhatsapp")}</span>
                  <span className="af-sr"> {t("common.newTab")}</span>
                </a>
              ) : null}
            </div>

            <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { produkt: `${text.name}, ${text.subtitle}`, thema: "beratung" } }} style={{ justifySelf: "start" }}>
              {t("product.ask")}
            </Link>

            <TrustFacts locale={locale} />

            <section aria-labelledby="specs-title">
              <h2 className="af-sr" id="specs-title">
                {t("product.specs")}
              </h2>
              <ul className="af-specs">
                {text.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="faq-title" className="af-faq af-faq--compact">
              <h2 className="af-h3" id="faq-title">
                {t("objections.title")}
              </h2>
              {objections.map((item) => (
                <details key={item.q}>
                  <summary>
                    <h3 className="af-faq__q">{item.q}</h3>
                    <i aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </section>

            {product.category === "pflege" ? (
              <section aria-labelledby="safety-title" className="af-safety">
                <h2 id="safety-title">{t("product.safetyTitle")}</h2>
                <p className="af-note">{product.safety ?? t("product.safetyPending")}</p>
              </section>
            ) : null}
          </div>
        </div>

        <RecentlyViewed exclude={product.slug} />
        {more.length > 0 ? (
          <section aria-labelledby="more-title" className="af-section" style={{ paddingBottom: 0 }}>
            <h2 className="af-h2" id="more-title">
              {t("product.more")}
            </h2>
            <div className="af-grid">
              {more.map((item) => (
                <ProductCard key={item.slug} locale={locale} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      {!isSold ? <StickyBuyBar available name={text.name} price={price} slug={product.slug} unique={unique} /> : null}
    </main>
  );
}
