import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Missing: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Please note:</strong> The German version is legally binding; this translation is
        provided for your understanding.
      </p>
      <section>
        <h2 id="anbieter">1. Provider</h2>
        <p>Information pursuant to Section 5 of the German Digital Services Act (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="owner's full name" />}
          <br />
          Trading name: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="legal form" />}
          <br />
          {c.street}
          <br />
          {c.zip} {c.city}
          <br />
          {c.country}
        </p>
      </section>

      <section>
        <h2 id="kontakt">2. Contact</h2>
        <dl>
          <dt>Phone</dt>
          <dd>{c.phone}</dd>
          <dt>Email</dt>
          <dd>{c.email}</dd>
          <dt>Availability</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. VAT and registration</h2>
        {c.vatId ? (
          <p>VAT identification number pursuant to Section 27a of the German VAT Act: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>
            The owner is a small business within the meaning of Section 19 of the German VAT Act
            (UStG). No VAT is charged.
          </p>
        ) : (
          <p>
            VAT identification number: <Missing field="vatId" label="VAT ID (if issued) or small-business status" />
          </p>
        )}
        {c.tradeRegister ? (
          <p>Register entry: {c.tradeRegister}</p>
        ) : (
          <p>The business is not entered in the commercial register.</p>
        )}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Consumer dispute resolution</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>We are willing to take part in dispute resolution proceedings before a consumer arbitration board. The competent board is:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>We hereby declare that we will take part in dispute resolution proceedings before this board.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>
            We are neither willing nor obliged to take part in dispute resolution proceedings before a
            consumer arbitration board. If you have a question or a problem, please write to us
            directly – we will find a solution together.
          </p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decision on consumer dispute resolution (Section 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. About this website</h2>
        <p>
          We prepare the content of this website with care. Linked pages of other providers are
          their responsibility. Photos and texts on this website are protected by copyright; please
          ask us before using them.
        </p>
      </section>
    </>
  );
}
