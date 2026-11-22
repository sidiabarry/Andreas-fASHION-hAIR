"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import { useShopPrefs } from "@/components/site/ShopPreferences";

/**
 * Modul 9: Basis in Originalgröße. Die Kundin gleicht ein Rechteck an ihre Bankkarte (85,6 × 54 mm)
 * an; daraus ergibt sich, wie viele Pixel ein Millimeter auf diesem Bildschirm sind.
 */
const KEY = "afh-kalibrierung-v1";
const CARD_MM = 85.6;
const CARD_H_MM = 54;

export function BasisScale({ widthCm, heightCm }: { widthCm: number; heightCm: number }) {
  const t = useTranslations("pdp");
  const prefs = useShopPrefs();
  const id = useId();
  const [cardPx, setCardPx] = useState(324);

  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(KEY));
      // gespeicherte Kalibrierung dieses Geräts erst nach dem Mounten lesen
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored >= 160 && stored <= 560) setCardPx(stored);
    } catch {
      /* ignorieren */
    }
  }, []);

  const pxPerMm = cardPx / CARD_MM;
  const w = widthCm * 10 * pxPerMm;
  const h = heightCm * 10 * pxPerMm;
  const fits = typeof window === "undefined" ? true : w <= Math.max(240, window.innerWidth - 80);

  return (
    <div className="af-pdp__helper-body">
      <p className="af-text">{t("baseLead")}</p>
      <label className="af-pdp__slider" htmlFor={id}>
        <span>{t("baseSlider")}</span>
      </label>
      <input
        id={id}
        max={560}
        min={160}
        onChange={(event) => {
          const value = Number(event.target.value);
          setCardPx(value);
          try {
            window.localStorage.setItem(KEY, String(value));
          } catch {
            /* privater Modus */
          }
        }}
        type="range"
        value={cardPx}
      />
      <div className="af-pdp__scale">
        <div aria-hidden="true" className="af-pdp__card" style={{ height: CARD_H_MM * pxPerMm, width: cardPx }}>
          {t("baseCard")}
        </div>
      </div>
      <p className="af-mono">{t("baseActual", { size: prefs.dimensions(widthCm, heightCm) })}</p>
      {fits ? (
        <div className="af-pdp__scale">
          <div aria-hidden="true" className="af-pdp__basis" style={{ height: h, width: w }} />
        </div>
      ) : (
        <p className="af-note">{t("baseTooBig")}</p>
      )}
      <p className="af-note">{t("baseFinger")}</p>
    </div>
  );
}
