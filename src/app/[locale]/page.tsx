import Image, { getImageProps } from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { Arrow } from "@/components/Arrow";
import { FieldMount } from "@/components/fx/FieldMount";
import { Finder } from "@/components/home/Finder";
import { Hero } from "@/components/home/Hero";
import { Ribbon } from "@/components/home/scenes/Ribbon";
import { JsonLd } from "@/components/JsonLd";
import { Logo } from "@/components/Logo";
import { ProductCard } from "@/components/product/ProductCard";
import { company } from "@/config/company";
import { byCategory, CATEGORY_IDS, featured, INQUIRY_ONLY_CATEGORIES } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { organizationJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

import "@/styles/home.css";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ description: t("defaultDescription"), locale: locale as Locale, path: "/", title: t("defaultTitle") });
}

const methods = ["Butterfly Weft", "Genius Weft", "Invisible Tape", "Tape-In", "Keratin Bondings", "Clip-In"];

const chapters = ["01", "02", "03"].map((chapter, index) => {
  const base = `/assets/world/scene-${chapter}`;
  const common = { alt: "", sizes: "100vw" };
  const img = getImageProps({
    ...common,
    fetchPriority: index === 0 ? "high" : "low",
    height: 1080,
    src: `${base}-poster.jpg`,
    width: 1920,
  }).props;
  const mobile = getImageProps({ ...common, height: 720, src: `${base}-mobile-poster.jpg`, width: 1280 }).props;
  return {
    poster: { img, mobileSrcSet: mobile.srcSet ?? mobile.src },
    video: { desktop: `${base}.mp4`, mobile: `${base}-mobile.mp4` },
  };
});

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const sold = await soldSlugs();
  const carrier = company.shippingCarrier ?? "";

  const facts = [1, 2, 3, 4].map((n) => ({ big: t(`home.fact${n}Big`), text: t(`home.fact${n}`) }));
  const craft = [1, 2, 3, 4].map((n) => ({ key: t(`home.craft${n}Key`), text: t(`home.craft${n}`) }));
  const steps = [1, 2, 3].map((n) => ({ text: t(`home.step${n}`, { carrier }), title: t(`home.step${n}Title`) }));
  const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({ a: t(`home.faq${n}A`, { carrier }), q: t(`home.faq${n}Q`) }));

  const tabs = CATEGORY_IDS.filter((id) => !INQUIRY_ONLY_CATEGORIES.includes(id)).map((id) => {
      const picks = byCategory(id)
        .filter((product) => !product.sold && !sold.has(product.slug))
        .slice(0, 4);
      return {
        id,
        label: t(`categories.${id}.need`),
        panel: (
          <>
            <div className="af-finder__head">
              <p className="af-text">{t(`categories.${id}.caption`)}</p>
              <Link className="af-cta-line" href={{ pathname: "/kollektion", query: { kategorie: id } }}>
                {t("home.finderAll", { category: t(`categories.${id}.label`) })} <Arrow />
              </Link>
            </div>
            {picks.length ? (
              <div className="af-grid">
                {picks.map((product) => (
                  <ProductCard key={product.slug} locale={locale} product={product} />
                ))}
              </div>
            ) : (
              <p className="af-lead" style={{ marginTop: 32 }}>
                {t("home.finderEmpty")}
              </p>
            )}
          </>
        ),
      };
    });

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", acceptedAnswer: { "@type": "Answer", text: faq.a }, name: faq.q })),
  };

  return (
    <main>
      <JsonLd data={organizationJsonLd(locale)} />
      <JsonLd data={faqJson} />
      <FieldMount />
      <Hero
        posters={chapters.map(({ poster }) => poster)}
        videos={chapters.map(({ video }) => video)}
        texts={{
          chapters: t("hero.chapters"),
          ctaCollection: t("hero.ctaCollection"),
          ctaConsult: t("hero.ctaConsult"),
          ctaConsultVia: t("hero.ctaConsultVia"),
          filmAlt: t("hero.filmAlt"),
          kicker: t("hero.kicker"),
          labels: [t("hero.ember"), t("hero.light"), t("hero.hair")],
          lead: t("hero.lead"),
          lines: [t("hero.line1"), t("hero.line2"), t("hero.line3")],
          pause: t("hero.pause"),
          play: t("hero.play"),
          replay: t("hero.replay"),
          whatsappNote: t("common.newTab"),
        }}
        whatsapp={company.social.whatsapp}
      />
      <Ribbon
        items={[t("home.ribbon.hair"), t("home.ribbon.atelier"), t("home.ribbon.unique"), t("home.ribbon.consultation")]}
        label={t("home.ribbon.label")}
      />

      <section aria-label={t("home.factsLabel")} className="af-section--tight">
        <div className="af-wrap af-facts">
          {facts.map((fact) => (
            <div className="af-fact af-rise" key={fact.big}>
              <strong>{fact.big}</strong>
              <span>{fact.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="finden-title" className="af-section" id="finden">
        <div className="af-wrap">
          <div className="af-stack af-rise">
            <h2 className="af-h2" id="finden-title">
              {t("home.finderTitle")}
            </h2>
            <p className="af-lead">{t("home.finderLead")}</p>
          </div>
          <Finder label={t("home.finderTabs")} tabs={tabs} />
        </div>
      </section>

      <section aria-labelledby="handwerk-title" className="af-section af-surface" id="handwerk">
        <div className="af-wrap af-split">
          <div className="af-split__media af-rise">
            <Image alt={t("home.craftImageAlt")} height={1194} sizes="(max-width: 900px) 100vw, 640px" src="/assets/content/craft.jpg" width={1600} />
          </div>
          <div className="af-rise">
            <p className="af-mono">{t("home.craftKicker")}</p>
            <h2 className="af-h2" id="handwerk-title" style={{ marginTop: 18 }}>
              {t("home.craftTitle")}
            </h2>
            <p className="af-lead" style={{ marginTop: 22 }}>
              {t("home.craftLead")}
            </p>
            <dl className="af-list">
              {craft.map((item) => (
                <div className="af-list__row" key={item.key}>
                  <dt>{item.key}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="atelier-title" className="af-section">
        <div className="af-wrap">
          <div className="af-finder__head" style={{ marginTop: 0 }}>
            <div className="af-stack af-rise">
              <h2 className="af-h2" id="atelier-title">
                {t("home.atelierTitle")}
              </h2>
              <p className="af-lead">{t("home.atelierLead")}</p>
            </div>
            <Link className="af-cta-line" href="/kollektion">
              {t("home.atelierAll")} <Arrow />
            </Link>
          </div>
          <div className="af-grid">
            {featured.map((product) => (
              <ProductCard key={product.slug} locale={locale} product={product} sold={sold.has(product.slug)} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="geschichte-title" className="af-phoenix" id="geschichte">
        <div aria-hidden="true" className="af-phoenix__bg">
          <Image alt="" height={1158} sizes="100vw" src="/assets/content/phoenix.jpg" width={2048} />
        </div>
        <div className="af-wrap af-phoenix__in">
          <Logo label={t("logo.markAlt")} size={84} variant="mark" />
          <h2 className="af-h2" id="geschichte-title">
            {t("home.phoenixTitle")}
          </h2>
          <p className="af-lead">{t("home.phoenixLead")}</p>
          <figure style={{ margin: 0 }}>
            <blockquote className="af-quote">{t("home.phoenixQuote")}</blockquote>
            <figcaption className="af-quote-by" style={{ marginTop: 18 }}>
              {t("home.phoenixBy")}
            </figcaption>
          </figure>
          <p className="af-lead">{t("home.phoenixOutro")}</p>
        </div>
      </section>

      <section aria-labelledby="extensions-title" className="af-section af-surface" id="extensions">
        <div className="af-wrap af-split af-split--flip">
          <div className="af-rise">
            <p className="af-mono">{t("home.extKicker")}</p>
            <h2 className="af-h2" id="extensions-title" style={{ marginTop: 18 }}>
              {t("home.extTitle")}
            </h2>
            <p className="af-lead" style={{ marginTop: 22 }}>
              {t("home.extLead")}
            </p>
            <ul aria-label={t("home.extMethods")} className="af-methods">
              {methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
            <div className="af-hero-actions" style={{ marginTop: 34 }}>
              <Link className="af-cta-gold" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
                {t("home.extCta")} <Arrow />
              </Link>
            </div>
          </div>
          <div className="af-split__media af-rise">
            <Image alt={t("home.extImageAlt")} height={1194} sizes="(max-width: 900px) 100vw, 640px" src="/assets/content/extensions.jpg" width={1600} />
          </div>
        </div>
      </section>

      <section aria-labelledby="schritte-title" className="af-section">
        <div className="af-wrap">
          <div className="af-stack af-rise">
            <h2 className="af-h2" id="schritte-title">
              {t("home.stepsTitle")}
            </h2>
            <p className="af-lead">{t("home.stepsLead")}</p>
          </div>
          <ol className="af-steps">
            {steps.map((step) => (
              <li className="af-step af-rise" key={step.title}>
                <h3 className="af-h3">{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="fragen-title" className="af-section af-surface" id="fragen">
        <div className="af-wrap">
          <h2 className="af-h2 af-rise" id="fragen-title">
            {t("home.faqTitle")}
          </h2>
          <div className="af-faq">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>
                  <h3 className="af-faq__q">{faq.q}</h3>
                  <i aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="spiegel-title" className="af-section">
        <div className="af-wrap">
          <div className="af-close af-rise">
            <Image alt={t("home.closeImageAlt")} height={1194} sizes="(max-width: 1240px) 100vw, 1240px" src="/assets/content/mirror.jpg" width={1600} />
            <div className="af-close__in">
              <h2 className="af-h1" id="spiegel-title">
                {t("home.closeTitle")}
              </h2>
              <p className="af-lead">{t("home.closeLead")}</p>
              <div className="af-hero-actions">
                <Link className="af-cta-gold" href="/kollektion">
                  {t("hero.ctaCollection")} <Arrow />
                </Link>
                <Link className="af-cta-line" href="/anfrage">
                  {t("hero.ctaConsult")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
