/**
 * Überweisung per GiroCode (EPC069-12, „SEPA Credit Transfer“-QR, Version 002, UTF-8).
 * Jede gängige Banking-App liest den Code: Empfängerin, IBAN, Betrag und Verwendungszweck sind
 * damit vorausgefüllt. Kostenlos, ohne Drittanbieter, ohne Daten an Dritte.
 */

/** „DE22370605900002436798“ → „DE22 3706 0590 0002 4367 98“ */
export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

/** Prüfziffer nach ISO 13616 (mod 97 = 1). */
export function ibanValid(iban: string): boolean {
  const compact = iban.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(compact)) return false;
  const digits = (compact.slice(4) + compact.slice(0, 4)).replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let rest = 0;
  for (const digit of digits) rest = (rest * 10 + Number(digit)) % 97;
  return rest === 1;
}

/** Betrag im EPC-Format: „EUR390.00“ (0,01 bis 999 999 999,99). */
export function epcAmount(cents: number): string {
  return `EUR${(cents / 100).toFixed(2)}`;
}

/**
 * Inhalt des GiroCodes. Zeilen: Kennung, Version, Zeichensatz (1 = UTF-8), SCT, BIC (leer erlaubt),
 * Name (max. 70), IBAN, Betrag, Zweck (leer), strukturierte Referenz (leer), Verwendungszweck (max. 140).
 */
export function epcPayload({ name, iban, cents, reference }: { name: string; iban: string; cents: number; reference: string }): string {
  return ["BCD", "002", "1", "SCT", "", name.slice(0, 70), iban.replace(/\s+/g, "").toUpperCase(), epcAmount(cents), "", "", reference.slice(0, 140)].join("\n");
}
