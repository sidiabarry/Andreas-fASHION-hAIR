import "server-only";

import { store } from "./db";
import { siteMode } from "./mode";

/** Verkaufte/reservierte Einzelstücke. Livebetrieb ohne Datenbank: nur der Katalog-Status. */
export async function soldSlugs(): Promise<Set<string>> {
  const mode = siteMode();
  if (!mode.demo && !mode.checkoutOpen) return new Set();
  try {
    return await store().soldSlugs();
  } catch {
    return new Set();
  }
}
