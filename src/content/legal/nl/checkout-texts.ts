import { type Company, euro, deliveryDaysOf, shippingOf } from "../company-type";

/** Nederlandse vertaling van ../checkout-texts.ts (zelfde sleutels en plaatshouders). Alleen de Duitse versie is bindend. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const eur = (n: number) => euro(n, "nl-NL");
  const vatNote =
    smallBusiness === true
      ? "Geen btw berekend op grond van artikel 19 van de Duitse btw-wet (UStG). Alle prijzen zijn eindprijzen."
      : smallBusiness === false
        ? "Alle prijzen zijn eindprijzen inclusief wettelijke btw."
        : "[Gegeven ontbreekt: btw-status]";
  const shipNote =
    `Verzending binnen Duitsland ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, gratis vanaf ${eur(freeFromCents)}` : "") +
    (euCents !== null ? `; naar de EU ${eur(euCents)}` : "") +
    ". De verzendkosten zijn in het totaalbedrag inbegrepen.";

  return {
    buyButton: "Bestelling met betalingsverplichting",
    consents: {
      agb: "Ik heb de {agb} gelezen en ga akkoord met de toepassing ervan.",
      widerruf: "Informatie over uw herroepingsrecht en de uitzonderingen (bijvoorbeeld voor maatwerk) vindt u in de {widerruf}.",
      datenschutz: "Hoe wij uw gegevens verwerken, leest u in onze {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Ja, u mag mijn e-mailadres aan de vervoerder doorgeven zodat die mij over de bezorging kan informeren. Ik kan deze toestemming altijd intrekken.",
      newsletter: "Ja, ik wil de nieuwsbrief van {brand} met nieuws en aanbiedingen per e-mail ontvangen. Afmelden kan altijd. Meer in de {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Levertijd: stukken op voorraad binnen Duitsland ${delivery} werkdagen (vooruitbetaling/PayPal: vanaf ontvangst van de betaling); buitenland: vermeld vóór het sluiten van de overeenkomst. Maatwerk: zie productpagina.`,
      "Veel stukken zijn unica. Wij controleren de beschikbaarheid persoonlijk; de overeenkomst komt pas tot stand met onze orderbevestiging per e-mail. U betaalt pas daarna.",
      "Maatwerk is uitgesloten van het herroepingsrecht.",
    ],
    confirmationNotice:
      "Dank u wel, {name}! Wij hebben uw bestelling {orderNo} ontvangen. Met het verzenden hebt u een bindend koopaanbod gedaan. Wij controleren nu persoonlijk of uw stuk beschikbaar is en laten binnen drie werkdagen per e-mail van ons horen. De koopovereenkomst komt tot stand zodra wij uw bestelling met die orderbevestiging aanvaarden; daarin staan ook de betaalgegevens. Betaal pas daarna. Wij hebben u zojuist een ontvangstbevestiging per e-mail gestuurd.",
    withdrawalButtonLabel: "Overeenkomst herroepen",
    withdrawalConfirmLabel: "Herroeping bevestigen",
    withdrawalFormIntro:
      "Vul uw naam, uw bestelnummer (of andere gegevens, bijvoorbeeld besteldatum en artikelen) en het e-mailadres voor de ontvangstbevestiging in. U kunt de hele bestelling of afzonderlijke artikelen herroepen. Controleer uw gegevens en klik dan op „Herroeping bevestigen”.",
    warrantyLabelAlt: "Wettelijke garantie: minimaal 2 jaar – geharmoniseerde kennisgeving van de Europese Unie",
    mail: {
      orderReceived: {
        subject: "Ontvangstbevestiging van uw bestelling {orderNo}",
        body: [
          "Beste {name},",
          "",
          "Hartelijk dank voor uw bestelling. Deze e-mail bevestigt alleen dat wij uw bestelling hebben ontvangen. Het is nog geen aanvaarding van uw aanbod.",
          "",
          "Uw bestelling {orderNo}:",
          "{items}",
          "Totaal: {total}",
          "Bezorgadres: {shippingAddress}",
          "",
          "Wij controleren persoonlijk of uw stuk beschikbaar is en laten binnen drie werkdagen van ons horen. De koopovereenkomst komt tot stand met onze orderbevestiging, waarin ook de betaalgegevens staan. Betaal pas daarna.",
          "",
          "Met vriendelijke groet",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Orderbevestiging van uw bestelling {orderNo}",
        body: [
          "Beste {name},",
          "",
          "Goed nieuws: uw stuk is beschikbaar. Hierbij aanvaarden wij uw bestelling {orderNo} – de koopovereenkomst is daarmee gesloten.",
          "",
          "{items}",
          "Totaal: {total}",
          "Bezorgadres: {shippingAddress}",
          "",
          "Betaling: {paymentInstructions}",
          "",
          "In de bijlage vindt u onze algemene voorwaarden, de informatie over het herroepingsrecht met het modelformulier en de kennisgeving over uw wettelijke garantie. Tijdens de herroepingstermijn kunt u ook online herroepen via „Overeenkomst herroepen” op onze website: {link}",
          "",
          "Met vriendelijke groet",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Uw bestelling {orderNo}: stuk niet meer beschikbaar",
        body: [
          "Beste {name},",
          "",
          "Helaas is het stuk uit uw bestelling {orderNo} niet meer beschikbaar. Wij kunnen uw bestelling daarom niet aanvaarden; er is geen overeenkomst tot stand gekomen. Hebt u al betaald, dan betalen wij het bedrag onverwijld terug via dezelfde betaalwijze.",
          "",
          "Graag laten wij u vergelijkbare stukken zien of maken wij er een naar uw wensen – antwoord gewoon op deze e-mail.",
          "",
          "Met vriendelijke groet",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Ontvangstbevestiging van uw herroeping",
        body: [
          "Beste {name},",
          "",
          "Wij bevestigen de ontvangst van uw herroepingsverklaring op {receivedDate} om {receivedTime} uur.",
          "",
          "Inhoud van uw verklaring:",
          "{withdrawalContent}",
          "",
          "Deze e-mail bevestigt de ontvangst van uw verklaring. Stuur de goederen naar: {brand}, {address}. Zodra wij de goederen terug hebben of u de terugzending hebt aangetoond, betalen wij u terug volgens onze informatie over het herroepingsrecht. Geldt voor een artikel een wettelijke uitzondering op het herroepingsrecht, dan laten wij u dat apart weten.",
          "",
          "Met vriendelijke groet",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Bevestig uw aanmelding voor de nieuwsbrief",
        body: [
          "Hallo,",
          "",
          "Iemand – hopelijk u – heeft dit e-mailadres aangemeld voor de nieuwsbrief van {brand}. Bevestig de aanmelding door op deze link te klikken:",
          "{link}",
          "",
          "Hebt u zich niet aangemeld, negeer deze e-mail dan. Zonder bevestiging ontvangt u geen nieuwsbrief en verwijderen wij uw adres na 30 dagen.",
          "",
          "U kunt zich altijd afmelden via de link in elke nieuwsbrief of per e-mail aan {email}.",
          "",
          "Met vriendelijke groet",
          "{brand}",
        ].join("\n"),
      },
    },
    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "Bestelt u als salon, kapper of ander bedrijf? Onze webwinkel richt zich op consumenten. Stuur ons een aanvraag – u ontvangt een individueel aanbod.",
    healthDataNotice:
      "Vermeld hier alstublieft geen gegevens over uw gezondheid (bijvoorbeeld ziekten of behandelingen). Wij hebben die niet nodig voor advies of vervaardiging.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
