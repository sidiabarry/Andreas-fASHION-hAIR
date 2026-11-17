import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Missing: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>our website via the “Withdraw from contract” button at the bottom of every page</>;
  return (
    <>
      <p>
        <strong>Please note:</strong> The German version is legally binding; this translation is
        provided for your understanding.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Withdrawal information</h2>
        <h3 id="widerrufsrecht">Right of withdrawal</h3>
        <p>You have the right to withdraw from this contract within 14 days without giving any reason.</p>
        <p>
          The withdrawal period will expire after 14 days from the day on which you acquire, or a
          third party other than the carrier and indicated by you acquires, physical possession of
          the goods. If you have ordered several goods in one order and they are delivered
          separately, the withdrawal period will expire after 14 days from the day on which you
          acquire, or a third party other than the carrier and indicated by you acquires, physical
          possession of the last good.
        </p>
        <p>
          To exercise the right of withdrawal, you must inform us (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="owner's full name" />}, {c.brandName},{" "}
          {addressLine(c)}, phone {c.phone}, email {c.withdrawalEmail}) of your decision to withdraw
          from this contract by an unequivocal statement (e.g. a letter sent by post or an email).
          You may use the attached model withdrawal form, but it is not obligatory.
        </p>
        <p>
          You can also exercise your right of withdrawal online at {where}. If you use this online
          function, we will send you without undue delay, on a durable medium (e.g. by email), an
          acknowledgement of receipt with information on the content of the withdrawal statement
          and the date and time of its receipt.
        </p>
        <p>
          To meet the withdrawal deadline, it is sufficient for you to send your communication
          concerning your exercise of the right of withdrawal before the withdrawal period has
          expired.
        </p>

        <h3 id="folgen">Effects of withdrawal</h3>
        <p>
          If you withdraw from this contract, we shall reimburse to you all payments received from
          you, including the costs of delivery (with the exception of the supplementary costs
          resulting from your choice of a type of delivery other than the least expensive type of
          standard delivery offered by us), without undue delay and in any event not later than 14
          days from the day on which we are informed about your decision to withdraw from this
          contract. We will carry out such reimbursement using the same means of payment as you used
          for the initial transaction, unless you have expressly agreed otherwise; in any event, you
          will not incur any fees as a result of such reimbursement. We may withhold reimbursement
          until we have received the goods back or you have supplied evidence of having sent back
          the goods, whichever is the earliest.
        </p>
        <p>
          You shall send back the goods or hand them over to us without undue delay and in any
          event not later than 14 days from the day on which you communicate your withdrawal from
          this contract to us. The deadline is met if you send back the goods before the period of
          14 days has expired.
        </p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>We will bear the cost of returning the goods.</>
          ) : c.returnCosts === "customer" ? (
            <>You will have to bear the direct cost of returning the goods.</>
          ) : (
            <Missing field="returnCosts" label="who bears the return costs (owner's decision)" />
          )}
        </p>
        <p>
          You are only liable for any diminished value of the goods resulting from the handling
          other than what is necessary to establish the nature, characteristics and functioning of
          the goods.
        </p>

        <h3 id="ausschluss">Exclusion or early expiry of the right of withdrawal</h3>
        <p>There is no right of withdrawal for contracts</p>
        <ul>
          <li>
            for the supply of goods which are not prefabricated and for whose production an
            individual selection or determination by the consumer is decisive, or which are clearly
            tailored to the consumer's personal needs. With us this concerns all products marked as
            custom-made, for example the custom-made hair prosthesis.
          </li>
        </ul>
        <p>The right of withdrawal expires early for contracts</p>
        <ul>
          <li>
            for the supply of sealed goods which are not suitable for return for reasons of health
            protection or hygiene, if they were unsealed after delivery. This only concerns products
            that we deliver sealed and mark accordingly on the product page.
          </li>
        </ul>
      </section>

      <section>
        <h2 id="formular">2. {form.title}</h2>
        <ul>
          {form.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="online-widerruf">3. How to withdraw via our website</h2>
        <ol>
          <li>Click “Withdraw from contract”. The button is available on every page of our website during the withdrawal period.</li>
          <li>Enter your name, your order number or other details of the order and the email address to which we should send the acknowledgement of receipt. You can also withdraw from individual items of an order only.</li>
          <li>Check the details and click “Confirm withdrawal”.</li>
          <li>We will send you an acknowledgement of receipt by email without undue delay, containing your statement and the date and time of receipt.</li>
        </ol>
        <p>
          The acknowledgement only confirms that your statement has reached us. If an exception to
          the right of withdrawal applies to an item, we will inform you separately.
        </p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Notes on returns</h2>
        <p>
          Please send the goods to: {c.brandName}, {addressLine(c)}. You make our work easier if you
          return the goods well protected – if possible in the original packaging – and enclose the
          order number. This is not a condition for a valid withdrawal. You may carefully try on
          hairpieces as you would in a shop; please do not cut, dye, wash or glue them before the
          withdrawal period has expired, as this may cause a loss in value for which you are liable
          under the withdrawal information.
        </p>
      </section>
    </>
  );
}
