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
import { existsSync, readFileSync } from "node:fs";
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

// Rechtstexte des Rechtsagenten vorhanden?
for (const file of ["impressum.tsx", "datenschutz.tsx", "agb.tsx", "widerruf.tsx", "versand-zahlung.tsx", "widerrufsformular.ts", "checkout-texts.ts"]) {
  if (!existsSync(join(root, "src/content/legal", file))) {
    findings.push({ area: "Rechtstexte", blocking: true, text: `src/content/legal/${file} fehlt (es wird nur ein Platzhalter angezeigt)` });
  }
}

// Herkunftsangabe „Brasilianisches Echthaar“ (vom Auftraggeber bestätigt): Nachweis bereithalten
findings.push({ area: "catalog.json", blocking: false, text: "Herkunft „Brasilianisches Echthaar“ wird angezeigt: Herkunftsnachweis (Lieferantenbelege) bereithalten" });
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
