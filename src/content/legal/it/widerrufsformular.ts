import type { Company } from "../company-type";

/**
 * Modulo di recesso tipo – versione italiana secondo l'allegato I, parte B, della direttiva
 * 2011/83/UE. Fa fede solo il modulo tedesco (Anlage 2 EGBGB).
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Modulo di recesso tipo",
  lines: [
    "(Compilare e restituire il presente modulo solo se si desidera recedere dal contratto.)",
    "– Destinatario [nome, indirizzo e indirizzo e-mail del professionista, da inserire a cura del professionista]:",
    "– Con la presente io/noi (*) notifichiamo il recesso dal mio/nostro (*) contratto di vendita dei seguenti beni (*)/di prestazione del seguente servizio (*)",
    "– Ordinato il (*)/ricevuto il (*)",
    "– Nome del/dei consumatore(i)",
    "– Indirizzo del/dei consumatore(i)",
    "– Firma del/dei consumatore(i) (solo se il presente modulo è notificato in versione cartacea)",
    "– Data",
    "(*) Cancellare la dicitura inutile.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Dato mancante: nome della titolare]"}, ${c.brandName}`;
  const to = `– Destinatario: ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, e-mail: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
