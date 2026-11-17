/**
 * Prüft, ob alle Pflichtangaben für den Livegang vorliegen.
 *
 *   npm run check:launch        → listet Fehlendes, Exit-Code 1 solange etwas Blockierendes fehlt
 *   node scripts/check-launch.ts --ci
 *                               → Teil von `npm run build`: warnt nur, AUSSER bei VERCEL_ENV=production.
 *                                 Dann bricht der Build (und damit der Production-Deploy) ab.
 *
 * Wird direkt mit Node (Type Stripping, Node ≥ 22.18) ausgeführt, ohne Bundler.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { company, missingCompanyFields } from "../src/config/company.ts";

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
