"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ReactNode } from "react";

import { BasisScale } from "./BasisScale";
import { HeightSimulator } from "./HeightSimulator";
import { SoftClipAudio } from "./SoftClipAudio";

/**
 * Module 9, 10, 11 als ein Akkordeon: es ist immer höchstens ein Helfer offen (eine Bühne, ein Akteur).
 * Jeder Helfer erscheint nur, wenn die Daten dafür da sind.
 */
export function MicroHelpers({ lengthCm, base, clips }: { lengthCm: number | null; base: { width: number; height: number } | null; clips: boolean }) {
  const t = useTranslations("pdp");
  const [open, setOpen] = useState<string | null>(null);
  type Item = { body: ReactNode; id: string; title: string };
  const items: Item[] = [];
  if (lengthCm) items.push({ body: <HeightSimulator lengthCm={lengthCm} />, id: "height", title: t("heightTitle") });
  if (base) items.push({ body: <BasisScale heightCm={base.height} widthCm={base.width} />, id: "base", title: t("baseTitle") });
  if (clips) items.push({ body: <SoftClipAudio />, id: "clip", title: t("clipTitle") });
  if (!items.length) return null;

  return (
    <section aria-label={t("helpersTitle")} className="af-pdp__helpers">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div className="af-pdp__helper" data-open={isOpen} key={item.id}>
            <h2>
              <button aria-controls={`helper-${item.id}`} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : item.id)} type="button">
                <span>{item.title}</span>
                <i aria-hidden="true" />
              </button>
            </h2>
            <div hidden={!isOpen} id={`helper-${item.id}`} role="region">
              {isOpen ? item.body : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
