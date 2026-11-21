/**
 * Firmendaten von Andrea's Fashion Hair.
 *
 * Quelle: öffentliche Angaben auf https://www.andreasfashionhair.de/ (Stand 11/2026)
 * sowie ausdrückliche Bestätigungen des Auftraggebers (markiert).
 *
 * Regel: Unbekannte Angaben bleiben `null`. Nichts wird geraten oder ergänzt.
 * `npm run check:launch` listet alle fehlenden Pflichtangaben und schlägt fehl,
 * solange welche fehlen. Die Rechtsseiten zeigen bei `null` keinen Ersatztext,
 * sondern (nur in Entwicklung/Vorschau) einen sichtbaren Hinweis-Block.
 *
 * Diese Datei darf keine Imports haben: Sie wird auch direkt von Node
 * (scripts/check-launch.ts) ohne Bundler geladen.
 */

export type OpeningHours = {
  /** ISO-Wochentage 1 (Montag) bis 7 (Sonntag) */
  days: number[];
  /** "HH:MM", leer = geschlossen */
  opens: string | null;
  closes: string | null;
};

export type Company = {
  /** Geschäftsbezeichnung, wie auf der Live-Seite */
  brandName: string;
  /** Vollständiger Vor- und Nachname der Inhaberin (Pflicht im Impressum, § 5 DDG). */
  ownerFullName: string | null;
  /** Rechtsform, z. B. "Einzelunternehmen". */
  legalForm: string | null;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    countryCode: string;
  };
  phone: string;
  /** Telefonnummer im Format für tel:-Links */
  phoneHref: string;
  email: string;
  social: { instagram: string | null; facebook: string | null; whatsapp: string | null };
  openingHours: OpeningHours[];
  /** Umsatzsteuer-Identifikationsnummer (§ 27a UStG), falls vorhanden. */
  vatId: string | null;
  /** Steuernummer – im Impressum nicht Pflicht, nur für interne Vollständigkeit. */
  taxNumber: string | null;
  /** Kleinunternehmerregelung nach § 19 UStG. */
  smallBusiness: boolean | null;
  /** Handelsregistereintrag, falls vorhanden. `false` = nicht eingetragen (bekannt). */
  register: { court: string; number: string } | false | null;
  /** Verantwortlich für journalistisch-redaktionelle Inhalte (§ 18 Abs. 2 MStV), falls nötig. */
  editorialResponsible: string | null;
  /** Versanddienstleister */
  shippingCarrier: string | null;
  /**
   * Zahlungswege. Leer = noch nicht festgelegt (Kasse bestellt ohne Zahlung, Andrea meldet sich).
   * Vorgemerkt laut Inhaberin: "paypal" (PayPal ist vorhanden), später Ratenzahlung über PayPal.
   */
  paymentMethods: string[];
  /** Bankverbindung für Überweisung (erst nötig, wenn Überweisung angeboten wird). */
  bank: { holder: string; iban: string; bic: string; bankName: string } | null;
  /** PayPal-Konto (erst nötig, wenn PayPal angeboten wird). */
  paypal: string | null;
  /** "Made in Germany" darf verwendet werden. */
  madeInGermany: boolean;
  /** Wer trägt die unmittelbaren Kosten der Rücksendung bei Widerruf? */
  returnCosts: "customer" | "merchant" | null;
  /** Teilnahme an Verbraucherschlichtung (§ 36 VSBG) */
  disputeResolution: "not_willing" | "willing" | null;
  /** Datum, ab dem die Rechtstexte gelten (z. B. "1. Dezember 2026"); beim Livegang setzen */
  legalEffectiveDate: string | null;
  /** Öffentliche Website (kanonische Domain nach dem Umzug). */
  siteUrl: string;
};

