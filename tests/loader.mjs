/**
 * Node-Testlader: löst "@/..." nach src/ auf, ergänzt fehlende .ts/.tsx-Endungen
 * und lädt JSON-Dateien ohne Import-Attribute. Nur für `npm test` (node --test).
 */
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const src = new URL("../src/", ${JSON.stringify(import.meta.url)});
const candidates = (base) => [base, base + ".ts", base + ".tsx", base + "/index.ts"];
export async function resolve(specifier, context, next) {
  let target = null;
  if (specifier.startsWith("@/")) target = new URL(specifier.slice(2), src);
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) target = new URL(specifier, context.parentURL);
  if (target) {
    for (const candidate of candidates(fileURLToPath(target))) {
      if (existsSync(candidate) && !candidate.endsWith("/")) {
        try { if ((await import("node:fs")).statSync(candidate).isFile()) return { url: pathToFileURL(candidate).href, shortCircuit: true }; } catch {}
      }
    }
  }
  if (specifier === "server-only") return { url: "data:text/javascript,export {}", shortCircuit: true };
  return next(specifier, context);
}
export async function load(url, context, next) {
  if (url.endsWith(".json")) {
    const { readFileSync } = await import("node:fs");
    return { format: "module", source: "export default " + readFileSync(fileURLToPath(url), "utf8"), shortCircuit: true };
  }
  return next(url, context);
}
`),
);
