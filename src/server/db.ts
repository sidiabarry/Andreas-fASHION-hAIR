import "server-only";

import { siteMode } from "./mode";
import type { Store } from "./store";
import { memoryStore } from "./store-memory";
import { createSupabaseStore, supabaseConfigured } from "./store-supabase";

let live: Store | null = null;

/** Livebetrieb mit Datenbank, sonst (Demo/Entwicklung) der In-Memory-Store. */
export function store(): Store {
  if (!siteMode().demo && supabaseConfigured()) {
    live ??= createSupabaseStore();
    return live;
  }
  return memoryStore();
}
