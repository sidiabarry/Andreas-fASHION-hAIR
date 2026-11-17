"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  return (
    <main className="af-page">
      <div className="af-wrap af-empty">
        <p className="af-mono">{t("kicker")}</p>
        <h1 className="af-h2">{t("title")}</h1>
        <p className="af-lead">{t("lead")}</p>
        <button className="af-cta-line" onClick={() => reset()} type="button">
          {t("retry")}
        </button>
      </div>
    </main>
  );
}
