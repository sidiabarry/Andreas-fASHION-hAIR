import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { siteMode } from "@/server/mode";

const KEYS = ["VERCEL_ENV", "NODE_ENV", "AFH_DEMO", "RESEND_API_KEY", "MAIL_FROM", "MAIL_TO_OWNER", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CHECKOUT_CLOSED"] as const;
const saved = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
const env = process.env as Record<string, string | undefined>;

/** Setzt genau diese Umgebung (alles andere leer) und liefert die Betriebsart. */
function modeWith(values: Partial<Record<(typeof KEYS)[number], string>>) {
  for (const key of KEYS) delete env[key];
  for (const [key, value] of Object.entries(values)) env[key] = value;
  return siteMode();
}

const LIVE = { RESEND_API_KEY: "k", MAIL_FROM: "a <a@b.de>", MAIL_TO_OWNER: "o@b.de", SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "s" };

afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete env[key];
    else env[key] = saved[key];
  }
});

test("Production ohne Datenbank und Mail: Kasse zu, kein Demo", () => {
  const mode = modeWith({ VERCEL_ENV: "production" });
  assert.deepEqual([mode.production, mode.demo, mode.checkoutOpen, mode.mail], [true, false, false, false]);
});

test("Production mit Datenbank und Mail: Kasse offen", () => {
  const mode = modeWith({ VERCEL_ENV: "production", ...LIVE });
  assert.deepEqual([mode.production, mode.demo, mode.checkoutOpen, mode.mail], [true, false, true, true]);
});

test("Production: es genügt nicht, nur die Datenbank oder nur die Mail einzurichten", () => {
  assert.equal(modeWith({ VERCEL_ENV: "production", SUPABASE_URL: LIVE.SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: LIVE.SUPABASE_SERVICE_ROLE_KEY }).checkoutOpen, false);
  assert.equal(modeWith({ VERCEL_ENV: "production", RESEND_API_KEY: LIVE.RESEND_API_KEY, MAIL_FROM: LIVE.MAIL_FROM, MAIL_TO_OWNER: LIVE.MAIL_TO_OWNER }).checkoutOpen, false);
  assert.equal(modeWith({ VERCEL_ENV: "production", ...LIVE, MAIL_TO_OWNER: "" }).checkoutOpen, false);
});

test("Notbremse CHECKOUT_CLOSED=1 schließt nur die Kasse; Mail bleibt an", () => {
  const mode = modeWith({ VERCEL_ENV: "production", ...LIVE, CHECKOUT_CLOSED: "1" });
  assert.deepEqual([mode.production, mode.checkoutOpen, mode.mail], [true, false, true]);
  assert.equal(modeWith({ VERCEL_ENV: "production", ...LIVE, CHECKOUT_CLOSED: "0" }).checkoutOpen, true, "nur „1“ schaltet die Notbremse");
});

test("Vorschau auf Vercel ist immer Demo mit offener Kasse, auch wenn Variablen gesetzt sind", () => {
  const mode = modeWith({ VERCEL_ENV: "preview", ...LIVE });
  assert.deepEqual([mode.production, mode.demo, mode.checkoutOpen], [false, true, true]);
});

test("Außerhalb von Vercel: next start ist Production, AFH_DEMO=1 macht daraus Demo", () => {
  assert.equal(modeWith({ NODE_ENV: "production" }).production, true);
  const demo = modeWith({ NODE_ENV: "production", AFH_DEMO: "1" });
  assert.deepEqual([demo.production, demo.demo, demo.checkoutOpen], [false, true, true]);
});
