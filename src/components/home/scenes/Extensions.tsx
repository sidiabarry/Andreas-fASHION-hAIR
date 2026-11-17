import Image from "next/image";
import type { CSSProperties } from "react";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

import { MethodSpotlight } from "../MethodSpotlight";
import { Words } from "../Words";

export type ExtTexts = {
  kicker: string;
  status: string;
  title: string;
  lead: string;
  methodsLabel: string;
  methods: { name: string; text: string }[];
  forAllTitle: string;
  forAll: string;
  colors: string[];
  textures: string[];
  cta: string;
  ctaNote: string;
  salonTitle: string;
  salon: string;
  salonCta: string;
  imageAlt: string;
  symbolImage: string;
};

/** Haarfarben als abstrakte Strähnen (kein Foto, keine Personen). Reihenfolge wie `colors`. */
const SWATCHES = [
  ["#ecd3a0", "#c9a466", "#8f6a3a"],
  ["#d98a4e", "#b0562a", "#6e3216"],
  ["#b2453a", "#86281f", "#4c1410"],
  ["#8a6145", "#5a3a26", "#2e1c12"],
  ["#4a4038", "#221c18", "#0c0a09"],
  ["#e4e0da", "#b3aca4", "#6f6962"],
];

/** Extensions zuerst: Länge und Fülle, sechs Methoden, für jede Haarfarbe; Anfrage statt Preis. */
export function Extensions({ t }: { t: ExtTexts }) {
  return (
    <section
      aria-labelledby="ext-title"
      className="ext"
      data-fx="weft"
      data-fx-a="0.5"
      data-fx-ma="0.28"
      data-fx-ms="0.9"
      data-fx-mx="0"
      data-fx-my="0.25"
      data-fx-s="0.7"
      data-fx-x="0.48"
      data-fx-y="0.08"
      id="extensions"
    >
      <div className="af-wrap ext__grid">
        <header className="ext__head h-in">
          <p className="h-eyebrow">
            {t.kicker}
            <span className="h-status">
              <i aria-hidden="true" />
              {t.status}
            </span>
          </p>
          <h2 className="h-title" id="ext-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead">{t.lead}</p>
        </header>

        <figure className="ext__media h-in h-lightedge">
          <Image alt={t.imageAlt} height={1194} sizes="(max-width: 900px) 100vw, 46vw" src="/assets/content/extensions.jpg" width={1600} />
          <figcaption>{t.symbolImage}</figcaption>
        </figure>

        <div className="ext__methods h-in">
          <MethodSpotlight label={t.methodsLabel} methods={t.methods} />
        </div>

        <div className="ext__forall h-in">
          <h3 className="h-subtitle">{t.forAllTitle}</h3>
          <ul className="swatches">
            {t.colors.map((color, i) => {
              const [a, b, c] = SWATCHES[i % SWATCHES.length];
              return (
                <li key={color} style={{ "--s1": a, "--s2": b, "--s3": c, "--d": `${i * 90}ms` } as CSSProperties}>
                  <span aria-hidden="true" className="swatches__strand" />
                  {color}
                </li>
              );
            })}
          </ul>
          <ul className="textures">
            {t.textures.map((texture, i) => (
              <li key={texture}>
                <svg aria-hidden="true" height="20" viewBox="0 0 40 20" width="40">
                  <path
                    d={
                      [
                        "M2 10 H38",
                        "M2 10 C8 4 14 16 20 10 S32 4 38 10",
                        "M2 10 c4-8 8 8 12 0 s8-8 12 0 s8 8 12 0",
                        "M2 10 q2-7 4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0",
                      ][i % 4]
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
                {texture}
              </li>
            ))}
          </ul>
          <p className="h-text">{t.forAll}</p>
        </div>

        <div className="ext__cta h-in">
          <Link className="h-btn h-btn--gold" href={{ pathname: "/anfrage", query: { thema: "extensions" } }}>
            <span>{t.cta}</span> <Arrow />
          </Link>
          <p className="h-note">{t.ctaNote}</p>
          <div className="ext__salon">
            <h3 className="h-subtitle">{t.salonTitle}</h3>
            <p className="h-text">{t.salon}</p>
            <Link className="h-link" href={{ pathname: "/anfrage", query: { thema: "salon" } }}>
              {t.salonCta} <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
