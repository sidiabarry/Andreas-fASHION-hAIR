"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Arrow } from "@/components/Arrow";
import { useCart } from "@/components/cart/CartProvider";
import { unitText } from "@/components/cart/unitText";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";
import { ShippingProgress } from "./ShippingProgress";

/**
 * Mini-Warenkorb als Schublade: öffnet sich nach „In den Warenkorb“, statt die Seite zu wechseln.
 * Modaler Dialog (natives <dialog>): Fokus bleibt darin, Escape schließt, Fokus kehrt zurück.
 */
export function CartDrawer({ checkoutOpen }: { checkoutOpen: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const cart = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const added = cart.justAdded ? cart.lookup(cart.justAdded) : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (added && !dialog.open) dialog.showModal();
    if (!added && dialog.open) dialog.close();
  }, [added]);

  // Modul 17: genau eine ruhige Empfehlung, nur wenn ein Haarteil im Korb liegt und noch kein Pflegeprodukt
  const hasHair = cart.items.some(({ product }) => product.category !== "pflege");
  const hasCare = cart.items.some(({ product }) => product.category === "pflege");
  const suggestions = hasHair && !hasCare ? cart.suggestions.filter((p) => !cart.has(p.slug)).slice(0, 1) : [];

  return (
    <dialog
      aria-labelledby="drawer-title"
      className="af-drawer af-zone-light"
      onClick={(event) => {
        if (event.target === event.currentTarget) cart.dismiss();
      }}
      onClose={() => cart.dismiss()}
      ref={ref}
    >
      <div className="af-drawer__in">
        <div className="af-drawer__head">
          <h2 className="af-h3" id="drawer-title">
            {t("drawer.title")}
          </h2>
          <button aria-label={t("drawer.close")} className="af-drawer__x" onClick={() => cart.dismiss()} type="button">
            <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
              <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        {added ? (
          <p className="af-note" role="status">
            {t("drawer.added", { name: added.name })}
          </p>
        ) : null}
        <ul className="af-lines">
          {cart.items.map(({ product, quantity }) => (
            <li className="af-drawer__line" key={product.slug}>
              <Image alt="" height={92} sizes="72px" src={product.image} width={72} />
              <div>
                <b>{product.name}</b>
                <p className="af-note">
                  {product.subtitle}
                  {quantity > 1 ? ` · ${quantity} ×` : ""}
                </p>
                {product.unit ? <p className="af-note">{unitText(t, product.unit, locale)}</p> : null}
                {product.unique ? <p className="af-unique">{t("cart.unique")}</p> : null}
              </div>
              <span className="af-card__price">{formatPrice(product.priceCents * quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="af-sum__row af-sum__total">
          <span>{t("cart.subtotal")}</span>
          <span>{formatPrice(cart.subtotalCents, locale)}</span>
        </div>
        <ShippingProgress subtotalCents={cart.subtotalCents} />
        <div className="af-drawer__actions">
          {checkoutOpen ? (
            <Link className="af-cta-band af-glass af-glass--gold" href="/kasse" onClick={() => cart.dismiss()}>
              {t("drawer.toCheckout")} <Arrow />
            </Link>
          ) : (
            <Link className="af-cta-band af-glass af-glass--gold" href={{ pathname: "/anfrage", query: { thema: "bestellung" } }} onClick={() => cart.dismiss()}>
              {t("drawer.toInquiry")} <Arrow />
            </Link>
          )}
          <div className="af-drawer__links">
            <Link className="af-cta-line" href="/warenkorb" onClick={() => cart.dismiss()}>
              {t("drawer.toCart")}
            </Link>
            <button className="af-cta-line" onClick={() => cart.dismiss()} type="button">
              {t("drawer.continue")}
            </button>
          </div>
        </div>
        {suggestions.length ? (
          <section aria-labelledby="drawer-suggest" className="af-drawer__suggest">
            <h3 className="af-mono" id="drawer-suggest">
              {t("drawer.suggestTitle")}
            </h3>
            <p className="af-note">{t("drawer.suggestNote")}</p>
            <ul className="af-lines">
              {suggestions.map((product) => (
                <li className="af-drawer__line" key={product.slug}>
                  <Image alt="" height={92} sizes="72px" src={product.image} width={72} />
                  <div>
                    <Link href={`/produkt/${product.slug}`} onClick={() => cart.dismiss()}>
                      <b>{product.name}</b>
                    </Link>
                    <p className="af-note">{formatPrice(product.priceCents, locale)}</p>
                  </div>
                  <button aria-label={t("drawer.add", { name: product.name })} className="af-drawer__add" onClick={() => cart.add(product.slug)} type="button">
                    +
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </dialog>
  );
}
