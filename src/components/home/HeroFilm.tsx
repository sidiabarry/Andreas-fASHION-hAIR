"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionStill } from "@/components/fx/motion";

/**
 * Film im Hero. Das Standbild darunter bleibt das LCP-Bild, der Film blendet sich nach dem Laden darüber.
 * Kein Film bei „Bewegung reduzieren“, pausierter Bewegung oder Datensparmodus.
 * Eigener Pause-Knopf (WCAG 2.2.2), weil der Film länger als fünf Sekunden läuft.
 */
export function HeroFilm({ desktop, mobile, pauseLabel, playLabel }: { desktop: string; mobile: string; pauseLabel: string; playLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const still = useMotionStill();
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // Einmalige Fähigkeitsprüfung nach dem Mounten (Server kennt weder Bildschirm noch Datensparmodus)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(!connection?.saveData);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !allowed) return;
    if (still || userPaused) {
      video.pause();
      return;
    }
    if (!video.src) video.src = window.matchMedia("(max-width: 759px)").matches ? mobile : desktop;
    video.play().catch(() => {
      /* Autoplay verweigert: Standbild bleibt stehen */
    });
  }, [allowed, still, userPaused, desktop, mobile]);

  return (
    <>
      <video
        aria-hidden="true"
        className="af-hx__video"
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
      {allowed && !still ? (
        <button aria-label={userPaused ? playLabel : pauseLabel} aria-pressed={userPaused} className="af-hx__pause" onClick={() => setUserPaused((p) => !p)} type="button">
          <svg aria-hidden="true" height="14" viewBox="0 0 14 14" width="14">
            {userPaused ? <path d="M3 1.5v11l9-5.5z" fill="currentColor" /> : <path d="M3 1.5h2.6v11H3zM8.4 1.5H11v11H8.4z" fill="currentColor" />}
          </svg>
        </button>
      ) : null}
    </>
  );
}
