import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALES } from "./locales";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // Die Erkennung übernimmt src/proxy.ts (Browser-Sprache, dann Land). Das Cookie NEXT_LOCALE
  // schreibt ausschließlich der Sprachumschalter (components/site/LocaleSwitcher.tsx), wenn jemand
  // ausdrücklich eine Sprache wählt. next-intl selbst setzt kein Cookie.
  localeDetection: false,
  localeCookie: false,
});
