"use client";

import { useTranslations } from "next-intl";

import { Arrow } from "@/components/Arrow";
import { useCart } from "@/components/cart/CartProvider";
import { Link } from "@/i18n/navigation";

export function AddToCart({ slug, unique, price }: { slug: string; unique: boolean; price: string }) {
  const t = useTranslations("product");
  const cart = useCart();
  if (cart.ready && unique && cart.has(slug)) {
    return (
      <Link className="af-cta-band" href="/warenkorb">
        {t("inCart")} <Arrow />
      </Link>
    );
  }
  return (
    <button className="af-cta-add" onClick={() => cart.add(slug)} type="button">
      <span>{t("addToCart")}</span>
      <span>{price}</span>
    </button>
  );
}
