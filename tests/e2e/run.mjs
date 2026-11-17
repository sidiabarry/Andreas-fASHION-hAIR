#!/usr/bin/env node
/**
 * End-to-End-Prüfung gegen einen laufenden Production-Build.
 *
 *   npm run build && AFH_DEMO=1 npm run start -- -p 3500      (Demo: komplette Kasse)
 *   NODE_PATH=/pfad/zu/playwright/node_modules npm run test:e2e
 *
 *   BASE=http://localhost:3500   Ziel (Standard)
 *   --production                 prüft stattdessen einen Server OHNE AFH_DEMO (Kasse geschlossen)
 *   --only=<gruppe>              redirects|locale|pages|keyboard|flow|motion|production
 *
 * Playwright wird aus NODE_PATH geladen (nicht als Abhängigkeit installiert).
 */
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = process.env.BASE ?? "http://localhost:3500";
const production = process.argv.includes("--production");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const out = join(root, "tests/e2e/output");
mkdirSync(out, { recursive: true });

const LOCALES = ["de", "en"];
const failures = [];
let passed = 0;
const check = (ok, label) => {
  if (ok) passed++;
  else failures.push(label);
  if (!ok) console.log(`  ✗ ${label}`);
};
const group = (name) => !only || only === name;

const catalog = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8"));
const live = JSON.parse(readFileSync(join(root, "src/data/live-products-2026-11.json"), "utf8"));
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js", { paths: [root] }), "utf8");

const VIEWPORTS = [
  { name: "320", opts: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  { name: "390", opts: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } } },
  { name: "768", opts: { viewport: { width: 768, height: 1024 } } },
  { name: "1440", opts: { viewport: { width: 1440, height: 900 } } },
];

const PAGES = [
  "/", "/kollektion", "/kollektion?kategorie=pflege", `/produkt/${catalog[0].slug}`, "/produkt/walker-tape-c-22-loesungsmittel-222",
  "/warenkorb", "/kasse", "/anfrage", "/ueber-andrea", "/kontakt", "/impressum", "/datenschutz", "/agb", "/widerruf",
  "/widerruf/erklaeren", "/versand-und-zahlung", "/gibt-es-nicht",
];

async function redirects() {
  console.log("Weiterleitungen");
  const get = (path, headers = {}) => fetch(BASE + path, { headers, redirect: "manual" });
  const bySlug = new Map(catalog.map((p) => [p.id, p.slug]));
  for (const old of live) {
    const raw = decodeURIComponent(old.slug);
    const res = await get(`/product/${encodeURIComponent(raw)}`);
    check(res.status === 308 && res.headers.get("location") === `/de/produkt/${bySlug.get(old.id)}`, `Produkt ${old.slug} → ${res.status} ${res.headers.get("location")}`);
  }
  const pages = {
    "/about": "/de/ueber-andrea", "/categories": "/de/kollektion", "/contact": "/de/kontakt", "/my-account": "/de/kollektion",
    "/privacy": "/de/datenschutz", "/product-category/curtain-bangs": "/de/kollektion?kategorie=pony",
    "/product-category/mannerhaarsysteme": "/de/kollektion?kategorie=maenner", "/product-category/prosthetics": "/de/kollektion?kategorie=maenner",
    "/product-category/toppers": "/de/kollektion?kategorie=topper", "/product-category/toppers/page/2": "/de/kollektion?kategorie=topper",
    "/product-category/wartungsprodukte": "/de/kollektion?kategorie=pflege", "/products": "/de/kollektion", "/products/page/3": "/de/kollektion",
    "/shipping-returns": "/de/versand-und-zahlung", "/terms": "/de/agb", "/wishlist": "/de/kollektion", "/product/unbekannt-xyz": "/de/kollektion",
  };
  for (const [from, to] of Object.entries(pages)) {
    const res = await get(from);
    check(res.status === 308 && res.headers.get("location") === to, `${from} → ${res.status} ${res.headers.get("location")}`);
  }
}

