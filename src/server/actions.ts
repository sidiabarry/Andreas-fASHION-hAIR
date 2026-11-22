"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

import { company } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import { germanLegal, legalFor } from "@/content/legal-registry";
import { getProduct, productText } from "@/data/catalog";
import { isLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";
import { formatPrice } from "@/lib/money";
import { appendVideoRequest } from "@/lib/video-note";
import { formatIban } from "@/lib/payment";
import { priceOrder } from "@/lib/order";
import {
  checkoutSchema,
  fieldErrors,
  inquirySchema,
  isTooFast,
  newsletterSchema,
  withdrawalSchema,
} from "@/lib/validation";

import { fillTemplate, ownerAddress, sendMail } from "./mail";
import { siteMode } from "./mode";
import { clientIp, hashIp, hashToken, newOrderId, newToken } from "./security";
import type { MailStatus } from "./store";
import { store as getStore } from "./db";

const WINDOW = 10 * 60 * 1000;

async function requestInfo() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  const origin = /^[a-z0-9.:-]+$/i.test(host) ? `${proto}://${host}` : company.siteUrl;
  return { ipHash: hashIp(clientIp(h)), origin };
}

async function allowed(scope: string, ipHash: string, limit = 5): Promise<boolean> {
  return getStore().hit(`${scope}:${ipHash}`, limit, WINDOW);
}

const safeLocale = (value: unknown): Locale => (isLocale(value) ? value : "de");

function berlinDateTime(date: Date, locale: Locale) {
  const tag = locale === "de" ? "de-DE" : locale;
  return {
    date: new Intl.DateTimeFormat(tag, { dateStyle: "long", timeZone: "Europe/Berlin" }).format(date),
    time: new Intl.DateTimeFormat(tag, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }).format(date),
  };
}

const addressLine = () =>
  `${company.brandName}, ${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`;

/* ------------------------------------------------------------------ Bestellung */

export type PlaceOrderResponse =
  | { ok: true; id: string; token: string; mail: MailStatus }
  | {
      ok: false;
      error: "closed" | "invalid" | "sold" | "rate" | "bot" | "country" | "failed";
      fields?: Record<string, string>;
      soldSlugs?: string[];
    };

