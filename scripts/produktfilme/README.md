# Produktfilme aus dem Atelier

Schnitt der Filme auf den Produktseiten (Remotion). Nicht Teil des Shop-Builds, eigene Abhängigkeiten.

| Film | Quelle | Länge | Inhalt |
| --- | --- | --- | --- |
| `public/assets/video/422-film.mp4` | WhatsApp-Videos WA0047 + WA0048 (27.11.2026) | 24,9 s | Fall des Haars → Basis mit Clips → Clip in Nahaufnahme → Aufsetzen → Clip schließen → Scheitel → fertiger Look |
| `public/assets/video/426-film.mp4` | WhatsApp-Video WA0046 (27.11.2026) | 12,3 s | Locken in Bewegung → Drehung zeigt das dünne Band → ruhige Gesamtansicht |

## Ablauf

1. **Stabilisieren und leicht schärfen** (ffmpeg, vidstab), ohne Farbveränderung, Ton entfernt:
   ```
   ffmpeg -i quelle.mp4 -an -vf "vidstabdetect=shakiness=6:accuracy=15:result=x.trf" -f null -
   ffmpeg -i quelle.mp4 -an -vf "vidstabtransform=input=x.trf:smoothing=18:optzoom=1:interpol=bicubic,unsharp=5:5:0.45:5:5:0.0,fps=30,format=yuv420p" -c:v libx264 -crf 12 -g 15 public/WA00xx.mp4
   ```
2. **Schnitt** (`src/cuts.ts`): Szenen mit Zeiten in Sekunden; weiche Überblendungen (14 Frames), kaum merkliche Kamerafahrt, **kein Farbfilter** (Haar bleibt 1:1).
   Am Ende blenden die Bilder unmittelbar vor dem Einstieg der ersten Szene ein: Das letzte Bild ist der direkte Vorgänger des ersten, die Endlosschleife hat keinen Sprung (geprüft: Abweichung letztes→erstes Bild so groß wie ein normaler Bildwechsel).
3. **Rendern:** `npm install && npm run render` (Chromium: `Config.setBrowserExecutable` in `remotion.config.ts` anpassen).
4. **Web-Fassung:** `ffmpeg -i out/toupet-master.mp4 -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart public/assets/video/422-film.mp4`, Standbild als `-poster.jpg`.
