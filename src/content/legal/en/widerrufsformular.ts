import type { Company } from "../company-type";

/**
 * Model withdrawal form – English version following Annex I(B) of Directive 2011/83/EU.
 * Legally binding is the German form (Anlage 2 EGBGB) in ../widerrufsformular.ts.
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Model withdrawal form",
  lines: [
    "(Complete and return this form only if you wish to withdraw from the contract.)",
    "– To [here the trader's name, address and email address are to be inserted by the trader]:",
    "– I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following goods (*)/for the provision of the following service (*)",
    "– Ordered on (*)/received on (*)",
    "– Name of consumer(s)",
    "– Address of consumer(s)",
    "– Signature of consumer(s) (only if this form is notified on paper)",
    "– Date",
    "(*) Delete as appropriate.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Missing: owner's name]"}, ${c.brandName}`;
  const to = `– To ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, email: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
