"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { useCycle } from "./useCycle";

export type Shot = { src: string; alt: string; label: string; text: string; focus: string };

/**
 * „Sieht man das?“ – langsame Kamerafahrten über echte Produktfotos (Ken Burns), mit Untertiteln,
 * die die Frage aufgreifen. Läuft von selbst; jede Bildunterschrift ist zugleich Sprungmarke.
 */
export function RealCycler({ shots, progress }: { shots: Shot[]; progress: string[] }) {
  const { index, ref, running, select } = useCycle<HTMLDivElement>(shots.length, 6200);
  return (
    <div className="real__stage" data-running={running || undefined} ref={ref}>
      <div className="real__frame h-lightedge">
        {shots.map((shot, i) => (
          <div className="real__shot" data-on={i === index || undefined} key={shot.src} style={{ "--focus": shot.focus } as CSSProperties}>
            <Image alt={i === index ? shot.alt : ""} aria-hidden={i !== index || undefined} fill sizes="(max-width: 900px) 100vw, 70vw" src={shot.src} />
          </div>
        ))}
        <div aria-hidden="true" className="real__loupe" />
        <p className="real__counter" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
        </p>
      </div>
      <ol className="real__captions">
        {shots.map((shot, i) => (
          <li data-on={i === index || undefined} key={shot.label}>
            <button aria-current={i === index || undefined} aria-label={`${shot.label}. ${progress[i]}`} onClick={() => select(i)} type="button">
              <span className="real__label">{shot.label}</span>
              <span aria-hidden="true" className="methods__bar">
                <span key={`${index}-${running}`} />
              </span>
            </button>
            <p className="real__text">{shot.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
