import Image, { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { Logo } from "@/components/Logo";
import { CATEGORY_IDS, featured, isUnique, productText, products } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

import { HeroFilm } from "./HeroFilm";
import type { SpotlightPiece } from "./HeroSpotlight";
import { HeroSpotlight } from "./HeroSpotlight";

/**
 * Hero als Schaufenster (Bento): Versprechen + Einstiege nach Bedarf, Film, echte Stücke mit Preis,
 * Extensions. Darunter ein Band mit belegbaren Gründen. Kein erfundener Beweis, keine Countdowns.
 */
export async function HeroShowcase({ locale, sold }: { locale: Locale; sold: Set<string> }) {
  const t = await getTranslations({ locale });

  // Nur echte Einzelstücke zählen: „jedes nur einmal“ muss für jedes gezählte Stück stimmen
  const open = products.filter((p) => isUnique(p) && !p.sold && !sold.has(p.slug)).length;
  const pieces: SpotlightPiece[] = featured
    .filter((p) => !p.sold && !sold.has(p.slug))
    .slice(0, 5)
    .map((p) => {
      const text = productText(p, locale);
      return {
        flag: p.madeToOrder ? t("product.flagCustom") : isUnique(p) ? t("product.flagUnique") : null,
        image: p.image,
        name: text.name,
        price: formatPrice(p.priceCents, locale),
        slug: p.slug,
        subtitle: text.subtitle,
      };
    });

  const title = t("hero.scene1.title");
  const cut = title.lastIndexOf(" ");
  const titleHead = cut > 0 ? title.slice(0, cut) : "";
  const titleTail = cut > 0 ? title.slice(cut + 1) : title;
  const usps = t.raw("hero.usps") as string[];

  const common = { alt: "", priority: true, sizes: "(max-width: 759px) 100vw, (max-width: 1099px) 60vw, 520px" };
  const desktop = getImageProps({ ...common, height: 1080, src: "/assets/world/scene-03-poster.jpg", width: 1920 }).props;
  const mobile = getImageProps({ ...common, height: 720, src: "/assets/world/scene-03-mobile-poster.jpg", width: 1280 }).props;

  return (
    <section aria-labelledby="hero-title" className="af-hx">
      <div className="af-hx__grid">
        <div className="af-hx__copy">
          <p className="af-hx__live">
            <span aria-hidden="true" className="af-hx__dot" />
            {t("collection.available", { count: open })}
            <span aria-hidden="true">·</span>
            <span>{t("hero.onlyOnce")}</span>
          </p>
          <div className="af-hx__head">
            <h1 className="af-hx__title" id="hero-title">
              {titleHead ? <>{titleHead} </> : null}
              <em>{titleTail}</em>
            </h1>
            <p className="af-hx__lead">{t("hero.scene1.body")}</p>
            <div className="af-hero-actions">
              <Link className="af-cta-gold" href="/kollektion">
                {t("hero.ctaCollection")} <Arrow />
              </Link>
              <Link className="af-cta-line" href="/anfrage">
                {t("hero.ctaConsult")}
              </Link>
            </div>
          </div>
          <nav aria-labelledby="hx-needs" className="af-hx__needs">
            <p className="af-mono" id="hx-needs">
              {t("hero.needsLabel")}
            </p>
            <ul>
              {CATEGORY_IDS.map((id) => (
                <li key={id}>
                  <Link href={{ pathname: "/kollektion", query: { kategorie: id } }}>
                    {t(`categories.${id}.need`)}
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className="af-hx__watermark">
            <Logo size={320} variant="mark" />
          </span>
        </div>

        <div className="af-hx__film af-ondark">
          <picture className="af-hx__poster">
            <source media="(max-width: 759px)" srcSet={mobile.srcSet} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" kommt aus getImageProps (dekorativ) */}
            <img {...desktop} />
          </picture>
          <HeroFilm desktop="/assets/world/scene-03.mp4" mobile="/assets/world/scene-03-mobile.mp4" pauseLabel={t("hero.filmPause")} playLabel={t("hero.filmPlay")} />
          <Link className="af-hx__filmcap" href={{ hash: "handwerk", pathname: "/" }}>
            <span className="af-mono">{t("home.craftKicker")}</span>
            <span className="af-hx__filmtitle">{t("home.craftTitle")}</span>
            <span aria-hidden="true" className="af-hx__round">
              <Arrow />
            </span>
          </Link>
        </div>

        <HeroSpotlight
          nextLabel={t("hero.spotlightNext")}
          pieces={pieces}
          prevLabel={t("hero.spotlightPrev")}
          showTemplate={t.raw("hero.spotlightShow") as string}
          title={t("home.atelierTitle").replace(/[.。]$/, "")}
        />

        <Link className="af-hx__ext af-ondark" href={{ pathname: "/kollektion", query: { kategorie: "extensions" } }}>
          <Image alt="" fill sizes="(max-width: 759px) 46vw, (max-width: 1099px) 38vw, 300px" src="/assets/content/extensions.jpg" />
          <span className="af-hx__extbody">
            <span className="af-mono">{t("home.extKicker")}</span>
            <span className="af-hx__exttitle">{t("home.extTitle")}</span>
          </span>
          <span aria-hidden="true" className="af-hx__round">
            <Arrow />
          </span>
        </Link>
      </div>

      <div className="af-hx__band">
        <h2 className="af-sr">{t("hero.uspLabel")}</h2>
        <div className="af-hx__track">
          {[0, 1].map((copy) => (
            <ul aria-hidden={copy === 1 ? true : undefined} key={copy}>
              {usps.map((usp) => (
                <li key={usp}>
                  <Logo size={18} variant="mark" />
                  {usp}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
