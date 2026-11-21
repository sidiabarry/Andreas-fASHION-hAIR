import Image from "next/image";

import { Arrow } from "@/components/Arrow";
import { HairStage } from "@/components/fx/HairStage";
import { Logo } from "@/components/Logo";
import { company } from "@/config/company";
import { Link } from "@/i18n/navigation";

import { Words } from "../Words";

type HandTexts = { kicker: string; title: string; lead: string; quote: string; by: string; cta: string; visitTitle: string; visitCta: string; imageAlt: string };

/** Die Hand dahinter: Andrea, eigene Erfahrung, Zitat, Atelier-Besuch. */
export function Hand({ t, hours, whatsapp, whatsappNote, symbolImage }: { t: HandTexts; hours: string; whatsapp: string | null; whatsappNote: string; symbolImage: string }) {
  const a = company.address;
  return (
    <section aria-labelledby="hand-title" className="hand" data-fx="phoenix" data-fx-a="0.4" data-fx-ma="0.22" data-fx-ms="0.4" data-fx-my="0.55" data-fx-s="0.34" data-fx-x="-0.5" data-fx-y="0.05">
      <div className="af-wrap hand__grid">
        <figure className="hand__media h-in h-lightedge">
          <Image alt={t.imageAlt} height={1194} sizes="(max-width: 900px) 100vw, 50vw" src="/assets/content/mirror.jpg" width={1600} />
          <figcaption>{symbolImage}</figcaption>
        </figure>
        <div className="hand__copy">
          <p className="h-eyebrow h-in">{t.kicker}</p>
          <h2 className="h-title h-in" id="hand-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead h-in">{t.lead}</p>
          <figure className="hand__quote h-in">
            <Logo size={34} variant="mark" />
            <blockquote>{t.quote}</blockquote>
            <figcaption>{t.by}</figcaption>
          </figure>
          <Link className="h-btn h-btn--gold af-glass af-glass--gold h-in" href="/ueber-andrea">
            <span>{t.cta}</span> <Arrow />
          </Link>
          <div className="hand__visit h-in">
            <h3 className="h-subtitle">{t.visitTitle}</h3>
            <address>
              {a.street}, {a.postalCode} {a.city}
              <br />
              {hours}
            </address>
            {whatsapp ? (
              <a className="h-link" href={whatsapp} rel="noopener noreferrer" target="_blank">
                {t.visitCta}
                <span className="af-sr"> ({whatsappNote})</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

type ConcernTexts = { title: string; lead: string; items: { q: string; a: string }[]; returnsLink: string; cta: string };

/** Alle Bedenken, offen sichtbar (kein Akkordeon). */
export function Concerns({ t, whatsapp, whatsappNote }: { t: ConcernTexts; whatsapp: string | null; whatsappNote: string }) {
  return (
    <section aria-labelledby="concerns-title" className="concerns af-zone-light af-zone-fade-top af-zone-fade-bottom" id="fragen">
      <div className="af-wrap">
        <header className="h-head h-in">
          <h2 className="h-title" id="concerns-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead">{t.lead}</p>
        </header>
        <dl className="concerns__grid">
          {t.items.map((item, i) => (
            <div className="concerns__item h-in" key={item.q} style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
              <dt>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {item.q}
              </dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
        <div className="concerns__cta h-in">
          {whatsapp ? (
            <a className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href={whatsapp} rel="noopener noreferrer" target="_blank">
              <span>{t.cta}</span> <Arrow />
              <span className="af-sr"> ({whatsappNote})</span>
            </a>
          ) : (
            <Link className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href="/anfrage">
              <span>{t.cta}</span> <Arrow />
            </Link>
          )}
          <Link className="h-link" href="/widerruf">
            {t.returnsLink}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Drei Schritte mit goldenem Faden, der sich beim Erscheinen einmal durchzieht. */
export function Steps({ t }: { t: { title: string; items: { title: string; text: string }[]; cta: string } }) {
  const numerals = ["I", "II", "III"];
  return (
    <section aria-labelledby="steps-title" className="steps" data-fx="thread" data-fx-a="0.45" data-fx-ma="0.25" data-fx-s="0.62" data-fx-x="0" data-fx-y="-0.02">
      <div className="af-wrap">
        <header className="h-head h-head--center h-in">
          <h2 className="h-title" id="steps-title">
            <Words text={t.title} />
          </h2>
        </header>
        <div className="steps__line h-in" aria-hidden="true">
          <svg preserveAspectRatio="none" viewBox="0 0 1000 40">
            <path d="M0 20 C 160 0 340 40 500 20 S 840 0 1000 20" />
          </svg>
        </div>
        <ol className="steps__list">
          {t.items.map((step, i) => (
            <li className="h-in" key={step.title} style={{ transitionDelay: `${300 + i * 260}ms` }}>
              <span aria-hidden="true" className="steps__num">
                {numerals[i]}
              </span>
              <h3 className="h-subtitle">{step.title}</h3>
              <p className="h-text">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="steps__cta h-in">
          <Link className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href="/extensions">
            <span>{t.cta}</span> <Arrow />
          </Link>
        </p>
      </div>
    </section>
  );
}

/**
 * Abschluss „Wie neu geboren“: Haar fällt als Vorhang und ordnet sich zum Phönix (WebGL-Simulation,
 * reagiert auf Zeiger und Scroll). Ohne WebGL oder bei reduzierter Bewegung: Phönix aus Haar als Bild.
 */
export function Close({ t, ctaExtensions, ctaCustom, symbolImage }: { t: { title: string; lead: string; imageAlt: string }; ctaExtensions: string; ctaCustom: string; symbolImage: string }) {
  return (
    <section aria-labelledby="close-title" className="close" data-fx="embers" data-fx-a="0.45" data-fx-heat="1" data-fx-loose="0.6" data-fx-ma="0.3" data-fx-s="1.1" data-fx-x="0.3" data-fx-y="-0.75">
      <HairStage my={0.3} mscale={0.95} scale={0.7} x={0.7} y={0.56} />
      <div className="close__media">
        <Image alt={t.imageAlt} fill sizes="100vw" src="/assets/content/phoenix.jpg" />
        <span className="close__note">{symbolImage}</span>
      </div>
      <div className="af-wrap close__in">
        <Logo size={56} variant="mark" />
        <h2 className="h-title h-title--xl h-in" id="close-title">
          <Words text={t.title} />
        </h2>
        <p className="h-lead h-in">{t.lead}</p>
        <div className="hero__actions h-in">
          <Link className="h-btn h-btn--gold af-glass af-glass--gold" data-magnetic="" href="/extensions">
            <span>{ctaExtensions}</span> <Arrow />
          </Link>
          <Link className="h-link" href="/massanfertigung">
            {ctaCustom}
          </Link>
        </div>
      </div>
    </section>
  );
}
