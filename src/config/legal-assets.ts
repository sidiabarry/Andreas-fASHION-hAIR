/**
 * Amtliche Grafik der harmonisierten Gewährleistungsmitteilung (DVO (EU) 2025/1960, Anhang I, deutsche Fassung).
 * Die Datei muss unverändert von EUR-Lex stammen und unter public/assets/legal/ liegen. Solange sie fehlt,
 * steht der Hinweis als Text über dem Bestellknopf und `npm run check:launch` sperrt Production.
 * Keine Imports: wird auch von scripts/check-launch.ts geladen.
 */
// Quelle: EUR-Lex, CELEX 32025R1960, Anhang I (deutsche Fassung, Farbversion), abgerufen 21.11.2026, Datei unverändert.
export const WARRANTY_LABEL: { src: string; width: number; height: number } | null = { src: "/assets/legal/gewaehrleistung-de.jpg", width: 1219, height: 1668 };
