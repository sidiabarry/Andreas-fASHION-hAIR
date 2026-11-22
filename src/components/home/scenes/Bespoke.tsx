import Image from "next/image";

import { Arrow } from "@/components/Arrow";
import { AmbientVideo } from "@/components/fx/AmbientVideo";
import { Link } from "@/i18n/navigation";

import { Chapter } from "../Chapter";
import { Words } from "../Words";

type BespokeTexts = {
  chapter: string;
  kicker: string;
  title: string;
  lead: string;
  stepsLabel: string;
  steps: { title: string; text: string }[];
  time: string;
  cta: string;
  imageAlt: string;
};

/**
 * Kapitel III – Maßanfertigung: breites Band, rechts randlos die Werkstatt im Lampenlicht, links die
 * sechs Angaben der Anfrage als Raster. Ein Hauptknopf zur Anfrage-Seite.
 */
export function Bespoke({ t, symbolImage }: { t: BespokeTexts; symbolImage: string }) {
  return (
    <section aria-labelledby="bespoke-title" className="bs" data-fx="thread" data-fx-a="0.4" data-fx-ma="0.2" data-fx-s="0.55" data-fx-x="-0.4" data-fx-y="-0.62" id="massanfertigung">
      <figure className="bs__media">
        <Image alt={t.imageAlt} fill sizes="(max-width: 900px) 100vw, 55vw" src="/assets/world/craft-poster.jpg" />
        <AmbientVideo desktop="/assets/world/craft.mp4" mobile="/assets/world/craft-mobile.mp4" />
        <figcaption>{symbolImage}</figcaption>
      </figure>
      <div className="af-wrap bs__in">
        <div className="bs__copy">
          <Chapter label={t.chapter} numeral="III" />
          <p className="h-eyebrow h-in">{t.kicker}</p>
          <h2 className="h-title h-in" id="bespoke-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead h-in">{t.lead}</p>
          <ol aria-label={t.stepsLabel} className="bs__steps">
            {t.steps.map((s, i) => (
              <li className="h-in" key={s.title} style={{ transitionDelay: `${i * 70}ms` }}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="bs__cta h-in">
            <Link className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href="/massanfertigung">
              <span>{t.cta}</span> <Arrow />
            </Link>
            <p className="h-note">{t.time}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
