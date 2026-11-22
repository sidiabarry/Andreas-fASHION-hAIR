"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";

import { useShopPrefs } from "@/components/site/ShopPreferences";

/**
 * Modul 10: Wie fällt das Haar bei mir? Körpergröße einstellen, Silhouette zeigt die Haarspitze.
 * Orientierung nach Körperproportionen (Anteile der Körpergröße); das Haar fällt über die Kopfform,
 * deshalb werden 5 cm von der gemessenen Länge abgezogen.
 */
const ZONES = [
  { key: "zoneChin", max: 0.13 },
  { key: "zoneShoulder", max: 0.178 },
  { key: "zoneCollar", max: 0.215 },
  { key: "zoneChest", max: 0.285 },
] as const;

export function zoneKey(lengthCm: number, heightCm: number): string {
  const drop = Math.max(0, lengthCm - 5) / heightCm;
  return ZONES.find((zone) => drop <= zone.max)?.key ?? "zoneWaist";
}

export function HeightSimulator({ lengthCm }: { lengthCm: number }) {
  const t = useTranslations("pdp");
  const prefs = useShopPrefs();
  const id = useId();
  const height = prefs.heightCm ?? 165;
  const zone = zoneKey(lengthCm, height);

  // Zeichnung: 1 cm = 3,6 Einheiten; Scheitelpunkt bei y = 14
  const k = 3.6;
  const top = 14;
  const y = (cm: number) => top + cm * k;
  const drop = Math.max(0, lengthCm - 5);
  const tipY = y(drop);
  const headW = height * 0.062 * k;
  const shoulderW = height * 0.255 * k;
  const chinY = y(height * 0.13);
  const shoulderY = y(height * 0.182);
  const cx = 110;

  return (
    <div className="af-pdp__helper-body">
      <label className="af-pdp__slider" htmlFor={id}>
        <span>{t("heightLabel")}</span>
        <output htmlFor={id}>{prefs.length(height)}</output>
      </label>
      <input id={id} max={185} min={150} onChange={(event) => prefs.setHeightCm(Number(event.target.value))} step={1} type="range" value={height} />
      <svg aria-hidden="true" className="af-pdp__figure" viewBox="0 0 220 300">
        <path d={`M${cx - shoulderW / 2} 300 L${cx - shoulderW / 2} ${shoulderY + 14} Q${cx - shoulderW / 2} ${shoulderY} ${cx - shoulderW / 2 + 22} ${shoulderY - 3} Q${cx - headW / 2 - 4} ${shoulderY - 8} ${cx - headW / 4} ${chinY - 4} L${cx + headW / 4} ${chinY - 4} Q${cx + headW / 2 + 4} ${shoulderY - 8} ${cx + shoulderW / 2 - 22} ${shoulderY - 3} Q${cx + shoulderW / 2} ${shoulderY} ${cx + shoulderW / 2} ${shoulderY + 14} L${cx + shoulderW / 2} 300Z`} fill="var(--af-surface)" stroke="var(--af-line)" />
        <path d={`M${cx - headW / 2 - 4} ${top + 8} Q${cx - headW / 2 - 8} ${tipY} ${cx - headW / 2 + 6} ${tipY} L${cx + headW / 2 - 6} ${tipY} Q${cx + headW / 2 + 8} ${tipY} ${cx + headW / 2 + 4} ${top + 8} Q${cx} ${top - 8} ${cx - headW / 2 - 4} ${top + 8}Z`} fill="#c6a276" opacity="0.92" />
        <ellipse cx={cx} cy={(top + chinY) / 2 + 2} fill="var(--af-raise)" rx={headW / 2 - 4} ry={(chinY - top) / 2 - 4} stroke="var(--af-line)" />
        <line stroke="var(--af-gold)" strokeDasharray="4 4" strokeWidth="1.5" x1="20" x2="200" y1={tipY} y2={tipY} />
      </svg>
      <p aria-live="polite" className="af-pdp__result">
        {t("heightResult", { height: prefs.length(height), length: prefs.length(lengthCm), zone: t(zone) })}
      </p>
      <p className="af-note">{t("heightNote")}</p>
    </div>
  );
}
