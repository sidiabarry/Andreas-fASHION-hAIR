"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImgHTMLAttributes } from "react";

import { Arrow } from "@/components/Arrow";
import { restoreMotionChoice, setPaused, useMotionStill, useReducedMotion, useUserPaused } from "@/components/fx/motion";
import { Link } from "@/i18n/navigation";

import { Words } from "./Words";

/**
 * Ankunft: läuft von selbst ab (~15 s), ohne Scroll-Kopplung.
 * Kapitel 1 Glut → 2 Licht (Phönix aus Partikeln) → 3 Haar (Strähnen); danach Ruhe.
 * Die drei Filme liegen gestapelt und werden überblendet; nur der aktive spielt.
 * Text, Knöpfe und Poster sind ab dem ersten Bild da (LCP = Poster/Text, nicht Video/WebGL).
 */
type Poster = { img: ImgHTMLAttributes<HTMLImageElement>; mobileSrcSet: string };

export type HeroTexts = {
  kicker: string;
  lines: [string, string, string];
  lead: string;
  chapters: string;
  labels: [string, string, string];
  pause: string;
  play: string;
  replay: string;
  filmAlt: string;
  ctaCollection: string;
  ctaConsult: string;
  ctaConsultVia: string;
  whatsappNote: string;
};

const CHAPTER_MS = 5000;

/** Partikel je Kapitel (Desktop: rechts neben dem Text; Handy: oben über dem Text). */
const FX: Record<number, Record<string, string>> = {
  0: { "data-fx": "embers", "data-fx-a": "0.95", "data-fx-heat": "1", "data-fx-loose": "0.55", "data-fx-mx": "0", "data-fx-my": "0.05", "data-fx-s": "1.15", "data-fx-x": "0.3", "data-fx-y": "-0.1" },
  1: { "data-fx": "phoenix", "data-fx-a": "1", "data-fx-heat": "0.2", "data-fx-loose": "0", "data-fx-ms": "0.58", "data-fx-mx": "0", "data-fx-my": "0.4", "data-fx-s": "0.6", "data-fx-x": "0.42", "data-fx-y": "0.06" },
  2: { "data-fx": "strands", "data-fx-a": "0.8", "data-fx-heat": "0.05", "data-fx-loose": "0", "data-fx-ms": "0.75", "data-fx-mx": "0", "data-fx-my": "0.42", "data-fx-s": "0.82", "data-fx-x": "0.44", "data-fx-y": "0.12" },
};

