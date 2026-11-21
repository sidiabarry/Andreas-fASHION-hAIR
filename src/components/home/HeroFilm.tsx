"use client";

import { useEffect, useRef } from "react";

/**
 * Spielt den Film im Bogen ab, sobald die Seite steht. Das Standbild darunter bleibt das LCP-Bild.
 * Kein Film bei „Bewegung reduzieren“ oder Datensparmodus.
 */
export function HeroFilm({ desktop, mobile }: { desktop: string; mobile: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    video.src = window.matchMedia("(max-width: 767px)").matches ? mobile : desktop;
    video.play().catch(() => {
      /* Autoplay verweigert: Standbild bleibt stehen */
    });
  }, [desktop, mobile]);

  return (
    <video
      aria-hidden="true"
      className="af-hero__film"
      disablePictureInPicture
      loop
      muted
      onPlaying={(event) => {
        event.currentTarget.dataset.playing = "true";
      }}
      playsInline
      preload="none"
      ref={ref}
      tabIndex={-1}
    />
  );
}
