import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { company } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import { legalFor } from "@/content/legal-registry";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { siteMode } from "@/server/mode";

const METHODS = ["butterfly", "genius", "invisible", "tape", "keratin", "clip"] as const;

/** Extensions: noch ohne Produkte und Preise – Methoden erklären, dann anfragen. */
export async function ExtensionsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const mode = siteMode();
  return (
    <div className="af-ext">
      <section aria-labelledby="methods-title">
        <h2 className="af-h3" id="methods-title">
          {t("extensions.methodsTitle")}
        </h2>
        <dl className="af-ext__methods">
          {METHODS.map((m) => (
            <div key={m}>
              <dt>{t(`extensions.${m}`)}</dt>
              <dd>{t(`extensions.${m}Text`)}</dd>
            </div>
          ))}
        </dl>
        <p className="af-note">{t("extensions.which")}</p>
        <div className="af-review" style={{ marginTop: 28 }}>
          <h3 className="af-h3">{t("extensions.salonTitle")}</h3>
          <p className="af-text">{t("extensions.salonText")}</p>
          <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "salon" } }} style={{ justifySelf: "start" }}>
            {t("extensions.salonCta")} <Arrow />
          </Link>
        </div>
      </section>
      <section aria-labelledby="ext-form-title">
        <h2 className="af-h3" id="ext-form-title">
          {t("extensions.formTitle")}
        </h2>
        {mode.demo || mode.mail ? (
          <InquiryForm b2bNotice={legalFor(locale).checkoutTextsFor(toLegalCompany()).b2bNotice} fixedTopic ownerEmail={company.email} product="" topic="extensions" />
        ) : (
          <div className="af-msg" data-kind="info" role="status">
            <p>{t("inquiry.unavailable")}</p>
            <p>
              <a className="af-link" href={`tel:${company.phoneHref}`}>
                {company.phone}
              </a>{" "}
              ·{" "}
              <a className="af-link" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
