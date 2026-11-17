"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Arrow } from "@/components/Arrow";
import { useCart } from "@/components/cart/CartProvider";
import { shippingCents } from "@/config/shipping";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { MAX_QUANTITY } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

export function CartView({ checkoutOpen, contact }: { checkoutOpen: boolean; contact: { phone: string; phoneHref: string; email: string; whatsapp: string | null } }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const cart = useCart();
  const [announce, setAnnounce] = useState("");

  if (!cart.ready) {
    return <p className="af-lead">{t("common.loading")}</p>;
  }
  if (cart.items.length === 0) {
    return (
      <div className="af-empty">
        <p className="af-lead">{t("cart.empty")}</p>
        <Link className="af-cta-gold" href="/kollektion">
          {t("hero.ctaCollection")} <Arrow />
        </Link>
        <p aria-live="polite" className="af-sr">
          {announce}
        </p>
      </div>
    );
  }
  const shipping = shippingCents("DE", cart.subtotalCents) ?? 0;

  return (
    <div className="af-cart">
      <div>
        <ul aria-label={t("checkout.items")} className="af-lines">
          {cart.items.map(({ product, quantity }) => (
            <li className="af-line" key={product.slug}>
              <Image alt="" height={118} sizes="92px" src={product.image} width={92} />
              <div>
                <Link href={`/produkt/${product.slug}`}>
                  <b>{product.name}</b>
                </Link>
                <p className="af-note">{product.subtitle}</p>
                {product.unique ? (
                  <p className="af-note af-gold">{t("cart.unique")}</p>
                ) : (
                  <div className="af-qty">
                    <label className="af-note" htmlFor={`qty-${product.slug}`}>
                      {t("cart.quantity")}
                    </label>
                    <select id={`qty-${product.slug}`} onChange={(event) => cart.setQuantity(product.slug, Number(event.target.value))} value={quantity}>
                      {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  aria-label={t("cart.removeLabel", { name: product.name })}
                  className="af-line__remove"
                  onClick={() => {
                    cart.remove(product.slug);
                    setAnnounce(t("cart.removed", { name: product.name }));
                  }}
                  type="button"
                >
                  {t("cart.remove")}
                </button>
              </div>
              <span className="af-card__price">{formatPrice(product.priceCents * quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <p aria-live="polite" className="af-sr">
          {announce}
        </p>
        <p className="af-note" style={{ marginTop: 18 }}>
          {t("cart.storageNote")}
        </p>
      </div>

      <aside aria-label={t("cart.subtotal")} className="af-sum">
        <div className="af-sum__row">
          <span>{t("cart.subtotal")}</span>
          <span>{formatPrice(cart.subtotalCents, locale)}</span>
        </div>
        <div className="af-sum__row">
          <span>{t("cart.shipping")}</span>
          <span>{shipping === 0 ? t("checkout.shippingFree") : formatPrice(shipping, locale)}</span>
        </div>
        <p className="af-note">{t("cart.shippingFrom")}</p>
        {checkoutOpen ? (
          <Link className="af-cta-band" href="/kasse">
            {t("cart.toCheckout")} <Arrow />
          </Link>
        ) : (
          <div className="af-stack" style={{ "--gap": "14px" } as React.CSSProperties}>
            <h2 className="af-h3">{t("cart.inquiryTitle")}</h2>
            <p className="af-note">{t("cart.inquiryLead")}</p>
            <Link className="af-cta-band" href={{ pathname: "/anfrage", query: { thema: "bestellung" } }}>
              {t("cart.inquiryCta")} <Arrow />
            </Link>
            <p className="af-note">
              <a className="af-link" href={`tel:${contact.phoneHref}`}>
                {contact.phone}
              </a>
              {" · "}
              <a className="af-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              {contact.whatsapp ? (
                <>
                  {" · "}
                  <a className="af-link" href={contact.whatsapp} rel="noopener noreferrer" target="_blank">
                    WhatsApp
                  </a>
                </>
              ) : null}
            </p>
          </div>
        )}
        <p className="af-note">{t("cart.lead")}</p>
      </aside>
    </div>
  );
}
