import "server-only";

import { siteMode } from "./mode";
import { memoryStore } from "./store-memory";

/** Verkaufte/reservierte Einzelstücke. Production ohne Datenbank: nur der Katalog-Status. */
export async function soldSlugs(): Promise<Set<string>> {
  if (!siteMode().demo) return new Set();
  return memoryStore().soldSlugs();
}
