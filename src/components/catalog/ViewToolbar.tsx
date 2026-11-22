"use client";

import { useTranslations } from "next-intl";

import { useCatalogTools } from "./CatalogTools";
import type { LightMode, PhotoMode } from "./CatalogTools";

/** Module 4 und 5: Foto-Ansicht und Lichtvorschau als zwei ruhige Umschalter. */
export function ViewToolbar({ children }: { children?: React.ReactNode }) {
  const t = useTranslations("cat");
  const { mode, setMode, light, setLight } = useCatalogTools();
  const photo: { id: PhotoMode; label: string }[] = [
    { id: "studio", label: t("photoStudio") },
    { id: "original", label: t("photoOriginal") },
  ];
  const lights: { id: LightMode; label: string }[] = [
    { id: "day", label: t("lightDay") },
    { id: "warm", label: t("lightWarm") },
    { id: "office", label: t("lightOffice") },
  ];
  return (
    <div aria-label={t("toolsLabel")} className="af-viewbar" role="group">
      <div aria-label={t("photoLabel")} className="af-seg" role="group">
        {photo.map((p) => (
          <button aria-pressed={mode === p.id} key={p.id} onClick={() => setMode(p.id)} type="button">
            {p.label}
          </button>
        ))}
      </div>
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
