import type { MetadataRoute } from "next";

import { CATEGORY_IDS, products } from "@/data/catalog";
import { LOCALES } from "@/i18n/locales";
import { siteUrl } from "@/lib/seo";

const STATIC = ["", "/extensions", "/massanfertigung", "/kollektion", "/anfrage", "/ueber-andrea", "/kontakt", "/versand-und-zahlung", "/impressum", "/datenschutz", "/agb", "/widerruf", "/widerruf/erklaeren"];

/** Sitemap mit allen Sprachfassungen und hreflang-Alternativen je Eintrag. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    ...STATIC,
    ...CATEGORY_IDS.map((id) => `/kollektion?kategorie=${id}`),
    ...products.map((p) => `/produkt/${p.slug}`),
  ];
  return paths.flatMap((path) => {
    const languages = Object.fromEntries([...LOCALES.map((l) => [l, `${base}/${l}${path}`]), ["x-default", `${base}/de${path}`]]);
    return LOCALES.map((locale) => ({
      alternates: { languages },
      changeFrequency: path.startsWith("/produkt") || path.startsWith("/kollektion") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("/produkt") ? 0.7 : 0.5,
      url: `${base}/${locale}${path}`,
    }));
  });
}
