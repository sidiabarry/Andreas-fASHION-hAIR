import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { CATEGORY_IDS, isCategoryId, products } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

const SORTS = ["empfehlung", "preis-auf", "preis-ab", "laenge"] as const;
type Sort = (typeof SORTS)[number];

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/kollektion">): Promise<Metadata> {
  const { locale } = await params;
  const { kategorie } = await searchParams;
  const t = await getTranslations({ locale });
  const category = isCategoryId(kategorie) ? kategorie : null;
  const meta = pageMetadata({
    description: category ? t(`categories.${category}.caption`) : t("collection.lead"),
    locale: locale as Locale,
    path: "/kollektion",
    title: category ? t(`categories.${category}.label`) : t("collection.title"),
  });
  if (category) {
    // Kategorie-Ansichten sind eigene, indexierbare Seiten
    meta.alternates = { ...meta.alternates, canonical: `/${locale}/kollektion?kategorie=${category}` };
  }
  return meta;
}

function sortProducts(list: Product[], sort: Sort, sold: Set<string>): Product[] {
  const isSold = (p: Product) => (p.sold || sold.has(p.slug) ? 1 : 0);
  const copy = list.slice();
  copy.sort((a, b) => {
    const bySold = isSold(a) - isSold(b);
    if (bySold !== 0) return bySold;
    if (sort === "preis-auf") return a.priceCents - b.priceCents;
    if (sort === "preis-ab") return b.priceCents - a.priceCents;
    if (sort === "laenge") return (Number(b.length) || 0) - (Number(a.length) || 0);
    return 0;
  });
  return copy;
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/[locale]/kollektion">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const query = await searchParams;
  const t = await getTranslations({ locale });
  const category = isCategoryId(query.kategorie) ? query.kategorie : null;
  const sort: Sort = SORTS.includes(query.sortierung as Sort) ? (query.sortierung as Sort) : "empfehlung";
  const sold = await soldSlugs();
  const list = sortProducts(category ? products.filter((p) => p.category === category) : products, sort, sold);
  const open = list.filter((p) => !p.sold && !sold.has(p.slug)).length;
  const hrefFor = (id: string | null) => ({
    pathname: "/kollektion" as const,
    query: { ...(id ? { kategorie: id } : {}), ...(sort !== "empfehlung" ? { sortierung: sort } : {}) },
  });

  return (
    <main className="af-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("common.home"), path: `/${locale}` },
          { name: t("collection.title"), path: `/${locale}/kollektion` },
          ...(category ? [{ name: t(`categories.${category}.label`), path: `/${locale}/kollektion?kategorie=${category}` }] : []),
        ])}
      />
      <div className="af-wrap">
        <p className="af-mono">{t("collection.available", { count: open })}</p>
        <h1 className="af-h1" style={{ marginTop: 18 }}>
          {category ? t(`categories.${category}.label`) : t("collection.title")}
        </h1>
        <p className="af-lead" style={{ marginTop: 22 }}>
          {category ? t(`categories.${category}.caption`) : t("collection.lead")}
        </p>
        <div className="af-toolbar">
          <nav aria-label={t("collection.filterLabel")} className="af-filters">
            <Link aria-current={category === null ? "page" : undefined} className="af-tab" href={hrefFor(null)}>
              {t("collection.all")}
            </Link>
            {CATEGORY_IDS.map((id) => (
              <Link aria-current={category === id ? "page" : undefined} className="af-tab" href={hrefFor(id)} key={id}>
                {t(`categories.${id}.label`)}
              </Link>
            ))}
          </nav>
          <SortSelect
            apply={t("collection.apply")}
            category={category}
            label={t("collection.sortLabel")}
            options={[
              { label: t("collection.sortFeatured"), value: "empfehlung" },
              { label: t("collection.sortPriceAsc"), value: "preis-auf" },
              { label: t("collection.sortPriceDesc"), value: "preis-ab" },
              { label: t("collection.sortLength"), value: "laenge" },
            ]}
            value={sort}
          />
        </div>
        <p aria-live="polite" className="af-note" style={{ marginTop: 18 }}>
          {t("collection.results", { count: list.length })}. {t("collection.soldHint")}
        </p>
        <div className="af-grid">
          {list.map((product, index) => (
            <ProductCard key={product.slug} locale={locale} priority={index < 2} product={product} sold={sold.has(product.slug)} />
          ))}
        </div>
      </div>
    </main>
  );
}
