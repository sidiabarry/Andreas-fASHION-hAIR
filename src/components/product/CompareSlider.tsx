"use client";

import Image from "next/image";
import { useState } from "react";

/** Vergleich Studiolicht ↔ Originalfoto. Bedienbar per Maus, Touch und Tastatur (range-Eingabe). */
export function CompareSlider({ studio, original, label, studioLabel, originalLabel }: { studio: string; original: string; label: string; studioLabel: string; originalLabel: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="af-compare" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      <Image alt={originalLabel} className="af-compare__img" fill sizes="(max-width: 900px) 100vw, 640px" src={original} />
      <div className="af-compare__top">
        <Image alt={studioLabel} className="af-compare__img" fill sizes="(max-width: 900px) 100vw, 640px" src={studio} />
      </div>
      <span aria-hidden="true" className="af-compare__line" />
      <span aria-hidden="true" className="af-compare__tag af-compare__tag--l">{studioLabel}</span>
      <span aria-hidden="true" className="af-compare__tag af-compare__tag--r">{originalLabel}</span>
      <input aria-label={label} className="af-compare__range" max={100} min={0} onChange={(e) => setPos(Number(e.target.value))} step={1} type="range" value={pos} />
    </div>
  );
}
