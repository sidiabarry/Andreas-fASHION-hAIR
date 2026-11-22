"use client";

import { useLocale, useTranslations } from "next-intl";

import { SHIPPING_ZONES } from "@/config/shipping";
import type { Locale } from "@/i18n/locales";
import { formatPrice } from "@/lib/money";

/** Modul 21: Fortschritt bis zum kostenlosen Versand in Deutschland (Werte aus config/shipping.ts) und neutrale Verpackung. */
export function ShippingProgress({ subtotalCents }: { subtotalCents: number }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const freeFrom = SHIPPING_ZONES.de.freeFromCents ?? 0;
  const left = Math.max(0, freeFrom - subtotalCents);
  const pct = freeFrom ? Math.min(100, Math.round((subtotalCents / freeFrom) * 100)) : 100;
  return (
    <div className="af-ship">
      <div aria-hidden="true" className="af-ship__bar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <p className="af-note">{left > 0 ? t("drawer.freeLeft", { amount: formatPrice(left, locale) }) : t("drawer.freeReached")}</p>
      <p className="af-ship__box">
        <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
          <path d="M3 8l9-5 9 5v8l-9 5-9-5V8Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 8l9 5 9-5M12 13v8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>{t("shop.neutralBox")}</span>
      </p>
    </div>
  );
}
