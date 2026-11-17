import "server-only";

import type { MailStatus } from "./store";

export type Mail = { to: string; subject: string; text: string; replyTo?: string };

/**
 * Versand über die Resend-HTTP-API (RESEND_API_KEY, MAIL_FROM aus der Umgebung).
 * Ohne Konfiguration wird nichts versendet (Status "nicht_konfiguriert").
 * Es werden nie Empfänger, Inhalte oder Schlüssel geloggt.
 */
export async function sendMail(mail: Mail): Promise<MailStatus> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return "nicht_konfiguriert";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify({
        from,
        reply_to: mail.replyTo,
        subject: mail.subject.slice(0, 200),
        text: mail.text,
        to: [mail.to],
      }),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      method: "POST",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`[mail] Versand fehlgeschlagen: HTTP ${response.status}`);
      return "fehlgeschlagen";
    }
    return "gesendet";
  } catch (error) {
    console.error(`[mail] Versand fehlgeschlagen: ${error instanceof Error ? error.name : "unbekannt"}`);
    return "fehlgeschlagen";
  }
}

export function ownerAddress(): string | null {
  return process.env.MAIL_TO_OWNER || null;
}

/** Ersetzt {platzhalter} in Texten des Rechtsagenten. Unbekannte Platzhalter bleiben sichtbar stehen. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? values[key] : match));
}
