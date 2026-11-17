"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "@/components/fx/motion";

/**
 * Choreografie beim Erscheinen: Elemente mit `.h-in` bekommen `is-in`, sobald sie ins Bild kommen
 * (einmal). Ohne JavaScript oder bei reduzierter Bewegung ist alles sofort sichtbar.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".h-in:not(.is-in)"));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    const vh = window.innerHeight;
    for (const node of nodes) {
      const r = node.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) node.classList.add("is-in");
      else io.observe(node);
    }
    root.classList.add("h-js");
    return () => io.disconnect();
  }, []);
  return null;
}
