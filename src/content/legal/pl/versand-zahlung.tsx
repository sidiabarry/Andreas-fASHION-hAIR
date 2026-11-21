import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Brak danych: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "pl-PL");
  const carrier = c.carrier ?? <Missing field="carrier" label="przewoźnik" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Uwaga:</strong> Wiążąca prawnie jest wyłącznie wersja niemiecka; niniejsze
        tłumaczenie służy jedynie ułatwieniu zrozumienia.
      </p>
      <section>
        <h2 id="versandkosten">1. Koszty wysyłki</h2>
        <dl>
          <dt>Niemcy</dt>
          <dd>
            {eur(ship.domesticCents)} za zamówienie
            {ship.freeFromCents !== null ? <>; bezpłatnie od {eur(ship.freeFromCents)}</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Państwa Unii Europejskiej</dt>
              <dd>{eur(ship.euCents)} za zamówienie{others.length === 0 ? <> (dostawa po uzgodnieniu)</> : null}</dd>
            </>
          ) : null}
          <dt>Inne kraje</dt>
          <dd>na zapytanie – koszty podajemy przed zamówieniem</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>Jako mały przedsiębiorca w rozumieniu § 19 niemieckiej ustawy o VAT (UStG) nie naliczamy VAT, również od kosztów wysyłki.</>
          ) : c.smallBusiness === false ? (
            <>Wszystkie ceny i koszty wysyłki zawierają podatek VAT.</>
          ) : (
            <Missing field="smallBusiness" label="status VAT (mały przedsiębiorca tak/nie)" />
          )}{" "}
          Przy dostawach poza Unię Europejską mogą powstać cła, podatki importowe i opłaty, które
          uiszczają Państwo na rzecz właściwych organów.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Dostawa i terminy</h2>
        <ul>
          <li>
            Wysyłamy z {carrier}, w dyskretnym opakowaniu i z możliwością śledzenia. Kraje dostawy:
            Niemcy{others.length > 0 ? <>, {countryNames(others, "pl")}</> : null}; inne kraje po uzgodnieniu.
          </li>
          <li>Produkty z magazynu docierają na terenie Niemiec w ciągu {deliveryDaysOf(c)} dni roboczych – przy przedpłacie i PayPal od dnia następującego po otrzymaniu płatności, w pozostałych przypadkach od dnia następującego po zawarciu umowy. Czas dostawy za granicę podajemy przed zawarciem umowy.</li>
          <li>
            Produkty na wymiar dostarczamy na terenie Niemiec w ciągu {madeToOrderDaysOf(c)} dni roboczych, licząc od dnia następującego po otrzymaniu wszystkich danych oraz – przy przedpłacie lub PayPal – płatności.
          </li>
          <li>Ze względów bezpieczeństwa niektórych produktów do pielęgnacji, klejów i rozpuszczalników nie możemy wysyłać do wszystkich krajów. Informujemy o tym na stronie produktu.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Metody płatności</h2>
        <p>Po złożeniu zamówienia osobiście sprawdzamy dostępność i wysyłamy potwierdzenie zamówienia z danymi do płatności. Płacą Państwo dopiero po przyjęciu zamówienia.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="metoda płatności do ustalenia" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Przedpłata przelewem</strong> – w ciągu 7 dni od potwierdzenia zamówienia;
                wysyłka po otrzymaniu płatności.
                {c.bank ? (
                  <>
                    {" "}Właściciel rachunku: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. W tytule przelewu prosimy podać numer zamówienia.
                  </>
                ) : (
                  <> <Missing field="bank" label="dane bankowe" /></>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – po potwierdzeniu zamówienia otrzymują Państwo żądanie zapłaty przez PayPal
                {c.paypalEmail ? <> od {c.paypalEmail}</> : <> <Missing field="paypalEmail" label="konto PayPal" /></>}
                ; płatne w ciągu 7 dni. Wysyłka po otrzymaniu płatności.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Płatność w ratach przez PayPal</strong> – jeżeli PayPal ją zaoferuje; kredytodawcą jest PayPal, po ocenie zdolności kredytowej i na jego warunkach. Sami nie udzielamy kredytu.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Faktura</strong> – przelew w ciągu 14 dni od otrzymania towaru. W pojedynczych
                przypadkach możemy odmówić tej metody i zaproponować inną dostępną metodę.
                {c.bank ? null : <> <Missing field="bank" label="dane bankowe" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Nie pobieramy dodatkowych opłat za płatność.</p>
      </section>
    </>
  );
}
