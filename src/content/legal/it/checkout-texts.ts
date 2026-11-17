import { type Company, euro, deliveryDaysOf, shippingOf } from "../company-type";

/** Traduzione italiana di ../checkout-texts.ts (stesse chiavi e segnaposto). Fa fede solo la versione tedesca. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const eur = (n: number) => euro(n, "it-IT");
  const vatNote =
    smallBusiness === true
      ? "IVA non addebitata ai sensi dell'articolo 19 della legge tedesca sull'IVA (UStG). Tutti i prezzi sono prezzi finali."
      : smallBusiness === false
        ? "Tutti i prezzi sono prezzi finali comprensivi di IVA."
        : "[Dato mancante: regime IVA]";
  const shipNote =
    `Spedizione in Germania ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, gratuita da ${eur(freeFromCents)}` : "") +
    (euCents !== null ? `; verso l'UE ${eur(euCents)}` : "") +
    ". Le spese di spedizione sono incluse nel totale.";

  return {
    buyButton: "Ordine con obbligo di pagamento",
    consents: {
      agb: "Ho letto le {agb} e ne accetto l'applicazione.",
      widerruf: "Le informazioni sul diritto di recesso e sulle sue eccezioni (ad esempio per i pezzi su misura) si trovano nelle {widerruf}.",
      datenschutz: "Come trattiamo i Suoi dati è spiegato nella nostra {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Sì, potete comunicare il mio indirizzo e-mail al corriere affinché mi informi sulla consegna. Posso revocare questo consenso in qualsiasi momento.",
      newsletter: "Sì, desidero ricevere per e-mail la newsletter di {brand} con novità e offerte. Posso annullare l'iscrizione in qualsiasi momento. Maggiori informazioni nella {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Tempi di consegna: pezzi disponibili in Germania ${delivery} giorni lavorativi (pagamento anticipato/PayPal: dal ricevimento del pagamento); estero: indicati prima della conclusione del contratto. Pezzi su misura: vedi pagina del prodotto.`,
      "Molti pezzi sono unici. Verifichiamo personalmente la disponibilità; il contratto è concluso solo con la nostra conferma d'ordine via e-mail. Il pagamento avviene solo dopo.",
      "I pezzi realizzati su misura sono esclusi dal diritto di recesso.",
    ],
    confirmationNotice:
      "Grazie, {name}! Abbiamo ricevuto il Suo ordine {orderNo}. Con l'invio ha presentato un'offerta di acquisto vincolante. Ora verifichiamo personalmente la disponibilità del Suo pezzo e Le risponderemo via e-mail entro tre giorni lavorativi. Il contratto di vendita è concluso non appena accettiamo il Suo ordine con tale conferma, che contiene anche i dati di pagamento. Paghi solo dopo. Le abbiamo appena inviato una conferma di ricezione via e-mail.",
    withdrawalButtonLabel: "Recedere dal contratto",
    withdrawalConfirmLabel: "Conferma recesso",
    withdrawalFormIntro:
      "Indichi nome, numero d'ordine (o altri dati, ad esempio data dell'ordine e articoli) e l'indirizzo e-mail per la conferma di ricezione. Può recedere dall'intero ordine o da singoli articoli. Controlli i dati e clicchi su «Conferma recesso».",
    warrantyLabelAlt: "Garanzia legale: almeno 2 anni – comunicazione armonizzata dell'Unione europea",
    mail: {
      orderReceived: {
        subject: "Conferma di ricezione del Suo ordine {orderNo}",
        body: [
          "Gentile {name},",
          "",
          "grazie per il Suo ordine. Questa e-mail conferma solo che lo abbiamo ricevuto. Non costituisce ancora accettazione della Sua offerta.",
          "",
          "Il Suo ordine {orderNo}:",
          "{items}",
          "Totale: {total}",
          "Indirizzo di consegna: {shippingAddress}",
          "",
          "Verifichiamo personalmente la disponibilità del Suo pezzo e Le risponderemo entro tre giorni lavorativi. Il contratto di vendita è concluso con la nostra conferma d'ordine, che contiene anche i dati di pagamento. Paghi solo dopo.",
          "",
          "Cordiali saluti",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Conferma d'ordine {orderNo}",
        body: [
          "Gentile {name},",
          "",
          "buone notizie: il Suo pezzo è disponibile. Con la presente accettiamo il Suo ordine {orderNo}; il contratto di vendita è concluso.",
          "",
          "{items}",
          "Totale: {total}",
          "Indirizzo di consegna: {shippingAddress}",
          "",
          "Pagamento: {paymentInstructions}",
          "",
          "In allegato trova le nostre CGV, le informazioni sul recesso con il modulo tipo e la comunicazione sulla garanzia legale. Durante il periodo di recesso può recedere anche online tramite «Recedere dal contratto» sul nostro sito: {link}",
          "",
          "Cordiali saluti",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Il Suo ordine {orderNo}: pezzo non più disponibile",
        body: [
          "Gentile {name},",
          "",
          "purtroppo il pezzo del Suo ordine {orderNo} non è più disponibile. Non possiamo quindi accettare l'ordine; nessun contratto è stato concluso. Se ha già pagato, Le rimborsiamo l'importo senza indugio con lo stesso mezzo di pagamento.",
          "",
          "Saremo lieti di mostrarLe pezzi simili o di realizzarne uno su misura: basta rispondere a questa e-mail.",
          "",
          "Cordiali saluti",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Conferma di ricezione del Suo recesso",
        body: [
          "Gentile {name},",
          "",
          "confermiamo la ricezione della Sua dichiarazione di recesso il {receivedDate} alle ore {receivedTime}.",
          "",
          "Contenuto della Sua dichiarazione:",
          "{withdrawalContent}",
          "",
          "Questa e-mail conferma la ricezione della Sua dichiarazione. Invii la merce a: {brand}, {address}. Non appena riceviamo la merce o la prova della spedizione, La rimborsiamo secondo le nostre informazioni sul recesso. Se per un articolo vale un'eccezione di legge al diritto di recesso, La informiamo separatamente.",
          "",
          "Cordiali saluti",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Confermi la Sua iscrizione alla newsletter",
        body: [
          "Buongiorno,",
          "",
          "qualcuno – speriamo Lei – ha iscritto questo indirizzo alla newsletter di {brand}. Confermi l'iscrizione cliccando su questo link:",
          "{link}",
          "",
          "Se non si è iscritto/a, ignori questa e-mail. Senza conferma non riceverà la newsletter e cancelleremo l'indirizzo dopo 30 giorni.",
          "",
          "Può annullare l'iscrizione in qualsiasi momento tramite il link in ogni invio o per e-mail a {email}.",
          "",
          "Cordiali saluti",
          "{brand}",
        ].join("\n"),
      },
    },
    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "Ordina come salone, parrucchiere o altra impresa? Il nostro negozio si rivolge ai consumatori. Ci invii una richiesta: riceverà un'offerta individuale.",
    healthDataNotice:
      "La preghiamo di non indicare qui dati sulla Sua salute (ad esempio malattie o terapie). Non ci servono per la consulenza o la realizzazione.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
