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
