import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { Gallery } from "@/components/product/Gallery";
import { PriceNote } from "@/components/product/PriceNote";
import { ProductCard } from "@/components/product/ProductCard";
import { company } from "@/config/company";
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
  const carrier = company.shippingCarrier ?? "";
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
            <Gallery shots={shots} />
            {product.restyled ? <p className="af-note">{t("product.restyledNote")}</p> : null}
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
              <p className="af-only">{t("product.customMsg")}</p>
            ) : null}

            <p className="af-text">{text.description}</p>

            {isSold ? (
              <Link className="af-cta-band" href={{ pathname: "/anfrage", query: { produkt: `${text.name}, ${text.subtitle}`, thema: "massanfertigung" } }}>
                {t("product.similar")} <Arrow />
              </Link>
            ) : (
              <AddToCart price={price} slug={product.slug} unique={unique} />
            )}

            <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { produkt: `${text.name}, ${text.subtitle}`, thema: "beratung" } }} style={{ justifySelf: "start" }}>
              {t("product.ask")}
            </Link>

            <div className="af-assure">
              <span>
                <b>{t("product.assureConfirmTitle")}</b> {t("product.assureConfirm")}
              </span>
              <span>
                <b>{t("product.assureShipTitle", { carrier })}</b> {t("product.assureShip")}
              </span>
              <span>
                <b>{t("product.assureColorTitle")}</b> {t("product.assureColor")}
              </span>
            </div>

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

            {product.category === "pflege" ? (
              <section aria-labelledby="safety-title" className="af-safety">
                <h2 id="safety-title">{t("product.safetyTitle")}</h2>
                <p className="af-note">{product.safety ?? t("product.safetyPending")}</p>
              </section>
            ) : null}
          </div>
        </div>

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
    </main>
  );
}
