"""
Farbtreue der Produktbilder: misst die echte Haarfarbe in Rohfotos (Weißabgleich über das weiße Laken) und
vergleicht sie mit den bearbeiteten Produktbildern, getrennt nach Helligkeit (Lab, je 5 L*-Stufen).
Korrigiert wird nur der Farbton (a*, b*) des Haars, die Helligkeit bleibt; nur wenn der mittlere Abstand ΔE ≥ 2 ist.
Außerdem: drei gemessene Farbtöne je Produkt (dunkel → hell) für das Farbfeld auf der Produktseite.

Aufruf: python3 farbtreue.py <plan.json> [--apply]
plan.json: {"<id>": {"raw": [[pfad, [l,t,r,b] oder null], …], "clean": [[pfad, Ausschlussboxen]], "targets": [pfade]}}
"""
import json, sys
import numpy as np
from PIL import Image, ImageOps

def to_lin(a):
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)

def to_srgb(l):
    return np.where(l <= 0.0031308, l * 12.92, 1.055 * np.power(np.clip(l, 0, 1), 1 / 2.4) - 0.055)

M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
Minv = np.linalg.inv(M)
WHITE = np.array([0.95047, 1.0, 1.08883])

def lin_to_lab(lin):
    xyz = lin @ M.T / WHITE
    f = np.where(xyz > (6 / 29) ** 3, np.cbrt(xyz), xyz / (3 * (6 / 29) ** 2) + 4 / 29)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

def lab_to_lin(lab):
    fy = (lab[..., 0] + 16) / 116
    fx = fy + lab[..., 1] / 500
    fz = fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f > 6 / 29, f ** 3, 3 * (6 / 29) ** 2 * (f - 4 / 29)) * WHITE
    return np.clip(xyz @ Minv.T, 0, 1)

def load(path, box=None, size=900):
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    if box:
        w, h = im.size
        im = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    im.thumbnail((size, size))
    return to_lin(np.asarray(im).astype(np.float64) / 255)

def raw_hair(path, box, kind="light"):
    lin = load(path, box)
    lum = lin @ np.array([0.2126, 0.7152, 0.0722])
    mx, mn = lin.max(-1), lin.min(-1)
    chroma = (mx - mn) / np.maximum(mx, 1e-6)
    bg = (lum >= np.quantile(lum, 0.8)) & (chroma < 0.15)
    ref = np.array([np.median(lin[..., c][bg]) for c in range(3)])
    lin = np.clip(lin * (ref.mean() / ref) * (0.85 / ref.mean()), 0, 1)  # Weißabgleich + Laken auf L* ≈ 94
    lab = lin_to_lab(lin)
    L, C = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2])
    bgL = np.median(L[bg])
    if kind == "dark":
        mask = (L < 52) & (L > 4)
    else:
        mask = ((L < 42) | ((C > 10) & (L < bgL - 6))) & (L > 4)
    return lab[mask]

def clean_hair(path, excludes, kind="light"):
    lin = load(path)
    lab = lin_to_lab(lin)
    h, w = lab.shape[:2]
    keep = np.ones((h, w), bool)
    for (l, t, r, b) in excludes or []:
        keep[int(t * h):int(b * h), int(l * w):int(r * w)] = False
    border = np.concatenate([lab[:8].reshape(-1, 3), lab[-8:].reshape(-1, 3), lab[:, :8].reshape(-1, 3), lab[:, -8:].reshape(-1, 3)])
    bgc = np.median(border, 0)
    dist = np.linalg.norm(lab - bgc, axis=-1)
    mask = (dist > 14) & keep & (lab[..., 0] > 4)
    if kind == "dark":
        mask &= lab[..., 0] < 60
    return lab[mask]

BINS = np.arange(5, 100, 5)

def binned(lab):
    out = {}
    idx = np.digitize(lab[:, 0], BINS)
    for i in np.unique(idx):
        sel = idx == i
        if sel.sum() >= 1500:
            out[int(i)] = (lab[sel, 1].mean(), lab[sel, 2].mean(), int(sel.sum()))
    return out

