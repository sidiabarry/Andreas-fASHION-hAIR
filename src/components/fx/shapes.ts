/**
 * Formen für das Goldfeld. Jede Form liefert für n Teilchen Zielpunkte im Formraum
 * (x, y in -1..1, y nach oben, z = Tiefe -1..1) und eine Lebensart w:
 *   w = 0     ruhig (nur Atmen und Funkeln)
 *   w = 1 + t Strähne, t = 0 am Ansatz … 1 an der Spitze (wiegt sich, Spitzen stärker)
 */
export type ShapeName = "embers" | "phoenix" | "strands" | "weft" | "ring" | "thread" | "dust" | "halo";

export const SHAPES: ShapeName[] = ["embers", "phoenix", "strands", "weft", "ring", "thread", "dust", "halo"];

export function isShape(value: string | undefined | null): value is ShapeName {
  return Boolean(value) && (SHAPES as string[]).includes(value as string);
}

/** Deterministischer Zufall (mulberry32), damit Formen bei jedem Aufbau gleich aussehen. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: () => number) => {
  const u = Math.max(1e-6, r());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
};

type Out = Float32Array; // n * 4

function strandPoint(out: Out, i: number, x: number, y: number, z: number, t: number) {
  out[i * 4] = x;
  out[i * 4 + 1] = y;
  out[i * 4 + 2] = z;
  out[i * 4 + 3] = 1 + Math.min(1, Math.max(0, t));
}

function still(out: Out, i: number, x: number, y: number, z: number) {
  out[i * 4] = x;
  out[i * 4 + 1] = y;
  out[i * 4 + 2] = z;
  out[i * 4 + 3] = 0;
}

/** Glut am Boden: ein flacher, glühender Haufen mit aufsteigenden Funken darüber. */
function embers(n: number, out: Out) {
  const r = rng(11);
  for (let i = 0; i < n; i++) {
    if (r() < 0.62) {
      const a = r() * Math.PI * 2;
      const rad = Math.pow(r(), 0.6);
      still(out, i, Math.cos(a) * rad * 0.62, -0.78 + Math.sin(a) * rad * 0.1 + gauss(r) * 0.015, Math.sin(a) * rad * 0.6);
    } else {
      const h = Math.pow(r(), 1.8);
      still(out, i, gauss(r) * 0.28 * (1 - h * 0.4), -0.72 + h * 1.6, (r() - 0.5) * 1.2);
    }
  }
}

/** Phönix aus dem echten Logo (Alpha-Abtastung des SVG), mit leichter Tiefe. */
function phoenix(n: number, out: Out, samples: Float32Array | null) {
  const r = rng(23);
  if (!samples || samples.length < 4) {
    // Ersatz ohne Bild: zwei Flügelbögen und Körper
    for (let i = 0; i < n; i++) {
      const side = r() < 0.5 ? -1 : 1;
      const t = r();
      const feather = Math.floor(r() * 9) / 9;
      const x = side * (0.08 + t * 0.85 * (0.6 + feather * 0.4));
      const y = 0.1 + Math.sin(t * Math.PI * 0.9) * 0.55 * (0.5 + feather * 0.5) - t * 0.15;
      still(out, i, x + gauss(r) * 0.01, y + gauss(r) * 0.01, gauss(r) * 0.05);
    }
    return;
  }
  const count = samples.length / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * count);
    const x = samples[k * 2] + (r() - 0.5) * 0.006;
    const y = samples[k * 2 + 1] + (r() - 0.5) * 0.006;
    still(out, i, x, y, gauss(r) * 0.04 + x * 0.12);
  }
}

/** Fallendes Haar: Strähnen von einem Wirbel, die sich nach unten öffnen und wellen. */
function strands(n: number, out: Out) {
  const r = rng(37);
  const K = 90;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * K);
    const kr = rng(1000 + k);
    const u = k / (K - 1) - 0.5;
    const phase = kr() * Math.PI * 2;
    const len = 1.45 + kr() * 0.45;
    const t = Math.pow(r(), 0.85);
    const x0 = u * 0.9;
    const y0 = 0.82 - u * u * 1.1;
    const curl = 0.07 + kr() * 0.09;
    const x = x0 + u * t * 0.9 + Math.sin(t * 5.2 + phase) * curl * t + gauss(r) * 0.004;
    const y = y0 - t * len + Math.cos(t * 3 + phase) * 0.02;
    strandPoint(out, i, x, y, (kr() - 0.5) * 0.9 + Math.sin(t * 4 + phase) * 0.15, t);
  }
}