export async function placeOrder(rawLocale: string, raw: unknown): Promise<PlaceOrderResponse> {
  const locale = safeLocale(rawLocale);
  const mode = siteMode();
  if (!mode.checkoutOpen) return { error: "closed", ok: false };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.website || fields.startedAt) return { error: "bot", ok: false };
    return { error: "invalid", fields, ok: false };
  }
  const input = parsed.data;
  if (input.website || isTooFast(input.startedAt)) return { error: "bot", ok: false };

  const texts = germanLegal.checkoutTextsFor(toLegalCompany());
  const localLegal = legalFor(locale);
  const localTexts = localLegal.translated ? localLegal.checkoutTextsFor(toLegalCompany()) : null;
  // AGB: Einbeziehung durch deutlichen Hinweis direkt über dem Bestellknopf (§ 305 Abs. 2 BGB); kein Pflicht-Häkchen,
  // damit der Kauf keinen unnötigen Schritt hat.

  const { ipHash, origin } = await requestInfo();
  if (!(await allowed("order", ipHash))) return { error: "rate", ok: false };

  const store = getStore();
  const taken = await store.soldSlugs().catch(() => null);
  if (!taken) return { error: "failed", ok: false };
  const priced = priceOrder(input.items, input.country, taken);
  if (!priced.ok) {
    if (priced.error.code === "sold") return { error: "sold", ok: false, soldSlugs: priced.error.slugs };
    if (priced.error.code === "country") return { error: "country", fields: { country: "country" }, ok: false };
    return { error: "invalid", ok: false };
  }

  const token = newToken();
  const result = await store
    .placeOrder({
    customer: {
      city: input.city,
      country: input.country,
      email: input.email,
      name: input.name,
      note: input.note,
      phone: input.phone,
      postalCode: input.postalCode,
      street: input.street,
    },
    id: newOrderId(),
    idempotencyKey: input.idempotencyKey,
    lines: priced.order.lines,
    locale,
    shippingCents: priced.order.shippingCents,
    subtotalCents: priced.order.subtotalCents,
    tokenHash: hashToken(token),
    totalCents: priced.order.totalCents,
    })
    .catch(() => null);
  if (!result) return { error: "failed", ok: false };
  if (!result.ok) return { error: "sold", ok: false, soldSlugs: result.slugs };
  if (result.duplicate) {
    // Doppelte Absendung: Der ursprüngliche Zugriffsschlüssel ist nur dem ersten Aufruf bekannt.
    return { error: "failed", ok: false };
  }

  const order = result.order;
  const t = await getTranslations({ locale, namespace: "mail" });
  const lineText = (l: (typeof order.lines)[number]) => {
    const product = getProduct(l.slug);
    const name = product ? (({ name: n, subtitle }) => `${n}, ${subtitle}`)(productText(product, locale)) : l.name;
    return `- ${l.quantity} x ${name}: ${formatPrice(l.totalCents, locale)}`;
  };
  const items = order.lines.map(lineText).join("\n");
  const address = `${order.customer.name}, ${order.customer.street}, ${order.customer.postalCode} ${order.customer.city}, ${order.customer.country}`;
  const link = `${origin}/${locale}/bestellung/${order.id}?code=${token}`;
  const withdrawLink = `${origin}/${locale}/widerruf/erklaeren?bestellung=${order.id}`;
  const when = berlinDateTime(new Date(order.createdAt), locale);
  const values = {
    address: addressLine(),
    brand: company.brandName,
    email: company.email,
    items,
    link,
    name: order.customer.name,
    orderNo: order.id,
    phone: company.phone,
    shippingAddress: address,
    total: formatPrice(order.totalCents, locale),
  };
  const german = fillTemplate(texts.mail.orderReceived.body, values);
  const localized =
    locale === "de"
      ? ""
      : localTexts
        ? `${fillTemplate(localTexts.mail.orderReceived.body, { ...values, total: formatPrice(order.totalCents, locale) })}\n\n—— Deutsche Fassung (rechtsverbindlich) ——\n\n`
        : [
          t("greeting", { name: order.customer.name }),
          "",
          t("orderIntro", when),
          "",
          t("orderItems"),
          items,
          t("orderShipping", { amount: formatPrice(order.shippingCents, locale) }),
          t("orderTotal", { amount: formatPrice(order.totalCents, locale) }),
          "",
          t("orderLink", { url: link }),
          t("orderWithdraw", { url: withdrawLink }),
          "",
          "—— Deutsche Fassung (rechtsverbindlich) ——",
          "",
        ].join("\n");

  // Zahlungsangaben direkt in die Eingangsbestätigung: gleich bezahlen oder nach Andreas Bestätigung
  const tp = await getTranslations({ locale, namespace: "pay" });
  const payBlock = company.bank
    ? [
        tp("mailTitle"),
        `${tp("holder")}: ${company.bank.holder}`,
        `${tp("iban")}: ${formatIban(company.bank.iban)}`,
        `${tp("amount")}: ${formatPrice(order.totalCents, locale)}`,
        `${tp("reference")}: ${order.id}`,
        tp("mailQr", { url: link }),
      ].join("\n")
    : "";
  let mailCustomer: MailStatus = "nicht_konfiguriert";
  let mailOwner: MailStatus = "nicht_konfiguriert";
  if (mode.mail) {
    mailCustomer = await sendMail({
      replyTo: company.email,
      subject: fillTemplate(texts.mail.orderReceived.subject, values),
      text: `${localized}${german}\n\n${payBlock}\n\n${t("orderLink", { url: link })}\n${t("orderWithdraw", { url: withdrawLink })}`,
      to: order.customer.email,
    });
    const owner = ownerAddress();
    if (owner) {
      mailOwner = await sendMail({
        replyTo: order.customer.email,
        subject: `Neue Bestellung ${order.id}${mode.demo ? " (DEMO)" : ""}`,
        text: [
          `Bestellung ${order.id} vom ${berlinDateTime(new Date(order.createdAt), "de").date}, ${berlinDateTime(new Date(order.createdAt), "de").time} Uhr`,
          `Sprache: ${locale}`,
          "",
          order.lines.map((l) => `- ${l.quantity} x ${l.name} (${l.slug}): ${formatPrice(l.totalCents)}`).join("\n"),
          `Versand: ${formatPrice(order.shippingCents)}`,
          `Gesamt: ${formatPrice(order.totalCents)}`,
          "",
          `Kundin: ${order.customer.name}`,
          `E-Mail: ${order.customer.email}`,
          `Telefon: ${order.customer.phone || "–"}`,
          `Adresse: ${address}`,
          `Nachricht: ${order.customer.note || "–"}`,
          "",
          "Bitte Verfügbarkeit prüfen und per Auftragsbestätigung annehmen oder ablehnen.",
        ].join("\n"),
        to: owner,
      });
    }
  }
  await store.setOrderMail(order.id, { customer: mailCustomer, owner: mailOwner });
  return { id: order.id, mail: mailCustomer, ok: true, token };
}

