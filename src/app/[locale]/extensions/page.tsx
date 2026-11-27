import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { MethodDiagram } from "@/components/extensions/MethodDiagram";
import { TechniqueFinder, type FinderMethod } from "@/components/extensions/TechniqueFinder";
import { AmbientVideo } from "@/components/fx/AmbientVideo";
import { CustomStrip } from "@/components/product/CustomStrip";
import { ExtensionsInquiry } from "@/components/product/ExtensionsInquiry";
import { ProductCard } from "@/components/product/ProductCard";
import { company } from "@/config/company";
import { byCategory, productText, unitInfo } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import { METHOD_FACTS, methodShowcases } from "@/data/methods";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import type { MethodId } from "@/lib/collection";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { formatPrice } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

import "@/components/extensions/extensions.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/extensions">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ext" });
  return pageMetadata({ description: t("metaDescription"), locale: locale as Locale, path: "/extensions", title: t("metaTitle") });
}

/** „Text *betont*“ → Text mit <em> (kursive Display-Schrift als Akzent). */
function emph(text: string): ReactNode[] {
  return text.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>));
}

const PROOF_ICONS = [
  // Strähne
  <path d="M12 3c-3 4-3 8 0 12s3 6 0 6M8 4c-2 4-2 7 0 11M16 4c2 4 2 7 0 11" key="hair" />,
  // Farbe/Kamera
  <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" key="cam" />,
  // Zahlung
  <path d="M3 6h18v12H3zM3 10h18M7 15h4" key="pay" />,
  // Farbfächer
  <path d="M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 21zM7.5 11h.01M10 7.5h.01M14 7.5h.01M16.5 11h.01" key="palette" />,
];