/** Extension-Tresse: oben eine feine Naht, darunter hängende Strähnen in Wellen. */
function weft(n: number, out: Out) {
  const r = rng(41);
  const K = 120;
  for (let i = 0; i < n; i++) {
    if (r() < 0.16) {
      const x = (r() - 0.5) * 1.7;
      still(out, i, x, 0.62 + gauss(r) * 0.012 + Math.sin(x * 2) * 0.015, gauss(r) * 0.03);
      continue;
    }
    const k = Math.floor(r() * K);
    const kr = rng(2000 + k);
    const x0 = (k / (K - 1) - 0.5) * 1.7;
    const phase = kr() * Math.PI * 2;
    const len = 1.35 + kr() * 0.35;
    const t = Math.pow(r(), 0.9);
    const x = x0 + Math.sin(t * 6.5 + phase) * 0.05 * t + Math.sin(t * 2 + x0 * 3) * 0.06 * t;
    strandPoint(out, i, x + gauss(r) * 0.003, 0.6 - t * len, (kr() - 0.5) * 0.4, t);
  }
}

/** Spiegelring: geneigter Kreis aus Licht mit feinem Hof. */
function ring(n: number, out: Out) {
  const r = rng(53);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const halo = r() < 0.14;
    const rad = halo ? 0.86 + Math.abs(gauss(r)) * 0.12 : 0.86 + gauss(r) * 0.012;
    still(out, i, Math.cos(a) * rad, Math.sin(a) * rad * 0.94, Math.sin(a) * 0.35 + (halo ? gauss(r) * 0.2 : 0));
  }
}

/** Goldener Faden über die ganze Breite (drei Schritte). */
function thread(n: number, out: Out) {
  const r = rng(61);
  for (let i = 0; i < n; i++) {
    const x = (r() - 0.5) * 3.6;
    const strand = Math.floor(r() * 5);
    const y = Math.sin(x * 1.6 + strand * 0.35) * 0.09 + (strand - 2) * 0.012 + gauss(r) * 0.006;
    strandPoint(out, i, x, y, (strand - 2) * 0.1 + gauss(r) * 0.02, (x + 1.8) / 3.6);
  }
}

/** Ruhiger Funkenstaub, weit verteilt. */
function dust(n: number, out: Out) {
  const r = rng(71);
  for (let i = 0; i < n; i++) still(out, i, (r() - 0.5) * 3.2, (r() - 0.5) * 2.2, (r() - 0.5) * 2);
}

/** Kleiner Lichthof (Porträt): weiche Kugel mit dichter Mitte. */
function halo(n: number, out: Out) {
  const r = rng(79);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.pow(r(), 0.45) * 0.9;
    still(out, i, Math.cos(a) * rad, Math.sin(a) * rad, gauss(r) * 0.3);
  }
}

export function buildShape(name: ShapeName, n: number, samples: Float32Array | null): Float32Array {
  const out = new Float32Array(n * 4);
  switch (name) {
    case "embers":
      embers(n, out);
      break;
    case "phoenix":
      phoenix(n, out, samples);
      break;
    case "strands":
      strands(n, out);
      break;
    case "weft":
      weft(n, out);
      break;
    case "ring":
      ring(n, out);
      break;
    case "thread":
      thread(n, out);
      break;
    case "dust":
      dust(n, out);
      break;
    case "halo":
      halo(n, out);
      break;
  }
  return out;
}

/**
 * Tastet das Logo ab: zeichnet das SVG auf eine kleine Leinwand und sammelt deckende Pixel.
 * Ergebnis: Paare (x, y) in -1..1, y nach oben. Läuft nur im Browser.
 */
export async function samplePhoenix(src: string, size = 360): Promise<Float32Array | null> {
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const pts: number[] = [];
    let minX = size, maxX = 0, minY = size, maxY = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (data[(y * size + x) * 4 + 3] > 140) {
          pts.push(x, y);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (pts.length < 200) return null;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const half = Math.max(maxX - minX, maxY - minY) / 2;
    const out = new Float32Array(pts.length);
    for (let i = 0; i < pts.length; i += 2) {
      out[i] = (pts[i] - cx) / half;
      out[i + 1] = -(pts[i + 1] - cy) / half;
    }
    return out;
  } catch {
    return null;
  }
}
