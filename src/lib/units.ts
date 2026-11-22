/**
 * Längen in cm oder Zoll (Modul 22). Katalogdaten bleiben immer in cm; nur die Anzeige wechselt.
 */
export type LengthUnit = "cm" | "in";

export const CM_PER_INCH = 2.54;

export function cmToInch(cm: number): number {
  return cm / CM_PER_INCH;
}

function number(value: number, locale: string, digits: number): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

/** 45 → „45 cm“ bzw. „17,7 in“ */
export function formatLength(cm: number, unit: LengthUnit, locale = "de"): string {
  return unit === "in" ? `${number(cmToInch(cm), locale, 1)} in` : `${number(cm, locale, 1)} cm`;
}

/** (11, 9) → „11 × 9 cm“ bzw. „4,3 × 3,5 in“ */
export function formatDimensions(width: number, height: number, unit: LengthUnit, locale = "de"): string {
  if (unit === "in") return `${number(cmToInch(width), locale, 1)} × ${number(cmToInch(height), locale, 1)} in`;
  return `${number(width, locale, 1)} × ${number(height, locale, 1)} cm`;
}

/** Katalogfeld `length` ("45", "30,5") → Zahl in cm oder null */
export function parseLengthCm(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^\s*(\d{1,3}(?:[.,]\d)?)\s*(?:cm)?\s*$/i.exec(value);
  if (!match) return null;
  const parsed = Number(match[1].replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Katalogfeld `base` ("11 x 9", "9 × 11 cm") → Breite/Höhe in cm oder null */
export function parseBaseCm(value: string | null | undefined): { width: number; height: number } | null {
  if (!value) return null;
  const match = /^\s*(\d{1,2}(?:[.,]\d)?)\s*[x×]\s*(\d{1,2}(?:[.,]\d)?)\s*(?:cm)?\s*$/i.exec(value);
  if (!match) return null;
  const width = Number(match[1].replace(",", "."));
  const height = Number(match[2].replace(",", "."));
  return width > 0 && height > 0 ? { height, width } : null;
}
