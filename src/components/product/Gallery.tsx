"use client";

import Image from "next/image";
import { useState } from "react";

type Shot = { src: string; alt: string; label: string };

export function Gallery({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const current = shots[Math.min(index, shots.length - 1)];
  return (
    <>
      <div className="af-pdp__main">
        <Image alt={current.alt} height={1600} key={current.src} priority={index === 0} sizes="(max-width: 900px) 100vw, 640px" src={current.src} width={1200} />
      </div>
      {shots.length > 1 ? (
        <div className="af-pdp__thumbs">
          {shots.map((shot, i) => (
            <button aria-label={shot.label} aria-pressed={i === index} className="af-thumb" key={shot.src} onClick={() => setIndex(i)} type="button">
              <Image alt="" height={108} sizes="84px" src={shot.src} width={84} />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
