import type { Company } from "../company-type";

/**
 * Modelo de formulario de desistimiento – versión española según el anexo I, parte B, de la
 * Directiva 2011/83/UE. Solo el formulario alemán (Anlage 2 EGBGB) es vinculante.
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Modelo de formulario de desistimiento",
  lines: [
    "(Solo debe cumplimentar y enviar el presente formulario si desea desistir del contrato.)",
    "– A la atención de [aquí el empresario deberá insertar su nombre, dirección y dirección de correo electrónico]:",
    "– Por la presente le comunico/comunicamos (*) que desisto de mi/desistimos de nuestro (*) contrato de venta del siguiente bien (*)/de prestación del siguiente servicio (*)",
    "– Pedido el (*)/recibido el (*)",
    "– Nombre del consumidor o de los consumidores",
    "– Domicilio del consumidor o de los consumidores",
    "– Firma del consumidor o de los consumidores (solo si el presente formulario se presenta en papel)",
    "– Fecha",
    "(*) Táchese lo que no proceda.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Dato pendiente: nombre de la titular]"}, ${c.brandName}`;
  const to = `– A la atención de ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, correo electrónico: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
