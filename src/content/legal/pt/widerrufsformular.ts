import type { Company } from "../company-type";

/**
 * Modelo de formulário de livre resolução – versão portuguesa segundo o anexo I, parte B, da
 * Diretiva 2011/83/UE. Apenas o formulário alemão (Anlage 2 EGBGB) é vinculativo.
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Modelo de formulário de livre resolução",
  lines: [
    "(Só deve preencher e devolver o presente formulário se quiser resolver o contrato.)",
    "– Para [inserir aqui o nome, o endereço e o endereço de correio eletrónico do profissional]:",
    "– Pela presente comunico/comunicamos (*) que resolvo/resolvemos (*) do meu/nosso (*) contrato de venda do seguinte bem (*)/para a prestação do seguinte serviço (*)",
    "– Solicitado em (*)/recebido em (*)",
    "– Nome do(s) consumidor(es)",
    "– Endereço do(s) consumidor(es)",
    "– Assinatura do(s) consumidor(es) (só no caso de o presente formulário ser notificado em papel)",
    "– Data",
    "(*) Riscar o que não interessa.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Dado em falta: nome da titular]"}, ${c.brandName}`;
  const to = `– Para ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, e-mail: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
