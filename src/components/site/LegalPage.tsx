import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { legalFor } from "@/content/legal-registry";
import type { LegalPageId } from "@/content/legal-registry";
import { company, missingCompanyFields } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import type { Locale } from "@/i18n/locales";
import { siteMode } from "@/server/mode";

type Props = {
  locale: Locale;
  title: string;
  page: LegalPageId;
  /** Pflichtfelder, die für diese Seite relevant sind */
  fields?: string[];
  children?: ReactNode;
};

/**
 * Rahmen für Rechtstexte. Deutsch ist maßgeblich. Übersetzungen des Rechtsagenten tragen den
 * Hinweis auf die deutsche Fassung selbst; fehlt eine Übersetzung, wird die deutsche Fassung mit
 * Hinweis in der Seitensprache gezeigt.
 */
export async function LegalPage({ locale, title, page, fields = [], children }: Props) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const mode = siteMode();
  const legal = legalFor(locale);
  const Content = legal.pages[page];
  const missing = missingCompanyFields(company).filter((m) => m.blocking && (fields.includes(m.field) || m.legal));
  return (
    <main className="af-page">
      <div className="af-wrap">
        <h1 className="af-h1">{title}</h1>
        {locale !== "de" && !legal.translated ? (
          <p className="af-msg af-legal-note" data-kind="info" style={{ marginTop: 24 }}>
            {t("germanBinding")}
          </p>
        ) : null}
        {mode.demo && missing.length ? (
          <div className="af-devnote" role="note">
            <strong>{t("devTitle")}</strong>
            <p style={{ margin: "6px 0 0" }}>{t("devText")}</p>
            <ul>
              {missing.map((m) => (
                <li key={m.field}>
                  <code>{m.field}</code>: {m.why}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="af-prose" lang={legal.lang} style={{ marginTop: 32 }}>
          <Content company={toLegalCompany()} />
        </div>
        {children}
      </div>
    </main>
  );
}
