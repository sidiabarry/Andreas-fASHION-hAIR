import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Gegeven ontbreekt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "nl-NL");
  const carrier = c.carrier ?? <Missing field="carrier" label="vervoerder" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Let op:</strong> Alleen de Duitse versie is juridisch bindend; deze vertaling dient
        uitsluitend ter verduidelijking.
      </p>
      <section>
        <h2 id="versandkosten">1. Verzendkosten</h2>
        <dl>
          <dt>Duitsland</dt>
          <dd>
            {eur(ship.domesticCents)} per bestelling
            {ship.freeFromCents !== null ? <>; gratis vanaf {eur(ship.freeFromCents)}</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Landen van de Europese Unie</dt>
              <dd>{eur(ship.euCents)} per bestelling{others.length === 0 ? <> (levering na overleg)</> : null}</dd>
            </>
          ) : null}
          <dt>Andere landen</dt>
          <dd>op aanvraag – wij noemen u de kosten vóór de bestelling</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>Als kleine ondernemer volgens artikel 19 van de Duitse btw-wet (UStG) berekenen wij geen btw, ook niet over de verzendkosten.</>
          ) : c.smallBusiness === false ? (
            <>Alle prijzen en verzendkosten zijn inclusief wettelijke btw.</>
          ) : (
            <Missing field="smallBusiness" label="btw-status (kleine ondernemer ja/nee)" />
          )}{" "}
          Bij levering buiten de Europese Unie kunnen douanerechten, invoerbelastingen en kosten
          verschuldigd zijn, die u aan de bevoegde instanties betaalt.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Levering en levertijd</h2>
        <ul>
          <li>
            Wij verzenden met {carrier}, discreet verpakt en met track-and-trace. Leverlanden:
            Duitsland{others.length > 0 ? <>, {countryNames(others, "nl")}</> : null}; andere landen na overleg.
          </li>
          <li>Stukken op voorraad zijn binnen Duitsland in {deliveryDaysOf(c)} werkdagen bij u – bij vooruitbetaling en PayPal vanaf de dag na ontvangst van de betaling, anders vanaf de dag na het sluiten van de overeenkomst. De levertijd naar het buitenland noemen wij u vóór het sluiten van de overeenkomst.</li>
          <li>Maatwerk vervaardigen wij in ongeveer {madeToOrderDaysOf(c)} werkdagen zodra alle gegevens en – bij vooruitbetaling of PayPal – de betaling binnen zijn.</li>
          <li>Om veiligheidsredenen kunnen wij sommige verzorgings-, lijm- en oplosmiddelproducten niet naar elk land verzenden. Wij vermelden dit op de productpagina.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Betaalwijzen</h2>
        <p>Na uw bestelling controleren wij persoonlijk de beschikbaarheid en sturen wij u een orderbevestiging met de betaalgegevens. U betaalt pas nadat wij uw bestelling hebben aanvaard.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="betaalwijze nog vast te stellen" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Vooruitbetaling per overschrijving</strong> – binnen 7 dagen na de
                orderbevestiging; verzending na ontvangst van de betaling.
                {c.bank ? (
                  <>
                    {" "}Rekeninghouder: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Vermeld uw bestelnummer als omschrijving.
                  </>
                ) : (
                  <> <Missing field="bank" label="bankgegevens" /></>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – na de orderbevestiging ontvangt u een betaalverzoek via PayPal
                {c.paypalEmail ? <> van {c.paypalEmail}</> : <> <Missing field="paypalEmail" label="PayPal-account" /></>}
                ; te betalen binnen 7 dagen. Verzending na ontvangst van de betaling.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Betalen in termijnen via PayPal</strong> – als PayPal dit aanbiedt; kredietgever is PayPal, na diens kredietcontrole en volgens diens voorwaarden. Wij verlenen zelf geen krediet.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Factuur</strong> – overschrijving binnen 14 dagen na ontvangst van de goederen.
                Wij kunnen deze betaalwijze in afzonderlijke gevallen weigeren en u een andere
                beschikbare betaalwijze aanbieden.
                {c.bank ? null : <> <Missing field="bank" label="bankgegevens" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Wij rekenen geen extra kosten voor de betaling.</p>
      </section>
    </>
  );
}
