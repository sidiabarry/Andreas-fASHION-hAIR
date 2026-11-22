import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

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
        <h2 id="geltung">§ 1 Ámbito de aplicación y vendedora</h2>
        <ol>
          <li>Las presentes condiciones generales (CG) se aplican a todos los pedidos realizados por consumidores (artículo 13 BGB) en nuestra tienda en línea.</li>
          <li>
            Su parte contratante es{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="nombre completo de la titular" />} (nombre comercial «{c.brandName}»),{" "}
            {addressLine(c)}, teléfono {c.phone}, correo electrónico {c.email}.
          </li>
          <li>El idioma del contrato es el alemán. Las traducciones sirven únicamente para su comprensión.</li>
        <li>Estas CG solo se aplican a consumidores. Los salones, peluqueros y otros empresarios reciben, previa solicitud, una oferta individual en condiciones específicas.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Celebración del contrato</h2>
        <ol>
          <li>La presentación de los productos en la tienda no constituye una oferta vinculante, sino una invitación a realizar un pedido. Muchas piezas son únicas.</li>
          <li>Usted añade productos a la cesta, introduce en el siguiente paso sus datos de contacto y de entrega y ve después un resumen con todos los datos y el precio total. Puede corregir errores de introducción en cualquier momento antes del envío: con el botón «atrás» del navegador, mediante «Modificar» en la cesta o directamente en los campos. Al hacer clic en el botón «Pedido con obligación de pago» realiza una oferta vinculante de compra de los artículos de la cesta.</li>
          <li>Inmediatamente después recibe un correo automático que confirma la recepción de su pedido. Este acuse de recibo no constituye todavía la aceptación de su oferta.</li>
          <li>Comprobamos personalmente si la pieza está disponible. El contrato se celebra cuando aceptamos expresamente su pedido por correo electrónico (confirmación del pedido) o le enviamos la mercancía, lo que ocurra primero. Decidimos en un plazo de tres días hábiles desde la recepción del pedido. Si en ese plazo no recibe la aceptación, deja de estar vinculado/a por su pedido; le reembolsaremos sin demora los pagos ya realizados.</li>
          <li>Si una pieza única ya no está disponible, le informaremos sin demora. En ese caso no se celebra contrato sobre dicha pieza.</li>
          <li>Con la confirmación del pedido recibe por correo electrónico el texto del contrato, estas CG, la información sobre el desistimiento y el modelo de formulario de desistimiento.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Conservación del texto del contrato</h2>
        <p>Guardamos el texto del contrato (sus datos de pedido y las CG vigentes en el momento del pedido) y se lo enviamos por correo electrónico. Puede consultar, guardar e imprimir las CG vigentes en esta página en cualquier momento. No ofrecemos una cuenta de cliente en la que consultar pedidos anteriores.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Precios y gastos de envío</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Todos los precios son precios finales. Como pequeña empresa en el sentido del artículo 19 de la Ley alemana del IVA (UStG), no facturamos IVA y, por tanto, no lo desglosamos.</>
            ) : c.smallBusiness === false ? (
              <>Todos los precios son precios finales e incluyen el IVA legal.</>
            ) : (
              <Missing field="smallBusiness" label="régimen de IVA (pequeña empresa sí/no)" />
            )}
          </li>
          <li>
            Se añaden gastos de envío: dentro de Alemania {eur(ship.domesticCents)} por pedido
            {ship.freeFromCents !== null ? <>, gratuitos a partir de un valor de {eur(ship.freeFromCents)}</> : null}
            {ship.euCents !== null ? <>; a otros países de la Unión Europea {eur(ship.euCents)} por pedido</> : null}
            . Para otros países le indicamos los gastos a petición antes del pedido. Verá los gastos
            de envío en el resumen antes de enviar el pedido.
          </li>
          <li>En envíos fuera de la Unión Europea pueden devengarse aranceles, impuestos y tasas, que usted abonará a las autoridades competentes.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Pago</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="forma de pago pendiente de definir" />
          </p>
        ) : (
          <>
            <p>Puede pagar con las siguientes formas de pago. Encontrará los datos de pago en la página de confirmación justo después de su pedido; también se los enviamos con la confirmación del pedido.</p>
            <ul>
              {c.payments.prepayment ? (
                <li><strong>Pago anticipado por transferencia:</strong> puede transferir el importe total justo después de su pedido, a más tardar en un plazo de 7 días desde la recepción de la confirmación del pedido. Enviamos la mercancía tras recibir el pago. Si el pago no se recibe pese a un recordatorio, podemos resolver el contrato.</li>
              ) : null}
              {c.payments.paypal ? (
                <li><strong>PayPal:</strong> puede pagar justo después del pedido con el botón de PayPal en la página de confirmación, o recibe una solicitud de pago de PayPal tras la confirmación del pedido. Pague a más tardar 7 días después de la confirmación del pedido. Se aplican además las condiciones de PayPal. Enviamos tras recibir el pago.</li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>Pago a plazos con PayPal:</strong> si PayPal le ofrece esta opción, puede pagar a plazos tras una comprobación de solvencia de PayPal. El crédito lo celebra directamente con PayPal como prestamista; se aplican sus condiciones e información precontractual. Nosotros no concedemos crédito. Su contrato de compraventa con nosotros no se ve afectado.</li> : null}
              {c.payments.bankTransfer ? (
                <li><strong>Factura (transferencia tras la recepción):</strong> el importe debe transferirse sin descuento en un plazo de 14 días desde la recepción de la mercancía. Podemos rechazar esta forma de pago en casos concretos, en particular para importes elevados o envíos al extranjero, y ofrecerle otra forma de pago disponible.</li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Entrega</h2>
        <ol>
          <li>
            Entregamos dentro de Alemania
            {others.length > 0 ? <> y en los siguientes países: {countryNames(others, "es")}</> : null}. Los
            envíos a otros países son posibles previo acuerdo. El envío lo realiza {carrier}.
          </li>
          <li>Plazo de entrega de los artículos en stock dentro de Alemania: {deliveryDaysOf(c)} días hábiles. Con pago anticipado o PayPal, el plazo comienza el día siguiente a la recepción del pago; en los demás casos, el día siguiente a la celebración del contrato. El plazo para envíos al extranjero se lo comunicamos antes de la celebración del contrato.</li>
          <li>
            Las piezas a medida le llegan dentro de Alemania en {madeToOrderDaysOf(c)} días hábiles. El plazo empieza el día siguiente a aquel en que disponemos de todos los datos necesarios y –en caso de pago anticipado o PayPal– del pago. El plazo de entrega para envíos al extranjero se lo comunicamos antes de la celebración del contrato.
          </li>
          <li>Si la mercancía llega con daños de transporte visibles, reclame al repartidor e infórmenos brevemente. Sus derechos legales no se ven afectados; su aviso nos ayuda a reclamar a la empresa de transporte.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Reserva de dominio</h2>
        <p>La mercancía sigue siendo de nuestra propiedad hasta su pago completo.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Fabricación a medida y según sus especificaciones</h2>
        <ol>
          <li>En los productos marcados como fabricación a medida, fabricamos según sus indicaciones, por ejemplo contorno de cabeza, color, densidad, dirección del cabello y base. Compruebe sus datos cuidadosamente; los comentamos con usted antes de empezar.</li>
          <li>Las piezas fabricadas a medida no tienen derecho de desistimiento (artículo 312g, apartado 2, número 1, BGB). Los detalles figuran en la información sobre el desistimiento. Sus derechos en caso de defectos no se ven afectados.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Derecho de desistimiento</h2>
        <p>Como consumidor/a dispone de un derecho legal de desistimiento. Las condiciones, plazos y procedimiento, las excepciones y la función en línea «Desistir del contrato» se describen en nuestra información sobre el desistimiento.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Garantía legal (responsabilidad por defectos)</h2>
        <ol>
          <li>Se aplican los derechos legales en caso de defectos (artículos 434 y siguientes BGB). El plazo para reclamaciones por defectos es de dos años desde la entrega de la mercancía.</li>
          <li>En caso de defecto, contáctenos: {c.email}, teléfono {c.phone}, o por correo postal: {addressLine(c)}.</li>
          <li>Solo concedemos una garantía comercial adicional si la indicamos expresamente para un producto.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Responsabilidad</h2>
        <ol>
          <li>Respondemos sin limitación en caso de dolo y negligencia grave, de daños a la vida, la integridad física o la salud, conforme a la Ley alemana de responsabilidad por productos defectuosos y en la medida de una garantía otorgada.</li>
          <li>En caso de infracción por negligencia leve de una obligación cuyo cumplimiento es imprescindible para la correcta ejecución del contrato y en cuyo cumplimiento usted puede confiar habitualmente (obligación contractual esencial), nuestra responsabilidad se limita al daño previsible y típico del contrato.</li>
          <li>En lo demás, queda excluida la responsabilidad por negligencia leve.</li>
          <li>Sus derechos en caso de defectos conforme al § 10 no se ven afectados por estas disposiciones.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Productos de cuidado, adhesivos y disolventes</h2>
        <p>Antes de utilizar adhesivos, cintas y disolventes, lea y siga las instrucciones de uso y advertencias del fabricante que figuran en el envase y en la página del producto. Le recomendamos probar primero un producto nuevo en una pequeña zona de la piel. Mantenga estos productos fuera del alcance de los niños. Pueden existir restricciones de envío para algunos productos; lo indicamos en la página del producto.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Resolución de litigios de consumo</h2>
        {c.disputeResolution === "willing" ? (
          <p>Estamos dispuestos a participar en procedimientos de resolución de litigios ante la siguiente entidad: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>No estamos dispuestos ni obligados a participar en procedimientos de resolución de litigios ante una entidad de resolución alternativa de consumo.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decisión sobre la resolución alternativa de litigios (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Ley aplicable</h2>
        <p>Se aplica el Derecho de la República Federal de Alemania, con exclusión de la Convención de las Naciones Unidas sobre los contratos de compraventa internacional de mercaderías. Si su residencia habitual se encuentra en otro Estado, conserva la protección de las disposiciones imperativas de protección de los consumidores de ese Estado (artículo 6, apartado 2, del Reglamento Roma I).</p>
        <p>
          Última actualización: {c.effectiveDate ?? <Missing field="effectiveDate" label="fecha de entrada en vigor de las CG" />}
        </p>
      </section>
    </>
  );
}
