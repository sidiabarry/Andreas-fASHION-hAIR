import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, processingDaysOf, shippingOf } from "../company-type";

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
        <h2 id="geltung">§ 1 Scope and seller</h2>
        <ol>
          <li>These General Terms and Conditions (GTC) apply to all orders placed by consumers (Section 13 BGB) in our online shop.</li>
          <li>
            Your contractual partner is{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="owner's full name" />} (trading as “{c.brandName}”),{" "}
            {addressLine(c)}, phone {c.phone}, email {c.email}.
          </li>
          <li>The language of the contract is German. Translations are provided for your understanding only.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Conclusion of the contract</h2>
        <ol>
          <li>The presentation of products in the online shop is not a binding offer but an invitation to place an order. Many pieces are unique and exist only once.</li>
          <li>
            You add products to the cart, enter your contact and delivery details in the next step
            and then see a summary of all details and the total price. You can correct input errors
            at any time before submitting: with your browser's back button, via “Change” in the cart
            or directly in the input fields. By clicking the button “Order with obligation to pay” you
            submit a binding offer to buy the goods in the cart.
          </li>
          <li>Immediately afterwards you receive an automatic email confirming that we have received your order. This acknowledgement of receipt is not yet an acceptance of your offer.</li>
          <li>
            We personally check whether the piece is available. The contract is concluded when we
            expressly accept your order by email (order confirmation) or dispatch the goods to you –
            whichever happens first. We decide within three working days of receiving the order. If
            you do not receive an acceptance within this period, you are no longer bound by your
            order; we will refund any payment already made without undue delay.
          </li>
          <li>If a unique piece is no longer available, we will inform you without undue delay. No contract for that piece is then concluded.</li>
          <li>With the order confirmation you receive the contract text, these GTC, the withdrawal information and the model withdrawal form by email.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Storage of the contract text</h2>
        <p>
          We store the contract text (your order data and the GTC valid at the time of the order)
          and send it to you by email. You can view, save and print the current GTC on this page at
          any time. We do not offer a customer account in which past orders could be viewed.
        </p>
      </section>

      <section>
        <h2 id="preise">§ 4 Prices and shipping costs</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>All prices are final prices. As a small business within the meaning of Section 19 of the German VAT Act (UStG), we do not charge VAT and therefore do not show it.</>
            ) : c.smallBusiness === false ? (
              <>All prices are final prices and include statutory VAT.</>
            ) : (
              <Missing field="smallBusiness" label="VAT status (small business yes/no)" />
            )}
          </li>
          <li>
            Shipping costs are added: within Germany {eur(ship.domesticCents)} per order
            {ship.freeFromCents !== null ? <>, free of charge from a goods value of {eur(ship.freeFromCents)}</> : null}
            {ship.euCents !== null ? <>; to other countries of the European Union {eur(ship.euCents)} per order</> : null}
            . We will tell you the shipping costs for other countries on request before you order.
            You see the shipping costs in the order summary before submitting your order.
          </li>
          <li>For deliveries to countries outside the European Union, customs duties, taxes and fees may arise, which you pay to the competent authorities.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Payment</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="payment method still to be decided" />
          </p>
        ) : (
          <>
            <p>You can pay with the following payment methods. We send you the payment details with the order confirmation.</p>
            <ul>
              {c.payments.prepayment ? (
                <li>
                  <strong>Advance payment by bank transfer:</strong> Please transfer the total amount
                  within 7 days of receiving the order confirmation. We ship the goods once payment
                  has been received. If payment is not received despite a reminder, we may withdraw
                  from the contract.
                </li>
              ) : null}
              {c.payments.paypal ? (
                <li>
                  <strong>PayPal:</strong> After the order confirmation you receive a payment request
                  from PayPal. Please pay within 7 days. PayPal's terms also apply to the payment. We
                  ship once payment has been received.
                </li>
              ) : null}
              {c.payments.bankTransfer ? (
                <li>
                  <strong>Invoice (bank transfer after receipt of the goods):</strong> The invoice
                  amount is payable without deduction within 14 days of receiving the goods. We may
                  refuse this payment method in individual cases, in particular for high order values
                  or deliveries abroad, and offer you another available payment method instead.
                </li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Delivery</h2>
        <ol>
          <li>
            We deliver within Germany
            {others.length > 0 ? <> and to the following countries: {countryNames(others, "en")}</> : null}. Deliveries
            to other countries are possible by prior arrangement. Shipping is carried out by {carrier}.
          </li>
          <li>
            We hand over goods in stock to the carrier within {processingDaysOf(c)} working days. For
            advance payment or PayPal the period begins on the day after receipt of payment,
            otherwise on the day after conclusion of the contract. The transit time of the parcel is
            added. We state the expected delivery time on the product page and in the order summary.
          </li>
          <li>
            We produce custom-made pieces within about {madeToOrderDaysOf(c)} days after we have all
            the details needed and – for advance payment or PayPal – payment has been received. We
            will tell you the expected dispatch date.
          </li>
          <li>
            If goods arrive with visible transport damage, please complain to the delivery person
            and let us know briefly. Your statutory rights remain unaffected; your report helps us to
            assert claims against the carrier.
          </li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Retention of title</h2>
        <p>The goods remain our property until paid in full.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Custom-made pieces and pieces made to your specifications</h2>
        <ol>
          <li>For products marked as custom-made we produce according to your specifications, for example head measurements, hair colour, density, hair direction and base. Please check your details carefully; we discuss them with you before production starts.</li>
          <li>There is no right of withdrawal for custom-made pieces (Section 312g(2) no. 1 BGB). Details are given in the withdrawal information. Your rights in the event of defects remain unaffected.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Right of withdrawal</h2>
        <p>
          As a consumer you have a statutory right of withdrawal. Conditions, time limits and
          procedure, exceptions and the online withdrawal function “Withdraw from contract” are
          described in our withdrawal information.
        </p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Statutory warranty (liability for defects)</h2>
        <ol>
          <li>The statutory rights in the event of defects apply (Sections 434 et seq. BGB). The limitation period for claims based on defects is two years from delivery of the goods.</li>
          <li>If there is a defect, please contact us: {c.email}, phone {c.phone}, or by post at {addressLine(c)}.</li>
          <li>We only give an additional guarantee if we expressly state it for a product.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Liability</h2>
        <ol>
          <li>We are liable without limitation for intent and gross negligence, for injury to life, body or health, under the German Product Liability Act and to the extent of any guarantee given.</li>
          <li>In the event of a slightly negligent breach of an obligation whose fulfilment is essential for the proper performance of the contract and on whose observance you may regularly rely (material contractual obligation), our liability is limited to the foreseeable damage typical for the contract.</li>
          <li>Otherwise, liability for slight negligence is excluded.</li>
          <li>Your rights in the event of defects under § 10 remain unaffected by these provisions.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Care, adhesive and solvent products</h2>
        <p>
          Before using adhesives, tapes and solvents, please read and follow the manufacturer's
          instructions and warnings on the packaging and on the product page. We recommend testing
          a new product on a small area of skin first. Keep these products out of the reach of
          children. Shipping restrictions may apply to individual products; we point this out on
          the product page.
        </p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Consumer dispute resolution</h2>
        {c.disputeResolution === "willing" ? (
          <p>We are willing to take part in dispute resolution proceedings before the following consumer arbitration board: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decision on consumer dispute resolution (Section 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Applicable law</h2>
        <p>
          The law of the Federal Republic of Germany applies, excluding the UN Convention on
          Contracts for the International Sale of Goods. If your habitual residence is in another
          country, you retain the protection of the mandatory consumer protection provisions of
          that country (Art. 6(2) Rome I Regulation).
        </p>
        <p>
          Last updated: {c.effectiveDate ?? <Missing field="effectiveDate" label="date from which these GTC apply" />}
        </p>
      </section>
    </>
  );
}
