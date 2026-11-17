import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

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
        <h2 id="geltung">§ 1 Âmbito e vendedora</h2>
        <ol>
          <li>Os presentes termos e condições gerais (TCG) aplicam-se a todas as encomendas feitas por consumidores (§ 13 BGB) na nossa loja online.</li>
          <li>
            A sua contraparte é{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo da titular" />} (nome comercial «{c.brandName}»),{" "}
            {addressLine(c)}, telefone {c.phone}, e-mail {c.email}.
          </li>
          <li>A língua do contrato é o alemão. As traduções servem apenas para compreensão.</li>
        <li>Estes TCG aplicam-se apenas a consumidores. Salões, cabeleireiros e outras empresas recebem, a pedido, uma proposta individual em condições próprias.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Celebração do contrato</h2>
        <ol>
          <li>A apresentação dos produtos na loja não constitui uma proposta vinculativa, mas um convite a encomendar. Muitas peças são únicas.</li>
          <li>Coloca os produtos no carrinho, indica no passo seguinte os seus dados de contacto e de entrega e vê depois um resumo com todos os dados e o preço total. Pode corrigir erros de introdução a qualquer momento antes do envio: com o botão «retroceder» do navegador, através de «Alterar» no carrinho ou diretamente nos campos. Ao clicar no botão «Encomenda com obrigação de pagamento» faz uma proposta vinculativa de compra dos artigos do carrinho.</li>
          <li>Logo a seguir recebe um e-mail automático a confirmar a receção da encomenda. Este aviso de receção ainda não constitui aceitação da sua proposta.</li>
          <li>Verificamos pessoalmente se a peça está disponível. O contrato é celebrado quando aceitamos expressamente a sua encomenda por e-mail (confirmação da encomenda) ou lhe enviamos a mercadoria – o que ocorrer primeiro. Decidimos no prazo de três dias úteis após a receção da encomenda. Se nesse prazo não receber a aceitação, deixa de estar vinculado(a) à sua encomenda; os pagamentos já efetuados são reembolsados sem demora.</li>
          <li>Se uma peça única já não estiver disponível, informamo-lo sem demora. Nesse caso não é celebrado contrato relativo a essa peça.</li>
          <li>Com a confirmação da encomenda recebe por e-mail o texto do contrato, estes TCG, as informações sobre a livre resolução e o modelo de formulário de livre resolução.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Conservação do texto do contrato</h2>
        <p>Guardamos o texto do contrato (os seus dados de encomenda e os TCG em vigor no momento da encomenda) e enviamo-lo por e-mail. Pode consultar, guardar e imprimir os TCG em vigor nesta página a qualquer momento. Não oferecemos uma conta de cliente onde se possam consultar encomendas anteriores.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Preços e portes</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Todos os preços são preços finais. Enquanto pequena empresa na aceção do artigo 19.º da lei alemã do IVA (UStG), não cobramos IVA e, por isso, não o discriminamos.</>
            ) : c.smallBusiness === false ? (
              <>Todos os preços são preços finais com IVA incluído.</>
            ) : (
              <Missing field="smallBusiness" label="regime de IVA (pequena empresa sim/não)" />
            )}
          </li>
          <li>
            Acrescem portes de envio: na Alemanha {eur(ship.domesticCents)} por encomenda
            {ship.freeFromCents !== null ? <>, grátis a partir de um valor de {eur(ship.freeFromCents)}</> : null}
            {ship.euCents !== null ? <>; para outros países da União Europeia {eur(ship.euCents)} por encomenda</> : null}
            . Para outros países indicamos os portes a pedido antes da encomenda. Vê os portes no
            resumo antes de enviar a encomenda.
          </li>
          <li>Em entregas fora da União Europeia podem ser devidos direitos aduaneiros, impostos e taxas, que paga às autoridades competentes.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Pagamento</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="meio de pagamento a definir" />
          </p>
        ) : (
          <>
            <p>Pode pagar com os seguintes meios. Enviamos os dados de pagamento com a confirmação da encomenda.</p>
            <ul>
              {c.payments.prepayment ? (
                <li><strong>Pagamento antecipado por transferência:</strong> transfira o montante total no prazo de 7 dias após receber a confirmação da encomenda. Enviamos após a receção do pagamento. Se o pagamento não for recebido apesar de um lembrete, podemos resolver o contrato.</li>
              ) : null}
              {c.payments.paypal ? (
                <li><strong>PayPal:</strong> após a confirmação da encomenda recebe um pedido de pagamento PayPal. Pague no prazo de 7 dias. Aplicam-se também as condições da PayPal. Envio após a receção do pagamento.</li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>Pagamento em prestações via PayPal:</strong> se a PayPal lhe oferecer esta opção, pode pagar em prestações após uma verificação de solvabilidade pela PayPal. Celebra o crédito diretamente com a PayPal como mutuante; aplicam-se as suas condições e informações pré-contratuais. Nós não concedemos crédito. O seu contrato de compra e venda connosco não é afetado.</li> : null}
              {c.payments.bankTransfer ? (
                <li><strong>Fatura (transferência após a receção):</strong> o montante deve ser transferido sem desconto no prazo de 14 dias após a receção da mercadoria. Podemos recusar este meio em casos concretos, em especial para montantes elevados ou entregas no estrangeiro, e propor-lhe outro meio disponível.</li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Entrega</h2>
        <ol>
          <li>
            Entregamos na Alemanha
            {others.length > 0 ? <> e nos seguintes países: {countryNames(others, "pt")}</> : null}. As
            entregas para outros países são possíveis mediante acordo prévio. O envio é feito pela {carrier}.
          </li>
          <li>Prazo de entrega de artigos em stock na Alemanha: {deliveryDaysOf(c)} dias. Com pagamento antecipado ou PayPal, o prazo começa no dia seguinte à receção do pagamento; nos restantes casos, no dia seguinte à celebração do contrato. O prazo para envios para o estrangeiro é-lhe comunicado antes da celebração do contrato.</li>
          <li>Fabricamos as peças por medida em cerca de {madeToOrderDaysOf(c)} dias, depois de recebermos todos os dados necessários e – com pagamento antecipado ou PayPal – o pagamento. Comunicamos-lhe a data de envio prevista.</li>
          <li>Se a mercadoria chegar com danos de transporte visíveis, reclame junto do estafeta e informe-nos brevemente. Os seus direitos legais mantêm-se; a sua comunicação ajuda-nos a reclamar junto da transportadora.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Reserva de propriedade</h2>
        <p>A mercadoria continua a ser nossa propriedade até ao pagamento integral.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Peças por medida e segundo as suas especificações</h2>
        <ol>
          <li>Para produtos assinalados como feitos por medida, fabricamos segundo as suas indicações, por exemplo perímetro da cabeça, cor, densidade, direção do cabelo e base. Verifique cuidadosamente os seus dados; discutimo-los consigo antes de começar.</li>
          <li>Para peças feitas por medida não existe direito de livre resolução (§ 312g, n.º 2, ponto 1, BGB). Os pormenores constam das informações sobre a livre resolução. Os seus direitos em caso de defeitos mantêm-se.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Direito de livre resolução</h2>
        <p>Enquanto consumidor(a), tem um direito legal de livre resolução. As condições, prazos e procedimento, as exceções e a função online «Resolver o contrato» estão descritos nas nossas informações sobre a livre resolução.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Garantia legal (responsabilidade por falta de conformidade)</h2>
        <ol>
          <li>Aplicam-se os direitos legais em caso de defeitos (§§ 434 e seguintes BGB). O prazo para reclamações por defeitos é de dois anos a contar da entrega da mercadoria.</li>
          <li>Em caso de defeito, contacte-nos: {c.email}, telefone {c.phone}, ou por correio: {addressLine(c)}.</li>
          <li>Só concedemos uma garantia comercial adicional se a indicarmos expressamente para um produto.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Responsabilidade</h2>
        <ol>
          <li>Respondemos sem limitação em caso de dolo e negligência grave, de lesão da vida, do corpo ou da saúde, nos termos da lei alemã da responsabilidade decorrente de produtos defeituosos e na medida de uma garantia prestada.</li>
          <li>Em caso de violação por negligência leve de uma obrigação cujo cumprimento é essencial para a boa execução do contrato e em cujo cumprimento pode normalmente confiar (obrigação contratual essencial), a nossa responsabilidade limita-se ao dano previsível e típico do contrato.</li>
          <li>No restante, a responsabilidade por negligência leve é excluída.</li>
          <li>Os seus direitos em caso de defeitos nos termos do § 10 não são afetados por estas disposições.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Produtos de cuidado, adesivos e solventes</h2>
        <p>Antes de utilizar colas, fitas adesivas e solventes, leia e siga as instruções de utilização e advertências do fabricante na embalagem e na página do produto. Recomendamos testar primeiro um produto novo numa pequena zona da pele. Mantenha estes produtos fora do alcance das crianças. Podem existir restrições de envio para alguns produtos; indicamo-lo na página do produto.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Resolução de litígios de consumo</h2>
        {c.disputeResolution === "willing" ? (
          <p>Estamos dispostos a participar em procedimentos de resolução de litígios perante a seguinte entidade: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Não estamos dispostos nem obrigados a participar em procedimentos de resolução de litígios perante uma entidade de resolução alternativa de litígios de consumo.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decisão sobre a resolução alternativa de litígios (art. 36.º VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Lei aplicável</h2>
        <p>Aplica-se o direito da República Federal da Alemanha, com exclusão da Convenção das Nações Unidas sobre os Contratos de Compra e Venda Internacional de Mercadorias. Se a sua residência habitual se situar noutro Estado, mantém a proteção das disposições imperativas de defesa do consumidor desse Estado (artigo 6.º, n.º 2, do Regulamento Roma I).</p>
        <p>
          Última atualização: {c.effectiveDate ?? <Missing field="effectiveDate" label="data de entrada em vigor dos TCG" />}
        </p>
      </section>
    </>
  );
}
