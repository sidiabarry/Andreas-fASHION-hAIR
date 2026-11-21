import Image from "next/image";
import type { CSSProperties } from "react";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

import { Words } from "../Words";

export type Swatch = { slug: string; image: string; color: string; focus: string };

type ColorTexts = {
  kicker: string;
  title: string;
  lead: string;
  fanLabel: string;
  customTitle: string;
  customText: string;
  stepsLabel: string;
  steps: { title: string; text: string }[];
  cta: string;
  ctaForm: string;
};

/**
 * Farbe und Menge: ein Fächer aus echten Haar-Ausschnitten der Studioaufnahmen (keine gemalten
 * Farbfelder), am Ende ein leerer, glimmender Streifen „Ihre Farbe? Nach Maß“. Daneben der
 * Farbabgleich in drei Schritten und genau ein Hauptknopf: Foto an Andrea.
 */
export function ColorFan({ t, swatches, whatsapp, whatsappNote }: { t: ColorTexts; swatches: Swatch[]; whatsapp: string | null; whatsappNote: string }) {
  const total = swatches.length + 1;
  return (
    <section aria-labelledby="color-title" className="cf" data-fx="strands" data-fx-a="0.35" data-fx-ma="0.2" data-fx-s="0.55" data-fx-x="-0.45" data-fx-y="0.1">
      <div className="af-wrap cf__grid">
        <div className="cf__fan h-in">
          <ul aria-label={t.fanLabel}>
            {swatches.map((s, i) => (
              <li key={s.slug} style={{ "--i": i - (total - 1) / 2, "--focus": s.focus } as CSSProperties}>
                <Link className="cf__strip" href={`/produkt/${s.slug}`}>
                  <Image alt="" fill sizes="(max-width: 900px) 20vw, 140px" src={s.image} />
                  <span className="cf__name">{s.color}</span>
                </Link>
              </li>
            ))}
            <li className="cf__own" style={{ "--i": (total - 1) / 2 } as CSSProperties}>
              <Link className="cf__strip" href="/massanfertigung">
                <span aria-hidden="true" className="cf__plus" />
                <span className="cf__name">
                  {t.customTitle} <span className="cf__sub">{t.customText}</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="cf__copy">
          <p className="h-eyebrow h-in">{t.kicker}</p>
          <h2 className="h-title h-in" id="color-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead h-in">{t.lead}</p>
          <ol aria-label={t.stepsLabel} className="cf__steps">
            {t.steps.map((step, i) => (
              <li className="h-in" key={step.title} style={{ transitionDelay: `${i * 110}ms` }}>
                <span aria-hidden="true" className="cf__num">
                  {i + 1}
                </span>
                <h3 className="h-subtitle">{step.title}</h3>
                <p className="h-text">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="cf__cta h-in">
            {whatsapp ? (
              <a className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href={whatsapp} rel="noopener noreferrer" target="_blank">
                <span>{t.cta}</span> <Arrow />
                <span className="af-sr"> ({whatsappNote})</span>
              </a>
            ) : null}
            <Link className={whatsapp ? "h-link" : "h-btn h-btn--gold af-glass af-glass--gold"} href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
              {whatsapp ? t.ctaForm : <span>{t.ctaForm}</span>}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
