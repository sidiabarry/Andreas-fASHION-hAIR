import { type Company, euro, deliveryDaysOf, shippingOf } from "./company-type";

/**
 * Texte für Warenkorb, Kasse, Bestätigungsseite, Widerrufsfunktion und E-Mails (Deutsch,
 * rechtlich maßgeblich).
 *
 * Platzhalter in geschweiften Klammern ersetzt die Website:
 *   {agb} {widerruf} {datenschutz}  → Links auf die Rechtsseiten (Linktext = Wort im Satz)
 *   {name} {orderNo} {total} {items} {shippingAddress} {link}
 *   {paymentInstructions}  → Zahlungsbaustein der gewählten Zahlungsart
 *   {receivedDate} {receivedTime} {withdrawalContent} → Widerrufs-Eingangsbestätigung
 *   {brand} {email} {phone} {address} → Firmendaten
 *
 * `checkoutTexts` ist für Kleinunternehmerin (§ 19 UStG) und die Standard-Versandkosten
 * vorbelegt. Für andere Konstellationen `checkoutTextsFor(company)` verwenden.
 */

function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const vatNote =
    smallBusiness === true
      ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet. Alle Preise sind Endpreise."
      : smallBusiness === false
        ? "Alle Preise sind Endpreise inklusive der gesetzlichen Umsatzsteuer."
        : "[Angabe fehlt: Umsatzsteuer-Status]";
  const shipNote =
    `Versand innerhalb Deutschlands ${euro(domesticCents)}` +
    (freeFromCents !== null ? `, ab ${euro(freeFromCents)} Warenwert versandkostenfrei` : "") +
    (euCents !== null ? `; in die EU ${euro(euCents)}` : "") +
    ". Die Versandkosten sind im Gesamtbetrag enthalten.";

  return {
    /** § 312j Abs. 3 BGB: nichts anderes als diese Worte auf der Schaltfläche. */
    buyButton: "Zahlungspflichtig bestellen",

    /**
     * Stand 21.11.2026: keine Pflicht-Checkbox mehr; AGB per Hinweis über dem Bestellknopf (checkout.agbNotice).
     * Früher: nur `agb` als Pflicht-Checkbox. `widerruf` und `datenschutz` als Hinweistext
     * ohne Checkbox direkt über der Schaltfläche (eine Pflicht-„Einwilligung“ in die
     * Datenschutzerklärung ist rechtlich nicht nötig und kann irreführen) – siehe COMPLIANCE.md.
     */
    consents: {
      agb: "Ich habe die {agb} gelesen und bin mit ihrer Geltung einverstanden.",
      widerruf: "Informationen zu Ihrem Widerrufsrecht und den Ausnahmen (zum Beispiel bei Maßanfertigungen) finden Sie in der {widerruf}.",
      datenschutz: "Wie wir Ihre Daten verarbeiten, erfahren Sie in unserer {datenschutz}.",
    },

    /** Freiwillige Einwilligungen (Checkbox, nicht vorangekreuzt, nicht Pflicht). */
    optionalConsents: {
      carrierEmail:
        "Ja, Sie dürfen meine E-Mail-Adresse an den Versanddienstleister weitergeben, damit er mich über die Zustellung informiert. Die Einwilligung kann ich jederzeit widerrufen.",
      newsletter:
        "Ja, ich möchte den Newsletter von {brand} mit Neuheiten und Angeboten per E-Mail erhalten. Die Abmeldung ist jederzeit möglich. Mehr in der {datenschutz}.",
    },

    /** Direkt vor der Bestell-Schaltfläche anzeigen (§ 312j Abs. 2 BGB). */
    summaryNotes: [
      vatNote,
      shipNote,
      `Lieferzeit: lagernde Stücke innerhalb Deutschlands ${delivery} Werktage (bei Vorkasse/PayPal ab Zahlungseingang); Ausland: Angabe vor Vertragsschluss. Maßanfertigungen: siehe Produktseite.`,
      "Viele Stücke sind Einzelstücke. Wir prüfen die Verfügbarkeit persönlich; der Vertrag kommt erst mit unserer Auftragsbestätigung per E-Mail zustande. Bezahlen können Sie gleich nach dem Absenden oder nach der Auftragsbestätigung.",
      "Maßanfertigungen sind vom Widerrufsrecht ausgeschlossen.",
    ],

    confirmationNotice:
      "Vielen Dank, {name}! Ihre Bestellung {orderNo} ist bei uns eingegangen. Mit dem Absenden haben Sie ein verbindliches Kaufangebot abgegeben. Wir prüfen jetzt persönlich, ob Ihr Stück verfügbar ist, und melden uns innerhalb von drei Werktagen per E-Mail. Der Kaufvertrag kommt zustande, sobald wir Ihre Bestellung mit unserer Auftragsbestätigung annehmen. Sie können gleich hier bezahlen oder nach der Auftragsbestätigung; ist Ihr Stück wider Erwarten nicht verfügbar, erstatten wir bereits gezahlte Beträge unverzüglich. Eine Eingangsbestätigung haben wir Ihnen soeben per E-Mail geschickt.",

    /** § 356a Abs. 1 BGB */
    withdrawalButtonLabel: "Vertrag widerrufen",
    /** § 356a Abs. 3 BGB */
    withdrawalConfirmLabel: "Widerruf bestätigen",
    /** Kurztext auf der Seite der Widerrufsfunktion (Schritt 2) */
    withdrawalFormIntro:
      "Bitte geben Sie Ihren Namen, Ihre Bestellnummer (oder andere Angaben zur Bestellung, zum Beispiel Bestelldatum und Artikel) und die E-Mail-Adresse für die Eingangsbestätigung an. Sie können die ganze Bestellung oder einzelne Artikel widerrufen. Prüfen Sie Ihre Angaben und klicken Sie dann auf „Widerruf bestätigen“.",

    /** Text für die Grafik der harmonisierten Gewährleistungsmitteilung (alt-Attribut). */
    warrantyLabelAlt: "Gesetzliche Gewährleistung: mindestens 2 Jahre – harmonisierte Mitteilung der Europäischen Union",

    mail: {
      orderReceived: {
        subject: "Eingangsbestätigung Ihrer Bestellung {orderNo}",
        body: [
          "Guten Tag {name},",
          "",
          "vielen Dank für Ihre Bestellung. Diese E-Mail bestätigt nur, dass Ihre Bestellung bei uns eingegangen ist. Sie ist noch keine Annahme Ihres Angebots.",
          "",
          "Ihre Bestellung {orderNo}:",
          "{items}",
          "Gesamtbetrag: {total}",
          "Lieferanschrift: {shippingAddress}",
          "",
          "Wir prüfen persönlich, ob Ihr Stück verfügbar ist, und melden uns innerhalb von drei Werktagen. Mit unserer Auftragsbestätigung kommt der Kaufvertrag zustande. Sie können schon jetzt per Überweisung bezahlen (Zahlungsdaten und QR-Code auf Ihrer Bestellbestätigung) oder nach unserer Auftragsbestätigung. Ist Ihr Stück wider Erwarten nicht verfügbar, erstatten wir bereits gezahlte Beträge unverzüglich.",
          "",
          "Herzliche Grüße",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      /** Annahme = Vertragsbestätigung auf dauerhaftem Datenträger (§ 312f Abs. 2 BGB). Anhänge: AGB, Widerrufsbelehrung mit Muster-Widerrufsformular, Gewährleistungsmitteilung (PDF/PNG). */
      orderAccepted: {
        subject: "Auftragsbestätigung Ihrer Bestellung {orderNo}",
        body: [
          "Guten Tag {name},",
          "",
          "gute Nachricht: Ihr Stück ist verfügbar. Hiermit nehmen wir Ihre Bestellung {orderNo} an – der Kaufvertrag ist damit geschlossen.",
          "",
          "{items}",
          "Gesamtbetrag: {total}",
          "Lieferanschrift: {shippingAddress}",
          "",
          "Zahlung: {paymentInstructions}",
          "",
          "Im Anhang finden Sie unsere AGB, die Widerrufsbelehrung mit dem Muster-Widerrufsformular und die Mitteilung über Ihr gesetzliches Gewährleistungsrecht. Ihren Vertrag können Sie innerhalb der Widerrufsfrist auch online über „Vertrag widerrufen“ auf unserer Website widerrufen: {link}",
          "",
          "Herzliche Grüße",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Ihre Bestellung {orderNo}: Stück nicht mehr verfügbar",
        body: [
          "Guten Tag {name},",
          "",
          "leider ist das bestellte Stück aus Ihrer Bestellung {orderNo} nicht mehr verfügbar. Wir können Ihre Bestellung deshalb nicht annehmen; ein Vertrag ist nicht zustande gekommen. Falls Sie bereits gezahlt haben, erstatten wir den Betrag unverzüglich auf demselben Zahlungsweg.",
          "",
          "Gern zeigen wir Ihnen ähnliche Stücke oder fertigen eines nach Ihren Wünschen an – antworten Sie einfach auf diese E-Mail.",
          "",
          "Herzliche Grüße",
          "{brand}",
        ].join("\n"),
      },
      /** § 356a Abs. 4 BGB: unverzüglich, mit Inhalt der Erklärung, Datum und Uhrzeit des Eingangs. */
      withdrawalReceived: {
        subject: "Eingangsbestätigung Ihres Widerrufs",
        body: [
          "Guten Tag {name},",
          "",
          "wir bestätigen den Eingang Ihrer Widerrufserklärung am {receivedDate} um {receivedTime} Uhr.",
          "",
          "Inhalt Ihrer Erklärung:",
          "{withdrawalContent}",
          "",
          "Diese E-Mail bestätigt den Eingang Ihrer Erklärung. Bitte senden Sie die Ware an: {brand}, {address}. Sobald die Ware bei uns ist oder Sie uns die Rücksendung nachweisen, erstatten wir Ihre Zahlung nach den Regeln unserer Widerrufsbelehrung. Gilt für einen Artikel eine gesetzliche Ausnahme vom Widerrufsrecht, teilen wir Ihnen das gesondert mit.",
          "",
          "Herzliche Grüße",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Bitte bestätigen Sie Ihre Newsletter-Anmeldung",
        body: [
          "Guten Tag,",
          "",
          "jemand – hoffentlich Sie – hat diese E-Mail-Adresse für den Newsletter von {brand} angemeldet. Bitte bestätigen Sie die Anmeldung mit einem Klick auf diesen Link:",
          "{link}",
          "",
          "Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach. Ohne Bestätigung erhalten Sie keinen Newsletter, und wir löschen Ihre Adresse nach 30 Tagen.",
          "",
          "Sie können den Newsletter jederzeit abbestellen, über den Link in jeder Ausgabe oder per E-Mail an {email}.",
          "",
          "Herzliche Grüße",
          "{brand}",
        ].join("\n"),
      },
    },

    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "Sie bestellen als Salon, Friseurbetrieb oder anderes Unternehmen? Unser Onlineshop richtet sich an Verbraucher. Bitte stellen Sie eine Anfrage – Sie erhalten ein individuelles Angebot.",
    healthDataNotice:
      "Bitte machen Sie hier keine Angaben zu Ihrer Gesundheit (zum Beispiel Erkrankungen oder Behandlungen). Wir brauchen sie für Beratung und Anfertigung nicht.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

/** Vorbelegt: Kleinunternehmerin, DE 6,00 € (frei ab 150,00 €), EU 15,00 €, 3–5 Werktage. */
export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
