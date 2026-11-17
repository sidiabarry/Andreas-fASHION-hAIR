import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dado em falta: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>o nosso sítio, através do botão «Resolver o contrato» no fundo de cada página</>;
  return (
    <>
      <p>
        <strong>Nota:</strong> Apenas a versão alemã é juridicamente vinculativa; esta tradução
        serve apenas para facilitar a compreensão.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Informações sobre o direito de livre resolução</h2>
        <h3 id="widerrufsrecht">Direito de livre resolução</h3>
        <p>Tem o direito de resolver o presente contrato no prazo de 14 dias sem necessidade de indicar qualquer motivo.</p>
        <p>O prazo de livre resolução expira 14 dias a contar do dia em que adquira ou que um terceiro, com exceção do transportador, indicado por si, adquira a posse física dos bens. Se encomendou vários bens numa única encomenda e estes forem entregues separadamente, o prazo expira 14 dias a contar do dia em que adquira ou que um terceiro, com exceção do transportador, indicado por si, adquira a posse física do último bem.</p>
        <p>
          A fim de exercer o seu direito de livre resolução, tem de nos comunicar (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo da titular" />}, {c.brandName},{" "}
          {addressLine(c)}, telefone {c.phone}, e-mail {c.withdrawalEmail}) a sua decisão de
          resolução do presente contrato por meio de uma declaração inequívoca (por exemplo, carta
          enviada pelo correio ou correio eletrónico). Pode utilizar o modelo de formulário de livre
          resolução em anexo, mas tal não é obrigatório.
        </p>
        <p>Pode também exercer o seu direito de livre resolução online em {where}. Se utilizar esta função online, enviar-lhe-emos sem demora, num suporte duradouro (por exemplo, por e-mail), um aviso de receção com informações sobre o conteúdo da declaração de resolução e a data e hora da sua receção.</p>
        <p>Para que o prazo de livre resolução seja respeitado, basta que a sua comunicação referente ao exercício do direito de livre resolução seja enviada antes do termo do prazo.</p>

        <h3 id="folgen">Efeitos da livre resolução</h3>
        <p>Em caso de resolução do presente contrato, ser-lhe-ão reembolsados todos os pagamentos efetuados, incluindo os custos de entrega (com exceção de quaisquer custos suplementares resultantes da sua escolha de uma modalidade de envio diferente da modalidade menos onerosa de entrega normal por nós oferecida), sem demora injustificada e, em qualquer caso, o mais tardar 14 dias a contar da data em que formos informados da sua decisão de resolução do presente contrato. Efetuamos esses reembolsos usando o mesmo meio de pagamento que usou na transação inicial, salvo acordo expresso em contrário; em qualquer caso, não incorrerá em quaisquer custos como consequência de tal reembolso. Podemos reter o reembolso até termos recebido os bens de volta ou até ter apresentado prova do envio dos bens, consoante o que ocorrer primeiro.</p>
        <p>Deve devolver-nos os bens sem demora injustificada e, em qualquer caso, o mais tardar 14 dias a contar do dia em que nos informar da resolução do presente contrato. Considera-se que o prazo é respeitado se nos devolver os bens antes do termo do prazo de 14 dias.</p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Suportaremos o custo da devolução dos bens.</>
          ) : c.returnCosts === "customer" ? (
            <>Suporta os custos diretos da devolução dos bens.</>
          ) : (
            <Missing field="returnCosts" label="quem suporta os custos de devolução (decisão da titular)" />
          )}
        </p>
        <p>Só é responsável pela depreciação dos bens que decorra de uma manipulação que exceda o necessário para verificar a natureza, as características e o funcionamento dos bens.</p>

        <h3 id="ausschluss">Exclusão ou extinção antecipada do direito de livre resolução</h3>
        <p>Não existe direito de livre resolução nos contratos</p>
        <ul>
          <li>de fornecimento de bens que não sejam pré-fabricados e cuja produção dependa de uma escolha ou especificação individual do consumidor, ou que sejam claramente personalizados de acordo com as suas necessidades. Connosco, trata-se de todos os produtos assinalados como feitos por medida, por exemplo a prótese capilar por medida.</li>
        </ul>
        <p>O direito de livre resolução extingue-se antecipadamente nos contratos</p>
        <ul>
          <li>de fornecimento de bens selados não suscetíveis de devolução por motivos de proteção da saúde ou de higiene, quando abertos após a entrega. Isto aplica-se apenas a produtos que entregamos selados e assinalamos como tal na página do produto.</li>
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
        <h2 id="online-widerruf">3. Como resolver o contrato através do nosso sítio</h2>
        <ol>
          <li>Clique em «Resolver o contrato». O botão está disponível em todas as páginas do sítio durante o prazo de livre resolução.</li>
          <li>Indique o seu nome, o número da encomenda ou outros dados da encomenda e o e-mail para o aviso de receção. Pode também resolver apenas alguns artigos de uma encomenda.</li>
          <li>Verifique os dados e clique em «Confirmar a resolução».</li>
          <li>Enviamos-lhe sem demora, por e-mail, um aviso de receção com o conteúdo da sua declaração e a data e hora de receção.</li>
        </ol>
        <p>O aviso de receção apenas confirma que a sua declaração nos chegou. Se a algum artigo se aplicar uma exceção ao direito de livre resolução, informá-lo-emos separadamente.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Indicações para a devolução</h2>
        <p>Envie a mercadoria para: {c.brandName}, {addressLine(c)}. Facilita-nos o trabalho se a devolver bem protegida – se possível na embalagem original – com o número da encomenda. Isto não é condição para a validade da resolução. Pode experimentar cuidadosamente as peças capilares como numa loja; não as corte, pinte, lave nem cole antes do fim do prazo de livre resolução, caso contrário pode ocorrer uma depreciação pela qual é responsável nos termos das informações sobre a livre resolução.</p>
      </section>
    </>
  );
}
