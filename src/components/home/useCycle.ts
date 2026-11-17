"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useMotionStill } from "@/components/fx/motion";

/**
 * Automatisch weiterlaufende Auswahl (Methoden, Bedarfe, Nahaufnahmen).
 * Läuft nur, solange der Bereich zu mindestens 35 % sichtbar ist, nicht bei Zeiger oder Fokus
 * darin und nicht bei pausierter/reduzierter Bewegung. Eine Wahl von Hand setzt den Takt zurück.
 */
export function useCycle<T extends HTMLElement>(count: number, ms: number) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [tick, setTick] = useState(0);
  const still = useMotionStill();
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const hold = () => setHeld(true);
    const release = (event: Event) => {
      if (event.type === "pointerleave") {
        setHeld(el.contains(document.activeElement) && document.activeElement !== document.body);
        return;
      }
      const next = (event as FocusEvent).relatedTarget as Node | null;
      if (next && el.contains(next)) return;
      setHeld(el.matches(":hover"));
    };
    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", release);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", release);
    };
  }, []);

  const running = visible && !held && !still && count > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), ms);
    return () => window.clearTimeout(timer);
  }, [running, index, count, ms, tick]);

  const select = useCallback((i: number) => {
    setIndex(i);
    setTick((t) => t + 1);
  }, []);

  return { index, ref, running, select };
}
