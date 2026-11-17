"use client";

import dynamic from "next/dynamic";

/** Lädt das Goldfeld erst im Browser und getrennt vom Seiten-Bundle (kein Einfluss auf LCP). */
const AtelierField = dynamic(() => import("./AtelierField"), { ssr: false });

export function FieldMount() {
  return <AtelierField />;
}
