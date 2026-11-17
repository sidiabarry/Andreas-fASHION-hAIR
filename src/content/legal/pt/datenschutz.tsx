import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dado em falta: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="transportadora" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Nota:</strong> Apenas a versão alemã é juridicamente vinculativa; esta tradução
        serve apenas para facilitar a compreensão.
      </p>
      <section>
        <h2 id="ueberblick">1. Em resumo</h2>
        <ul>
          <li>Este sítio não utiliza cookies, ferramentas de análise nem rastreadores publicitários.</li>
          <li>As fontes e os vídeos estão alojados no nosso próprio servidor. A visita ao sítio não transmite dados à Google, ao YouTube, à Meta ou a fornecedores semelhantes.</li>
          <li>Tratamos os seus dados apenas para processar a sua encomenda ou pedido, cumprir obrigações legais e – apenas com o seu consentimento – enviar-lhe a nossa newsletter.</li>
          <li>Pedimos-lhe que não nos envie dados de saúde (ver ponto 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Responsável pelo tratamento</h2>
        <p>A responsável pelo tratamento na aceção do Regulamento Geral sobre a Proteção de Dados (RGPD) é:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo da titular" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Telefone: {c.phone}
          <br />
          E-mail: {c.email}
        </p>
        <p>Não estamos legalmente obrigados a designar um encarregado da proteção de dados. Para qualquer questão, contacte-nos através dos dados acima.</p>
      </section>

      <section>
        <h2 id="hosting">3. Alojamento e ficheiros de registo</h2>
        <p>O nosso sítio é alojado por {c.hostingProvider.name}, {c.hostingProvider.address}. Em cada visita, o servidor trata os dados tecnicamente necessários que o seu navegador envia automaticamente: endereço IP, data e hora, página solicitada, volume de dados transferido, código de estado, URL de origem e dados do navegador e do sistema operativo.</p>
        <p>Precisamos destes dados para apresentar o sítio, garantir a sua segurança e repelir ataques. O fundamento jurídico é o artigo 6.º, n.º 1, alínea f), do RGPD; o nosso interesse legítimo é um sítio seguro e funcional. Não analisamos os registos para fins estatísticos ou de marketing nem os combinamos com outros dados. O fornecedor conserva os registos apenas durante um curto período tecnicamente necessário e elimina-os depois automaticamente.</p>
        <p>Celebrámos com o fornecedor um contrato de subcontratação nos termos do artigo 28.º do RGPD. Sobre transferências para os EUA, ver o ponto 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Armazenamento no seu navegador (sem cookies, sem rastreamento)</h2>
        <p>Para manter o seu carrinho enquanto navega, guardamos os artigos selecionados no armazenamento local do navegador (localStorage). Estas informações ficam no seu dispositivo e só nos são enviadas quando submete uma encomenda. Pode apagá-las a qualquer momento esvaziando o carrinho ou eliminando os dados do sítio no navegador.</p>
        <p>Este armazenamento é estritamente necessário para disponibilizar o carrinho que pediu expressamente. Por isso não é necessário consentimento nos termos do artigo 25.º, n.º 2, ponto 2, da lei alemã TDDDG. Se estiverem em causa dados pessoais, o fundamento jurídico é o artigo 6.º, n.º 1, alínea b), do RGPD (diligências pré-contratuais).</p>
      </section>

      <section>
        <h2 id="inhalte">5. Fontes, imagens e vídeos</h2>
        <p>Todas as fontes, fotografias e vídeos são fornecidos a partir do nosso próprio alojamento. Não são carregados conteúdos de terceiros (por exemplo, Google Fonts, YouTube ou Vimeo).</p>
      </section>

      <section>
        <h2 id="anfragen">6. Contacto, aconselhamento e pedidos</h2>
        <p>Quando nos contacta por formulário, e-mail ou telefone – por exemplo para aconselhamento, uma peça por medida ou um pedido de salão – tratamos os dados que nos fornece (normalmente nome, e-mail, eventualmente telefone e a sua mensagem).</p>
        <p>A finalidade é responder ao seu pedido. O fundamento jurídico é o artigo 6.º, n.º 1, alínea b), do RGPD se o pedido disser respeito a um contrato e, nos restantes casos, a alínea f) (o nosso interesse legítimo em responder). Eliminamos os pedidos depois de resolvidos se não resultar um contrato, o mais tardar 12 meses após o último contacto. Se for celebrado um contrato, aplicam-se os prazos do ponto 15.</p>
        <p>Guardamos os dados dos formulários na nossa base de dados e utilizamos um serviço de envio de e-mail para notificações (ver ponto 12).</p>
        {gmail ? (
          <p>A nossa caixa de correio é disponibilizada por {GOOGLE_IRELAND} (Gmail). Os e-mails que nos envia e as nossas respostas são, por isso, armazenados em servidores da Google; podem ser transferidos dados para os EUA (ver ponto 13).</p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Contacto por WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>Se o desejar, pode também escrever-nos pelo WhatsApp. O fornecedor é {WHATSAPP_IRELAND}. O WhatsApp pertence ao grupo Meta; podem ser transferidos dados para os EUA. O WhatsApp trata sob a sua própria responsabilidade o seu número de telefone, o seu perfil, os metadados da comunicação (por exemplo, a hora) e – consoante as suas definições – a sua lista de contactos. Para mais pormenores, consulte a política de privacidade do WhatsApp.</p>
            <p>Utilizamos as mensagens apenas para responder ao seu pedido (artigo 6.º, n.º 1, alíneas b) ou f), do RGPD) e eliminamos as conversas depois de resolvidas, o mais tardar após 12 meses. Pode sempre contactar-nos por e-mail ou telefone. Não nos envie dados de saúde pelo WhatsApp.</p>
          </>
        ) : (
          <p>De momento não oferecemos contacto através de serviços de mensagens.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Por favor, sem dados de saúde</h2>
        <p>Muitas das nossas clientes e muitos dos nossos clientes usam próteses capilares por motivos de saúde. Não precisamos de conhecer esses motivos para o aconselhamento, a encomenda ou a peça por medida. Os nossos formulários não pedem dados de saúde e pedimos-lhe que não nos comunique informações sobre doenças, tratamentos ou diagnósticos. Para uma peça por medida bastam o perímetro da cabeça, a cor, o comprimento e o penteado pretendido.</p>
        <p>Se, ainda assim, nos comunicar dados de saúde, trata-se de categorias especiais de dados nos termos do artigo 9.º do RGPD. Não os utilizamos e eliminamo-los assim que os detetarmos, salvo se excecionalmente precisarmos deles para responder ao seu pedido. Nesse caso, pedimos-lhe antes o seu consentimento explícito (artigo 9.º, n.º 2, alínea a), do RGPD), que pode retirar a qualquer momento.</p>
      </section>

      <section>
        <h2 id="bestellung">9. Encomenda e execução do contrato</h2>
        <p>Para a sua encomenda tratamos o nome, as moradas de entrega e de faturação, o e-mail, eventualmente o telefone, os artigos encomendados, os preços, as informações de pagamento e envio e a sua mensagem. Os campos obrigatórios estão assinalados; sem eles não podemos celebrar nem executar o contrato.</p>
        <p>Os fundamentos jurídicos são o artigo 6.º, n.º 1, alínea b), do RGPD (diligências pré-contratuais e execução do contrato) e, para a conservação de faturas e documentos contabilísticos, a alínea c) em conjugação com as obrigações fiscais e comerciais (ver ponto 15).</p>
        <p>Para a entrega, comunicamos o seu nome e morada de entrega à transportadora {carrier}. Só comunicamos o seu e-mail ou telefone à transportadora se o tiver consentido expressamente na encomenda, para que esta o possa informar sobre a entrega (artigo 6.º, n.º 1, alínea a), do RGPD). Pode retirar este consentimento a qualquer momento com efeitos para o futuro.</p>
      </section>

      <section>
        <h2 id="zahlung">10. Pagamento</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>No pagamento por transferência, tratamos os dados que recebemos com a transferência (nome, dados bancários, montante, descritivo) para a associar à sua encomenda (artigo 6.º, n.º 1, alíneas b) e c), do RGPD). O seu banco e o nosso tratam os dados sob a sua própria responsabilidade.</p>
        ) : null}
        {c.payments.paypal ? (
          <p>Se pagar com PayPal, transmitimos os dados necessários ao pagamento (nome, e-mail, montante, número de encomenda e, eventualmente, morada de entrega) a {PAYPAL_EUROPE}. A PayPal trata estes dados como responsável independente, nomeadamente para prevenção de fraude e, eventualmente, verificação de solvabilidade; podem ocorrer transferências para países terceiros. O fundamento jurídico da nossa transmissão é o artigo 6.º, n.º 1, alínea b), do RGPD. Os seus direitos perante a PayPal constam da declaração de privacidade da PayPal: https://www.paypal.com/pt/legalhub/privacy-full.</p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="meio de pagamento a definir" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Livre resolução através do nosso sítio</h2>
        <p>Se resolver um contrato através da nossa função de livre resolução («Resolver o contrato»), tratamos o seu nome, os dados da encomenda, o seu e-mail e a data e hora de receção. Enviamos-lhe um aviso de receção por e-mail e processamos a resolução. O fundamento jurídico é o artigo 6.º, n.º 1, alínea c), do RGPD em conjugação com o § 356a do Código Civil alemão (BGB), bem como a alínea b).</p>
      </section>

      <section>
        <h2 id="dienstleister">12. Prestadores de serviços (subcontratantes)</h2>
        <p>Recorremos a prestadores cuidadosamente selecionados que só tratam os dados segundo as nossas instruções. Com eles celebrámos contratos nos termos do artigo 28.º do RGPD.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – alojamento do sítio
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – caixa de correio (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; local do tratamento: {p.country}; fundamento da transferência: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Transferências para países terceiros</h2>
        <p>Alguns prestadores têm sede nos EUA ou podem tratar dados nesse país. Para os EUA, a Comissão Europeia adotou em 10 de julho de 2023 uma decisão de adequação (Quadro de Privacidade de Dados UE-EUA). As transferências para empresas certificadas baseiam-se no artigo 45.º do RGPD. Complementarmente, ou para destinatários não certificados, acordámos as cláusulas contratuais-tipo da Comissão Europeia (artigo 46.º, n.º 2, alínea c), do RGPD). Pode pedir-nos uma cópia. O fundamento aplicável consta da lista do ponto 12.</p>
      </section>

      <section>
        <h2 id="newsletter">14. Newsletter</h2>
        <p>Só recebe a nossa newsletter se a subscrever expressamente. Após a subscrição enviamos-lhe um e-mail com uma ligação de confirmação (dupla confirmação). Só depois de clicar nessa ligação o incluímos na lista. As subscrições não confirmadas são eliminadas após 30 dias.</p>
        <p>Guardamos o seu e-mail e os momentos de subscrição e confirmação para podermos comprovar o seu consentimento. O fundamento jurídico é o seu consentimento (artigo 6.º, n.º 1, alínea a), do RGPD; § 7, n.º 2, ponto 2, da lei alemã contra a concorrência desleal – UWG); conservamos a prova com base no artigo 6.º, n.º 1, alínea c), em conjugação com o artigo 7.º, n.º 1, do RGPD. Não medimos aberturas nem cliques.</p>
        <p>Pode cancelar a subscrição a qualquer momento através da ligação em cada envio ou escrevendo para {c.email}. Eliminamos então o seu endereço da lista; conservamos a prova do consentimento até três anos após o fim do ano do cancelamento, para nos podermos defender de eventuais reclamações.</p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Prazos de conservação</h2>
        <ul>
          <li>Conservamos os dados contratuais até à execução integral do contrato e ao termo do prazo legal de garantia de dois anos.</li>
          <li>Conservamos faturas e documentos contabilísticos durante oito anos (§ 147, n.os 1 e 3, do Código Tributário alemão, AO).</li>
          <li>Conservamos a correspondência comercial, por exemplo confirmações de encomenda, durante seis anos (§ 147, n.os 1 e 3, AO).</li>
          <li>Os prazos contam a partir do fim do ano civil em que o documento foi criado. Durante esse período limitamos o tratamento à conservação.</li>
          <li>Eliminamos todos os outros dados logo que deixem de ser necessários; os prazos constam de cada ponto.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Ligações externas e redes sociais</h2>
        <p>Remetemos para os nossos perfis no Instagram e no Facebook e para o WhatsApp. Trata-se de simples ligações, não de plug-ins integrados: a simples visita ao nosso sítio não transmite dados a estes fornecedores.</p>
        <p>Só ao clicar numa ligação se abre a página do fornecedor, que trata então os seus dados sob a sua própria responsabilidade. O fornecedor do Instagram e do Facebook é {META_IRELAND}; o do WhatsApp é {WHATSAPP_IRELAND}. Podem ser transferidos dados para os EUA. Consulte as políticas de privacidade dos fornecedores.</p>
      </section>

      <section>
        <h2 id="rechte">17. Os seus direitos</h2>
        <p>Tem os seguintes direitos relativamente aos seus dados:</p>
        <ul>
          <li>Acesso (artigo 15.º do RGPD)</li>
          <li>Retificação (artigo 16.º do RGPD)</li>
          <li>Apagamento (artigo 17.º do RGPD)</li>
          <li>Limitação do tratamento (artigo 18.º do RGPD)</li>
          <li>Portabilidade (artigo 20.º do RGPD)</li>
          <li>Retirada do consentimento com efeitos para o futuro (artigo 7.º, n.º 3, do RGPD); o tratamento efetuado até então mantém-se lícito</li>
        </ul>
        <p>
          <strong>Direito de oposição (artigo 21.º do RGPD):</strong> Quando tratamos dados com base
          no artigo 6.º, n.º 1, alínea f), do RGPD, pode opor-se a qualquer momento por motivos
          relacionados com a sua situação particular. Deixamos então de tratar os dados, salvo se
          apresentarmos razões imperiosas e legítimas ou se o tratamento se destinar à declaração,
          exercício ou defesa de um direito num processo judicial. Após uma oposição, nunca mais lhe
          enviaremos publicidade.
        </p>
        <p>Para qualquer pedido basta uma mensagem informal para {c.email}.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Direito de reclamação</h2>
        <p>Pode apresentar reclamação a uma autoridade de controlo (artigo 77.º do RGPD), por exemplo no seu local de residência. A autoridade competente para nós é:</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Segurança, decisões automatizadas, alterações</h2>
        <p>A ligação ao nosso sítio é cifrada por TLS (reconhecível por «https://»). Não tomamos decisões automatizadas nem fazemos definição de perfis na aceção do artigo 22.º do RGPD. Atualizamos esta política quando o sítio ou a lei mudam.</p>
        <p>
          Última atualização: {c.effectiveDate ?? <Missing field="effectiveDate" label="data de entrada em vigor" />}
        </p>
      </section>
    </>
  );
}
