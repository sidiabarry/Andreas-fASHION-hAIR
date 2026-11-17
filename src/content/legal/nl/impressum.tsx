import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Gegeven ontbreekt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Let op:</strong> Alleen de Duitse versie is juridisch bindend; deze vertaling dient
        uitsluitend ter verduidelijking.
      </p>
      <section>
        <h2 id="anbieter">1. Aanbieder</h2>
        <p>Gegevens volgens artikel 5 van de Duitse wet op digitale diensten (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="volledige naam van de eigenaar" />}
          <br />
          Handelsnaam: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="rechtsvorm" />}
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
          <dt>Telefoon</dt>
          <dd>{c.phone}</dd>
          <dt>E-mail</dt>
          <dd>{c.email}</dd>
          <dt>Bereikbaarheid</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. Btw en registratie</h2>
        {c.vatId ? (
          <p>Btw-identificatienummer volgens artikel 27a van de Duitse btw-wet: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>De eigenaar valt onder de kleineondernemersregeling van artikel 19 van de Duitse btw-wet (UStG). Er wordt geen btw berekend.</p>
        ) : (
          <p>
            Btw-nummer: <Missing field="vatId" label="btw-nummer (indien toegekend) of kleineondernemersstatus" />
          </p>
        )}
        {c.tradeRegister ? <p>Inschrijving: {c.tradeRegister}</p> : <p>De onderneming is niet ingeschreven in het handelsregister.</p>}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Geschillenbeslechting voor consumenten</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Wij zijn bereid deel te nemen aan geschillenbeslechting voor een geschilleninstantie voor consumenten. De bevoegde instantie is:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Wij verklaren hierbij deel te nemen aan geschillenbeslechting voor deze instantie.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Wij zijn niet bereid en niet verplicht deel te nemen aan geschillenbeslechting voor een geschilleninstantie voor consumenten. Hebt u een vraag of probleem, schrijf ons dan rechtstreeks – samen vinden we een oplossing.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="besluit over consumentengeschillenbeslechting (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. Over deze website</h2>
        <p>Wij stellen de inhoud van deze website zorgvuldig samen. Gelinkte pagina's van andere aanbieders vallen onder hun verantwoordelijkheid. Foto's en teksten op deze website zijn auteursrechtelijk beschermd; vraag het ons voordat u ze gebruikt.</p>
      </section>
    </>
  );
}
