/**
 * Übergabe der Firmendaten an die Rechtstexte (Schnittstelle des Rechtsagenten:
 * src/content/legal/company-type.ts). Hier wird nichts ergänzt, was nicht in company.ts steht;
 * unbekannte Werte bleiben null und erscheinen in den Texten als Marker.
 */
import type { Company as LegalCompany } from "@/content/legal/company-type";

import { company } from "./company";
import type { Company } from "./company";
import { EU_COUNTRIES, HANDLING_DAYS, MADE_TO_ORDER_DAYS, SHIPPING_ZONES } from "./shipping";

/** Hosting und Auftragsverarbeiter (für die Datenschutzerklärung). Vor dem Launch mit den AV-Verträgen abgleichen. */
export const HOSTING = {
  address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
  name: "Vercel Inc.",
};

/** E-Mail-Versand (nur wenn RESEND_API_KEY gesetzt ist). Angaben vor dem Launch mit dem AV-Vertrag abgleichen. */
export const PROCESSORS = [
  {
    basis: "Art. 6 Abs. 1 lit. b DSGVO; Auftragsverarbeitung nach Art. 28 DSGVO",
    country: "USA",
    name: "Resend (Plus Five Five, Inc.)",
    purpose: "Versand von E-Mails (Bestell- und Eingangsbestätigungen, Antworten auf Anfragen)",
  },
];

function hoursText(c: Company): string {
  const names = ["", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  return c.openingHours
    .map((h) => {
      const days = h.days.length > 1 ? `${names[h.days[0]]}–${names[h.days[h.days.length - 1]]}` : names[h.days[0]];
      return h.opens && h.closes ? `${days} ${h.opens}–${h.closes} Uhr` : `${days} geschlossen`;
    })
    .join(", ");
}

export function toLegalCompany(c: Company = company): LegalCompany {
  return {
    bank: c.bank ? { bic: c.bank.bic, holder: c.bank.holder, iban: c.bank.iban } : null,
    brandName: c.brandName,
    carrier: c.shippingCarrier,
    city: c.address.city,
    country: c.address.country,
    disputeResolution: c.disputeResolution,
    effectiveDate: c.legalEffectiveDate,
    email: c.email,
    hostingProvider: HOSTING,
    hours: hoursText(c),
    legalForm: c.legalForm,
    madeToOrderDays: `${MADE_TO_ORDER_DAYS[0]}–${MADE_TO_ORDER_DAYS[1]}`,
    ownerFullName: c.ownerFullName,
    paypalEmail: c.paypal,
    payments: {
      bankTransfer: c.paymentMethods.includes("rechnung"),
      paypal: c.paymentMethods.includes("paypal"),
      prepayment: c.paymentMethods.includes("ueberweisung"),
    },
    phone: c.phone,
    processingDays: `${HANDLING_DAYS[0]}–${HANDLING_DAYS[1]}`,
    processors: PROCESSORS,
    returnCosts: c.returnCosts,
    shippingCountries: ["DE", ...EU_COUNTRIES],
    shippingRates: {
      domesticCents: SHIPPING_ZONES.de.priceCents ?? 0,
      euCents: SHIPPING_ZONES.eu.priceCents,
      freeFromCents: SHIPPING_ZONES.de.freeFromCents,
    },
    siteUrl: c.siteUrl,
    smallBusiness: c.smallBusiness,
    social: c.social,
    street: c.address.street,
    taxNumber: c.taxNumber,
    tradeRegister: c.register ? `${c.register.court}, ${c.register.number}` : null,
    vatId: c.vatId,
    withdrawalEmail: c.email,
    withdrawalUrl: `${c.siteUrl}/de/widerruf/erklaeren`,
    zip: c.address.postalCode,
  };
}
