import { getTranslations } from "next-intl/server";

import { company } from "@/config/company";

/** Direkte Kontaktwege (Telefon, E-Mail, WhatsApp) – immer verfügbar, auch ohne Formular. */
export async function ContactLinks() {
  const t = await getTranslations("contact");
  return (
    <ul className="af-contact-links">
      <li>
        <span className="af-mono">{t("phone")}</span>
        <a className="af-link" href={`tel:${company.phoneHref}`}>
          {company.phone}
        </a>
      </li>
      <li>
        <span className="af-mono">{t("email")}</span>
        <a className="af-link" href={`mailto:${company.email}`}>
          {company.email}
        </a>
      </li>
      {company.social.whatsapp ? (
        <li>
          <span className="af-mono">WhatsApp</span>
          <a className="af-link" href={company.social.whatsapp} rel="noopener noreferrer" target="_blank">
            {t("whatsapp")}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