async function locale() {
  console.log("Spracherkennung");
  const cases = [
    [{ "accept-language": "de-DE,de;q=0.9" }, "/de"],
    [{ "accept-language": "en-US,en;q=0.9,de;q=0.5" }, "/en"],
    [{ "accept-language": "ja-JP", "x-vercel-ip-country": "AT" }, "/de"],
    [{ "accept-language": "ja-JP", "x-vercel-ip-country": "US" }, "/en"],
    [{ "x-vercel-ip-country": "CH" }, "/de"],
    [{ "x-vercel-ip-country": "JP" }, "/en"],
    [{ "accept-language": "de", cookie: "NEXT_LOCALE=en" }, "/en"],
  ];
  for (const [headers, expected] of cases) {
    const res = await fetch(`${BASE}/`, { headers, redirect: "manual" });
    check(res.status === 307 && res.headers.get("location")?.endsWith(expected), `Erkennung ${JSON.stringify(headers)} → ${res.headers.get("location")}`);
    check(!res.headers.get("set-cookie"), `kein Cookie bei Erkennung ${JSON.stringify(headers)}`);
  }
  const deep = await fetch(`${BASE}/kollektion?kategorie=pony`, { headers: { "accept-language": "en" }, redirect: "manual" });
  check(deep.headers.get("location")?.endsWith("/en/kollektion?kategorie=pony"), "Unterseite behält Pfad und Query");

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: "de-DE" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/de/kollektion`);
  check((await page.getAttribute("html", "lang")) === "de", "html lang=de");
  const alternates = await page.$$eval('link[rel="alternate"][hreflang]', (els) => els.map((e) => [e.getAttribute("hreflang"), e.getAttribute("href")]));
  for (const l of [...LOCALES, "x-default"]) check(alternates.some(([h]) => h === l), `hreflang ${l} vorhanden`);
  check((await ctx.cookies()).every((c) => c.name !== "NEXT_LOCALE"), "vor der Wahl kein Sprach-Cookie");
  await page.click("footer .af-locale summary");
  await page.click('footer .af-locale a[hreflang="en"]');
  await page.waitForURL(/\/en\/kollektion/);
  check((await page.getAttribute("html", "lang")) === "en", "Umschalter → /en, html lang=en");
  check((await ctx.cookies()).some((c) => c.name === "NEXT_LOCALE" && c.value === "en"), "nach Wahl Cookie NEXT_LOCALE=en");
  await browser.close();
}

async function pages() {
  console.log("Seiten × Viewports (Überlauf, Konsole, Ressourcen, CLS, axe)");
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ ...vp.opts, bypassCSP: false });
    await ctx.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
      }).observe({ buffered: true, type: "layout-shift" });
    });
    const page = await ctx.newPage();
    const problems = [];
    page.on("console", (m) => {
      // Die 404-Seite meldet ihren eigenen Status als Konsolenfehler: erwartet
      if (m.type() === "error" && !(page.url().includes("/gibt-es-nicht") && m.text().includes("404"))) problems.push(`console: ${m.text().slice(0, 160)}`);
    });
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().includes("/gibt-es-nicht")) problems.push(`${r.status()} ${r.url()}`);
    });
    for (const locale of LOCALES) {
      for (const path of PAGES) {
        const url = `${BASE}/${locale}${path === "/" ? "" : path}`;
        problems.length = 0;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.mouse.wheel(0, 1600);
        await page.waitForTimeout(250);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(250);
        const width = vp.opts.viewport.width;
        const overflow = await page.evaluate((w) => Math.max(document.documentElement.scrollWidth, window.innerWidth) - w, width);
        const cls = await page.evaluate(() => window.__cls);
        check(overflow <= 0, `${vp.name} ${locale}${path}: horizontaler Überlauf ${overflow}px`);
        check(problems.length === 0, `${vp.name} ${locale}${path}: ${problems.join(" | ")}`);
        check(cls < 0.02, `${vp.name} ${locale}${path}: CLS ${cls.toFixed(3)}`);
        check((await page.locator("h1").count()) === 1, `${vp.name} ${locale}${path}: genau eine h1`);
        check((await page.locator('a[href="#"], a[href=""]').count()) === 0, `${vp.name} ${locale}${path}: leere Links`);
        if (production) check((await page.locator("mark[data-missing]").count()) === 0, `${locale}${path}: Marker fehlender Angaben in Production`);
        if (vp.name === "390" || vp.name === "1440") {
          await page.screenshot({ path: join(out, `${vp.name}-${locale}${path.replace(/[/?=]/g, "_")}.png`) });
        }
      }
    }
    await ctx.close();
  }
  // axe-core (eigener Kontext ohne CSP, damit das Prüfskript eingefügt werden darf)
  for (const vp of [VIEWPORTS[1], VIEWPORTS[3]]) {
    const ctx = await browser.newContext({ ...vp.opts, bypassCSP: true });
    const page = await ctx.newPage();
    for (const locale of LOCALES) {
      for (const path of PAGES) {
        await page.goto(`${BASE}/${locale}${path === "/" ? "" : path}`, { waitUntil: "networkidle" });
        await page.evaluate(axeSource);
        const result = await page.evaluate(() =>
          window.axe.run(document, { resultTypes: ["violations"], runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }),
        );
        const serious = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        check(serious.length === 0, `axe ${vp.name} ${locale}${path}: ${serious.map((v) => `${v.id} (${v.nodes.length}: ${v.nodes[0]?.target})`).join(", ")}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
}

