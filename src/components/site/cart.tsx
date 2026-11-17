import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { getProduct, isUnique } from "@/data/catalog";
import type { Product } from "@/data/catalog";

export type CartLine = { slug: string; quantity: number };

type CartValue = {
  lines: CartLine[];
  items: { product: Product; quantity: number }[];
  count: number;
  subtotalCents: number;
  ready: boolean;
  justAdded: string | null;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  dismiss: () => void;
};

const KEY = "af-cart-v1";
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartLine[];
        setLines(parsed.filter((line) => getProduct(line.slug) && line.quantity > 0));
      }
    } catch {
      // A broken stored cart simply starts empty.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      // Storage can be unavailable in private mode; the cart then lives in memory.
    }
  }, [lines, ready]);

  useEffect(() => {
    if (!justAdded) {
      return;
    }
    const timer = window.setTimeout(() => setJustAdded(null), 5200);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const add = useCallback((slug: string) => {
    const product = getProduct(slug);
    if (!product || product.sold) {
      return;
    }
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (!existing) {
        return [...current, { quantity: 1, slug }];
      }
      if (isUnique(product)) {
        return current;
      }
      return current.map((line) =>
        line.slug === slug ? { ...line, quantity: Math.min(9, line.quantity + 1) } : line,
      );
    });
    setJustAdded(slug);
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        line.slug === slug ? { ...line, quantity: Math.max(1, Math.min(9, quantity)) } : line,
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const dismiss = useCallback(() => setJustAdded(null), []);

  const value = useMemo<CartValue>(() => {
    const items = lines
      .map((line) => ({ product: getProduct(line.slug), quantity: line.quantity }))
      .filter((item): item is { product: Product; quantity: number } => Boolean(item.product));
    return {
      add,
      clear,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      dismiss,
      has: (slug: string) => lines.some((line) => line.slug === slug),
      items,
      justAdded,
      lines,
      ready,
      remove,
      setQuantity,
      subtotalCents: items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0),
    };
  }, [add, clear, dismiss, justAdded, lines, ready, remove, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
