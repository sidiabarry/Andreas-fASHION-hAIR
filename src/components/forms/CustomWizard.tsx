"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { ReactNode, RefObject } from "react";

import { Field } from "@/components/forms/Field";
import { Honeypot } from "@/components/forms/Honeypot";
import { StartedAt } from "@/components/forms/StartedAt";
import { CUSTOM_STRUCTURES, CUSTOM_SYSTEMS, customSummary, methodFor } from "@/lib/custom-request";
import type { CustomStructure, CustomSystem } from "@/lib/custom-request";

const STEPS = ["system", "length", "color", "structure", "amount", "contact"] as const;

/**
 * Maßanfertigung in sechs Schritten. Alle Schritte bleiben im Formular (nur ausgeblendet),
 * damit jede Eingabe beim Absenden mitgeht. Die Felder sind die der bestehenden Anfrage
 * (method, length, color, amount, product); System und Struktur stehen als eine Zeile in `product`.
 */
export function CustomWizard({
  action,
  alertRef,
  contact,
  errorText,
  initialProduct,
  locale,
  pending,
}: {
  action: (payload: FormData) => void;
  alertRef: RefObject<HTMLDivElement | null>;
  contact: ReactNode;
  errorText: string | null;
  initialProduct: string;
  locale: string;
  pending: boolean;
}) {
  const t = useTranslations("custom");
  const id = useId();
  // Nach einem Fehler (Pflichtfelder liegen im letzten Schritt) bleibt der Kontaktschritt offen.
  const [step, setStep] = useState(errorText ? STEPS.length - 1 : 0);
  const [system, setSystem] = useState<CustomSystem | "">("");
  const [structure, setStructure] = useState<CustomStructure | "">("");
  const last = step === STEPS.length - 1;
  const product = customSummary({ base: initialProduct, structure, system }, { structure: "Struktur", system: "System" });

  const go = (next: number) => {
    setStep(Math.min(STEPS.length - 1, Math.max(0, next)));
    document.getElementById(`${id}-title`)?.focus();
  };

  const choice = <T extends string>(name: string, ids: readonly T[], value: T | "", set: (v: T) => void, label: (v: T) => string) => (
    <div aria-labelledby={`${id}-title`} className="af-choices" role="radiogroup">
      {ids.map((option) => (
        <label className="af-choice" data-on={value === option} key={option}>
          <input checked={value === option} className="af-ui-check" name={name} onChange={() => set(option)} type="radio" value={option} />
          <span>{label(option)}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form
      action={action}
      className="af-form af-wizard"
      noValidate
      onKeyDown={(event) => {
        // Enter in einem Textfeld geht zum nächsten Schritt statt abzusenden
        if (event.key === "Enter" && !last && (event.target as HTMLElement).tagName === "INPUT" && (event.target as HTMLInputElement).type === "text") {
          event.preventDefault();
          go(step + 1);
        }
      }}
    >
      {errorText ? (
        <div className="af-msg" data-kind="error" ref={alertRef} role="alert" tabIndex={-1}>
          {errorText}
        </div>
      ) : null}
      <input name="locale" type="hidden" value={locale} />
      <input name="topic" type="hidden" value="massanfertigung" />
      <input name="method" type="hidden" value={methodFor(system)} />
      <input name="product" type="hidden" value={product} />
      <StartedAt />
      <Honeypot />

      <div className="af-wizard__head">
        <p className="af-mono" aria-live="polite">
          {t("stepOf", { step: step + 1, total: STEPS.length })}
        </p>
        <div aria-hidden="true" className="af-wizard__bar">
          <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <h2 className="af-h3" id={`${id}-title`} tabIndex={-1}>
          {t(`steps.${STEPS[step]}.title`)}
        </h2>
        <p className="af-note">{t(`steps.${STEPS[step]}.hint`)}</p>
      </div>

      <div hidden={step !== 0}>{choice("system", CUSTOM_SYSTEMS, system, setSystem, (v) => (v === "topper" || v === "peruecke" || v === "pony" || v === "haarsystem" || v === "unsure" ? t(`systems.${v}`) : t(`methods.${v}`)))}</div>
      <div hidden={step !== 1}>
        <Field label={t("steps.length.label")} name="length" optionalLabel={t("optional")}>
          {(p) => <input {...p} className="af-ui-field" maxLength={60} />}
        </Field>
      </div>
      <div hidden={step !== 2}>
        <Field label={t("steps.color.label")} name="color" optionalLabel={t("optional")}>
          {(p) => <input {...p} className="af-ui-field" maxLength={80} />}
        </Field>
      </div>
      <div hidden={step !== 3}>{choice("structure", CUSTOM_STRUCTURES, structure, setStructure, (v) => t(`structures.${v}`))}</div>
      <div hidden={step !== 4}>
        <Field label={t("steps.amount.label")} name="amount" optionalLabel={t("optional")}>
          {(p) => <input {...p} className="af-ui-field" maxLength={80} />}
        </Field>
      </div>
      <div className="af-form" hidden={!last}>
        {contact}
      </div>

      {!last ? (
        <div className="af-wizard__nav">
          {step > 0 ? (
            <button className="af-cta-line" onClick={() => go(step - 1)} type="button">
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          <button className="af-cta-gold af-glass af-glass--gold" onClick={() => go(step + 1)} type="button">
            {t("next")}
          </button>
        </div>
      ) : (
        <div className="af-wizard__nav">
          <button className="af-cta-line" onClick={() => go(step - 1)} type="button">
            {t("back")}
          </button>
          <span aria-busy={pending} className="af-sr">
            {pending ? t("sending") : ""}
          </span>
        </div>
      )}
    </form>
  );
}
