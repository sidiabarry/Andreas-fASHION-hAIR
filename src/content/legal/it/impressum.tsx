import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato mancante: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Nota:</strong> Fa fede esclusivamente la versione tedesca; la presente traduzione
        serve solo a facilitarne la comprensione.
      </p>
      <section>
        <h2 id="anbieter">1. Titolare del sito</h2>
        <p>Informazioni ai sensi dell'articolo 5 della legge tedesca sui servizi digitali (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo della titolare" />}
          <br />
          Denominazione commerciale: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="forma giuridica" />}
          <br />
          {c.street}
          <br />
          {c.zip} {c.city}
          <br />
          {c.country}
        </p>
      </section>

      <section>
        <h2 id="kontakt">2. Contatti</h2>
        <dl>
          <dt>Telefono</dt>
          <dd>{c.phone}</dd>
          <dt>E-mail</dt>
          <dd>{c.email}</dd>
          <dt>Orari</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. IVA e registro</h2>
        {c.vatId ? (
          <p>Partita IVA ai sensi dell'articolo 27a della legge tedesca sull'IVA: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>La titolare applica il regime dei piccoli imprenditori ai sensi dell'articolo 19 della legge tedesca sull'IVA (UStG). Non viene addebitata IVA.</p>
        ) : (
          <p>
            Partita IVA: <Missing field="vatId" label="partita IVA (se assegnata) o regime di piccola impresa" />
          </p>
        )}
        {c.tradeRegister ? <p>Iscrizione: {c.tradeRegister}</p> : <p>L'impresa non è iscritta nel registro delle imprese.</p>}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Risoluzione delle controversie dei consumatori</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Siamo disposti a partecipare a procedure di risoluzione delle controversie dinanzi a un organismo di conciliazione per i consumatori. L'organismo competente è:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Dichiariamo di partecipare alle procedure di risoluzione delle controversie dinanzi a tale organismo.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Non siamo disposti né obbligati a partecipare a procedure di risoluzione delle controversie dinanzi a un organismo di conciliazione per i consumatori. Per domande o problemi scriveteci direttamente: troveremo insieme una soluzione.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decisione sulla conciliazione dei consumatori (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. Informazioni su questo sito</h2>
        <p>Redigiamo i contenuti di questo sito con cura. Le pagine di altri fornitori a cui rimandiamo sono di loro responsabilità. Foto e testi di questo sito sono protetti dal diritto d'autore; chiedeteci prima di utilizzarli.</p>
      </section>
    </>
  );
}
