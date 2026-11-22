"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { deltaE2000, estimateHairLab, hexToLab, matchPercent, rgbToLab } from "@/lib/color-match";
import type { Lab } from "@/lib/color-match";

import { useCatalogTools } from "./CatalogTools";

/**
 * Modul 3: Eigenhaar lokal abgleichen. Foto → Canvas 64 × 64 → typische Haarfarbe → Abstand zu den
 * Katalogfarben. Das Foto wird nie hochgeladen und nicht gespeichert.
 */
const DEMOS: { id: "demoDark" | "demoChestnut" | "demoGold"; hex: string }[] = [
  { hex: "#3a2a20", id: "demoDark" },
  { hex: "#5a3a2a", id: "demoChestnut" },
  { hex: "#c8a55a", id: "demoGold" },
];

export function ColorMatcher({ swatches }: { swatches: { slug: string; hex: string }[] }) {
  const t = useTranslations("cat");
  const c = useTranslations("common");
  const { match, setMatch } = useCatalogTools();
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState(false);

  const apply = (lab: Lab) => {
    const scores: Record<string, number> = {};
    for (const swatch of swatches) scores[swatch.slug] = matchPercent(deltaE2000(lab, hexToLab(swatch.hex)));
    setMatch(scores);
    dialog.current?.close();
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(false);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("canvas");
      // mittleren Bildbereich quadratisch ausschneiden
      const side = Math.min(image.naturalWidth, image.naturalHeight);
      ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 64, 64);
      const lab = estimateHairLab(ctx.getImageData(0, 0, 64, 64).data, 64, 64);
      if (!lab) throw new Error("no hair");
      apply(lab);
    } catch {
      setError(true);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {match ? (
        <button className="af-seg-btn" onClick={() => setMatch(null)} type="button">
          {t("matchClear")}
        </button>
      ) : (
        <button className="af-seg-btn" onClick={() => dialog.current?.showModal()} type="button">
          {t("matchOpen")}
        </button>
      )}
      <dialog aria-labelledby="match-title" className="af-modal" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()} ref={dialog}>
        <div className="af-modal__in">
          <button aria-label={c("close")} className="af-drawer__x af-modal__x" onClick={() => dialog.current?.close()} type="button">
            <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
              <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <h2 className="af-h3" id="match-title">
            {t("matchTitle")}
          </h2>
          <p className="af-text">{t("matchLead")}</p>
          <label className="af-cta-gold af-glass af-glass--gold af-filebtn">
            <span>{t("matchFile")}</span>
            <input accept="image/*" className="af-sr" onChange={(e) => void onFile(e.target.files?.[0])} type="file" />
          </label>
          {error ? (
            <p className="af-msg" data-kind="error" role="alert">
              {t("matchError")}
            </p>
          ) : null}
          <p className="af-mono">{t("matchDemo")}</p>
          <div className="af-demos">
            {DEMOS.map((demo) => (
              <button key={demo.id} onClick={() => apply(rgbToLab(...(hexToRgb(demo.hex) as [number, number, number])))} type="button">
                <span aria-hidden="true" style={{ background: demo.hex }} />
                {t(demo.id)}
              </button>
            ))}
          </div>
          <p className="af-note">{t("matchNote")}</p>
        </div>
      </dialog>
    </>
  );
}

function hexToRgb(hex: string): number[] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
