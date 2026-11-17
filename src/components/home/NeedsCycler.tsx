"use client";

import type { ReactNode } from "react";

import { useCycle } from "./useCycle";

/**
 * „Was fehlt Ihnen gerade?“ – die Situationen wechseln von selbst und zeigen die passenden Stücke
 * mit Preis. Eine Situation antippen hält die Auswahl fest.
 */
export function NeedsCycler({ needs, panels, label }: { needs: { id: string; label: string; caption: string }[]; panels: ReactNode[]; label: string }) {
  const { index, ref, running, select } = useCycle<HTMLDivElement>(needs.length, 6500);
  return (
    <div className="needs__body" data-running={running || undefined} ref={ref}>
      <ul aria-label={label} className="needs__list">
        {needs.map((need, i) => (
          <li data-on={i === index || undefined} key={need.id}>
            <button aria-controls={`need-${need.id}`} aria-expanded={i === index} onClick={() => select(i)} type="button">
              <span className="needs__num">0{i + 1}</span>
              <span className="needs__label">{need.label}</span>
              <span className="needs__caption">{need.caption}</span>
              <span aria-hidden="true" className="methods__bar">
                <span key={`${index}-${running}`} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="needs__panels">
        {panels.map((panel, i) => (
          <div className="needs__panel" data-on={i === index || undefined} hidden={i !== index} id={`need-${needs[i].id}`} key={needs[i].id}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
