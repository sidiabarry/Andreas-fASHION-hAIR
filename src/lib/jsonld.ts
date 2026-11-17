import { company } from "../config/company";
import type { Locale } from "../i18n/locales";
import { siteUrl } from "./seo";

const DAY = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function organizationJsonLd(locale: Locale) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": `${base}/#business`,
    address: {
      "@type": "PostalAddress",
      addressCountry: company.address.countryCode,
      addressLocality: company.address.city,
      postalCode: company.address.postalCode,
      streetAddress: company.address.street,
    },
    email: company.email,
    image: `${base}/og.png`,
    inLanguage: locale,
    logo: `${base}/assets/brand/phoenix.svg`,
    name: company.brandName,
    openingHoursSpecification: company.openingHours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({ "@type": "OpeningHoursSpecification", closes: h.closes, dayOfWeek: h.days.map((d) => `https://schema.org/${DAY[d]}`), opens: h.opens })),
    sameAs: Object.values(company.social).filter((url): url is string => Boolean(url) && !String(url).includes("w.app")),
    slogan: "HaarManufaktur",
    telephone: company.phone,
    url: `${base}/${locale}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", item: `${base}${item.path}`, name: item.name, position: index + 1 })),
  };
}