async function keyboard() {
  console.log("Tastatur");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/de`);
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => ({ cls: document.activeElement?.className, text: document.activeElement?.textContent }));
  check(first.cls === "af-skip", `erster Tab-Halt ist der Skip-Link (${first.cls})`);
  await page.waitForTimeout(300);
  const skipVisible = await page.evaluate(() => document.activeElement.getBoundingClientRect().top >= 0);
  check(skipVisible, "Skip-Link wird bei Fokus sichtbar");
  await page.keyboard.press("Enter");
  check(await page.evaluate(() => document.activeElement?.id === "inhalt" || location.hash === "#inhalt"), "Skip-Link springt zum Inhalt");
  const outlines = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    outlines.push(await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, visible: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2 };
    }));
  }
  check(outlines.every((o) => o.visible), `sichtbarer Fokus: ${JSON.stringify(outlines.filter((o) => !o.visible))}`);
  // Reiter im Finder mit Pfeiltasten
  await page.goto(`${BASE}/de#finden`);
  await page.focus('[role="tab"][aria-selected="true"]');
  await page.keyboard.press("ArrowRight");
  check(await page.evaluate(() => document.activeElement.getAttribute("aria-selected") === "true" && document.activeElement.id.endsWith("peruecken")), "Reiter: Pfeil rechts wählt nächsten");
  // Mobiles Menü mit Escape schließen
  const mobile = await browser.newPage({ ...devices["iPhone 13"] });
  await mobile.goto(`${BASE}/de`);
  await mobile.click(".af-menu");
  check(await mobile.isVisible("#af-sheet"), "Menü öffnet");
  await mobile.keyboard.press("Escape");
  check(!(await mobile.isVisible("#af-sheet")), "Escape schließt Menü");
  await browser.close();
}

async function placeOrder(page, slug, add = true, locale = "de") {
  if (add) {
    await page.goto(`${BASE}/${locale}/produkt/${slug}`, { waitUntil: "networkidle" });
    await page.click(".af-cta-add");
    await page.waitForSelector(".af-drawer[open]");
    await page.keyboard.press("Escape");
  }
  await page.goto(`${BASE}/${locale}/kasse`, { waitUntil: "networkidle" });
  await page.waitForSelector("#f-name");
  await page.waitForTimeout(2100); // Bot-Schutz: mind. 2 s
  await page.fill("#f-name", "Erika Mustermann");
  await page.fill("#f-email", "erika@example.org");
  await page.fill("#f-street", "Musterweg 1");
  await page.fill("#f-postalCode", "58642");
  await page.fill("#f-city", "Iserlohn");
  await page.check("#agb");
}

