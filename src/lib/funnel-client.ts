"use client";

/**
 * Anonymer Funnel-Zähler (Browser-Seite). Sendet nur den Ereignisnamen per sendBeacon an
 * /api/ereignis – keine Kennungen, keine Cookies, kein Fingerprinting.
 */
export type FunnelEvent = "product_view" | "add_to_cart" | "checkout_start" | "order_submit" | "inquiry_submit";

export function track(event: FunnelEvent) {
  try {
    const body = new Blob([JSON.stringify({ e: event })], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/ereignis", body)) {
      void fetch("/api/ereignis", { body, keepalive: true, method: "POST" });
    }
  } catch {
    // Zählung ist unwichtig: Fehler ignorieren
  }
}
