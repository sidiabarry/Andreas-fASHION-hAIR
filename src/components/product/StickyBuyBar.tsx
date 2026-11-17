"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { Link } from "@/i18n/navigation";

/**
 * Feste Kaufleiste am Handy: erscheint, sobald der Hauptknopf aus dem Bild scrollt.
 * Beobachtet das Element mit der Kennung `buy-anchor`.
 */
export function StickyBuyBar({ slug, unique, price, name, available }: { slug: string; unique: boolean; price: string; name: string; available: boolean }) {
  const t = useTranslations("product");
  const cart = useCart();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const anchor = document.getElementById("buy-anchor");
    if (!anchor || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);
  const inCart = cart.ready && unique && cart.has(slug);
  return (
    <div aria-hidden={!visible} aria-label={t("stickyLabel")} className="af-sticky" data-visible={visible} inert={!visible} role="region">
      <div className="af-sticky__info">
        <span className="af-sticky__name">{name}</span>
        <span className="af-card__price">{price}</span>
      </div>
      {!available ? null : inCart ? (
        <Link className="af-sticky__btn" href="/warenkorb">
          {t("toCart")}
        </Link>
      ) : (
        <button className="af-sticky__btn" onClick={() => cart.add(slug)} type="button">
          {t("addToCart")}
        </button>
      )}
    </div>
  );
}
