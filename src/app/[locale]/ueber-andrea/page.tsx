import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { AmbientVideo } from "@/components/fx/AmbientVideo";
import { FieldMount } from "@/components/fx/FieldMount";
import { HairStage } from "@/components/fx/HairStage";
import { Reveal } from "@/components/home/Reveal";
import { homeValues, openingHours, whatsappHref } from "@/components/home/values";
import { Words } from "@/components/home/Words";
import { Logo } from "@/components/Logo";
import { company } from "@/config/company";
import { getProductById, productText } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

import "@/components/home/home.css";
import "./about.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/ueber-andrea">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ description: t("metaDescription"), locale: locale as Locale, path: "/ueber-andrea", title: t("metaTitle") });
}

/** „Für jede Haarfarbe“: echte Stücke aus dem Atelier, hell bis dunkel, glatt bis lockig. */
const COLOR_IDS = [427, 425, 422, 287, 426, 415, 58, 424];
const imageOf = (id: number, fallback: string) => ([422, 423, 424, 425, 426, 427, 428].includes(id) ? `/assets/products/${id}.jpg` : fallback);

type Chapter = { label: string; title: string; text: string; quote?: string };

export default async function AboutPage({ params }: PageProps<"/[locale]/ueber-andrea">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const th = await getTranslations({ locale, namespace: "home" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const v = homeValues(locale);
  const chapters = t.raw("chapters") as Chapter[];
  const trust = (t.raw("trust") as unknown[]).map((_, i) => ({ text: t(`trust.${i}.text`, v), title: t(`trust.${i}.title`, v) }));
  const colors = COLOR_IDS.map((id) => getProductById(id))
    .filter((p) => p !== undefined)
    .map((p) => ({ image: imageOf(p.id, p.image), name: productText(p, locale).subtitle, slug: p.slug }));
  const a = company.address;
  const symbol = th("symbolImage");
  const wa = whatsappHref;
  const waNote = th("whatsappNote");

  const head = (i: number) => (
    <>
      <p className="aa-label h-in">
        <span>{String(i + 1).padStart(2, "0")}</span> {chapters[i].label}
      </p>
      <h2 className="h-title h-in" id={`kapitel-${i + 1}-title`}>
        <Words text={chapters[i].title} />
      </h2>
    </>
  );
  const quote = (i: number, big = false) =>
    chapters[i].quote ? (
      <figure className={`aa-quote h-in${big ? " aa-quote--big" : ""}`}>
        <blockquote>{chapters[i].quote}</blockquote>
        <figcaption>{t("quoteBy")}</figcaption>
      </figure>
    ) : null;

  return (
    <main className="home about">
      <FieldMount />
      <Reveal />

      <section aria-labelledby="about-title" className="aa-open">
        <div aria-hidden="true" className="aa-open__media">
          <Image alt="" fill priority sizes="100vw" src="/assets/content/phoenix.jpg" />
        </div>
        <div className="af-wrap aa-open__in">
          <p className="h-eyebrow">{t("kicker")}</p>
          <h1 className="h-title h-title--xl" id="about-title">
            <Words text={t("title")} />
          </h1>
          <p className="h-lead">{t("lead")}</p>
          <nav aria-label={t("chaptersLabel")} className="aa-index">
            <ol>
              {chapters.map((c, i) => (
                <li key={c.label}>
                  <a href={`#kapitel-${i + 1}`}>
                    <span>{String(i + 1).padStart(2, "0")}</span> {c.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <span className="aa-open__note">{symbol}</span>
      </section>

      {/* 1 Rio: die Zahl als Bild */}
      <section aria-labelledby="kapitel-1-title" className="aa-ch aa-ch--numeral" id="kapitel-1">
        <div className="af-wrap aa-numeral">
          <p aria-hidden="true" className="aa-numeral__big h-in">
            19
          </p>
          <div className="aa-copy">
            {head(0)}
            <p className="h-lead h-in">{chapters[0].text}</p>
            {quote(0)}
          </div>
        </div>
      </section>

      {/* 2 Neuanfang: nur Text, ganz ruhig */}
      <section aria-labelledby="kapitel-2-title" className="aa-ch aa-ch--plain" id="kapitel-2">
        <div className="af-wrap aa-plain">
          {head(1)}
          <p className="aa-plain__text h-in">{chapters[1].text}</p>
        </div>
      </section>

      {/* 3 Selbst betroffen: der Blick in den Spiegel */}
      <section aria-labelledby="kapitel-3-title" className="aa-ch aa-ch--split" id="kapitel-3">
        <div className="af-wrap aa-split">
          <figure className="aa-split__media h-in">
            <Image alt={t("mirrorAlt")} height={1194} sizes="(max-width: 900px) 100vw, 50vw" src="/assets/content/mirror.jpg" width={1600} />
            <figcaption>{symbol}</figcaption>
          </figure>
          <div className="aa-copy">
            {head(2)}
            <p className="h-lead h-in">{chapters[2].text}</p>
            {quote(2)}
          </div>
        </div>
      </section>

      {/* 4 Es muss echt sein: Satz als Haltung */}
      <section aria-labelledby="kapitel-4-title" className="aa-ch aa-ch--statement" id="kapitel-4">
        <div className="af-wrap aa-statement">
          {head(3)}
          <p className="h-lead h-in">{chapters[3].text}</p>
        </div>
      </section>

      {/* 5 Das Atelier: randloses Werkstattbild */}
      <section aria-labelledby="kapitel-5-title" className="aa-ch aa-ch--band" id="kapitel-5">
        <figure className="aa-band__media">
          <Image alt={t("craftAlt")} fill sizes="100vw" src="/assets/world/craft-poster.jpg" />
          <AmbientVideo desktop="/assets/world/craft.mp4" mobile="/assets/world/craft-mobile.mp4" />
          <figcaption>{symbol}</figcaption>
        </figure>
        <div className="af-wrap aa-band">
          <div className="aa-copy">
            {head(4)}
            <p className="h-lead h-in">{chapters[4].text}</p>
            {quote(4)}
          </div>
        </div>
      </section>

      {/* 6 Der Phönix: Zeichen in der Mitte, Partikel formen ihn nach */}
      <section aria-labelledby="kapitel-6-title" className="aa-ch aa-ch--phoenix" data-fx="embers" data-fx-a="0.4" data-fx-heat="1" data-fx-loose="0.6" data-fx-s="1" data-fx-y="-0.8" id="kapitel-6">
        <HairStage mscale={0.9} my={0.26} scale={0.62} x={0.5} y={0.36} />
        <div className="af-wrap aa-phoenix">
          <div className="aa-phoenix__mark h-in">
            <Logo label="" size={148} variant="mark" />
          </div>
          {head(5)}
          <p className="h-lead h-in">{chapters[5].text}</p>
          {quote(5, true)}
        </div>
      </section>

      {/* 7 Antrieb: für jede Haarfarbe */}
      <section aria-labelledby="kapitel-7-title" className="aa-ch aa-ch--colors" id="kapitel-7">
        <div className="af-wrap aa-colors">
          <div className="aa-copy">
            {head(6)}
            <p className="h-lead h-in">{chapters[6].text}</p>
            {quote(6)}
          </div>
          <ul aria-label={t("colorsLabel")} className="aa-tones h-in">
            {colors.map((c, i) => (
              <li key={c.slug} style={{ "--k": i } as CSSProperties}>
                <Link href={`/produkt/${c.slug}`}>
                  <Image alt="" fill sizes="(max-width: 900px) 25vw, 12vw" src={c.image} />
                  <span>{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="trust-title" className="aa-trust">
        <div className="af-wrap">
          <h2 className="h-title h-in" id="trust-title">
            <Words text={t("trustTitle")} />
          </h2>
          <dl className="aa-trust__grid">
            {trust.map((item, i) => (
              <div className="h-in" key={item.title} style={{ transitionDelay: `${i * 90}ms` }}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="visit-title" className="aa-visit">
        <div className="af-wrap aa-visit__grid">
          <div className="aa-copy">
            <h2 className="h-title h-in" id="visit-title">
              <Words text={t("visitTitle")} />
            </h2>
            <p className="h-lead h-in">{t("visitLead")}</p>
            <div className="aa-actions h-in">
              {wa ? (
                <a className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href={wa} rel="noopener noreferrer" target="_blank">
                  <span>{t("visitCta")}</span> <Arrow />
                  <span className="af-sr"> ({waNote})</span>
                </a>
              ) : null}
              <Link className={wa ? "h-link" : "h-btn h-btn--gold af-glass af-glass--gold"} href="/anfrage">
                {t("visitForm")}
              </Link>
            </div>
          </div>
          <address className="aa-address h-in">
            <span className="h-micro">{tm("siteName")}</span>
            <span>
              {a.street}, {a.postalCode} {a.city}
            </span>
            <span className="h-micro">{t("hoursLabel")}</span>
            <span>{openingHours(locale)}</span>
          </address>
        </div>
      </section>

      <section aria-labelledby="next-title" className="aa-next">
        <div className="af-wrap aa-next__in">
          <Logo label="" size={44} variant="mark" />
          <h2 className="h-title h-in" id="next-title">
            <Words text={t("nextTitle")} />
          </h2>
          <div className="aa-actions aa-actions--center h-in">
            <Link className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href="/extensions">
              <span>{t("nextExtensions")}</span> <Arrow />
            </Link>
            <Link className="h-link" href="/massanfertigung">
              {t("nextCustom")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
