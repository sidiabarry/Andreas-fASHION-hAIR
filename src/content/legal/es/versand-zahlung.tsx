import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato pendiente: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "es-ES");
  const carrier = c.carrier ?? <Missing field="carrier" label="empresa de transporte" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Aviso:</strong> La versión alemana es la jurídicamente vinculante; esta traducción
        sirve únicamente para facilitar su comprensión.
      </p>
      <section>
        <h2 id="versandkosten">1. Gastos de envío</h2>
        <dl>
          <dt>Alemania</dt>
          <dd>
            {eur(ship.domesticCents)} por pedido
            {ship.freeFromCents !== null ? <>; gratis a partir de {eur(ship.freeFromCents)}</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Países de la Unión Europea</dt>
              <dd>{eur(ship.euCents)} por pedido{others.length === 0 ? <> (envío previo acuerdo)</> : null}</dd>
            </>
          ) : null}
          <dt>Otros países</dt>
          <dd>a petición: le indicamos los gastos antes del pedido</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>Como pequeña empresa según el artículo 19 de la Ley alemana del IVA (UStG), no facturamos IVA, tampoco sobre los gastos de envío.</>
          ) : c.smallBusiness === false ? (
            <>Todos los precios y gastos de envío incluyen el IVA legal.</>
          ) : (
            <Missing field="smallBusiness" label="régimen de IVA (pequeña empresa sí/no)" />
          )}{" "}
          En envíos fuera de la Unión Europea pueden devengarse aranceles, impuestos de importación y
          tasas, que usted abonará a las autoridades competentes.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Entrega y plazos</h2>
        <ul>
          <li>
            Enviamos con {carrier}, en un embalaje discreto y con seguimiento. Países de entrega:
            Alemania{others.length > 0 ? <>, {countryNames(others, "es")}</> : null}; otros países previo acuerdo.
          </li>
          <li>Las piezas en stock le llegan dentro de Alemania en {deliveryDaysOf(c)} días –con pago anticipado y PayPal, a partir del día siguiente a la recepción del pago; en los demás casos, a partir del día siguiente a la celebración del contrato–. El plazo al extranjero se lo indicamos antes de la celebración del contrato.</li>
          <li>Fabricamos las piezas a medida en unos {madeToOrderDaysOf(c)} días, una vez recibidos todos los datos y –con pago anticipado o PayPal– el pago.</li>
          <li>Por motivos de seguridad, no podemos enviar algunos productos de cuidado, adhesivos y disolventes a todos los países. Lo indicamos en la página del producto.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Formas de pago</h2>
        <p>Tras su pedido comprobamos personalmente la disponibilidad y le enviamos una confirmación del pedido con los datos de pago. Solo paga después de que hayamos aceptado su pedido.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="forma de pago pendiente de definir" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Pago anticipado por transferencia</strong> – en un plazo de 7 días desde la
                confirmación del pedido; envío tras recibir el pago.
                {c.bank ? (
                  <>
                    {" "}Titular de la cuenta: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Indique su número de pedido como concepto.
                  </>
                ) : (
                  <> <Missing field="bank" label="datos bancarios" /></>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – tras la confirmación del pedido recibe una solicitud de pago
                por PayPal
                {c.paypalEmail ? <> de {c.paypalEmail}</> : <> <Missing field="paypalEmail" label="cuenta de PayPal" /></>}
                ; pagadera en 7 días. Envío tras recibir el pago.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Pago a plazos con PayPal</strong> – si PayPal se lo ofrece; el prestamista es PayPal, según su comprobación de solvencia y sus condiciones. Nosotros no concedemos crédito.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Factura</strong> – transferencia en un plazo de 14 días desde la recepción de
                la mercancía. Podemos rechazar esta forma de pago en casos concretos y ofrecerle otra
                forma de pago disponible.
                {c.bank ? null : <> <Missing field="bank" label="datos bancarios" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>No cobramos comisiones adicionales por el pago.</p>
      </section>
    </>
  );
}
