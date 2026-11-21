import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

import { Chapter } from "../Chapter";
import { Words } from "../Words";

export type ExtPiece = { slug: string; image: string; name: string; color: string; price: string; unit: string | null; label: string };

export type ExtTexts = {
  chapter: string;
  kicker: string;
  title: string;
  lead: string;
  methodsLabel: string;
  methods: string[];
  methodsNote: string;
  cta: string;
  salon: string;
  imageNote: string;
  galleryLabel: string;
};

/**
 * Kapitel I – Extensions (Hauptverkauf). Links eine ruhige, mitlaufende Textspalte mit genau einem
 * Hauptknopf, rechts die Studioaufnahmen als Vitrine: jedes Stück im eigenen Lichtkegel, Preis und
 * Grundpreis direkt darunter (PAngV). Auf dem Handy wird die Vitrine zur Wischreihe.
 */
export function ExtensionsChapter({ t, pieces, priceNote }: { t: ExtTexts; pieces: ExtPiece[]; priceNote: ReactNode }) {
  return (
    <section
      aria-labelledby="ext-title"
      className="xc"
      data-fx="weft"
      data-fx-a="0.42"
      data-fx-ma="0.22"
      data-fx-ms="0.8"
      data-fx-mx="0"
      data-fx-my="0.55"
      data-fx-s="0.62"
      data-fx-x="-0.55"
      data-fx-y="-0.5"
      id="extensions"
    >
      <div className="af-wrap xc__grid">
        <header className="xc__head">
          <Chapter label={t.chapter} numeral="I" />
          <p className="h-eyebrow h-in">{t.kicker}</p>
          <h2 className="h-title h-in" id="ext-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead h-in">{t.lead}</p>
          <div className="xc__methods h-in">
            <p className="h-micro">{t.methodsLabel}</p>
            <ul>
              {t.methods.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="h-note">{t.methodsNote}</p>
          </div>
          <div className="xc__cta h-in">
            <Link className="h-btn h-btn--gold" data-magnetic="" href="/extensions">
              <span>{t.cta}</span> <Arrow />
            </Link>
            <Link className="h-link" href={{ pathname: "/anfrage", query: { thema: "salon" } }}>
              {t.salon}
            </Link>
          </div>
        </header>

        <div className="xc__shelf">
          <ul aria-label={t.galleryLabel} className="xc__gallery">
            {pieces.map((p, i) => (
              <li className="xp h-in" key={p.slug} style={{ "--k": i } as CSSProperties}>
                <div className="xp__stage" data-tilt="">
                  <Link aria-label={p.label} className="xp__media" data-lens="" href={`/produkt/${p.slug}`}>
                    <Image alt="" height={1600} sizes="(max-width: 900px) 72vw, (max-width: 1240px) 30vw, 380px" src={p.image} width={1200} />
                    <span aria-hidden="true" className="xp__cone" />
                  </Link>
                  <div aria-hidden="true" className="xp__floor">
                    <Image alt="" height={1600} sizes="(max-width: 900px) 72vw, (max-width: 1240px) 30vw, 380px" src={p.image} width={1200} />
                  </div>
                </div>
                <div className="xp__body">
                  <h3 className="xp__name">
                    <Link href={`/produkt/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p className="xp__color">{p.color}</p>
                  <p className="xp__price">{p.price}</p>
                  {p.unit ? <p className="xp__unit">{p.unit}</p> : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="xc__fine">
            <p>{t.imageNote}</p>
            <p>{priceNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
