"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/** Lädt das Goldfeld erst im Browser und getrennt vom Seiten-Bundle (kein Einfluss auf LCP). */
const AtelierField = dynamic(() => import("./AtelierField"), { ssr: false });

/**
 * Hängt das Goldfeld erst ein, wenn die Seite fertig geladen ist und der Browser Luft hat. So konkurriert es
 * weder mit der Erstdarstellung noch mit dem Hydrieren und dem Filmstart. Eingeblendet wird es sanft (home.css).
 */
export function FieldMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let handle = 0;
    // Safari kennt requestIdleCallback nicht
    const hasIdle = typeof window.requestIdleCallback === "function";
    const schedule = () => {
      if (cancelled) return;
      const go = () => {
        if (!cancelled) setReady(true);
      };
      handle = hasIdle ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 400);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return ready ? <AtelierField /> : null;
}
