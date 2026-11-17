import type { Company } from "./company-type";

/**
 * Muster-Widerrufsformular nach Anlage 2 zu Art. 246a § 1 Abs. 2 Satz 1 Nr. 1 EGBGB,
 * Wortlaut wie in der amtlichen Fassung (geprüft November 2026). Die Zeile „An …“ enthält
 * den amtlichen Platzhalter; mit `fillWiderrufsformular(company)` wird er durch Name,
 * Anschrift und E-Mail-Adresse der Unternehmerin ersetzt (so verlangt es das Muster).
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Muster-Widerrufsformular",
  lines: [
    "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
    "– An [hier ist der Name, die Anschrift und die E-Mail-Adresse des Unternehmers durch den Unternehmer einzufügen]:",
    "– Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)",
    "– Bestellt am (*)/erhalten am (*)",
    "– Name des/der Verbraucher(s)",
    "– Anschrift des/der Verbraucher(s)",
    "– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
    "– Datum",
    "(*) Unzutreffendes streichen.",
  ],
};

/** Formular mit eingesetzten Unternehmerdaten. `owner` fehlt → Markierung im Text. */
export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Angabe fehlt: Name der Inhaberin]"}, ${c.brandName}`;
  const to = `– An ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, E-Mail: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
