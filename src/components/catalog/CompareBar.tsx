"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { useLocalList, WISHLIST_KEY } from "@/components/cart/useLocalList";
import { useShopPrefs } from "@/components/site/ShopPreferences";
import { Link } from "@/i18n/navigation";


export type CompareItem = { slug: string; name: string; subtitle: string; image: string; price: string; lengthCm: number | null; base: { width: number; height: number } | null };

/** Modul 7: „Mein Spiegel“. Ab zwei Merklisten-Stücken: ruhige Leiste unten, Vergleich zeilengleich im Dialog. */
export function CompareBar({ items }: { items: CompareItem[] }) {
  const t = useTranslations("cat");
  const c = useTranslations("common");
  const list = useLocalList(WISHLIST_KEY);
  const prefs = useShopPrefs();
  const dialog = useRef<HTMLDialogElement>(null);
  const saved = list.items.map((slug) => items.find((i) => i.slug === slug)).filter((i): i is CompareItem => Boolean(i));
  const [pick, setPick] = useState<[number, number]>([0, 1]);
  if (saved.length < 2) return null;
  const a = saved[Math.min(pick[0], saved.length - 1)];
  const b = saved[Math.min(pick[1], saved.length - 1)];
  const rows: { key: string; label: string; value: (i: CompareItem) => string }[] = [
    { key: "len", label: t("rowLength"), value: (i) => (i.lengthCm ? prefs.length(i.lengthCm) : "–") },
    { key: "base", label: t("rowBase"), value: (i) => (i.base ? prefs.dimensions(i.base.width, i.base.height) : "–") },
    { key: "price", label: t("rowPrice"), value: (i) => i.price },
  ];
  const select = (slot: 0 | 1) => (
    <select aria-label={slot === 0 ? t("compareA") : t("compareB")} className="af-ui-field af-ui-select" onChange={(e) => setPick(slot === 0 ? [Number(e.target.value), pick[1]] : [pick[0], Number(e.target.value)])} value={pick[slot]}>
      {saved.map((item, index) => (
        <option key={item.slug} value={index}>
          {item.name}, {item.subtitle}
        </option>
      ))}
    </select>
  );
  return (
    <>
      <div className="af-comparebar">
        <button className="af-cta-gold af-glass af-glass--gold" onClick={() => dialog.current?.showModal()} type="button">
          {t("compareBar", { count: saved.length })}
        </button>
      </div>
      <dialog aria-labelledby="compare-title" className="af-modal af-modal--wide" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()} ref={dialog}>
        <div className="af-modal__in">
          <button aria-label={c("close")} className="af-drawer__x af-modal__x" onClick={() => dialog.current?.close()} type="button">
            <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
              <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <h2 className="af-h3" id="compare-title">
            {t("compareTitle")}
          </h2>
          <div className="af-compare2">
            {[a, b].map((item, slot) => (
              <div className="af-compare2__col" key={slot}>
                {select(slot as 0 | 1)}
                <Image alt={`${item.name}, ${item.subtitle}`} height={400} sizes="(max-width: 700px) 44vw, 240px" src={item.image} width={300} />
                <dl>
                  {rows.map((row) => (
                    <div key={row.key}>
                      <dt>{row.label}</dt>
                      <dd>{row.value(item)}</dd>
                    </div>
                  ))}
                </dl>
                <Link className="af-cta-line" href={`/produkt/${item.slug}`}>
                  {t("compareView")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
