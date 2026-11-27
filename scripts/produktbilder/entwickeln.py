"""
Entwickelt Rohfotos aus dem Atelier wie in einer Bildbearbeitung, ohne das Haar zu verändern:
1. Weißabgleich und Belichtung im linearen Licht (wie an der Kamera): Referenz ist der weiße Untergrund.
2. Nur Untergrund (hell, farblos, glatt) wird zu sauberem Weiß angehoben; Haar (dunkel, farbig oder strukturiert) bleibt unberührt.
3. Leichte Schärfung, Zuschnitt 3:4.
Aufruf: python3 develop.py <eingabe> <ausgabe> [left top right bottom als Anteile]
"""
import sys
import numpy as np
from PIL import Image, ImageOps, ImageFilter
from scipy.ndimage import uniform_filter, gaussian_filter

src, dst = sys.argv[1], sys.argv[2]
box = [float(v) for v in sys.argv[3:7]] if len(sys.argv) >= 7 else None

im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
if box:
    w, h = im.size
    l, t, r, b = int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)
    # auf 3:4 bringen (Breite bestimmt, Höhe angepasst, mittig in der Box)
    bw, bh = r - l, b - t
    if bw / bh > 0.75:
        nw = int(bh * 0.75); l += (bw - nw) // 2; r = l + nw
    else:
        nh = int(bw / 0.75); t += (bh - nh) // 2; b = t + nh
    im = im.crop((l, t, r, b))

a = np.asarray(im).astype(np.float64) / 255.0
lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)

lum = 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]
mx = lin.max(axis=2); mn = lin.min(axis=2)
chroma = (mx - mn) / np.maximum(mx, 1e-6)
# Untergrund-Kandidaten: hellste 25 %, farbarm
thr = np.quantile(lum, 0.75)
bg = (lum >= thr) & (chroma < 0.18)
if bg.sum() < 1000:
    bg = lum >= np.quantile(lum, 0.9)
ref = np.array([np.median(lin[..., c][bg]) for c in range(3)])
gray = ref.mean()
wb = np.clip(gray / ref, 0.82, 1.22)
target = 0.80  # linear ~ sRGB 231: Untergrund hell, Haar behält Zeichnung
expo = np.clip(target / gray, 0.9, 1.6)
out = np.clip(lin * wb * expo, 0, 1)

# Maske Untergrund: hell + farblos + glatt (lokale Streuung klein)
lum2 = 0.2126 * out[..., 0] + 0.7152 * out[..., 1] + 0.0722 * out[..., 2]
mx = out.max(axis=2); mn = out.min(axis=2)
chroma2 = (mx - mn) / np.maximum(mx, 1e-6)
mean = uniform_filter(lum2, 9); var = uniform_filter(lum2 ** 2, 9) - mean ** 2
std = np.sqrt(np.maximum(var, 0))
def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)
m = smooth(lum2, 0.42, 0.62) * (1 - smooth(chroma2, 0.06, 0.12)) * (1 - smooth(std, 0.012, 0.03))
m = gaussian_filter(m, 2.0)
white = np.array([0.955, 0.95, 0.94])  # warmes Papierweiß (sRGB ~ 250/249/248)
m = m * 0.6  # schonend: Untergrund nur aufhellen, Struktur des Moments bleibt
out = out * (1 - m[..., None]) + white * m[..., None]

srgb = np.where(out <= 0.0031308, out * 12.92, 1.055 * np.power(out, 1 / 2.4) - 0.055)
res = Image.fromarray((np.clip(srgb, 0, 1) * 255 + 0.5).astype(np.uint8))
res = res.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
W = 1536 if res.size[0] >= 1536 else res.size[0]
res = res.resize((W, int(W * 4 / 3)), Image.LANCZOS)
res.save(dst, quality=88, optimize=True, progressive=True)
print(dst, 'wb', np.round(wb, 3), 'expo', round(float(expo), 3), 'bg-anteil', round(float(m.mean()), 3))
