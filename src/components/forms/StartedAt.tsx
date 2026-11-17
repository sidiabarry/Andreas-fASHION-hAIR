"use client";

import { useEffect, useRef } from "react";

/**
 * Verstecktes Feld mit dem Zeitpunkt, ab dem das Formular sichtbar war (Bot-Schutz: zu schnelle
 * Absendungen werden abgewiesen). Der Wert wird nach dem Laden direkt ins DOM geschrieben.
 */
export function StartedAt() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);
  return <input defaultValue="" name="startedAt" ref={ref} type="hidden" />;
}
