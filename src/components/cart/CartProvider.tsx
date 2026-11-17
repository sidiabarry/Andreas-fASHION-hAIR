"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { ReactNode } from "react";

import type { ProductLite } from "@/data/catalog";
import { CART_STORAGE_KEY, cartCount, cartReducer } from "@/lib/cart";
import type { CartLine } from "@/lib/cart";

export type CartItem = { product: ProductLite; quantity: number };

type CartValue = {
  ready: boolean;
  lines: CartLine[];
  items: CartItem[];
  count: number;
  subtotalCents: number;
  justAdded: string | null;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  dismiss: () => void;
  lookup: (slug: string) => ProductLite | undefined;
  /** Pflege-/Befestigungsprodukte als „Passt dazu“ */
  suggestions: ProductLite[];
  checkoutOpen: boolean;
};

const CartContext = createContext<CartValue | null>(null);

/**
 * Warenkorb im localStorage des Geräts (technisch notwendig nach § 25 Abs. 2 Nr. 2 TDDDG,
 * keine Einwilligung nötig). Enthält nur Produktkennungen und Mengen, keine Preise.
 */
export function CartProvider({ children, products, checkoutOpen }: { children: ReactNode; products: ProductLite[]; checkoutOpen: boolean }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });
  const [ready, setReady] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);

  useEffect(() => {
    let stored: unknown = [];
    try {
      stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    } catch {
      stored = [];
    }
    dispatch({
      isKnown: (slug) => bySlug.has(slug),
      isUnique: (slug) => bySlug.get(slug)?.unique ?? true,
      lines: stored,
      type: "hydrate",
    });
    // Abgleich mit externem Speicher (localStorage) nach dem Hydrieren: gewollt im Effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      let next: unknown = [];
      try {
        next = JSON.parse(event.newValue ?? "[]");
      } catch {
        next = [];
      }
      dispatch({ isKnown: (s) => bySlug.has(s), isUnique: (s) => bySlug.get(s)?.unique ?? true, lines: next, type: "hydrate" });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [bySlug]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Privater Modus: Warenkorb lebt dann nur im Speicher.
    }
  }, [state.lines, ready]);

  const add = useCallback(
    (slug: string) => {
      const product = bySlug.get(slug);
      if (!product) return;
      dispatch({ slug, type: "add", unique: product.unique });
      setJustAdded(slug);
    },
    [bySlug],
  );
  const remove = useCallback((slug: string) => dispatch({ slug, type: "remove" }), []);
  const setQuantity = useCallback(
    (slug: string, quantity: number) => dispatch({ quantity, slug, type: "setQuantity", unique: bySlug.get(slug)?.unique ?? true }),
    [bySlug],
  );
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const dismiss = useCallback(() => setJustAdded(null), []);

  const value = useMemo<CartValue>(() => {
    const items = state.lines
      .map((line) => ({ product: bySlug.get(line.slug), quantity: line.quantity }))
      .filter((item): item is CartItem => Boolean(item.product));
    return {
      add,
      checkoutOpen,
      clear,
      count: cartCount(state),
      dismiss,
      has: (slug) => state.lines.some((line) => line.slug === slug),
      items,
      justAdded,
      lines: state.lines,
      lookup: (slug) => bySlug.get(slug),
      ready,
      remove,
      setQuantity,
      subtotalCents: items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0),
      suggestions: products.filter((p) => p.category === "pflege"),
    };
  }, [add, bySlug, checkoutOpen, clear, dismiss, justAdded, products, ready, remove, setQuantity, state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