/* ------------------------------------------------------------------ Anfrage */

export type FormState =
  | { status: "idle" }
  | { status: "ok"; demo: boolean; receivedAt?: string; mail?: MailStatus }
  | { status: "error"; error: "invalid" | "rate" | "bot" | "failed" | "unavailable"; fields?: Record<string, string> };

const formValue = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value : undefined;
};

export async function sendInquiry(_prev: FormState, data: FormData): Promise<FormState> {
  const mode = siteMode();
  if (mode.production && !mode.mail) return { error: "unavailable", status: "error" };
  const locale = safeLocale(formValue(data, "locale"));
  const parsed = inquirySchema.safeParse({
    email: formValue(data, "email"),
    message: formValue(data, "message"),
    name: formValue(data, "name"),
    phone: formValue(data, "phone"),
    amount: formValue(data, "amount"),
    color: formValue(data, "color"),
    company: formValue(data, "company"),
    country: formValue(data, "country"),
    length: formValue(data, "length"),
    method: formValue(data, "method"),
    privacy: data.get("privacy") === "on",
    product: formValue(data, "product"),
    startedAt: formValue(data, "startedAt"),
    topic: formValue(data, "topic"),
    website: formValue(data, "website"),
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.website || fields.startedAt) return { error: "bot", status: "error" };
    return { error: "invalid", fields, status: "error" };
  }
  const input = parsed.data;
  if (data.get("video") === "on" && input.topic === "bestellung") input.message = appendVideoRequest(input.message, 1700);
  if (isTooFast(input.startedAt)) return { error: "bot", status: "error" };
  const { ipHash } = await requestInfo();
  if (!(await allowed("inquiry", ipHash))) return { error: "rate", status: "error" };

  // Auswahl aus dem Warenkorb (Bestellanfrage): Preise aus dem Katalog, nie aus dem Browser
  const selection = String(formValue(data, "items") ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => /^[a-z0-9-]{1,160}$/.test(slug))
    .slice(0, 20)
    .map((slug) => getProduct(slug))
    .filter((product) => product !== undefined)
    .map((product) => `- ${product.name}, ${product.subtitle} (${product.slug}): ${formatPrice(product.priceCents)}`);

  const now = new Date();
  // Demo: im Speicher; Livebetrieb mit Datenbank: dauerhaft (Fehler dort blockieren den Mailversand nie)
  if (mode.demo || getStore().kind === "supabase") {
    await getStore().saveInquiry({
      createdAt: now.toISOString(),
      email: input.email,
      id: newOrderId("AN"),
      message: input.message,
      name: input.name,
      phone: input.phone,
      product: input.product,
      topic: input.topic,
    }).catch(() => undefined);
  }
  const owner = ownerAddress();
  if (mode.mail && owner) {
    const status = await sendMail({
      replyTo: input.email,
      subject: `Neue Anfrage: ${input.topic}${mode.demo ? " (DEMO)" : ""}`,
      text: [
        `Thema: ${input.topic}`,
        `Sprache: ${locale}`,
        input.product ? `Stück: ${input.product}` : "",
        input.company ? `Salon/Firma: ${input.company}` : "",
        input.country ? `Lieferland: ${input.country}` : "",
        input.method ? `Methode: ${input.method}` : "",
        input.length ? `Wunschlänge: ${input.length}` : "",
        input.color ? `Haarfarbe: ${input.color}` : "",
        input.amount ? `Menge: ${input.amount}` : "",
        selection.length ? `Auswahl:\n${selection.join("\n")}` : "",
        "",
        `Name: ${input.name}`,
        `E-Mail: ${input.email}`,
        `Telefon/WhatsApp: ${input.phone || "–"}`,
        "",
        input.message,
      ]
        .filter((line) => line !== "")
        .join("\n"),
      to: owner,
    });
    if (status !== "gesendet" && !mode.demo) return { error: "failed", status: "error" };
  }
  return { demo: mode.demo, status: "ok" };
}

/* ------------------------------------------------------------------ Widerruf (§ 356a BGB) */

