import type { Company } from "../company-type";

/**
 * Wzór formularza odstąpienia od umowy – wersja polska według załącznika I część B dyrektywy
 * 2011/83/UE. Wiążący jest wyłącznie formularz niemiecki (Anlage 2 EGBGB).
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Wzór formularza odstąpienia od umowy",
  lines: [
    "(Formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy.)",
    "– Adresat [tutaj przedsiębiorca powinien wpisać nazwę, adres oraz adres e-mail]:",
    "– Ja/My (*) niniejszym informuję/informujemy (*) o moim/naszym odstąpieniu od umowy sprzedaży następujących rzeczy (*)/umowy o świadczenie następującej usługi (*)",
    "– Data zamówienia (*)/odbioru (*)",
    "– Imię i nazwisko konsumenta(-ów)",
    "– Adres konsumenta(-ów)",
    "– Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej)",
    "– Data",
    "(*) Niepotrzebne skreślić.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Brak danych: imię i nazwisko właścicielki]"}, ${c.brandName}`;
  const to = `– Adresat: ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, e-mail: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
