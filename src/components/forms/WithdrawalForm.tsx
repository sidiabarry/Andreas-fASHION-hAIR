"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Field } from "@/components/forms/Field";
import { Honeypot } from "@/components/forms/Honeypot";
import { StartedAt } from "@/components/forms/StartedAt";
import { sendWithdrawal } from "@/server/actions";
import type { FormState } from "@/server/actions";

type Values = { name: string; email: string; orderNumber: string; orderDate: string; items: string };

/**
 * Elektronische Widerrufsfunktion (§ 356a BGB): Schritt 1 Angaben (nur Name, Vertragsbezug,
 * E-Mail für die Bestätigung; kein Grund, kein Konto), Schritt 2 „Widerruf bestätigen“.
 */
export function WithdrawalForm({ confirmLabel, initialOrder, ownerEmail, ownerAddress }: { confirmLabel: string; initialOrder: string; ownerEmail: string; ownerAddress: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const [values, setValues] = useState<Values>({ email: "", items: "", name: "", orderDate: "", orderNumber: initialOrder });
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, action, pending] = useActionState<FormState, FormData>(sendWithdrawal, { status: "idle" });
  const focusRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const serverFields = state.status === "error" ? (state.fields ?? {}) : {};
  const allErrors = { ...serverFields, ...errors };
  const err = (key: string) => (allErrors[key] ? t(`errors.${allErrors[key]}`) : null);

  // Bei Feldfehlern vom Server zurück zu Schritt 1 (Zustand beim Rendern anpassen, nicht im Effect)
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.status === "error" && state.fields && Object.keys(state.fields).length) setStep("form");
  }
  useEffect(() => {
    if (state.status === "error") alertRef.current?.focus();
  }, [state]);
  useEffect(() => {
    focusRef.current?.focus();
  }, [step, state.status]);

  if (state.status === "ok" && state.receivedAt) {
    const when = new Date(state.receivedAt);
    const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Berlin" }).format(when);
    const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }).format(when);
    return (
      <div className="af-stack" role="status">
        <h2 className="af-h2" ref={focusRef} tabIndex={-1}>
          {t("withdrawal.doneTitle")}
        </h2>
        <p className="af-lead">{t("withdrawal.doneLead", { date, email: values.email, time })}</p>
        {state.demo ? <p className="af-msg" data-kind="info">{t("withdrawal.doneDemo")}</p> : null}
        {!state.demo && state.mail !== "gesendet" ? <p className="af-msg" data-kind="error">{t("withdrawal.doneMailFailed", { email: ownerEmail })}</p> : null}
        <section className="af-review">
          <p style={{ margin: 0 }}>
            {t("withdrawal.statement")} {values.items || t("withdrawal.wholeOrder")}
          </p>
          <dl>
            <dt>{t("withdrawal.orderNumber")}</dt>
            <dd>{values.orderNumber}</dd>
            {values.orderDate ? (
              <>
                <dt>{t("withdrawal.orderDate")}</dt>
                <dd>{values.orderDate}</dd>
              </>
            ) : null}
            <dt>{t("withdrawal.name")}</dt>
            <dd>{values.name}</dd>
          </dl>
        </section>
        <p className="af-note">{t("withdrawal.doneNote")}</p>
      </div>
    );
  }

  const set = (key: keyof Values) => (event: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const next = (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (values.name.trim().length < 2) found.name = values.name.trim() ? "tooShort" : "required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) found.email = values.email.trim() ? "email" : "required";
    if (!values.orderNumber.trim()) found.orderNumber = "required";
    setErrors(found);
    if (Object.keys(found).length) return;
    setStep("confirm");
  };

  const errorText =
    state.status === "error"
      ? state.error === "unavailable"
        ? t("withdrawal.unavailable", { address: ownerAddress, email: ownerEmail })
        : state.error === "invalid"
          ? t("errors.summary", { count: Object.keys(serverFields).length || 1 })
          : state.error === "rate"
            ? t("checkout.rateLimited")
            : state.error === "bot"
              ? t("errors.bot")
              : t("withdrawal.failed", { email: ownerEmail })
      : null;
  const alert = errorText ? (
    <div className="af-msg" data-kind="error" ref={alertRef} role="alert" tabIndex={-1}>
      {errorText}
    </div>
  ) : null;

  if (step === "confirm") {
    return (
      <form action={action} className="af-form">
        <h2 className="af-h3" ref={focusRef} tabIndex={-1}>
          {t("withdrawal.reviewTitle")}
        </h2>
        {alert}
        <p className="af-note">{t("withdrawal.reviewLead")}</p>
        <section className="af-review">
          <p style={{ margin: 0 }}>
            {t("withdrawal.statement")} {values.items || t("withdrawal.wholeOrder")}
          </p>
          <dl>
            <dt>{t("withdrawal.orderNumber")}</dt>
            <dd>{values.orderNumber}</dd>
            {values.orderDate ? (
              <>
                <dt>{t("withdrawal.orderDate")}</dt>
                <dd>{values.orderDate}</dd>
              </>
            ) : null}
            <dt>{t("withdrawal.name")}</dt>
            <dd>{values.name}</dd>
            <dt>E-Mail</dt>
            <dd>{values.email}</dd>
          </dl>
          <button className="af-cta-line" onClick={() => setStep("form")} style={{ justifySelf: "start" }} type="button">
            {t("common.edit")}
          </button>
        </section>
        {Object.entries(values).map(([key, value]) => (
          <input key={key} name={key} type="hidden" value={value} />
        ))}
        <input name="locale" type="hidden" value={locale} />
        <StartedAt />
        <Honeypot />
        <button aria-busy={pending} className="af-cta-band" disabled={pending} type="submit">
          {pending ? <span aria-hidden="true" className="af-ui-loading" /> : null}
          {pending ? t("common.sending") : confirmLabel}
        </button>
      </form>
    );
  }

  return (
    <form className="af-form" noValidate onSubmit={next}>
      <h2 className="af-sr" ref={focusRef} tabIndex={-1}>
        {t("withdrawal.title")}
      </h2>
      {alert}
      <div className="af-form__two">
        <Field error={err("name")} label={t("withdrawal.name")} name="name" required requiredLabel={t("common.required")}>
          {(p) => <input {...p} className="af-ui-field" autoComplete="name" maxLength={120} onChange={set("name")} value={values.name} />}
        </Field>
        <Field error={err("email")} label={t("withdrawal.email")} name="email" required requiredLabel={t("common.required")}>
          {(p) => <input {...p} className="af-ui-field" autoComplete="email" inputMode="email" maxLength={160} onChange={set("email")} type="email" value={values.email} />}
        </Field>
      </div>
      <div className="af-form__two">
        <Field error={err("orderNumber")} hint={t("withdrawal.orderNumberHint")} label={t("withdrawal.orderNumber")} name="orderNumber" required requiredLabel={t("common.required")}>
          {(p) => <input {...p} className="af-ui-field" maxLength={60} onChange={set("orderNumber")} value={values.orderNumber} />}
        </Field>
        <Field error={err("orderDate")} label={t("withdrawal.orderDate")} name="orderDate" optionalLabel={t("common.optional")}>
          {(p) => <input {...p} className="af-ui-field" maxLength={40} onChange={set("orderDate")} type="date" value={values.orderDate} />}
        </Field>
      </div>
      <Field error={err("items")} hint={t("withdrawal.itemsHint")} label={t("withdrawal.items")} name="items" optionalLabel={t("common.optional")}>
        {(p) => <textarea {...p} className="af-ui-field" maxLength={600} onChange={set("items")} value={values.items} />}
      </Field>
      <button className="af-cta-band" type="submit">
        {t("withdrawal.next")}
      </button>
    </form>
  );
}
