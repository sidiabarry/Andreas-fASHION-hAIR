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

/**
 * Kurznachricht an Andréia per Telegram-Bot (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID aus der Umgebung).
 * Zusätzlich zur E-Mail; ohne Konfiguration passiert nichts. Fehler blockieren nie den Ablauf.
 * Telegram begrenzt Nachrichten auf 4096 Zeichen.
 */
export async function sendTelegram(subject: string, text: string): Promise<MailStatus> {
  const token = (process.env.TELEGRAM_BOT_TOKEN || process.env.Telegram_key || "").trim().replace(/^bot/i, "").replace(/^["']|["']$/g, "");
  const chat = (process.env.TELEGRAM_CHAT_ID || process.env.Chat_ID || "").trim().replace(/^["']|["']$/g, "");
  if (!token || !chat) return "nicht_konfiguriert";
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      body: JSON.stringify({ chat_id: chat, disable_web_page_preview: true, text: `${subject}\n\n${text}`.slice(0, 4096) }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      const shape = `Schlüssel: ${token.length} Zeichen, ${/^\d+:[\w-]{30,}$/.test(token) ? "Format ok" : "Format unerwartet"}`;
      console.error(`[telegram] Versand fehlgeschlagen: HTTP ${response.status} (${shape})`);
      return "fehlgeschlagen";
    }
    return "gesendet";
  } catch (error) {
    console.error(`[telegram] Versand fehlgeschlagen: ${error instanceof Error ? error.name : "unbekannt"}`);
    return "fehlgeschlagen";
  }
}
