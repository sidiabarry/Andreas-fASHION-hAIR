import type { MetadataRoute } from "next";

import { LOCALES } from "@/i18n/locales";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  const privatePaths = LOCALES.flatMap((l) => [`/${l}/warenkorb`, `/${l}/kasse`, `/${l}/bestellung/`]);
  return {
    host: base,
    rules: [{ allow: "/", disallow: privatePaths, userAgent: "*" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
