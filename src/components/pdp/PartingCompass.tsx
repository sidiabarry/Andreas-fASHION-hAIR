"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** Modul 14: Der Scheitel gehört der Trägerin. Drei Positionen, Zeichnung von oben auf den Kopf. */
const POSITIONS = [
  { id: "left", x: 78 },
  { id: "center", x: 110 },
  { id: "right", x: 142 },
] as const;

export function PartingCompass({ extraImage, extraAlt }: { extraImage: string | null; extraAlt: string }) {
  const t = useTranslations("pdp");
  const [pos, setPos] = useState<(typeof POSITIONS)[number]["id"]>("center");
  const current = POSITIONS.find((p) => p.id === pos) ?? POSITIONS[1];
  return (
    <section aria-labelledby="parting-title" className="af-parting">
      <div>
        <h2 className="af-h3" id="parting-title">
          {t("partingTitle")}
        </h2>
        <p className="af-text">{t("partingText")}</p>
        <div aria-label={t("partingLabel")} className="af-parting__tabs" role="group">
          {POSITIONS.map((p) => (
            <button aria-pressed={pos === p.id} className="af-pill" key={p.id} onClick={() => setPos(p.id)} type="button">
              {t(`parting${p.id[0].toUpperCase()}${p.id.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>
      <svg aria-hidden="true" className="af-parting__head" viewBox="0 0 220 180">
        <ellipse cx="110" cy="92" fill="#c6a276" opacity="0.9" rx="74" ry="70" />
        <path d={`M${current.x} 26 Q${current.x + (current.x - 110) * 0.3} 92 ${current.x + (current.x - 110) * 0.2} 158`} fill="none" stroke="var(--af-bg)" strokeLinecap="round" strokeWidth="5" style={{ transition: "d 0.5s" }} />
      </svg>
      {extraImage ? (
        <figure className="af-parting__photo">
          <Image alt={extraAlt} height={400} sizes="200px" src={extraImage} width={300} />
          <figcaption className="af-note">{t("partingMore")}</figcaption>
        </figure>
      ) : null}
    </section>
  );
}
