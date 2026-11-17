"use client";

import { useTranslations } from "next-intl";

import { useLocalList, WISHLIST_KEY } from "@/components/cart/useLocalList";

export function WishlistButton({ slug }: { slug: string }) {
  const t = useTranslations("product");
  const list = useLocalList(WISHLIST_KEY);
  const saved = list.items.includes(slug);
  return (
    <button aria-pressed={saved} className="af-wish" onClick={() => list.toggle(slug)} type="button">
      <svg aria-hidden="true" fill={saved ? "currentColor" : "none"} height="18" viewBox="0 0 24 24" width="18">
        <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.4 0 5.5 3.4 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {saved ? t("wishSaved") : t("wishAdd")}
    </button>
  );
}
