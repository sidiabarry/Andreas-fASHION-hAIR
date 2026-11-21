"use client";

import { useEffect, useRef } from "react";

import { GoldField, type SceneTarget } from "./engine";
import { isPaused, onMotionChange, prefersReducedMotion, restoreMotionChoice } from "./motion";
import { isShape, samplePhoenix } from "./shapes";

/**
 * Ein seitenweites Goldfeld (fixiert, vor dem Inhalt, ohne Zeigerereignisse).
 * Szenen steuern es über Attribute:
 *   data-fx="phoenix|strands|weft|ring|thread|dust|halo|embers"
 *   data-fx-x / -y   Mitte in NDC (-1..1), data-fx-s Größe, data-fx-a Deckkraft,
 *   data-fx-loose / -heat (0..1), Handy-Varianten mit data-fx-m… (z. B. data-fx-mx)
 * Aktiv ist die Szene, die die Bildschirmmitte überdeckt. Attributwechsel (z. B. Hero-Kapitel)
 * werden sofort übernommen.
 */
const PHOENIX_SRC = "/assets/brand/phoenix.svg";

function num(el: HTMLElement, key: string, mobile: boolean, fallback: number) {
  const m = mobile ? el.getAttribute(`data-fx-m${key}`) : null;
  const v = m ?? el.getAttribute(`data-fx-${key}`);
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function readTarget(el: HTMLElement): SceneTarget | null {
  const shape = el.getAttribute("data-fx");
  if (!isShape(shape)) return null;
  const mobile = window.innerWidth < 760;
  return {
    alpha: num(el, "a", mobile, 0.9),
    heat: num(el, "heat", mobile, 0.15),
    loose: num(el, "loose", mobile, 0),
    s: num(el, "s", mobile, 0.8),
    shape,
    x: num(el, "x", mobile, 0),
    y: num(el, "y", mobile, 0),
  };
}

function budget() {
  const w = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  let count = w < 760 ? 4200 : w < 1100 ? 8000 : 12000;
  if (cores <= 4) count = Math.round(count * 0.7);
  return { ambient: 0.16, count, dprMax: coarse ? 1.5 : 1.75 };
}

export default function AtelierField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    restoreMotionChoice();
    const root = document.documentElement;
    if (prefersReducedMotion()) return;
    // Jede Einbindung bekommt eine eigene Leinwand: destroy() gibt den WebGL-Kontext frei, eine
    // wiederverwendete Leinwand (React StrictMode, schnelles Hin und Her) hätte nur noch einen toten Kontext.
    const canvas = document.createElement("canvas");
    canvas.className = "fx-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const lost = (event: Event) => {
      event.preventDefault();
      canvas.hidden = true;
    };
    canvas.addEventListener("webglcontextlost", lost);
    let field: GoldField;
    try {
      field = new GoldField(canvas, budget());
    } catch (error) {
      // Kein WebGL2 (alte Geräte, gesperrte GPU): die Seite bleibt vollständig, nur ohne Goldfeld.
      if (process.env.NODE_ENV !== "production") console.warn("AtelierField:", error);
      canvas.remove();
      return;
    }
    root.classList.add("fx-live");
    (window as unknown as { __afhField?: GoldField }).__afhField = field;

    samplePhoenix(PHOENIX_SRC).then((s) => field.setSamples(s));

    let scenes: HTMLElement[] = [];
    let active: HTMLElement | null = null;
    const collect = () => {
      scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-fx]"));
    };
    const pick = () => {
      const mid = window.innerHeight * 0.5;
      let found: HTMLElement | null = null;
      for (const el of scenes) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          found = el;
          break;
        }
      }
      if (found !== active) {
        active = found;
        apply();
      }
    };
    const apply = () => {
      const target = active ? readTarget(active) : null;
      field.setScene(target ?? { alpha: 0.5, heat: 0.3, loose: 0, s: 1, shape: "dust", x: 0, y: 0 });
    };

    collect();
    pick();
    apply();

    let ticking = false;
    const onScroll = () => {
      field.setScroll(window.scrollY);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        pick();
      });
    };
    const onResize = () => {
      field.resize();
      apply();
    };
    const onPointer = (event: PointerEvent) => field.setPointer(event.clientX, event.clientY, true);
    const onLeave = () => field.setPointer(-9999, -9999, false);

    const mo = new MutationObserver((records) => {
      if (records.some((r) => r.type === "childList")) collect();
      if (records.some((r) => r.target === active && r.type === "attributes")) apply();
    });
    mo.observe(document.body, { attributeFilter: ["data-fx", "data-fx-x", "data-fx-y", "data-fx-s", "data-fx-a", "data-fx-loose", "data-fx-heat"], attributes: true, childList: true, subtree: true });

    const sync = () => {
      if (document.hidden || isPaused() || prefersReducedMotion()) field.stop();
      else field.start();
    };
    const offMotion = onMotionChange(sync);
    sync();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);

    return () => {
      mo.disconnect();
      offMotion();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
      root.classList.remove("fx-live");
      canvas.removeEventListener("webglcontextlost", lost);
      field.destroy();
      canvas.remove();
    };
  }, []);

  return <div className="fx-host" ref={ref} />;
}
