"use client";

import { useEffect } from "react";

/**
 * Merkt sich, wo geklickt wurde, damit sich die nächste Seite genau dort als Lichtkreis öffnet
 * (CSS: ::view-transition-new(.af-page) in globals.css). Tastatur: Mitte des Bildschirms.
 */
export function VtOrigin() {
  useEffect(() => {
    const root = document.documentElement;
    const set = (x: number, y: number) => {
      root.style.setProperty("--vt-x", `${Math.round(x)}px`);
      root.style.setProperty("--vt-y", `${Math.round(y)}px`);
    };
    const onPointer = (event: PointerEvent) => set(event.clientX, event.clientY);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") set(window.innerWidth / 2, window.innerHeight * 0.4);
    };
    document.addEventListener("pointerdown", onPointer, { capture: true, passive: true });
    document.addEventListener("keydown", onKey, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPointer, { capture: true });
      document.removeEventListener("keydown", onKey, { capture: true });
    };
  }, []);
  return null;
}
