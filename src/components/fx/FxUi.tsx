"use client";

import { useEffect } from "react";

import { isPaused, onMotionChange, prefersReducedMotion } from "./motion";

/**
 * Globale Effekt-Schicht (einmal im Layout eingehängt, ohne eigenes Markup im HTML):
 *  - eigener Cursor (nur Maus/Stift): Punkt + Lichtring; über Links wächst der Ring, über
 *    `[data-lens]`-Bildern wird er zur Lupe mit echter Vergrößerung des Bildes.
 *  - `[data-tilt]`: 3D-Neigung zum Zeiger, setzt --rx/--ry (-1…1) für Licht und Parallaxe.
 *  - `[data-magnetic]`: Knopf folgt dem Zeiger ein Stück (max. 10 px).
 * Touch-Geräte bekommen nichts davon. Reduzierte Bewegung/Pause: Cursor ohne Nachziehen,
 * keine Neigung, kein Magnet.
 */
const LENS = 2.4;

export function FxUi() {
  // Echte Lichtbrechung im Glas nur, wo backdrop-filter mit SVG-Filter läuft (Chromium)
  useEffect(() => {
    const root = document.documentElement;
    if ("userAgentData" in navigator && CSS.supports("backdrop-filter", "url(#af-glass-lens)")) root.classList.add("af-lens");
    return () => root.classList.remove("af-lens");
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const root = document.documentElement;
    const calm = () => prefersReducedMotion() || isPaused();

    const cursor = document.createElement("div");
    cursor.className = "af-fx-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="af-fx-cursor__ring"></span><span class="af-fx-cursor__dot"></span>';
    document.body.appendChild(cursor);
    const ring = cursor.firstElementChild as HTMLElement;
    const dot = cursor.lastElementChild as HTMLElement;
    root.classList.add("af-fx-cursor-on");

    const p = { x: -100, y: -100 };
    const r = { x: -100, y: -100 };
    let raf = 0;
    let lensImg: HTMLImageElement | null = null;
    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;
    let glassEl: HTMLElement | null = null;

    const frame = () => {
      raf = 0;
      const k = calm() ? 1 : 0.22;
      r.x += (p.x - r.x) * k;
      r.y += (p.y - r.y) * k;
      dot.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      if (lensImg) {
        const b = lensImg.getBoundingClientRect();
        const src = lensImg.currentSrc || lensImg.src;
        if (ring.dataset.src !== src) {
          ring.style.backgroundImage = `url("${src}")`;
          ring.dataset.src = src;
        }
        ring.style.backgroundSize = `${b.width * LENS}px ${b.height * LENS}px`;
        const size = ring.offsetWidth;
        ring.style.backgroundPosition = `${-((r.x - b.left) * LENS - size / 2)}px ${-((r.y - b.top) * LENS - size / 2)}px`;
      }
      if (Math.abs(p.x - r.x) > 0.3 || Math.abs(p.y - r.y) > 0.3) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const resetTilt = () => {
      if (!tiltEl) return;
      tiltEl.style.setProperty("--rx", "0");
      tiltEl.style.setProperty("--ry", "0");
      delete tiltEl.dataset.tilting;
      tiltEl = null;
    };
    const resetGlass = () => {
      if (!glassEl) return;
      glassEl.style.removeProperty("--mx");
      glassEl.style.removeProperty("--my");
      glassEl = null;
    };
    const resetMag = () => {
      if (!magEl) return;
      magEl.style.translate = "";
      magEl = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      p.x = event.clientX;
      p.y = event.clientY;
      cursor.dataset.shown = "";
      const target = event.target instanceof Element ? event.target : null;
      // Zustand des Cursors
      const lensHost = target?.closest<HTMLElement>("[data-lens]") ?? null;
      const img = lensHost?.querySelector<HTMLImageElement>("img") ?? null;
      if (img !== lensImg) {
        lensImg = img;
        if (!img) {
          ring.style.backgroundImage = "";
          delete ring.dataset.src;
        }
      }
      const field = target?.closest("input, textarea, select, [contenteditable='true']");
      const link = target?.closest("a, button, [role='button'], label, summary");
      cursor.dataset.state = lensImg ? "lens" : field ? "text" : link ? "link" : "";
      // Farbzone unter dem Zeiger: auf Hell wird der Cursor dunkel (Bildflächen bleiben Bühne)
      const zone = target?.closest(".af-zone-light, .af-zone-dark, .af-card__media, .af-pdp__gallery");
      if (zone?.classList.contains("af-zone-light")) cursor.dataset.zone = "light";
      else delete cursor.dataset.zone;
      // Neigung
      const tilt = calm() ? null : (target?.closest<HTMLElement>("[data-tilt]") ?? null);
      if (tilt !== tiltEl) resetTilt();
      if (tilt) {
        tiltEl = tilt;
        const b = tilt.getBoundingClientRect();
        tilt.dataset.tilting = "";
        tilt.style.setProperty("--rx", (((p.x - b.left) / b.width) * 2 - 1).toFixed(3));
        tilt.style.setProperty("--ry", (((p.y - b.top) / b.height) * 2 - 1).toFixed(3));
      }
      // Glanzlicht im Glas folgt dem Zeiger (bei reduzierter Bewegung bleibt es stehen)
      const glass = calm() ? null : (target?.closest<HTMLElement>(".af-glass") ?? null);
      if (glass !== glassEl) resetGlass();
      if (glass) {
        glassEl = glass;
        const b = glass.getBoundingClientRect();
        glass.style.setProperty("--mx", `${(((p.x - b.left) / b.width) * 100).toFixed(1)}%`);
        glass.style.setProperty("--my", `${(((p.y - b.top) / b.height) * 100).toFixed(1)}%`);
      }
      // Magnet
      const mag = calm() ? null : (target?.closest<HTMLElement>("[data-magnetic]") ?? null);
      if (mag !== magEl) resetMag();
      if (mag) {
        magEl = mag;
        const b = mag.getBoundingClientRect();
        const dx = p.x - (b.left + b.width / 2);
        const dy = p.y - (b.top + b.height / 2);
        mag.style.translate = `${Math.max(-10, Math.min(10, dx * 0.18)).toFixed(1)}px ${Math.max(-8, Math.min(8, dy * 0.3)).toFixed(1)}px`;
      }
      kick();
    };
    const onLeave = () => {
      delete cursor.dataset.shown;
      resetTilt();
      resetMag();
      resetGlass();
    };
    const onDown = () => (cursor.dataset.down = "");
    const onUp = () => delete cursor.dataset.down;
    const onMotion = () => {
      if (calm()) {
        resetTilt();
        resetMag();
        resetGlass();
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    const offMotion = onMotionChange(onMotion);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      offMotion();
      resetTilt();
      resetMag();
      resetGlass();
      cursor.remove();
      root.classList.remove("af-fx-cursor-on");
    };
  }, []);
  return null;
}
