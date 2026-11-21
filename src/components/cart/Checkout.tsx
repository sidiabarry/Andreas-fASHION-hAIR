"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";

import { Arrow } from "@/components/Arrow";
import { useCart } from "@/components/cart/CartProvider";
import { unitText } from "@/components/cart/unitText";
import { Field } from "@/components/forms/Field";
import { Honeypot } from "@/components/forms/Honeypot";
import { deliveryParams, ORDER_COUNTRIES, shippingCents, zoneForCountry } from "@/config/shipping";
import type { Locale } from "@/i18n/locales";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";
import { placeOrder } from "@/server/actions";
import { track } from "@/lib/funnel-client";

export type CheckoutLegal = {
  buyButton: string;
  agbConsent: string;
  withdrawalNote: string;
  privacyNote: string;
  notesTitle: string;
  notes: string[];
  notesLang: string;
  notesPreface: string | null;
  /** Hinweis auf die gesetzliche Gewährleistung (Alt-Text bzw. Text, solange die amtliche Grafik fehlt) */
  warranty: string;
  warrantyImage: { src: string; width: number; height: number } | null;
  links: { agb: string; widerruf: string; datenschutz: string };
};

type Values = { name: string; email: string; phone: string; street: string; postalCode: string; city: string; country: string; note: string };
const EMPTY: Values = { city: "", country: "DE", email: "", name: "", note: "", phone: "", postalCode: "", street: "" };
const REQUIRED: (keyof Values)[] = ["name", "email", "street", "postalCode", "city", "country"];

/** Ersetzt {agb}, {widerruf}, {datenschutz} in Rechtstexten durch Links auf die Rechtsseiten. */
function linked(template: string, links: CheckoutLegal["links"]): ReactNode[] {
  const paths = { agb: "/agb", datenschutz: "/datenschutz", widerruf: "/widerruf" } as const;
  return template.split(/(\{agb\}|\{widerruf\}|\{datenschutz\})/).map((part, index) => {
    const key = part.slice(1, -1) as keyof typeof paths;
    if (part.startsWith("{") && key in paths) {
      return (
        <Link className="af-link" href={paths[key]} key={index} target="_blank">
          {links[key]}
        </Link>
      );
    }
    return part;
  });
}

function validate(values: Values): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of REQUIRED) if (!values[key].trim()) errors[key] = "required";
  if (values.name.trim() && values.name.trim().length < 2) errors.name = "tooShort";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "email";
  if (values.postalCode.trim() && !/^[A-Za-z0-9 -]{3,12}$/.test(values.postalCode.trim())) errors.postalCode = "postalCode";
  if (values.phone.trim() && !/^[+0-9 ()/.-]{5,40}$/.test(values.phone.trim())) errors.phone = "phone";
  if (!ORDER_COUNTRIES.includes(values.country)) errors.country = "country";
  return errors;
}

