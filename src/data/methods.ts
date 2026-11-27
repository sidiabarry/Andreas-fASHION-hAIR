import { byCategory } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import { METHOD_IDS, methodOf } from "@/lib/collection";
import type { MethodId } from "@/lib/collection";

/**
 * Eigenschaften der Extensions-Techniken für Vergleich und Finder. Nur Methodeneigenschaften, die in
 * mehreren unabhängigen Quellen beschrieben sind (docs/arbeitsnotizen/copy-recherche.md); keine Tragedauer, keine Zeiten.
 */
export type MethodFacts = {
  /** Selbst einsetzen (sonst Friseurin/Fachfrau) */
  self: boolean;
  heat: boolean;
  glue: "none" | "tape" | "keratin";
  /** Abends herausnehmen */
  daily: boolean;
  /** Beim Nachsetzen: "always" = jeden Tag neu, "yes" = Tresse wird wieder gesetzt, "newTape" = mit neuen Klebestreifen, "regrow" = neue Bondings */
  reuse: "always" | "yes" | "newTape" | "regrow";
};

export const METHOD_FACTS: Record<MethodId, MethodFacts> = {
  butterfly: { daily: false, glue: "none", heat: false, reuse: "yes", self: false },
  clip: { daily: true, glue: "none", heat: false, reuse: "always", self: true },
  genius: { daily: false, glue: "none", heat: false, reuse: "yes", self: false },
  invisible: { daily: false, glue: "tape", heat: false, reuse: "newTape", self: false },
  keratin: { daily: false, glue: "keratin", heat: true, reuse: "regrow", self: false },
  tape: { daily: false, glue: "tape", heat: false, reuse: "newTape", self: false },
  thin: { daily: false, glue: "none", heat: false, reuse: "yes", self: false },
};

/** Symbolbilder für Techniken ohne Produkt im Shop (mit KI erstellt, als „Symbolbild“ gekennzeichnet). */
const SYMBOL_IMAGES: Partial<Record<MethodId, string>> = {
  keratin: "/assets/content/methods/keratin.jpg",
  tape: "/assets/content/methods/tape.jpg",
};

export type MethodShowcase = {
  id: MethodId;
  /** Hauptbild der Technik */
  image: string;
  /** Detailaufnahme (Befestigung in Nahaufnahme) */
  detail: string | null;
  film: { src: string; poster: string } | null;
  /** true = Symbolbild (kein echtes Produkt) */
  symbol: boolean;
  products: Product[];
};

/** Technik → Bilder und Packungen aus dem Katalog. Sobald Andréia eine Packung ergänzt, erscheint sie hier von selbst. */
export function methodShowcases(isAvailable: (product: Product) => boolean): MethodShowcase[] {
  const packs = byCategory("extensions").filter(isAvailable);
  return METHOD_IDS.map((id) => {
    const products = packs.filter((p) => methodOf(p) === id);
    const lead = products.find((p) => p.video) ?? products[0];
    if (!lead) {
      return { detail: null, film: null, id, image: SYMBOL_IMAGES[id] ?? "/assets/content/extensions.jpg", products, symbol: true };
    }
    const other = products.find((p) => p !== lead);
    const detail = lead.extraImages?.at(-1) ?? other?.image ?? lead.secondImage ?? null;
    return { detail, film: lead.video ?? null, id, image: lead.image, products, symbol: false };
  });
}
