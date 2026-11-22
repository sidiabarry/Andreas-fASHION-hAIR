/**
 * Modul 3: Haarfarbe lokal abgleichen. Alles läuft im Browser; ein Foto verlässt das Gerät nie.
 * sRGB → CIE-Lab (D65) und Farbabstand nach CIEDE2000.
 */
export type Lab = { l: number; a: number; b: number };

function linear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function rgbToLab(r: number, g: number, b: number): Lab {
  const lr = linear(r);
  const lg = linear(g);
  const lb = linear(b);
  const x = (lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375) / 0.95047;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175;
  const z = (lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041) / 1.08883;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return { a: 500 * (fx - fy), b: 200 * (fy - fz), l: 116 * fy - 16 };
}

export function hexToLab(hex: string): Lab {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new RangeError("hex");
  const n = parseInt(m[1], 16);
  return rgbToLab((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** CIEDE2000 (Sharma et al. 2005) */
export function deltaE2000(x: Lab, y: Lab): number {
  const c1 = Math.hypot(x.a, x.b);
  const c2 = Math.hypot(y.a, y.b);
  const cBar = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(cBar ** 7 / (cBar ** 7 + 25 ** 7)));
  const a1 = (1 + g) * x.a;
  const a2 = (1 + g) * y.a;
  const cp1 = Math.hypot(a1, x.b);
  const cp2 = Math.hypot(a2, y.b);
  const hp = (b: number, a: number) => (b === 0 && a === 0 ? 0 : (deg(Math.atan2(b, a)) + 360) % 360);
  const h1 = hp(x.b, a1);
  const h2 = hp(y.b, a2);
  const dL = y.l - x.l;
  const dC = cp2 - cp1;
  let dh = 0;
  if (cp1 * cp2 !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(cp1 * cp2) * Math.sin(rad(dh / 2));
  const lBar = (x.l + y.l) / 2;
  const cpBar = (cp1 + cp2) / 2;
  let hBar = h1 + h2;
  if (cp1 * cp2 !== 0) {
    if (Math.abs(h1 - h2) > 180) hBar += h1 + h2 < 360 ? 360 : -360;
    hBar /= 2;
  }
  const t = 1 - 0.17 * Math.cos(rad(hBar - 30)) + 0.24 * Math.cos(rad(2 * hBar)) + 0.32 * Math.cos(rad(3 * hBar + 6)) - 0.2 * Math.cos(rad(4 * hBar - 63));
  const dTheta = 30 * Math.exp(-(((hBar - 275) / 25) ** 2));
  const rc = 2 * Math.sqrt(cpBar ** 7 / (cpBar ** 7 + 25 ** 7));
  const sl = 1 + (0.015 * (lBar - 50) ** 2) / Math.sqrt(20 + (lBar - 50) ** 2);
  const sc = 1 + 0.045 * cpBar;
  const sh = 1 + 0.015 * cpBar * t;
  const rt = -Math.sin(rad(2 * dTheta)) * rc;
  return Math.sqrt((dL / sl) ** 2 + (dC / sc) ** 2 + (dH / sh) ** 2 + rt * (dC / sc) * (dH / sh));
}

/** Farbabstand → Anzeige „Farbnähe“ in Prozent (Orientierung, keine Messung). */
export function matchPercent(deltaE: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - deltaE * 2.2)));
}

function median(values: number[]): number {
  const sorted = [...values].sort((p, q) => p - q);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * Typische Haarfarbe aus RGBA-Pixeln: mittlerer Bildbereich, extreme Lichter und Schatten sowie
 * hauttonähnliche Pixel werden ignoriert, dann der Median in Lab. `null`, wenn zu wenig übrig bleibt.
 */
export function estimateHairLab(data: Uint8ClampedArray, width: number, height: number): Lab | null {
  const x0 = Math.floor(width * 0.2);
  const x1 = Math.ceil(width * 0.8);
  const y0 = Math.floor(height * 0.2);
  const y1 = Math.ceil(height * 0.8);
  const ls: number[] = [];
  const as: number[] = [];
  const bs: number[] = [];
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 200) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const v = max / 255;
      const s = max === 0 ? 0 : (max - min) / max;
      let h = 0;
      if (max !== min) {
        if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
        else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
        else h = 60 * ((r - g) / (max - min)) + 240;
      }
      const skin = h >= 8 && h <= 28 && s >= 0.18 && s <= 0.6 && v > 0.62;
      const lab = rgbToLab(r, g, b);
      if (lab.l < 6 || lab.l > 92 || skin) continue;
      ls.push(lab.l);
      as.push(lab.a);
      bs.push(lab.b);
    }
  }
  if (ls.length < 20) return null;
  return { a: median(as), b: median(bs), l: median(ls) };
}
