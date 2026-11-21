import { type Company, countryNames, anyPayment, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "./company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Angabe fehlt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const carrier = c.carrier ?? <Missing field="carrier" label="Versanddienstleister" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <section>
        <h2 id="versandkosten">1. Versandkosten</h2>
        <dl>
          <dt>Deutschland</dt>
          <dd>
            {euro(ship.domesticCents)} je Bestellung
            {ship.freeFromCents !== null ? <>; ab {euro(ship.freeFromCents)} Warenwert versandkostenfrei</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Länder der Europäischen Union</dt>
              <dd>{euro(ship.euCents)} je Bestellung{others.length === 0 ? <> (Lieferung nach Absprache)</> : null}</dd>
            </>
          ) : null}
          <dt>Andere Länder</dt>
          <dd>auf Anfrage – wir nennen Ihnen die Versandkosten vor der Bestellung</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>Als Kleinunternehmerin nach § 19 UStG berechnen wir keine Umsatzsteuer – auch nicht auf die Versandkosten.</>
          ) : c.smallBusiness === false ? (
            <>Alle Preise und Versandkosten enthalten die gesetzliche Umsatzsteuer.</>
          ) : (
            <Missing field="smallBusiness" label="Umsatzsteuer-Status (Kleinunternehmerin ja/nein)" />
          )}{" "}
          Bei Lieferungen außerhalb der Europäischen Union können Zölle, Einfuhrsteuern und Gebühren
          anfallen, die Sie an die zuständigen Stellen zahlen.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Lieferung und Lieferzeit</h2>
        <ul>
          <li>
            Wir versenden mit {carrier}, diskret verpackt und mit Sendungsverfolgung. Lieferländer:
            Deutschland{others.length > 0 ? <>, {countryNames(others)}</> : null}; weitere Länder nach
            Absprache.
          </li>
          <li>Lagernde Stücke sind innerhalb Deutschlands in {deliveryDaysOf(c)} Werktagen bei Ihnen – bei Vorkasse und PayPal ab dem Tag nach Zahlungseingang, sonst ab dem Tag nach Vertragsschluss. Die Lieferzeit ins Ausland nennen wir Ihnen vor Vertragsschluss.</li>
          <li>
            Maßanfertigungen sind innerhalb Deutschlands in {madeToOrderDaysOf(c)} Werktagen bei Ihnen, gerechnet ab dem Tag, nachdem alle Angaben und – bei Vorkasse oder PayPal – die Zahlung vorliegen.
          </li>
          <li>
            Einige Pflege-, Klebe- und Lösungsmittelprodukte können wir aus Sicherheitsgründen
            nicht in jedes Land versenden. Darauf weisen wir auf der Produktseite hin.
          </li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Zahlungsarten</h2>
        <p>
          Nach Ihrer Bestellung prüfen wir die Verfügbarkeit persönlich und senden Ihnen eine
          Auftragsbestätigung. Sie können sofort nach der Bestellung bezahlen oder nach unserer
          Auftragsbestätigung. Ist ein Stück nicht verfügbar, erstatten wir bereits gezahlte Beträge unverzüglich.
        </p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="Zahlungsart noch festzulegen" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Vorkasse per Überweisung</strong> – zahlbar sofort nach der Bestellung, spätestens 7 Tage nach der
                Auftragsbestätigung; Versand nach Zahlungseingang.
                {c.bank ? (
                  <>
                    {" "}Kontoinhaberin: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Bitte geben Sie Ihre
                    Bestellnummer als Verwendungszweck an.
                  </>
                ) : (
                  <>{" "}Die Bankverbindung erhalten Sie mit der Auftragsbestätigung.</>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – Sie erhalten nach der Auftragsbestätigung eine
                Zahlungsaufforderung über PayPal
                {c.paypalEmail ? <> von {c.paypalEmail}</> : null}
                ; zahlbar innerhalb von 7 Tagen. Versand nach Zahlungseingang.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Ratenzahlung über PayPal</strong> – sofern PayPal sie Ihnen anbietet; Kreditgeber ist PayPal, nach dessen Bonitätsprüfung und Bedingungen. Wir selbst gewähren keinen Kredit.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Rechnung</strong> – Überweisung innerhalb von 14 Tagen nach Erhalt der
                Ware. Wir können diese Zahlungsart im Einzelfall ablehnen und Ihnen eine andere
                angebotene Zahlungsart vorschlagen.
                {c.bank ? null : <> <Missing field="bank" label="Bankverbindung" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Für die Zahlung berechnen wir keine zusätzlichen Gebühren.</p>
      </section>
    </>
  );
}
