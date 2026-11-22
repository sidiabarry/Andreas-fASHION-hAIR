"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Gemeinsamer Zustand der Kollektion: Foto-Ansicht (Studio/Original, Modul 4), Lichtvorschau
 * (Modul 5) und Farbabgleich (Modul 3). Ohne Provider (Startseite, Produktseite) gelten die Standardwerte.
 */
export type PhotoMode = "studio" | "original";
export type LightMode = "day" | "warm" | "office";

type Value = {
  mode: PhotoMode;
  setMode: (mode: PhotoMode) => void;
  light: LightMode;
  setLight: (light: LightMode) => void;
  match: Record<string, number> | null;
  setMatch: (match: Record<string, number> | null) => void;
};

const DEFAULT: Value = { light: "day", match: null, mode: "studio", setLight: () => undefined, setMatch: () => undefined, setMode: () => undefined };
const Ctx = createContext<Value>(DEFAULT);

export function CatalogTools({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PhotoMode>("studio");
  const [light, setLight] = useState<LightMode>("day");
  const [match, setMatch] = useState<Record<string, number> | null>(null);
  const value = useMemo(() => ({ light, match, mode, setLight, setMatch, setMode }), [light, match, mode]);
  return (
    <Ctx.Provider value={value}>
      <div className="af-cat" data-light={light}>
        <svg aria-hidden="true" className="af-cat__defs" focusable="false">
          <defs>
            <filter colorInterpolationFilters="sRGB" id="af-light-warm">
              <feColorMatrix type="matrix" values="1.08 0 0 0 0.01  0 0.98 0 0 0  0 0 0.8 0 0  0 0 0 1 0" />
            </filter>
            <filter colorInterpolationFilters="sRGB" id="af-light-office">
              <feColorMatrix type="matrix" values="0.93 0 0 0 0  0 0.99 0 0 0  0 0 1.1 0 0.01  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useCatalogTools(): Value {
  return useContext(Ctx);
}
