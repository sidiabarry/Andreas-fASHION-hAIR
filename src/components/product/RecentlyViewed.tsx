"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useCart } from "@/components/cart/CartProvider";
import { RECENT_KEY, useLocalList } from "@/components/cart/useLocalList";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const t = useTranslations("recent");
  const locale = useLocale() as Locale;
  const cart = useCart();
  const { items } = useLocalList(RECENT_KEY, 12);
  const products = items
    .filter((slug) => slug !== exclude)
    .map((slug) => cart.lookup(slug))
    .filter((p) => p !== undefined)
    .slice(0, 6);
  if (!products.length) return null;
  return (
    <section aria-labelledby="recent-title" className="af-recent">
      <h2 className="af-h3" id="recent-title">
        {t("title")}
      </h2>
      <ul>
        {products.map((p) => (
          <li key={p.slug}>
            <Link href={`/produkt/${p.slug}`}>
              <Image alt="" height={160} sizes="120px" src={p.image} width={120} />
              <span className="af-card__name">{p.name}</span>
              <span className="af-card__price">{formatPrice(p.priceCents, locale)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
