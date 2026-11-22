"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { useCatalogTools } from "./CatalogTools";

/** Bildfläche der Produktkarte: Studio/Original (Modul 4) und Farbnähe-Plakette (Modul 3). */
export function CardMedia({ slug, src, original, alt, priority, matchLabel, children }: { slug: string; src: string; original: string | null; alt: string; priority?: boolean; matchLabel: string; children?: ReactNode }) {
  const { mode, match } = useCatalogTools();
  const shown = mode === "original" && original ? original : src;
  const score = match?.[slug];
  return (
    <div className="af-card__media" data-tilt="">
      <Image alt={alt} height={800} key={shown} priority={priority} sizes="(max-width: 760px) 46vw, (max-width: 1080px) 31vw, 300px" src={shown} width={600} />
      {children}
      {score !== undefined ? <span className="af-card__match af-glass af-glass--badge">{matchLabel.replace("{pct}", String(score))}</span> : null}
    </div>
  );
}
