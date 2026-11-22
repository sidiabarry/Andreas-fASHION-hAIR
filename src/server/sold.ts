import "server-only";

import { store } from "./db";

/**
 * Verkaufte/reservierte Einzelstücke aus dem aktiven Store: im Livebetrieb die Datenbank (auch bei geschlossener
 * Kasse, damit „vergeben“ stimmt), sonst der Demo-Speicher bzw. nichts. Ein Datenbankfehler darf nie eine Seite
 * kaputt machen; dann gilt nur der Katalogstatus, und die Datenbank verhindert den Doppelverkauf trotzdem.
 */
export async function soldSlugs(): Promise<Set<string>> {
  try {
    return await store().soldSlugs();
  } catch {
    return new Set();
  }
}
