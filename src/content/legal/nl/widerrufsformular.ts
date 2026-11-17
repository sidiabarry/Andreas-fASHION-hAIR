import type { Company } from "../company-type";

/**
 * Modelformulier voor herroeping – Nederlandse versie volgens bijlage I, deel B, van Richtlijn
 * 2011/83/EU. Alleen het Duitse formulier (Anlage 2 EGBGB) is bindend.
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Modelformulier voor herroeping",
  lines: [
    "(Dit formulier alleen invullen en terugzenden als u de overeenkomst wilt herroepen.)",
    "– Aan [hier dienen de naam, het adres en het e-mailadres van de handelaar door de handelaar te worden ingevuld]:",
    "– Ik/Wij (*) deel/delen (*) u hierbij mede dat ik/wij (*) onze overeenkomst betreffende de verkoop van de volgende goederen (*)/levering van de volgende dienst (*) herroep/herroepen (*)",
    "– Besteld op (*)/ontvangen op (*)",
    "– Naam/namen consument(en)",
    "– Adres consument(en)",
    "– Handtekening van consument(en) (alleen wanneer dit formulier op papier wordt ingediend)",
    "– Datum",
    "(*) Doorhalen wat niet van toepassing is.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Gegeven ontbreekt: naam van de eigenaar]"}, ${c.brandName}`;
  const to = `– Aan ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, e-mail: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