export async function sendWithdrawal(_prev: FormState, data: FormData): Promise<FormState> {
  const mode = siteMode();
  if (mode.production && !mode.mail) return { error: "unavailable", status: "error" };
  const locale = safeLocale(formValue(data, "locale"));
  const parsed = withdrawalSchema.safeParse({
    email: formValue(data, "email"),
    items: formValue(data, "items"),
    name: formValue(data, "name"),
    orderDate: formValue(data, "orderDate"),
    orderNumber: formValue(data, "orderNumber"),
    startedAt: formValue(data, "startedAt"),
    website: formValue(data, "website"),
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.website || fields.startedAt) return { error: "bot", status: "error" };
    return { error: "invalid", fields, status: "error" };
  }
  const input = parsed.data;
  const { ipHash } = await requestInfo();
  if (!(await allowed("withdrawal", ipHash))) return { error: "rate", status: "error" };

  const receivedAt = new Date();
  const de = berlinDateTime(receivedAt, "de");
  const texts = germanLegal.checkoutTextsFor(toLegalCompany());
  const localLegal = legalFor(locale);
  const localTexts = localLegal.translated ? localLegal.checkoutTextsFor(toLegalCompany()) : null;
  const t = await getTranslations({ locale, namespace: "withdrawal" });
  const content = [
    `${t("statement")} ${input.items || t("wholeOrder")}`,
    `${t("orderNumber")}: ${input.orderNumber}`,
    input.orderDate ? `${t("orderDate")}: ${input.orderDate}` : "",
    `${t("name")}: ${input.name}`,
    `E-Mail: ${input.email}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (mode.demo || getStore().kind === "supabase") {
    await getStore().saveWithdrawal({
      email: input.email,
      id: newOrderId("WI"),
      items: input.items,
      name: input.name,
      orderDate: input.orderDate,
      orderNumber: input.orderNumber,
      receivedAt: receivedAt.toISOString(),
    }).catch(() => undefined);
  }

  let mail: MailStatus = "nicht_konfiguriert";
  if (mode.mail) {
    const values = {
      address: addressLine(),
      brand: company.brandName,
      email: company.email,
      name: input.name,
      phone: company.phone,
      receivedDate: de.date,
      receivedTime: de.time,
      withdrawalContent: content,
    };
    const tm = await getTranslations({ locale, namespace: "mail" });
    const local = berlinDateTime(receivedAt, locale);
    const localized =
      locale === "de"
        ? ""
        : localTexts
          ? `${fillTemplate(localTexts.mail.withdrawalReceived.body, { ...values, receivedDate: local.date, receivedTime: local.time })}\n\n—— Deutsche Fassung (rechtsverbindlich) ——\n\n`
          : [tm("greeting", { name: input.name }), "", tm("withdrawalIntro", local), "", content, "", tm("withdrawalOutro"), "", "—— Deutsche Fassung (rechtsverbindlich) ——", "", ""].join("\n");
    mail = await sendMail({
      replyTo: company.email,
      subject: fillTemplate(texts.mail.withdrawalReceived.subject, values),
      text: localized + fillTemplate(texts.mail.withdrawalReceived.body, values),
      to: input.email,
    });
    const owner = ownerAddress();
    if (owner) {
      const ownerStatus = await sendMail({
        replyTo: input.email,
        subject: `Widerruf eingegangen: ${input.orderNumber}${mode.demo ? " (DEMO)" : ""}`,
        text: `Eingang: ${de.date}, ${de.time} Uhr\nSprache: ${locale}\n\n${content}`,
        to: owner,
      });
      // In Production muss die Erklärung Andrea sicher erreichen, sonst Fehler anzeigen (kein stiller Verlust).
      if (ownerStatus !== "gesendet" && !mode.demo) return { error: "failed", status: "error" };
    } else if (!mode.demo) {
      return { error: "unavailable", status: "error" };
    }
  }
  return { demo: mode.demo, mail, receivedAt: receivedAt.toISOString(), status: "ok" };
}

/* ------------------------------------------------------------------ Newsletter (nur Demo) */

export async function subscribeNewsletter(_prev: FormState, data: FormData): Promise<FormState> {
  const mode = siteMode();
  // Ohne Datenbank kann keine Double-Opt-in-Liste geführt werden: in Production nicht angeboten.
  if (!mode.demo) return { error: "unavailable", status: "error" };
  const parsed = newsletterSchema.safeParse({
    consent: data.get("consent") === "on",
    email: formValue(data, "email"),
    startedAt: formValue(data, "startedAt"),
    website: formValue(data, "website"),
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.website || fields.startedAt) return { error: "bot", status: "error" };
    return { error: "invalid", fields, status: "error" };
  }
  const { ipHash } = await requestInfo();
  if (!(await allowed("newsletter", ipHash))) return { error: "rate", status: "error" };
  await getStore().saveSubscriber(parsed.data.email);
  return { demo: true, status: "ok" };
}
