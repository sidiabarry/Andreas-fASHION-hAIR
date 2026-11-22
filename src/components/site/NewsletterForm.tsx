"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";

import { Honeypot } from "@/components/forms/Honeypot";
import { StartedAt } from "@/components/forms/StartedAt";
import { Link } from "@/i18n/navigation";
import { subscribeNewsletter } from "@/server/actions";
import type { FormState } from "@/server/actions";

/** Nur im Demo-Modus sichtbar: Ohne Datenbank gibt es in Production keine Double-Opt-in-Liste. */
export function NewsletterForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, { status: "idle" });
  const error = state.status === "error";
  return (
    <form action={action} className="af-stack" style={{ "--gap": "12px" } as React.CSSProperties}>
      <p className="af-note">{t("newsletter.lead")}</p>
      <input name="locale" type="hidden" value={locale} />
      <StartedAt />
      <Honeypot />
      <div className="af-news">
        <label className="af-sr" htmlFor="nl-email">
          {t("newsletter.email")}
        </label>
        <input autoComplete="email" className="af-ui-field" id="nl-email" name="email" required type="email" />
        <button aria-busy={pending} disabled={pending} type="submit">
          {pending ? <span aria-hidden="true" className="af-ui-loading" /> : null}
          {t("newsletter.submit")}
        </button>
      </div>
      <div className="af-check">
        <input className="af-ui-check" id="nl-consent" name="consent" required type="checkbox" />
        <label htmlFor="nl-consent">
          {t.rich("newsletter.consent", { link: (chunks) => <Link href="/datenschutz">{chunks}</Link> })}
        </label>
      </div>
      <p aria-live="polite" className="af-note" role="status">
        {state.status === "ok" ? <span className="af-gold">{state.demo ? t("newsletter.okDemo") : t("newsletter.ok")}</span> : null}
        {error ? t("newsletter.error") : null}
      </p>
    </form>
  );
}
