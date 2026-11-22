import { getTranslations } from "next-intl/server";

import { CardMedia } from "@/components/catalog/CardMedia";
import { imageKindOf, isUnique, unitInfo, productText } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

export async function ProductCard({ product, locale, sold, priority }: { product: Product; locale: Locale; sold?: boolean; priority?: boolean }) {
  const t = await getTranslations({ locale, namespace: "product" });
  const tc = await getTranslations({ locale, namespace: "cat" });
  const text = productText(product, locale);
  const isSold = product.sold || Boolean(sold);
  const unit = unitInfo(product);
  const flag = isSold ? t("flagSold") : product.madeToOrder ? t("flagCustom") : isUnique(product) ? t("flagUnique") : null;
  return (
    <Link className="af-card af-rise" data-sold={isSold} href={`/produkt/${product.slug}`}>
      <CardMedia
        alt={t(imageKindOf(product) === "staged" ? "imageAltStaged" : "imageAlt", { name: text.name, subtitle: text.subtitle })}
        matchLabel={tc.raw("matchBadge") as string}
        original={product.originals[0] ?? null}
        priority={priority}
        slug={product.slug}
        src={product.image}
      >
        {flag ? (
          <span className="af-card__flag af-glass af-glass--badge" data-sold={isSold}>
            {flag}
          </span>
        ) : null}
      </CardMedia>
      <div className="af-card__row">
        <span className="af-card__name">{text.name.replace(/(\d+) (cm|g|ml)\b/g, "$1\u00a0$2")}</span>
        <span className="af-card__price">{formatPrice(product.priceCents, locale)}</span>
      </div>
      <p className="af-card__sub">{text.subtitle}</p>
      {unit ? (
        <p className="af-card__sub">
          {Number.parseInt(product.length, 10) > 0 ? `${t("spec.lengthValue", { cm: Number.parseInt(product.length, 10) })} · ` : ""}
          {unit.kind === "set" ? t("setSize", { grams: unit.grams, pieces: unit.parts }) : t("packSize", { grams: unit.grams })}
          {unit.baseCents ? <span className="af-base"> · {t("unitPrice", { amount: formatPrice(unit.baseCents, locale) })}</span> : null}
        </p>
      ) : null}
    </Link>
  );
}
