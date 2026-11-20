import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { CATEGORY_IDS, INQUIRY_ONLY_CATEGORIES, isCategoryId, products } from "@/data/catalog";
import { ExtensionsSection } from "@/components/product/ExtensionsSection";
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

/** Farbfamilie für die Mischung in der Standardansicht (alle Haarfarben gleichwertig sichtbar). */
function family(p: Product): string {
  const c = `${p.color} ${p.subtitle}`.toLowerCase();
  if (c.includes("grau")) return "grau";
  if (c.includes("schwarz")) return "schwarz";
  if (c.includes("blond")) return "blond";
  if (c.includes("kupfer") || c.includes("rot")) return "kupfer";
  if (c.includes("braun")) return "braun";
  return "andere";
}

/** Reihum je Farbfamilie, damit oben nicht nur eine Haarfarbe steht. */
function interleave(list: Product[]): Product[] {
  const groups = new Map<string, Product[]>();
  for (const p of list) groups.set(family(p), [...(groups.get(family(p)) ?? []), p]);
  const queues = [...groups.values()];
  const out: Product[] = [];
  while (out.length < list.length) for (const q of queues) if (q.length) out.push(q.shift()!);
  return out;
}

function sortProducts(list: Product[], sort: Sort, sold: Set<string>): Product[] {
  const isSold = (p: Product) => (p.sold || sold.has(p.slug) ? 1 : 0);
  const copy = sort === "empfehlung" ? interleave(list) : list.slice();
  copy.sort((a, b) => {
    const bySold = isSold(a) - isSold(b);
    if (bySold !== 0) return bySold;
    if (sort === "preis-auf") return a.priceCents - b.priceCents;
    if (sort === "preis-ab") return b.priceCents - a.priceCents;
    if (sort === "laenge") return (Number(b.length) || 0) - (Number(a.length) || 0);
    return 0;
  });
  // Array.prototype.sort ist stabil: Die Mischung bleibt innerhalb von „verfügbar“/„verkauft“ erhalten.
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
        {category && INQUIRY_ONLY_CATEGORIES.includes(category) ? null : <p className="af-mono">{t("collection.available", { count: open })}</p>}
        <h1 className="af-h1" style={{ marginTop: 18 }}>
          {category ? t(`categories.${category}.label`) : t("collection.title")}
        </h1>
        <p className="af-lead" style={{ marginTop: 22 }}>
          {category === "extensions" ? t("extensions.lead") : category ? t(`categories.${category}.caption`) : t("collection.lead")}
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
          {category && INQUIRY_ONLY_CATEGORIES.includes(category) ? null : (
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
          )}
        </div>
        {category && INQUIRY_ONLY_CATEGORIES.includes(category) ? (
          <ExtensionsSection locale={locale} />
        ) : (
          <>
        <p aria-live="polite" className="af-note" style={{ marginTop: 18 }}>
          {t("collection.results", { count: list.length })}. {t("collection.soldHint")}
        </p>
        <div className="af-grid">
          {list.map((product, index) => (
            <ProductCard key={product.slug} locale={locale} priority={index < 2} product={product} sold={sold.has(product.slug)} />
          ))}
        </div>
        {category === "extensions" ? (
          <div style={{ marginTop: 64 }}>
            <ExtensionsSection hasProducts locale={locale} />
          </div>
        ) : null}
          </>
        )}
      </div>
    </main>
  );
}
