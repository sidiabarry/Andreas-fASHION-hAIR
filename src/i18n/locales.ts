/**
 * Sprachen und Spracherkennung. Keine Imports: wird von proxy.ts, Tests und Skripten genutzt.
 *
 * Deutsch ist Standard und rechtlich maßgeblich.
 */

export const ALL_LOCALES = ["de", "en", "fr", "es", "pt", "it", "nl", "pl", "tr"] as const;
export type AnyLocale = (typeof ALL_LOCALES)[number];
/** Freigeschaltete Sprachen (jede braucht vollständige Übersetzungen in src/messages). */
export const LOCALES = ["de", "en"] as const satisfies readonly AnyLocale[];
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";
/** Fallback, wenn weder Browser-Sprache noch Land passen. */
export const FALLBACK_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Sprachnamen in Eigensprache (für den Umschalter). */
export const LOCALE_NAMES: Record<AnyLocale, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  tr: "Türkçe",
};

/** BCP-47-Tags für Intl und Open Graph. */
export const LOCALE_TAGS: Record<AnyLocale, string> = {
  de: "de-DE",
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES",
  pt: "pt-PT",
  it: "it-IT",
  nl: "nl-NL",
  pl: "pl-PL",
  tr: "tr-TR",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

const COUNTRY_LOCALE: Record<string, AnyLocale> = {};
const assign = (locale: AnyLocale, countries: string[]) => {
  for (const country of countries) COUNTRY_LOCALE[country] = locale;
};
assign("de", ["DE", "AT", "CH", "LI", "LU"]);
assign("en", ["GB", "US", "IE", "AU", "CA", "NZ", "ZA", "IN", "SG", "MT", "NG", "GH", "KE", "PH"]);
assign("fr", ["FR", "BE", "MC", "SN", "CI", "CM", "MA", "TN", "DZ"]);
assign("es", ["ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR"]);
assign("pt", ["PT", "BR", "AO", "MZ", "CV", "GW", "ST", "TL"]);
assign("it", ["IT", "SM", "VA"]);
assign("nl", ["NL", "SR"]);
assign("pl", ["PL"]);
assign("tr", ["TR"]);

export function localeForCountry(country: string | null | undefined): AnyLocale | null {
  if (!country) return null;
  return COUNTRY_LOCALE[country.toUpperCase()] ?? null;
}

/**
 * Wertet einen Accept-Language-Header aus (RFC 9110, q-Werte) und liefert
 * die erste unterstützte Sprache oder null.
 */
export function localeFromAcceptLanguage(header: string | null | undefined, supported: readonly Locale[] = LOCALES): Locale | null {
  if (!header) return null;
  const entries = header
    .split(",")
    .slice(0, 30)
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      let q = 1;
      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key === "q") {
          const parsed = Number(value);
          q = Number.isFinite(parsed) ? parsed : 0;
        }
      }
      return { index, q, tag: tag.trim().toLowerCase() };
    })
    .filter((entry) => entry.tag && entry.tag !== "*" && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const entry of entries) {
    const base = entry.tag.split("-")[0];
    if ((supported as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

/** Reihenfolge: ausdrücklich gewählte Sprache (Cookie) → Browser → Land → Englisch. */
export function detectLocale(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
  supported?: readonly Locale[];
}): Locale {
  const supported = input.supported ?? LOCALES;
  if (isLocale(input.cookie) && supported.includes(input.cookie)) return input.cookie;
  const fromHeader = localeFromAcceptLanguage(input.acceptLanguage, supported);
  if (fromHeader) return fromHeader;
  const fromCountry = localeForCountry(input.country);
  if (fromCountry && (supported as readonly string[]).includes(fromCountry)) return fromCountry as Locale;
  return supported.includes(FALLBACK_LOCALE) ? FALLBACK_LOCALE : supported[0];
}
