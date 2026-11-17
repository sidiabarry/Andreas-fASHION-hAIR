"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { Field } from "@/components/forms/Field";
import { Honeypot } from "@/components/forms/Honeypot";
import { StartedAt } from "@/components/forms/StartedAt";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";
import { INQUIRY_TOPICS } from "@/lib/validation";
import type { InquiryTopic } from "@/lib/validation";
import { sendInquiry } from "@/server/actions";
import type { FormState } from "@/server/actions";

export function InquiryForm({ topic: initialTopic, product, ownerEmail }: { topic: InquiryTopic; product: string; ownerEmail: string }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const cart = useCart();
  const [topic, setTopic] = useState<InquiryTopic>(initialTopic);
  const [state, action, pending] = useActionState<FormState, FormData>(sendInquiry, { status: "idle" });
  const alertRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const fields = state.status === "error" ? (state.fields ?? {}) : {};
  const err = (key: string) => (fields[key] ? t(`errors.${fields[key]}`) : null);

  useEffect(() => {
    if (state.status === "error") alertRef.current?.focus();
    if (state.status === "ok") doneRef.current?.focus();
  }, [state]);

  if (state.status === "ok") {
    return (
      <div className="af-empty">
        <p className="af-mono">{t("inquiry.doneKicker")}</p>
        <h2 className="af-h2" ref={doneRef} tabIndex={-1}>
          {t("inquiry.doneTitle")}
        </h2>
        <p className="af-lead">{state.demo ? t("inquiry.doneDemo") : t("inquiry.doneLead")}</p>
      </div>
    );
  }

  const selection = topic === "bestellung" && cart.ready ? cart.items : [];
  const errorText =
    state.status === "error"
      ? state.error === "invalid"
        ? t("errors.summary", { count: Object.keys(fields).length || 1 })
        : state.error === "rate"
          ? t("checkout.rateLimited")
          : state.error === "bot"
            ? t("errors.bot")
            : state.error === "unavailable"
              ? t("inquiry.unavailable")
              : t("inquiry.failed", { email: ownerEmail })
      : null;

  return (
    <form action={action} className="af-form" noValidate>
      {errorText ? (
        <div className="af-msg" data-kind="error" ref={alertRef} role="alert" tabIndex={-1}>
          {errorText}
        </div>
      ) : null}
      <input name="locale" type="hidden" value={locale} />
      <StartedAt />
      <input name="product" type="hidden" value={product} />
      <input name="items" type="hidden" value={selection.map((item) => item.product.slug).join(",")} />
      <Honeypot />
      <Field label={t("inquiry.topicLabel")} name="topic" required requiredLabel={t("common.required")}>
        {(p) => (
          <select {...p} onChange={(event) => setTopic(event.target.value as InquiryTopic)} value={topic}>
            {INQUIRY_TOPICS.map((id) => (
              <option key={id} value={id}>
                {t(`inquiry.topics.${id}`)}
              </option>
            ))}
          </select>
        )}
      </Field>
      {selection.length ? (
        <section aria-label={t("inquiry.selection")} className="af-review">
          <h2 className="af-mono">{t("inquiry.selection")}</h2>
          <ul className="af-lines">
            {selection.map(({ product: item, quantity }) => (
              <li className="af-sum__row" key={item.slug}>
                <span>
                  {quantity > 1 ? `${quantity} × ` : ""}
                  {item.name}, {item.subtitle}
                </span>
                <span>{formatPrice(item.priceCents * quantity, locale)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="af-form__two">
        <Field error={err("name")} label={t("inquiry.name")} name="name" required requiredLabel={t("common.required")}>
          {(p) => <input {...p} autoComplete="name" maxLength={120} />}
        </Field>
        <Field error={err("email")} label={t("inquiry.email")} name="email" required requiredLabel={t("common.required")}>
          {(p) => <input {...p} autoComplete="email" inputMode="email" maxLength={160} type="email" />}
        </Field>
      </div>
      <Field error={err("phone")} label={t("inquiry.phone")} name="phone" optionalLabel={t("common.optional")}>
        {(p) => <input {...p} autoComplete="tel" inputMode="tel" maxLength={40} type="tel" />}
      </Field>
      <Field error={err("message")} hint={t("inquiry.healthNote")} label={t("inquiry.message")} name="message" required requiredLabel={t("common.required")}>
        {(p) => <textarea {...p} maxLength={1600} placeholder={t(`inquiry.intro.${topic}.hint`)} />}
      </Field>
      <div className="af-check">
        <input aria-describedby={fields.privacy ? "privacy-error" : undefined} aria-invalid={fields.privacy ? true : undefined} id="privacy" name="privacy" required type="checkbox" />
        <label htmlFor="privacy">
          {t.rich("inquiry.privacy", { link: (chunks) => <Link href="/datenschutz" target="_blank">{chunks}</Link> })}
        </label>
      </div>
      {fields.privacy ? (
        <p className="af-field__error" id="privacy-error">
          {t("errors.privacy")}
        </p>
      ) : null}
      <button aria-busy={pending} className="af-cta-band" disabled={pending} type="submit">
        {pending ? t("common.sending") : t("inquiry.submit")}
      </button>
    </form>
  );
}
