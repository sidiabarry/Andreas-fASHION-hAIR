import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Brak danych: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Uwaga:</strong> Wiążąca prawnie jest wyłącznie wersja niemiecka; niniejsze
        tłumaczenie służy jedynie ułatwieniu zrozumienia.
      </p>
      <section>
        <h2 id="anbieter">1. Usługodawca</h2>
        <p>Informacje zgodnie z § 5 niemieckiej ustawy o usługach cyfrowych (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="imię i nazwisko właścicielki" />}
          <br />
          Nazwa handlowa: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="forma prawna" />}
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
          <dt>E-mail</dt>
          <dd>{c.email}</dd>
          <dt>Dostępność</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. VAT i rejestr</h2>
        {c.vatId ? (
          <p>Numer identyfikacyjny VAT zgodnie z § 27a niemieckiej ustawy o VAT: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>Właścicielka korzysta ze zwolnienia dla małych przedsiębiorców na podstawie § 19 niemieckiej ustawy o VAT (UStG). Podatek VAT nie jest naliczany.</p>
        ) : (
          <p>
            Numer VAT: <Missing field="vatId" label="numer VAT (jeśli nadany) lub status małego przedsiębiorcy" />
          </p>
        )}
        {c.tradeRegister ? <p>Wpis do rejestru: {c.tradeRegister}</p> : <p>Przedsiębiorstwo nie jest wpisane do rejestru handlowego.</p>}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Pozasądowe rozwiązywanie sporów konsumenckich</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Jesteśmy gotowi uczestniczyć w postępowaniach w sprawie rozwiązywania sporów przed podmiotem ds. pozasądowego rozwiązywania sporów konsumenckich. Właściwym podmiotem jest:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Niniejszym oświadczamy, że będziemy uczestniczyć w postępowaniach przed tym podmiotem.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Nie jesteśmy gotowi ani zobowiązani do udziału w postępowaniach w sprawie rozwiązywania sporów przed podmiotem ds. pozasądowego rozwiązywania sporów konsumenckich. W razie pytań lub problemów prosimy o bezpośredni kontakt – wspólnie znajdziemy rozwiązanie.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decyzja w sprawie pozasądowego rozwiązywania sporów (§ 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. O tej stronie</h2>
        <p>Treści tej strony przygotowujemy starannie. Za strony innych dostawców, do których prowadzą linki, odpowiadają ich dostawcy. Zdjęcia i teksty na tej stronie są chronione prawem autorskim; prosimy o kontakt przed ich wykorzystaniem.</p>
      </section>
    </>
  );
}
