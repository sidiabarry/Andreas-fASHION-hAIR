# Produktbilder: Inszenierung mit gemessener Originalfarbe

Werkzeuge, mit denen die Bilder 422–428 entstanden sind (November 2026). Nicht Teil des Builds.

1. **Inszenierung:** GPT Image 2.6 (Higgsfield, Qualität „high“, 2K, 3:4) erhält Andréias Originalfoto als Referenz und einen Fotografen-Prompt: dunkles Studio, Randlicht, und die Vorgabe, die Farbe des Originals exakt zu halten.
2. **Farbmessung:** `farbanalyse.py <fotos> <out>` misst je Foto die Haarfarbe in Lab. Den Weißabgleich liefert das weiße Laken.
3. **Farbkorrektur:** `treue2.py '<json>'` stellt das Haar frei (rembg, birefnet-general-lite), misst die Zielfarbe im Originalfoto (mit Weißabgleich über das Laken) und verschiebt das generierte Haar in Lab auf diese Farbe. Es gibt ΔE vorher und nachher aus. Abgenommen werden nur Bilder mit ΔE < 2.
   Aufruf: `[[generiert, original, ausgabe, kartePixelAusschließen, L-Untergrenze], …]`. Die Untergrenze 22 gilt für unterbelichtete dunkle Fotos (Stufe 3, „Naturdunkelbraun“).
4. Seit 27.11.2026 ersetzt: Für 422–428 hat die Inhaberin fertig bearbeitete Produktbilder geliefert (`public/assets/products/<id>-<n>.webp`, unverändert übernommen). Die alten Studio- und Originalfotos sind entfernt.
5. **Atelierfotos** (`<id>-atelier-<n>.jpg`): ausgewählte Rohfotos, mit `entwickeln.py <eingabe> <ausgabe>` entwickelt: Weißabgleich und Belichtung im linearen Licht wie an der Kamera (Referenz: weißes Laken), nur der Untergrund (hell, farblos, glatt) wird schonend aufgehellt, leichte Schärfung. Das Haar selbst wird nicht verändert.

Abhängigkeiten nur lokal: `python3 -m venv venv && ./venv/bin/pip install "rembg[cpu]==2.0.67" scipy pillow`.