export function Hero({ texts, posters, videos, whatsapp }: { texts: HeroTexts; posters: Poster[]; videos: { desktop: string; mobile: string }[]; whatsapp: string | null }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [videoSize, setVideoSize] = useState<"desktop" | "mobile" | null>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState<boolean[]>([false, false, false]);
  const reduced = useReducedMotion();
  const still = useMotionStill();
  const userPaused = useUserPaused();
  const chapter = reduced ? 1 : step;
  const useVideo = videoSize !== null && !reduced;
  const section = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  // Gerät prüfen: Datensparen/langsame Verbindung/reduzierte Bewegung → nur Poster
  useEffect(() => {
    restoreMotionChoice();
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = Boolean(conn?.saveData) || /(^|-)2g|3g/.test(conn?.effectiveType ?? "");
    if (!slow) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Geräteprüfung nach dem Hydrieren
      setVideoSize(window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");
    }
    const element = section.current;
    if (!element) return;
    let inView = false;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Uhr: zählt nur, solange sich etwas bewegen darf
  useEffect(() => {
    if (done || still || !visible) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - last;
      last = now;
      const bar = bars.current[chapter];
      if (bar) bar.style.transform = `scaleX(${Math.min(1, elapsed.current / CHAPTER_MS)})`;
      if (elapsed.current >= CHAPTER_MS) {
        elapsed.current = 0;
        if (chapter < 2) setStep(chapter + 1);
        else {
          if (bar) bar.style.transform = "scaleX(1)";
          setDone(true);
        }
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [chapter, done, still, visible]);

  // Fortschrittsbalken der Kapitel
  useEffect(() => {
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      bar.style.transform = i < chapter || done ? "scaleX(1)" : `scaleX(${i === chapter ? elapsed.current / CHAPTER_MS : 0})`;
    });
  }, [chapter, done]);

  // Filme: nur der aktive spielt; der nächste lädt vor
  useEffect(() => {
    if (!useVideo) return;
    vids.current.forEach((video, i) => {
      if (!video) return;
      if (i === chapter && visible && !still && !done) video.play().catch(() => undefined);
      else video.pause();
    });
  }, [chapter, done, still, useVideo, visible]);

  const replay = useCallback(() => {
    elapsed.current = 0;
    vids.current.forEach((v) => {
      if (v) v.currentTime = 0;
    });
    setDone(false);
    setStep(0);
    if (bars.current[0]) bars.current[0].style.transform = "scaleX(0)";
    if (userPaused) setPaused(false);
  }, [userPaused]);

  const markReady = (i: number) => setReady((r) => (r[i] ? r : r.map((v, k) => (k === i ? true : v))));
  const fx = FX[done ? 2 : chapter];

  return (
    <section aria-labelledby="hero-title" className="hero" data-chapter={chapter} ref={section} {...fx}>
      <div className="hero__stage">
        {posters.map((poster, i) => (
          <picture className="hero__poster" data-on={i === chapter || undefined} key={i}>
            <source media="(max-width: 767px)" srcSet={poster.mobileSrcSet} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt kommt aus getImageProps (dekorativ, der Film ist unten beschrieben) */}
            <img {...poster.img} />
          </picture>
        ))}
        {useVideo
          ? videos.map((video, i) => (
              <video
                aria-hidden="true"
                className="hero__video"
                data-on={(i === chapter && ready[i] && !done) || undefined}
                disablePictureInPicture
                key={i}
                muted
                onPlaying={() => markReady(i)}
                playsInline
                preload={i === chapter + 1 && visible && !still ? "auto" : "none"}
                ref={(node) => {
                  vids.current[i] = node;
                }}
                src={video[videoSize]}
                tabIndex={-1}
              />
            ))
          : null}
        <div className="hero__veil" />
      </div>

      <div className="af-wrap hero__in">
        <p className="hero__kicker">{texts.kicker}</p>
        <h1 className="hero__title" id="hero-title">
          {texts.lines.map((line, i) => (
            <span className="hero__line" data-on={i === chapter || undefined} key={i}>
              <Words text={line} />{" "}
            </span>
          ))}
        </h1>
        <p className="hero__lead">{texts.lead}</p>
        <div className="hero__actions">
          <Link className="af-cta-gold" href="/kollektion">
            <span>{texts.ctaCollection}</span> <Arrow />
          </Link>
          {whatsapp ? (
            <a className="af-cta-line" href={whatsapp} rel="noopener noreferrer" target="_blank">
              <span>{texts.ctaConsult}</span>
              <small>
                {texts.ctaConsultVia}
                <span className="af-sr"> {texts.whatsappNote}</span>
              </small>
            </a>
          ) : (
            <Link className="af-cta-line" href="/anfrage">
              <span>{texts.ctaConsult}</span>
            </Link>
          )}
        </div>
        <p className="af-sr">{texts.filmAlt}</p>
      </div>

      {!reduced ? <div className="af-wrap hero__chapters">
        <ol aria-label={texts.chapters}>
          {texts.labels.map((label, i) => (
            <li aria-current={i === chapter ? "step" : undefined} data-past={i < chapter || done || undefined} key={label}>
              <span className="hero__num">0{i + 1}</span> {label}
              <span aria-hidden="true" className="hero__bar">
                <span
                  ref={(node) => {
                    bars.current[i] = node;
                  }}
                />
              </span>
            </li>
          ))}
        </ol>
        <div className="hero__ctrls">
          {done ? (
            <button className="hero__ctrl" onClick={replay} type="button">
              <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14">
                <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {texts.replay}
            </button>
          ) : null}
          <button className="hero__ctrl" onClick={() => setPaused(!userPaused)} type="button">
            <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14">
              {userPaused ? <path d="M5 3l8 5-8 5z" fill="currentColor" /> : <path d="M5 3h2v10H5zM9 3h2v10H9z" fill="currentColor" />}
            </svg>
            {userPaused ? texts.play : texts.pause}
          </button>
        </div>
      </div> : null}
    </section>
  );
}
