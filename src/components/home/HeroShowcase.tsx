import Image, { getImageProps } from "next/image";
import { Arrow } from "@/components/Arrow";
import { Logo } from "@/components/Logo";
import type { CategoryId } from "@/data/catalog";
import { Link } from "@/i18n/navigation";

import { emphasis } from "./emphasis";
import { HeroFilm, type FilmChapter } from "./HeroFilm";
import { HeroSpotlight, type SpotlightPiece } from "./HeroSpotlight";

export type ShowcaseTexts = {
  live: string;
  title: string;
  lead: string;
  ctaExtensions: string;
  ctaCustom: string;
  needsLabel: string;
  needs: { id: CategoryId; label: string }[];
  chapters: FilmChapter[];
  pause: string;
  play: string;
  spotlightTitle: string;
  spotlightPrev: string;
  spotlightNext: string;
  spotlightShow: string;
  customKicker: string;
  customTitle: string;
  symbolImage: string;
};

/**
 * Hero als Schaufenster (Bento): Versprechen + Einstiege nach Bedarf, der Film „Wie neu geboren“ in
 * drei Kapiteln, Extensions mit Preis und Grundpreis, Maßanfertigung. Keine erfundenen Belege, keine Countdowns.
 */
export function HeroShowcase({ t, pieces }: { t: ShowcaseTexts; pieces: SpotlightPiece[] }) {
  const poster = getImageProps({ alt: "", height: 1080, priority: true, quality: 70, sizes: "(max-width: 759px) 100vw, (max-width: 1099px) 60vw, 560px", src: "/assets/world/journey-poster.jpg", width: 1080 }).props;

  return (
    <section aria-labelledby="hero-title" className="af-hx">
      <div className="af-hx__grid">
        <div className="af-hx__copy">
          <p className="af-hx__live">
            <span aria-hidden="true" className="af-hx__dot" />
            {t.live}
          </p>
          <div className="af-hx__head">
            <h1 className="af-hx__title" id="hero-title">
              {emphasis(t.title)}
            </h1>
            <p className="af-hx__lead">{t.lead}</p>
            <div className="af-hx__actions">
              <Link className="h-btn h-btn--gold af-glass af-glass--gold af-hx__primary" data-magnetic="" href="/extensions">
                <span>{t.ctaExtensions}</span> <Arrow />
              </Link>
              <Link className="h-link h-link--glass" href="/massanfertigung">
                {t.ctaCustom}
              </Link>
            </div>
          </div>
          <nav aria-labelledby="hx-needs" className="af-hx__needs">
            <p className="af-mono" id="hx-needs">
              {t.needsLabel}
            </p>
            <ul>
              {t.needs.map((need) => (
                <li key={need.id}>
                  <Link href={need.id === "extensions" ? "/extensions" : { pathname: "/kollektion", query: { kategorie: need.id } }}>
                    {need.label}
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
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element -- optimiert über getImageProps, alt="" (dekorativ) */}
          <img className="af-hx__poster" {...poster} />
          <HeroFilm chapters={t.chapters} desktop="/assets/world/journey.mp4" mobile="/assets/world/journey-mobile.mp4" pauseLabel={t.pause} playLabel={t.play} />
        </div>

        <HeroSpotlight nextLabel={t.spotlightNext} pieces={pieces} prevLabel={t.spotlightPrev} showTemplate={t.spotlightShow} title={t.spotlightTitle} />

        <Link className="af-hx__ext af-ondark" href="/massanfertigung">
          <Image alt="" fill sizes="(max-width: 759px) 46vw, (max-width: 1099px) 38vw, 300px" src="/assets/content/craft.jpg" />
          <span className="af-hx__extbody">
            <span className="af-mono">{t.customKicker}</span>
            <span className="af-hx__exttitle">{emphasis(t.customTitle)}</span>
          </span>
          <span className="af-hx__symbol">{t.symbolImage}</span>
          <span aria-hidden="true" className="af-hx__round">
            <Arrow />
          </span>
        </Link>
      </div>
    </section>
  );
}
