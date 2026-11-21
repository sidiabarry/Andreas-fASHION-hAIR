"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionStill } from "@/components/fx/motion";

import { emphasis } from "./emphasis";

export type FilmChapter = { label: string; title: string };

/**
 * Der Film „Wie neu geboren“: eine durchgehende Einstellung in drei Kapiteln (Glut → Phönix → Haar).
 * Das Standbild darunter (letztes Bild des Films) bleibt das LCP-Bild, der Film blendet sich darüber.
 * Kapitelstriche laufen mit dem Film mit. Eigener Pause-Knopf (WCAG 2.2.2).
 * Kein Film bei „Bewegung reduzieren“ oder pausierter Bewegung: dann steht das letzte Kapitel.
 */
export function HeroFilm({
  desktop,
  mobile,
  chapters,
  pauseLabel,
  playLabel,
}: {
  desktop: string;
  mobile: string;
  chapters: FilmChapter[];
  pauseLabel: string;
  playLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barsRef = useRef<HTMLOListElement>(null);
  const still = useMotionStill();
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const last = chapters.length - 1;
  const [chapter, setChapter] = useState(last);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (still || userPaused) {
      video.pause();
      return;
    }
    if (!video.getAttribute("src")) video.src = window.matchMedia("(max-width: 759px)").matches ? mobile : desktop;
    video.play().catch(() => {
      /* Autoplay verweigert: Standbild bleibt stehen */
    });
  }, [still, userPaused, desktop, mobile]);

  // Kapitelstriche: Fortschritt direkt als CSS-Variable setzen (kein Re-Render pro Bild)
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const video = videoRef.current;
      const bars = barsRef.current;
      if (video && bars && video.duration) {
        const span = video.duration / chapters.length;
        const current = Math.min(last, Math.floor(video.currentTime / span));
        setChapter((prev) => (prev === current ? prev : current));
        bars.querySelectorAll<HTMLElement>("li").forEach((li, i) => {
          const p = Math.max(0, Math.min(1, (video.currentTime - i * span) / span));
          li.style.setProperty("--p", String(p));
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, chapters.length, last]);

  const active = chapters[chapter] ?? chapters[last];

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
        ref={videoRef}
        tabIndex={-1}
      />
      <div className="af-hx__chapter">
        <ol aria-hidden="true" className="af-hx__bars" data-running={playing} ref={barsRef}>
          {chapters.map((c, i) => (
            <li data-done={!playing && i <= chapter} key={c.label} />
          ))}
        </ol>
        <p className="af-mono" key={`l${chapter}`}>
          {String(chapter + 1).padStart(2, "0")} · {active.label}
        </p>
        <p className="af-hx__filmtitle" key={`t${chapter}`}>
          {emphasis(active.title)}
        </p>
      </div>
      {!still ? (
        <button aria-label={userPaused ? playLabel : pauseLabel} aria-pressed={userPaused} className="af-hx__pause" onClick={() => setUserPaused((p) => !p)} type="button">
          <svg aria-hidden="true" height="14" viewBox="0 0 14 14" width="14">
            {userPaused ? <path d="M3 1.5v11l9-5.5z" fill="currentColor" /> : <path d="M3 1.5h2.6v11H3zM8.4 1.5H11v11H8.4z" fill="currentColor" />}
          </svg>
        </button>
      ) : null}
    </>
  );
}
