import assert from "node:assert/strict";
import { test } from "node:test";

import { COPY_FIELDS, galleryImages, getProductById, imageKindOf, productCopy, products } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import { colorGroupOf, filterProducts, lengthBandOf, methodOf, orderByCategory, parseColorGroup, parseMethod } from "@/lib/collection";
import { customSummary, methodFor } from "@/lib/custom-request";

const p = (id: number) => getProductById(id)!;

test("Methode folgt dem Produktnamen, nur bei Extensions", () => {
  assert.equal(methodOf(p(424)), "genius");
  assert.equal(methodOf(p(425)), "thin");
  assert.equal(methodOf(p(426)), "thin");
  assert.equal(methodOf(p(427)), "invisible");
  assert.equal(methodOf(p(428)), "butterfly");
  assert.equal(methodOf(p(423)), "clip");
  assert.equal(methodOf(p(422)), null);
});

test("Farbgruppe: frühestes Farbwort entscheidet", () => {
  assert.equal(colorGroupOf(p(422)), "blond"); // Dunkelblond mit hellen Reflexen
  assert.equal(colorGroupOf(p(424)), "braun");
  assert.equal(colorGroupOf(p(425)), "blond");
  assert.equal(colorGroupOf(p(426)), "braun"); // Kaffeebraun mit Kupfer-Ombré
  assert.equal(colorGroupOf(p(427)), "blond");
  assert.equal(colorGroupOf({ color: "Helles Kupferbraun" }), "kupfer");
  assert.equal(colorGroupOf({ color: "Grau meliert" }), "grau");
  assert.equal(colorGroupOf({ color: "" }), "andere");
});

test("Längenbänder: bis 30, 31–45, ab 46", () => {
  assert.equal(lengthBandOf({ length: "25" }), "kurz");
  assert.equal(lengthBandOf({ length: "30" }), "kurz");
  assert.equal(lengthBandOf({ length: "45" }), "mittel");
  assert.equal(lengthBandOf({ length: "46" }), "lang");
  assert.equal(lengthBandOf({ length: "" }), null);
});

test("Filter kombinieren sich; unbekannte Parameter werden verworfen", () => {
  const none = { category: null, color: null, length: null, method: null };
  assert.equal(filterProducts(products, none).length, products.length);
  const genius = filterProducts(products, { ...none, category: "extensions", method: "genius" });
  assert.deepEqual(genius.map((x) => x.id).sort(), [424]);
  const thin = filterProducts(products, { ...none, category: "extensions", method: "thin" });
  assert.deepEqual(thin.map((x) => x.id).sort(), [425, 426]);
  assert.deepEqual(filterProducts(thin, { ...none, color: "blond" }).map((x) => x.id), [425]);
  assert.equal(parseMethod("unsinn"), null);
  assert.equal(parseColorGroup(["blond"]), null);
});

test("Standardreihenfolge: Extensions zuerst", () => {
  const ordered = orderByCategory(products);
  assert.equal(ordered[0].category, "extensions");
  const firstOther = ordered.findIndex((x) => x.category !== "extensions");
  assert.ok(ordered.slice(firstOther).every((x) => x.category !== "extensions"));
});

test("Bilder 422–428: Hauptbild, Film, weitere Studiobilder, dann Atelierfotos; keine Rohfotos mehr", () => {
  for (const id of [422, 423, 424, 425, 426, 427, 428]) {
    const product = p(id);
    assert.equal(imageKindOf(product), "staged", String(id));
    assert.deepEqual(product.originals, [], `${id}: Rohfotos entfernt`);
    const gallery = galleryImages(product);
    assert.equal(gallery[0].src, product.image);
    const order = gallery.map((shot) => shot.kind);
    // Reihenfolge: studio, (video), studio…, atelier…
    const firstAtelier = order.indexOf("atelier");
    if (firstAtelier >= 0) assert.ok(order.slice(firstAtelier).every((kind) => kind === "atelier"), String(id));
    if (product.video) {
      assert.equal(gallery[1].kind, "video");
      assert.equal(gallery[1].poster, product.video.poster);
    }
    assert.ok(!order.includes("original"), String(id));
  }
  assert.equal(imageKindOf({ imageKind: undefined, restyled: true }), "relit");
  assert.equal(imageKindOf({ imageKind: undefined, restyled: false }), null);
});

test("Farbnamen laut Briefing", () => {
  assert.equal(p(422).color, "Dunkelblond mit hellen Reflexen");
  assert.equal(p(425).color, "Goldblond Ombré");
  assert.equal(p(426).color, "Kaffeebraun mit Kupfer-Ombré");
  assert.equal(p(427).color, "Hellblond Ombré mit dunklem Ansatz");
  for (const id of [423, 424, 428]) assert.equal(p(id).color, "Naturdunkelbraun");
});

test("Verkaufstexte: ohne Felder null, mit Feldern je Sprache überschreibbar, Rest Deutsch", () => {
  assert.equal(productCopy(p(421), "de"), null);
  const base = { ...p(421), headline: "Zeile", story: "Geschichte", benefits: ["a", "b", "c"], faq: [] } as Product;
  const de = productCopy(base, "de");
  assert.deepEqual(de, { benefits: ["a", "b", "c"], headline: "Zeile", story: "Geschichte" });
  assert.equal(productCopy(p(421), "en"), null);
  assert.deepEqual([...COPY_FIELDS], ["headline", "story", "benefits", "howItWorks", "goodFor", "care", "faq"]);
});

test("Maßanfertigung: System nur bei Extensions-Methoden als method, Zusammenfassung höchstens 200 Zeichen", () => {
  assert.equal(methodFor("genius"), "genius");
  assert.equal(methodFor("topper"), "");
  assert.equal(methodFor(""), "");
  const line = customSummary({ base: "Genius Weft", structure: "wellig", system: "genius" }, { structure: "Struktur", system: "System" });
  assert.equal(line, "Genius Weft · System: genius · Struktur: wellig");
  assert.equal(customSummary({ base: "x".repeat(300), structure: "", system: "" }, { structure: "S", system: "S" }).length, 200);
  assert.equal(customSummary({ base: "", structure: "", system: "" }, { structure: "S", system: "S" }), "");
});
