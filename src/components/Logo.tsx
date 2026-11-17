/**
 * Logo von Andrea's Fashion Hair. EINZIGE Stelle, an der das Markenzeichen eingebunden wird.
 * Der Phönix ist ein Vektor (public/assets/brand/phoenix.svg); Namenszug und Claim sind echter Text.
 *
 * Varianten:
 * - mark: nur der Phönix
 * - lockup: Phönix + Namenszug (+ optional Claim „HaarManufaktur“)
 * - wordmark: nur Namenszug (+ optional Claim)
 */
export const LOGO_SRC = "/assets/brand/phoenix.svg";

type Props = {
  variant?: "mark" | "lockup" | "wordmark";
  claim?: boolean;
  /** Kantenlänge des Phönix in px */
  size?: number;
  stacked?: boolean;
  /** Alternativtext, nur wenn der Phönix allein steht und Bedeutung trägt */
  label?: string;
  className?: string;
  priority?: boolean;
};

export function Logo({ variant = "lockup", claim = false, size = 40, stacked = false, label, className, priority }: Props) {
  const mark =
    variant === "wordmark" ? null : (
      // eslint-disable-next-line @next/next/no-img-element -- Vektor, wird nicht optimiert
      <img
        alt={variant === "mark" && label ? label : ""}
        className="af-logo__mark"
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        height={size}
        src={LOGO_SRC}
        width={size}
      />
    );
  if (variant === "mark") {
    return (
      <span className={["af-logo", className].filter(Boolean).join(" ")} style={{ "--logo-size": `${size}px` } as React.CSSProperties}>
        {mark}
      </span>
    );
  }
  return (
    <span
      className={["af-logo", stacked ? "af-logo--stack" : "", className].filter(Boolean).join(" ")}
      style={{ "--logo-size": `${size}px` } as React.CSSProperties}
    >
      {mark}
      <span className="af-logo__text">
        <span className="af-logo__name">Andrea&apos;s Fashion Hair</span>
        {claim ? <span className="af-logo__claim">HaarManufaktur</span> : null}
      </span>
    </span>
  );
}
