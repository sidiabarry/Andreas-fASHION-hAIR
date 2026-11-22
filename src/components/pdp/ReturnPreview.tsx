"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Link } from "@/i18n/navigation";

/** Modul 16: Heimanprobe und Widerruf in drei Schritten (Texte entsprechen der Widerrufsbelehrung). */
export function ReturnPreview({ madeToOrder }: { madeToOrder: boolean }) {
  const t = useTranslations("pdp");
  const c = useTranslations("common");
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="af-cta-line" onClick={() => dialog.current?.showModal()} type="button">
        {t("returnOpen")}
      </button>
      <dialog aria-labelledby="return-title" className="af-modal" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()} ref={dialog}>
        <div className="af-modal__in">
          <button aria-label={c("close")} className="af-drawer__x af-modal__x" onClick={() => dialog.current?.close()} type="button">
            <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
              <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <h2 className="af-h3" id="return-title">
            {t("returnTitle")}
          </h2>
          <ol className="af-modal__steps">
            {[1, 2, 3].map((n) => (
              <li key={n}>{t(`returnStep${n}`)}</li>
            ))}
          </ol>
          {madeToOrder ? <p className="af-note">{t("returnCustom")}</p> : null}
          <Link className="af-cta-line" href="/widerruf" onClick={() => dialog.current?.close()}>
            {t("returnLink")}
          </Link>
        </div>
      </dialog>
    </>
  );
}
