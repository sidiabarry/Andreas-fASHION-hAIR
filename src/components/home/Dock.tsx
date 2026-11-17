"use client";

import { useEffect, useState } from "react";

import { setPaused, useUserPaused } from "@/components/fx/motion";

/**
 * Leise, immer erreichbare Leiste unten rechts (erst nach dem Hero): WhatsApp-Beratung und der
 * Bewegungs-Schalter. Kein Pop-up, nichts springt auf.
 */
export function Dock({ whatsapp, label, note, pause, play }: { whatsapp: string | null; label: string; note: string; pause: string; play: string }) {
  const [shown, setShown] = useState(false);
  const paused = useUserPaused();
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), { threshold: 0.15 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className="dock" data-shown={shown || undefined} inert={!shown}>
      {whatsapp ? (
        <a className="dock__wa" href={whatsapp} rel="noopener noreferrer" target="_blank">
          <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18">
            <path
              d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 1.6a7.4 7.4 0 1 1-3.8 13.8l-.3-.2-2.7.7.7-2.6-.2-.3A7.4 7.4 0 0 1 12 4.6Zm-3 3.6c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.8 2.6.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5Z"
              fill="currentColor"
            />
          </svg>
          <span>{label}</span>
          <span className="af-sr"> ({note})</span>
        </a>
      ) : null}
      <button aria-label={paused ? play : pause} className="dock__motion" onClick={() => setPaused(!paused)} title={paused ? play : pause} type="button">
        <svg aria-hidden="true" height="12" viewBox="0 0 16 16" width="12">
          {paused ? <path d="M5 3l8 5-8 5z" fill="currentColor" /> : <path d="M5 3h2v10H5zM9 3h2v10H9z" fill="currentColor" />}
        </svg>
      </button>
    </div>
  );
}
