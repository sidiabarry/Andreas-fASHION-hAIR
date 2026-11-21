import Image from "next/image";
import type { CSSProperties } from "react";

import { isUnique, productText } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

import { QuickAdd } from "./QuickAdd";

export type CardTexts = { unique: string; sold: string; custom: string; add: string; inCart: string; view: string };

/**
 * Karte eines Stücks: Goldlicht am Rand, wandernder Seidenglanz, Preis sofort sichtbar,
 * „Unikat“/„Verkauft“ ehrlich, Schnell-in-den-Warenkorb (nicht bei verkauften Stücken).
 */
export function PieceCard({ product, locale, sold, t, size = "m", index = 0, sizes }: { product: Product; locale: Locale; sold: boolean; t: CardTexts; size?: "l" | "m" | "s"; index?: number; sizes: string }) {
  const text = productText(product, locale);
  const isSold = product.sold || sold;
  const flag = isSold ? t.sold : product.madeToOrder ? t.custom : isUnique(product) ? t.unique : null;
  return (
    <article className="piece" data-size={size} data-sold={isSold || undefined} style={{ "--k": index } as CSSProperties}>
      <Link aria-label={`${flag ? `${flag}: ` : ""}${t.view.replace("{name}", `${text.name}, ${text.subtitle}`)}`} className="piece__media" data-lens="" data-tilt="" href={`/produkt/${product.slug}`}>
        <Image alt="" height={1604} sizes={sizes} src={product.image} width={1200} />
        <span aria-hidden="true" className="piece__glare" />
        {flag ? <span className="piece__flag af-glass af-glass--badge">{flag}</span> : null}
      </Link>
      <div className="piece__body">
        <h3 className="piece__name">
          <Link href={`/produkt/${product.slug}`}>{text.name}</Link>
        </h3>
        <p className="piece__sub">{text.subtitle}</p>
        <div className="piece__row">
          <span className="piece__price">{formatPrice(product.priceCents, locale)}</span>
          {isSold ? null : <QuickAdd inCart={t.inCart} label={t.add} name={text.name} slug={product.slug} unique={isUnique(product)} />}
        </div>
      </div>
    </article>
  );
}
