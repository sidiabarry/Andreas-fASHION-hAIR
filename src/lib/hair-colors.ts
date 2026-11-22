import { hexToLab } from "./color-match";
import type { Lab } from "./color-match";

/**
 * Katalogfarben (Freitext, deutsch) → ungefährer Farbton für den Farbabgleich. Eine feste
 * Schlüsselwort-Tabelle, damit das Ergebnis immer gleich ist. Ohne Treffer: kein Abgleich.
 * Die Werte sind Orientierungswerte für Haarfarben, keine Messung der Stücke.
 */
const TABLE: [RegExp, string][] = [
  [/schwarz/i, "#1d1816"],
  [/dunkelbraun|naturdunkelbraun/i, "#3a2a20"],
  [/kaffeebraun/i, "#4a3326"],
  [/kastanien/i, "#5a3a2a"],
  [/mittelbraun/i, "#5e4636"],
  [/kupfer/i, "#98582f"],
  [/rot|burgund|bordeaux/i, "#6e2a2a"],
  [/karamell/i, "#a8743f"],
  [/goldblond/i, "#c8a55a"],
  [/aschblond/i, "#b9aa90"],
  [/hellblond|platin/i, "#dcc58f"],
  [/blond/i, "#c9a66b"],
  [/grau|silber|weiß/i, "#9d9d9d"],
  [/hellbraun/i, "#7a5c45"],
  [/braun/i, "#5b4234"],
];

export function hairColorHex(text: string | null | undefined): string | null {
  if (!text) return null;
  let best: { index: number; hex: string } | null = null;
  for (const [pattern, hex] of TABLE) {
    const match = pattern.exec(text);
    if (match && (best === null || match.index < best.index)) best = { hex, index: match.index };
  }
  return best?.hex ?? null;
}

export function hairColorLab(text: string | null | undefined): Lab | null {
  const hex = hairColorHex(text);
  return hex ? hexToLab(hex) : null;
}
