"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMotionStill } from "@/components/fx/motion";

export type GalleryShot = {
  src: string;
  alt: string;
  label: string;
  /** Kurzer Hinweis unter der Bühne (z. B. „Bild mit KI bearbeitet.“, „Echtes Foto aus dem Atelier“). */
  caption?: string;
  /** Film statt Bild: stumm, in Schleife, mit Pause-Knopf. */
  video?: { poster: string };
};

type Labels = {
  zoom: string;
  close: string;
  hint: string;
  loupe?: string;
  loupeOff?: string;
  prev: string;
  next: string;
  play: string;
  pause: string;
  film: string;
};

/**
 * Produktgalerie: wischbare Bühne (Scroll-Snap), Vorschaubilder, Pfeile, Lupe, Vollbild-Zoom und Film.
 * Der Film lädt erst, wenn er gezeigt wird, läuft nur dann und respektiert „Bewegung reduzieren“ (WCAG 2.2.2).
 */
export function Gallery({ shots, labels }: { shots: GalleryShot[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [loupe, setLoupe] = useState(false);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const videos = useRef<Map<number, HTMLVideoElement>>(new Map());
  const still = useMotionStill();
  const current = shots[Math.min(index, shots.length - 1)];

  // Aktives Bild aus der Scrollposition ableiten (Wischen, Pfeile, Vorschaubilder)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setIndex((prev) => (prev === next ? prev : Math.max(0, Math.min(shots.length - 1, next))));
        setLens(null);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [shots.length]);

  // Film nur abspielen, solange er gezeigt wird
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (i === index && !still && !paused) {
        if (!video.getAttribute("src")) video.src = video.dataset.src ?? "";
        video.play().catch(() => {
          /* Autoplay verweigert: Standbild bleibt, Knopf startet */
        });
      } else {
        video.pause();
      }
    });
  }, [index, still, paused]);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const target = (i + shots.length) % shots.length;
      el.scrollTo({ behavior: still ? "auto" : "smooth", left: target * el.clientWidth });
      setIndex(target);
    },
    [shots.length, still],
  );

  const isVideo = Boolean(current.video);

  return (
    <>
      <div className="af-gal" data-count={shots.length}>
        <div
          aria-label={current.label}
          aria-roledescription="carousel"
          className="af-gal__track"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(index + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(index - 1);
            }
          }}
          ref={track}
          role="region"
          tabIndex={0}
        >
          {shots.map((shot, i) => (
            <div
              aria-hidden={i !== index}
              className="af-gal__slide"
              data-lens={i === index && loupe ? "" : undefined}
              key={shot.src}
              onPointerLeave={() => setLens(null)}
              onPointerMove={(e) => {
                if (!loupe || shot.video || i !== index) return;
                const box = e.currentTarget.getBoundingClientRect();
                setLens({ h: box.height, w: box.width, x: e.clientX - box.left, y: e.clientY - box.top });
              }}
            >
              {shot.video ? (
                <video
                  aria-label={shot.alt}
                  className="af-gal__video"
                  data-src={shot.src}
                  disablePictureInPicture
                  loop
                  muted
                  playsInline
                  poster={shot.video.poster}
                  preload="none"
                  ref={(el) => {
                    if (el) videos.current.set(i, el);
                    else videos.current.delete(i);
                  }}
                />
              ) : (
                <Image alt={shot.alt} height={1600} priority={i === 0} sizes="(max-width: 900px) 100vw, 640px" src={shot.src} width={1200} />
              )}
              {i === index && lens && !shot.video ? (
                <span aria-hidden="true" className="af-loupe" style={{ left: lens.x - 80, top: lens.y - 80 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Lupe: gleiches Bild, 2,8-fach, ohne Ladezeit */}
                  <img alt="" src={shot.src} style={{ height: lens.h * 2.8, left: 80 - lens.x * 2.8, top: 80 - lens.y * 2.8, width: lens.w * 2.8 }} />
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <p aria-hidden="true" className="af-gal__count">
          {index + 1} / {shots.length}
        </p>

        {shots.length > 1 ? (
          <>
            <button aria-label={labels.prev} className="af-gal__nav af-gal__nav--prev" onClick={() => go(index - 1)} type="button">
              <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <button aria-label={labels.next} className="af-gal__nav af-gal__nav--next" onClick={() => go(index + 1)} type="button">
              <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </>
        ) : null}

        <div className="af-gal__tools">
          {isVideo ? (
            <button
              aria-label={paused || still ? labels.play : labels.pause}
              aria-pressed={!(paused || still)}
              className="af-zoombtn af-gal__tool"
              onClick={() => {
                const video = videos.current.get(index);
                if (!video) return;
                if (video.paused) {
                  if (!video.getAttribute("src")) video.src = video.dataset.src ?? "";
                  setPaused(false);
                  video.play().catch(() => undefined);
                } else {
                  setPaused(true);
                  video.pause();
                }
              }}
              type="button"
            >
              {paused || still ? (
                <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              ) : (
                <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
                </svg>
              )}
            </button>
          ) : (
            <>
              {labels.loupe ? (
                <button
                  aria-label={loupe ? labels.loupeOff : labels.loupe}
                  aria-pressed={loupe}
                  className="af-zoombtn af-gal__tool af-gal__tool--loupe"
                  onClick={() => {
                    setLoupe((on) => !on);
                    setLens(null);
                  }}
                  type="button"
                >
                  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m14.5 14.5 6 6" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              ) : null}
              <button
                aria-label={labels.zoom}
                className="af-zoombtn af-gal__tool"
                onClick={() => {
                  setScale(1);
                  dialog.current?.showModal();
                }}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                  <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {current.caption ? (
        <p aria-live="polite" className="af-gal__caption" data-kind={isVideo ? "video" : undefined}>
          {current.caption}
        </p>
      ) : null}

      {shots.length > 1 ? (
        <div className="af-pdp__thumbs">
          {shots.map((shot, i) => (
            <button aria-label={shot.label} aria-pressed={i === index} className="af-thumb" data-video={shot.video ? "" : undefined} key={shot.src} onClick={() => go(i)} type="button">
              <Image alt="" height={108} sizes="84px" src={shot.video ? shot.video.poster : shot.src} width={84} />
              {shot.video ? (
                <span aria-hidden="true" className="af-thumb__film">
                  <svg height="10" viewBox="0 0 24 24" width="10">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  {labels.film}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      <dialog aria-label={labels.zoom} className="af-zoom" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()} ref={dialog}>
        <button aria-label={labels.close} className="af-drawer__x af-zoom__x" onClick={() => dialog.current?.close()} type="button">
          <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
            <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <p className="af-sr">{labels.hint}</p>
        <div className="af-zoom__stage" onWheel={(e) => setScale((s) => Math.min(3, Math.max(1, s - e.deltaY * 0.002)))}>
          {isVideo ? null : (
            /* eslint-disable-next-line @next/next/no-img-element -- volle Auflösung für die Vergrößerung */
            <img alt={current.alt} onClick={() => setScale((s) => (s > 1 ? 1 : 2))} src={current.src} style={{ transform: `scale(${scale})` }} />
          )}
        </div>
      </dialog>
    </>
  );
}
