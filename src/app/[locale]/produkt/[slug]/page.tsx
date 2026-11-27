import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { CustomStrip } from "@/components/product/CustomStrip";
import { ProductCopyBlock } from "@/components/product/ProductCopyBlock";
import { SpecChips } from "@/components/product/SpecChips";
import { Gallery, type GalleryShot } from "@/components/product/Gallery";
import { AskWhatsApp } from "@/components/pdp/AskWhatsApp";
import { Assurance, BenefitList, ColorRow, ColorsBand, TechniqueSpotlight } from "@/components/pdp/PdpBlocks";
import { MicroHelpers } from "@/components/pdp/MicroHelpers";
import { PartingCompass } from "@/components/pdp/PartingCompass";
import { ReturnPreview } from "@/components/pdp/ReturnPreview";
import { ShareButton } from "@/components/pdp/ShareButton";
import { WeightCompare } from "@/components/pdp/WeightCompare";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { TrustFacts } from "@/components/product/TrustFacts";
import { ViewTracker } from "@/components/product/ViewTracker";
import { WishlistButton } from "@/components/product/WishlistButton";
import { PriceNote } from "@/components/product/PriceNote";
import { ProductCard } from "@/components/product/ProductCard";
import { company } from "@/config/company";
import { deliveryParams } from "@/config/shipping";
import { unitText } from "@/components/cart/unitText";
import { byCategory, galleryImages, getProduct, imageKindOf, isUnique, productCopy, productText, unitInfo } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { formatPrice } from "@/lib/money";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { methodOf } from "@/lib/collection";
import { parseBaseCm, parseLengthCm } from "@/lib/units";
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
  const kind = imageKindOf(product);
  // Rohfotos nur dort, wo es keine bearbeiteten Bilder gibt; kuratierte Atelierfotos und Filme bleiben
  const gallery = galleryImages(product).filter((item, _, all) => item.kind !== "original" || !all.some((x) => x.kind === "studio"));
  const images = gallery.filter((item) => item.kind !== "video").map((item) => item.src);
  const name = { name: text.name, subtitle: text.subtitle };
  const counters = { atelier: 0, original: 0, studio: 0 };
  const shots: GalleryShot[] = gallery.map((item, index) => {
    const label = t("product.showImage", { index: index + 1, total: gallery.length });
    if (item.kind === "video") return { alt: t("product.filmAlt", name), caption: t("product.captionFilm"), label, src: item.src, video: { poster: item.poster ?? product.image } };
    if (item.kind === "atelier") return { alt: t("product.atelierAlt", { ...name, index: ++counters.atelier }), caption: t("product.captionAtelier"), label, src: item.src };
    if (item.kind === "original") return { alt: t("product.originalAlt", { ...name, index: ++counters.original }), label, src: item.src };
    return {
      alt: t(kind === "staged" ? "product.imageAltStaged" : "product.imageAlt", { ...name, index: ++counters.studio }),
      caption: kind ? t(kind === "staged" ? "product.imageNoteStaged" : "product.imageNoteRelit") : undefined,
      label,
      src: item.src,
    };
  });
  const copy = productCopy(product, locale);
  const available = (item: { slug: string; sold: boolean }) => !item.sold && !sold.has(item.slug);
  const isExtension = product.category === "extensions";
  const more = byCategory(product.category)
    .filter((item) => item.slug !== product.slug && available(item))
    .slice(0, 4);
  // Zubehör: nur vorhandene Katalogprodukte der Kategorie Pflege
  const accessories = isExtension ? byCategory("pflege").filter(available).slice(0, 4) : [];
  const delivery = deliveryParams();
  const hasNano = product.specs.some((spec) => spec.startsWith("Nano-Skin"));
  const hasClips = product.specs.includes("Befestigung mit Clips");
  const hair = product.category !== "pflege";
  // Eigene Fragen zum Stück ersetzen die allgemeinen; Widerruf und Zahlung stehen immer dabei.
  const ownFaq = copy?.faq ?? [];
  const objections = [
    ...ownFaq,
    ...(ownFaq.length === 0 && hasNano ? [{ a: t("objections.visibleA"), q: t("objections.visibleQ") }] : []),
    ...(ownFaq.length === 0 && hair ? [{ a: t("objections.colorA"), q: t("objections.colorQ") }] : []),
    ...(ownFaq.length === 0 && hair ? [{ a: hasClips ? t("objections.holdClips") : t("objections.holdOther"), q: t("objections.holdQ") }] : []),
    ...(ownFaq.length === 0 && hair ? [{ a: product.base ? t("objections.fitBase", { base: product.base }) : t("objections.fitNoBase"), q: t("objections.fitQ") }] : []),
    ...(isExtension ? [{ a: t("objections.packA"), q: t("objections.packQ") }] : []),
    { a: t("objections.returnA"), q: t("objections.returnQ") },
    { a: t("objections.payA"), q: t("objections.payQ") },
  ];
  const base = siteUrl();
  const pageUrl = `${base}/${locale}/produkt/${product.slug}`;
  // Rechenbeispiel Tageswert nur für Haarteile und Systeme (Modul 12), ohne Maßanfertigung
  const showDaily = ["topper", "peruecken", "pony", "maenner"].includes(product.category) && !product.madeToOrder && !isSold;
  const perDay = formatPrice(Math.round(product.priceCents / 730), locale);
  const lengthCm = hair && !isExtension ? parseLengthCm(product.length) : null;
  const baseCm = hair && !isExtension ? parseBaseCm(product.base) : null;
  const method = methodOf(product);
  // Detailaufnahme der Packung für „Die Technik dahinter“
  const techImage = product.extraImages?.at(-1) ?? product.secondImage ?? null;
  const otherPacks = isExtension ? byCategory("extensions").filter((item) => item.slug !== product.slug && available(item)).map((item) => item.image) : [];

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
    <main className="af-page af-page--zoned" data-zone="light">
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
            <Gallery
              labels={{
                close: t("product.zoomClose"),
                film: t("pdp.film"),
                hint: t("product.zoomHint"),
                loupe: hair ? t("pdp.loupe") : undefined,
                loupeOff: t("pdp.loupeOff"),
                next: t("pdp.next"),
                pause: t("pdp.pause"),
                play: t("pdp.play"),
                prev: t("pdp.prev"),
                zoom: t("product.zoom"),
              }}
              shots={shots}
            />
          </div>

          <div className="af-pdp__info af-zone-light">
            <div>
              <p className="af-mono">
                {t(`categories.${product.category}.label`)}
                {method ? <span className="pdp-method"> · {t(`ext.methods.${method}.name`)}</span> : null}
              </p>
              <h1 className="af-h2" style={{ marginTop: 14 }}>
                {text.name}
              </h1>
              <p className="af-lead" style={{ marginTop: 10 }}>
                {text.subtitle}
              </p>
              {product.manufacturer === "atelier" ? <p className="af-handmade">{t("product.handmade", { city: company.address.city })}</p> : null}
              {copy?.headline ? <p className="af-headline">{copy.headline}</p> : null}
            </div>

            <div className="af-pdp__price">
              {price}
              <PriceNote locale={locale} unit={unitInfo(product)} />
            </div>
            {showDaily ? <p className="af-note af-daily">{t("pdp.daily", { perDay, price })}</p> : null}

            <SpecChips locale={locale} product={product} />
            {hair ? <ColorRow isExtension={isExtension} locale={locale} product={product} text={text} /> : null}
            {hair && !isExtension ? <MicroHelpers base={baseCm} clips={hasClips} lengthCm={lengthCm} /> : null}

            {isSold ? (
              <p className="af-msg">{t("product.soldMsg")}</p>
            ) : unique ? (
              <p className="af-only">{t("product.uniqueMsg")}</p>
            ) : product.madeToOrder ? (
              <p className="af-only">{t("product.customMsg", delivery)}</p>
            ) : null}

            <p className="af-text pdp-story">{copy?.story ?? text.description}</p>
            {copy?.benefits?.length ? <BenefitList benefits={copy.benefits} locale={locale} /> : null}

            {isSold ? (
              <Link className="af-cta-band af-glass af-glass--gold" href={{ pathname: "/anfrage", query: { produkt: `${text.name}, ${text.subtitle}`, thema: "massanfertigung" } }}>
                {t("product.similar")} <Arrow />
              </Link>
            ) : (
              <div className="af-buyrow" id="buy-anchor">
                <AddToCart price={price} slug={product.slug} unique={unique} />
                <Assurance locale={locale} madeToOrder={product.madeToOrder} />
              </div>
            )}

            <div className="af-consult">
              <h2 className="af-mono">{t("product.consultTitle")}</h2>
              <p className="af-text">{t(isExtension ? "product.consultExtensions" : "product.consultText")}</p>
              <div className="af-pdp__secondary">
                <WishlistButton slug={product.slug} />
                {company.social.whatsapp ? (
                  <AskWhatsApp
                    ctx={{ base: product.base || null, length: product.length ? `${product.length} cm` : null, name: text.name, price, subtitle: text.subtitle, url: pageUrl }}
                    phoneHref={company.phoneHref}
                  />
                ) : null}
                <ShareButton name={text.name} url={pageUrl} />
              </div>
              {company.social.whatsapp ? null : (
                <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { produkt: `${text.name}, ${text.subtitle}`, thema: "beratung" } }} style={{ justifySelf: "start" }}>
                  {t("product.ask")}
                </Link>
              )}
            </div>

            <section aria-labelledby="specs-title">
              <h2 className="af-sr" id="specs-title">
                {t("product.specs")}
              </h2>
              {isExtension ? null : (
                <ul className="af-specs">
                  {text.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              )}
              {product.manufacturer === "atelier" ? (
                <p className="af-note">
                  {t("product.manufacturer", {
                    address: `${company.address.street}, ${company.address.postalCode} ${company.address.city}`,
                    email: company.email,
                    name: company.ownerFullName ?? company.brandName,
                  })}
                </p>
              ) : null}
            </section>

            <section aria-labelledby="faq-title" className="af-faq af-faq--compact">
              <h2 className="af-h3" id="faq-title">
                {t("objections.title")}
              </h2>
              {copy ? <ProductCopyBlock copy={copy} locale={locale} /> : null}
              <details>
                <summary>
                  <h3 className="af-faq__q">{t("pdp.trustFold")}</h3>
                  <i aria-hidden="true" />
                </summary>
                <TrustFacts compact locale={locale} />
                {hair ? <ReturnPreview madeToOrder={product.madeToOrder} /> : null}
              </details>
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
      </div>
      <div className="af-zone-light af-zone-fade-top af-zone-band af-pdp__after">
        <div className="af-wrap">
          {isExtension && method ? <TechniqueSpotlight image={techImage} locale={locale} method={method} /> : null}
          {isExtension ? <ColorsBand images={otherPacks} locale={locale} product={`${text.name}, ${text.subtitle}`} /> : null}
          {hair && !isExtension ? <PartingCompass extraAlt="" extraImage={null} /> : null}
          {product.netWeightGrams ? <WeightCompare grams={product.netWeightGrams} locale={locale} /> : null}
          {hair && !isExtension ? <CustomStrip product={`${text.name}, ${text.subtitle}`} /> : null}
          <RecentlyViewed exclude={product.slug} />
          {more.length > 0 ? (
            <section aria-labelledby="more-title" className="af-section af-section--tight" style={{ paddingBottom: 0 }}>
              <h2 className="af-h2" id="more-title">
                {t(isExtension ? "product.moreExtensions" : "product.more")}
              </h2>
              <div className="af-grid">
                {more.map((item) => (
                  <ProductCard key={item.slug} locale={locale} product={item} />
                ))}
              </div>
            </section>
          ) : null}
          {accessories.length > 0 ? (
            <section aria-labelledby="acc-title" className="af-section af-section--tight" style={{ paddingBottom: 0 }}>
              <h2 className="af-h2" id="acc-title">
                {t("product.accessories")}
              </h2>
              <p className="af-note" style={{ marginTop: 12 }}>
                {t("product.accessoriesNote")}
              </p>
              <div className="af-grid">
                {accessories.map((item) => (
                  <ProductCard key={item.slug} locale={locale} product={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
      {!isSold ? <StickyBuyBar available name={text.name} price={price} slug={product.slug} unique={unique} unitLine={unitInfo(product) ? unitText(t, unitInfo(product)!, locale) : undefined} /> : null}
    </main>
  );
}
