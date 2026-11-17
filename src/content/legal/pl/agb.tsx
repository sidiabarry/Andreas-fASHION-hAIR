import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Brak danych: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "pl-PL");
  const carrier = c.carrier ?? <Missing field="carrier" label="przewoźnik" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Uwaga:</strong> Wiążąca prawnie jest wyłącznie wersja niemiecka; niniejsze
        tłumaczenie służy jedynie ułatwieniu zrozumienia.
      </p>
      <section>
        <h2 id="geltung">§ 1 Zakres stosowania i sprzedawca</h2>
        <ol>
          <li>Niniejsze ogólne warunki handlowe (OWH) dotyczą wszystkich zamówień składanych przez konsumentów (§ 13 BGB) w naszym sklepie internetowym.</li>
          <li>
            Stroną umowy jest{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="imię i nazwisko właścicielki" />} (nazwa handlowa „{c.brandName}”),{" "}
            {addressLine(c)}, telefon {c.phone}, e-mail {c.email}.
          </li>
          <li>Językiem umowy jest język niemiecki. Tłumaczenia służą wyłącznie zrozumieniu.</li>
        <li>Niniejsze OWH dotyczą wyłącznie konsumentów. Salony, fryzjerzy i inni przedsiębiorcy otrzymują na zapytanie indywidualną ofertę na odrębnych warunkach.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Zawarcie umowy</h2>
        <ol>
          <li>Prezentacja produktów w sklepie nie stanowi wiążącej oferty, lecz zaproszenie do składania zamówień. Wiele produktów to egzemplarze unikatowe.</li>
          <li>Dodają Państwo produkty do koszyka, w kolejnym kroku podają dane kontaktowe i adres dostawy, a następnie widzą podsumowanie ze wszystkimi danymi i ceną łączną. Błędy we wprowadzonych danych można poprawić w każdej chwili przed wysłaniem: przyciskiem „wstecz” przeglądarki, przez „Zmień” w koszyku lub bezpośrednio w polach. Kliknięcie przycisku „Zamówienie z obowiązkiem zapłaty” stanowi złożenie wiążącej oferty zakupu produktów z koszyka.</li>
          <li>Bezpośrednio potem otrzymują Państwo automatyczny e-mail potwierdzający otrzymanie zamówienia. To potwierdzenie otrzymania nie stanowi jeszcze przyjęcia oferty.</li>
          <li>Osobiście sprawdzamy dostępność produktu. Umowa zostaje zawarta, gdy wyraźnie przyjmiemy zamówienie e-mailem (potwierdzenie zamówienia) lub wyślemy towar – w zależności od tego, co nastąpi wcześniej. Decyzję podejmujemy w ciągu trzech dni roboczych od otrzymania zamówienia. Jeżeli w tym terminie nie otrzymają Państwo przyjęcia, przestają być Państwo związani zamówieniem; dokonane płatności niezwłocznie zwrócimy.</li>
          <li>Jeżeli unikatowy egzemplarz nie jest już dostępny, niezwłocznie Państwa o tym poinformujemy. Umowa dotycząca tego egzemplarza nie zostaje wtedy zawarta.</li>
          <li>Wraz z potwierdzeniem zamówienia otrzymują Państwo e-mailem treść umowy, niniejsze OWH, pouczenie o prawie odstąpienia od umowy i wzór formularza odstąpienia.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Przechowywanie treści umowy</h2>
        <p>Przechowujemy treść umowy (dane zamówienia i OWH obowiązujące w chwili zamówienia) i przesyłamy ją e-mailem. Aktualne OWH można w każdej chwili wyświetlić, zapisać i wydrukować na tej stronie. Nie oferujemy konta klienta z historią zamówień.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Ceny i koszty wysyłki</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Wszystkie ceny są cenami końcowymi. Jako mały przedsiębiorca w rozumieniu § 19 niemieckiej ustawy o VAT (UStG) nie naliczamy podatku VAT i dlatego go nie wykazujemy.</>
            ) : c.smallBusiness === false ? (
              <>Wszystkie ceny są cenami końcowymi zawierającymi podatek VAT.</>
            ) : (
              <Missing field="smallBusiness" label="status VAT (mały przedsiębiorca tak/nie)" />
            )}
          </li>
          <li>
            Do cen doliczane są koszty wysyłki: na terenie Niemiec {eur(ship.domesticCents)} za zamówienie
            {ship.freeFromCents !== null ? <>, bezpłatnie od wartości towaru {eur(ship.freeFromCents)}</> : null}
            {ship.euCents !== null ? <>; do innych państw Unii Europejskiej {eur(ship.euCents)} za zamówienie</> : null}
            . Koszty wysyłki do innych krajów podajemy na życzenie przed zamówieniem. Koszty wysyłki
            widzą Państwo w podsumowaniu przed wysłaniem zamówienia.
          </li>
          <li>Przy dostawach poza Unię Europejską mogą powstać cła, podatki i opłaty, które uiszczają Państwo na rzecz właściwych organów.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Płatność</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="metoda płatności do ustalenia" />
          </p>
        ) : (
          <>
            <p>Można płacić następującymi metodami. Dane do płatności przesyłamy wraz z potwierdzeniem zamówienia.</p>
            <ul>
              {c.payments.prepayment ? (
                <li><strong>Przedpłata przelewem:</strong> prosimy przelać pełną kwotę w ciągu 7 dni od otrzymania potwierdzenia zamówienia. Wysyłamy po zaksięgowaniu płatności. Jeżeli mimo wezwania płatność nie wpłynie, możemy odstąpić od umowy.</li>
              ) : null}
              {c.payments.paypal ? (
                <li><strong>PayPal:</strong> po potwierdzeniu zamówienia otrzymują Państwo żądanie zapłaty PayPal. Prosimy zapłacić w ciągu 7 dni. Dodatkowo obowiązują warunki PayPal. Wysyłka po otrzymaniu płatności.</li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>Płatność w ratach przez PayPal:</strong> jeżeli PayPal zaoferuje Państwu tę opcję, mogą Państwo zapłacić w ratach po ocenie zdolności kredytowej przez PayPal. Umowę kredytu zawierają Państwo bezpośrednio z PayPal jako kredytodawcą; obowiązują jego warunki i informacje przedumowne. Sami nie udzielamy kredytu. Umowa sprzedaży z nami pozostaje nienaruszona.</li> : null}
              {c.payments.bankTransfer ? (
                <li><strong>Faktura (przelew po otrzymaniu towaru):</strong> kwotę należy przelać bez potrąceń w ciągu 14 dni od otrzymania towaru. W pojedynczych przypadkach, zwłaszcza przy wysokich kwotach lub dostawach za granicę, możemy odmówić tej metody i zaproponować inną dostępną metodę.</li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Dostawa</h2>
        <ol>
          <li>
            Dostarczamy na terenie Niemiec
            {others.length > 0 ? <> oraz do następujących krajów: {countryNames(others, "pl")}</> : null}. Dostawy
            do innych krajów są możliwe po wcześniejszym uzgodnieniu. Wysyłkę realizuje {carrier}.
          </li>
          <li>Czas dostawy produktów z magazynu na terenie Niemiec: {deliveryDaysOf(c)} dni. Przy przedpłacie lub PayPal termin biegnie od dnia następującego po otrzymaniu płatności, w pozostałych przypadkach od dnia następującego po zawarciu umowy. Czas dostawy za granicę podajemy przed zawarciem umowy.</li>
          <li>Produkty na wymiar wykonujemy w ciągu ok. {madeToOrderDaysOf(c)} dni od otrzymania wszystkich niezbędnych danych oraz – przy przedpłacie lub PayPal – płatności. Informujemy o przewidywanej dacie wysyłki.</li>
          <li>Jeżeli towar dotrze z widocznymi uszkodzeniami transportowymi, prosimy zgłosić to doręczycielowi i krótko nas poinformować. Państwa ustawowe prawa pozostają nienaruszone; zgłoszenie pomaga nam dochodzić roszczeń wobec przewoźnika.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Zastrzeżenie własności</h2>
        <p>Towar pozostaje naszą własnością do chwili pełnej zapłaty.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Produkty na wymiar i według Państwa specyfikacji</h2>
        <ol>
          <li>Produkty oznaczone jako wykonywane na wymiar wytwarzamy według Państwa danych, np. obwodu głowy, koloru, gęstości, kierunku włosów i bazy. Prosimy dokładnie sprawdzić dane; omawiamy je z Państwem przed rozpoczęciem pracy.</li>
          <li>Przy produktach na wymiar prawo odstąpienia od umowy nie przysługuje (§ 312g ust. 2 pkt 1 BGB). Szczegóły zawiera pouczenie o odstąpieniu. Państwa prawa z tytułu wad pozostają nienaruszone.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Prawo odstąpienia od umowy</h2>
        <p>Jako konsumentowi przysługuje Państwu ustawowe prawo odstąpienia od umowy. Warunki, terminy i procedurę, wyjątki oraz funkcję online „Odstąp od umowy” opisuje nasze pouczenie o odstąpieniu od umowy.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Rękojmia (odpowiedzialność za wady)</h2>
        <ol>
          <li>Obowiązują ustawowe uprawnienia z tytułu wad (§§ 434 i nast. BGB). Termin dochodzenia roszczeń z tytułu wad wynosi dwa lata od wydania towaru.</li>
          <li>W razie wady prosimy o kontakt: {c.email}, telefon {c.phone}, lub pocztą: {addressLine(c)}.</li>
          <li>Dodatkowej gwarancji handlowej udzielamy tylko wtedy, gdy wyraźnie wskażemy ją przy produkcie.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Odpowiedzialność</h2>
        <ol>
          <li>Odpowiadamy bez ograniczeń za winę umyślną i rażące niedbalstwo, za szkody na życiu, ciele lub zdrowiu, na podstawie niemieckiej ustawy o odpowiedzialności za produkt oraz w zakresie udzielonej gwarancji.</li>
          <li>W przypadku naruszenia z lekkiego niedbalstwa obowiązku, którego wykonanie jest niezbędne do prawidłowej realizacji umowy i na którego przestrzeganie mogą Państwo zwykle liczyć (istotny obowiązek umowny), nasza odpowiedzialność jest ograniczona do przewidywalnej szkody typowej dla umowy.</li>
          <li>W pozostałym zakresie odpowiedzialność za lekkie niedbalstwo jest wyłączona.</li>
          <li>Państwa uprawnienia z tytułu wad zgodnie z § 10 pozostają nienaruszone.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Produkty do pielęgnacji, kleje i rozpuszczalniki</h2>
        <p>Przed użyciem klejów, taśm i rozpuszczalników prosimy przeczytać i stosować instrukcje oraz ostrzeżenia producenta na opakowaniu i na stronie produktu. Zalecamy najpierw przetestować nowy produkt na małym fragmencie skóry. Produkty należy przechowywać w miejscu niedostępnym dla dzieci. Dla niektórych produktów mogą obowiązywać ograniczenia wysyłki; informujemy o tym na stronie produktu.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Pozasądowe rozwiązywanie sporów konsumenckich</h2>
        {c.disputeResolution === "willing" ? (
          <p>Jesteśmy gotowi uczestniczyć w postępowaniach przed następującym podmiotem: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Nie jesteśmy gotowi ani zobowiązani do udziału w postępowaniach przed podmiotem ds. pozasądowego rozwiązywania sporów konsumenckich.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decyzja w sprawie pozasądowego rozwiązywania sporów (§ 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Prawo właściwe</h2>
        <p>Zastosowanie ma prawo Republiki Federalnej Niemiec z wyłączeniem Konwencji Narodów Zjednoczonych o umowach międzynarodowej sprzedaży towarów. Jeżeli Państwa miejsce zwykłego pobytu znajduje się w innym państwie, zachowują Państwo ochronę bezwzględnie obowiązujących przepisów o ochronie konsumentów tego państwa (art. 6 ust. 2 rozporządzenia Rzym I).</p>
        <p>
          Ostatnia aktualizacja: {c.effectiveDate ?? <Missing field="effectiveDate" label="data wejścia w życie OWH" />}
        </p>
      </section>
    </>
  );
}
