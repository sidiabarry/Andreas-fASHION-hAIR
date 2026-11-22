"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

import { Arrow } from "@/components/Arrow";
import { useCart } from "@/components/cart/CartProvider";
import { keepUnits, unitText } from "@/components/cart/unitText";
import { useLocalList, WISHLIST_KEY } from "@/components/cart/useLocalList";
import { WishlistButton } from "@/components/product/WishlistButton";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

const noop = () => () => {};

/** Merkliste: Stücke aus dem localStorage, Daten aus dem Katalog (wie Warenkorb). Verkaufte Stücke bleiben sichtbar, mit Hinweis. */
export function WishlistView({ soldSlugs }: { soldSlugs: string[] }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const cart = useCart();
  const { items } = useLocalList(WISHLIST_KEY);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  if (!mounted) return <p className="af-lead">{t("common.loading")}</p>;
  const products = items.map((slug) => cart.lookup(slug)).filter((p) => p !== undefined);
  if (products.length === 0) {
    return (
      <div className="af-empty">
        <p className="af-lead">{t("wishlist.empty")}</p>
        <Link className="af-cta-gold af-glass af-glass--gold" href="/kollektion">
          {t("hero.ctaCollection")} <Arrow />
        </Link>
      </div>
    );
  }
  const sold = new Set(soldSlugs);
  return (
    <ul aria-label={t("wishlist.title")} className="af-lines af-wishlist">
      {products.map((product) => (
        <li className="af-line" key={product.slug}>
          <Image alt="" height={118} sizes="92px" src={product.image} width={92} />
          <div>
            <Link href={`/produkt/${product.slug}`}>
              <b>{keepUnits(product.name)}</b>
            </Link>
            <p className="af-note">{product.subtitle}</p>
            {product.unit ? <p className="af-note">{unitText(t, product.unit, locale)}</p> : null}
            {sold.has(product.slug) ? <p className="af-note af-wishlist__sold">{t("wishlist.sold")}</p> : null}
            <WishlistButton slug={product.slug} />
          </div>
          <span className="af-card__price">{formatPrice(product.priceCents, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
