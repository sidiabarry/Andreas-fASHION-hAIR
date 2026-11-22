"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

import { Arrow } from "@/components/Arrow";
import type { CategoryId } from "@/data/catalog";
import { Link } from "@/i18n/navigation";

export type CompassNeed = { id: CategoryId; label: string; need: string; caption: string; zone: string; count: number; slug: string | null };

/**
 * „Wo wünschen Sie sich mehr Haar?“: links die Wünsche (Tabs mit gleitender Auswahl), in der Mitte eine ruhige
 * Profil-Silhouette, auf der die Haarzone als zarte Champagner-Fläche erscheint und feine Strähnen nachgezeichnet
 * werden, rechts die passende Lösung. Keine medizinische Zeichnung, nur eine Orientierung.
 * Bewegung nur per CSS (Zeichnen über pathLength/stroke-dashoffset); bei „Bewegung reduzieren“ oder Pause steht alles still.
 */
type Zone = { fill: string; strands: string[]; anchor: { cx: number; cy: number } };

const ZONES: Partial<Record<CategoryId, Zone>> = {
  topper: {
    fill: "M 70 72 C 76 36, 108 24, 140 32 C 155 36, 164 48, 160 60 C 146 54, 126 53, 106 58 C 90 62, 78 72, 70 72 Z",
    strands: ["M 78 64 C 92 38, 122 30, 152 44", "M 86 68 C 102 46, 128 40, 156 54", "M 72 72 C 88 52, 114 48, 138 56"],
    anchor: { cx: 120, cy: 36 },
  },
  peruecken: {
    fill: "M 161 72 C 158 42, 136 24, 102 24 C 62 24, 34 58, 30 106 C 26 150, 36 190, 54 216 C 68 218, 78 206, 76 184 C 74 162, 76 142, 88 122 C 100 102, 120 84, 144 75 C 152 72, 158 74, 161 72 Z",
    strands: ["M 156 64 C 140 34, 96 28, 66 56 C 42 78, 36 134, 52 198", "M 146 72 C 122 48, 86 46, 66 80 C 50 108, 48 158, 64 206", "M 161 72 C 156 76, 146 82, 138 92"],
    anchor: { cx: 158, cy: 70 },
  },
  pony: {
    fill: "M 134 38 C 158 40, 176 58, 175 88 C 175 98, 169 106, 161 108 C 159 92, 154 78, 144 68 C 136 60, 130 48, 134 38 Z",
    strands: ["M 138 44 C 158 50, 170 68, 169 98", "M 134 52 C 150 60, 161 76, 162 104", "M 146 42 C 164 52, 174 68, 173 88"],
    anchor: { cx: 164, cy: 66 },
  },
  maenner: {
    fill: "M 76 64 C 82 40, 108 30, 140 34 C 156 37, 166 50, 165 66 C 156 64, 146 56, 132 55 C 114 54, 94 59, 76 64 Z",
    strands: ["M 84 58 C 106 42, 134 38, 162 56", "M 96 56 C 116 47, 138 46, 158 60", "M 76 64 C 104 54, 136 50, 165 66"],
    anchor: { cx: 152, cy: 52 },
  },
};

/** Profil, Blick nach rechts */
const HEAD =
  "M 68 226 C 70 202, 70 186, 62 172 C 44 146, 40 104, 52 72 C 64 44, 92 34, 118 36 C 146 38, 164 58, 166 88 C 166 96, 164 102, 166 108 L 176 126 C 178 130, 174 134, 168 134 L 164 135 C 167 140, 168 144, 164 147 C 167 151, 166 155, 161 158 C 163 167, 158 176, 146 178 C 132 180, 120 183, 118 198 L 118 226";

