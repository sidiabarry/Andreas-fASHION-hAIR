import { type Company, euro, processingDaysOf, shippingOf } from "../company-type";

/** Tradução portuguesa de ../checkout-texts.ts (mesmas chaves e marcadores). Apenas a versão alemã é vinculativa. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, processing: string) {
  const eur = (n: number) => euro(n, "pt-PT");
  const vatNote =
    smallBusiness === true
      ? "IVA não cobrado nos termos do artigo 19.º da lei alemã do IVA (UStG). Todos os preços são preços finais."
      : smallBusiness === false
        ? "Todos os preços são preços finais com IVA incluído."
        : "[Dado em falta: regime de IVA]";
  const shipNote =
    `Envio na Alemanha ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, grátis a partir de ${eur(freeFromCents)}` : "") +
    (euCents !== null ? `; para a UE ${eur(euCents)}` : "") +
    ". Os portes estão incluídos no total.";

  return {
    buyButton: "Encomenda com obrigação de pagamento",
    consents: {
      agb: "Li os {agb} e aceito a sua aplicação.",
      widerruf: "As informações sobre o seu direito de livre resolução e as exceções (por exemplo, para peças por medida) encontram-se nas {widerruf}.",
      datenschutz: "Saiba como tratamos os seus dados na nossa {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Sim, podem comunicar o meu e-mail à transportadora para que me informe sobre a entrega. Posso retirar este consentimento a qualquer momento.",
      newsletter: "Sim, quero receber por e-mail a newsletter de {brand} com novidades e ofertas. Posso cancelar a qualquer momento. Mais informações na {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Prazo de entrega: entregamos as peças em stock à DHL em ${processing} dias úteis (pagamento antecipado/PayPal: a partir da receção do pagamento), mais o tempo de transporte. Peças por medida: ver página do produto.`,
      "Muitas peças são únicas. Verificamos pessoalmente a disponibilidade; o contrato só é celebrado com a nossa confirmação da encomenda por e-mail. Só paga depois.",
      "As peças feitas por medida estão excluídas do direito de livre resolução.",
    ],
    confirmationNotice:
      "Obrigado, {name}! Recebemos a sua encomenda {orderNo}. Ao enviá-la, fez uma proposta de compra vinculativa. Vamos agora verificar pessoalmente se a sua peça está disponível e responderemos por e-mail no prazo de três dias úteis. O contrato de compra e venda é celebrado quando aceitarmos a sua encomenda com essa confirmação, que inclui também os dados de pagamento. Pague só depois. Acabámos de lhe enviar um aviso de receção por e-mail.",
    withdrawalButtonLabel: "Resolver o contrato",
    withdrawalConfirmLabel: "Confirmar a resolução",
    withdrawalFormIntro:
      "Indique o seu nome, o número da encomenda (ou outros dados, por exemplo data e artigos) e o e-mail para o aviso de receção. Pode resolver a encomenda inteira ou apenas alguns artigos. Verifique os dados e clique em «Confirmar a resolução».",
    warrantyLabelAlt: "Garantia legal: mínimo de 2 anos – aviso harmonizado da União Europeia",
    mail: {
      orderReceived: {
        subject: "Aviso de receção da sua encomenda {orderNo}",
        body: [
          "Olá {name},",
          "",
          "Obrigado pela sua encomenda. Este e-mail apenas confirma que a recebemos. Ainda não constitui aceitação da sua proposta.",
          "",
          "A sua encomenda {orderNo}:",
          "{items}",
          "Total: {total}",
          "Morada de entrega: {shippingAddress}",
          "",
          "Verificamos pessoalmente se a sua peça está disponível e respondemos no prazo de três dias úteis. O contrato é celebrado com a nossa confirmação da encomenda, que inclui também os dados de pagamento. Pague só depois.",
          "",
          "Com os melhores cumprimentos",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Confirmação da sua encomenda {orderNo}",
        body: [
          "Olá {name},",
          "",
          "Boas notícias: a sua peça está disponível. Pela presente aceitamos a sua encomenda {orderNo} – o contrato de compra e venda fica celebrado.",
          "",
          "{items}",
          "Total: {total}",
          "Morada de entrega: {shippingAddress}",
          "",
          "Pagamento: {paymentInstructions}",
          "",
          "Em anexo encontra os nossos TCG, as informações sobre a livre resolução com o modelo de formulário e o aviso sobre a sua garantia legal. Durante o prazo de livre resolução pode também resolver o contrato online através de «Resolver o contrato» no nosso sítio: {link}",
          "",
          "Com os melhores cumprimentos",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "A sua encomenda {orderNo}: peça já não disponível",
        body: [
          "Olá {name},",
          "",
          "Infelizmente, a peça da sua encomenda {orderNo} já não está disponível. Por isso não podemos aceitar a encomenda; não foi celebrado qualquer contrato. Se já pagou, reembolsamos o montante sem demora pelo mesmo meio de pagamento.",
          "",
          "Teremos todo o gosto em mostrar-lhe peças semelhantes ou fazer uma à sua medida – basta responder a este e-mail.",
          "",
          "Com os melhores cumprimentos",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Aviso de receção da sua livre resolução",
        body: [
          "Olá {name},",
          "",
          "Confirmamos a receção da sua declaração de livre resolução em {receivedDate}, às {receivedTime}.",
          "",
          "Conteúdo da sua declaração:",
          "{withdrawalContent}",
          "",
          "Este e-mail confirma a receção da sua declaração. Envie a mercadoria para: {brand}, {address}. Assim que recebermos a mercadoria ou a prova do seu envio, reembolsamos de acordo com as nossas informações sobre a livre resolução. Se a algum artigo se aplicar uma exceção legal ao direito de livre resolução, informá-lo-emos separadamente.",
          "",
          "Com os melhores cumprimentos",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Confirme a sua subscrição da newsletter",
        body: [
          "Olá,",
          "",
          "Alguém – esperamos que tenha sido você – subscreveu a newsletter de {brand} com este e-mail. Confirme a subscrição clicando nesta ligação:",
          "{link}",
          "",
          "Se não se subscreveu, ignore este e-mail. Sem confirmação não receberá a newsletter e eliminaremos o seu endereço após 30 dias.",
          "",
          "Pode cancelar a subscrição a qualquer momento através da ligação em cada envio ou por e-mail para {email}.",
          "",
          "Com os melhores cumprimentos",
          "{brand}",
        ].join("\n"),
      },
    },
    healthDataNotice:
      "Por favor, não indique aqui dados sobre a sua saúde (por exemplo, doenças ou tratamentos). Não precisamos deles para o aconselhamento nem para o fabrico.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, processingDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "3–5");
