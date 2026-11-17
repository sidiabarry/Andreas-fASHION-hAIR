import "server-only";

/**
 * Betriebsart der Website.
 * - Production (Vercel `VERCEL_ENV=production` oder `next start` ohne AFH_DEMO=1): Online-Kasse geschlossen,
 *   Bestellung nur per Anfrage. Anfragen/Widerrufe gehen per E-Mail (Resend), sonst wird das Formular
 *   gar nicht erst angeboten – nie stiller Datenverlust.
 * - Demo (Entwicklung, Vercel-Vorschau, AFH_DEMO=1): kompletter Kaufablauf mit In-Memory-Store,
 *   sichtbarer Demo-Hinweis, keine echten Daten.
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
  return { checkoutOpen: !production, demo: !production, mail, production };
}
