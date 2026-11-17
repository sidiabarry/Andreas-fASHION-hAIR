/**
 * Firmendaten, gegen die die Rechtstexte gerendert werden.
 *
 * Felder mit `null` sind (noch) unbekannt. Die Rechtstexte rendern an diesen
 * Stellen einen sichtbaren Marker `<mark data-missing="feldname">`. Die Website
 * muss in Production prüfen, dass kein solcher Marker mehr ausgeliefert wird.
 *
 * Die mit `?` markierten Felder sind optionale Ergänzungen der Schnittstelle.
 * Fehlen sie, verhalten sich die Texte wie bei `null` (Marker) bzw. nutzen den
 * dokumentierten Standardwert.
 */
export type Company = {
  /** "Andrea's Fashion Hair" */
  brandName: string;
  /** Vollständiger bürgerlicher Name der Inhaberin – Pflichtangabe nach § 5 DDG. */
  ownerFullName: string | null;
  /** z. B. "Einzelunternehmen" */
  legalForm: string | null;
  street: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  /** Öffentliche Profile, die im Footer als reine Links (ohne Plugins) stehen. */
  social?: { instagram?: string | null; facebook?: string | null; whatsapp?: string | null };
  /** Erreichbarkeit, z. B. "Mo–Fr 10–18 Uhr" */
  hours: string;
  /** USt-IdNr. nach § 27a UStG – nur angeben, wenn erteilt. */
  vatId: string | null;
  /** Steuernummer – gehört NICHT ins Impressum; nur für Rechnungen relevant. */
  taxNumber: string | null;
  /** Kleinunternehmerin nach § 19 UStG: true = keine USt, false = Regelbesteuerung, null = ungeklärt. */
  smallBusiness: boolean | null;
  /** z. B. "Amtsgericht Iserlohn, HRA 1234" – nur wenn eingetragen. */
  tradeRegister: string | null;
  bank: { holder: string; iban: string; bic?: string } | null;
  paypalEmail: string | null;
  /** Versanddienstleister, z. B. "DHL" */
  carrier: string | null;
  /** ISO-Ländercodes, Standard ["DE"]; weitere EU-Länder auf Anfrage. */
  shippingCountries: string[];
  /** Adresse für Widerrufe per E-Mail; Standard = email */
  withdrawalEmail: string;
  hostingProvider: { name: string; address: string };
  processors: Array<{ name: string; purpose: string; country: string; basis: string }>;
  /**
   * Aktivierte Zahlungsarten. Alle `false` = noch nicht festgelegt (Marker).
   * - paypal: Zahlung über PayPal nach Annahme der Bestellung (Zahlungslink/Anforderung).
   * - prepayment: Vorkasse per Banküberweisung; Versand nach Zahlungseingang.
   * - bankTransfer: Kauf auf Rechnung; Überweisung nach Erhalt der Ware.
   */
  payments: {
    paypal: boolean;
    bankTransfer: boolean;
    prepayment: boolean;
    /** Ratenzahlung über PayPal (Kreditgeber: PayPal). Standard: aus. */
    paypalInstallments?: boolean;
  };

  /** Wer trägt die unmittelbaren Kosten der Rücksendung bei Widerruf? Fehlt/null = Marker. */
  returnCosts?: "customer" | "merchant" | null;
  /**
   * Bereitschaft zur Verbraucherschlichtung (§ 36 VSBG).
   * "not_willing" = nicht bereit/nicht verpflichtet; "willing" = Teilnahme vor der
   * Universalschlichtungsstelle des Bundes. Fehlt/null = Marker.
   */
  disputeResolution?: "not_willing" | "willing" | null;
  /** Öffentliche Adresse der Website, z. B. "https://www.andreas-fashion-hair.de" */
  siteUrl?: string | null;
  /** Vollständige URL der Widerrufsfunktion (§ 356a BGB), z. B. siteUrl + "/vertrag-widerrufen" */
  withdrawalUrl?: string | null;
  /** Versandkosten in Cent. Standard: DE 600, versandkostenfrei ab 15000, EU 1500. */
  shippingRates?: { domesticCents: number; freeFromCents: number | null; euCents: number | null };
  /** Gesamtlieferzeit lagernder Ware bis zur Zustellung in Deutschland, in Werktagen (nur Zahlen). Standard "2–5". */
  deliveryDays?: string;
  /** @deprecated Nicht mehr verwendet; ersetzt durch `deliveryDays`. */
  processingDays?: string;
  /** Fertigungszeit bei Maßanfertigung in Werktagen (nur Zahlen). Standard "15–20". */
  madeToOrderDays?: string;
  /** Datum, ab dem die Texte gelten (Stand-Angabe), z. B. "1. Dezember 2026". */
  effectiveDate?: string | null;
};

/* ---------- Gemeinsame Hilfen für alle Sprachfassungen (ohne JSX) ---------- */

/** Standard-Versandkosten laut Live-Seite: DE 6,00 €, frei ab 150,00 €; EU 15,00 €. */
export const DEFAULT_SHIPPING = { domesticCents: 600, freeFromCents: 15000, euCents: 1500 } as const;

export function shippingOf(c: Company): { domesticCents: number; freeFromCents: number | null; euCents: number | null } {
  return c.shippingRates ?? { ...DEFAULT_SHIPPING };
}

/** Betrag in Cent als Währungsangabe, z. B. 600 → "6,00 €" (de-DE). */
export function euro(cents: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function deliveryDaysOf(c: Company): string {
  return c.deliveryDays ?? "2–5";
}

export function madeToOrderDaysOf(c: Company): string {
  return c.madeToOrderDays ?? "15–20";
}

export function anyPayment(c: Company): boolean {
  return c.payments.paypal || c.payments.bankTransfer || c.payments.prepayment;
}

/** Anschrift einzeilig, z. B. "Flehmestr. 2, 58642 Iserlohn, Deutschland". */
export function addressLine(c: Company): string {
  return `${c.street}, ${c.zip} ${c.city}, ${c.country}`;
}

/** Aufsichtsbehörde für Datenschutz in NRW (Stand der Recherche: November 2026). */
export const LDI_NRW = {
  name: "Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)",
  address: "Kavalleriestraße 2–4, 40213 Düsseldorf",
  web: "https://www.ldi.nrw.de",
} as const;

/** Allgemeine Verbraucherschlichtungsstelle (§ 29 VSBG), Stand der Recherche: November 2026. */
export const UNIVERSAL_ADR = {
  name: "Universalschlichtungsstelle des Bundes, Zentrum für Schlichtung e. V.",
  address: "Straßburger Straße 8, 77694 Kehl am Rhein",
  web: "https://www.universalschlichtungsstelle.de",
} as const;

export const META_IRELAND = "Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland";
export const WHATSAPP_IRELAND = "WhatsApp Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland";
export const GOOGLE_IRELAND = "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland";
export const PAYPAL_EUROPE = "PayPal (Europe) S.à r.l. et Cie, S.C.A., 22–24 Boulevard Royal, L-2449 Luxemburg";

/** Ländernamen aus ISO-Codes in der jeweiligen Sprache, z. B. ["AT","NL"] → "Österreich, Niederlande". */
export function countryNames(codes: string[], locale = "de"): string {
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    dn = null;
  }
  return codes.map((code) => dn?.of(code) ?? code).join(", ");
}
