// STUB: Platzhalter, bis der Rechtsagent src/content/legal/widerrufsformular.ts liefert.
import type { Company } from "./company-type";

export const isStub = true;
export const widerrufsformular: { title: string; lines: string[] } = { title: "Muster-Widerrufsformular", lines: [] };
export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  void c;
  return widerrufsformular;
}
