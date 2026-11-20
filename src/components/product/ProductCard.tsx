import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { imageKindOf, isUnique, unitInfo, productText } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

export async function ProductCard({ product, locale, sold, priority }: { product: Product; locale: Locale; sold?: boolean; priority?: boolean }) {
  const t = await getTranslations({ locale, namespace: "product" });
  const text = productText(product, locale);
  const isSold = product.sold || Boolean(sold);
  const unit = unitInfo(product);
  const flag = isSold ? t("flagSold") : product.madeToOrder ? t("flagCustom") : isUnique(product) ? t("flagUnique") : null;
  return (
    <Link className="af-card af-rise" data-sold={isSold} href={`/produkt/${product.slug}`}>
      <div className="af-card__media">
        <Image
          alt={t(imageKindOf(product) === "staged" ? "imageAltStaged" : "imageAlt", { name: text.name, subtitle: text.subtitle })}
          height={800}
          priority={priority}
          sizes="(max-width: 760px) 46vw, (max-width: 1080px) 31vw, 300px"
          src={product.image}
          width={600}
        />
        {flag ? (
          <span className="af-card__flag" data-sold={isSold}>
            {flag}
          </span>
        ) : null}
      </div>
      <div className="af-card__row">
        <span className="af-card__name">{text.name}</span>
        <span className="af-card__price">{formatPrice(product.priceCents, locale)}</span>
      </div>
      <p className="af-card__sub">{text.subtitle}</p>
      {unit ? (
        <p className="af-card__sub">
          {Number.parseInt(product.length, 10) > 0 ? `${t("spec.lengthValue", { cm: Number.parseInt(product.length, 10) })} · ` : ""}
          {unit.kind === "set" ? t("setSize", { grams: unit.grams, pieces: unit.parts }) : t("packSize", { grams: unit.grams })}
          {unit.baseCents ? ` · ${t("unitPrice", { amount: formatPrice(unit.baseCents, locale) })}` : ""}
        </p>
      ) : null}
    </Link>
  );
}
