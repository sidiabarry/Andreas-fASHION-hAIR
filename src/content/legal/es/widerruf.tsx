import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato pendiente: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>nuestro sitio web, mediante el botón «Desistir del contrato» al pie de cada página</>;
  return (
    <>
      <p>
        <strong>Aviso:</strong> La versión alemana es la jurídicamente vinculante; esta traducción
        sirve únicamente para facilitar su comprensión.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Información sobre el derecho de desistimiento</h2>
        <h3 id="widerrufsrecht">Derecho de desistimiento</h3>
        <p>Tiene usted derecho a desistir del presente contrato en un plazo de 14 días naturales sin necesidad de justificación.</p>
        <p>El plazo de desistimiento expirará a los 14 días naturales del día en que usted o un tercero por usted indicado, distinto del transportista, adquirió la posesión material de los bienes. Si ha pedido varios bienes en un mismo pedido y se entregan por separado, el plazo expirará a los 14 días naturales del día en que usted o un tercero por usted indicado, distinto del transportista, adquirió la posesión material del último de esos bienes.</p>
        <p>
          Para ejercer el derecho de desistimiento, deberá usted notificarnos (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nombre completo de la titular" />}, {c.brandName},{" "}
          {addressLine(c)}, teléfono {c.phone}, correo electrónico {c.withdrawalEmail}) su decisión
          de desistir del contrato a través de una declaración inequívoca (por ejemplo, una carta
          enviada por correo postal o un correo electrónico). Podrá utilizar el modelo de formulario
          de desistimiento que figura a continuación, aunque su uso no es obligatorio.
        </p>
        <p>También puede ejercer su derecho de desistimiento en línea en {where}. Si utiliza esta función en línea, le enviaremos sin demora, en un soporte duradero (por ejemplo, por correo electrónico), un acuse de recibo con información sobre el contenido de la declaración de desistimiento y la fecha y hora de su recepción.</p>
        <p>Para cumplir el plazo de desistimiento, basta con que la comunicación relativa al ejercicio por su parte de este derecho sea enviada antes de que venza el plazo correspondiente.</p>

        <h3 id="folgen">Consecuencias del desistimiento</h3>
        <p>En caso de desistimiento por su parte, le devolveremos todos los pagos recibidos de usted, incluidos los gastos de entrega (con la excepción de los gastos adicionales resultantes de la elección por su parte de una modalidad de entrega diferente a la modalidad menos costosa de entrega ordinaria que ofrezcamos) sin ninguna demora indebida y, en todo caso, a más tardar 14 días naturales a partir de la fecha en la que se nos informe de su decisión de desistir del presente contrato. Procederemos a efectuar dicho reembolso utilizando el mismo medio de pago empleado por usted para la transacción inicial, a no ser que haya usted dispuesto expresamente lo contrario; en todo caso, no incurrirá en ningún gasto como consecuencia del reembolso. Podremos retener el reembolso hasta haber recibido los bienes, o hasta que usted haya presentado una prueba de la devolución de los mismos, según qué condición se cumpla primero.</p>
        <p>Deberá usted devolvernos o entregarnos directamente los bienes sin ninguna demora indebida y, en cualquier caso, a más tardar en el plazo de 14 días naturales a partir de la fecha en que nos comunique su decisión de desistimiento del contrato. Se considerará cumplido el plazo si efectúa la devolución de los bienes antes de que haya concluido dicho plazo.</p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Nos haremos cargo de los costes de devolución de los bienes.</>
          ) : c.returnCosts === "customer" ? (
            <>Deberá usted asumir el coste directo de devolución de los bienes.</>
          ) : (
            <Missing field="returnCosts" label="quién asume los gastos de devolución (decisión de la titular)" />
          )}
        </p>
        <p>Solo será usted responsable de la disminución de valor de los bienes resultante de una manipulación distinta a la necesaria para establecer la naturaleza, las características y el funcionamiento de los bienes.</p>

        <h3 id="ausschluss">Exclusión o extinción anticipada del derecho de desistimiento</h3>
        <p>No existe derecho de desistimiento en los contratos</p>
        <ul>
          <li>de suministro de bienes no prefabricados para cuya elaboración sea determinante una selección o especificación individual del consumidor, o que estén claramente personalizados según sus necesidades. En nuestro caso, se trata de todos los productos marcados como fabricación a medida, por ejemplo la prótesis capilar a medida. Lo mismo se aplica a las extensiones que teñimos, cortamos o fabricamos según sus indicaciones.</li>
        </ul>
        <p>El derecho de desistimiento se extingue anticipadamente en los contratos</p>
        <ul>
          <li>de suministro de bienes precintados que no sean aptos para ser devueltos por razones de protección de la salud o de higiene y que hayan sido desprecintados tras la entrega. Esto solo afecta a los productos que entregamos precintados y que así se indica en la página del producto.</li>
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
        <h2 id="online-widerruf">3. Cómo desistir a través de nuestro sitio</h2>
        <ol>
          <li>Haga clic en «Desistir del contrato». El botón está disponible en todas las páginas de nuestro sitio durante el plazo de desistimiento.</li>
          <li>Indique su nombre, su número de pedido u otros datos del pedido y la dirección de correo electrónico a la que debemos enviar el acuse de recibo. También puede desistir solo de algunos artículos del pedido.</li>
          <li>Compruebe los datos y haga clic en «Confirmar desistimiento».</li>
          <li>Le enviaremos sin demora por correo electrónico un acuse de recibo con el contenido de su declaración y la fecha y hora de recepción.</li>
        </ol>
        <p>El acuse de recibo solo confirma que su declaración nos ha llegado. Si a algún artículo se le aplica una excepción al derecho de desistimiento, se lo comunicaremos por separado.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Indicaciones para la devolución</h2>
        <p>Envíe la mercancía a: {c.brandName}, {addressLine(c)}. Nos facilita el trabajo si la devuelve bien protegida –a ser posible en su embalaje original– e incluye el número de pedido. No es un requisito para que el desistimiento sea válido. Puede probarse con cuidado las piezas capilares como en una tienda; no las corte, tiña, lave ni pegue antes de que finalice el plazo de desistimiento, ya que podría producirse una pérdida de valor de la que sería responsable según la información sobre el desistimiento.</p>
      </section>
    </>
  );
}
