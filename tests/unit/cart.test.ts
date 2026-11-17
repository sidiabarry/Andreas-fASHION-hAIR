import assert from "node:assert/strict";
import { test } from "node:test";

import { cartCount, cartReducer, MAX_LINES, MAX_QUANTITY } from "@/lib/cart";

const empty = { lines: [] };

test("Einzelstück kann nur einmal im Warenkorb liegen", () => {
  let s = cartReducer(empty, { slug: "topper-1", type: "add", unique: true });
  s = cartReducer(s, { slug: "topper-1", type: "add", unique: true });
  assert.deepEqual(s.lines, [{ quantity: 1, slug: "topper-1" }]);
  s = cartReducer(s, { quantity: 5, slug: "topper-1", type: "setQuantity", unique: true });
  assert.equal(s.lines[0].quantity, 1);
});

test("Pflegeprodukte: Menge erhöht sich, höchstens 9", () => {
  let s = cartReducer(empty, { slug: "kleber", type: "add", unique: false });
  for (let i = 0; i < 20; i++) s = cartReducer(s, { slug: "kleber", type: "add", unique: false });
  assert.equal(s.lines[0].quantity, MAX_QUANTITY);
  s = cartReducer(s, { quantity: 0, slug: "kleber", type: "setQuantity", unique: false });
  assert.equal(s.lines[0].quantity, 1);
  s = cartReducer(s, { quantity: Number.NaN, slug: "kleber", type: "setQuantity", unique: false });
  assert.equal(s.lines[0].quantity, 1);
  assert.equal(cartCount(s), 1);
});

test("Entfernen und Leeren", () => {
  let s = cartReducer(empty, { slug: "a", type: "add", unique: true });
  s = cartReducer(s, { slug: "b", type: "add", unique: true });
  s = cartReducer(s, { slug: "a", type: "remove" });
  assert.deepEqual(s.lines.map((l) => l.slug), ["b"]);
  assert.deepEqual(cartReducer(s, { type: "clear" }).lines, []);
});

test("Ungültige Slugs werden ignoriert, höchstens 20 Positionen", () => {
  let s = cartReducer(empty, { slug: "<script>", type: "add", unique: true });
  assert.equal(s.lines.length, 0);
  for (let i = 0; i < 30; i++) s = cartReducer(s, { slug: `p-${i}`, type: "add", unique: true });
  assert.equal(s.lines.length, MAX_LINES);
});

test("Hydrieren aus localStorage verwirft Unsinn, Duplikate und Unbekanntes", () => {
  const s = cartReducer(empty, {
    isKnown: (slug) => slug !== "weg",
    isUnique: (slug) => slug.startsWith("u"),
    lines: [{ quantity: 4, slug: "u-1" }, { quantity: 4, slug: "u-1" }, { quantity: 3, slug: "pflege" }, { quantity: 2, slug: "weg" }, null, "x", { slug: 5 }],
    type: "hydrate",
  });
  assert.deepEqual(s.lines, [
    { quantity: 1, slug: "u-1" },
    { quantity: 3, slug: "pflege" },
  ]);
  assert.deepEqual(cartReducer(empty, { isKnown: () => true, isUnique: () => true, lines: "kaputt", type: "hydrate" }).lines, []);
});
