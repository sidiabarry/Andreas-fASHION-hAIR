"use client";

import Image from "next/image";

import { Link } from "@/i18n/navigation";

import { useCycle } from "./useCycle";

export type SpotlightPiece = { slug: string; name: string; subtitle: string; image: string; price: string; unit?: string | null; flag: string | null };

/**
 * Echte Stücke mit Preis (und Grundpreis) direkt im Hero, im Wechsel.
 * Wechselt nur, solange sichtbar und nicht berührt/fokussiert; bei reduzierter Bewegung steht es still.
 */
export function HeroSpotlight({
  pieces,
  title,
  showTemplate,
  prevLabel,
  nextLabel,
}: {
  pieces: SpotlightPiece[];
  title: string;
  /** z. B. „Stück {index} von {total} zeigen“ */
  showTemplate: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const { index, ref, select } = useCycle<HTMLDivElement>(pieces.length, 4200);
  const total = pieces.length;
  if (!total) return null;
  return (
    <div className="af-hx__spot" ref={ref}>
      <div className="af-hx__spothead">
        <p className="af-mono">
          <span aria-hidden="true" className="af-hx__dot" /> {title}
        </p>
        <div className="af-hx__arrows">
          <button aria-label={prevLabel} onClick={() => select((index - 1 + total) % total)} type="button">
            <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
              <path d="M7.5 2 3.5 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button aria-label={nextLabel} onClick={() => select((index + 1) % total)} type="button">
            <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
              <path d="m4.5 2 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="af-hx__stage">
        {pieces.map((piece, i) => (
          <Link
            aria-hidden={i !== index}
            className="af-hx__piece"
            data-active={i === index}
            href={`/produkt/${piece.slug}`}
            inert={i !== index}
            key={piece.slug}
            tabIndex={i === index ? 0 : -1}
          >
            <span className="af-hx__pieceimg">
              <Image alt="" fill priority={i === 0} sizes="(max-width: 759px) 46vw, (max-width: 1099px) 38vw, 300px" src={piece.image} />
              {piece.flag ? <span className="af-card__flag af-glass af-glass--badge">{piece.flag}</span> : null}
            </span>
            <span className="af-hx__piecebody">
              <span className="af-hx__piecename">{piece.name}</span>
              <span className="af-hx__piecesub">{piece.subtitle}</span>
              <span className="af-hx__pieceprice">{piece.price}</span>
              {piece.unit ? <span className="af-hx__pieceunit">{piece.unit}</span> : null}
            </span>
          </Link>
        ))}
      </div>
      <div className="af-hx__dots">
        {pieces.map((piece, i) => (
          <button aria-current={i === index} aria-label={showTemplate.replace("{index}", String(i + 1)).replace("{total}", String(total))} key={piece.slug} onClick={() => select(i)} type="button">
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
