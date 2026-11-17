import { type Company, UNIVERSAL_ADR } from "./company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Angabe fehlt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <section>
        <h2 id="anbieter">1. Anbieterin</h2>
        <p>Angaben nach § 5 Digitale-Dienste-Gesetz (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="vollständiger Vor- und Nachname der Inhaberin" />}
          <br />
          Geschäftsbezeichnung: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="Rechtsform, z. B. Einzelunternehmen" />}
          <br />
          {c.street}
          <br />
          {c.zip} {c.city}
          <br />
          {c.country}
        </p>
      </section>

      <section>
        <h2 id="kontakt">2. Kontakt</h2>
        <dl>
          <dt>Telefon</dt>
          <dd>{c.phone}</dd>
          <dt>E-Mail</dt>
          <dd>{c.email}</dd>
          <dt>Erreichbarkeit</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. Umsatzsteuer und Register</h2>
        {c.vatId ? (
          <p>Umsatzsteuer-Identifikationsnummer nach § 27a Umsatzsteuergesetz: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>
            Die Inhaberin ist Kleinunternehmerin im Sinne von § 19 Umsatzsteuergesetz. Es wird
            keine Umsatzsteuer berechnet.
          </p>
        ) : (
          <p>
            Umsatzsteuer-Identifikationsnummer:{" "}
            <Missing field="vatId" label="USt-IdNr. nach § 27a UStG (nur falls erteilt) oder Kleinunternehmer-Status" />
          </p>
        )}
        {c.tradeRegister ? (
          <p>Registereintrag: {c.tradeRegister}</p>
        ) : (
          <p>Das Unternehmen ist nicht im Handelsregister eingetragen.</p>
        )}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Verbraucherstreitbeilegung</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>
              Wir sind bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen. Zuständig ist die:
            </p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>
              Wir erklären hiermit, an Streitbeilegungsverfahren vor dieser Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen. Bei Fragen oder Problemen schreiben Sie uns
            bitte direkt – wir finden gemeinsam eine Lösung.
          </p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="Entscheidung zur Teilnahme an Verbraucherschlichtung (§ 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. Hinweise zu dieser Website</h2>
        <p>
          Die Inhalte dieser Website erstellen wir mit Sorgfalt. Verlinkte Seiten anderer Anbieter
          liegen in deren Verantwortung. Fotos und Texte dieser Website sind urheberrechtlich
          geschützt; bitte fragen Sie uns, bevor Sie sie verwenden.
        </p>
      </section>
    </>
  );
}
