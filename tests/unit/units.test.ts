import assert from "node:assert/strict";
import { test } from "node:test";

import { formatDimensions, formatLength, parseBaseCm, parseLengthCm } from "@/lib/units";
import { buildAndreaMessage, buildAndreaWhatsAppUrl, whatsappNumber } from "@/lib/whatsapp";

test("Einheiten: cm und Zoll", () => {
  assert.equal(formatLength(45, "cm", "de"), "45 cm");
  assert.equal(formatLength(45, "in", "de"), "17,7 in");
  assert.equal(formatDimensions(11, 9, "cm", "de"), "11 × 9 cm");
  assert.equal(formatDimensions(11, 9, "in", "en"), "4.3 × 3.5 in");
});

test("Einheiten: Katalogfelder lesen", () => {
  assert.equal(parseLengthCm("45"), 45);
  assert.equal(parseLengthCm("30,5"), 30.5);
  assert.equal(parseLengthCm(""), null);
  assert.deepEqual(parseBaseCm("11 x 9"), { height: 9, width: 11 });
  assert.deepEqual(parseBaseCm("9 × 11 cm"), { height: 11, width: 9 });
  assert.equal(parseBaseCm("rund"), null);
});

test("WhatsApp: Nummer, Text und Link", () => {
  assert.equal(whatsappNumber("+4917623681585"), "4917623681585");
  const text = buildAndreaMessage({ base: "11 x 9", heightCm: 168, length: "45 cm", name: "Echthaar-Topper 45 cm", price: "590,00 €", subtitle: "Helles Aschblond" });
  assert.match(text, /Echthaar-Topper 45 cm, Helles Aschblond/);
  assert.match(text, /590,00 € · Länge 45 cm · Basis 11 x 9/);
  assert.match(text, /Körpergröße: 168 cm/);
  const url = buildAndreaWhatsAppUrl("+4917623681585", { name: "A" });
  assert.ok(url.startsWith("https://wa.me/4917623681585?text="));
});

import { appendVideoRequest, VIDEO_REQUEST_LINE } from "@/lib/video-note";

test("Packtisch-Video: Wunsch wird angehängt und passt in die Grenze", () => {
  assert.equal(appendVideoRequest("Frage zur Farbe", 800), `Frage zur Farbe\n\n${VIDEO_REQUEST_LINE}`);
  assert.equal(appendVideoRequest("", 800), VIDEO_REQUEST_LINE);
  const long = appendVideoRequest("x".repeat(900), 800);
  assert.ok(long.length <= 800 && long.endsWith(VIDEO_REQUEST_LINE));
});
