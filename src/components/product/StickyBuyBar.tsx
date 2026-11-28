"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { Link } from "@/i18n/navigation";

/**
 * Feste Kaufleiste am Handy: erscheint, sobald die Kundin über das erste Bild hinaus scrollt und der Hauptknopf
 * gerade nicht zu sehen ist (davor und danach). Beim Ankommen bleibt das Produktbild frei.
 * Beobachtet das Element mit der Kennung `buy-anchor`.
 */
export function StickyBuyBar({ slug, unique, price, unitLine, name, available }: { slug: string; unique: boolean; price: string; unitLine?: string; name: string; available: boolean }) {
  const t = useTranslations("product");
  const cart = useCart();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const anchor = document.getElementById("buy-anchor");
    if (!anchor || !("IntersectionObserver" in window)) return;
    let anchorInView = true;
    let pastFirstScreen = false;
    const update = () => setVisible(!anchorInView && pastFirstScreen);
    const observer = new IntersectionObserver(
      ([entry]) => {
        anchorInView = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    observer.observe(anchor);
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.6;
      if (next !== pastFirstScreen) {
        pastFirstScreen = next;
        update();
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const inCart = cart.ready && unique && cart.has(slug);
  return (
    <div aria-hidden={!visible} aria-label={t("stickyLabel")} className="af-sticky af-zone-light" data-visible={visible} inert={!visible} role="region">
      <div className="af-sticky__info">
        <span className="af-sticky__name">{name}</span>
        <span className="af-card__price">{price}</span>
        {unitLine ? <span className="af-note af-sticky__unit">{unitLine}</span> : null}
      </div>
      {!available ? null : inCart ? (
        <Link className="af-sticky__btn af-glass af-glass--gold af-glass--lens af-glass--caps" href="/warenkorb">
          {t("toCart")}
        </Link>
      ) : (
        <button className="af-sticky__btn af-glass af-glass--gold af-glass--lens af-glass--caps" data-magnetic="" onClick={() => cart.add(slug)} type="button">
          {t("addToCart")}
        </button>
      )}
    </div>
  );
}
