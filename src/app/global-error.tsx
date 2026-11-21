"use client";

/** Letzte Rückfallebene, falls selbst das Layout nicht rendert. Bewusst ohne Abhängigkeiten. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="de">
      <body style={{ background: "#100e0d", color: "#f4efe8", fontFamily: "system-ui, sans-serif", margin: 0, padding: "18vh 24px" }}>
        <main style={{ margin: "0 auto", maxWidth: 640 }}>
          <h1>Diese Seite hat nicht geladen.</h1>
          <p lang="en">This page did not load.</p>
          <button onClick={() => reset()} style={{ background: "#e0a526", border: 0, borderRadius: 999, color: "#100e0d", minHeight: 44, padding: "0 22px" }} type="button">
            Neu laden / Reload
          </button>
        </main>
      </body>
    </html>
  );
}
