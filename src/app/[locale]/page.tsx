import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FieldMount } from "@/components/fx/FieldMount";
import { Dock } from "@/components/home/Dock";
import { HeroShowcase, type ShowcaseTexts } from "@/components/home/HeroShowcase";
import type { SpotlightPiece } from "@/components/home/HeroSpotlight";
import { PieceCard, type CardTexts } from "@/components/home/PieceCard";
import { Reveal } from "@/components/home/Reveal";
import { Bespoke } from "@/components/home/scenes/Bespoke";
import { ColorFan, type Swatch } from "@/components/home/scenes/ColorFan";
import { ExtensionsChapter, type ExtPiece } from "@/components/home/scenes/ExtensionsChapter";
import { Near } from "@/components/home/scenes/Near";
import { Ribbon } from "@/components/home/scenes/Ribbon";
import { Close, Concerns, Hand, Steps } from "@/components/home/scenes/Story";
import { TopperChapter } from "@/components/home/scenes/TopperChapter";
import { homeValues, openingHours, whatsappHref } from "@/components/home/values";
import { JsonLd } from "@/components/JsonLd";
import { PriceNote } from "@/components/product/PriceNote";
import { byCategory, getProductById, isUnique, productText, products, unitInfo, VISIBLE_CATEGORY_IDS, type CategoryId, type Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { organizationJsonLd } from "@/lib/jsonld";
import { formatPrice } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

import "@/components/home/home.css";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ description: t("defaultDescription"), locale: locale as Locale, path: "/", title: t("defaultTitle") });
}

/** Studioaufnahmen der neuen Stücke (Hauptbild `<id>.jpg`, Detail `<id>-2.jpg`). */
const studio = (id: number, detail = false) => `/assets/products/${id}${detail ? "-2" : ""}.jpg`;

/** Kapitel I: Reihenfolge der Vitrine (hellstes Stück zuerst, Farben abwechselnd). */
const EXT_IDS = [425, 423, 426, 427, 428, 424];
/** „Kommen Sie näher“: Detailaufnahmen mit Bildausschnitt für die Kamerafahrt. */
const NEAR = [
  { id: 423, focus: "50% 40%" },
  { id: 425, focus: "50% 42%" },
  { id: 427, focus: "50% 40%" },
  { id: 428, focus: "50% 45%" },
];
/** Farbfächer: Ausschnitt dort, wo das Haar am meisten zeigt (Längen, Ombré-Verlauf, Locken). */
const SWATCHES = [
  { id: 424, focus: "50% 40%" },
  { id: 426, focus: "50% 30%" },
  { id: 425, focus: "50% 40%" },
  { id: 427, focus: "55% 40%" },
];
/** Kapitel II: das neue V-Toupet groß, dazu Einzelstücke in verschiedenen Farben und Strukturen. */
const TOPPER_IDS = [422, 287, 415, 413];
const NEEDS: CategoryId[] = ["topper", "peruecken", "pony", "maenner"];

