"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Link } from "@/i18n/navigation";

/** Kleiner Knopf auf Galerie-Karten: legt das Stück direkt in den Warenkorb des Fundaments. */
export function QuickAdd({ slug, unique, label, inCart, name }: { slug: string; unique: boolean; label: string; inCart: string; name: string }) {
  const cart = useCart();
  if (cart.ready && unique && cart.has(slug)) {
    return (
      <Link className="qadd qadd--in" href="/warenkorb">
        <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
          <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        {inCart}
      </Link>
    );
  }
  return (
    <button aria-label={`${label}: ${name}`} className="qadd" onClick={() => cart.add(slug)} type="button">
      <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
        <path d="M6 1v10M1 6h10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {label}
    </button>
  );
}
