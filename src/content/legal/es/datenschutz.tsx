import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato pendiente: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="empresa de transporte" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Aviso:</strong> La versión alemana es la jurídicamente vinculante; esta traducción
        sirve únicamente para facilitar su comprensión.
      </p>
      <section>
        <h2 id="ueberblick">1. Lo más importante</h2>
        <ul>
          <li>Este sitio no utiliza cookies, herramientas de análisis ni rastreadores publicitarios.</li>
          <li>Las fuentes y los vídeos se alojan en nuestro propio servidor. Al visitar el sitio no se transmiten datos a Google, YouTube, Meta ni proveedores similares.</li>
          <li>Tratamos sus datos únicamente para gestionar su pedido o consulta, cumplir obligaciones legales y –solo con su consentimiento– enviarle nuestro boletín.</li>
          <li>Le rogamos que no nos facilite datos de salud (véase el apartado 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Responsable del tratamiento</h2>
        <p>La responsable del tratamiento en el sentido del Reglamento General de Protección de Datos (RGPD) es:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nombre completo de la titular" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Teléfono: {c.phone}
          <br />
          Correo electrónico: {c.email}
        </p>
        <p>No estamos legalmente obligados a designar un delegado de protección de datos. Para cualquier consulta, puede contactarnos en los datos indicados.</p>
      </section>

      <section>
        <h2 id="hosting">3. Alojamiento y archivos de registro</h2>
        <p>
          Nuestro sitio está alojado por {c.hostingProvider.name}, {c.hostingProvider.address}. En
          cada visita, el servidor trata los datos técnicamente necesarios que su navegador transmite
          automáticamente: dirección IP, fecha y hora, página solicitada, volumen de datos
          transferido, código de estado, URL de referencia y datos del navegador y del sistema
          operativo.
        </p>
        <p>
          Necesitamos estos datos para mostrar el sitio, garantizar su seguridad y repeler ataques.
          La base jurídica es el artículo 6, apartado 1, letra f), del RGPD; nuestro interés legítimo
          es un sitio seguro y operativo. No analizamos los registros con fines estadísticos ni de
          marketing ni los combinamos con otros datos. El proveedor solo conserva los registros
          durante un breve periodo técnicamente necesario y después los borra automáticamente.
        </p>
        <p>Hemos celebrado con el proveedor un contrato de encargo del tratamiento conforme al artículo 28 del RGPD. Sobre las transferencias a EE. UU., véase el apartado 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Almacenamiento en su navegador (sin cookies ni seguimiento)</h2>
        <p>
          Para conservar su cesta mientras navega, guardamos los artículos seleccionados en el
          almacenamiento local de su navegador (localStorage). Esta información permanece en su
          dispositivo y solo se nos transmite cuando envía un pedido. Puede borrarla en cualquier
          momento vaciando la cesta o eliminando los datos del sitio en su navegador.
        </p>
        <p>
          Este almacenamiento es estrictamente necesario para prestar la cesta que usted ha
          solicitado expresamente. Por ello no se requiere consentimiento según el artículo 25,
          apartado 2, número 2, de la ley alemana TDDDG. Si se tratan datos personales, la base
          jurídica es el artículo 6, apartado 1, letra b), del RGPD (medidas precontractuales).
        </p>
      </section>

      <section>
        <h2 id="inhalte">5. Fuentes, imágenes y vídeos</h2>
        <p>Todas las fuentes, fotos y vídeos se sirven desde nuestro propio alojamiento. No se cargan contenidos de terceros (por ejemplo, Google Fonts, YouTube o Vimeo).</p>
      </section>

      <section>
        <h2 id="anfragen">6. Contacto, asesoramiento y consultas</h2>
        <p>
          Cuando se pone en contacto con nosotros mediante un formulario, por correo electrónico o
          por teléfono –por ejemplo, para asesoramiento, una pieza a medida o una consulta de
          salón–, tratamos los datos que nos facilita (por lo general, nombre, correo electrónico, en
          su caso teléfono y su mensaje).
        </p>
        <p>
          La finalidad es atender su consulta. La base jurídica es el artículo 6, apartado 1, letra
          b), del RGPD si su consulta se refiere a un contrato y, en los demás casos, la letra f)
          (nuestro interés legítimo en responder). Borramos las consultas una vez resueltas si no da
          lugar a un contrato, a más tardar 12 meses después del último contacto. Si se celebra un
          contrato, se aplican los plazos del apartado 15.
        </p>
        <p>Guardamos los datos de los formularios en nuestra base de datos y utilizamos un servicio de envío de correo para las notificaciones (véase el apartado 12).</p>
        {gmail ? (
          <p>Nuestro buzón de correo lo presta {GOOGLE_IRELAND} (Gmail). Los correos que nos envía y nuestras respuestas se almacenan en servidores de Google; pueden transferirse datos a EE. UU. (véase el apartado 13).</p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Contacto por WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>
              Si lo desea, también puede escribirnos por WhatsApp. El proveedor es {WHATSAPP_IRELAND}.
              WhatsApp forma parte del grupo Meta; pueden transferirse datos a EE. UU. WhatsApp trata
              bajo su propia responsabilidad su número de teléfono, su perfil, los metadatos de la
              comunicación (por ejemplo, la hora) y –según su configuración– su agenda. Encontrará
              más detalles en la política de privacidad de WhatsApp.
            </p>
            <p>
              Utilizamos los mensajes únicamente para responder a su consulta (artículo 6, apartado
              1, letras b) o f), del RGPD) y borramos los chats una vez resueltos, a más tardar a los
              12 meses. Siempre puede contactarnos por correo electrónico o por teléfono. No nos
              envíe datos de salud por WhatsApp.
            </p>
          </>
        ) : (
          <p>Actualmente no ofrecemos contacto mediante servicios de mensajería.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Por favor, sin datos de salud</h2>
        <p>
          Muchas de nuestras clientas y clientes llevan prótesis capilares por motivos de salud. No
          necesitamos conocer esos motivos para asesorarle, gestionar su pedido o fabricar una pieza
          a medida. Por ello, nuestros formularios no solicitan datos de salud y le rogamos que no nos
          comunique información sobre enfermedades, tratamientos o diagnósticos. Para una pieza a
          medida bastan el contorno de cabeza, el color, la longitud y el peinado deseado.
        </p>
        <p>
          Si aun así nos comunica datos de salud, se trata de categorías especiales de datos
          conforme al artículo 9 del RGPD. No los utilizaremos y los borraremos en cuanto los
          detectemos, salvo que excepcionalmente los necesitemos para responder a su consulta. En
          ese caso le pediremos antes su consentimiento explícito (artículo 9, apartado 2, letra a),
          del RGPD), que podrá retirar en cualquier momento.
        </p>
      </section>

      <section>
        <h2 id="bestellung">9. Pedidos y ejecución del contrato</h2>
        <p>
          Para su pedido tratamos su nombre, direcciones de entrega y facturación, correo
          electrónico, en su caso teléfono, los artículos pedidos, precios, información de pago y
          envío y su mensaje. Los campos obligatorios están marcados; sin ellos no podemos celebrar
          ni ejecutar el contrato.
        </p>
        <p>
          Las bases jurídicas son el artículo 6, apartado 1, letra b), del RGPD (medidas
          precontractuales y ejecución del contrato) y, para la conservación de facturas y
          justificantes contables, la letra c) en relación con las obligaciones fiscales y
          mercantiles (véase el apartado 15).
        </p>
        <p>
          Para la entrega, comunicamos su nombre y dirección de entrega a la empresa de transporte{" "}
          {carrier}. Solo le comunicamos su correo electrónico o teléfono si usted lo ha consentido
          expresamente durante el pedido, para que pueda informarle sobre la entrega (artículo 6,
          apartado 1, letra a), del RGPD). Puede retirar este consentimiento en cualquier momento
          con efectos para el futuro.
        </p>
      </section>

      <section>
        <h2 id="zahlung">10. Pago</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>En caso de pago por transferencia, tratamos los datos que recibimos con ella (nombre, datos bancarios, importe, concepto) para asignarla a su pedido (artículo 6, apartado 1, letras b) y c), del RGPD). Su banco y el nuestro tratan los datos bajo su propia responsabilidad.</p>
        ) : null}
        {c.payments.paypal ? (
          <p>
            Si paga con PayPal, transmitimos los datos necesarios para el pago (nombre, correo
            electrónico, importe, número de pedido y, en su caso, dirección de entrega) a{" "}
            {PAYPAL_EUROPE}. PayPal trata estos datos como responsable independiente, entre otros
            fines para prevenir el fraude y, en su caso, verificar la solvencia; pueden producirse
            transferencias a terceros países. La base jurídica de nuestra transmisión es el artículo
            6, apartado 1, letra b), del RGPD. Sus derechos frente a PayPal figuran en su declaración
            de privacidad: https://www.paypal.com/es/legalhub/privacy-full.
          </p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="forma de pago pendiente de definir" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Desistimiento a través de nuestro sitio</h2>
        <p>Si desiste de un contrato mediante nuestra función de desistimiento («Desistir del contrato»), tratamos su nombre, los datos del pedido, su correo electrónico y la fecha y hora de recepción. Le enviamos un acuse de recibo por correo electrónico y tramitamos el desistimiento. La base jurídica es el artículo 6, apartado 1, letra c), del RGPD en relación con el artículo 356a del Código Civil alemán (BGB), así como la letra b).</p>
      </section>

      <section>
        <h2 id="dienstleister">12. Proveedores (encargados del tratamiento)</h2>
        <p>Recurrimos a proveedores cuidadosamente seleccionados que solo tratan los datos siguiendo nuestras instrucciones. Con ellos hemos celebrado contratos de encargo conforme al artículo 28 del RGPD.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – alojamiento del sitio
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – buzón de correo (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; lugar del tratamiento: {p.country}; base de la transferencia: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Transferencias a terceros países</h2>
        <p>
          Algunos proveedores tienen su sede en EE. UU. o pueden tratar datos allí. Para EE. UU., la
          Comisión Europea adoptó el 10 de julio de 2023 una decisión de adecuación (Marco de
          Privacidad de Datos UE-EE. UU.). Las transferencias a empresas certificadas se basan en el
          artículo 45 del RGPD. De forma complementaria, o para destinatarios no certificados, hemos
          acordado las cláusulas contractuales tipo de la Comisión Europea (artículo 46, apartado 2,
          letra c), del RGPD). Puede solicitarnos una copia. La base aplicable figura en la lista del
          apartado 12.
        </p>
      </section>

      <section>
        <h2 id="newsletter">14. Boletín</h2>
        <p>Solo recibirá nuestro boletín si se suscribe expresamente. Tras la suscripción le enviamos un correo con un enlace de confirmación (doble opt-in). Solo cuando hace clic en él le incluimos en la lista. Las suscripciones no confirmadas se borran a los 30 días.</p>
        <p>Guardamos su correo electrónico y las fechas de suscripción y confirmación para poder acreditar su consentimiento. La base jurídica es su consentimiento (artículo 6, apartado 1, letra a), del RGPD y artículo 7, apartado 2, número 2, de la Ley alemana contra la Competencia Desleal – UWG); conservamos la prueba con arreglo al artículo 6, apartado 1, letra c), en relación con el artículo 7, apartado 1, del RGPD. No medimos aperturas ni clics.</p>
        <p>Puede darse de baja en cualquier momento mediante el enlace de cada envío o escribiendo a {c.email}. Entonces borramos su dirección de la lista; conservamos la prueba del consentimiento hasta tres años después del final del año de la baja para poder defendernos frente a reclamaciones.</p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Plazos de conservación</h2>
        <ul>
          <li>Conservamos los datos contractuales hasta la ejecución completa del contrato y el vencimiento del plazo legal de garantía de dos años.</li>
          <li>Conservamos las facturas y justificantes contables durante ocho años (artículo 147, apartados 1 y 3, del Código Tributario alemán, AO).</li>
          <li>Conservamos la correspondencia comercial, por ejemplo las confirmaciones de pedido, durante seis años (artículo 147, apartados 1 y 3, AO).</li>
          <li>Los plazos comienzan al final del año natural en que se creó el documento. Durante ese tiempo limitamos el tratamiento a la conservación.</li>
          <li>Borramos todos los demás datos en cuanto dejan de ser necesarios; los plazos figuran en cada apartado.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Enlaces externos y redes sociales</h2>
        <p>Enlazamos a nuestros perfiles de Instagram y Facebook y a WhatsApp. Se trata de simples enlaces, no de complementos integrados: la mera visita de nuestro sitio no transmite datos a estos proveedores.</p>
        <p>Solo al hacer clic en un enlace se abre la página del proveedor, que trata entonces sus datos bajo su propia responsabilidad. El proveedor de Instagram y Facebook es {META_IRELAND}; el de WhatsApp es {WHATSAPP_IRELAND}. Pueden transferirse datos a EE. UU. Consulte las políticas de privacidad de los proveedores.</p>
      </section>

      <section>
        <h2 id="rechte">17. Sus derechos</h2>
        <p>Usted tiene los siguientes derechos sobre sus datos:</p>
        <ul>
          <li>Acceso (artículo 15 del RGPD)</li>
          <li>Rectificación (artículo 16 del RGPD)</li>
          <li>Supresión (artículo 17 del RGPD)</li>
          <li>Limitación del tratamiento (artículo 18 del RGPD)</li>
          <li>Portabilidad (artículo 20 del RGPD)</li>
          <li>Retirada del consentimiento con efectos para el futuro (artículo 7, apartado 3, del RGPD); el tratamiento realizado hasta entonces sigue siendo lícito</li>
        </ul>
        <p>
          <strong>Derecho de oposición (artículo 21 del RGPD):</strong> Cuando tratemos datos con
          base en el artículo 6, apartado 1, letra f), del RGPD, puede oponerse en cualquier momento
          por motivos relacionados con su situación particular. Dejaremos de tratarlos salvo que
          acreditemos motivos legítimos imperiosos o que el tratamiento sirva para la formulación,
          el ejercicio o la defensa de reclamaciones. Tras una oposición, nunca más le enviaremos
          publicidad.
        </p>
        <p>Para cualquier solicitud basta un mensaje informal a {c.email}.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Derecho a presentar una reclamación</h2>
        <p>Puede presentar una reclamación ante una autoridad de control (artículo 77 del RGPD), por ejemplo en su lugar de residencia. La autoridad competente para nosotros es:</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Seguridad, decisiones automatizadas, cambios</h2>
        <p>La conexión con nuestro sitio está cifrada mediante TLS (se reconoce por «https://»). No adoptamos decisiones automatizadas ni elaboramos perfiles en el sentido del artículo 22 del RGPD. Actualizamos esta política cuando cambian nuestro sitio o la legislación.</p>
        <p>
          Última actualización: {c.effectiveDate ?? <Missing field="effectiveDate" label="fecha de entrada en vigor" />}
        </p>
      </section>
    </>
  );
}