const byIds = (ids: number[]) => ids.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p));

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const tp = await getTranslations({ locale, namespace: "product" });
  const sold = await soldSlugs();
  const v = homeValues(locale);
  const count = (key: string) => (t.raw(key) as unknown[]).length;
  const items = <T extends string>(key: string, fields: T[], values: Record<string, string> = {}) =>
    Array.from({ length: count(key) }, (_, i) => Object.fromEntries(fields.map((f) => [f, t(`${key}.${i}.${f as string}`, values)])) as Record<T, string>);
  const strings = (key: string, values: Record<string, string> = {}) => Array.from({ length: count(key) }, (_, i) => t(`${key}.${i}`, values));
  const whatsappNote = t("home.whatsappNote");
  const symbolImage = t("home.symbolImage");

  // Kapitel I: Extensions mit Preis und Grundpreis (PAngV) direkt am Stück
  const pieces: ExtPiece[] = byIds(EXT_IDS).map((p) => {
    const text = productText(p, locale);
    const unit = unitInfo(p);
    const unitLine = unit
      ? [unit.kind === "set" ? tp("setSize", { grams: unit.grams, pieces: unit.parts }) : tp("packSize", { grams: unit.grams }), unit.baseCents ? tp("unitPrice", { amount: formatPrice(unit.baseCents, locale) }) : null]
          .filter(Boolean)
          .join(" · ")
      : null;
    const color = text.subtitle;
    return { color, image: studio(p.id), label: t("home.ext.view", { color, name: text.name }), name: text.name, price: formatPrice(p.priceCents, locale), slug: p.slug, unit: unitLine };
  });

  // Hero (Schaufenster): Extensions mit Preis im Wechsel, Live-Zahl echter Einzelstücke, Film in drei Kapiteln
  const spotlight: SpotlightPiece[] = pieces.map((p) => ({ flag: null, image: p.image, name: p.name, price: p.price, slug: p.slug, subtitle: p.color, unit: p.unit }));
  const uniqueOpen = products.filter((p) => isUnique(p) && !p.sold && !sold.has(p.slug)).length;
  const showcase: ShowcaseTexts = {
    chapters: [1, 2, 3].map((n) => ({ label: t(`hero.ch${n}`), title: t(`hero.line${n}`) })),
    ctaCustom: t("hero.ctaCustom"),
    ctaExtensions: t("hero.ctaExtensions"),
    customKicker: t("home.custom.kicker"),
    customTitle: t("home.custom.title"),
    lead: t("hero.lead"),
    live: t("hero.liveCount", { count: uniqueOpen }),
    needs: VISIBLE_CATEGORY_IDS.map((id) => ({ id, label: t(`categories.${id}.need`) })),
    needsLabel: t("hero.needsLabel"),
    pause: t("hero.pause"),
    play: t("hero.play"),
    spotlightNext: t("hero.spotlightNext"),
    spotlightPrev: t("hero.spotlightPrev"),
    spotlightShow: t.raw("hero.spotlightShow") as string,
    spotlightTitle: t("home.ext.galleryLabel"),
    symbolImage,
    title: t("hero.line1"),
  };

  const shots = byIds(NEAR.map((n) => n.id)).map((p, i) => {
    const text = productText(p, locale);
    return {
      alt: t("home.near.shotAlt", { color: text.subtitle, name: text.name }),
      focus: NEAR[i].focus,
      label: t(`home.near.shots.${i}.label`),
      src: studio(p.id),
      text: t(`home.near.shots.${i}.text`),
    };
  });
  const progress = shots.map((_, i) => t("home.near.progress", { index: i + 1, total: shots.length }));

  const swatches: Swatch[] = byIds(SWATCHES.map((s) => s.id)).map((p, i) => ({ color: productText(p, locale).subtitle, focus: SWATCHES[i].focus, image: studio(p.id), slug: p.slug }));

  // Kapitel II: Einzelstücke (verkaufte werden übersprungen)
  const cardTexts: CardTexts = {
    add: t("home.topper.add"),
    custom: t("home.topper.custom"),
    inCart: t("home.topper.inCart"),
    sold: t("home.topper.sold"),
    unique: t("home.topper.unique"),
    view: t.raw("home.topper.view") as string,
  };
  const toppers = byIds(TOPPER_IDS).filter((p) => !p.sold && !sold.has(p.slug));
  const cards = toppers.map((p, i) => (
    <PieceCard
      index={i}
      key={p.slug}
      locale={locale}
      product={{ ...p, image: p.id === 422 ? studio(422) : p.image }}
      size={i === 0 ? "l" : "m"}
      sizes={i === 0 ? "(max-width: 900px) 86vw, 40vw" : "(max-width: 900px) 64vw, 22vw"}
      sold={false}
      t={cardTexts}
    />
  ));
  const needs = NEEDS.map((id) => {
    const open = byCategory(id).filter((p) => !p.sold && !sold.has(p.slug));
    return { caption: t(`categories.${id}.caption`), count: open.length, id, label: t(`categories.${id}.label`), need: t(`categories.${id}.need`), slug: open[0]?.slug ?? null, zone: t(`cat.compassZone.${id}`) };
  }).filter((n) => n.count > 0);

  const concerns = items("home.concerns.items", ["q", "a"], v);
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: concerns.map((c) => ({ "@type": "Question", acceptedAnswer: { "@type": "Answer", text: c.a }, name: c.q })),
  };
  const chapter = t("home.chapterLabel");

  return (
    <main className="home">
      <JsonLd data={organizationJsonLd(locale)} />
      <JsonLd data={faqJson} />
      <FieldMount />
      <Reveal />

      <HeroShowcase pieces={spotlight} t={showcase} />

      <Ribbon items={strings("home.ribbon", v)} label={t("home.ribbonLabel")} />

      <ExtensionsChapter
        pieces={pieces}
        priceNote={<PriceNote locale={locale} />}
        t={{
          chapter,
          cta: t("home.ext.cta"),
          galleryLabel: t("home.ext.galleryLabel"),
          imageNote: t("home.ext.imageNote"),
          kicker: t("home.ext.kicker"),
          lead: t("home.ext.lead"),
          methods: strings("home.ext.methods"),
          methodsLabel: t("home.ext.methodsLabel"),
          methodsNote: t("home.ext.methodsNote"),
          salon: t("home.ext.salon"),
          title: t("home.ext.title"),
        }}
      />

      <Near progress={progress} shots={shots} t={{ cta: t("home.near.cta"), kicker: t("home.near.kicker"), lead: t("home.near.lead"), title: t("home.near.title") }} />

      <ColorFan
        swatches={swatches}
        t={{
          cta: t("home.color.cta"),
          ctaForm: t("home.color.ctaForm"),
          customText: t("home.color.customText"),
          customTitle: t("home.color.customTitle"),
          fanLabel: t("home.color.fanLabel"),
          kicker: t("home.color.kicker"),
          lead: t("home.color.lead"),
          lightDay: t("cat.lightDay"),
          lightLabel: t("cat.lightLabel"),
          lightWarm: t("cat.lightWarm"),
          view: t("cat.compareView"),
          steps: items("home.color.steps", ["title", "text"]),
          stepsLabel: t("home.color.stepsLabel"),
          title: t("home.color.title"),
        }}
        whatsapp={whatsappHref}
        whatsappNote={whatsappNote}
      />

      <TopperChapter
        cards={cards}
        needs={needs}
        t={{
          chapter,
          compassCount: t.raw("cat.compassCount") as string,
          compassCta: t("cat.compassCta"),
          compassOne: t("cat.compassOne"),
          consult: t("home.topper.consult"),
          cta: t("home.topper.cta"),
          kicker: t("home.topper.kicker"),
          lead: t("home.topper.lead"),
          needsLabel: t("home.topper.needsLabel"),
          title: t("home.topper.title"),
        }}
      />

      <Bespoke
        symbolImage={symbolImage}
        t={{
          chapter,
          cta: t("home.custom.cta"),
          imageAlt: t("home.custom.imageAlt"),
          kicker: t("home.custom.kicker"),
          lead: t("home.custom.lead"),
          steps: items("home.custom.steps", ["title", "text"]),
          stepsLabel: t("home.custom.stepsLabel"),
          time: t("home.custom.time", v),
          title: t("home.custom.title"),
        }}
      />

      <Hand
        hours={openingHours(locale)}
        symbolImage={symbolImage}
        t={{
          by: t("home.hand.by"),
          cta: t("home.hand.cta"),
          imageAlt: t("home.hand.imageAlt"),
          kicker: t("home.hand.kicker"),
          lead: t("home.hand.lead"),
          quote: t("home.hand.quote"),
          title: t("home.hand.title"),
          visitCta: t("home.hand.visitCta"),
          visitTitle: t("home.hand.visitTitle"),
        }}
        whatsapp={whatsappHref}
        whatsappNote={whatsappNote}
      />

      <Concerns
        t={{ cta: t("home.concerns.cta"), items: concerns, lead: t("home.concerns.lead"), returnsLink: t("home.concerns.returnsLink"), title: t("home.concerns.title") }}
        whatsapp={whatsappHref}
        whatsappNote={whatsappNote}
      />

      <Steps t={{ cta: t("home.steps.cta"), items: items("home.steps.items", ["title", "text"], v), title: t("home.steps.title") }} />

      <Close ctaCustom={t("hero.ctaCustom")} ctaExtensions={t("hero.ctaExtensions")} symbolImage={symbolImage} t={{ imageAlt: t("home.close.imageAlt"), lead: t("home.close.lead"), title: t("home.close.title") }} />

      <Dock label={t("home.dock")} note={whatsappNote} pause={t("hero.pause")} play={t("hero.play")} whatsapp={whatsappHref} />
    </main>
  );
}
