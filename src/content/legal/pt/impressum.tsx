import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dado em falta: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Nota:</strong> Apenas a versão alemã é juridicamente vinculativa; esta tradução
        serve apenas para facilitar a compreensão.
      </p>
      <section>
        <h2 id="anbieter">1. Titular do sítio</h2>
        <p>Informações nos termos do artigo 5.º da Lei alemã dos Serviços Digitais (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo da titular" />}
          <br />
          Nome comercial: {c.brandName}
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
          <dt>Telefone</dt>
          <dd>{c.phone}</dd>
          <dt>E-mail</dt>
          <dd>{c.email}</dd>
          <dt>Horário</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. IVA e registo</h2>
        {c.vatId ? (
          <p>Número de identificação para efeitos de IVA nos termos do artigo 27.º-A da lei alemã do IVA: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>A titular está abrangida pelo regime das pequenas empresas previsto no artigo 19.º da lei alemã do IVA (UStG). Não é cobrado IVA.</p>
        ) : (
          <p>
            Número de IVA: <Missing field="vatId" label="número de IVA (se atribuído) ou regime de pequena empresa" />
          </p>
        )}
        {c.tradeRegister ? <p>Registo: {c.tradeRegister}</p> : <p>A empresa não está inscrita no registo comercial.</p>}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Resolução de litígios de consumo</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Estamos dispostos a participar em procedimentos de resolução de litígios perante uma entidade de resolução alternativa de litígios de consumo. A entidade competente é:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Declaramos que participaremos em procedimentos de resolução de litígios perante essa entidade.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Não estamos dispostos nem obrigados a participar em procedimentos de resolução de litígios perante uma entidade de resolução alternativa de litígios de consumo. Se tiver alguma dúvida ou problema, escreva-nos diretamente – encontraremos juntos uma solução.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decisão sobre a resolução alternativa de litígios (art. 36.º VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. Sobre este sítio</h2>
        <p>Elaboramos o conteúdo deste sítio com cuidado. As páginas de outros fornecedores para as quais remetemos são da responsabilidade destes. As fotografias e os textos deste sítio estão protegidos por direitos de autor; pergunte-nos antes de os utilizar.</p>
      </section>
    </>
  );
}
