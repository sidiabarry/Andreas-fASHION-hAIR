import { getImageProps } from "next/image";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

/**
 * Schlichter, statischer Platzhalter-Hero (Standbild aus dem Film + Schlagzeile + zwei Wege).
 * Der automatisch ablaufende Hero wird vom Design-Agenten in src/components/home/** gebaut.
 */
export function HeroPlaceholder({ kicker, title, body, primary, secondary }: { kicker: string; title: string; body: string; primary: string; secondary: string }) {
  const common = { alt: "", priority: true, sizes: "100vw" };
  const desktop = getImageProps({ ...common, height: 1080, src: "/assets/world/scene-03-poster.jpg", width: 1920 }).props;
  const mobile = getImageProps({ ...common, height: 720, src: "/assets/world/scene-03-mobile-poster.jpg", width: 1280 }).props;
  return (
    <section aria-labelledby="hero-title" className="af-hero">
      <picture className="af-hero__media">
        <source media="(max-width: 767px)" srcSet={mobile.srcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" kommt aus getImageProps (dekorativ) */}
        <img {...desktop} />
      </picture>
      <div className="af-wrap af-hero__in">
        <p className="af-mono af-gold">{kicker}</p>
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
    </section>
  );
}
