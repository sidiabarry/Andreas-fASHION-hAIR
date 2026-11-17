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
import * as frCheckout from "./legal/fr/checkout-texts";
import frAgb from "./legal/fr/agb";
import frDatenschutz from "./legal/fr/datenschutz";
import frImpressum from "./legal/fr/impressum";
import frVersand from "./legal/fr/versand-zahlung";
import frWiderruf from "./legal/fr/widerruf";
import * as frFormular from "./legal/fr/widerrufsformular";
import * as esCheckout from "./legal/es/checkout-texts";
import esAgb from "./legal/es/agb";
import esDatenschutz from "./legal/es/datenschutz";
import esImpressum from "./legal/es/impressum";
import esVersand from "./legal/es/versand-zahlung";
import esWiderruf from "./legal/es/widerruf";
import * as esFormular from "./legal/es/widerrufsformular";
import * as ptCheckout from "./legal/pt/checkout-texts";
import ptAgb from "./legal/pt/agb";
import ptDatenschutz from "./legal/pt/datenschutz";
import ptImpressum from "./legal/pt/impressum";
import ptVersand from "./legal/pt/versand-zahlung";
import ptWiderruf from "./legal/pt/widerruf";
import * as ptFormular from "./legal/pt/widerrufsformular";
import * as itCheckout from "./legal/it/checkout-texts";
import itAgb from "./legal/it/agb";
import itDatenschutz from "./legal/it/datenschutz";
import itImpressum from "./legal/it/impressum";
import itVersand from "./legal/it/versand-zahlung";
import itWiderruf from "./legal/it/widerruf";
import * as itFormular from "./legal/it/widerrufsformular";
import * as nlCheckout from "./legal/nl/checkout-texts";
import nlAgb from "./legal/nl/agb";
import nlDatenschutz from "./legal/nl/datenschutz";
import nlImpressum from "./legal/nl/impressum";
import nlVersand from "./legal/nl/versand-zahlung";
import nlWiderruf from "./legal/nl/widerruf";
import * as nlFormular from "./legal/nl/widerrufsformular";
import * as plCheckout from "./legal/pl/checkout-texts";
import plAgb from "./legal/pl/agb";
import plDatenschutz from "./legal/pl/datenschutz";
import plImpressum from "./legal/pl/impressum";
import plVersand from "./legal/pl/versand-zahlung";
import plWiderruf from "./legal/pl/widerruf";
import * as plFormular from "./legal/pl/widerrufsformular";
import * as trCheckout from "./legal/tr/checkout-texts";
import trAgb from "./legal/tr/agb";
import trDatenschutz from "./legal/tr/datenschutz";
import trImpressum from "./legal/tr/impressum";
import trVersand from "./legal/tr/versand-zahlung";
import trWiderruf from "./legal/tr/widerruf";
import * as trFormular from "./legal/tr/widerrufsformular";

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
  fr: {
    checkoutTextsFor: frCheckout.checkoutTextsFor,
    fillWiderrufsformular: frFormular.fillWiderrufsformular,
    pages: { agb: frAgb, datenschutz: frDatenschutz, impressum: frImpressum, "versand-zahlung": frVersand, widerruf: frWiderruf },
  },
  es: {
    checkoutTextsFor: esCheckout.checkoutTextsFor,
    fillWiderrufsformular: esFormular.fillWiderrufsformular,
    pages: { agb: esAgb, datenschutz: esDatenschutz, impressum: esImpressum, "versand-zahlung": esVersand, widerruf: esWiderruf },
  },
  pt: {
    checkoutTextsFor: ptCheckout.checkoutTextsFor,
    fillWiderrufsformular: ptFormular.fillWiderrufsformular,
    pages: { agb: ptAgb, datenschutz: ptDatenschutz, impressum: ptImpressum, "versand-zahlung": ptVersand, widerruf: ptWiderruf },
  },
  it: {
    checkoutTextsFor: itCheckout.checkoutTextsFor,
    fillWiderrufsformular: itFormular.fillWiderrufsformular,
    pages: { agb: itAgb, datenschutz: itDatenschutz, impressum: itImpressum, "versand-zahlung": itVersand, widerruf: itWiderruf },
  },
  nl: {
    checkoutTextsFor: nlCheckout.checkoutTextsFor,
    fillWiderrufsformular: nlFormular.fillWiderrufsformular,
    pages: { agb: nlAgb, datenschutz: nlDatenschutz, impressum: nlImpressum, "versand-zahlung": nlVersand, widerruf: nlWiderruf },
  },
  pl: {
    checkoutTextsFor: plCheckout.checkoutTextsFor,
    fillWiderrufsformular: plFormular.fillWiderrufsformular,
    pages: { agb: plAgb, datenschutz: plDatenschutz, impressum: plImpressum, "versand-zahlung": plVersand, widerruf: plWiderruf },
  },
  tr: {
    checkoutTextsFor: trCheckout.checkoutTextsFor,
    fillWiderrufsformular: trFormular.fillWiderrufsformular,
    pages: { agb: trAgb, datenschutz: trDatenschutz, impressum: trImpressum, "versand-zahlung": trVersand, widerruf: trWiderruf },
  },
};

/** Rechtstexte für eine Sprache; `translated=false` bedeutet: deutsche Fassung als Ersatz. */
export function legalFor(locale: string): Bundle & { lang: string; translated: boolean } {
  const bundle = bundles[locale];
  if (bundle) return { ...bundle, lang: locale, translated: locale !== "de" };
  return { ...de, lang: "de", translated: false };
}

export const germanLegal = de;
