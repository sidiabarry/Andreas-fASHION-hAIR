"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionStill } from "./motion";

/**
 * Stummes Stimmungsvideo über einem Standbild (dem ersten Filmbild): lädt erst, wenn es ins Bild kommt, läuft nur,
 * solange es sichtbar ist, und blendet nahtlos über das Standbild. Bei „Bewegung reduzieren“ oder Pause bleibt das
 * Standbild stehen (WCAG 2.2.2). Rein dekorativ: für Screenreader unsichtbar.
 */
export function AmbientVideo({ desktop, mobile, className = "" }: { desktop: string; mobile: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const still = useMotionStill();
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (still || !visible) {
      video.pause();
      return;
    }
    if (!video.getAttribute("src")) video.src = window.matchMedia("(max-width: 759px)").matches ? mobile : desktop;
    video.play().catch(() => {
      /* Autoplay verweigert: Standbild bleibt */
    });
  }, [still, visible, desktop, mobile]);

  return (
    <video
      aria-hidden="true"
      className={`af-ambient ${className}`}
      data-playing={playing}
      disablePictureInPicture
      loop
      muted
      onPause={() => setPlaying(false)}
      onPlaying={() => setPlaying(true)}
      playsInline
      preload="none"
      ref={ref}
      tabIndex={-1}
    />
  );
}
