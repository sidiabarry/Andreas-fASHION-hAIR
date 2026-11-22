import { type Company, euro, deliveryDaysOf, shippingOf } from "../company-type";

/** Traducción española de ../checkout-texts.ts (mismas claves y marcadores). Solo la versión alemana es vinculante. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const eur = (n: number) => euro(n, "es-ES");
  const vatNote =
    smallBusiness === true
      ? "No se factura IVA conforme al artículo 19 de la Ley alemana del IVA (UStG). Todos los precios son precios finales."
      : smallBusiness === false
        ? "Todos los precios son precios finales con el IVA legal incluido."
        : "[Dato pendiente: régimen de IVA]";
  const shipNote =
    `Envío dentro de Alemania ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, gratis a partir de ${eur(freeFromCents)}` : "") +
    (euCents !== null ? `; a la UE ${eur(euCents)}` : "") +
    ". Los gastos de envío están incluidos en el total.";

  return {
    buyButton: "Pedido con obligación de pago",
    consents: {
      agb: "He leído las {agb} y acepto su aplicación.",
      widerruf: "Encontrará información sobre su derecho de desistimiento y sus excepciones (por ejemplo, para piezas a medida) en la {widerruf}.",
      datenschutz: "Puede consultar cómo tratamos sus datos en nuestra {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Sí, pueden comunicar mi correo electrónico a la empresa de transporte para que me informe sobre la entrega. Puedo retirar este consentimiento en cualquier momento.",
      newsletter: "Sí, deseo recibir por correo electrónico el boletín de {brand} con novedades y ofertas. Puedo darme de baja en cualquier momento. Más información en la {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Plazo de entrega: piezas en stock dentro de Alemania ${delivery} días hábiles (pago anticipado/PayPal: desde la recepción del pago); extranjero: se indica antes de la celebración del contrato. Piezas a medida: véase la página del producto.`,
      "Muchas piezas son únicas. Comprobamos personalmente la disponibilidad; el contrato solo se celebra con nuestra confirmación del pedido por correo electrónico. Puede pagar justo después del envío o tras la confirmación del pedido.",
      "Las piezas fabricadas a medida están excluidas del derecho de desistimiento.",
    ],
    confirmationNotice:
      "¡Gracias, {name}! Hemos recibido su pedido {orderNo}. Al enviarlo ha realizado una oferta de compra vinculante. Ahora comprobamos personalmente si su pieza está disponible y le responderemos por correo electrónico en un plazo de tres días hábiles. El contrato de compraventa se celebra en cuanto aceptamos su pedido con nuestra confirmación del pedido. Puede pagar aquí mismo o tras la confirmación; si su pieza no está disponible, le reembolsamos sin demora cualquier pago ya realizado. Le acabamos de enviar un acuse de recibo por correo electrónico.",
    withdrawalButtonLabel: "Desistir del contrato",
    withdrawalConfirmLabel: "Confirmar desistimiento",
    withdrawalFormIntro:
      "Indique su nombre, su número de pedido (u otros datos, por ejemplo fecha del pedido y artículos) y la dirección de correo electrónico para el acuse de recibo. Puede desistir de todo el pedido o de algunos artículos. Compruebe sus datos y haga clic en «Confirmar desistimiento».",
    warrantyLabelAlt: "Garantía legal: mínimo 2 años – información armonizada de la Unión Europea",
    mail: {
      orderReceived: {
        subject: "Acuse de recibo de su pedido {orderNo}",
        body: [
          "Hola, {name}:",
          "",
          "Gracias por su pedido. Este correo solo confirma que lo hemos recibido. Todavía no constituye la aceptación de su oferta.",
          "",
          "Su pedido {orderNo}:",
          "{items}",
          "Total: {total}",
          "Dirección de entrega: {shippingAddress}",
          "",
          "Comprobamos personalmente si su pieza está disponible y le responderemos en un plazo de tres días hábiles. El contrato de compraventa se celebra con nuestra confirmación del pedido. Puede pagar ya por transferencia (datos de pago y código QR en su página de confirmación) o tras nuestra confirmación. Si su pieza no está disponible, le reembolsamos sin demora cualquier pago ya realizado.",
          "",
          "Un cordial saludo",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Confirmación de su pedido {orderNo}",
        body: [
          "Hola, {name}:",
          "",
          "Buenas noticias: su pieza está disponible. Por la presente aceptamos su pedido {orderNo}; el contrato de compraventa queda celebrado.",
          "",
          "{items}",
          "Total: {total}",
          "Dirección de entrega: {shippingAddress}",
          "",
          "Pago: {paymentInstructions}",
          "",
          "Adjuntamos nuestras CG, la información sobre el desistimiento con el modelo de formulario y la información sobre su garantía legal. Durante el plazo de desistimiento también puede desistir en línea mediante «Desistir del contrato» en nuestro sitio: {link}",
          "",
          "Un cordial saludo",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Su pedido {orderNo}: pieza ya no disponible",
        body: [
          "Hola, {name}:",
          "",
          "Lamentablemente, la pieza de su pedido {orderNo} ya no está disponible. Por ello no podemos aceptar su pedido; no se ha celebrado ningún contrato. Si ya ha pagado, le reembolsaremos el importe sin demora por el mismo medio de pago.",
          "",
          "Con gusto le mostramos piezas similares o le fabricamos una a su medida: basta con responder a este correo.",
          "",
          "Un cordial saludo",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Acuse de recibo de su desistimiento",
        body: [
          "Hola, {name}:",
          "",
          "Confirmamos la recepción de su declaración de desistimiento el {receivedDate} a las {receivedTime}.",
          "",
          "Contenido de su declaración:",
          "{withdrawalContent}",
          "",
          "Este correo confirma la recepción de su declaración. Envíe la mercancía a: {brand}, {address}. En cuanto recibamos la mercancía o nos acredite su devolución, le reembolsaremos conforme a nuestra información sobre el desistimiento. Si a algún artículo se le aplica una excepción legal al derecho de desistimiento, se lo comunicaremos por separado.",
          "",
          "Un cordial saludo",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Confirme su suscripción al boletín",
        body: [
          "Hola:",
          "",
          "Alguien –esperamos que usted– ha suscrito esta dirección al boletín de {brand}. Confirme la suscripción haciendo clic en este enlace:",
          "{link}",
          "",
          "Si no se ha suscrito, ignore este correo. Sin confirmación no recibirá ningún boletín y borraremos su dirección a los 30 días.",
          "",
          "Puede darse de baja en cualquier momento mediante el enlace de cada envío o por correo a {email}.",
          "",
          "Un cordial saludo",
          "{brand}",
        ].join("\n"),
      },
    },
    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "¿Pide como salón, peluquería u otra empresa? Nuestra tienda está dirigida a consumidores. Envíenos una consulta y recibirá una oferta individual.",
    healthDataNotice:
      "Por favor, no indique aquí datos sobre su salud (por ejemplo, enfermedades o tratamientos). No los necesitamos para el asesoramiento ni la fabricación.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
