import assert from "node:assert/strict";
import { test } from "node:test";

import { shippingCents, zoneForCountry } from "@/config/shipping";
import { formatPrice } from "@/lib/money";

test("Deutschland: 6,00 € unter 150 €, kostenlos ab genau 150,00 €", () => {
  assert.equal(shippingCents("DE", 14999), 600);
  assert.equal(shippingCents("DE", 15000), 0);
  assert.equal(shippingCents("DE", 15001), 0);
  assert.equal(shippingCents("de", 0), 600);
});

test("EU: 15,00 €, auch über 150 €", () => {
  assert.equal(shippingCents("AT", 14999), 1500);
  assert.equal(shippingCents("FR", 99999), 1500);
  assert.equal(zoneForCountry("PL").id, "eu");
});

test("Weltweit: nur auf Anfrage", () => {
  assert.equal(shippingCents("US", 10000), null);
  assert.equal(shippingCents("CH", 10000), null);
  assert.equal(zoneForCountry("GB").id, "world");
});

test("ungültige Beträge werden abgewiesen", () => {
  assert.throws(() => shippingCents("DE", -1));
  assert.throws(() => shippingCents("DE", 1.5));
});

test("Preisformat de-DE: 1.234,56 €", () => {
  assert.equal(formatPrice(123456, "de").replace(/ /g, " "), "1.234,56 €");
  assert.equal(formatPrice(94300, "de").replace(/ /g, " "), "943,00 €");
  assert.equal(formatPrice(1285, "en"), "€12.85");
});
