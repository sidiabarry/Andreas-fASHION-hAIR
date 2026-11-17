import { type Company, euro, deliveryDaysOf, shippingOf } from "../company-type";

/**
 * English convenience translation of ../checkout-texts.ts (same keys and placeholders).
 * Legally binding is the German version.
 */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const eur = (n: number) => euro(n, "en-IE");
  const vatNote =
    smallBusiness === true
      ? "No VAT is charged under Section 19 of the German VAT Act (UStG). All prices are final prices."
      : smallBusiness === false
        ? "All prices are final prices including statutory VAT."
        : "[Missing: VAT status]";
  const shipNote =
    `Shipping within Germany ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, free from a goods value of ${eur(freeFromCents)}` : "") +
    (euCents !== null ? `; to the EU ${eur(euCents)}` : "") +
    ". Shipping costs are included in the total.";

  return {
    buyButton: "Order with obligation to pay",
    consents: {
      agb: "I have read the {agb} and agree to their application.",
      widerruf: "Information on your right of withdrawal and its exceptions (for example for custom-made pieces) can be found in the {widerruf}.",
      datenschutz: "You can find out how we process your data in our {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Yes, you may pass my email address to the carrier so that it can notify me about delivery. I can withdraw this consent at any time.",
      newsletter: "Yes, I would like to receive the {brand} newsletter with news and offers by email. I can unsubscribe at any time. More in the {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Delivery time: pieces in stock within Germany ${delivery} business days (advance payment/PayPal: from receipt of payment); abroad: stated before conclusion of the contract. Custom-made pieces: see product page.`,
      "Many pieces are unique. We check availability personally; the contract is only concluded with our order confirmation by email. You only pay after that.",
      "Custom-made pieces are excluded from the right of withdrawal.",
    ],
    confirmationNotice:
      "Thank you, {name}! We have received your order {orderNo}. By submitting it you have made a binding offer to buy. We are now personally checking whether your piece is available and will get back to you by email within three working days. The contract of sale is concluded as soon as we accept your order with this order confirmation, which also contains the payment details. Please only pay after that. We have just sent you an acknowledgement of receipt by email.",
    withdrawalButtonLabel: "Withdraw from contract",
    withdrawalConfirmLabel: "Confirm withdrawal",
    withdrawalFormIntro:
      "Please enter your name, your order number (or other details of the order, for example order date and items) and the email address for the acknowledgement of receipt. You can withdraw from the whole order or from individual items. Check your details and then click “Confirm withdrawal”.",
    warrantyLabelAlt: "Legal guarantee: minimum 2 years – harmonised notice of the European Union",
    mail: {
      orderReceived: {
        subject: "Acknowledgement of receipt of your order {orderNo}",
        body: [
          "Dear {name},",
          "",
          "Thank you for your order. This email only confirms that we have received your order. It is not yet an acceptance of your offer.",
          "",
          "Your order {orderNo}:",
          "{items}",
          "Total: {total}",
          "Delivery address: {shippingAddress}",
          "",
          "We are personally checking whether your piece is available and will get back to you within three working days. The contract of sale is concluded with our order confirmation, which also contains the payment details. Please only pay after that.",
          "",
          "Kind regards",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Order confirmation for your order {orderNo}",
        body: [
          "Dear {name},",
          "",
          "Good news: your piece is available. We hereby accept your order {orderNo} – the contract of sale is now concluded.",
          "",
          "{items}",
          "Total: {total}",
          "Delivery address: {shippingAddress}",
          "",
          "Payment: {paymentInstructions}",
          "",
          "Attached you will find our GTC, the withdrawal information with the model withdrawal form and the notice on your statutory warranty rights. During the withdrawal period you can also withdraw from your contract online via “Withdraw from contract” on our website: {link}",
          "",
          "Kind regards",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Your order {orderNo}: piece no longer available",
        body: [
          "Dear {name},",
          "",
          "Unfortunately, the piece in your order {orderNo} is no longer available. We therefore cannot accept your order; no contract has been concluded. If you have already paid, we will refund the amount without undue delay using the same payment method.",
          "",
          "We would be happy to show you similar pieces or make one to your wishes – simply reply to this email.",
          "",
          "Kind regards",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Acknowledgement of receipt of your withdrawal",
        body: [
          "Dear {name},",
          "",
          "We confirm receipt of your withdrawal statement on {receivedDate} at {receivedTime}.",
          "",
          "Content of your statement:",
          "{withdrawalContent}",
          "",
          "This email confirms receipt of your statement. Please send the goods to: {brand}, {address}. As soon as we have the goods back or you have provided proof of return, we will refund your payment in accordance with our withdrawal information. If a statutory exception to the right of withdrawal applies to an item, we will inform you separately.",
          "",
          "Kind regards",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Please confirm your newsletter subscription",
        body: [
          "Hello,",
          "",
          "Someone – hopefully you – has subscribed this email address to the {brand} newsletter. Please confirm the subscription by clicking this link:",
          "{link}",
          "",
          "If you did not subscribe, simply ignore this email. Without confirmation you will not receive a newsletter, and we will delete your address after 30 days.",
          "",
          "You can unsubscribe at any time via the link in every issue or by email to {email}.",
          "",
          "Kind regards",
          "{brand}",
        ].join("\n"),
      },
    },
    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "Ordering as a salon, hairdresser or other business? Our online shop is aimed at consumers. Please send us an enquiry – you will receive an individual offer.",
    healthDataNotice:
      "Please do not enter any information about your health here (for example illnesses or treatments). We do not need it for advice or production.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
