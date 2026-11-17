import { getTranslations } from "next-intl/server";
import type { ComponentType, ReactNode } from "react";

import type { Company as LegalCompany } from "@legal/company-type";

import { company, missingCompanyFields } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import type { Locale } from "@/i18n/locales";
import { siteMode } from "@/server/mode";

type Props = {
  locale: Locale;
  title: string;
  Content: ComponentType<{ company: LegalCompany }>;
  stub: boolean;
  /** Pflichtfelder, die für diese Seite relevant sind */
  fields?: string[];
  children?: ReactNode;
};

/** Rahmen für Rechtstexte. Deutsch ist maßgeblich; andere Sprachen zeigen die deutsche Fassung mit Hinweis. */
export async function LegalPage({ locale, title, Content, stub, fields = [], children }: Props) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const mode = siteMode();
  const missing = missingCompanyFields(company).filter((m) => m.blocking && fields.includes(m.field));
  return (
    <main className="af-page">
      <div className="af-wrap">
        <h1 className="af-h1">{title}</h1>
        {locale !== "de" ? (
          <p className="af-msg af-legal-note" data-kind="info" style={{ marginTop: 24 }}>
            {t("germanBinding")}
          </p>
        ) : null}
        {mode.demo && (stub || missing.length) ? (
          <div className="af-devnote" role="note">
            <strong>{t("devTitle")}</strong>
            {stub ? <p style={{ margin: 0 }}>{t("devPending")}</p> : null}
            {missing.length ? (
              <>
                <p style={{ margin: "6px 0 0" }}>{t("devText")}</p>
                <ul>
                  {missing.map((m) => (
                    <li key={m.field}>
                      <code>{m.field}</code>: {m.why}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        ) : null}
        <div className="af-prose" lang="de" style={{ marginTop: 32 }}>
          {stub && !mode.demo ? <p>{t("pendingPublic", { email: company.email, phone: company.phone })}</p> : <Content company={toLegalCompany()} />}
        </div>
        {children}
      </div>
    </main>
  );
}
