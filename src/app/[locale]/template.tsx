import type { ReactNode } from "react";
import { ViewTransition } from "react";

/**
 * Seitenwechsel „Lichtöffnung“ (CSS: ::view-transition-*(.af-page) in globals.css): Nur der Wechsel zwischen zwei
 * Seiten animiert, die neue Seite kommt als `enter`, die alte geht als `exit`. Änderungen innerhalb einer Seite
 * (nachgeladenes Partikelfeld, Meldungen in der Kasse) lösen nichts aus: `update="none"`.
 * Früher lag die Grenze im Layout mit `default="af-page"`; dann zündete schon das Nachladen des Partikelfelds
 * kurz nach dem Laden die Lichtöffnung für die ganze Startseite (sie verblasste und öffnete sich ein zweites Mal).
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition default="none" enter="af-page" exit="af-page" update="none">
      {children}
    </ViewTransition>
  );
}
