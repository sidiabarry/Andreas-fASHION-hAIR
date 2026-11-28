"use client";

import { useEffect } from "react";

/**
 * Detailbereiche am Desktop offen, am Handy zugeklappt (Baymard: am Desktop „Expanded Sections“, also alles allein
 * durch Scrollen erreichbar; am Handy bei langen Seiten zugeklappt). Der Server liefert sie zugeklappt,
 * ab der zweispaltigen Ansicht werden sie hier geöffnet. Das geschieht unterhalb des sichtbaren Bereichs, ohne Sprung.
 */
export function OpenDetailsOnWide({ selector, minWidth = 901 }: { selector: string; minWidth?: number }) {
  useEffect(() => {
    if (!window.matchMedia(`(min-width: ${minWidth}px)`).matches) return;
    for (const el of document.querySelectorAll<HTMLDetailsElement>(selector)) el.open = true;
  }, [selector, minWidth]);
  return null;
}
