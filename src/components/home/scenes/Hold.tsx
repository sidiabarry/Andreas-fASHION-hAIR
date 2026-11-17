import { Words } from "../Words";

/**
 * Wie es hält und sich anfühlt: drei kleine Zeichnungen, die sich beim Erscheinen einmal selbst
 * vorführen (Clip schließt sich · Basis legt sich flach · Pflege-Tropfen), dann ruhen.
 */
function Drawing({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <svg aria-hidden="true" className="hold__svg hold__svg--clip" viewBox="0 0 200 120">
        <g className="hold__hair">
          {Array.from({ length: 13 }, (_, i) => (
            <path d={`M${30 + i * 11} 18 C ${26 + i * 11} 60 ${36 + i * 11} 80 ${30 + i * 11} 112`} key={i} />
          ))}
        </g>
        <g className="hold__clip">
          <rect height="10" rx="5" width="92" x="54" y="44" />
          <path className="hold__teeth" d="M60 54 v18 M72 54 v18 M84 54 v18 M96 54 v18 M108 54 v18 M120 54 v18 M132 54 v18 M144 54 v18" />
        </g>
      </svg>
    );
  if (kind === 1)
    return (
      <svg aria-hidden="true" className="hold__svg hold__svg--base" viewBox="0 0 200 120">
        <path className="hold__scalp" d="M14 92 C 60 64 140 64 186 92" />
        <path className="hold__skin" d="M40 80 C 76 64 124 64 160 80" />
        <g className="hold__hair">
          {Array.from({ length: 15 }, (_, i) => {
            const x = 46 + i * 8;
            const y = 77 - Math.sin((i / 14) * Math.PI) * 9;
            return <path d={`M${x} ${y} C ${x - 4} ${y - 30} ${x + 10} ${y - 50} ${x + 2} ${y - 66}`} key={i} />;
          })}
        </g>
      </svg>
    );
  return (
    <svg aria-hidden="true" className="hold__svg hold__svg--care" viewBox="0 0 200 120">
      <path className="hold__bottle" d="M86 26 h28 v10 l8 10 v58 a6 6 0 0 1 -6 6 h-32 a6 6 0 0 1 -6 -6 v-58 l8 -10 z" />
      <path className="hold__drop" d="M150 40 c 8 12 12 18 12 24 a 12 12 0 0 1 -24 0 c 0 -6 4 -12 12 -24 z" />
      <path className="hold__tape" d="M30 86 h44 v10 h-44 z" />
    </svg>
  );
}

export function Hold({ t, whatsapp, ctaNote }: { t: { kicker: string; title: string; items: { title: string; text: string }[]; cta: string }; whatsapp: string | null; ctaNote: string }) {
  return (
    <section aria-labelledby="hold-title" className="hold">
      <div className="af-wrap">
        <header className="h-head h-in">
          <p className="h-eyebrow">{t.kicker}</p>
          <h2 className="h-title" id="hold-title">
            <Words text={t.title} />
          </h2>
        </header>
        <ol className="hold__grid">
          {t.items.map((item, i) => (
            <li className="hold__item h-in" key={item.title} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="hold__art">
                <Drawing kind={i} />
              </div>
              <p className="hold__num">0{i + 1}</p>
              <h3 className="h-subtitle">{item.title}</h3>
              <p className="h-text">{item.text}</p>
            </li>
          ))}
        </ol>
        {whatsapp ? (
          <p className="hold__cta h-in">
            <a className="h-link" href={whatsapp} rel="noopener noreferrer" target="_blank">
              {t.cta}
              <span className="af-sr"> ({ctaNote})</span>
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
