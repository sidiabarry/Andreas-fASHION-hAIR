import assert from "node:assert/strict";
import { test } from "node:test";

import { getProductById } from "@/data/catalog";
import { priceOrder } from "@/lib/order";
import { checkoutSchema, isTooFast } from "@/lib/validation";

const topper = getProductById(421)!; // 300,00 €
const glue = getProductById(234)!; // 18,60 €
const soldInCatalog = getProductById(206)!;

test("Preise und Summen kommen nur aus dem Katalog", () => {
  const r = priceOrder([{ quantity: 1, slug: topper.slug }, { quantity: 2, slug: glue.slug }], "DE", new Set());
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(r.order.subtotalCents, 30000 + 2 * 1860);
  assert.equal(r.order.shippingCents, 0);
  assert.equal(r.order.totalCents, 33720);
});

test("Versand unter 150 € in DE, EU-Pauschale", () => {
  const de = priceOrder([{ quantity: 1, slug: glue.slug }], "DE", new Set());
  assert.ok(de.ok && de.order.shippingCents === 600 && de.order.totalCents === 2460);
  const at = priceOrder([{ quantity: 1, slug: glue.slug }], "AT", new Set());
  assert.ok(at.ok && at.order.shippingCents === 1500);
});

test("Fehlerfälle", () => {
  assert.deepEqual(priceOrder([], "DE", new Set()), { error: { code: "empty" }, ok: false });
  assert.equal((priceOrder([{ quantity: 1, slug: "gibt-es-nicht" }], "DE", new Set()) as { error: { code: string } }).error.code, "unknown");
  assert.equal((priceOrder([{ quantity: 2, slug: topper.slug }], "DE", new Set()) as { error: { code: string } }).error.code, "quantity");
  assert.equal((priceOrder([{ quantity: 10, slug: glue.slug }], "DE", new Set()) as { error: { code: string } }).error.code, "quantity");
  assert.equal((priceOrder([{ quantity: 1, slug: topper.slug }, { quantity: 1, slug: topper.slug }], "DE", new Set()) as { error: { code: string } }).error.code, "duplicate");
  assert.equal((priceOrder([{ quantity: 1, slug: topper.slug }], "US", new Set()) as { error: { code: string } }).error.code, "country");
  const sold = priceOrder([{ quantity: 1, slug: topper.slug }, { quantity: 1, slug: soldInCatalog.slug }], "DE", new Set([topper.slug]));
  assert.deepEqual(sold, { error: { code: "sold", slugs: [topper.slug, soldInCatalog.slug] }, ok: false });
});

const valid = {
  city: "Iserlohn",
  consents: { agb: true },
  country: "DE",
  email: " Kundin@Example.de ",
  idempotencyKey: "0b8f1b8e-6a43-4d4e-9b38-2d6a5b0f6c11",
  items: [{ quantity: 1, slug: topper.slug }],
  name: "Erika Mustermann",
  note: "",
  phone: "+49 170 1234567",
  postalCode: "58642",
  startedAt: Date.now() - 10_000,
  street: "Musterweg 1",
  website: "",
};

test("Bestellvalidierung: gültige Eingabe wird normalisiert", () => {
  const r = checkoutSchema.safeParse(valid);
  assert.ok(r.success);
  if (r.success) assert.equal(r.data.email, "kundin@example.de");
});

test("Bestellvalidierung: Pflichtfelder, Längen, Land, Honeypot, Steuerzeichen", () => {
  for (const patch of [
    { name: "" },
    { email: "keine-mail" },
    { postalCode: "<>" },
    { country: "US" },
    { website: "spam" },
    { street: "a".repeat(161) },
    { items: [] },
    { items: [{ quantity: 1, slug: "../../etc" }] },
    { idempotencyKey: "123" },
    { name: "Erika\u0000" },
    { note: "x".repeat(801) },
  ]) {
    assert.equal(checkoutSchema.safeParse({ ...valid, ...patch }).success, false, JSON.stringify(patch));
  }
});

test("Zeit-Check gegen Bots", () => {
  const now = 1_000_000_000;
  assert.equal(isTooFast(now - 500, now), true);
  assert.equal(isTooFast(now - 5000, now), false);
  assert.equal(isTooFast(now + 3_600_000, now), true);
  assert.equal(isTooFast(now - 2 * 24 * 3600 * 1000, now), true);
});
