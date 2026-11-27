/**
 * Schnittliste der Produktfilme. Zeiten in Sekunden der stabilisierten Quellen (public/*.mp4, 30 fps).
 * Reihenfolge erzählt: Schönheit → Aufbau → Anwendung → Ergebnis. Überblendung zwischen allen Szenen,
 * am Ende eine Überblendung zurück in die erste Szene, damit die Endlosschleife keinen Sprung hat.
 */
export type Cut = { src: string; from: number; to: number };

export const FPS = 30;
export const FADE = 14; // Frames Überblendung (~0,47 s)

export const FILMS: Record<string, Cut[]> = {
  // 422 V-Toupet: Fall des Haars, Basis mit Clips, Aufsetzen, Clip, Scheitel, fertiger Look
  toupet: [
    { src: "WA0047.mp4", from: 0.6, to: 4.6 },
    { src: "WA0047.mp4", from: 8.6, to: 12.9 },
    { src: "WA0047.mp4", from: 16.8, to: 19.6 },
    { src: "WA0048.mp4", from: 0.0, to: 3.4 },
    { src: "WA0048.mp4", from: 25.2, to: 28.4 },
    { src: "WA0048.mp4", from: 8.8, to: 15.6 },
    { src: "WA0048.mp4", from: 21.6, to: 24.8 },
  ],
  // 426 Tressenband lockig: Locken in Bewegung, Drehung zeigt das dünne Band, ruhige Gesamtansicht
  locken: [
    { src: "WA0046.mp4", from: 0.6, to: 4.5 },
    { src: "WA0046.mp4", from: 7.1, to: 9.9 },
    { src: "WA0046.mp4", from: 10.3, to: 16.8 },
  ],
};

export const framesOf = (cut: Cut) => Math.round((cut.to - cut.from) * FPS);

/** Gesamtlänge: Summe der Szenen minus Überlappungen, plus die Rückblende in Szene 1. */
export function totalFrames(cuts: Cut[]): number {
  const sum = cuts.reduce((acc, cut) => acc + framesOf(cut), 0);
  return sum - FADE * (cuts.length - 1);
}
