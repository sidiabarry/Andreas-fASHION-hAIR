import type { CSSProperties } from "react";

/**
 * Setzt eine Schlagzeile Wort für Wort (für den maskierten Eintritt) und wandelt *…* in kursive
 * Antiqua. Kein Client-Code: Die Wörter stehen fertig im HTML, die Bewegung macht CSS.
 */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let index = start;
  return (
    <>
      {parts.map((part, p) => {
        const italic = part.startsWith("*") && part.endsWith("*");
        const words = (italic ? part.slice(1, -1) : part).split(/(\s+)/);
        const nodes = words.map((word, w) => {
          if (!word.trim()) return word ? " " : null;
          const i = index++;
          return (
            <span className="w" key={`${p}-${w}`}>
              <span className="w__i" style={{ "--i": i } as CSSProperties}>
                {word}
              </span>
            </span>
          );
        });
        return italic ? (
          <em className="w-em" key={p}>
            {nodes}
          </em>
        ) : (
          <span key={p}>{nodes}</span>
        );
      })}
    </>
  );
}

/** Nur den Text ohne Markup (für aria-label, Metadaten). */
export function plain(text: string) {
  return text.replace(/\*/g, "");
}
