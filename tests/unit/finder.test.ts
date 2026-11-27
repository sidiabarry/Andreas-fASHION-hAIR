import assert from "node:assert/strict";
import { test } from "node:test";

import { METHOD_IDS } from "@/lib/collection";
import { rankMethods } from "@/lib/finder";

const shop = new Set(["clip", "thin", "genius", "butterfly", "invisible"] as const);

test("Finder: Selbst einsetzen ergibt immer Clip-in", () => {
  for (const hair of ["fine", "medium", "curly"] as const) {
    for (const goal of ["occasion", "volume", "updo", "flat"] as const) {
      assert.deepEqual(rankMethods({ goal, hair, who: "self" }, shop), ["clip"]);
    }
  }
});

test("Finder: feste Methoden nie Clip-in, immer zwei verschiedene Vorschläge", () => {
  for (const hair of ["fine", "medium", "curly"] as const) {
    for (const goal of ["occasion", "volume", "updo", "flat"] as const) {
      const result = rankMethods({ goal, hair, who: "pro" }, shop);
      assert.equal(result.length, 2);
      assert.notEqual(result[0], result[1]);
      assert.ok(!result.includes("clip"));
      for (const id of result) assert.ok((METHOD_IDS as readonly string[]).includes(id));
    }
  }
});

test("Finder: Locken führen zum Tressenband, Hochstecken zu Tape oder Bondings", () => {
  assert.equal(rankMethods({ goal: "volume", hair: "curly", who: "pro" }, shop)[0], "thin");
  assert.ok(["invisible", "keratin"].includes(rankMethods({ goal: "updo", hair: "fine", who: "pro" }, shop)[0]));
  assert.equal(rankMethods({ goal: "volume", hair: "medium", who: "pro" }, shop)[0], "butterfly");
});
