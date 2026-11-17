/**
 * Eingabeprüfung für alle Formulare (Server). Fehlermeldungen sind Übersetzungsschlüssel
 * (messages/<lang>.json → "errors.<schlüssel>"), keine Texte.
 */
import { z } from "zod";

import { ORDER_COUNTRIES } from "../config/shipping";
import { MAX_LINES, MAX_QUANTITY } from "./cart";

const text = (min: number, max: number) =>
  z
    .string("required")
    .trim()
    .min(min, min <= 1 ? "required" : "tooShort")
    .max(max, "tooLong")
    // Keine Steuerzeichen (außer Zeilenumbruch und Tab in Freitexten)
    .refine((value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value), "invalid");

const optionalText = (max: number) => z.string().trim().max(max, "tooLong").optional().default("");

export const email = z.string("required").trim().toLowerCase().max(160, "tooLong").pipe(z.email("email"));

const phone = z
  .string()
  .trim()
  .max(40, "tooLong")
  .refine((value) => value === "" || /^[+0-9 ()/.-]{5,40}$/.test(value), "phone")
  .optional()
  .default("");

/** Bot-Schutz: verstecktes Feld muss leer sein, Formular muss mindestens 2 s offen gewesen sein. */
export const botFields = {
  startedAt: z.coerce.number("bot").int("bot"),
  website: z.string().max(0, "bot").optional().default(""),
};

export function isTooFast(startedAt: number, now = Date.now()): boolean {
  return !(startedAt <= now + 60_000 && now - startedAt >= 2_000 && now - startedAt <= 1000 * 60 * 60 * 24);
}

export const cartLineSchema = z.object({
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
  slug: z.string().regex(/^[a-z0-9-]{1,160}$/),
});

export const checkoutSchema = z.object({
  ...botFields,
  city: text(2, 120),
  consents: z.record(z.string().max(40), z.boolean()).default({}),
  country: z.string().refine((value) => ORDER_COUNTRIES.includes(value), "country"),
  email,
  idempotencyKey: z.uuid("invalid"),
  items: z.array(cartLineSchema).min(1, "empty").max(MAX_LINES, "tooLong"),
  name: text(2, 120),
  note: optionalText(800),
  phone,
  postalCode: z
    .string("required")
    .trim()
    .min(3, "tooShort")
    .max(12, "tooLong")
    .regex(/^[A-Za-z0-9 -]+$/, "postalCode"),
  street: text(3, 160),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const INQUIRY_TOPICS = ["beratung", "extensions", "massanfertigung", "salon", "bestellung"] as const;
export type InquiryTopic = (typeof INQUIRY_TOPICS)[number];

export const inquirySchema = z.object({
  ...botFields,
  email,
  message: text(5, 1600),
  name: text(2, 120),
  phone,
  privacy: z.literal(true, "privacy"),
  product: optionalText(200),
  topic: z.enum(INQUIRY_TOPICS, "invalid"),
  // Extensions
  method: z.enum(["", "butterfly", "genius", "invisible", "tape", "keratin", "clip", "unsure"], "invalid").optional().default(""),
  length: optionalText(60),
  color: optionalText(80),
  amount: optionalText(80),
  // Salon (B2B)
  company: optionalText(120),
  // Bestellanfrage (z. B. Versand außerhalb der EU)
  country: optionalText(80),
}).refine((v) => v.topic !== "salon" || v.company.length >= 2, { message: "required", path: ["company"] });
export type InquiryInput = z.infer<typeof inquirySchema>;

export const withdrawalSchema = z.object({
  ...botFields,
  email,
  items: optionalText(600),
  name: text(2, 120),
  orderDate: optionalText(40),
  orderNumber: text(1, 60),
});
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;

export const newsletterSchema = z.object({
  ...botFields,
  consent: z.literal(true, "consent"),
  email,
});

/** Zod-Fehler → { feld: schlüssel } (erster Fehler je Feld). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = /^[a-zA-Z]+$/.test(issue.message) ? issue.message : "invalid";
  }
  return out;
}
