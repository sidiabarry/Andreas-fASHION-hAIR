import assert from "node:assert/strict";
import { test } from "node:test";

import { getProductById } from "@/data/catalog";
import { priceOrder } from "@/lib/order";
import { createMemoryStore } from "@/server/store-memory";
import type { NewOrder } from "@/server/store";

const topper = getProductById(421)!;
const glue = getProductById(424)!; // Mengenware (Extensions-Packung)

function newOrder(id: string, key: string, slugs: string[]): NewOrder {
  const priced = priceOrder(slugs.map((slug) => ({ quantity: 1, slug })), "DE", new Set());
  if (!priced.ok) throw new Error("pricing failed");
  return {
    customer: { city: "X", country: "DE", email: "a@b.de", name: "A B", note: "", phone: "", postalCode: "12345", street: "S 1" },
    id,
    idempotencyKey: key,
    lines: priced.order.lines,
    locale: "de",
    shippingCents: priced.order.shippingCents,
    subtotalCents: priced.order.subtotalCents,
    tokenHash: "h",
    totalCents: priced.order.totalCents,
  };
}

test("Doppelverkauf: zwei gleichzeitige Bestellungen desselben Einzelstücks – genau eine gewinnt", async () => {
  const store = createMemoryStore();
  const results = await Promise.all(
    Array.from({ length: 25 }, (_, i) => store.placeOrder(newOrder(`AF-${i}`, `key-${i}`, [topper.slug]))),
  );
  assert.equal(results.filter((r) => r.ok).length, 1);
  assert.equal(results.filter((r) => !r.ok && r.reason === "sold").length, 24);
  assert.deepEqual([...(await store.soldSlugs())], [topper.slug]);
});

test("Teilweise vergeben: nichts wird gespeichert (atomar)", async () => {
  const store = createMemoryStore();
  const other = getProductById(420)!;
  assert.ok((await store.placeOrder(newOrder("AF-1", "k1", [topper.slug]))).ok);
  const second = await store.placeOrder(newOrder("AF-2", "k2", [other.slug, topper.slug]));
  assert.deepEqual(second, { ok: false, reason: "sold", slugs: [topper.slug] });
  assert.equal((await store.soldSlugs()).has(other.slug), false);
  assert.equal(await store.getOrder("AF-2"), null);
});

test("Pflegeprodukte sind keine Einzelstücke", async () => {
  const store = createMemoryStore();
  assert.ok((await store.placeOrder(newOrder("AF-1", "k1", [glue.slug]))).ok);
  assert.ok((await store.placeOrder(newOrder("AF-2", "k2", [glue.slug]))).ok);
});

test("Idempotenz: gleicher Schlüssel → dieselbe Bestellung, kein zweiter Datensatz", async () => {
  const store = createMemoryStore();
  const a = await store.placeOrder(newOrder("AF-1", "same", [topper.slug]));
  const b = await store.placeOrder(newOrder("AF-2", "same", [topper.slug]));
  assert.ok(a.ok && b.ok && b.duplicate && b.order.id === "AF-1");
});

test("Stornieren gibt das Stück wieder frei", async () => {
  const store = createMemoryStore();
  await store.placeOrder(newOrder("AF-1", "k1", [topper.slug]));
  assert.ok(await store.cancelOrder("AF-1"));
  assert.ok((await store.placeOrder(newOrder("AF-2", "k2", [topper.slug]))).ok);
});

test("Rate-Limit: Fensterzähler", async () => {
  const store = createMemoryStore();
  const results = [];
  for (let i = 0; i < 7; i++) results.push(await store.hit("ip", 5, 60_000));
  assert.deepEqual(results, [true, true, true, true, true, false, false]);
});
