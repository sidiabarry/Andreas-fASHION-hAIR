import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { detectLocale, localeFromAcceptLanguage, LOCALES } from "@/i18n/locales";

const dir = join(import.meta.dirname, "../../src/messages");
const load = (file: string) => JSON.parse(readFileSync(join(dir, file), "utf8"));

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") Object.assign(out, flatten(value as Record<string, unknown>, path));
    else out[path] = String(value);
  }
  return out;
}
/** ICU-Argumentnamen (ohne Inhalte von plural-Zweigen) und Rich-Text-Tags. */
function placeholders(text: string): string[] {
  const names = new Set<string>();
  const stack: ("arg" | "body")[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{") {
      if (stack.at(-1) === "arg") stack.push("body");
      else {
        const m = /^\{\s*(\w+)/.exec(text.slice(i));
        if (m) names.add(m[1]);
        stack.push("arg");
      }
    } else if (c === "}") stack.pop();
  }
  for (const m of text.matchAll(/<(\w+)>/g)) names.add(`<${m[1]}>`);
  return [...names].sort();
}

const de = flatten(load("de.json"));

for (const locale of LOCALES) {
  test(`Übersetzung ${locale}: jeder Schlüssel, keine leeren Werte, gleiche Platzhalter`, () => {
    const messages = flatten(load(`${locale}.json`));
    assert.deepEqual(Object.keys(messages).sort(), Object.keys(de).sort());
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(value.trim().length > 0, `${locale}: ${key} ist leer`);
      assert.deepEqual(placeholders(value), placeholders(de[key]), `${locale}: Platzhalter in ${key}`);
    }
  });
}

test("Produkttexte: jede freigeschaltete Sprache außer Deutsch hat alle 50 Produkte vollständig", () => {
  const catalog = JSON.parse(readFileSync(join(dir, "../data/catalog.json"), "utf8")) as { id: number; specs: string[] }[];
  const files = readdirSync(join(dir, "catalog"));
  for (const locale of LOCALES.filter((l) => l !== "de")) {
    assert.ok(files.includes(`${locale}.json`), `catalog/${locale}.json fehlt`);
    const texts = load(`catalog/${locale}.json`) as Record<string, { name: string; subtitle: string; description: string; specs: string[] }>;
    for (const product of catalog) {
      const entry = texts[String(product.id)];
      assert.ok(entry, `${locale}: Produkt ${product.id}`);
      assert.ok(entry.name && entry.subtitle && entry.description);
      assert.equal(entry.specs.length, product.specs.length);
    }
  }
});

test("Accept-Language mit q-Werten", () => {
  assert.equal(localeFromAcceptLanguage("en-US,en;q=0.9,de;q=0.8"), "en");
  assert.equal(localeFromAcceptLanguage("de-AT"), "de");
  assert.equal(localeFromAcceptLanguage("xx, de;q=0.1"), "de");
  assert.equal(localeFromAcceptLanguage("de;q=0.2, en;q=0.9"), "en");
  assert.equal(localeFromAcceptLanguage("*"), null);
  assert.equal(localeFromAcceptLanguage(""), null);
});

test("Erkennung: Cookie vor Browser vor Land vor Englisch", () => {
  assert.equal(detectLocale({ acceptLanguage: "de", cookie: "en" }), "en");
  assert.equal(detectLocale({ acceptLanguage: "en", country: "DE" }), "en");
  assert.equal(detectLocale({ acceptLanguage: "ja", country: "AT" }), "de");
  assert.equal(detectLocale({ acceptLanguage: "ja", country: "JP" }), "en");
  assert.equal(detectLocale({ cookie: "xx", country: "CH" }), "de");
  assert.equal(detectLocale({}), "en");
});
