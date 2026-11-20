"""Farbanalyse der Produktfotos.

1. Hintergrund (Laken/Wand) aus dem Bildrand schätzen -> Weißabgleich (von Kries) so, dass er neutral wird.
2. Haarmaske: Pixel mit deutlichem Lab-Abstand zum Hintergrund; Karten (sehr dunkel, fast unbunt, große Fläche) grob raus.
3. k-means (k=3) in Lab auf Haarpixeln -> Farbanteile; Median-L*, Bunttonwinkel, Chroma.
4. Haarfarbstufe 1-10 grob aus L* (Näherung, kein Laborwert).
Ausgabe: JSON + Kontaktbogen mit Original, korrigiert und Farbfeldern je Foto.
"""
import json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
PRODUCTS = {
    "422 V-Toupet · natürliches Dunkelblond": [7, 6, 5, 2, 1, 3, 4],
    "423 Clip-in · Naturdunkelbraun": [10, 8, 12, 11, 9],
    "424 Genius Weft · Naturdunkelbraun": [14, 13, 15, 16],
    "425 Genius Weft · Blond Ombré": [22, 18, 17, 19, 23, 24, 28],
    "426 Genius Weft · Kaffeebraun Ombré": [25, 26],
    "427 Invisible Tape · Blond Ombré mit Ansatz": [37, 29, 30, 20, 21, 31, 27, 32, 34, 35, 36, 38, 33],
    "428 Butterfly Weft · Dunkelbraun naturfarben": [39, 40, 41],
}

def srgb_to_lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def lin_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055) * 255

M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
WHITE = np.array([0.95047, 1.0, 1.08883])

def lin_to_lab(lin):
    xyz = lin @ M.T / WHITE
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

def level(L):
    # grobe Zuordnung L* (Median Haar, diffus) -> Haarfarbstufe
    table = [(17, 1), (21, 2), (25, 3), (30, 4), (36, 5), (43, 6), (50, 7), (57, 8), (64, 9)]
    for lim, lv in table:
        if L < lim:
            return lv
    return 10

NAMES = {1: "Schwarz", 2: "Schwarzbraun", 3: "Dunkelbraun", 4: "Mittelbraun", 5: "Hellbraun",
         6: "Dunkelblond", 7: "Mittelblond", 8: "Hellblond", 9: "Sehr hellblond", 10: "Hellstblond/Platin"}

def kmeans(x, k=3, it=25, seed=0):
    rng = np.random.default_rng(seed)
    c = x[rng.choice(len(x), k, replace=False)]
    for _ in range(it):
        d = ((x[:, None] - c[None]) ** 2).sum(-1)
        lab = d.argmin(1)
        c = np.array([x[lab == i].mean(0) if (lab == i).any() else c[i] for i in range(k)])
    return c, np.bincount(lab, minlength=k) / len(x)

def analyse(n):
    im = Image.open(f"{SRC}/{n}.jpg").convert("RGB")
    im.thumbnail((420, 420))
    rgb = np.asarray(im).astype(float)
    lin = srgb_to_lin(rgb)
    h, w, _ = lin.shape
    b = max(4, int(min(h, w) * 0.06))
    border = np.concatenate([lin[:b].reshape(-1, 3), lin[-b:].reshape(-1, 3), lin[:, :b].reshape(-1, 3), lin[:, -b:].reshape(-1, 3)])
    lum = border @ M[1]
    bg = np.median(border[lum > np.percentile(lum, 40)], 0)  # helle Randpixel = Laken/Wand
    bg_lab = lin_to_lab(bg)
    gain = bg.mean() / np.maximum(bg, 1e-4)
    corr = lin * gain
    lab_raw = lin_to_lab(lin)
    lab = lin_to_lab(corr)
    dist = np.linalg.norm(lab_raw - bg_lab, axis=-1)
    mask = dist > 18
    # Karte/Schatten grob raus: sehr dunkel und fast unbunt in Bildern mit Karte bleibt drin, wenn Haar schwarz ist -> nur markieren
    chroma = np.hypot(lab[..., 1], lab[..., 2])
    hair = lab[mask]
    if len(hair) < 500:
        return None
    sample = hair[np.random.default_rng(1).choice(len(hair), min(6000, len(hair)), replace=False)]
    cent, share = kmeans(sample)
    order = np.argsort(cent[:, 0])
    cent, share = cent[order], share[order]
    L = np.median(hair[:, 0])
    a, bb = np.median(hair[:, 1]), np.median(hair[:, 2])
    # Ombré: Abstand dunkelster zu hellstem Cluster (nur wenn beide >=15 %)
    ombre = float(cent[-1, 0] - cent[0, 0]) if share[0] >= 0.15 and share[-1] >= 0.15 else 0.0
    bg_cast = float(np.hypot(bg_lab[1], bg_lab[2]))
    # Farbstich bunt (Regenbogen-Licht): starke Streuung der Hintergrundfarbe
    bg_spread = float(np.std(lin_to_lab(border)[..., 1:], axis=0).mean())
    corr_img = Image.fromarray(lin_to_srgb(corr).astype(np.uint8))
    return {
        "n": n, "L": round(float(L), 1), "a": round(float(a), 1), "b": round(float(bb), 1),
        "hue": round(float(np.degrees(np.arctan2(bb, a))), 0), "chroma": round(float(np.hypot(a, bb)), 1),
        "level": level(L), "clusters": [[round(float(v), 1) for v in c] for c in cent],
        "shares": [round(float(s), 2) for s in share], "ombre_dL": round(ombre, 1),
        "bg_cast": round(bg_cast, 1), "bg_spread": round(bg_spread, 1), "hair_share": round(float(mask.mean()), 2),
        "_img": im, "_corr": corr_img,
    }

