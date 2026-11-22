"use client";

import { useLocale } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { formatDimensions, formatLength } from "@/lib/units";
import type { LengthUnit } from "@/lib/units";

/**
 * Anzeige-Vorlieben auf diesem Gerät (Einheit, Körpergröße). Nur localStorage, keine Übertragung;
 * technisch notwendig für die ausdrücklich gewählte Anzeige (§ 25 Abs. 2 Nr. 2 TDDDG).
 */
const KEY = "afh-prefs-v1";

type Prefs = { unit: LengthUnit; heightCm: number | null };
type Value = Prefs & {
  setUnit: (unit: LengthUnit) => void;
  setHeightCm: (cm: number | null) => void;
  length: (cm: number) => string;
  dimensions: (width: number, height: number) => string;
};

const DEFAULTS: Prefs = { heightCm: null, unit: "cm" };
const Ctx = createContext<Value | null>(null);

function read(): Prefs {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Partial<Prefs>;
    const unit = parsed.unit === "in" ? "in" : "cm";
    const height = typeof parsed.heightCm === "number" && parsed.heightCm >= 120 && parsed.heightCm <= 210 ? Math.round(parsed.heightCm) : null;
    return { heightCm: height, unit };
  } catch {
    return DEFAULTS;
  }
}

export function ShopPreferences({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    // Gerätewerte erst nach dem Mounten lesen (Server kennt sie nicht, sonst Hydration-Abweichung)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(read());
  }, []);

  const save = useCallback((next: Prefs) => {
    setPrefs(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // privater Modus: gilt bis zum Neuladen
    }
  }, []);

  const value = useMemo<Value>(
    () => ({
      ...prefs,
      dimensions: (w, h) => formatDimensions(w, h, prefs.unit, locale),
      length: (cm) => formatLength(cm, prefs.unit, locale),
      setHeightCm: (heightCm) => save({ ...prefs, heightCm }),
      setUnit: (unit) => save({ ...prefs, unit }),
    }),
    [locale, prefs, save],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShopPrefs(): Value {
  const value = useContext(Ctx);
  if (!value) throw new Error("useShopPrefs braucht <ShopPreferences>");
  return value;
}
