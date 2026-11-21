import type { ReactNode } from "react";

/** „Wie neu *geboren.*“ → Text mit <em> (Sternchen markieren die kursive Hälfte). */
export function emphasis(text: string): ReactNode[] {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part, i) => (part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part));
}