def lab_to_rgb(lab):
    L, a, b = lab
    fy = (L + 16) / 116; fx = fy + a / 500; fz = fy - b / 200
    f = np.array([fx, fy, fz])
    xyz = np.where(f ** 3 > 216 / 24389, f ** 3, (116 * f - 16) / (24389 / 27)) * WHITE
    lin = np.linalg.solve(M, xyz)
    return tuple(int(v) for v in lin_to_srgb(lin))

results, rows = {}, []
for name, nums in PRODUCTS.items():
    res = [r for r in (analyse(n) for n in nums) if r]
    results[name] = [{k: v for k, v in r.items() if not k.startswith("_")} for r in res]
    rows.append((name, res))

json.dump(results, open(f"{OUT}/farbanalyse.json", "w"), ensure_ascii=False, indent=1)

# Kontaktbogen
TH = 150
font = ImageFont.load_default()
height = sum(40 + TH * 2 + 70 for _ in rows)
width = 40 + 13 * (TH * 3 // 4 + 10)
sheet = Image.new("RGB", (width, height), (24, 21, 19))
d = ImageDraw.Draw(sheet)
y = 10
for name, res in rows:
    d.text((12, y), name, fill=(240, 196, 90), font=font)
    y += 22
    x = 12
    for r in res:
        for k, key in enumerate(["_img", "_corr"]):
            t = r[key].copy(); t.thumbnail((TH * 3 // 4, TH))
            sheet.paste(t, (x, y + k * TH))
        sy = y + 2 * TH + 4
        for c, s in zip(r["clusters"], r["shares"]):
            sw = int((TH * 3 // 4) * s)
            d.rectangle([x, sy, x + max(sw, 1), sy + 18], fill=lab_to_rgb(c))
            x0 = x + sw; x = x0
        x = x - (TH * 3 // 4) if False else x
        x_start = x - sum(int((TH * 3 // 4) * s) for s in r["shares"])
        d.text((x_start, sy + 22), f"#{r['n']} L{r['L']:.0f} St.{r['level']}", fill=(244, 239, 232), font=font)
        d.text((x_start, sy + 34), f"h{r['hue']:.0f} C{r['chroma']:.0f} WB{r['bg_cast']:.0f}", fill=(168, 158, 148), font=font)
        x = x_start + TH * 3 // 4 + 10
    y += 2 * TH + 70
sheet.save(f"{OUT}/farbanalyse.png")

for name, res in rows:
    print(f"\n{name}")
    for r in res:
        print(f"  #{r['n']:>2}: L*{r['L']:5.1f} a*{r['a']:5.1f} b*{r['b']:5.1f} hue{r['hue']:4.0f} C{r['chroma']:4.1f} "
              f"Stufe {r['level']:>2} ({NAMES[r['level']]}) ombréΔL {r['ombre_dL']:4.1f} "
              f"Hintergrund-Stich {r['bg_cast']:4.1f} Streuung {r['bg_spread']:4.1f} Haaranteil {r['hair_share']}")
    Ls = [r["L"] for r in res]; hs = [r["hue"] for r in res]
    print(f"  → Spanne L* {min(Ls):.1f}–{max(Ls):.1f} (Δ{max(Ls)-min(Ls):.1f}), Bunttonwinkel {min(hs):.0f}–{max(hs):.0f}°")
