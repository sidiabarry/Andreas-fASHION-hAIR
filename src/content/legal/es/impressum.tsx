import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato pendiente: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Aviso:</strong> La versión alemana es la jurídicamente vinculante; esta traducción
        sirve únicamente para facilitar su comprensión.
      </p>
      <section>
        <h2 id="anbieter">1. Titular del sitio</h2>
        <p>Información conforme al artículo 5 de la Ley alemana de Servicios Digitales (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nombre completo de la titular" />}
          <br />
          Nombre comercial: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="forma jurídica" />}
          <br />
          {c.street}
          <br />
          {c.zip} {c.city}
          <br />
          {c.country}
        </p>
      </section>

      <section>
        <h2 id="kontakt">2. Contacto</h2>
        <dl>
          <dt>Teléfono</dt>
          <dd>{c.phone}</dd>
          <dt>Correo electrónico</dt>
          <dd>{c.email}</dd>
          <dt>Horario de atención</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. IVA y registro</h2>
        {c.vatId ? (
          <p>Número de identificación a efectos del IVA según el artículo 27a de la Ley alemana del IVA: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>La titular es pequeña empresaria en el sentido del artículo 19 de la Ley alemana del IVA (UStG). No se factura IVA.</p>
        ) : (
          <p>
            Número de IVA: <Missing field="vatId" label="número de IVA (si se ha asignado) o régimen de pequeña empresa" />
          </p>
        )}
        {c.tradeRegister ? <p>Inscripción registral: {c.tradeRegister}</p> : <p>La empresa no está inscrita en el registro mercantil.</p>}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Resolución de litigios de consumo</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Estamos dispuestos a participar en procedimientos de resolución de litigios ante una entidad de resolución alternativa de consumo. La entidad competente es:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Declaramos por la presente que participaremos en procedimientos de resolución de litigios ante dicha entidad.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>No estamos dispuestos ni obligados a participar en procedimientos de resolución de litigios ante una entidad de resolución alternativa de consumo. Si tiene alguna pregunta o problema, escríbanos directamente: encontraremos juntos una solución.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decisión sobre la resolución alternativa de litigios (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. Sobre este sitio web</h2>
        <p>Elaboramos los contenidos de este sitio con cuidado. Las páginas enlazadas de otros proveedores son responsabilidad de estos. Las fotos y los textos de este sitio están protegidos por derechos de autor; pregúntenos antes de utilizarlos.</p>
      </section>
    </>
  );
}
