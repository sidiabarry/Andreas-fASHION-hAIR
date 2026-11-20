import assert from "node:assert/strict";
import { test } from "node:test";

import { basePricePerKgCents, getProductById, INQUIRY_ONLY_CATEGORIES, isUnique, products } from "@/data/catalog";
import { priceOrder } from "@/lib/order";

test("Grundpreis je 1 kg folgt dem Datenfeld netWeightGrams", () => {
  assert.equal(basePricePerKgCents(getProductById(424)!), 230000); // 115 € / 50 g = 2.300,00 € / 1 kg
  assert.equal(basePricePerKgCents(getProductById(427)!), 240000); // 60 € / 25 g
  assert.equal(basePricePerKgCents(getProductById(428)!), 260000); // 130 € / 50 g
  assert.equal(basePricePerKgCents(getProductById(423)!), 201031); // 390 € / 194 g
  assert.equal(basePricePerKgCents(getProductById(422)!), null);
  assert.equal(basePricePerKgCents({ netWeightGrams: 0, priceCents: 1000 }), null);
  assert.equal(basePricePerKgCents({ priceCents: 1000 }), null);
});

test("Extensions sind Mengenware, der V-Toupet bleibt Einzelstück", () => {
  assert.equal(isUnique(getProductById(422)!), true);
  for (const id of [423, 424, 425, 426, 427, 428]) assert.equal(isUnique(getProductById(id)!), false, String(id));
});

test("Extensions mit Produkten sind nicht mehr nur auf Anfrage", () => {
  assert.ok(products.some((p) => p.category === "extensions"));
  assert.ok(!INQUIRY_ONLY_CATEGORIES.includes("extensions"));
});

test("Extensions lassen sich mehrfach bestellen, Preis kommt aus dem Katalog", () => {
  const slug = getProductById(424)!.slug;
  const out = priceOrder([{ quantity: 3, slug }], "DE", new Set());
  assert.equal(out.ok, true);
  if (out.ok) assert.equal(out.order.subtotalCents, 34500);
});
