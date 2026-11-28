"use client";

import { useTranslations } from "next-intl";

import { useShopPrefs } from "@/components/site/ShopPreferences";
import { buildAndreaWhatsAppUrl } from "@/lib/whatsapp";
import type { WhatsAppContext } from "@/lib/whatsapp";

/** Modul 19: WhatsApp mit Kontext (Stück, Preis, Maße und, falls eingestellt, Körpergröße). */
export function AskWhatsApp({ phoneHref, ctx, short = false }: { phoneHref: string; ctx: WhatsAppContext; short?: boolean }) {
  const t = useTranslations("product");
  const c = useTranslations("common");
  const prefs = useShopPrefs();
  return (
    <a className="af-chip" href={buildAndreaWhatsAppUrl(phoneHref, { ...ctx, heightCm: prefs.heightCm })} rel="noopener noreferrer" target="_blank">
      <span>{t(short ? "askWhatsappShort" : "askWhatsapp")}</span>
      <span className="af-sr"> {c("newTab")}</span>
    </a>
  );
}