export function HairZoneCompass({ needs, label, cta, ctaOne, countLabel }: { needs: CompassNeed[]; label: string; cta: string; ctaOne: string; countLabel: string }) {
  const [active, setActive] = useState<CategoryId>(needs[0]?.id ?? "topper");
  const uid = useId().replace(/:/g, "");
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const index = Math.max(0, needs.findIndex((n) => n.id === active));
  const current = needs[index];

  // Gleitende Auswahl: Position und Höhe des aktiven Eintrags messen (Einträge können umbrechen)
  useLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const place = () => {
      const button = list.querySelectorAll<HTMLElement>("[role=tab]")[index];
      if (!button) return;
      pill.style.transform = `translate3d(0, ${button.offsetTop}px, 0)`;
      pill.style.height = `${button.offsetHeight}px`;
      pill.dataset.ready = "true";
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [index]);

  if (!current) return null;
  const zone = ZONES[current.id] ?? ZONES.topper!;
  const href = current.count === 1 && current.slug ? `/produkt/${current.slug}` : { pathname: "/kollektion" as const, query: { kategorie: current.id } };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = index;
    if (event.key in keys) next = (index + keys[event.key] + needs.length) % needs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = needs.length - 1;
    else return;
    event.preventDefault();
    setActive(needs[next].id);
    listRef.current?.querySelectorAll<HTMLElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div className="af-compass h-in">
      <div aria-label={label} aria-orientation="vertical" className="af-compass__list" onKeyDown={onKey} ref={listRef} role="tablist">
        <span aria-hidden="true" className="af-compass__pill" ref={pillRef} />
        {needs.map((n) => {
          const selected = n.id === active;
          return (
            <button
              aria-controls={`${uid}-panel`}
              aria-selected={selected}
              className="af-compass__tab"
              id={`${uid}-tab-${n.id}`}
              key={n.id}
              onClick={() => setActive(n.id)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(n.id);
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <span className="af-compass__need">{n.need}</span>
              <span className="af-compass__count">{countLabel.replace("{count}", String(n.count))}</span>
            </button>
          );
        })}
      </div>

      <div aria-hidden="true" className="af-compass__stage">
        <svg className="af-compass__head" viewBox="0 0 220 260">
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#dfb66e" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#c89b54" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b8873d" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id={`${uid}-stroke`} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#b58438" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#b58438" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d6a95c" stopOpacity="0.35" />
            </linearGradient>
            <filter height="150%" id={`${uid}-glow`} width="150%" x="-25%" y="-25%">
              <feGaussianBlur result="blur" stdDeviation="4.5" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="112" cy="118" fill="#efe3d0" fillOpacity="0.35" r="76" />
          <path d={HEAD} fill="#fbf7f0" fillOpacity="0.7" stroke="#3a3129" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.32" strokeWidth="1.35" />
          <path d="M 103 118 C 99 120, 99 131, 104 134" fill="none" stroke="#3a3129" strokeLinecap="round" strokeOpacity="0.22" strokeWidth="1.15" />
          <g key={current.id}>
            <path className="af-compass__zone" d={zone.fill} fill={`url(#${uid}-fill)`} filter={`url(#${uid}-glow)`} />
            {zone.strands.map((d, i) => (
              <path
                className="af-compass__strand"
                d={d}
                fill="none"
                key={d}
                pathLength={1}
                stroke={`url(#${uid}-stroke)`}
                strokeLinecap="round"
                strokeWidth={i === 0 ? 1.5 : 1.1}
                style={{ animationDelay: `${i * 70}ms` }}
              />
            ))}
            <circle className="af-compass__ring" cx={zone.anchor.cx} cy={zone.anchor.cy} fill="none" r="9" stroke="#c59b5f" strokeWidth="1" />
            <circle className="af-compass__dot" cx={zone.anchor.cx} cy={zone.anchor.cy} fill="#b58438" r="2.8" />
          </g>
        </svg>
        <span className="af-compass__zonelabel" key={`z-${current.id}`}>
          {current.zone}
        </span>
      </div>

      <div aria-labelledby={`${uid}-tab-${current.id}`} aria-live="polite" className="af-compass__info" id={`${uid}-panel`} key={`p-${current.id}`} role="tabpanel">
        <h3 className="af-h3">{current.label}</h3>
        <p className="af-text">{current.caption}</p>
        <Link className="h-link" href={href}>
          {current.count === 1 ? ctaOne : cta} <Arrow />
        </Link>
      </div>
    </div>
  );
}