def hexes(lab):
    order = np.argsort(lab[:, 0])
    n = len(order)
    res = []
    for lo, hi in [(0.05, 0.25), (0.40, 0.60), (0.75, 0.95)]:
        part = lab[order[int(lo * n):int(hi * n)]].mean(0)
        rgb = np.clip(to_srgb(lab_to_lin(part[None])[0]), 0, 1)
        res.append('#%02x%02x%02x' % tuple(int(round(v * 255)) for v in rgb))
    return res

def correction(raw_b, clean_b):
    common = sorted(set(raw_b) & set(clean_b))
    if not common:
        return None, None
    weights = np.array([clean_b[i][2] for i in common], float)
    da = np.array([raw_b[i][0] - clean_b[i][0] for i in common])
    db = np.array([raw_b[i][1] - clean_b[i][1] for i in common])
    de = float((np.hypot(da, db) * weights).sum() / weights.sum())
    centers = np.array([BINS[i - 1] + 2.5 if i > 0 else 2.5 for i in common])
    return de, (centers, np.clip(da, -6, 6), np.clip(db, -6, 6))

def apply(path, corr, excludes, out, texture=True):
    im = Image.open(path).convert('RGB')
    lin = to_lin(np.asarray(im).astype(np.float64) / 255)
    lab = lin_to_lab(lin)
    h, w = lab.shape[:2]
    border = np.concatenate([lab[:8].reshape(-1, 3), lab[-8:].reshape(-1, 3), lab[:, :8].reshape(-1, 3), lab[:, -8:].reshape(-1, 3)])
    bgc = np.median(border, 0)
    dist = np.linalg.norm(lab - bgc, axis=-1)
    soft = np.clip((dist - 8) / 12, 0, 1)  # weicher Übergang am Rand der Strähnen
    keep = np.ones((h, w))
    for (l, t, r, b) in excludes or []:
        keep[int(t * h):int(b * h), int(l * w):int(r * w)] = 0
    m = soft * keep
    if texture:
        # Strukturmaske: Haar hat feine Strähnen (lokale Streuung), glatte Flächen (Puppe, Karte, Clips) bleiben unberührt
        from scipy.ndimage import uniform_filter, gaussian_filter
        L0 = lab[..., 0]
        mean = uniform_filter(L0, 5); var = uniform_filter(L0 ** 2, 5) - mean ** 2
        std = np.sqrt(np.maximum(var, 0))
        tex = np.clip((std - 1.0) / 2.0, 0, 1)
        m = m * gaussian_filter(tex, 3)
    centers, da, db = corr
    L = lab[..., 0]
    lab[..., 1] += np.interp(L, centers, da) * m
    lab[..., 2] += np.interp(L, centers, db) * m
    rgb = np.clip(to_srgb(lab_to_lin(lab)), 0, 1)
    Image.fromarray((rgb * 255 + 0.5).astype(np.uint8)).save(out, quality=94, method=6)

if __name__ == '__main__':
    plan = json.load(open(sys.argv[1]))
    do_apply = '--apply' in sys.argv
    report = {}
    for pid, spec in plan.items():
        kind = spec.get('kind', 'light')
        raw = np.concatenate([raw_hair(p, b, kind) for p, b in spec['raw']])
        cl = np.concatenate([clean_hair(p, ex, kind) for p, ex in spec['clean']])
        rb, cb = binned(raw), binned(cl)
        de, corr = correction(rb, cb)
        if '--bins' in sys.argv:
            for i in sorted(set(rb) | set(cb)):
                r, c = rb.get(i), cb.get(i)
                print(pid, 'L', BINS[i - 1] if i > 0 else 0, 'roh a/b', None if r is None else (round(r[0], 1), round(r[1], 1), r[2]), 'bild a/b', None if c is None else (round(c[0], 1), round(c[1], 1), c[2]), file=sys.stderr)
        report[pid] = {'deltaE': round(de, 2) if de is not None else None, 'swatch': hexes(raw), 'clean_swatch': hexes(cl)}
        if do_apply and de is not None and de >= 2:
            outdir = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--out=')), None)
            for target, ex in spec['targets']:
                import os
                dest = os.path.join(outdir, os.path.basename(target)) if outdir else target
                apply(target, corr, ex, dest, spec.get('texture', True))
            report[pid]['corrected'] = [t for t, _ in spec['targets']]
    print(json.dumps(report, indent=1))
