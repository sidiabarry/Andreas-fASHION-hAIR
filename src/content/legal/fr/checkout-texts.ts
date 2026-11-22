import { type Company, euro, deliveryDaysOf, shippingOf } from "../company-type";

/** Traduction française de ../checkout-texts.ts (mêmes clés et marqueurs). Seule la version allemande fait foi. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const eur = (n: number) => euro(n, "fr-FR");
  const vatNote =
    smallBusiness === true
      ? "TVA non applicable en vertu de l'article 19 de la loi allemande sur la TVA (UStG). Tous les prix sont des prix finaux."
      : smallBusiness === false
        ? "Tous les prix sont des prix finaux TVA légale incluse."
        : "[Information manquante : statut TVA]";
  const shipNote =
    `Livraison en Allemagne ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, offerte à partir de ${eur(freeFromCents)} d'achats` : "") +
    (euCents !== null ? ` ; vers l'UE ${eur(euCents)}` : "") +
    ". Les frais de livraison sont inclus dans le total.";

  return {
    buyButton: "Commande avec obligation de paiement",
    consents: {
      agb: "J'ai lu les {agb} et j'accepte leur application.",
      widerruf: "Vous trouverez les informations sur votre droit de rétractation et ses exceptions (par exemple pour les pièces sur mesure) dans les {widerruf}.",
      datenschutz: "Pour savoir comment nous traitons vos données, consultez notre {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Oui, vous pouvez transmettre mon adresse e-mail au transporteur afin qu'il m'informe de la livraison. Je peux retirer ce consentement à tout moment.",
      newsletter: "Oui, je souhaite recevoir par e-mail la newsletter de {brand} avec les nouveautés et offres. Désinscription possible à tout moment. Plus d'informations dans la {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Délai de livraison : pièces en stock en Allemagne ${delivery} jours ouvrables (paiement anticipé/PayPal : à compter de la réception du paiement) ; étranger : indiqué avant la conclusion du contrat. Pièces sur mesure : voir la page produit.`,
      "De nombreuses pièces sont uniques. Nous vérifions personnellement la disponibilité ; le contrat n'est conclu qu'avec notre confirmation de commande par e-mail. Vous pouvez payer dès l'envoi ou après la confirmation de commande.",
      "Les pièces fabriquées sur mesure sont exclues du droit de rétractation.",
    ],
    confirmationNotice:
      "Merci, {name} ! Nous avons bien reçu votre commande {orderNo}. En l'envoyant, vous avez fait une offre d'achat ferme. Nous vérifions maintenant personnellement la disponibilité de votre pièce et vous répondons par e-mail sous trois jours ouvrables. Le contrat de vente est conclu dès que nous acceptons votre commande par notre confirmation de commande. Vous pouvez payer ici même ou après la confirmation ; si votre pièce n'est pas disponible, nous remboursons sans délai tout paiement déjà effectué. Nous venons de vous envoyer un accusé de réception par e-mail.",
    withdrawalButtonLabel: "Se rétracter du contrat",
    withdrawalConfirmLabel: "Confirmer la rétractation",
    withdrawalFormIntro:
      "Indiquez votre nom, votre numéro de commande (ou d'autres informations, par exemple date de commande et articles) et l'adresse e-mail pour l'accusé de réception. Vous pouvez vous rétracter pour toute la commande ou pour certains articles. Vérifiez vos informations puis cliquez sur « Confirmer la rétractation ».",
    warrantyLabelAlt: "Garantie légale : 2 ans minimum – information harmonisée de l'Union européenne",
    mail: {
      orderReceived: {
        subject: "Accusé de réception de votre commande {orderNo}",
        body: [
          "Bonjour {name},",
          "",
          "Merci pour votre commande. Cet e-mail confirme uniquement sa réception. Il ne vaut pas encore acceptation de votre offre.",
          "",
          "Votre commande {orderNo} :",
          "{items}",
          "Total : {total}",
          "Adresse de livraison : {shippingAddress}",
          "",
          "Nous vérifions personnellement la disponibilité de votre pièce et vous répondons sous trois jours ouvrables. Le contrat de vente est conclu avec notre confirmation de commande. Vous pouvez payer dès maintenant par virement (informations de paiement et QR code sur votre page de confirmation) ou après notre confirmation. Si votre pièce n'est pas disponible, nous remboursons sans délai tout paiement déjà effectué.",
          "",
          "Bien cordialement",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Confirmation de votre commande {orderNo}",
        body: [
          "Bonjour {name},",
          "",
          "Bonne nouvelle : votre pièce est disponible. Nous acceptons par la présente votre commande {orderNo} – le contrat de vente est ainsi conclu.",
          "",
          "{items}",
          "Total : {total}",
          "Adresse de livraison : {shippingAddress}",
          "",
          "Paiement : {paymentInstructions}",
          "",
          "Vous trouverez en pièce jointe nos CGV, les informations sur la rétractation avec le modèle de formulaire et l'information sur votre garantie légale. Pendant le délai de rétractation, vous pouvez aussi vous rétracter en ligne via « Se rétracter du contrat » sur notre site : {link}",
          "",
          "Bien cordialement",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Votre commande {orderNo} : pièce plus disponible",
        body: [
          "Bonjour {name},",
          "",
          "Malheureusement, la pièce de votre commande {orderNo} n'est plus disponible. Nous ne pouvons donc pas accepter votre commande ; aucun contrat n'a été conclu. Si vous avez déjà payé, nous vous remboursons sans délai par le même moyen de paiement.",
          "",
          "Nous serions ravis de vous présenter des pièces similaires ou d'en fabriquer une selon vos souhaits – répondez simplement à cet e-mail.",
          "",
          "Bien cordialement",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Accusé de réception de votre rétractation",
        body: [
          "Bonjour {name},",
          "",
          "Nous confirmons la réception de votre déclaration de rétractation le {receivedDate} à {receivedTime}.",
          "",
          "Contenu de votre déclaration :",
          "{withdrawalContent}",
          "",
          "Cet e-mail confirme la réception de votre déclaration. Veuillez renvoyer la marchandise à : {brand}, {address}. Dès réception de la marchandise ou de la preuve de son renvoi, nous vous remboursons conformément à nos informations sur la rétractation. Si une exception légale au droit de rétractation s'applique à un article, nous vous en informons séparément.",
          "",
          "Bien cordialement",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Veuillez confirmer votre inscription à la newsletter",
        body: [
          "Bonjour,",
          "",
          "Quelqu'un – vous, nous l'espérons – a inscrit cette adresse e-mail à la newsletter de {brand}. Veuillez confirmer l'inscription en cliquant sur ce lien :",
          "{link}",
          "",
          "Si vous ne vous êtes pas inscrit(e), ignorez simplement cet e-mail. Sans confirmation, vous ne recevrez pas de newsletter et nous supprimerons votre adresse après 30 jours.",
          "",
          "Vous pouvez vous désabonner à tout moment via le lien présent dans chaque envoi ou par e-mail à {email}.",
          "",
          "Bien cordialement",
          "{brand}",
        ].join("\n"),
      },
    },
    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "Vous commandez en tant que salon, coiffeur ou autre professionnel ? Notre boutique s'adresse aux consommateurs. Envoyez-nous une demande – vous recevrez une offre individuelle.",
    healthDataNotice:
      "Merci de ne pas indiquer ici d'informations sur votre santé (par exemple maladies ou traitements). Nous n'en avons pas besoin pour le conseil ou la fabrication.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
