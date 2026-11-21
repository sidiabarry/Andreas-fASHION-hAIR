/**
 * Prüft, ob alle Pflichtangaben für den Livegang vorliegen.
 *
 *   npm run check:launch        → listet Fehlendes, Exit-Code 1 solange etwas Blockierendes fehlt
 *   node scripts/check-launch.ts --ci
 *                               → Teil von `npm run build`: warnt nur, AUSSER bei VERCEL_ENV=production.
 *                                 Dann bricht der Build (und damit der Production-Deploy) ab.
 *
 * Wird direkt mit Node (Type Stripping, Node ≥ 22.18) ausgeführt, ohne Bundler.
 *
 * Marker <mark data-missing> in den Rechtstexten: Jede Angabe, die dort einen Marker auslöst, ist in
 * missingCompanyFields() als blockierend erfasst (legal: true). Zusätzlich prüft
 * `npm run test:e2e -- --production`, dass keine Seite einen Marker rendert.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { company, missingCompanyFields } from "../src/config/company.ts";
import { WARRANTY_LABEL } from "../src/config/legal-assets.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ci = process.argv.includes("--ci");
const production = process.env.VERCEL_ENV === "production";

type Finding = { area: string; text: string; blocking: boolean };
const findings: Finding[] = [];

for (const missing of missingCompanyFields(company)) {
  findings.push({ area: "company.ts", blocking: missing.blocking, text: `${missing.field}: ${missing.why}` });
}

// Sicherheitsangaben für Gefahrstoffe / GPSR
const catalog = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8")) as { id: number; name: string; category: string; safety: string | null }[];
for (const product of catalog) {
  if (product.category === "pflege" && !product.safety) {
    const solvent = /lösungsmittel/i.test(product.name);
    findings.push({
      area: "catalog.json",
      blocking: solvent,
      text: `${product.name} (id ${product.id}): Sicherheitsangaben fehlen (GPSR${solvent ? ", CLP-Kennzeichnung/Gefahrenhinweise des Lösungsmittels" : ""})`,
    });
  }
}

// Gewichtsware (Extensions in Packungen nach Gramm): Grundpreis § 4 PAngV, Bezugsgröße 1 kg (§ 5 Abs. 1 PAngV).
// Erkennung über Kategorie oder Methode im Namen, damit die Prüfung unabhängig vom Katalogschema greift.
type CatalogEntry = (typeof catalog)[number] & { color?: string; description?: string; subtitle?: string; specs?: string[]; netWeightGrams?: unknown };
const EXTENSION = /genius weft|butterfly weft|invisible tape|tape-?in|clip-?in|bonding|extension/i;
const isWeightGood = (p: CatalogEntry) => p.category === "extensions" || EXTENSION.test(p.name);
for (const product of catalog as CatalogEntry[]) {
  if (!isWeightGood(product)) continue;
  const grams = product.netWeightGrams;
  if (typeof grams !== "number" || !Number.isFinite(grams) || grams <= 0) {
    findings.push({
      area: "catalog.json",
      blocking: true,
      text: `${product.name} (id ${product.id}): Füllgewicht (netWeightGrams) fehlt – ohne Gewicht kein Grundpreis je 1 kg (§ 4 Abs. 1, § 5 Abs. 1 PAngV)`,
    });
  }
  if (!product.color?.trim()) {
    findings.push({
      area: "catalog.json",
      blocking: true,
      text: `${product.name} (id ${product.id}): Farbe fehlt – wesentliche Eigenschaft bei Packungsware (Art. 246a § 1 Abs. 1 Nr. 1 EGBGB)`,
    });
  }
}

// Grundpreis darf bei Fertigpackungen nur je 1 kg angegeben werden (100 g nur bei loser Ware, § 5 Abs. 2 PAngV).
const per100g = /(€|EUR)\s*(\/|pro|je|per|par|por)\s*100\s*g\b|\/\s*100\s*g\b/i;
const listFiles = (dir: string): string[] =>
  existsSync(join(root, dir))
    ? readdirSync(join(root, dir), { recursive: true, encoding: "utf8" })
        .filter((f) => /\.(json|ts|tsx)$/.test(f))
        .map((f) => `${dir}/${f}`)
    : [];
const unitPriceFiles = [...listFiles("src/messages").filter((f) => !f.includes("/catalog/")), ...listFiles("src/components"), ...listFiles("src/lib")];
for (const file of unitPriceFiles) {
  const path = join(root, file);
  if (existsSync(path) && per100g.test(readFileSync(path, "utf8"))) {
    findings.push({ area: "Preisangaben", blocking: true, text: `${file}: Grundpreis „/ 100 g“ gefunden – bei verpackter Ware nur „/ 1 kg“ zulässig (§ 5 Abs. 1 PAngV)` });
  }
}

// Absolute Werbeaussagen (§ 5 UWG): nur mit Beleg bzw. abgeschwächt verwenden.
// „Premium“ ist eine unbelegte Qualitätsstufe (Andreas eigene Angabe, kein Lieferantennachweis).
const CLAIMS = /man sieht nichts|unsichtbar|niemand sieht|nicht zu sehen|naturbelassen|ungefärbt|double drawn|premium/i;
type CopyEntry = CatalogEntry & { headline?: string; story?: string; benefits?: string[]; goodFor?: string; faq?: { q: string; a: string }[] };
const productTexts = (p: CopyEntry) =>
  [p.name, p.subtitle, p.description, ...(p.specs ?? []), p.headline, p.story, ...(p.benefits ?? []), p.goodFor, ...(p.faq ?? []).flatMap((f) => [f.q, f.a])].join(" ");
const claimIds = (catalog as CopyEntry[]).filter((p) => CLAIMS.test(productTexts(p))).map((p) => p.id);
if (claimIds.length) {
  findings.push({
    area: "catalog.json",
    blocking: false,
    text: `Werbeaussagen prüfen (§ 5 UWG; „niemand sieht“, „naturbelassen“, „Double Drawn“, „Premium“ o. Ä.) bei ${claimIds.length} Produkten: ${claimIds.join(", ")} – siehe docs/COMPLIANCE.md Abschnitt 4b`,
  });
}

// Heil-/Wirkversprechen (HWG-Nähe) und Herkunft des Haars: Das Haar stammt nicht aus Brasilien, Herkunft ist unbelegt.
const HEALTH = /\bheil(t|en|ung)\b|(förder|anreg|regt)\S*.{0,20}haarwuchs|haarwuchs.{0,20}(förder|anreg)|wächst nach|gegen haarausfall|therapie|krankenkass|kassenzuschuss/i;
const ORIGIN = /brasilianische[sn]? (echt)?haar|haar aus brasilien|brazilian hair|cabello brasileño|cheveux brésiliens/i;
const deMessages = readFileSync(join(root, "src/messages/de.json"), "utf8");
const healthIds = (catalog as CopyEntry[]).filter((p) => HEALTH.test(productTexts(p))).map((p) => p.id);
if (HEALTH.test(deMessages) || healthIds.length) {
  findings.push({
    area: "Werbeaussagen",
    blocking: true,
    text: `Heil- oder Wirkversprechen bzw. Krankenkassen-Aussage gefunden (§ 3 HWG, § 5 UWG)${healthIds.length ? ` in Produkten ${healthIds.join(", ")}` : ""}${HEALTH.test(deMessages) ? " in src/messages/de.json" : ""}`,
  });
}
const originIds = (catalog as CopyEntry[]).filter((p) => ORIGIN.test(productTexts(p))).map((p) => p.id);
if (ORIGIN.test(deMessages) || originIds.length) {
  findings.push({
    area: "Werbeaussagen",
    blocking: true,
    text: `Herkunftsangabe zum Haar gefunden (§ 5 Abs. 1 Nr. 1 UWG; das Haar stammt nicht aus Brasilien)${originIds.length ? ` in Produkten ${originIds.join(", ")}` : ""}`,
  });
}

// GPSR (Verordnung (EU) 2023/988, Art. 19): Herstellerangaben je Produkt im Angebot.
// Solange kein Feld `manufacturer` (Name, Post- und E-Mail-Adresse) gepflegt ist, blockiert der Livegang.
const noManufacturer = (catalog as (CatalogEntry & { sold?: boolean; manufacturer?: unknown })[]).filter((p) => !p.sold && !p.manufacturer).map((p) => p.id);
if (noManufacturer.length) {
  findings.push({
    area: "catalog.json",
    blocking: true,
    text: `GPSR Art. 19: Herstellerangaben (Name, Postanschrift, E-Mail; bei Herstellern außerhalb der EU die verantwortliche Person) fehlen bei ${noManufacturer.length} Produkten – Frage an Andrea: selbst gefertigt oder zugekauft?`,
  });
}

// Rechtstexte des Rechtsagenten vorhanden?
for (const file of ["impressum.tsx", "datenschutz.tsx", "agb.tsx", "widerruf.tsx", "versand-zahlung.tsx", "widerrufsformular.ts", "checkout-texts.ts"]) {
  if (!existsSync(join(root, "src/content/legal", file))) {
    findings.push({ area: "Rechtstexte", blocking: true, text: `src/content/legal/${file} fehlt (es wird nur ein Platzhalter angezeigt)` });
  }
}

if (catalog.some((p) => (p as { availability?: string }).availability === "unknown")) {
  findings.push({ area: "catalog.json", blocking: false, text: "Katalog mit Andrea abgleichen: Verfügbarkeit (availability) ist bei Stücken noch „unknown“" });
}

// Harmonisierte Gewährleistungsmitteilung (DVO (EU) 2025/1960), amtliche Grafik
if (!WARRANTY_LABEL || !existsSync(join(root, "public", WARRANTY_LABEL.src))) {
  findings.push({
    area: "Rechtstexte",
    blocking: true,
    text: "Gewährleistungsgrafik fehlt (src/config/legal-assets.ts, public/assets/legal/): amtliche Grafik nach DVO (EU) 2025/1960 Anhang I von EUR-Lex herunterladen (bis dahin steht der Hinweis nur als Text über dem Bestellknopf)",
  });
}

// Betrieb: E-Mail-Versand
for (const key of ["RESEND_API_KEY", "MAIL_FROM", "MAIL_TO_OWNER"]) {
  if (!process.env[key]) {
    findings.push({ area: "Umgebung", blocking: production, text: `${key} ist nicht gesetzt: Anfrage- und Widerrufsformular sind in Production dann nicht nutzbar (es werden Telefon/E-Mail angezeigt)` });
  }
}

const blocking = findings.filter((f) => f.blocking);
const lines = findings.map((f) => `  ${f.blocking ? "✗" : "!"} [${f.area}] ${f.text}`);
const header = blocking.length
  ? `check:launch – ${blocking.length} blockierende und ${findings.length - blocking.length} weitere offene Punkte:`
  : findings.length
    ? `check:launch – keine blockierenden Punkte, ${findings.length} Hinweise:`
    : "check:launch – alles vollständig.";

if (ci && !production) {
  console.warn([header, ...lines, "  (Build läuft weiter: nicht VERCEL_ENV=production)"].join("\n"));
  process.exit(0);
}
const out = [header, ...lines].join("\n");
if (blocking.length) {
  console.error(out);
  process.exit(1);
}
console.log(out);
