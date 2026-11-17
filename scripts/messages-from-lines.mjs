#!/usr/bin/env node
/**
 * Hilfsskript für Übersetzungen: liest eine Datei mit Zeilen „schlüssel.pfad = Text“ und schreibt
 * src/messages/<lang>.json in der Struktur von de.json. Bricht ab, wenn ein Schlüssel fehlt oder unbekannt ist.
 * Aufruf: node scripts/messages-from-lines.mjs <lang> <datei>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [lang, file] = process.argv.slice(2);
const de = JSON.parse(readFileSync("src/messages/de.json", "utf8"));
const lines = readFileSync(file, "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#"));
const map = new Map();
for (const line of lines) {
  const i = line.indexOf(" = ");
  if (i < 0) throw new Error(`Zeile ohne " = ": ${line}`);
  map.set(line.slice(0, i).trim(), line.slice(i + 3).replace(/\\n/g, "\n"));
}
const used = new Set();
function build(obj, prefix) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") out[k] = build(v, key);
    else {
      if (!map.has(key)) throw new Error(`fehlt: ${key}`);
      out[k] = map.get(key);
      used.add(key);
    }
  }
  return out;
}
const result = build(de, "");
const extra = [...map.keys()].filter((k) => !used.has(k));
if (extra.length) throw new Error(`unbekannt: ${extra.join(", ")}`);
writeFileSync(`src/messages/${lang}.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(`src/messages/${lang}.json: ${used.size} Schlüssel`);
