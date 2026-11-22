"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { isPaused, prefersReducedMotion, useMotionStill } from "@/components/fx/motion";

import { emphasis } from "./emphasis";

export type FilmChapter = { label: string; title: string };

/**
 * Der Film „Wie neu geboren“: eine durchgehende Einstellung in drei Kapiteln (Glut → Phönix → Haar).
 * Das Standbild darunter ist das ERSTE Filmbild (Glut, siehe HeroShowcase): Beim Start setzt der Film nahtlos darauf
 * an, die Seite „startet“ nicht noch einmal. Die Beschriftung beginnt deshalb mit Kapitel 1; Kapitelstriche laufen mit.
 * Kein Film bei „Bewegung reduzieren“ oder pausierter Bewegung: dann stehen das Endbild (Haar) und das letzte Kapitel.
 * Eigener Pause-Knopf (WCAG 2.2.2): Das Bild bleibt dabei auf dem aktuellen Filmbild stehen.
 */
export function HeroFilm({
  desktop,
  mobile,
  chapters,
  pauseLabel,
  playLabel,
  endPoster,
  posterSizes,
}: {
  desktop: string;
  mobile: string;
  chapters: FilmChapter[];
  pauseLabel: string;
  playLabel: string;
  /** Endbild des Films (Haar) für den Standbild-Fall. */
  endPoster: string;
  posterSizes: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barsRef = useRef<HTMLOListElement>(null);
  const still = useMotionStill();
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const last = chapters.length - 1;
  const [playedChapter, setChapter] = useState(0);
  // Standbild, ohne dass der Film je lief: Endbild und letztes Kapitel (abgeleitet, kein Zustand nachziehen)
  const endState = still && !started;
  const chapter = endState ? last : playedChapter;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // `still` steht erst nach dem Hydrieren fest; die Systemeinstellung gleich direkt prüfen, damit bei
    // „Bewegung reduzieren“ der Film gar nicht erst angefordert wird
    if (still || userPaused || prefersReducedMotion() || isPaused()) {
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
  const final = chapters[last];

  return (
    <>
      {endState ? <Image alt="" className="af-hx__poster" fill loading="eager" quality={70} sizes={posterSizes} src={endPoster} /> : null}
      <video
        aria-hidden="true"
        className="af-hx__video"
        data-playing={started}
        disablePictureInPicture
        loop
        muted
        onPause={() => setPlaying(false)}
        onPlaying={() => {
          setPlaying(true);
          setStarted(true);
        }}
        playsInline
        preload="none"
        ref={videoRef}
        tabIndex={-1}
      />
      <div className="af-hx__chapter">
        <ol aria-hidden="true" className="af-hx__bars" data-running={playing} ref={barsRef}>
          {chapters.map((c) => (
            <li data-done={endState} key={c.label} />
          ))}
        </ol>
        <div className="af-hx__cap">
          <p className="af-mono" key={`l${chapter}`}>
            {String(chapter + 1).padStart(2, "0")} · {active.label}
          </p>
          <p className="af-hx__filmtitle" key={`t${chapter}`}>
            {emphasis(active.title)}
          </p>
        </div>
        {/* Bei „Bewegung reduzieren“ wählt CSS schon im ersten Bild diese Fassung (letztes Kapitel), nichts springt beim Hydrieren */}
        <div className="af-hx__cap af-hx__cap--still">
          <p className="af-mono">
            {String(last + 1).padStart(2, "0")} · {final.label}
          </p>
          <p className="af-hx__filmtitle">{emphasis(final.title)}</p>
        </div>
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
