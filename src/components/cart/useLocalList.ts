"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Kleine Listen im localStorage (Merkliste, zuletzt angesehen). Nur Produktkennungen, nur auf
 * diesem Gerät, kein Konto, keine Übertragung an den Server (technisch notwendig für die vom
 * Nutzer ausdrücklich gewünschte Funktion, § 25 Abs. 2 Nr. 2 TDDDG).
 */
const SLUG = /^[a-z0-9-]{1,160}$/;
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: string[] }>();
const EMPTY: string[] = [];

function read(key: string): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;
  let value: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    value = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string" && SLUG.test(s)).slice(0, 60) : [];
  } catch {
    value = [];
  }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, value: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Privater Modus: Liste lebt nur bis zum Neuladen
    cache.set(key, { raw: JSON.stringify(value), value });
  }
  listeners.get(key)?.forEach((fn) => fn());
}

function subscribe(key: string, fn: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(fn);
  const onStorage = (event: StorageEvent) => event.key === key && fn();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key)?.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLocalList(key: string, max = 24) {
  const items = useSyncExternalStore(
    useCallback((fn: () => void) => subscribe(key, fn), [key]),
    () => read(key),
    () => EMPTY,
  );
  const toggle = useCallback(
    (slug: string) => {
      const current = read(key);
      write(key, current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current].slice(0, max));
    },
    [key, max],
  );
  const push = useCallback(
    (slug: string) => {
      const current = read(key);
      if (current[0] === slug) return;
      write(key, [slug, ...current.filter((s) => s !== slug)].slice(0, max));
    },
    [key, max],
  );
  const remove = useCallback((slug: string) => write(key, read(key).filter((s) => s !== slug)), [key]);
  return { items, push, remove, toggle };
}

export const WISHLIST_KEY = "afh-merkliste-v1";
export const RECENT_KEY = "afh-zuletzt-v1";
