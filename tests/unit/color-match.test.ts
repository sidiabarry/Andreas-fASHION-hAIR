import assert from "node:assert/strict";
import { test } from "node:test";

import { deltaE2000, estimateHairLab, hexToLab, matchPercent, rgbToLab } from "@/lib/color-match";
import { hairColorHex } from "@/lib/hair-colors";

test("Farbe: Lab-Grundwerte", () => {
  const white = rgbToLab(255, 255, 255);
  assert.ok(Math.abs(white.l - 100) < 0.1 && Math.abs(white.a) < 0.1 && Math.abs(white.b) < 0.1);
  assert.ok(rgbToLab(0, 0, 0).l < 0.1);
});

test("Farbe: CIEDE2000 gegen Referenzwerte (Sharma 2005)", () => {
  const de = deltaE2000({ a: 2.6772, b: -79.7751, l: 50 }, { a: 0, b: -82.7485, l: 50 });
  assert.ok(Math.abs(de - 2.0425) < 0.001, String(de));
  assert.equal(deltaE2000({ a: 5, b: 5, l: 40 }, { a: 5, b: 5, l: 40 }), 0);
});

test("Farbe: Nähe in Prozent", () => {
  const dark = hexToLab("#3a2a20");
  assert.equal(matchPercent(deltaE2000(dark, dark)), 100);
  assert.ok(matchPercent(deltaE2000(dark, hexToLab("#dcc58f"))) < 40);
  assert.ok(matchPercent(deltaE2000(hexToLab("#c8a55a"), hexToLab("#c9a66b"))) > 90);
});

test("Farbe: Haarfarbe aus Pixeln, Haut und Lichter ignoriert", () => {
  const w = 20;
  const h = 20;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i += 1) {
    const x = i % w;
    const px = x < 2 ? [240, 205, 180] : x > 17 ? [255, 255, 255] : [58, 42, 32];
    data.set([...px, 255], i * 4);
  }
  const lab = estimateHairLab(data, w, h);
  assert.ok(lab);
  assert.ok(deltaE2000(lab, hexToLab("#3a2a20")) < 2);
  assert.equal(estimateHairLab(new Uint8ClampedArray(16), 2, 2), null);
});

test("Farbe: Katalogtext → Farbton", () => {
  assert.equal(hairColorHex("Dunkelbraun"), "#3a2a20");
  assert.equal(hairColorHex("Blond mit Reflexen und dunklem Goldblond"), "#c9a66b");
  assert.equal(hairColorHex(""), null);
  assert.equal(hairColorHex("unbekannt"), null);
});
