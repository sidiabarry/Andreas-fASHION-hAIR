import "server-only";

import type { MailStatus } from "./store";

export type Mail = { to: string; subject: string; text: string; replyTo?: string };

/** Gmail (kostenlos, ohne eigene Domain): Absender ist das Gmail-Konto, Anmeldung per App-Passwort. */
function gmailConfig(): { user: string; pass: string } | null {
  const user = (process.env.GMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  return user && pass ? { pass, user } : null;
}

/** Ist ein Versandweg eingerichtet (Gmail oder Resend mit Absender)? Empfängerin der Shop-Mails inklusive. */
export function mailConfigured(): boolean {
  const resend = Boolean((process.env.RESEND_API_KEY || process.env.Resend_Key) && process.env.MAIL_FROM);
  return Boolean((gmailConfig() || resend) && ownerAddress());
}

/**
 * Versand bevorzugt über Gmail (GMAIL_USER, GMAIL_APP_PASSWORD), sonst über die Resend-HTTP-API (RESEND_API_KEY, MAIL_FROM).
 * Ohne Konfiguration wird nichts versendet (Status "nicht_konfiguriert").
 * Es werden nie Empfänger, Inhalte oder Schlüssel geloggt.
 */
export async function sendMail(mail: Mail): Promise<MailStatus> {
  const gmail = gmailConfig();
  if (gmail) {
    try {
      const { createTransport } = await import("nodemailer");
      const transport = createTransport({ auth: gmail, connectionTimeout: 10_000, host: "smtp.gmail.com", port: 465, secure: true, socketTimeout: 15_000 });
      await transport.sendMail({
        from: { address: gmail.user, name: process.env.MAIL_FROM_NAME || "Andréia's Fashion Hair" },
        replyTo: mail.replyTo,
        subject: mail.subject.slice(0, 200),
        text: mail.text,
        to: mail.to,
      });
      return "gesendet";
    } catch (error) {
      console.error(`[mail] Gmail-Versand fehlgeschlagen: ${error instanceof Error ? `${error.name} ${(error as { code?: string }).code ?? ""}` : "unbekannt"}`);
      return "fehlgeschlagen";
    }
  }
  const key = (process.env.RESEND_API_KEY || process.env.Resend_Key || "").trim();
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
  return process.env.MAIL_TO_OWNER || (process.env.GMAIL_USER || "").trim() || null;
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
/** Letzter Telegram-Fehler (ohne Schlüssel), nur für den Verbindungstest. */
export let lastTelegramError = "";

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
      const detail = await response.json().then((j: { description?: string }) => j.description ?? "").catch(() => "");
      lastTelegramError = `HTTP ${response.status} ${detail} (${shape}, Chat-ID ${chat.length} Zeichen)`;
      console.error(`[telegram] Versand fehlgeschlagen: ${lastTelegramError}`);
      return "fehlgeschlagen";
    }
    return "gesendet";
  } catch (error) {
    console.error(`[telegram] Versand fehlgeschlagen: ${error instanceof Error ? error.name : "unbekannt"}`);
    return "fehlgeschlagen";
  }
}
