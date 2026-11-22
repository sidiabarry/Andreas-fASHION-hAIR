# Produktbilder: Inszenierung mit gemessener Originalfarbe

Werkzeuge, mit denen die Bilder 422–428 entstanden sind (November 2026). Nicht Teil des Builds.

1. **Inszenierung:** GPT Image 2.6 (Higgsfield, Qualität „high“, 2K, 3:4) erhält Andréias Originalfoto als Referenz und einen Fotografen-Prompt: dunkles Studio, Randlicht, und die Vorgabe, die Farbe des Originals exakt zu halten.
2. **Farbmessung:** `farbanalyse.py <fotos> <out>` misst je Foto die Haarfarbe in Lab. Den Weißabgleich liefert das weiße Laken.
3. **Farbkorrektur:** `treue2.py '<json>'` stellt das Haar frei (rembg, birefnet-general-lite), misst die Zielfarbe im Originalfoto (mit Weißabgleich über das Laken) und verschiebt das generierte Haar in Lab auf diese Farbe. Es gibt ΔE vorher und nachher aus. Abgenommen werden nur Bilder mit ΔE < 2.
   Aufruf: `[[generiert, original, ausgabe, kartePixelAusschließen, L-Untergrenze], …]`. Die Untergrenze 22 gilt für unterbelichtete dunkle Fotos (Stufe 3, „Naturdunkelbraun“).
4. Die Originalfotos bleiben in `public/assets/originals/` und sind auf jeder Produktseite sichtbar.

Abhängigkeiten nur lokal: `python3 -m venv venv && ./venv/bin/pip install "rembg[cpu]==2.0.67" scipy pillow`.
