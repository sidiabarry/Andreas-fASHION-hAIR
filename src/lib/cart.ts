/**
 * Warenkorb-Logik als reiner Reducer (testbar ohne Browser).
 * Der Warenkorb liegt im localStorage des Geräts (technisch notwendig, § 25 Abs. 2 Nr. 2 TDDDG).
 * Preise stehen bewusst NICHT im Warenkorb: Der Server rechnet immer aus dem Katalog.
 */
export const CART_STORAGE_KEY = "afh-cart-v2";
export const MAX_LINES = 20;
export const MAX_QUANTITY = 9;

export type CartLine = { slug: string; quantity: number };
export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: "add"; slug: string; unique: boolean }
  | { type: "remove"; slug: string }
  | { type: "setQuantity"; slug: string; quantity: number; unique: boolean }
  | { type: "clear" }
  | { type: "hydrate"; lines: unknown; isKnown: (slug: string) => boolean; isUnique: (slug: string) => boolean };

const SLUG = /^[a-z0-9-]{1,160}$/;

const clampQuantity = (quantity: number, unique: boolean) =>
  unique ? 1 : Math.max(1, Math.min(MAX_QUANTITY, Math.trunc(Number.isFinite(quantity) ? quantity : 1)));

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      if (!SLUG.test(action.slug)) return state;
      const existing = state.lines.find((line) => line.slug === action.slug);
      if (existing) {
        if (action.unique) return state;
        return {
          lines: state.lines.map((line) =>
            line.slug === action.slug ? { ...line, quantity: clampQuantity(line.quantity + 1, false) } : line,
          ),
        };
      }
      if (state.lines.length >= MAX_LINES) return state;
      return { lines: [...state.lines, { quantity: 1, slug: action.slug }] };
    }
    case "remove":
      return { lines: state.lines.filter((line) => line.slug !== action.slug) };
    case "setQuantity":
      return {
        lines: state.lines.map((line) =>
          line.slug === action.slug ? { ...line, quantity: clampQuantity(action.quantity, action.unique) } : line,
        ),
      };
    case "clear":
      return { lines: [] };
    case "hydrate": {
      if (!Array.isArray(action.lines)) return { lines: [] };
      const seen = new Set<string>();
      const lines: CartLine[] = [];
      for (const raw of action.lines.slice(0, MAX_LINES)) {
        if (!raw || typeof raw !== "object") continue;
        const { slug, quantity } = raw as { slug?: unknown; quantity?: unknown };
        if (typeof slug !== "string" || !SLUG.test(slug) || seen.has(slug) || !action.isKnown(slug)) continue;
        seen.add(slug);
        lines.push({ quantity: clampQuantity(Number(quantity), action.isUnique(slug)), slug });
      }
      return { lines };
    }
  }
}

export function cartCount(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}
