"use client";

/** Letzte Rückfallebene, falls selbst das Layout nicht rendert. Bewusst ohne Abhängigkeiten. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="de">
      <body style={{ background: "#f7f3ed", color: "#2c241e", fontFamily: "system-ui, sans-serif", margin: 0, padding: "18vh 24px" }}>
        <main style={{ margin: "0 auto", maxWidth: 640 }}>
          <h1>Diese Seite hat nicht geladen.</h1>
          <p lang="en">This page did not load.</p>
          <button onClick={() => reset()} style={{ background: "#2c241e", border: 0, borderRadius: 999, color: "#f7f3ed", minHeight: 44, padding: "0 22px" }} type="button">
            Neu laden / Reload
          </button>
        </main>
      </body>
    </html>
  );
}
