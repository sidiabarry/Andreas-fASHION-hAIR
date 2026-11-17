"use client";

import { useSyncExternalStore } from "react";

/**
 * Globaler Bewegungs-Schalter (WCAG 2.2.2 „Pausieren, beenden, ausblenden“).
 * Zustand liegt als `data-motion="paused"` am <html>, damit CSS und alle Inseln ihn sehen.
 * Die Wahl wird auf dem Gerät gemerkt (localStorage, rein funktional).
 */
const KEY = "afh-motion";
const EVENT = "afh:motion";

function reducedQuery() {
  return typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
}

export function prefersReducedMotion() {
  return Boolean(reducedQuery()?.matches);
}

export function isPaused() {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === "paused";
}

export function setPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  try {
    window.localStorage.setItem(KEY, paused ? "paused" : "on");
  } catch {
    // privater Modus: Wahl gilt nur für diese Seite
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Einmal beim Start: gemerkte Wahl übernehmen. */
export function restoreMotionChoice() {
  try {
    if (window.localStorage.getItem(KEY) === "paused" && !isPaused()) {
      document.documentElement.dataset.motion = "paused";
      window.dispatchEvent(new Event(EVENT));
    }
  } catch {
    // ignorieren
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  const mq = reducedQuery();
  mq?.addEventListener("change", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    mq?.removeEventListener("change", callback);
  };
}

/** true, wenn sich gerade nichts von selbst bewegen soll (Schalter oder Systemeinstellung). */
export function useMotionStill() {
  return useSyncExternalStore(
    subscribe,
    () => isPaused() || prefersReducedMotion(),
    () => false,
  );
}

/** Nur der Schalter (für die Beschriftung des Knopfs). */
export function useUserPaused() {
  return useSyncExternalStore(subscribe, isPaused, () => false);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}

export function onMotionChange(callback: () => void) {
  return subscribe(callback);
}
