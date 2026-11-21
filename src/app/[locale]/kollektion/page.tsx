import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { CATEGORY_IDS, isCategoryId, products, VISIBLE_CATEGORY_IDS } from "@/data/catalog";
import { CustomStrip } from "@/components/product/CustomStrip";
import type { Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  COLOR_GROUP_IDS,
  colorGroupOf,
  facetCounts,
  filterProducts,
  LENGTH_BAND_IDS,
  lengthBandOf,
  METHOD_IDS,
  methodOf,
  parseColorGroup,
  parseLengthBand,
  parseMethod,
} from "@/lib/collection";
import { pageMetadata } from "@/lib/seo";
import { soldSlugs } from "@/server/sold";

const SORTS = ["empfehlung", "preis-auf", "preis-ab", "laenge"] as const;
type Sort = (typeof SORTS)[number];

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/kollektion">): Promise<Metadata> {
  const { locale } = await params;
  const { kategorie, methode, farbe, laenge } = await searchParams;
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
  // Gefilterte Ansichten sind Dubletten der Kategorie: nicht indexieren
  if (parseMethod(methode) || parseColorGroup(farbe) || parseLengthBand(laenge)) meta.robots = { follow: true, index: false };
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

/** Nur gesetzte Parameter. */
function compact(values: Record<string, string | null>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) if (value !== null) out[key] = value;
  return out;
}

function sortProducts(list: Product[], sort: Sort, sold: Set<string>): Product[] {
  const isSold = (p: Product) => (p.sold || sold.has(p.slug) ? 1 : 0);
  // Empfehlung: Extensions zuerst, dann Haarteile; innerhalb jeder Kategorie die Farben gemischt
  const copy =
    sort === "empfehlung"
      ? CATEGORY_IDS.flatMap((id) => interleave(list.filter((p) => p.category === id)))
      : list.slice();
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
  const method = parseMethod(query.methode);
  const color = parseColorGroup(query.farbe);
  const length = parseLengthBand(query.laenge);
  const sold = await soldSlugs();
  const inCategory = category ? products.filter((p) => p.category === category) : products;
  const list = sortProducts(filterProducts(products, { category, color, length, method }), sort, sold);
  const open = list.filter((p) => !p.sold && !sold.has(p.slug)).length;
  const state = { farbe: color, kategorie: category, laenge: length, methode: method, sortierung: sort !== "empfehlung" ? sort : null };
  const hrefFor = (change: Partial<typeof state>) => {
    const next = { ...state, ...change };
    // Methode gibt es nur bei Extensions
    if (next.kategorie && next.kategorie !== "extensions") next.methode = null;
    return {
      pathname: "/kollektion" as const,
      query: compact(next),
    };
  };
  const hidden = compact({ farbe: color, kategorie: category, laenge: length, methode: method });
  const showMethod = !category || category === "extensions";
  const groups = [
    ...(showMethod ? [{ key: "methode" as const, label: t("collection.byMethod"), options: facetCounts(inCategory, METHOD_IDS, methodOf).map((o) => ({ ...o, label: t(`extensions.${o.id}`) })), value: method }] : []),
    { key: "farbe" as const, label: t("collection.byColor"), options: facetCounts(inCategory, COLOR_GROUP_IDS, colorGroupOf).map((o) => ({ ...o, label: t(`collection.colors.${o.id}`) })), value: color },
    { key: "laenge" as const, label: t("collection.byLength"), options: facetCounts(inCategory, LENGTH_BAND_IDS, lengthBandOf).map((o) => ({ ...o, label: t(`collection.lengths.${o.id}`) })), value: length },
  ].filter((group) => group.options.length > 1 || group.value);
  const filtered = Boolean(method || color || length);

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
          {category === "extensions" ? t("collection.leadExtensions") : category ? t(`categories.${category}.caption`) : t("collection.lead")}
        </p>
        {category === "extensions" || !category ? (
          <p style={{ marginTop: 18 }}>
            <Link className="af-cta-line" href="/extensions">
              {t("collection.hubLink")}
            </Link>
          </p>
        ) : null}
        <div className="af-toolbar">
          <nav aria-label={t("collection.filterLabel")} className="af-filters">
            <Link aria-current={category === null ? "page" : undefined} className="af-tab" href={hrefFor({ kategorie: null })}>
              {t("collection.all")}
            </Link>
            {VISIBLE_CATEGORY_IDS.map((id) => (
              <Link aria-current={category === id ? "page" : undefined} className="af-tab" href={hrefFor({ kategorie: id })} key={id}>
                {t(`categories.${id}.label`)}
              </Link>
            ))}
          </nav>
          <SortSelect
            apply={t("collection.apply")}
            hidden={hidden}
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
        {groups.length ? (
          <div aria-label={t("collection.filterGroups")} className="af-facets" role="group">
            {groups.map((group) => (
              <div className="af-facet" key={group.key}>
                <span className="af-facet__label">{group.label}</span>
                <div className="af-facet__opts">
                  <Link aria-current={group.value === null ? "true" : undefined} className="af-pill" href={hrefFor({ [group.key]: null })}>
                    {t("collection.any")}
                  </Link>
                  {group.options.map((option) => (
                    <Link aria-current={group.value === option.id ? "true" : undefined} className="af-pill" href={hrefFor({ [group.key]: option.id })} key={option.id}>
                      {option.label} <i>{option.count}</i>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {filtered ? (
              <Link className="af-facet__reset" href={hrefFor({ farbe: null, laenge: null, methode: null })}>
                {t("collection.reset")}
              </Link>
            ) : null}
          </div>
        ) : null}
        <p aria-live="polite" className="af-note" style={{ marginTop: 18 }}>
          {t("collection.results", { count: list.length })}. {t("collection.soldHint")}
        </p>
        {list.length ? (
          <div className="af-grid">
            {list.map((product, index) => (
              <ProductCard key={product.slug} locale={locale} priority={index < 2} product={product} sold={sold.has(product.slug)} />
            ))}
          </div>
        ) : (
          <div className="af-msg" data-kind="info" style={{ marginTop: 32 }}>
            <p>{t("collection.empty")}</p>
            <p>
              <Link className="af-link" href={hrefFor({ farbe: null, laenge: null, methode: null })}>
                {t("collection.reset")}
              </Link>{" "}
              ·{" "}
              <Link className="af-link" href="/massanfertigung">
                {t("custom.strip.cta")}
              </Link>
            </p>
          </div>
        )}
        <div style={{ marginTop: 72 }}>
          <CustomStrip />
        </div>
      </div>
    </main>
  );
}
