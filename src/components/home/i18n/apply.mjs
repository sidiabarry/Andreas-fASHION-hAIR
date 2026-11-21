// Schreibt die Texte der Startseite (hero.*, home.*) und von „Über Andrea“ (about.*) in die
// Nachrichtendateien. Aufruf: node src/components/home/i18n/apply.mjs
// Sprachen ohne Nachrichtendatei (noch nicht freigeschaltet) werden übersprungen und gemeldet.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(here, "../../../messages");

for (const file of readdirSync(here).filter((f) => /^[a-z]{2}\.mjs$/.test(f))) {
  const locale = file.slice(0, 2);
  const target = join(messagesDir, `${locale}.json`);
  if (!existsSync(target)) {
    console.warn(`übersprungen: ${locale} (keine src/messages/${locale}.json)`);
    continue;
  }
  const texts = await import(pathToFileURL(join(here, file)).href);
  const messages = JSON.parse(readFileSync(target, "utf8"));
  // hero.ctaCollection nutzen auch Warenkorb und Kasse: Er steht deshalb in jeder Quelldatei.
  messages.hero = texts.hero;
  messages.home = texts.home;
  messages.about = texts.about;
  writeFileSync(target, `${JSON.stringify(messages, null, 2)}\n`);
  process.stdout.write(`geschrieben: ${locale}\n`);
}
