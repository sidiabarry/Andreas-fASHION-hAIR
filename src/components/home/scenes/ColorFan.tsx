"use client";

import Image from "next/image";
import { useState, type CSSProperties, type KeyboardEvent } from "react";

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
  lightLabel: string;
  lightDay: string;
  lightWarm: string;
  view: string;
};

/**
 * Farbe und Menge als „Seiden-Accordion“: echte Studioaufnahmen ganzer Strähnen, ohne Zoom und ohne gemalte
 * Farbverläufe, damit Farbe und Ombré (Ansatz → Spitze) so erscheinen, wie sie sind. Die gewählte Strähne öffnet
 * sich breit, die anderen bleiben schmale Streifen; am Ende „Ihre Farbe nicht dabei? Nach Maß“.
 * „Warmes Licht“ ist nur eine Vorschau (Filter); Tageslicht zeigt das unveränderte Foto.
 * Daneben der Farbabgleich in drei Schritten und genau ein Hauptknopf: Foto an Andrea.
 */
export function ColorFan({ t, swatches, whatsapp, whatsappNote }: { t: ColorTexts; swatches: Swatch[]; whatsapp: string | null; whatsappNote: string }) {
  const total = swatches.length + 1;
  const [active, setActive] = useState(Math.min(2, swatches.length - 1));
  const [warm, setWarm] = useState(false);

  const onKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + total) % total;
    setActive(next);
    event.currentTarget.querySelectorAll<HTMLElement>(".cf__open")[next]?.focus();
  };

  return (
    <section aria-labelledby="color-title" className="cf" data-fx="strands" data-fx-a="0.35" data-fx-ma="0.2" data-fx-s="0.55" data-fx-x="-0.45" data-fx-y="0.1">
      <div className="af-wrap cf__grid">
        <div className="cf__stage h-in" data-light={warm ? "warm" : "day"}>
          <div aria-label={t.lightLabel} className="cf__light" role="group">
            <button aria-pressed={!warm} onClick={() => setWarm(false)} type="button">
              {t.lightDay}
            </button>
            <button aria-pressed={warm} onClick={() => setWarm(true)} type="button">
              {t.lightWarm}
            </button>
          </div>

          <ul aria-label={t.fanLabel} className="cf__panels" onKeyDown={onKey}>
            {swatches.map((s, i) => {
              const open = i === active;
              return (
                <li className="cf__panel" data-open={open} key={s.slug} onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)} style={{ "--focus": s.focus } as CSSProperties}>
                  <Image alt="" className="cf__photo" fill sizes="(max-width: 639px) 92vw, (max-width: 1100px) 40vw, 320px" src={s.image} />
                  <button aria-expanded={open} className="cf__open" onClick={() => setActive(i)} tabIndex={open ? 0 : -1} type="button">
                    <span className="cf__idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cf__label">{s.color}</span>
                  </button>
                  <div className="cf__detail" inert={!open}>
                    <span className="cf__idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cf__name">{s.color}</span>
                    <Link className="cf__view" href={`/produkt/${s.slug}`}>
                      {t.view} <Arrow />
                    </Link>
                  </div>
                </li>
              );
            })}
            <li className="cf__panel cf__panel--own" data-open={active === swatches.length} onPointerEnter={(e) => e.pointerType === "mouse" && setActive(swatches.length)}>
              <button aria-expanded={active === swatches.length} className="cf__open" onClick={() => setActive(swatches.length)} tabIndex={active === swatches.length ? 0 : -1} type="button">
                <span aria-hidden="true" className="cf__plus" />
                <span className="cf__label">{t.customTitle}</span>
              </button>
              <div className="cf__detail" inert={active !== swatches.length}>
                <span aria-hidden="true" className="cf__plus" />
                <span className="cf__name">{t.customTitle}</span>
                <Link className="cf__view" href="/massanfertigung">
                  {t.customText} <Arrow />
                </Link>
              </div>
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
