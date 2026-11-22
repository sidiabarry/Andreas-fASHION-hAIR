import assert from "node:assert/strict";
import { test } from "node:test";

import catalog from "@/data/catalog.json";
import live from "@/data/live-products-2026-11.json";
import { legacyProductMap, legacyRedirects } from "@/lib/legacy-redirects";

test("Jede alte Produkt-URL zeigt auf das Produkt mit gleicher ID und gleichem Preis", () => {
  const map = legacyProductMap();
  const hidden = new Set(catalog.filter((p) => (p as { hidden?: boolean }).hidden).map((p) => p.id));
  const visibleLive = live.filter((old) => !hidden.has(old.id));
  assert.equal(map.size, visibleLive.length);
  for (const old of visibleLive) {
    const target = map.get(decodeURIComponent(old.slug));
    const product = catalog.find((p) => p.slug === target);
    assert.ok(product, old.slug);
    assert.equal(product.id, old.id);
    assert.equal(product.priceCents, Math.round(Number(old.price) * 100), `${old.slug}: Preis`);
  }
});

test("Alle Seiten-Weiterleitungen enden auf /de/ und sind permanent", () => {
  const list = legacyRedirects();
  for (const r of list) {
    assert.ok(r.destination.startsWith("/de/"), r.destination);
    assert.equal(r.permanent, true);
  }
  const find = (source: string) => list.find((r) => r.source === source)?.destination;
  assert.equal(find("/products"), "/de/kollektion");
  assert.equal(find("/about"), "/de/ueber-andrea");
  assert.equal(find("/contact"), "/de/kontakt");
  assert.equal(find("/shipping-returns"), "/de/versand-und-zahlung");
  assert.equal(find("/privacy"), "/de/datenschutz");
  assert.equal(find("/terms"), "/de/agb");
  assert.equal(find("/wishlist"), "/de/kollektion");
  assert.equal(find("/product-category/curtain-bangs"), "/de/kollektion?kategorie=pony");
  assert.equal(find("/product-category/:rest*"), "/de/kollektion"); // alte Pflege-Kategorie (Walker Tape ausgeblendet) fällt hierauf
  assert.equal(find("/product/413"), "/de/produkt/echthaar-topper-35-cm-helles-aschblond-413");
});
