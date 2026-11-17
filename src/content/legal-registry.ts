/**
 * Verzeichnis der Rechtstexte je Sprache (geliefert vom Rechtsagenten unter src/content/legal).
 * Deutsch ist maßgeblich. Für Sprachen ohne Übersetzung wird die deutsche Fassung gezeigt
 * (die Seite ergänzt dann einen Hinweis in der jeweiligen Sprache).
 */
import type { ComponentType } from "react";

import type { Company } from "./legal/company-type";
import * as deCheckout from "./legal/checkout-texts";
import deAgb from "./legal/agb";
import deDatenschutz from "./legal/datenschutz";
import deImpressum from "./legal/impressum";
import deVersand from "./legal/versand-zahlung";
import deWiderruf from "./legal/widerruf";
import * as deFormular from "./legal/widerrufsformular";
import * as enCheckout from "./legal/en/checkout-texts";
import enAgb from "./legal/en/agb";
import enDatenschutz from "./legal/en/datenschutz";
import enImpressum from "./legal/en/impressum";
import enVersand from "./legal/en/versand-zahlung";
import enWiderruf from "./legal/en/widerruf";
import * as enFormular from "./legal/en/widerrufsformular";

export type LegalPageId = "impressum" | "datenschutz" | "agb" | "widerruf" | "versand-zahlung";
type Page = ComponentType<{ company: Company }>;
export type CheckoutTexts = ReturnType<typeof deCheckout.checkoutTextsFor>;
type Bundle = {
  pages: Record<LegalPageId, Page>;
  checkoutTextsFor: (c: Company) => CheckoutTexts;
  fillWiderrufsformular: (c: Company) => { title: string; lines: string[] };
};

const de: Bundle = {
  checkoutTextsFor: deCheckout.checkoutTextsFor,
  fillWiderrufsformular: deFormular.fillWiderrufsformular,
  pages: { agb: deAgb, datenschutz: deDatenschutz, impressum: deImpressum, "versand-zahlung": deVersand, widerruf: deWiderruf },
};

const bundles: Record<string, Bundle> = {
  de,
  en: {
    checkoutTextsFor: enCheckout.checkoutTextsFor,
    fillWiderrufsformular: enFormular.fillWiderrufsformular,
    pages: { agb: enAgb, datenschutz: enDatenschutz, impressum: enImpressum, "versand-zahlung": enVersand, widerruf: enWiderruf },
  },
};

/** Rechtstexte für eine Sprache; `translated=false` bedeutet: deutsche Fassung als Ersatz. */
export function legalFor(locale: string): Bundle & { lang: string; translated: boolean } {
  const bundle = bundles[locale];
  if (bundle) return { ...bundle, lang: locale, translated: locale !== "de" };
  return { ...de, lang: "de", translated: false };
}

export const germanLegal = de;
