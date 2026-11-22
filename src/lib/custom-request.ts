import { METHOD_IDS } from "@/lib/collection";
import type { MethodId } from "@/lib/collection";

/** Schritt 1 der Maßanfertigung: das System. Extensions-Methoden zuerst. */
export const CUSTOM_SYSTEMS = [...METHOD_IDS, "topper", "peruecke", "pony", "haarsystem", "unsure"] as const;
export type CustomSystem = (typeof CUSTOM_SYSTEMS)[number];

export const CUSTOM_STRUCTURES = ["glatt", "wellig", "lockig", "unsure"] as const;
export type CustomStructure = (typeof CUSTOM_STRUCTURES)[number];

/** Das Formularfeld `method` kennt nur Extensions-Methoden; für alle anderen Systeme bleibt es leer. */
export function methodFor(system: CustomSystem | ""): MethodId | "" {
  return (METHOD_IDS as readonly string[]).includes(system) ? (system as MethodId) : "";
}

/**
 * Eine Zeile mit System und Struktur für das Feld „product“ der Anfrage (max. 200 Zeichen laut Schema).
 * Die Beschriftungen kommen aus den Nachrichten, damit Andréia die Zeile in ihrer Sprache liest (Deutsch).
 */
export function customSummary(parts: { system: string; structure: string; base: string }, labels: { system: string; structure: string }): string {
  return [parts.base, parts.system ? `${labels.system}: ${parts.system}` : "", parts.structure ? `${labels.structure}: ${parts.structure}` : ""]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 200);
}
