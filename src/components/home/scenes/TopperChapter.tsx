import type { ReactNode } from "react";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

import { HairZoneCompass } from "../HairZoneCompass";
import type { CompassNeed } from "../HairZoneCompass";
import { Chapter } from "../Chapter";
import { Words } from "../Words";

type TopperTexts = { chapter: string; kicker: string; title: string; lead: string; needsLabel: string; cta: string; consult: string; compassCta: string; compassOne: string; compassCount: string };

/**
 * Kapitel II – Topper und Perücken. Zentrierter Auftakt, darunter eine Reihe echter Einzelstücke
 * (das erste groß), dann die Situationen als ruhige Wegweiser in die Kollektion. Ein Hauptknopf.
 */
export function TopperChapter({ t, cards, needs }: { t: TopperTexts; cards: ReactNode[]; needs: CompassNeed[] }) {
  return (
    <section aria-labelledby="topper-title" className="tc" data-fx="halo" data-fx-a="0.3" data-fx-ma="0.18" data-fx-s="0.6" data-fx-x="0" data-fx-y="0.55">
      <div className="af-wrap">
        <header className="tc__head">
          <Chapter label={t.chapter} numeral="II" />
          <p className="h-eyebrow h-in">{t.kicker}</p>
          <h2 className="h-title h-in" id="topper-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead h-in">{t.lead}</p>
        </header>
        <div className="tc__row">{cards}</div>
        <HairZoneCompass cta={t.compassCta} countLabel={t.compassCount} ctaOne={t.compassOne} label={t.needsLabel} needs={needs} />
        <div className="tc__cta h-in">
          <Link className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href={{ pathname: "/kollektion", query: { kategorie: "topper" } }}>
            <span>{t.cta}</span> <Arrow />
          </Link>
          <p className="h-note">{t.consult}</p>
        </div>
      </div>
    </section>
  );
}