export default async function ExtensionsPage({ params }: PageProps<"/[locale]/extensions">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const sold = await soldSlugs();
  const available = (p: Product) => !p.sold && !sold.has(p.slug);
  const packs = byCategory("extensions").filter(available);
  const showcases = methodShowcases(available);
  const inShop = showcases.filter((s) => s.products.length > 0).map((s) => s.id);
  const minPrice = packs.length ? Math.min(...packs.map((p) => p.priceCents)) : null;
  const whatsapp = company.social.whatsapp;
  const m = (id: MethodId, key: string) => t(`ext.methods.${id}.${key}`);
  const list = (id: MethodId, key: string) => t.raw(`ext.methods.${id}.${key}`) as string[];
  const packsHref = (id: MethodId) => `/${locale}/kollektion?kategorie=extensions&methode=${id}`;

  // Hero: Film der Locken (echte Aufnahme) und zwei Detailkacheln
  const heroFilm = showcases.find((s) => s.film)?.film ?? null;
  const heroTiles = [showcases.find((s) => s.id === "butterfly"), showcases.find((s) => s.id === "invisible")].filter(
    (s): s is (typeof showcases)[number] => Boolean(s && !s.symbol),
  );

  const finderMethods: FinderMethod[] = showcases.map((s) => ({
    best: m(s.id, "best"),
    id: s.id,
    image: s.image,
    name: m(s.id, "name"),
    packsHref: s.products.length ? packsHref(s.id) : null,
    symbol: s.symbol,
    tagline: m(s.id, "tagline"),
  }));

  const faq = t.raw("ext.faq.items") as { q: string; a: string }[];
  const yes = t("ext.compare.yes");
  const no = t("ext.compare.no");
  const compareRows: { key: string; label: string; cell: (id: MethodId) => ReactNode }[] = [
    { cell: (id) => (METHOD_FACTS[id].self ? t("ext.compare.self") : t("ext.compare.pro")), key: "who", label: t("ext.compare.who") },
    { cell: (id) => m(id, "fix"), key: "fix", label: t("ext.compare.fix") },
    { cell: (id) => <Mark on={METHOD_FACTS[id].heat} text={METHOD_FACTS[id].heat ? yes : no} />, key: "heat", label: t("ext.compare.heat") },
    {
      cell: (id) => {
        const glue = METHOD_FACTS[id].glue;
        return <Mark on={glue !== "none"} text={glue === "none" ? no : glue === "tape" ? t("ext.compare.tape") : t("ext.compare.keratin")} />;
      },
      key: "glue",
      label: t("ext.compare.glue"),
    },
    { cell: (id) => <Mark good={METHOD_FACTS[id].daily} on={METHOD_FACTS[id].daily} text={METHOD_FACTS[id].daily ? yes : no} />, key: "daily", label: t("ext.compare.daily") },
    {
      cell: (id) => {
        const reuse = METHOD_FACTS[id].reuse;
        const text = reuse === "always" ? t("ext.compare.always") : reuse === "yes" ? yes : reuse === "newTape" ? t("ext.compare.newTape") : t("ext.compare.regrow");
        return <Mark good={reuse !== "regrow"} on={reuse !== "regrow"} text={text} />;
      },
      key: "reuse",
      label: t("ext.compare.reuse"),
    },
    { cell: (id) => m(id, "best"), key: "best", label: t("ext.compare.best") },
  ];

  return (
    <main className="af-page xe">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("common.home"), path: `/${locale}` },
          { name: t("extensions.title"), path: `/${locale}/extensions` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({ "@type": "Question", acceptedAnswer: { "@type": "Answer", text: item.a }, name: item.q })),
        }}
      />

      {/* 1 · Hero */}
      <section aria-labelledby="xe-title" className="xe-hero">
        <div className="af-wrap xe-hero__grid">
          <div className="xe-hero__copy">
            <p className="af-mono xe-kicker">{t("ext.hero.kicker")}</p>
            <h1 className="xe-display" id="xe-title">
              {emph(t("ext.hero.title"))}
            </h1>
            <p className="af-lead">{t("ext.hero.lead")}</p>
            <div className="xe-hero__cta">
              <a className="af-cta-gold af-glass af-glass--gold" href="#finder">
                {t("ext.hero.ctaFinder")} <Arrow />
              </a>
              <a className="af-cta-line" href="#packungen">
                {t("ext.hero.ctaShop")}
                {minPrice !== null ? <span className="xe-hero__from">{t("ext.hero.priceFrom", { price: formatPrice(minPrice, locale) })}</span> : null}
              </a>
            </div>
            <ul className="xe-proof">
              {(t.raw("ext.hero.proof") as string[]).map((item, i) => (
                <li key={item}>
                  <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" viewBox="0 0 24 24" width="20">
                    {PROOF_ICONS[i % PROOF_ICONS.length]}
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="xe-hero__stage">
            {heroFilm ? (
              <figure className="xe-hero__film">
                <Image alt="" fill priority sizes="(max-width: 900px) 70vw, 420px" src={heroFilm.poster} />
                <AmbientVideo desktop={heroFilm.src} mobile={heroFilm.src} />
                <figcaption>{t("ext.hero.filmLabel")}</figcaption>
              </figure>
            ) : null}
            {heroTiles.map((tile, i) => {
              const product = tile.products[0];
              const name = m(tile.id, "name");
              return (
                <Link aria-label={t("ext.hero.tileLabel", { name })} className={`xe-hero__tile xe-hero__tile--${i + 1}`} href={`/produkt/${product.slug}`} key={tile.id}>
                  <Image alt="" height={520} sizes="200px" src={tile.image} width={390} />
                  <span>
                    <b>{name}</b>
                    <i>{formatPrice(product.priceCents, locale)}</i>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2 · Navigator */}
      <section aria-labelledby="xe-nav-title" className="xe-section xe-navsec">
        <div className="af-wrap">
          <header className="xe-head">
            <p className="af-mono xe-kicker">{t("ext.nav.label")}</p>
            <h2 className="xe-h2" id="xe-nav-title">
              {emph(t("ext.nav.title"))}
            </h2>
            <p className="af-lead">{t("ext.nav.lead")}</p>
          </header>
        </div>

      </section>

      <div className="xe-scope">
          <nav aria-label={t("ext.nav.label")} className="xe-nav">
            <ol className="af-wrap xe-nav__list">
              {showcases.map((s, i) => (
                <li key={s.id}>
                  <a className="xe-nav__item" href={`#technik-${s.id}`}>
                    <span className="xe-nav__img">
                      <Image alt="" height={120} sizes="56px" src={s.image} width={90} />
                    </span>
                    <span className="xe-nav__txt">
                      <i>{String(i + 1).padStart(2, "0")}</i>
                      {m(s.id, "name")}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

      {/* 3 · Finder */}
      <section aria-labelledby="xe-finder-title" className="xe-section xe-findersec" id="finder">
        <div className="af-wrap xe-finder">
          <header className="xe-head xe-head--left">
            <p className="af-mono xe-kicker">{t("ext.finder.kicker")}</p>
            <h2 className="xe-h2" id="xe-finder-title">
              {emph(t("ext.finder.title"))}
            </h2>
            <p className="af-lead">{t("ext.finder.lead")}</p>
          </header>
          <TechniqueFinder
            confirmExternal={Boolean(whatsapp)}
            confirmHref={whatsapp ?? `/${locale}/anfrage?thema=extensions`}
            inShop={inShop}
            labels={{
              also: t("ext.finder.also"),
              back: t("ext.finder.back"),
              best: t("ext.finder.best"),
              bestLabel: t("ext.labels.best"),
              confirm: t("ext.finder.confirm"),
              questions: [
                { legend: t("ext.finder.q1"), options: [{ label: t("ext.finder.q1a"), value: "self" }, { label: t("ext.finder.q1b"), value: "pro" }] },
                {
                  legend: t("ext.finder.q2"),
                  options: [
                    { label: t("ext.finder.q2a"), value: "fine" },
                    { label: t("ext.finder.q2b"), value: "medium" },
                    { label: t("ext.finder.q2c"), value: "curly" },
                  ],
                },
                {
                  legend: t("ext.finder.q3"),
                  options: [
                    { label: t("ext.finder.q3a"), value: "occasion" },
                    { label: t("ext.finder.q3b"), value: "volume" },
                    { label: t("ext.finder.q3c"), value: "updo" },
                    { label: t("ext.finder.q3d"), value: "flat" },
                  ],
                },
              ],
              restart: t("ext.finder.restart"),
              resultLead: t("ext.finder.resultLead"),
              resultTitle: t("ext.finder.resultTitle"),
              selfNote: t("ext.finder.selfNote"),
              step: t.raw("ext.finder.step") as string,
              symbol: t("ext.labels.symbol"),
              toPacks: t("ext.finder.toPacks"),
              toTechnique: t("ext.finder.toTechnique"),
            }}
            methods={finderMethods}
          />
        </div>
      </section>

      {/* 4 · Techniken im Detail */}
      <div className="xe-chapters">
        {showcases.map((s, i) => {
          const name = m(s.id, "name");
          const products = s.products;
          return (
            <section aria-labelledby={`technik-${s.id}-title`} className="xe-ch" data-flip={i % 2 ? "" : undefined} id={`technik-${s.id}`} key={s.id}>
              <div className="af-wrap xe-ch__grid">
                <div className="xe-ch__media">
                  <figure className="xe-ch__main">
                    <Image alt={s.symbol ? `${name} (${t("ext.labels.symbol")})` : name} fill sizes="(max-width: 900px) 92vw, 46vw" src={s.image} />
                    {s.film ? <AmbientVideo className="xe-ch__film" desktop={s.film.src} mobile={s.film.src} /> : null}
                    {s.symbol ? <figcaption className="xe-ch__symbol">{t("ext.labels.symbol")}</figcaption> : null}
                    {s.film ? <figcaption className="xe-ch__symbol">{t("ext.labels.film")}</figcaption> : null}
                  </figure>
                  {s.detail ? (
                    <figure className="xe-ch__detail">
                      <Image alt="" fill sizes="220px" src={s.detail} />
                    </figure>
                  ) : null}
                  <figure className="xe-ch__diagram">
                    <MethodDiagram id={s.id} title={t("ext.labels.diagram", { name })} />
                  </figure>
                </div>

                <div className="xe-ch__copy">
                  <p className="xe-ch__count">{t("ext.labels.count", { n: i + 1 })}</p>
                  <h2 className="xe-ch__name" id={`technik-${s.id}-title`}>
                    {name}
                  </h2>
                  <p className="xe-ch__tag">{m(s.id, "tagline")}</p>
                  <div className="xe-ch__how">
                    <h3 className="af-mono">{t("ext.labels.how")}</h3>
                    <p>{m(s.id, "how")}</p>
                  </div>
                  <dl className="xe-ch__facts">
                    {(["who", "fix", "wear", "heatGlue", "best"] as const).map((key) => (
                      <div key={key}>
                        <dt>{t(`ext.labels.${key}`)}</dt>
                        <dd>{m(s.id, key)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="xe-ch__lists">
                    <div>
                      <h3 className="af-mono">{t("ext.labels.pros")}</h3>
                      <ul className="xe-ticks">
                        {list(s.id, "pros").map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="af-mono">{t("ext.labels.consider")}</h3>
                      <ul className="xe-notes">
                        {list(s.id, "consider").map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {products.length ? (
                    <div className="xe-ch__shop">
                      <h3 className="af-mono">{t("ext.labels.inShop")}</h3>
                      <ul className="xe-minis">
                        {products.map((p) => (
                          <li key={p.slug}>
                            <MiniCard locale={locale} product={p} />
                          </li>
                        ))}
                      </ul>
                      <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { produkt: `${name}, ${t("ext.labels.otherColors")}`, thema: "extensions" } }}>
                        {t("ext.labels.otherColors")} <Arrow />
                      </Link>
                    </div>
                  ) : (
                    <div className="xe-ch__shop xe-ch__shop--request">
                      <p>{t("ext.labels.onRequest")}</p>
                      <Link className="af-cta-gold af-glass af-glass--gold" href={{ pathname: "/anfrage", query: { produkt: name, thema: "extensions" } }}>
                        {t("ext.labels.requestCta")} <Arrow />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* 5 · Vergleich */}
      <section aria-labelledby="xe-compare-title" className="xe-section">
        <div className="af-wrap">
          <header className="xe-head">
            <p className="af-mono xe-kicker">{t("ext.compare.kicker")}</p>
            <h2 className="xe-h2" id="xe-compare-title">
              {emph(t("ext.compare.title"))}
            </h2>
            <p className="af-lead">{t("ext.compare.lead")}</p>
          </header>
          <div aria-labelledby="xe-compare-title" className="xe-table" role="region" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="af-sr">{t("ext.compare.technique")}</span>
                  </th>
                  {showcases.map((s) => (
                    <th key={s.id} scope="col">
                      <a href={`#technik-${s.id}`}>
                        <span className="xe-table__img">
                          <Image alt="" height={96} sizes="48px" src={s.image} width={72} />
                        </span>
                        {m(s.id, "name")}
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    {showcases.map((s) => (
                      <td key={s.id}>{row.cell(s.id)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      </div>

      {/* 6 · Farbe */}
      <section aria-labelledby="xe-color-title" className="xe-section xe-color">
        <div className="af-wrap xe-color__grid">
          <div className="xe-color__copy">
            <p className="af-mono xe-kicker">{t("ext.color.kicker")}</p>
            <h2 className="xe-h2" id="xe-color-title">
              {emph(t("ext.color.title"))}
            </h2>
            <p className="af-lead">{t("ext.color.lead")}</p>
            <ol className="xe-steps">
              {(["light", "photo", "answer"] as const).map((step) => (
                <li key={step}>
                  <b>{t(`extensions.colorSteps.${step}.title`)}</b>
                  <span>{t(`extensions.colorSteps.${step}.text`)}</span>
                </li>
              ))}
            </ol>
            <div className="xe-color__cta">
              {whatsapp ? (
                <a className="af-cta-gold af-glass af-glass--gold" href={whatsapp} rel="noopener noreferrer" target="_blank">
                  {t("ext.color.whatsapp")} <span className="af-sr">{t("common.newTab")}</span>
                </a>
              ) : null}
              <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
                {t("ext.color.ask")}
              </Link>
            </div>
            <p className="xe-fine">{t("ext.color.note")}</p>
          </div>
          <ul aria-hidden="true" className="xe-strands">
            {packs.map((p, i) => (
              <li key={p.slug} style={{ "--i": i } as React.CSSProperties}>
                <Image alt="" fill sizes="160px" src={p.image} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 · Shop */}
      <section aria-labelledby="xe-shop-title" className="xe-section" id="packungen">
        <div className="af-wrap">
          <header className="xe-head xe-head--left">
            <h2 className="xe-h2" id="xe-shop-title">
              {emph(t("ext.shop.title"))}
            </h2>
            <p className="af-lead">{t("ext.shop.lead")}</p>
          </header>
          <div className="af-grid">
            {packs.map((product, index) => (
              <ProductCard key={product.slug} locale={locale} priority={index < 2} product={product} />
            ))}
          </div>
          <div className="af-consultcard xe-consult">
            <div className="af-stack">
              <p className="af-mono">{t("extensions.packKicker")}</p>
              <h3 className="af-h3">{t("extensions.packTitle")}</h3>
              <p className="af-text">{t("extensions.packText")}</p>
            </div>
            <div className="af-consultcard__cta">
              {whatsapp ? (
                <a className="af-cta-gold af-glass af-glass--gold" href={whatsapp} rel="noopener noreferrer" target="_blank">
                  {t("extensions.packWhatsapp")} <span className="af-sr">{t("common.newTab")}</span>
                </a>
              ) : null}
              <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
                {t("extensions.packAsk")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Fragen */}
      <section aria-labelledby="xe-faq-title" className="xe-section">
        <div className="af-wrap xe-faq">
          <h2 className="xe-h2" id="xe-faq-title">
            {t("ext.faq.title")}
          </h2>
          <div className="af-faq">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>
                  <h3 className="af-faq__q">{item.q}</h3>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · Anfrage, Salons, Maßanfertigung */}
      <div className="af-wrap">
        <div className="xe-section">
          <ExtensionsInquiry locale={locale} />
        </div>
        <div className="xe-section xe-section--tight">
          <CustomStrip />
        </div>
        <p className="xe-fine xe-fine--end">{t("ext.note")}</p>
      </div>
    </main>
  );
}

/** Ja/Nein-Markierung in der Vergleichstabelle: Symbol plus Text (nie nur Farbe). */
function Mark({ on, text, good }: { on: boolean; text: string; good?: boolean }) {
  return (
    <span className="xe-mark" data-good={good || undefined} data-on={on || undefined}>
      <svg aria-hidden="true" height="14" viewBox="0 0 24 24" width="14">
        {on ? <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" /> : <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" />}
      </svg>
      {text}
    </span>
  );
}

/** Kleine Produktkarte im Technik-Kapitel: Bild, Farbe, Preis je Einheit. */
async function MiniCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "product" });
  const text = productText(product, locale);
  const unit = unitInfo(product);
  return (
    <Link className="xe-mini" href={`/produkt/${product.slug}`}>
      <span className="xe-mini__img">
        <Image alt="" height={160} sizes="96px" src={product.image} width={120} />
      </span>
      <span className="xe-mini__txt">
        <b>{text.subtitle}</b>
        <span>
          {Number.parseInt(product.length, 10) > 0 ? `${t("spec.lengthValue", { cm: Number.parseInt(product.length, 10) })} · ` : ""}
          {unit ? (unit.kind === "set" ? t("setSize", { grams: unit.grams, pieces: unit.parts }) : t("packSize", { grams: unit.grams })) : null}
        </span>
        <i>{formatPrice(product.priceCents, locale)}</i>
      </span>
      <Arrow />
    </Link>
  );
}
