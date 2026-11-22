"use client";

import { useTranslations } from "next-intl";

import { useShopPrefs } from "./ShopPreferences";

/** Schalter „cm ⇄ in“ für alle Längenangaben im Shop. */
export function UnitToggle() {
  const t = useTranslations("shop");
  const { unit, setUnit } = useShopPrefs();
  const next = unit === "cm" ? "in" : "cm";
  return (
    <button aria-label={unit === "cm" ? t("showInches") : t("showCm")} className="af-unit af-glass" onClick={() => setUnit(next)} type="button">
      <span aria-hidden="true" data-on={unit === "cm"}>
        cm
      </span>
      <span aria-hidden="true" data-on={unit === "in"}>
        in
      </span>
    </button>
  );
}
