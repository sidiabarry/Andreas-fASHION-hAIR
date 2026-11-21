import { getImageProps } from "next/image";

import { Arrow } from "@/components/Arrow";
import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";

import { HeroFilm } from "./HeroFilm";

/**
 * Heller Hero („Lichtatelier“): Schlagzeile links, rechts der Spiegel als Bogen mit dem Film.
 * Das Standbild ist das LCP-Bild, der Film legt sich nach dem Laden darüber (siehe HeroFilm).
 */
export function HeroPlaceholder({
  kicker,
  title,
  body,
  primary,
  secondary,
  badgeBig,
  badgeText,
}: {
  kicker: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
  badgeBig?: string;
  badgeText?: string;
}) {
  const common = { alt: "", priority: true, sizes: "(max-width: 900px) 74vw, 500px" };
  const desktop = getImageProps({ ...common, height: 1080, src: "/assets/world/scene-03-poster.jpg", width: 1920 }).props;
  const mobile = getImageProps({ ...common, height: 720, src: "/assets/world/scene-03-mobile-poster.jpg", width: 1280 }).props;
  return (
    <section aria-labelledby="hero-title" className="af-hero">
      <div className="af-wrap af-hero__grid">
        <div className="af-hero__in">
          <p className="af-mono af-gold af-hero__kicker">{kicker}</p>
          <h1 className="af-h1" id="hero-title">
            {title}
          </h1>
          <p className="af-lead">{body}</p>
          <div className="af-hero-actions">
            <Link className="af-cta-gold" href="/kollektion">
              {primary} <Arrow />
            </Link>
            <Link className="af-cta-line" href="/anfrage">
              {secondary}
            </Link>
          </div>
        </div>
        <div className="af-hero__art">
          <div className="af-arch-frame">
            <div className="af-arch">
              <picture>
                <source media="(max-width: 767px)" srcSet={mobile.srcSet} />
                {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" kommt aus getImageProps (dekorativ) */}
                <img {...desktop} />
              </picture>
              <HeroFilm desktop="/assets/world/scene-03.mp4" mobile="/assets/world/scene-03-mobile.mp4" />
            </div>
          </div>
          <span aria-hidden="true" className="af-hero__spark">
            <Logo size={40} variant="mark" />
          </span>
          {badgeBig && badgeText ? (
            <p className="af-hero__badge">
              <strong>{badgeBig}</strong>
              <span>{badgeText}</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
