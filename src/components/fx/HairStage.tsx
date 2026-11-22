"use client";

import { useEffect, useRef } from "react";

import { isPaused, onMotionChange, prefersReducedMotion } from "./motion";

/**
 * Bühne für die Haar-Simulation (fx/hair/engine.ts). Lädt die Engine erst, wenn die Szene in die
 * Nähe des Bildschirms kommt, und nur mit WebGL2. Ohne WebGL bleibt `fallback` (statisches Bild)
 * stehen; bei reduzierter Bewegung oder Pause zeigt sie ein einziges ruhiges Bild des Phönix.
 * Betritt die Szene den Bildschirm, ordnet sich das Haar vom Vorhang zum Phönix; beim Verlassen
 * fällt es zurück.
 */
type Props = { x?: number; y?: number; scale?: number; mx?: number; my?: number; mscale?: number; className?: string };

export function HairStage({ x = 0.64, y = 0.42, scale = 1, mx = 0.5, my = 0.3, mscale = 1.05, className }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const section = el?.parentElement;
    if (!el || !section || !("IntersectionObserver" in window)) return;
    let disposed = false;
    let cleanup: (() => void) | null = null;

    const boot = async () => {
      const { HairField } = await import("./hair/engine");
      if (disposed) return;
      const mobile = () => window.innerWidth < 760;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      let strands = mobile() ? 130 : 260;
      if ((navigator.hardwareConcurrency || 4) <= 4) strands = Math.round(strands * 0.7);

      const make = () => {
        const c = document.createElement("canvas");
        c.className = "af-fx-hair__canvas";
        c.setAttribute("aria-hidden", "true");
        el.appendChild(c);
        try {
          return { c, f: new HairField(c, { dprMax: coarse ? 1.5 : 2, segments: mobile() ? 16 : 22, strands }) };
        } catch {
          c.remove();
          return null;
        }
      };
      const first = make();
      if (!first) return;
      let canvas = first.c;
      let field = first.f;
      const place = () => field.setCenter(mobile() ? mx : x, mobile() ? my : y, mobile() ? mscale : scale);
      place();
      el.dataset.live = "";

      let visible = false;
      let inside = false;
      const still = () => isPaused() || prefersReducedMotion() || document.hidden;
      const sync = () => {
        if (still()) {
          field.still();
          return;
        }
        if (visible) field.start();
        else field.stop();
      };
      const slow = () => {
        // Schwache GPU: halb so viele Strähnen, gleiche Ordnung
        if (strands <= 70) return;
        strands = Math.round(strands / 2);
        field.destroy();
        canvas.remove();
        const next = make();
        if (!next) return;
        canvas = next.c;
        field = next.f;
        field.onSlow = slow;
        place();
        field.reset(inside ? 1 : 0);
        sync();
      };
      field.onSlow = slow;

      const near = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      near.observe(section);
      const enter = new IntersectionObserver(
        ([entry]) => {
          inside = entry.isIntersecting;
          field.setMorph(inside ? 1 : 0, inside ? 2800 : 1800);
        },
        { threshold: 0.35 },
      );
      enter.observe(section);

      const onPointer = (event: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        field.setPointer(event.clientX - r.left, event.clientY - r.top, true);
      };
      const onLeave = () => field.setPointer(-1e4, -1e4, false);
      let lastY = window.scrollY;
      const onScroll = () => {
        field.setGust(lastY - window.scrollY);
        lastY = window.scrollY;
      };
      const onResize = () => {
        field.resize();
        place();
        if (still()) field.still();
      };
      section.addEventListener("pointermove", onPointer, { passive: true });
      section.addEventListener("pointerdown", onPointer, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", sync);
      const offMotion = onMotionChange(sync);
      sync();

      cleanup = () => {
        near.disconnect();
        enter.disconnect();
        offMotion();
        section.removeEventListener("pointermove", onPointer);
        section.removeEventListener("pointerdown", onPointer);
        section.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", sync);
        field.destroy();
        canvas.remove();
        delete el.dataset.live;
      };
    };

    // erst laden, wenn die Szene näher als ~1 Bildschirm ist (nicht im Hauptpfad)
    const lazy = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        lazy.disconnect();
        void boot();
      },
      { rootMargin: "100% 0px" },
    );
    lazy.observe(section);
    return () => {
      disposed = true;
      lazy.disconnect();
      cleanup?.();
    };
  }, [x, y, scale, mx, my, mscale]);

  return <div aria-hidden="true" className={`af-fx-hair${className ? ` ${className}` : ""}`} ref={host} />;
}
