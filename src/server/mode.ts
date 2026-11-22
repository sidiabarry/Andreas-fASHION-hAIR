import "server-only";

/**
 * Betriebsart der Website.
 * - Production (Vercel `VERCEL_ENV=production` oder `next start` ohne AFH_DEMO=1): Online-Kasse offen, sobald
 *   Datenbank (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) und E-Mail (Resend) eingerichtet sind; sonst Bestellung
 *   per Anfrage. Anfragen/Widerrufe gehen per E-Mail, sonst wird das Formular nicht angeboten – nie stiller Datenverlust.
 * - Demo (Entwicklung, Vercel-Vorschau, AFH_DEMO=1): kompletter Kaufablauf mit In-Memory-Store,
 *   sichtbarer Demo-Hinweis, keine echten Daten.
 * - Notbremse: CHECKOUT_CLOSED=1 schließt nur die Online-Kasse (Bestellung dann per Anfrage). Datenbank, E-Mail,
 *   Formulare und die Anzeige „vergeben“ bleiben davon unberührt.
 */
export type SiteMode = {
  production: boolean;
  demo: boolean;
  checkoutOpen: boolean;
  mail: boolean;
  /** Anfrageformular nutzbar: E-Mail oder Telegram an die Inhaberin eingerichtet. */
  inquiry: boolean;
};

export function siteMode(): SiteMode {
  const vercelEnv = process.env.VERCEL_ENV;
  const production =
    vercelEnv === "production" || (vercelEnv === undefined && process.env.NODE_ENV === "production" && process.env.AFH_DEMO !== "1");
  // Versandweg: Gmail (GMAIL_USER + GMAIL_APP_PASSWORD) oder Resend (Schlüssel + MAIL_FROM); Empfängerin MAIL_TO_OWNER oder das Gmail-Konto
  const gmail = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  const resend = Boolean((process.env.RESEND_API_KEY || process.env.Resend_Key) && process.env.MAIL_FROM);
  const mail = (gmail || resend) && Boolean(process.env.MAIL_TO_OWNER || process.env.GMAIL_USER);
  const telegram = Boolean((process.env.TELEGRAM_BOT_TOKEN || process.env.Telegram_key) && (process.env.TELEGRAM_CHAT_ID || process.env.Chat_ID));
  const database = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const closed = process.env.CHECKOUT_CLOSED === "1";
  return { checkoutOpen: !closed && (!production || (database && mail)), demo: !production, inquiry: mail || telegram, mail, production };
}
