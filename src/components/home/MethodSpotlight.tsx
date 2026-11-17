"use client";

import { useCycle } from "./useCycle";

/**
 * Sechs Extension-Methoden: alle Namen stehen immer da, eine nach der anderen wird von selbst
 * ins Licht gerückt (mit Beschreibung). Antippen springt direkt dorthin – nötig ist es nie.
 */
export function MethodSpotlight({ methods, label }: { methods: { name: string; text: string }[]; label: string }) {
  const { index, ref, running, select } = useCycle<HTMLDivElement>(methods.length, 4800);
  return (
    <div className="methods" data-running={running || undefined} ref={ref}>
      <p className="h-eyebrow">{label}</p>
      <ol className="methods__list">
        {methods.map((m, i) => (
          <li data-on={i === index || undefined} key={m.name}>
            <button aria-expanded={i === index} aria-controls={`method-${i}`} onClick={() => select(i)} type="button">
              <span className="methods__num">0{i + 1}</span>
              <span className="methods__name">{m.name}</span>
              <span aria-hidden="true" className="methods__bar">
                <span key={`${index}-${running}`} />
              </span>
            </button>
            <p className="methods__text" hidden={i !== index} id={`method-${i}`}>
              {m.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
