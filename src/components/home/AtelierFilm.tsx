"use client";

import { useState, type ReactNode } from "react";

export function AtelierFilm({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="atelier-film"
      id="atelierfilm"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span aria-hidden="true" className="atelier-film__play" />
        {label}
      </summary>
      {open ? children : null}
    </details>
  );
}
