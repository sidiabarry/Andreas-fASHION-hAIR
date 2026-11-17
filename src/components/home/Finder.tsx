"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

type Tab = { id: string; label: string; panel: ReactNode };

/** Bedarfs-Reiter mit korrekten Rollen (tablist/tab/tabpanel) und Pfeiltasten-Bedienung. */
export function Finder({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <>
      <div aria-label={label} className="af-finder__tabs" role="tablist">
        {tabs.map((tab, index) => (
          <button
            aria-controls={`finder-panel-${tab.id}`}
            aria-selected={active === index}
            className="af-tab"
            id={`finder-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKey(event, index)}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="tab"
            tabIndex={active === index ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div aria-labelledby={`finder-tab-${tab.id}`} hidden={active !== index} id={`finder-panel-${tab.id}`} key={tab.id} role="tabpanel" tabIndex={0}>
          {tab.panel}
        </div>
      ))}
    </>
  );
}
