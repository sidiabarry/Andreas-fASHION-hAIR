import type { MethodId } from "@/lib/collection";

/** Reihenfolge wie METHOD_IDS (hier als Typ-Import, damit der Finder im Browser keinen Katalog lädt). */
const ORDER: MethodId[] = ["clip", "thin", "genius", "butterfly", "invisible", "tape", "keratin"];

export type FinderAnswer = { who: "self" | "pro"; hair: "fine" | "medium" | "curly"; goal: "occasion" | "volume" | "updo" | "flat" };

/** Punkte je Haartyp und Ziel. Grundlage: Methodeneigenschaften (flach, Fülle, Hochstecken, Selbsteinsatz), keine Versprechen. */
const HAIR: Record<FinderAnswer["hair"], Partial<Record<MethodId, number>>> = {
  curly: { butterfly: 1, genius: 1, keratin: 1, thin: 4 },
  fine: { butterfly: 1, genius: 2, invisible: 3, keratin: 1, tape: 1, thin: 3 },
  medium: { butterfly: 3, genius: 2, invisible: 1, keratin: 2, tape: 2, thin: 1 },
};
const GOAL: Record<FinderAnswer["goal"], Partial<Record<MethodId, number>>> = {
  flat: { genius: 2, invisible: 3, thin: 3 },
  occasion: { butterfly: 1, invisible: 1 },
  updo: { invisible: 3, keratin: 3, tape: 1 },
  volume: { butterfly: 3, genius: 2, tape: 1, thin: 2 },
};

/**
 * Orientierung aus drei Antworten: Wer selbst einsetzen möchte, bekommt Clip-in; sonst gewinnen die festen Methoden
 * mit den meisten Punkten aus Haartyp und Ziel. Bei Gleichstand gewinnt die Technik mit Packungen im Shop, dann die Reihenfolge.
 */
export function rankMethods(answer: FinderAnswer, inShop: ReadonlySet<MethodId>): MethodId[] {
  if (answer.who === "self") return ["clip"];
  const score = (id: MethodId) => (HAIR[answer.hair][id] ?? 0) + (GOAL[answer.goal][id] ?? 0) + (inShop.has(id) ? 0.5 : 0);
  return ORDER.filter((id) => id !== "clip")
    .map((id, index) => ({ id, index, score: score(id) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .map((entry) => entry.id);
}
