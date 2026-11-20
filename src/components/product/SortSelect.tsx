"use client";

import { useRef } from "react";

/**
 * Sortierung als GET-Formular: funktioniert ohne JavaScript (Knopf „Anwenden“),
 * mit JavaScript wird bei Auswahl sofort angewendet.
 */
export function SortSelect({
  label,
  apply,
  options,
  value,
  hidden = {},
}: {
  label: string;
  apply: string;
  options: { value: string; label: string }[];
  value: string;
  /** Weitere Parameter der Seite (Kategorie, Filter), die beim Sortieren erhalten bleiben. */
  hidden?: Record<string, string>;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form className="af-sort" method="get" ref={form}>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} name={name} type="hidden" value={value} />
      ))}
      <label htmlFor="sortierung">{label}</label>
      <select defaultValue={value} id="sortierung" name="sortierung" onChange={() => form.current?.requestSubmit()}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <noscript>
        <button className="af-tab" type="submit">
          {apply}
        </button>
      </noscript>
    </form>
  );
}
