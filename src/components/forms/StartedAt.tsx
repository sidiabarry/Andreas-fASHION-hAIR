"use client";

import { useSyncExternalStore } from "react";

/** Zeitpunkt, zu dem das Skript im Browser geladen wurde (Bot-Schutz: zu schnelle Absendungen werden abgewiesen). */
const loadedAt = typeof window === "undefined" ? 0 : Date.now();
const subscribe = () => () => {};

/** Verstecktes Feld mit dem Ladezeitpunkt. Server-Rendering: leer; nach dem Hydrieren: Zeitstempel. */
export function StartedAt() {
  const value = useSyncExternalStore(subscribe, () => loadedAt, () => 0);
  return <input name="startedAt" type="hidden" value={value ? String(value) : ""} />;
}
