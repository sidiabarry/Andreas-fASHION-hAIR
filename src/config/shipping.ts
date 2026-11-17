/**
 * Versandkosten und Lieferzeiten.
 *
 * Quelle: https://www.andreasfashionhair.de/shipping-returns (Stand 11/2026):
 * - Deutschland: 2 bis 4 Werktage nach Versand, ab 6 €; kostenloser Standardversand ab 150 € Bestellwert
 * - Europäische Union: 4 bis 7 Werktage, ab 15 €
 * - Weltweit: 7 bis 14 Werktage, Versandkosten auf Anfrage
 * - Bearbeitung: in der Regel 3 bis 5 Werktage, individuelle/maßgefertigte Stücke können länger dauern
 *
 * Gespräch mit der Inhaberin (11/2026, docs/ANDREA-GESCHICHTE.md): Lieferzeit ab Lager 2 bis 5 Tage,
 * Maßanfertigung 15 bis 20 Tage; Versand weltweit mit DHL (Vertrag inkl. Ausland).
 * Außerhalb der EU nennt Andrea die Versandkosten vor ihrer Bestätigung (keine Online-Kasse, Anfrage).
 *
 * Die Live-Seite schreibt "ab 6 €" bzw. "ab 15 €". Solange keine Staffel bekannt ist,
 * gilt der genannte Betrag als fester Preis. Bitte mit Andrea bestätigen (docs/CHECKLISTE-LAUNCH.md).
 *
 * Keine Imports: wird auch direkt von Node-Tests geladen.
 */

export type ShippingZoneId = "de" | "eu" | "world";

export type ShippingZone = {
  id: ShippingZoneId;
  /** Versandkosten in Cent; null = nur auf Anfrage (keine Online-Bestellung) */
  priceCents: number | null;
  /** Ab diesem Warenwert (Cent, inklusive) versandkostenfrei; null = nie */
  freeFromCents: number | null;
  /** Lieferzeit nach Versand in Werktagen */
  transitDays: [number, number];
};

/** Lieferzeit ab Lager (Tage bis zur Kundin), laut Inhaberin. Einzige Quelle für alle Angaben. */
export const DELIVERY_DAYS_IN_STOCK: [number, number] = [2, 5];
/** Fertigungszeit Maßanfertigung in Tagen, laut Inhaberin. */
export const MADE_TO_ORDER_DAYS: [number, number] = [15, 20];
/** Für die Rechtstexte (Übergabe an den Versanddienstleister spätestens innerhalb dieser Spanne). */
export const HANDLING_DAYS: [number, number] = DELIVERY_DAYS_IN_STOCK;

export const SHIPPING_ZONES: Record<ShippingZoneId, ShippingZone> = {
  de: { id: "de", priceCents: 600, freeFromCents: 15000, transitDays: [2, 4] },
  eu: { id: "eu", priceCents: 1500, freeFromCents: null, transitDays: [4, 7] },
  world: { id: "world", priceCents: null, freeFromCents: null, transitDays: [7, 14] },
};

/** EU-Mitgliedstaaten außer Deutschland (ISO 3166-1 alpha-2). */
export const EU_COUNTRIES = [
  "AT", "BE", "BG", "CY", "CZ", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE",
  "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
] as const;

/** Länder, in die online bestellt werden kann. Alles andere: auf Anfrage. */
export const ORDER_COUNTRIES: string[] = ["DE", ...EU_COUNTRIES];

export function zoneForCountry(countryCode: string): ShippingZone {
  const code = countryCode.toUpperCase();
  if (code === "DE") return SHIPPING_ZONES.de;
  if ((EU_COUNTRIES as readonly string[]).includes(code)) return SHIPPING_ZONES.eu;
  return SHIPPING_ZONES.world;
}

/**
 * Versandkosten für einen Warenwert. `null`, wenn für das Land nur auf Anfrage versendet wird.
 */
export function shippingCents(countryCode: string, subtotalCents: number): number | null {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new RangeError("subtotalCents must be a non-negative integer");
  }
  const zone = zoneForCountry(countryCode);
  if (zone.priceCents === null) return null;
  if (zone.freeFromCents !== null && subtotalCents >= zone.freeFromCents) return 0;
  return zone.priceCents;
}

/** Platzhalter für Texte zu Lieferzeiten (eine Quelle für alle Seiten). */
export function deliveryParams() {
  return {
    from: DELIVERY_DAYS_IN_STOCK[0],
    mFrom: MADE_TO_ORDER_DAYS[0],
    mTo: MADE_TO_ORDER_DAYS[1],
    to: DELIVERY_DAYS_IN_STOCK[1],
  };
}
