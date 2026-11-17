#!/usr/bin/env node
/**
 * Rendert Favicons (PNG) und das Open-Graph-Bild aus dem Vektor-Phönix.
 * Benötigt Playwright (z. B. NODE_PATH=/opt/node-tools/node_modules). Einmalig ausführen,
 * Ergebnis wird eingecheckt: src/app/apple-icon.png, public/icon-192.png, public/icon-512.png, public/og.png
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public/assets/brand/phoenix.svg"), "utf8");
const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();

async function icon(size, file, pad = 0.12) {
  await page.setViewportSize({ height: size, width: size });
  await page.setContent(
    `<html><body style="margin:0;background:#100e0d;display:grid;place-items:center;width:${size}px;height:${size}px">` +
      `<img src="${dataUrl}" style="width:${Math.round(size * (1 - pad * 2))}px;height:${Math.round(size * (1 - pad * 2))}px"></body></html>`,
  );
  await page.waitForTimeout(100);
  await page.screenshot({ path: join(root, file) });
}

await icon(180, "src/app/apple-icon.png");
await icon(192, "public/icon-192.png");
await icon(512, "public/icon-512.png");

await page.setViewportSize({ height: 630, width: 1200 });
await page.setContent(`<html><head><style>
  body{margin:0;width:1200px;height:630px;background:radial-gradient(ellipse at 30% 50%,#2a1d0c 0%,#100e0d 62%);display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box;font-family:Georgia,'Times New Roman',serif;color:#f4efe8}
  img{width:300px;height:300px}
  h1{margin:0;font-weight:500;font-size:54px;letter-spacing:.16em;text-transform:uppercase;color:#e8ae23;line-height:1.15}
  p{margin:18px 0 0;font-size:30px;font-style:italic;color:#e8ae23}
  small{display:block;margin-top:34px;font-family:Helvetica,Arial,sans-serif;font-size:24px;letter-spacing:.02em;color:#d8cfc6}
</style></head><body><img src="${dataUrl}"><div><h1>Andrea's<br>Fashion Hair</h1><p>HaarManufaktur</p><small>Echthaar-Topper, Perücken und Haarsysteme<br>Iserlohn · Made in Germany</small></div></body></html>`);
await page.waitForTimeout(150);
await page.screenshot({ path: join(root, "public/og.png") });
await browser.close();
console.log("brand assets rendered");
