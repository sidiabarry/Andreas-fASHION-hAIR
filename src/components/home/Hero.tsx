"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImgHTMLAttributes } from "react";

import { Arrow } from "@/components/Arrow";
import { prefersReducedMotion, setPaused, useMotionStill, useUserPaused } from "@/components/fx/motion";
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
  trust: string[];
  trustLabel: string;
  filmAlt: string;
  ctaExtensions: string;
  ctaCustom: string;
};

const CHAPTER_MS = 5000;

/** Partikel je Kapitel (Desktop: rechts neben dem Text; Handy: oben über dem Text). */
const FX: Record<number, Record<string, string>> = {
  0: { "data-fx": "embers", "data-fx-a": "0.95", "data-fx-heat": "1", "data-fx-loose": "0.55", "data-fx-mx": "0", "data-fx-my": "0.05", "data-fx-s": "1.15", "data-fx-x": "0.3", "data-fx-y": "-0.1" },
  1: { "data-fx": "phoenix", "data-fx-a": "1", "data-fx-heat": "0.2", "data-fx-loose": "0", "data-fx-ms": "0.58", "data-fx-mx": "0", "data-fx-my": "0.4", "data-fx-s": "0.6", "data-fx-x": "0.42", "data-fx-y": "0.06" },
  2: { "data-fx": "strands", "data-fx-a": "0.8", "data-fx-heat": "0.05", "data-fx-loose": "0", "data-fx-ms": "0.75", "data-fx-mx": "0", "data-fx-my": "0.42", "data-fx-s": "0.82", "data-fx-x": "0.44", "data-fx-y": "0.12" },
};

export function Hero({ texts, posters, videos }: { texts: HeroTexts; posters: Poster[]; videos: { desktop: string; mobile: string }[] }) {
  const [chapter, setChapter] = useState(0);
  const [done, setDone] = useState(false);
  const [useVideo, setUseVideo] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState<boolean[]>([false, false, false]);
  const still = useMotionStill();
  const userPaused = useUserPaused();
  const elapsed = useRef(0);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  // Gerät prüfen: Datensparen/langsame Verbindung/reduzierte Bewegung → nur Poster
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = Boolean(conn?.saveData) || /(^|-)2g|3g/.test(conn?.effectiveType ?? "");
    const reduced = prefersReducedMotion();
    /* eslint-disable react-hooks/set-state-in-effect -- einmalige Geräteprüfung nach dem Hydrieren */
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    setUseVideo(!slow && !reduced);
    if (reduced) {
      setChapter(2);
      setDone(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Uhr: zählt nur, solange sich etwas bewegen darf
  useEffect(() => {
    if (done || still) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - last;
      last = now;
      const bar = bars.current[chapter];
      if (bar) bar.style.transform = `scaleX(${Math.min(1, elapsed.current / CHAPTER_MS)})`;
      if (elapsed.current >= CHAPTER_MS) {
        elapsed.current = 0;
        if (chapter < 2) setChapter(chapter + 1);
        else setDone(true);
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [chapter, done, still]);

  // Fortschrittsbalken der Kapitel
  useEffect(() => {
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      if (i < chapter || done) bar.style.transform = "scaleX(1)";
      else if (i > chapter) bar.style.transform = "scaleX(0)";
    });
  }, [chapter, done]);

  // Filme: nur der aktive spielt; der nächste lädt vor
  useEffect(() => {
    if (!useVideo) return;
    vids.current.forEach((video, i) => {
      if (!video) return;
      if (i === chapter) {
        if (still) video.pause();
        else if (!(done && video.ended)) video.play().catch(() => undefined);
      } else if (i === chapter + 1) {
        video.preload = "auto";
      } else {
        window.setTimeout(() => video.pause(), 1400);
      }
    });
  }, [chapter, done, still, useVideo]);

  const replay = useCallback(() => {
    elapsed.current = 0;
    vids.current.forEach((v) => {
      if (v) v.currentTime = 0;
    });
    setDone(false);
    setChapter(0);
    if (userPaused) setPaused(false);
  }, [userPaused]);

  const markReady = (i: number) => setReady((r) => (r[i] ? r : r.map((v, k) => (k === i ? true : v))));
  const fx = FX[done ? 2 : chapter];

  return (
    <section aria-labelledby="hero-title" className="hero" data-chapter={chapter} data-done={done || undefined} {...fx}>
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
                data-on={(i === chapter && ready[i]) || undefined}
                disablePictureInPicture
                key={i}
                muted
                onPlaying={() => markReady(i)}
                playsInline
                preload={i === 0 ? "auto" : "none"}
                ref={(node) => {
                  vids.current[i] = node;
                }}
                src={mobile ? video.mobile : video.desktop}
                tabIndex={-1}
              />
            ))
          : null}
        <div className="hero__veil" />
        <p className="af-sr">{texts.filmAlt}</p>
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
          <Link className="h-btn h-btn--gold" data-magnetic="" href="/extensions">
            <span>{texts.ctaExtensions}</span> <Arrow />
          </Link>
          <Link className="h-link" href="/massanfertigung">
            {texts.ctaCustom}
          </Link>
        </div>
        <ul aria-label={texts.trustLabel} className="hero__trust">
          {texts.trust.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="af-wrap hero__chapters">
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
      </div>
    </section>
  );
}
