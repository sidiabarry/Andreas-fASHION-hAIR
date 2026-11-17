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
  category,
}: {
  label: string;
  apply: string;
  options: { value: string; label: string }[];
  value: string;
  category: string | null;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form className="af-sort" method="get" ref={form}>
      {category ? <input name="kategorie" type="hidden" value={category} /> : null}
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
