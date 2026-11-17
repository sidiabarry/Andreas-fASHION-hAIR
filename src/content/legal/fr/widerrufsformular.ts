import type { Company } from "../company-type";

/**
 * Modèle de formulaire de rétractation – version française selon l'annexe I, partie B, de la
 * directive 2011/83/UE. Seul le formulaire allemand (Anlage 2 EGBGB) fait foi.
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Modèle de formulaire de rétractation",
  lines: [
    "(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.)",
    "– À l'attention de [nom, adresse et adresse électronique du professionnel à insérer par le professionnel] :",
    "– Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous",
    "– Commandé le (*)/reçu le (*)",
    "– Nom du (des) consommateur(s)",
    "– Adresse du (des) consommateur(s)",
    "– Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier)",
    "– Date",
    "(*) Rayez la mention inutile.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Information manquante : nom de la propriétaire]"}, ${c.brandName}`;
  const to = `– À l'attention de ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, e-mail : ${c.withdrawalEmail} :`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
