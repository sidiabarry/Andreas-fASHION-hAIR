"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** Modul 22: Mit einer Vertrauensperson teilen (Teilen-Dialog des Geräts, sonst Link kopieren). */
export function ShareButton({ name, url }: { name: string; url: string }) {
  const t = useTranslations("pdp");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <>
      <button
        className="af-chip af-chip--plain"
        onClick={async () => {
          const text = t("shareText", { name });
          try {
            if (navigator.share) {
              await navigator.share({ text, title: name, url });
              return;
            }
            await navigator.clipboard.writeText(`${text}\n${url}`);
            setCopied(true);
          } catch {
            /* Teilen abgebrochen */
          }
        }}
        type="button"
      >
        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span>{t("share")}</span>
      </button>
      <span aria-live="polite" className="af-sr">
        {copied ? t("shareCopied") : ""}
      </span>
      {copied ? <span aria-hidden="true" className="af-note">{t("shareCopied")}</span> : null}
    </>
  );
}
