import type { Metadata } from "next";

import { company } from "../config/company";
import { DEFAULT_LOCALE, LOCALE_TAGS, LOCALES } from "../i18n/locales";
import type { Locale } from "../i18n/locales";

export function siteUrl(): string {
  const fromEnv = process.env.SITE_URL;
  return (fromEnv && /^https?:\/\//.test(fromEnv) ? fromEnv : company.siteUrl).replace(/\/$/, "");
}

/** canonical + hreflang-Alternativen (inkl. x-default → Deutsch) für einen Pfad ohne Sprachpräfix. */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const code of LOCALES) languages[code] = `/${code}${clean}`;
  languages["x-default"] = `/${DEFAULT_LOCALE}${clean}`;
  return { canonical: `/${locale}${clean}`, languages };
}

export function pageMetadata(input: {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
  noindex?: boolean;
  image?: string;
}): Metadata {
  return {
    alternates: alternates(input.locale, input.path),
    description: input.description,
    openGraph: {
      alternateLocale: LOCALES.filter((l) => l !== input.locale).map((l) => LOCALE_TAGS[l].replace("-", "_")),
      description: input.description,
      images: [{ height: 630, url: input.image ?? "/og.png", width: 1200 }],
      locale: LOCALE_TAGS[input.locale].replace("-", "_"),
      siteName: company.brandName,
      title: input.title,
      type: "website",
      url: `/${input.locale}${input.path === "/" ? "" : input.path}`,
    },
    robots: input.noindex ? { follow: false, index: false } : undefined,
    title: input.title,
    twitter: { card: "summary_large_image" },
  };
}
