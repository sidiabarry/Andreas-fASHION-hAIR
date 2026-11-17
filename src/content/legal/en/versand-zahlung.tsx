import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, processingDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Missing: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "en-IE");
  const carrier = c.carrier ?? <Missing field="carrier" label="shipping carrier" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Please note:</strong> The German version is legally binding; this translation is
        provided for your understanding.
      </p>
      <section>
        <h2 id="versandkosten">1. Shipping costs</h2>
        <dl>
          <dt>Germany</dt>
          <dd>
            {eur(ship.domesticCents)} per order
            {ship.freeFromCents !== null ? <>; free shipping from a goods value of {eur(ship.freeFromCents)}</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Countries of the European Union</dt>
              <dd>{eur(ship.euCents)} per order{others.length === 0 ? <> (delivery by arrangement)</> : null}</dd>
            </>
          ) : null}
          <dt>Other countries</dt>
          <dd>on request – we will tell you the shipping costs before you order</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>As a small business under Section 19 of the German VAT Act (UStG) we do not charge VAT – including on shipping costs.</>
          ) : c.smallBusiness === false ? (
            <>All prices and shipping costs include statutory VAT.</>
          ) : (
            <Missing field="smallBusiness" label="VAT status (small business yes/no)" />
          )}{" "}
          For deliveries outside the European Union, customs duties, import taxes and fees may arise,
          which you pay to the competent authorities.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Delivery and delivery time</h2>
        <ul>
          <li>
            We ship with {carrier}, discreetly packed and with tracking. Delivery countries: Germany
            {others.length > 0 ? <>, {countryNames(others, "en")}</> : null}; other countries by arrangement.
          </li>
          <li>
            We hand over pieces in stock to the carrier within {processingDaysOf(c)} working days –
            for advance payment and PayPal from the day after receipt of payment, otherwise from the
            day after conclusion of the contract. The transit time of the parcel is added.
          </li>
          <li>
            We produce custom-made pieces in about {madeToOrderDaysOf(c)} days once all details and –
            for advance payment or PayPal – payment have been received.
          </li>
          <li>For safety reasons we cannot ship some care, adhesive and solvent products to every country. We point this out on the product page.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Payment methods</h2>
        <p>
          After your order we personally check availability and send you an order confirmation with
          the payment details. You only pay after we have accepted your order.
        </p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="payment method still to be decided" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Advance payment by bank transfer</strong> – payable within 7 days of the order
                confirmation; shipping after receipt of payment.
                {c.bank ? (
                  <>
                    {" "}Account holder: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Please state your order number as
                    the payment reference.
                  </>
                ) : (
                  <> <Missing field="bank" label="bank details" /></>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – after the order confirmation you receive a payment request
                via PayPal
                {c.paypalEmail ? <> from {c.paypalEmail}</> : <> <Missing field="paypalEmail" label="PayPal account" /></>}
                ; payable within 7 days. Shipping after receipt of payment.
              </li>
            ) : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Invoice</strong> – bank transfer within 14 days of receiving the goods. We
                may refuse this payment method in individual cases and offer you another available
                payment method.
                {c.bank ? null : <> <Missing field="bank" label="bank details" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>We do not charge any additional fees for payment.</p>
      </section>
    </>
  );
}
