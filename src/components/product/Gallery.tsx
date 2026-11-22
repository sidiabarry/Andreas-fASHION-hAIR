"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Shot = { src: string; alt: string; label: string };

/** Produktgalerie mit Vorschaubildern und Vergrößerung (Dialog; Zoom per Fingergeste bzw. Mausrad/Klick). */
export function Gallery({ shots, zoomLabel, closeLabel, hint, loupeLabel, loupeOffLabel }: { shots: Shot[]; zoomLabel: string; closeLabel: string; hint: string; loupeLabel?: string; loupeOffLabel?: string }) {
  const [index, setIndex] = useState(0);
  const [loupe, setLoupe] = useState(false);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [scale, setScale] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = shots[Math.min(index, shots.length - 1)];
  return (
    <>
      <div
        className="af-pdp__main"
        data-lens=""
        data-loupe={loupe || undefined}
        onPointerLeave={() => setLens(null)}
        onPointerMove={(e) => {
          if (!loupe) return;
          const box = e.currentTarget.getBoundingClientRect();
          setLens({ h: box.height, w: box.width, x: e.clientX - box.left, y: e.clientY - box.top });
        }}
      >
        <Image alt={current.alt} height={1600} key={current.src} priority={index === 0} sizes="(max-width: 900px) 100vw, 640px" src={current.src} width={1200} />
        {lens ? (
          <span aria-hidden="true" className="af-loupe" style={{ left: lens.x - 80, top: lens.y - 80 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Lupe: gleiches Bild, 2,8-fach, ohne Ladezeit */}
            <img alt="" src={current.src} style={{ height: lens.h * 2.8, left: 80 - lens.x * 2.8, top: 80 - lens.y * 2.8, width: lens.w * 2.8 }} />
          </span>
        ) : null}
        {loupeLabel ? (
          <button aria-label={loupe ? loupeOffLabel : loupeLabel} aria-pressed={loupe} className="af-zoombtn af-loupebtn" onClick={() => { setLoupe((on) => !on); setLens(null); }} type="button">
            <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
              <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="m14.5 14.5 6 6" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        ) : null}
        <button
          aria-label={zoomLabel}
          className="af-zoombtn"
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
      </div>
      {shots.length > 1 ? (
        <div className="af-pdp__thumbs">
          {shots.map((shot, i) => (
            <button aria-label={shot.label} aria-pressed={i === index} className="af-thumb" key={shot.src} onClick={() => setIndex(i)} type="button">
              <Image alt="" height={108} sizes="84px" src={shot.src} width={84} />
            </button>
          ))}
        </div>
      ) : null}
      <dialog aria-label={zoomLabel} className="af-zoom" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()} ref={dialog}>
        <button aria-label={closeLabel} className="af-drawer__x af-zoom__x" onClick={() => dialog.current?.close()} type="button">
          <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
            <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <p className="af-sr">{hint}</p>
        <div
          className="af-zoom__stage"
          onWheel={(e) => setScale((s) => Math.min(3, Math.max(1, s - e.deltaY * 0.002)))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- volle Auflösung für die Vergrößerung */}
          <img
            alt={current.alt}
            onClick={() => setScale((s) => (s > 1 ? 1 : 2))}
            src={current.src}
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </dialog>
    </>
  );
}
