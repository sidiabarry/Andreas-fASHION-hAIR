import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato mancante: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "it-IT");
  const carrier = c.carrier ?? <Missing field="carrier" label="corriere" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Nota:</strong> Fa fede esclusivamente la versione tedesca; la presente traduzione
        serve solo a facilitarne la comprensione.
      </p>
      <section>
        <h2 id="versandkosten">1. Spese di spedizione</h2>
        <dl>
          <dt>Germania</dt>
          <dd>
            {eur(ship.domesticCents)} per ordine
            {ship.freeFromCents !== null ? <>; gratuite da {eur(ship.freeFromCents)}</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Paesi dell'Unione europea</dt>
              <dd>{eur(ship.euCents)} per ordine{others.length === 0 ? <> (consegna previo accordo)</> : null}</dd>
            </>
          ) : null}
          <dt>Altri paesi</dt>
          <dd>su richiesta – Le comunichiamo le spese prima dell'ordine</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>In qualità di piccola impresa ai sensi dell'articolo 19 della legge tedesca sull'IVA (UStG) non addebitiamo l'IVA, nemmeno sulle spese di spedizione.</>
          ) : c.smallBusiness === false ? (
            <>Tutti i prezzi e le spese di spedizione sono comprensivi di IVA.</>
          ) : (
            <Missing field="smallBusiness" label="regime IVA (piccola impresa sì/no)" />
          )}{" "}
          Per consegne fuori dall'Unione europea possono essere dovuti dazi, imposte all'importazione
          e diritti, che Lei paga alle autorità competenti.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Consegna e tempi</h2>
        <ul>
          <li>
            Spediamo con {carrier}, in un imballaggio discreto e con tracciamento. Paesi di consegna:
            Germania{others.length > 0 ? <>, {countryNames(others, "it")}</> : null}; altri paesi previo accordo.
          </li>
          <li>I pezzi disponibili arrivano in Germania in {deliveryDaysOf(c)} giorni lavorativi – con pagamento anticipato e PayPal dal giorno successivo al ricevimento del pagamento, altrimenti dal giorno successivo alla conclusione del contratto. I tempi per l'estero Le vengono comunicati prima della conclusione del contratto.</li>
          <li>
            I pezzi su misura Le vengono consegnati in Germania entro {madeToOrderDaysOf(c)} giorni lavorativi, a partire dal giorno successivo al ricevimento di tutti i dati e – con pagamento anticipato o PayPal – del pagamento.
          </li>
          <li>Per motivi di sicurezza non possiamo spedire alcuni prodotti per la cura, adesivi e solventi in tutti i paesi. Lo indichiamo nella pagina del prodotto.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Metodi di pagamento</h2>
        <p>Dopo l'ordine verifichiamo personalmente la disponibilità e Le inviamo una conferma d'ordine con i dati di pagamento. Paga solo dopo che abbiamo accettato il Suo ordine.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="metodo di pagamento da definire" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Pagamento anticipato con bonifico</strong> – entro 7 giorni dalla conferma
                d'ordine; spedizione dopo il ricevimento del pagamento.
                {c.bank ? (
                  <>
                    {" "}Intestataria del conto: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Indichi il numero d'ordine come causale.
                  </>
                ) : (
                  <>{" "}Riceverà le coordinate bancarie con la conferma dell'ordine.</>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – dopo la conferma d'ordine riceve una richiesta di pagamento
                tramite PayPal
                {c.paypalEmail ? <> da {c.paypalEmail}</> : null}
                ; da pagare entro 7 giorni. Spedizione dopo il ricevimento del pagamento.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Pagamento rateale tramite PayPal</strong> – se PayPal Glielo offre; il finanziatore è PayPal, secondo la sua verifica del merito creditizio e le sue condizioni. Noi non concediamo credito.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Fattura</strong> – bonifico entro 14 giorni dal ricevimento della merce.
                Possiamo rifiutare questo metodo in singoli casi e proporLe un altro metodo disponibile.
                {c.bank ? null : <> <Missing field="bank" label="coordinate bancarie" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Non addebitiamo costi aggiuntivi per il pagamento.</p>
      </section>
    </>
  );
}