async function flow() {
  console.log("Kaufablauf (Demo)");
  const browser = await chromium.launch();
  // Zufälliges Einzelstück: Der Demo-Store behält Verkäufe, solange der Server läuft
  const pool = catalog.filter((p) => !p.sold && !p.madeToOrder && p.category !== "pflege");
  const slug = pool[Math.floor(Math.random() * pool.length)].slug;
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  // Pflichtfeld-Fehler sichtbar und angekündigt
  await a.goto(`${BASE}/de/produkt/${slug}`, { waitUntil: "networkidle" });
  await a.click(".af-cta-add");
  await a.waitForSelector(".af-drawer[open]");
  check(await a.isVisible(".af-drawer >> text=Zur Kasse"), "Warenkorb-Schublade öffnet sich nach dem Hinzufügen");
  await a.keyboard.press("Escape");
  await a.goto(`${BASE}/de/kasse`, { waitUntil: "networkidle" });
  await a.click('main form button[type="submit"]');
  check(await a.isVisible('[role="alert"]'), "Fehlerzusammenfassung bei leerem Formular");
  check((await a.locator('[aria-invalid="true"]').count()) >= 5, "Felder als ungültig markiert");
  // Zwei Kundinnen gleichzeitig dasselbe Einzelstück
  await placeOrder(a, slug, false);
  await placeOrder(b, slug);
  const buttonText = await a.textContent('main form button[type="submit"]');
  check(buttonText?.trim() === "Zahlungspflichtig bestellen", `Bestellknopf beschriftet: ${buttonText}`);
  check(await a.isVisible("text=Gesamtsumme"), "Übersicht zeigt Gesamtsumme");
  await Promise.all([a.click('main form button[type="submit"]'), b.click('main form button[type="submit"]')]);
  await a.waitForTimeout(2500);
  const urls = [a.url(), b.url()];
  const okCount = urls.filter((u) => /\/bestellung\/AF-[A-Z0-9]{6}\?code=/.test(u)).length;
  check(okCount === 1, `genau eine Bestellung erfolgreich (${urls.join(" , ")})`);
  const loser = /\/bestellung\//.test(urls[0]) ? b : a;
  const winner = loser === a ? b : a;
  check(await loser.isVisible('[role="alert"]'), "zweite Bestellung wird abgelehnt (Hinweis sichtbar)");
  check(await winner.isVisible("text=Vertrag widerrufen"), "Bestätigung verlinkt „Vertrag widerrufen“");
  await winner.screenshot({ path: join(out, "flow-confirmation.png"), fullPage: true });
  // Bestätigung ohne gültigen Code nicht abrufbar
  const confirmation = new URL(winner.url());
  const c = await (await browser.newContext()).newPage();
  await c.goto(`${BASE}${confirmation.pathname}?code=falsch-falsch-falsch-falsch`);
  check(await c.isVisible("text=Diese Bestellung finden wir nicht."), "Bestätigung mit falschem Code gesperrt");
  // Verkauft-Markierung in der Kollektion
  await c.goto(`${BASE}/de/produkt/${slug}`);
  check(await c.isVisible("text=Dieses Stück hat bereits sein Zuhause gefunden."), "Stück ist danach für alle verkauft");
  // Widerruf: zwei Schritte
  await c.goto(`${BASE}/de/widerruf/erklaeren`, { waitUntil: "networkidle" });
  await c.waitForTimeout(2100);
  await c.fill("#f-name", "Erika Mustermann");
  await c.fill("#f-email", "erika@example.org");
  await c.fill("#f-orderNumber", "AF-TEST01");
  await c.click('form button[type="submit"]');
  check(await c.isVisible('button:has-text("Widerruf bestätigen")'), "Widerruf: Bestätigungsschritt");
  await c.click('button:has-text("Widerruf bestätigen")');
  await c.waitForSelector("text=Ihr Widerruf ist bei uns eingegangen.");
  check(true, "Widerruf eingegangen");
  // Anfrage
  await c.goto(`${BASE}/de/anfrage`, { waitUntil: "networkidle" });
  await c.waitForTimeout(2100);
  await c.fill("#f-name", "Erika Mustermann");
  await c.fill("#f-email", "erika@example.org");
  await c.fill("#f-message", "Ich suche einen Topper in Mittelbraun.");
  await c.check("#privacy");
  await c.click('form button[type="submit"]');
  check(await c.waitForSelector("text=Danke. Andrea meldet sich bei Ihnen.").then(() => true).catch(() => false), "Anfrage gesendet (Demo)");
  await browser.close();
}

async function motion() {
  console.log("Reduzierte Bewegung");
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const media = [];
  page.on("request", (r) => r.url().endsWith(".mp4") && media.push(r.url()));
  await page.goto(`${BASE}/de`, { waitUntil: "networkidle" });
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(3000);
  check(media.length === 0, `keine Videos bei prefers-reduced-motion (${media.length})`);
  check((await page.locator("video").count()) === 0, "kein <video> im DOM");
  check(await page.locator("main img").first().isVisible(), "Standbild sichtbar");
  await browser.close();
}

async function productionMode() {
  console.log("Production-Modus (Kasse geschlossen)");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${BASE}/de/kasse`);
  check(await page.isVisible("text=Die Online-Kasse ist gerade geschlossen."), "Kasse geschlossen");
  check((await page.locator(".af-demo").count()) === 0, "kein Demo-Hinweis");
  await page.goto(`${BASE}/de/produkt/${catalog[0].slug}`, { waitUntil: "networkidle" });
  await page.click(".af-cta-add");
  await page.goto(`${BASE}/de/warenkorb`);
  check(await page.isVisible("text=Bestellen derzeit per Anfrage"), "Warenkorb: Bestellen per Anfrage");
  await page.goto(`${BASE}/de/anfrage`);
  const mail = Boolean(process.env.RESEND_API_KEY);
  check(mail || (await page.isVisible("text=Das Formular ist gerade nicht erreichbar.")), "ohne Mail-Dienst kein Formular, sondern Kontaktwege");
  check(await page.isVisible('a[href^="tel:"]'), "Telefon-Link sichtbar");
  const res = await fetch(`${BASE}/de/bestellung/AF-AAAAAA?code=x`);
  check(res.status === 200, "Bestätigungsseite antwortet ohne Fehler");
  await browser.close();
}

if (production) {
  if (group("production")) await productionMode();
  if (group("pages")) await pages();
} else {
  if (group("redirects")) await redirects();
  if (group("locale")) await locale();
  if (group("keyboard")) await keyboard();
  if (group("motion")) await motion();
  if (group("flow")) await flow();
  if (group("pages")) await pages();
}

console.log(`\n${passed} bestanden, ${failures.length} fehlgeschlagen`);
if (failures.length) process.exit(1);
