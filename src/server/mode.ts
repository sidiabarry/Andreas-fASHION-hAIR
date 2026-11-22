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
};

export function siteMode(): SiteMode {
  const vercelEnv = process.env.VERCEL_ENV;
  const production =
    vercelEnv === "production" || (vercelEnv === undefined && process.env.NODE_ENV === "production" && process.env.AFH_DEMO !== "1");
  const mail = Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.MAIL_TO_OWNER);
  const database = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const closed = process.env.CHECKOUT_CLOSED === "1";
  return { checkoutOpen: !closed && (!production || (database && mail)), demo: !production, mail, production };
}
