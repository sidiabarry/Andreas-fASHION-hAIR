/**
 * WhatsApp-Nachricht an Andrea mit Kontext (Modul 19). Es wird nichts gesendet: der Link öffnet
 * WhatsApp mit vorausgefülltem Text, Absenden macht die Kundin selbst. Die Nachricht geht an Andrea
 * und ist deshalb immer deutsch.
 */
export type WhatsAppContext = {
  name: string;
  subtitle?: string;
  price?: string;
  length?: string | null;
  base?: string | null;
  heightCm?: number | null;
  url?: string;
};

export function whatsappNumber(phoneHref: string): string {
  return phoneHref.replace(/\D/g, "");
}

export function buildAndreaMessage(ctx: WhatsAppContext): string {
  const lines = ["Hallo Andrea, ich interessiere mich für dieses Stück:", `${ctx.name}${ctx.subtitle ? `, ${ctx.subtitle}` : ""}`];
  const facts = [ctx.price, ctx.length ? `Länge ${ctx.length}` : null, ctx.base ? `Basis ${ctx.base}` : null].filter(Boolean);
  if (facts.length) lines.push(facts.join(" · "));
  if (ctx.heightCm) lines.push(`Meine Körpergröße: ${ctx.heightCm} cm`);
  if (ctx.url) lines.push(ctx.url);
  lines.push("Können Sie mir dazu etwas sagen?");
  return lines.join("\n");
}

export function buildAndreaWhatsAppUrl(phoneHref: string, ctx: WhatsAppContext): string {
  return `https://wa.me/${whatsappNumber(phoneHref)}?text=${encodeURIComponent(buildAndreaMessage(ctx))}`;
}
