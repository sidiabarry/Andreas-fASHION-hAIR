import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dado em falta: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "pt-PT");
  const carrier = c.carrier ?? <Missing field="carrier" label="transportadora" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Nota:</strong> Apenas a versão alemã é juridicamente vinculativa; esta tradução
        serve apenas para facilitar a compreensão.
      </p>
      <section>
        <h2 id="versandkosten">1. Portes de envio</h2>
        <dl>
          <dt>Alemanha</dt>
          <dd>
            {eur(ship.domesticCents)} por encomenda
            {ship.freeFromCents !== null ? <>; grátis a partir de {eur(ship.freeFromCents)}</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Países da União Europeia</dt>
              <dd>{eur(ship.euCents)} por encomenda{others.length === 0 ? <> (entrega mediante acordo)</> : null}</dd>
            </>
          ) : null}
          <dt>Outros países</dt>
          <dd>a pedido – indicamos os portes antes da encomenda</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>Enquanto pequena empresa nos termos do artigo 19.º da lei alemã do IVA (UStG), não cobramos IVA, nem sobre os portes.</>
          ) : c.smallBusiness === false ? (
            <>Todos os preços e portes incluem o IVA legal.</>
          ) : (
            <Missing field="smallBusiness" label="regime de IVA (pequena empresa sim/não)" />
          )}{" "}
          Em entregas fora da União Europeia podem ser devidos direitos aduaneiros, impostos de
          importação e taxas, que paga às autoridades competentes.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Entrega e prazos</h2>
        <ul>
          <li>
            Enviamos pela {carrier}, em embalagem discreta e com seguimento. Países de entrega:
            Alemanha{others.length > 0 ? <>, {countryNames(others, "pt")}</> : null}; outros países mediante acordo.
          </li>
          <li>As peças em stock chegam-lhe na Alemanha em {deliveryDaysOf(c)} dias úteis – com pagamento antecipado e PayPal a partir do dia seguinte à receção do pagamento; caso contrário, a partir do dia seguinte à celebração do contrato. O prazo para o estrangeiro é indicado antes da celebração do contrato.</li>
          <li>Fabricamos as peças por medida em cerca de {madeToOrderDaysOf(c)} dias úteis, depois de recebermos todos os dados e – com pagamento antecipado ou PayPal – o pagamento.</li>
          <li>Por razões de segurança, não podemos enviar alguns produtos de cuidado, adesivos e solventes para todos os países. Indicamo-lo na página do produto.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Meios de pagamento</h2>
        <p>Após a sua encomenda, verificamos pessoalmente a disponibilidade e enviamos-lhe uma confirmação com os dados de pagamento. Só paga depois de aceitarmos a sua encomenda.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="meio de pagamento a definir" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Pagamento antecipado por transferência</strong> – no prazo de 7 dias após a
                confirmação; envio após a receção do pagamento.
                {c.bank ? (
                  <>
                    {" "}Titular da conta: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Indique o número da encomenda no descritivo.
                  </>
                ) : (
                  <> <Missing field="bank" label="dados bancários" /></>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – após a confirmação recebe um pedido de pagamento através da PayPal
                {c.paypalEmail ? <> de {c.paypalEmail}</> : <> <Missing field="paypalEmail" label="conta PayPal" /></>}
                ; a pagar no prazo de 7 dias. Envio após a receção do pagamento.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Pagamento em prestações via PayPal</strong> – se a PayPal lho oferecer; o mutuante é a PayPal, sujeito à sua verificação de solvabilidade e condições. Nós não concedemos crédito.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Fatura</strong> – transferência no prazo de 14 dias após a receção da
                mercadoria. Podemos recusar este meio em casos concretos e propor-lhe outro meio disponível.
                {c.bank ? null : <> <Missing field="bank" label="dados bancários" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Não cobramos taxas adicionais pelo pagamento.</p>
      </section>
    </>
  );
}
