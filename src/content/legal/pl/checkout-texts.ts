import { type Company, euro, deliveryDaysOf, shippingOf } from "../company-type";

/** Polskie tłumaczenie ../checkout-texts.ts (te same klucze i znaczniki). Wiążąca jest wyłącznie wersja niemiecka. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, delivery: string) {
  const eur = (n: number) => euro(n, "pl-PL");
  const vatNote =
    smallBusiness === true
      ? "VAT nie jest naliczany na podstawie § 19 niemieckiej ustawy o VAT (UStG). Wszystkie ceny są cenami końcowymi."
      : smallBusiness === false
        ? "Wszystkie ceny są cenami końcowymi zawierającymi VAT."
        : "[Brak danych: status VAT]";
  const shipNote =
    `Wysyłka na terenie Niemiec ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, bezpłatnie od ${eur(freeFromCents)}` : "") +
    (euCents !== null ? `; do UE ${eur(euCents)}` : "") +
    ". Koszty wysyłki są wliczone w kwotę łączną.";

  return {
    buyButton: "Zamówienie z obowiązkiem zapłaty",
    consents: {
      agb: "Zapoznałem(-am) się z {agb} i akceptuję ich stosowanie.",
      widerruf: "Informacje o prawie odstąpienia od umowy i wyjątkach (np. dla produktów na wymiar) zawiera {widerruf}.",
      datenschutz: "Sposób przetwarzania Państwa danych opisuje nasza {datenschutz}.",
    },
    optionalConsents: {
      carrierEmail: "Tak, można przekazać mój adres e-mail przewoźnikowi, aby informował mnie o doręczeniu. Mogę w każdej chwili wycofać tę zgodę.",
      newsletter: "Tak, chcę otrzymywać e-mailem newsletter {brand} z nowościami i ofertami. Mogę w każdej chwili zrezygnować. Więcej w {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Czas dostawy: produkty z magazynu na terenie Niemiec ${delivery} dni roboczych (przedpłata/PayPal: od otrzymania płatności); zagranica: podawany przed zawarciem umowy. Produkty na wymiar: zob. strona produktu.`,
      "Wiele produktów to egzemplarze unikatowe. Osobiście sprawdzamy dostępność; umowa zostaje zawarta dopiero z naszym potwierdzeniem zamówienia przesłanym e-mailem. Płacą Państwo dopiero potem.",
      "Produkty na wymiar są wyłączone z prawa odstąpienia od umowy.",
    ],
    confirmationNotice:
      "Dziękujemy, {name}! Otrzymaliśmy Państwa zamówienie {orderNo}. Wysyłając je, złożyli Państwo wiążącą ofertę zakupu. Teraz osobiście sprawdzamy dostępność produktu i odpowiemy e-mailem w ciągu trzech dni roboczych. Umowa sprzedaży zostaje zawarta, gdy przyjmiemy zamówienie tym potwierdzeniem, które zawiera także dane do płatności. Prosimy płacić dopiero potem. Właśnie wysłaliśmy e-mailem potwierdzenie otrzymania.",
    withdrawalButtonLabel: "Odstąp od umowy",
    withdrawalConfirmLabel: "Potwierdź odstąpienie",
    withdrawalFormIntro:
      "Prosimy podać imię i nazwisko, numer zamówienia (lub inne dane, np. datę zamówienia i produkty) oraz adres e-mail do potwierdzenia otrzymania. Można odstąpić od całego zamówienia lub od wybranych produktów. Prosimy sprawdzić dane i kliknąć „Potwierdź odstąpienie”.",
    warrantyLabelAlt: "Rękojmia ustawowa: co najmniej 2 lata – zharmonizowana informacja Unii Europejskiej",
    mail: {
      orderReceived: {
        subject: "Potwierdzenie otrzymania zamówienia {orderNo}",
        body: [
          "Dzień dobry {name},",
          "",
          "dziękujemy za zamówienie. Ten e-mail potwierdza jedynie, że je otrzymaliśmy. Nie stanowi jeszcze przyjęcia Państwa oferty.",
          "",
          "Zamówienie {orderNo}:",
          "{items}",
          "Razem: {total}",
          "Adres dostawy: {shippingAddress}",
          "",
          "Osobiście sprawdzamy dostępność produktu i odpowiemy w ciągu trzech dni roboczych. Umowa sprzedaży zostaje zawarta z naszym potwierdzeniem zamówienia, które zawiera także dane do płatności. Prosimy płacić dopiero potem.",
          "",
          "Z serdecznymi pozdrowieniami",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "Potwierdzenie zamówienia {orderNo}",
        body: [
          "Dzień dobry {name},",
          "",
          "dobra wiadomość: produkt jest dostępny. Niniejszym przyjmujemy zamówienie {orderNo} – umowa sprzedaży została zawarta.",
          "",
          "{items}",
          "Razem: {total}",
          "Adres dostawy: {shippingAddress}",
          "",
          "Płatność: {paymentInstructions}",
          "",
          "W załączniku przesyłamy nasze OWH, pouczenie o odstąpieniu od umowy wraz ze wzorem formularza oraz informację o ustawowej rękojmi. W okresie na odstąpienie mogą Państwo odstąpić od umowy także online przez „Odstąp od umowy” na naszej stronie: {link}",
          "",
          "Z serdecznymi pozdrowieniami",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Zamówienie {orderNo}: produkt niedostępny",
        body: [
          "Dzień dobry {name},",
          "",
          "niestety produkt z zamówienia {orderNo} nie jest już dostępny. Nie możemy więc przyjąć zamówienia; umowa nie została zawarta. Jeżeli płatność została już dokonana, niezwłocznie zwrócimy kwotę tą samą metodą płatności.",
          "",
          "Chętnie pokażemy podobne produkty lub wykonamy produkt na wymiar – wystarczy odpowiedzieć na ten e-mail.",
          "",
          "Z serdecznymi pozdrowieniami",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Potwierdzenie otrzymania odstąpienia od umowy",
        body: [
          "Dzień dobry {name},",
          "",
          "potwierdzamy otrzymanie oświadczenia o odstąpieniu od umowy w dniu {receivedDate} o godzinie {receivedTime}.",
          "",
          "Treść oświadczenia:",
          "{withdrawalContent}",
          "",
          "Ten e-mail potwierdza otrzymanie oświadczenia. Prosimy odesłać towar na adres: {brand}, {address}. Po otrzymaniu towaru lub dowodu jego odesłania zwrócimy płatność zgodnie z pouczeniem o odstąpieniu od umowy. Jeżeli do produktu ma zastosowanie ustawowy wyjątek od prawa odstąpienia, poinformujemy o tym osobno.",
          "",
          "Z serdecznymi pozdrowieniami",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Prosimy potwierdzić zapis do newslettera",
        body: [
          "Dzień dobry,",
          "",
          "ktoś – mamy nadzieję, że Państwo – zapisał ten adres e-mail do newslettera {brand}. Prosimy potwierdzić zapis, klikając ten link:",
          "{link}",
          "",
          "Jeżeli to nie Państwo, wystarczy zignorować tę wiadomość. Bez potwierdzenia nie otrzymają Państwo newslettera, a adres usuniemy po 30 dniach.",
          "",
          "Z newslettera można zrezygnować w każdej chwili przez link w każdym wydaniu lub e-mailem na adres {email}.",
          "",
          "Z serdecznymi pozdrowieniami",
          "{brand}",
        ].join("\n"),
      },
    },
    /** Hinweis für Salons/Unternehmer (B2B): Shop richtet sich an Verbraucher. */
    b2bNotice: "Zamawiają Państwo jako salon, zakład fryzjerski lub inna firma? Nasz sklep jest przeznaczony dla konsumentów. Prosimy o zapytanie – otrzymają Państwo indywidualną ofertę.",
    healthDataNotice:
      "Prosimy nie podawać tutaj informacji o zdrowiu (np. chorobach lub leczeniu). Nie są nam potrzebne do doradztwa ani wykonania.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, deliveryDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "2–5");
