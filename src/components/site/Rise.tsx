"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/navigation";

/** Schiebt Inhalte beim Erscheinen sanft nach oben. Nur transform: Nichts wird je versteckt. */
export function Rise() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("af-js");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".af-rise:not(.is-in)"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );
    nodes.forEach((node) => {
      // Was schon sichtbar ist, nicht mehr bewegen (verhindert Sprünge beim Laden)
      if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add("is-in");
      else observer.observe(node);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
