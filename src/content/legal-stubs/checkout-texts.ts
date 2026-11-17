// STUB: Platzhalter mit derselben Form wie src/content/legal/checkout-texts.ts (Rechtsagent).
// Die Beschriftung des Bestellknopfs entspricht § 312j Abs. 3 BGB.
import type { Company } from "./company-type";

export const isStub = true;

function build() {
  const mail = (subject: string) => ({ subject, body: "[Text folgt]" });
  return {
    buyButton: "Zahlungspflichtig bestellen",
    consents: {
      agb: "Ich habe die {agb} gelesen und bin mit ihrer Geltung einverstanden.",
      widerruf: "Informationen zu Ihrem Widerrufsrecht finden Sie in der {widerruf}.",
      datenschutz: "Wie wir Ihre Daten verarbeiten, erfahren Sie in unserer {datenschutz}.",
    },
    optionalConsents: { carrierEmail: "", newsletter: "" },
    summaryNotes: [] as string[],
    confirmationNotice: "Vielen Dank, {name}! Ihre Bestellung {orderNo} ist bei uns eingegangen.",
    withdrawalButtonLabel: "Vertrag widerrufen",
    withdrawalConfirmLabel: "Widerruf bestätigen",
    withdrawalFormIntro: "",
    warrantyLabelAlt: "",
    mail: {
      orderReceived: mail("Eingangsbestätigung Ihrer Bestellung {orderNo}"),
      orderAccepted: mail("Auftragsbestätigung Ihrer Bestellung {orderNo}"),
      orderDeclined: mail("Ihre Bestellung {orderNo}"),
      withdrawalReceived: mail("Eingangsbestätigung Ihres Widerrufs"),
      newsletterOptIn: mail("Bitte bestätigen Sie Ihre Newsletter-Anmeldung"),
    },
    healthDataNotice: "Bitte machen Sie hier keine Angaben zu Ihrer Gesundheit.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;
export function checkoutTextsFor(c: Company): CheckoutTexts {
  void c;
  return build();
}
export const checkoutTexts: CheckoutTexts = build();
