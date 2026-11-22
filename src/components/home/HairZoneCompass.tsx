"use client";

import { useState } from "react";

import { Arrow } from "@/components/Arrow";
import type { CategoryId } from "@/data/catalog";
import { Link } from "@/i18n/navigation";

export type CompassNeed = { id: CategoryId; label: string; need: string; caption: string; count: number; slug: string | null };

/**
 * Modul 2: „Wo wünschen Sie sich mehr Haar?“. Links die Bedürfnisse, rechts eine ruhige Kopf-Silhouette,
 * auf der die gewählte Zone leuchtet. Keine medizinische Zeichnung, nur eine Orientierung.
 */
const ZONES: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  topper: { cx: 128, cy: 60, rx: 62, ry: 34 },
  peruecken: { cx: 120, cy: 96, rx: 88, ry: 80 },
  pony: { cx: 168, cy: 78, rx: 30, ry: 22 },
  maenner: { cx: 150, cy: 62, rx: 52, ry: 30 },
};

export function HairZoneCompass({ needs, label, cta, ctaOne, countLabel }: { needs: CompassNeed[]; label: string; cta: string; ctaOne: string; countLabel: string }) {
  const [active, setActive] = useState(needs[0]?.id ?? "topper");
  const current = needs.find((n) => n.id === active) ?? needs[0];
  if (!current) return null;
  const zone = ZONES[current.id] ?? ZONES.topper;
  const href = current.count === 1 && current.slug ? `/produkt/${current.slug}` : { pathname: "/kollektion" as const, query: { kategorie: current.id } };
  return (
    <div aria-label={label} className="af-compass h-in" role="group">
      <ul className="af-compass__list">
        {needs.map((n) => (
          <li key={n.id}>
            <button aria-pressed={n.id === active} onClick={() => setActive(n.id)} type="button">
              <span className="af-compass__need">{n.need}</span>
              <span className="af-compass__count">{countLabel.replace("{count}", String(n.count))}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="af-compass__stage">
        <svg aria-hidden="true" className="af-compass__head" viewBox="0 0 240 240">
          <defs>
            <radialGradient id="compass-glow">
              <stop offset="0%" stopColor="#e8ae23" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#e8ae23" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path transform="translate(240 0) scale(-1 1)" d="M70 200c-4-30-6-52-6-74 0-52 30-92 72-92 44 0 74 36 74 82 0 16-4 26-10 38l-4 22c-1 8-8 14-16 14H132c-8 0-14 8-14 16v8Z" fill="var(--af-surface)" stroke="var(--af-line)" strokeWidth="2" />
          <ellipse cx={zone.cx} cy={zone.cy} fill="url(#compass-glow)" rx={zone.rx} ry={zone.ry} style={{ transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        </svg>
        <div aria-live="polite" className="af-compass__info">
          <h3 className="af-h3">{current.label}</h3>
          <p className="af-text">{current.caption}</p>
          <Link className="h-link" href={href}>
            {current.count === 1 ? ctaOne : cta} <Arrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
