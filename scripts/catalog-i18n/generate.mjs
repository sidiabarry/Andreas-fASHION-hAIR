#!/usr/bin/env node
/**
 * Erzeugt die Produkttexte je Sprache (src/messages/catalog/<lang>.json) aus dem deutschen
 * Katalog (src/data/catalog.json) und den gegengelesenen Wörterbüchern in diesem Ordner.
 *
 * Vorgehen: Jeder deutsche Text wird in Bausteine zerlegt (Vorlage + Länge, Farbe, Basis, Struktur).
 * Zur Kontrolle wird mit dem deutschen Wörterbuch zurückgebaut; weicht das Ergebnis auch nur um ein
 * Zeichen vom Original ab, bricht das Skript ab. So ist sichergestellt, dass keine Sprache mehr oder
 * anderes behauptet als der deutsche Text.
 *
 * Aufruf: node scripts/catalog-i18n/generate.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const catalog = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8"));
const dict = (lang) => JSON.parse(readFileSync(join(here, `${lang}.json`), "utf8"));
const de = dict("de");
const check = process.argv.includes("--check");

const fill = (template, params) =>
  template.replace(/\{(\w+)\}/g, (_, key) => {
    if (params[key] === undefined) throw new Error(`Missing param ${key} for "${template}"`);
    return params[key];
  });

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Deutsche Vorlage als RegExp mit benannten Gruppen. */
const toRegex = (template) =>
  new RegExp(`^${escape(template).replace(/\\\{(\w+)\\\}/g, (_, key) => `(?<${key}>.+?)`)}$`);

function matchOne(text, templates, label) {
  const ordered = Object.entries(templates).sort((a, b) => b[1].length - a[1].length);
  for (const [key, template] of ordered) {
    const match = toRegex(template).exec(text);
    if (match) return { key, params: { ...(match.groups ?? {}) } };
  }
  throw new Error(`No ${label} template matches: "${text}"`);
}

function parseDescription(product) {
  const plain = Object.entries(de.descriptions).find(([, template]) => toRegex(template).test(product.description));
  if (plain) {
    return { kind: "plain", key: plain[0], params: { ...(toRegex(plain[1]).exec(product.description).groups ?? {}) } };
  }
  for (const [bodyKey, bodyTemplate] of Object.entries(de.bodies)) {
    const bodyRegex = new RegExp(`^(?<head>.+?\\.) ${escape(bodyTemplate).replace(/\\\{(\w+)\\\}/g, (_, key) => `(?<${key}>.+?)`)}$`);
    const match = bodyRegex.exec(product.description);
    if (!match) continue;
    const { head, ...bodyParams } = match.groups;
    const hairEntry = Object.entries(de.hair)
      .map(([key, template]) => ({ key, match: toRegex(template).exec(head) }))
      .find((entry) => entry.match);
    if (!hairEntry) continue;
    const hairParams = { ...hairEntry.match.groups };
    const textureKey = Object.entries(de.textureHair).find(([, value]) => value === hairParams.hair)?.[0];
    if (textureKey === undefined) throw new Error(`Unknown hair phrase "${hairParams.hair}"`);
    return { bodyKey, bodyParams, hairKey: hairEntry.key, hairParams: { ...hairParams, hair: textureKey }, kind: "composed" };
  }
  throw new Error(`Description not parseable for ${product.id}`);
}

function parseProduct(product) {
  const name = matchOne(product.name, de.names, "name");
  const subtitleKey = Object.entries(de.subtitles).find(([, value]) => value === product.subtitle)?.[0];
  if (!subtitleKey && !(product.subtitle in de.colors)) throw new Error(`Unknown subtitle "${product.subtitle}"`);
  const specs = product.specs.map((spec) => matchOne(spec, de.specs, "spec"));
  return { description: parseDescription(product), name, specs, subtitle: subtitleKey ? { key: subtitleKey } : { color: product.subtitle } };
}

function translateParams(params, lang) {
  const out = { ...params };
  if (out.color !== undefined) {
    const color = lang.colors[out.color];
    if (!color) throw new Error(`Missing color "${out.color}"`);
    out.color = color;
  }
  if (out.texture !== undefined) {
    const texture = lang.textures[out.texture];
    if (!texture) throw new Error(`Missing texture "${out.texture}"`);
    out.texture = texture;
  }
  return out;
}

function render(parsed, lang) {
  const name = fill(lang.names[parsed.name.key], parsed.name.params);
  const subtitle = parsed.subtitle.key ? lang.subtitles[parsed.subtitle.key] : lang.colors[parsed.subtitle.color];
  let description;
  if (parsed.description.kind === "plain") {
    const values = translateParams(parsed.description.params, lang);
    if (lang.inlineColorLowercase && values.color) {
      values.color = values.color.charAt(0).toLocaleLowerCase(lang.locale) + values.color.slice(1);
    }
    description = fill(lang.descriptions[parsed.description.key], values);
  } else {
    const { hairKey, hairParams, bodyKey, bodyParams } = parsed.description;
    const hair = lang.textureHair[hairParams.hair];
    const hairValues = translateParams({ ...hairParams, hair }, lang);
    // Farben stehen im Fließtext; außer im Deutschen werden sie dort kleingeschrieben.
    if (lang.inlineColorLowercase && hairValues.color) {
      hairValues.color = hairValues.color.charAt(0).toLocaleLowerCase(lang.locale) + hairValues.color.slice(1);
    }
    const head = fill(lang.hair[hairKey], hairValues);
    description = `${head} ${fill(lang.bodies[bodyKey], bodyParams)}`;
  }
  const specs = parsed.specs.map((spec) => fill(lang.specs[spec.key], translateParams(spec.params, lang)));
  for (const value of [name, subtitle, description, ...specs]) {
    if (!value || /\{\w+\}/.test(value)) throw new Error(`Incomplete text: ${value}`);
  }
  return { description, name, specs, subtitle };
}

const parsed = catalog.map((product) => ({ id: product.id, parsed: parseProduct(product), product }));

// Rundlauf-Kontrolle gegen das deutsche Original
for (const { product, parsed: structure } of parsed) {
  const back = render(structure, de);
  for (const field of ["name", "subtitle", "description"]) {
    if (back[field] !== product[field]) {
      throw new Error(`Round trip failed for ${product.id}.${field}:\n  ${back[field]}\n  ${product[field]}`);
    }
  }
  if (JSON.stringify(back.specs) !== JSON.stringify(product.specs)) {
    throw new Error(`Round trip failed for ${product.id}.specs`);
  }
}

const langs = process.argv.filter((arg) => /^[a-z]{2}$/.test(arg));
const targets = langs.length ? langs : ["en", "fr", "es", "pt", "it", "nl", "pl", "tr"].filter((lang) => existsSync(join(here, `${lang}.json`)));
let stale = false;
for (const code of targets) {
  const lang = dict(code);
  const out = {};
  for (const { id, parsed: structure } of parsed) out[String(id)] = render(structure, lang);
  const file = join(root, "src/messages/catalog", `${code}.json`);
  const text = `${JSON.stringify(out, null, 2)}\n`;
  if (check) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== text) {
      console.error(`stale: ${file}`);
      stale = true;
    }
  } else {
    writeFileSync(file, text);
    console.log(`wrote ${file}`);
  }
}
if (stale) process.exit(1);
console.log(`OK: ${parsed.length} products, round trip identical to German source.`);
