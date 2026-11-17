"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";

/** Technisch notwendiges Cookie, nur nach ausdrücklicher Wahl im Umschalter. */
function rememberLocale(target: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${target}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

/**
 * Sprachumschalter. Erst bei ausdrücklicher Wahl wird das technisch notwendige Cookie NEXT_LOCALE
 * gesetzt (merkt sich die gewählte Sprache, 1 Jahr, nur diese Website). Ohne Wahl: kein Cookie.
 */
export function LocaleSwitcher({ id }: { id: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("locale");
  const pathname = usePathname() ?? `/${locale}`;
  const ref = useRef<HTMLDetailsElement>(null);
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (details.open && !details.contains(event.target as Node)) details.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);


  return (
    <details className="af-locale" ref={ref}>
      <summary aria-label={`${t("choose")}. ${t("current", { language: LOCALE_NAMES[locale] })}`}>
        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>{locale.toUpperCase()}</span>
      </summary>
      <ul aria-label={t("label")} id={id}>
        {LOCALES.map((code) => (
          <li key={code}>
            <a
              aria-current={code === locale ? "true" : undefined}
              href={`/${code}${rest}`}
              hrefLang={code}
              lang={code}
              onClick={() => rememberLocale(code)}
            >
              {LOCALE_NAMES[code]}
              <span>{code}</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
