"use client";

import { useTranslations } from "next-intl";

import { useCatalogTools } from "./CatalogTools";
import type { LightMode } from "./CatalogTools";

/** Modul 5: Lichtvorschau als ruhiger Umschalter. Die Foto-Ansicht Studio/Original ist entfernt (Auftraggeber 27.11.2026). */
export function ViewToolbar({ children }: { children?: React.ReactNode }) {
  const t = useTranslations("cat");
  const { light, setLight } = useCatalogTools();
  const lights: { id: LightMode; label: string }[] = [
    { id: "day", label: t("lightDay") },
    { id: "warm", label: t("lightWarm") },
    { id: "office", label: t("lightOffice") },
  ];
  return (
    <div aria-label={t("toolsLabel")} className="af-viewbar" role="group">
      <div aria-label={t("lightLabel")} className="af-seg" role="group" title={t("lightNote")}>
        {lights.map((l) => (
          <button aria-pressed={light === l.id} key={l.id} onClick={() => setLight(l.id)} type="button">
            {l.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