export const company: Company = {
  brandName: "Andrea's Fashion Hair",
  // Vom Auftraggeber bestätigt (11/2026), Schreibweise exakt so.
  ownerFullName: "Andreia Pereira Da Costa",
  // Vom Auftraggeber angegeben (Einzelperson, Kleinunternehmerin, 11/2026).
  legalForm: "Einzelunternehmen",
  address: {
    street: "Flehmestr. 2",
    postalCode: "58642",
    city: "Iserlohn",
    country: "Deutschland",
    countryCode: "DE",
  },
  phone: "+49 176 23681585",
  phoneHref: "+4917623681585",
  // Vom Auftraggeber als öffentliche Kontaktadresse festgelegt (11/2026, digitale Visitenkarte).
  email: "andreasfashionhair5@gmail.com",
  // Aus der digitalen Visitenkarte (vom Auftraggeber freigegeben).
  social: {
    instagram: "https://www.instagram.com/andreasfashionhair/",
    facebook: "https://www.facebook.com/share/1AaTrmeRaS/?mibextid=wwXIfr",
    whatsapp: "https://w.app/andreasfashionhair",
  },
  openingHours: [
    { days: [1, 2, 3, 4, 5], opens: "10:00", closes: "19:00" },
    { days: [6], opens: "10:00", closes: "14:00" },
    { days: [7], opens: null, closes: null },
  ],
  // Unbekannt. Bei Kleinunternehmerinnen oft nicht vorhanden – muss bestätigt werden.
  vatId: null,
  // Unbekannt (nicht öffentlich nötig).
  taxNumber: null,
  // Vom Auftraggeber bestätigt (11/2026): Kleinunternehmerin nach § 19 UStG.
  smallBusiness: true,
  // Unbekannt, ob ein Registereintrag besteht.
  register: null,
  // Unbekannt; nur nötig, falls journalistisch-redaktionelle Inhalte angeboten werden.
  editorialResponsible: null,
  // Vom Auftraggeber bestätigt (11/2026). Steht nicht auf der Live-Seite.
  shippingCarrier: "DHL",
  // Zahlungswege werden erst nach Abnahme der Seite festgelegt.
  paymentMethods: [],
  // Unbekannt; erst nötig, wenn Überweisung angeboten wird.
  bank: null,
  // Unbekannt; erst nötig, wenn PayPal angeboten wird.
  paypal: null,
  // Vom Auftraggeber als belegbar bestätigt (11/2026); die Live-Seite führt die Zeile im Footer.
  madeInGermany: true,
  // Unbekannt: Entscheidung der Inhaberin (Empfehlung in docs/COMPLIANCE.md).
  // Vom Auftraggeber bestätigt (21.11.2026): Kundin trägt die Rücksendekosten.
  returnCosts: "customer",
  // Unbekannt: Entscheidung der Inhaberin (Empfehlung in docs/COMPLIANCE.md).
  disputeResolution: null,
  // Wird beim Livegang gesetzt.
  // Stand der Rechtstexte (vom Auftraggeber festgelegt, 21.11.2026).
  legalEffectiveDate: "21. November 2026",
  siteUrl: "https://www.andreasfashionhair.de",
};

/** Hinweis zur Umsatzsteuer neben Preisen. `null`, solange der Status unbekannt ist. */
export function vatNoteKey(c: Company): "smallBusiness" | "inclVat" | null {
  if (c.smallBusiness === true) return "smallBusiness";
  if (c.smallBusiness === false) return "inclVat";
  return null;
}

/** legal=true: erscheint in den Rechtstexten als Marker <mark data-missing>, solange es fehlt. */
export type MissingField = { field: string; why: string; blocking: boolean; legal?: boolean };

/** Liste der fehlenden Pflichtangaben. Wird von check:launch und den Hinweis-Blöcken genutzt. */
export function missingCompanyFields(c: Company): MissingField[] {
  const missing: MissingField[] = [];
  if (!c.ownerFullName)
    missing.push({ field: "ownerFullName", why: "Vollständiger Name der Inhaberin (Impressum § 5 DDG, AGB, Widerrufsbelehrung)", blocking: true, legal: true });
  if (!c.shippingCarrier)
    missing.push({ field: "shippingCarrier", why: "Versanddienstleister (AGB, Versandseite)", blocking: true, legal: true });
  if (!c.legalForm)
    missing.push({ field: "legalForm", why: "Rechtsform (z. B. Einzelunternehmen) für Impressum und AGB", blocking: true });
  if (c.register === null)
    missing.push({ field: "register", why: "Handelsregister: Eintrag nennen oder `false` setzen, wenn keiner besteht", blocking: true });
  if (c.returnCosts === null)
    missing.push({ field: "returnCosts", why: "Wer trägt die Rücksendekosten bei Widerruf? (Widerrufsbelehrung)", blocking: true, legal: true });
  if (c.disputeResolution === null)
    missing.push({ field: "disputeResolution", why: "Teilnahme an Verbraucherschlichtung ja/nein (§ 36 VSBG; Impressum/AGB)", blocking: true, legal: true });
  if (c.legalEffectiveDate === null)
    missing.push({ field: "legalEffectiveDate", why: "Stand-Datum der Rechtstexte beim Livegang setzen", blocking: true, legal: true });
  if (c.smallBusiness === null)
    missing.push({ field: "smallBusiness", why: "Kleinunternehmerstatus § 19 UStG (Preisangaben)", blocking: true });
  if (!c.vatId && c.smallBusiness !== true)
    missing.push({ field: "vatId", why: "USt-IdNr. (Impressum zeigt sonst einen Marker)", blocking: true, legal: true });
  if (!c.vatId && !c.taxNumber && c.smallBusiness === true)
    missing.push({ field: "vatId", why: "USt-IdNr. bzw. Wirtschafts-IdNr. nur angeben, falls vorhanden (§ 5 DDG) – bitte bestätigen, ob eine besteht", blocking: false });
  if (c.paymentMethods.length === 0)
    missing.push({ field: "paymentMethods", why: "Zahlungswege sind nicht festgelegt – AGB/Versandseite zeigen sonst den Marker „Zahlungsart noch festzulegen“", blocking: true, legal: true });
  if (c.paymentMethods.includes("ueberweisung") && !c.bank)
    missing.push({ field: "bank", why: "Bankverbindung für Überweisung", blocking: true });
  if (c.paymentMethods.includes("paypal") && !c.paypal)
    missing.push({ field: "paypal", why: "PayPal-Konto", blocking: true });
  return missing;
}
