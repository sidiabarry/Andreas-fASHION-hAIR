import type { ReactNode } from "react";

export type FieldControlProps = {
  id: string;
  name: string;
  required?: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type Props = {
  name: string;
  label: ReactNode;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  hint?: ReactNode;
  error?: string | null;
  idPrefix?: string;
  children: (props: FieldControlProps) => ReactNode;
};

/** Beschriftetes Formularfeld mit Hinweis und Fehlermeldung (verknüpft über aria-describedby). */
export function Field({ name, label, required, requiredLabel, optionalLabel, hint, error, idPrefix = "f", children }: Props) {
  const id = `${idPrefix}-${name}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="af-field">
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="af-req">
            {" "}
            <span aria-hidden="true">*</span>
            {requiredLabel ? <span className="af-sr"> ({requiredLabel})</span> : null}
          </span>
        ) : optionalLabel ? (
          <span> ({optionalLabel})</span>
        ) : null}
      </label>
      {children({ "aria-describedby": describedBy, "aria-invalid": error ? true : undefined, id, name, required })}
      {hint ? (
        <p className="af-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="af-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
