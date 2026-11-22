"use client";

import type { ReactNode } from "react";

import { useCatalogTools } from "./CatalogTools";

/** Raster der Karten. Mit aktivem Farbabgleich stehen die nächsten Farben zuerst (nur Reihenfolge, nichts wird ausgeblendet). */
export function CatalogGrid({ items, className }: { items: { slug: string; node: ReactNode }[]; className: string }) {
  const { match } = useCatalogTools();
  const rank = match ? [...items].sort((a, b) => (match[b.slug] ?? -1) - (match[a.slug] ?? -1)).map((item) => item.slug) : null;
  return (
    <div className={className}>
      {items.map((item) => (
        <div className="af-gridcell" key={item.slug} style={rank ? { order: rank.indexOf(item.slug) } : undefined}>
          {item.node}
        </div>
      ))}
    </div>
  );
}
