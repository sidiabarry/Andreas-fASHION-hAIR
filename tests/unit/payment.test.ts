import assert from "node:assert/strict";
import { test } from "node:test";

import { company } from "@/config/company";
import { epcAmount, epcPayload, formatIban, ibanValid } from "@/lib/payment";

test("GiroCode: IBAN der Inhaberin ist gültig", () => {
  assert.ok(company.bank);
  assert.ok(ibanValid(company.bank.iban));
  assert.equal(ibanValid("DE22370605900002436799"), false);
});

test("GiroCode: IBAN lesbar in Vierergruppen", () => {
  assert.equal(formatIban("DE22370605900002436798"), "DE22 3706 0590 0002 4367 98");
});

test("GiroCode: Inhalt nach EPC069-12", () => {
  assert.equal(epcAmount(39000), "EUR390.00");
  assert.equal(epcAmount(1860), "EUR18.60");
  const payload = epcPayload({ cents: 39000, iban: "DE22 3706 0590 0002 4367 98", name: "Andreia Pereira Da Costa", reference: "AF-7K2M9Q" });
  const lines = payload.split("\n");
  assert.deepEqual(lines.slice(0, 4), ["BCD", "002", "1", "SCT"]);
  assert.equal(lines[6], "DE22370605900002436798");
  assert.equal(lines[7], "EUR390.00");
  assert.equal(lines[10], "AF-7K2M9Q");
  assert.ok(Buffer.byteLength(payload, "utf8") <= 331);
});

test("PayPal-Link: Empfängerin, Betrag, Währung und Bestellnummer vorausgefüllt", async () => {
  const { paypalCheckoutUrl } = await import("@/lib/payment");
  const url = new URL(paypalCheckoutUrl({ cents: 30600, email: "a.da.costa@gmx.de", itemName: "Bestellung AF-7K2M9Q", locale: "de", reference: "AF-7K2M9Q" }));
  assert.equal(url.origin + url.pathname, "https://www.paypal.com/cgi-bin/webscr");
  assert.equal(url.searchParams.get("cmd"), "_xclick");
  assert.equal(url.searchParams.get("business"), "a.da.costa@gmx.de");
  assert.equal(url.searchParams.get("amount"), "306.00");
  assert.equal(url.searchParams.get("currency_code"), "EUR");
  assert.equal(url.searchParams.get("invoice"), "AF-7K2M9Q");
  assert.equal(url.searchParams.get("lc"), "DE");
});
