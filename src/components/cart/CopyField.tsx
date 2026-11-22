"use client";

import { useEffect, useState } from "react";

/** Eine Zeile der Zahlungsangaben mit Kopierknopf (Zwischenablage; ohne JS bleibt der Text markierbar). */
export function CopyField({ label, value, display, copy, copied, srLabel }: { label: string; value: string; display?: string; copy: string; copied: string; srLabel: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setDone(false), 1800);
    return () => window.clearTimeout(timer);
  }, [done]);

  return (
    <div className="af-pay__field">
      <dt>{label}</dt>
      <dd>
        <span className="af-pay__value">{display ?? value}</span>
        <button
          aria-label={srLabel}
          className="af-pay__copy"
          data-done={done}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setDone(true);
            } catch {
              /* Zwischenablage gesperrt: Text bleibt markierbar */
            }
          }}
          type="button"
        >
          <span aria-hidden="true">{done ? "✓" : ""}</span>
          {done ? copied : copy}
        </button>
        <span aria-live="polite" className="af-sr">
          {done ? `${label}: ${copied}` : ""}
        </span>
      </dd>
    </div>
  );
}