export function Checkout({ legal, carrier, whatsapp }: { legal: CheckoutLegal; carrier: string; whatsapp: string | null }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const cart = useCart();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [meta, setMeta] = useState<{ key: string; startedAt: number } | null>(() => ({ key: crypto.randomUUID(), startedAt: Date.now() }));
  const summary = useRef<HTMLDivElement>(null);

  useEffect(() => track("checkout_start"), []);

  const countries = useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type: "region" });
    return ORDER_COUNTRIES.map((code) => ({ code, name: names.of(code) ?? code })).sort((a, b) =>
      a.code === "DE" ? -1 : b.code === "DE" ? 1 : a.name.localeCompare(b.name, locale),
    );
  }, [locale]);

  if (!cart.ready) return <p className="af-lead">{t("common.loading")}</p>;
  if (cart.items.length === 0) {
    return (
      <div className="af-empty">
        <p className="af-lead">{t("checkout.emptyCart")}</p>
        <Link className="af-cta-gold af-glass af-glass--gold" href="/kollektion">
          {t("hero.ctaCollection")} <Arrow />
        </Link>
      </div>
    );
  }

  const shipping = shippingCents(values.country, cart.subtotalCents) ?? 0;
  const total = cart.subtotalCents + shipping;
  const zone = zoneForCountry(values.country).id;
  const delivery = deliveryParams();
  const set = (key: keyof Values) => (event: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => Object.fromEntries(Object.entries(current).filter(([k]) => k !== key)));
  };
  const err = (key: string) => (errors[key] ? t(`errors.${errors[key]}`) : null);
  const detailsComplete = Object.keys(validate(values)).length === 0;
  const focusAlert = () => requestAnimationFrame(() => summary.current?.focus());

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setMessage(t("errors.summary", { count: Object.keys(found).length }));
      focusAlert();
      return;
    }
    if (!meta) return;
    const website = String(new FormData(event.currentTarget).get("website") ?? "");
    setMessage(null);
    startTransition(async () => {
      const result = await placeOrder(locale, {
        ...values,
        consents: {},
        idempotencyKey: meta.key,
        items: cart.lines,
        startedAt: meta.startedAt,
        website,
      }).catch(() => null);
      if (!result) {
        setMessage(t("checkout.failed"));
        focusAlert();
        return;
      }
      if (result.ok) {
        track("order_submit");
        cart.clear();
        router.push({ pathname: `/bestellung/${result.id}`, query: { code: result.token } });
        return;
      }
      if (result.error === "sold" && result.soldSlugs) {
        const names = result.soldSlugs.map((slug) => cart.lookup(slug)?.name ?? slug).join(", ");
        result.soldSlugs.forEach((slug) => cart.remove(slug));
        setMessage(t("checkout.unavailable", { names }));
      } else if (result.error === "invalid" && result.fields) {
        setErrors(result.fields);
        setMessage(t("checkout.fixErrors"));
      } else if (result.error === "rate") {
        setMessage(t("checkout.rateLimited"));
      } else if (result.error === "closed") {
        setMessage(t("checkout.closed"));
      } else if (result.error === "country") {
        setErrors({ country: "country" });
        setMessage(t("checkout.fixErrors"));
      } else if (result.error === "bot") {
        setMessage(t("errors.bot"));
        setMeta({ key: meta.key, startedAt: Date.now() - 5000 });
      } else {
        setMessage(t("checkout.failed"));
      }
      focusAlert();
    });
  };

  return (
    <form className="af-checkout" noValidate onSubmit={submit}>
      <ol aria-label={t("checkout.progress")} className="af-steps-nav">
        <li aria-current={!detailsComplete ? "step" : undefined}>1 · {t("checkoutx.progressDetails")}</li>
        <li aria-current={detailsComplete ? "step" : undefined}>2 · {t("checkoutx.progressOrder")}</li>
        <li>3 · {t("checkoutx.progressDone")}</li>
      </ol>
      {message ? (
        <div className="af-msg" data-kind="error" ref={summary} role="alert" tabIndex={-1}>
          {message}
        </div>
      ) : null}
      <Honeypot />
      <div className="af-checkout__grid">
        <div className="af-form">
          <fieldset className="af-fieldset">
            <legend className="af-h3">{t("checkoutx.contactTitle")}</legend>
            <div className="af-form__two">
              <Field error={err("name")} label={t("checkout.name")} name="name" required requiredLabel={t("common.required")}>
                {(p) => <input {...p} className="af-ui-field" autoComplete="name" maxLength={120} onChange={set("name")} value={values.name} />}
              </Field>
              <Field error={err("email")} hint={t("checkout.emailHint")} label={t("checkout.email")} name="email" required requiredLabel={t("common.required")}>
                {(p) => <input {...p} className="af-ui-field" autoComplete="email" inputMode="email" maxLength={160} onChange={set("email")} type="email" value={values.email} />}
              </Field>
            </div>
            <Field error={err("phone")} label={t("checkout.phone")} name="phone" optionalLabel={t("common.optional")}>
              {(p) => <input {...p} className="af-ui-field" autoComplete="tel" inputMode="tel" maxLength={40} onChange={set("phone")} type="tel" value={values.phone} />}
            </Field>
          </fieldset>
          <fieldset className="af-fieldset">
            <legend className="af-h3">{t("checkoutx.addressTitle")}</legend>
            <Field error={err("street")} label={t("checkout.street")} name="street" required requiredLabel={t("common.required")}>
              {(p) => <input {...p} className="af-ui-field" autoComplete="street-address" maxLength={160} onChange={set("street")} value={values.street} />}
            </Field>
            <div className="af-form__two">
              <Field error={err("postalCode")} label={t("checkout.postalCode")} name="postalCode" required requiredLabel={t("common.required")}>
                {(p) => <input {...p} className="af-ui-field" autoComplete="postal-code" maxLength={12} onChange={set("postalCode")} value={values.postalCode} />}
              </Field>
              <Field error={err("city")} label={t("checkout.city")} name="city" required requiredLabel={t("common.required")}>
                {(p) => <input {...p} className="af-ui-field" autoComplete="address-level2" maxLength={120} onChange={set("city")} value={values.city} />}
              </Field>
            </div>
            <Field
              error={err("country")}
              hint={t.rich("checkout.countryHint", { link: (chunks) => <Link className="af-link" href={{ pathname: "/anfrage", query: { thema: "bestellung" } }}>{chunks}</Link> })}
              label={t("checkout.country")}
              name="country"
              required
              requiredLabel={t("common.required")}
            >
              {(p) => (
                <select {...p} className="af-ui-field af-ui-select" autoComplete="country" onChange={set("country")} value={values.country}>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field error={err("note")} hint={t("checkout.noteHint")} label={t("checkout.note")} name="note" optionalLabel={t("common.optional")}>
              {(p) => <textarea {...p} className="af-ui-field" maxLength={800} onChange={set("note")} value={values.note} />}
            </Field>
          </fieldset>
          <aside aria-labelledby="undecided-title" className="af-review">
            <h2 className="af-h3" id="undecided-title">
              {t("checkoutx.undecidedTitle")}
            </h2>
            <p className="af-note">{t("checkoutx.undecided")}</p>
            <div className="af-hero-actions" style={{ marginTop: 0 }}>
              <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { thema: "bestellung" } }}>
                {t("checkoutx.undecidedCta")}
              </Link>
              {whatsapp ? (
                <a className="af-chip" href={whatsapp} rel="noopener noreferrer" target="_blank">
                  {t("product.askWhatsappShort")}
                  <span className="af-sr"> {t("common.newTab")}</span>
                </a>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="af-sum af-checkout__summary">
          <h2 className="af-h3">{t("checkoutx.summaryTitle")}</h2>
          <ul className="af-lines" aria-label={t("checkout.items")}>
            {cart.items.map(({ product, quantity }) => (
              <li className="af-sum__row" key={product.slug}>
                <span>
                  {quantity > 1 ? `${quantity} × ` : ""}
                  {product.name}, {product.subtitle}
                  {product.unit ? <small className="af-note" style={{ display: "block" }}>{unitText(t, product.unit, locale)}</small> : null}
                </span>
                <span>{formatPrice(product.priceCents * quantity, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="af-sum__row">
            <span>{t("cart.shipping")}</span>
            <span>{shipping === 0 ? t("checkout.shippingFree") : formatPrice(shipping, locale)}</span>
          </div>
          <div className="af-sum__row af-sum__total">
            <span>{t("checkout.total")}</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
          <dl className="af-review__dl">
            <dt>{t("checkout.deliveryTime")}</dt>
            <dd>
              {zone === "de" ? t("checkout.deliveryTimeDe", { ...delivery, carrier }) : t("checkout.deliveryTimeEu", { ...delivery, carrier })}{" "}
              {cart.items.some((i) => i.product.category === "maenner" && !i.product.unique) ? t("checkout.deliveryCustom", delivery) : null}
            </dd>
            <dt>{t("checkout.payment")}</dt>
            <dd>{t("checkout.paymentText")}</dd>
          </dl>
          {legal.notes.length ? (
            <section aria-label={legal.notesTitle}>
              <h3 className="af-mono">{legal.notesTitle}</h3>
              {legal.notesPreface ? <p className="af-note">{legal.notesPreface}</p> : null}
              <ul className="af-note" lang={legal.notesLang} style={{ margin: 0, paddingLeft: 20 }}>
                {legal.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {legal.warrantyImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- amtliche Grafik unverändert ausliefern
            <img alt={legal.warranty} className="af-warranty" height={legal.warrantyImage.height} src={legal.warrantyImage.src} width={legal.warrantyImage.width} />
          ) : legal.warranty ? (
            <p className="af-msg" data-kind="info" lang={legal.notesLang}>
              {legal.warranty}
            </p>
          ) : null}
          <fieldset className="af-fieldset">
            <legend className="af-sr">{t("checkout.consentsLegend")}</legend>
            <p className="af-note">{linked(t.raw("checkout.agbNotice") as string, legal.links)}</p>
            <p className="af-note">{linked(legal.withdrawalNote, legal.links)}</p>
            <p className="af-note">{linked(legal.privacyNote, legal.links)}</p>
          </fieldset>
          <button aria-busy={pending} className="af-cta-band af-glass af-glass--gold" data-magnetic disabled={pending || !meta} type="submit">
            {pending ? <span aria-hidden="true" className="af-ui-loading" /> : null}
            {pending ? t("common.sending") : legal.buyButton}
          </button>
        </div>
      </div>
    </form>
  );
}
