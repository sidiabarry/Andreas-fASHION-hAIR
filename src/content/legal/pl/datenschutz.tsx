import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Brak danych: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="przewoźnik" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Uwaga:</strong> Wiążąca prawnie jest wyłącznie wersja niemiecka; niniejsze
        tłumaczenie służy jedynie ułatwieniu zrozumienia.
      </p>
      <section>
        <h2 id="ueberblick">1. W skrócie</h2>
        <ul>
          <li>Ta strona nie używa plików cookie, narzędzi analitycznych ani trackerów reklamowych.</li>
          <li>Czcionki i filmy znajdują się na naszym własnym serwerze. Odwiedzenie strony nie powoduje przekazania danych do Google, YouTube, Meta ani podobnych dostawców.</li>
          <li>Przetwarzamy Państwa dane wyłącznie w celu realizacji zamówienia lub zapytania, wypełnienia obowiązków prawnych oraz – wyłącznie za Państwa zgodą – wysyłki newslettera.</li>
          <li>Prosimy nie przekazywać nam danych o zdrowiu (zob. pkt 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Administrator</h2>
        <p>Administratorem danych w rozumieniu ogólnego rozporządzenia o ochronie danych (RODO) jest:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="imię i nazwisko właścicielki" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Telefon: {c.phone}
          <br />
          E-mail: {c.email}
        </p>
        <p>Nie mamy prawnego obowiązku wyznaczenia inspektora ochrony danych. We wszystkich sprawach dotyczących danych prosimy o kontakt pod powyższymi danymi.</p>
      </section>

      <section>
        <h2 id="hosting">3. Hosting i pliki dziennika serwera</h2>
        <p>Naszą stronę hostuje {c.hostingProvider.name}, {c.hostingProvider.address}. Przy każdej wizycie serwer przetwarza technicznie niezbędne dane, które Państwa przeglądarka przesyła automatycznie: adres IP, datę i godzinę, wywołaną stronę, ilość przesłanych danych, kod statusu, adres strony odsyłającej oraz informacje o przeglądarce i systemie operacyjnym.</p>
        <p>Dane te są potrzebne do wyświetlenia strony, zapewnienia jej bezpieczeństwa i odpierania ataków. Podstawą prawną jest art. 6 ust. 1 lit. f RODO; naszym prawnie uzasadnionym interesem jest bezpieczna i działająca strona. Nie analizujemy dzienników do celów statystycznych ani marketingowych i nie łączymy ich z innymi danymi. Dostawca przechowuje dzienniki jedynie przez krótki, technicznie niezbędny okres, a następnie automatycznie je usuwa.</p>
        <p>Z dostawcą zawarliśmy umowę powierzenia przetwarzania zgodnie z art. 28 RODO. W sprawie przekazywania danych do USA zob. pkt 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Zapis w przeglądarce (bez cookie, bez śledzenia)</h2>
        <p>Aby zachować koszyk podczas przeglądania, zapisujemy wybrane produkty w pamięci lokalnej przeglądarki (localStorage). Informacje te pozostają na Państwa urządzeniu i są przesyłane do nas dopiero po złożeniu zamówienia. Mogą je Państwo w każdej chwili usunąć, opróżniając koszyk lub usuwając dane strony w przeglądarce.</p>
        <p>Zapis ten jest absolutnie niezbędny do udostępnienia koszyka, o który Państwo wyraźnie prosili. Zgoda nie jest zatem wymagana na podstawie § 25 ust. 2 pkt 2 niemieckiej ustawy TDDDG. Jeżeli przetwarzane są dane osobowe, podstawą prawną jest art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy).</p>
      </section>

      <section>
        <h2 id="inhalte">5. Czcionki, obrazy i filmy</h2>
        <p>Wszystkie czcionki, zdjęcia i filmy udostępniamy z własnego hostingu. Nie ładujemy treści podmiotów trzecich (np. Google Fonts, YouTube ani Vimeo).</p>
      </section>

      <section>
        <h2 id="anfragen">6. Kontakt, doradztwo i zapytania</h2>
        <p>Gdy kontaktują się Państwo z nami przez formularz, e-mail lub telefon – np. w sprawie doradztwa, wykonania na wymiar lub zapytania salonu – przetwarzamy przekazane dane (zwykle imię i nazwisko, adres e-mail, ewentualnie numer telefonu i treść wiadomości).</p>
        <p>Celem jest obsługa zapytania. Podstawą prawną jest art. 6 ust. 1 lit. b RODO, jeżeli zapytanie dotyczy umowy, a w pozostałych przypadkach lit. f (nasz prawnie uzasadniony interes w udzieleniu odpowiedzi). Usuwamy zapytania po ich załatwieniu, jeżeli nie doszło do zawarcia umowy, najpóźniej 12 miesięcy po ostatnim kontakcie. W razie zawarcia umowy obowiązują terminy z pkt 15.</p>
        <p>Dane z formularzy zapisujemy w naszej bazie danych, a do powiadomień używamy usługi wysyłki e-mail (zob. pkt 12).</p>
        {gmail ? (
          <p>Naszą skrzynkę pocztową udostępnia {GOOGLE_IRELAND} (Gmail). E-maile od Państwa i nasze odpowiedzi są więc przechowywane na serwerach Google; dane mogą być przekazywane do USA (zob. pkt 13).</p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Kontakt przez WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>Mogą Państwo dobrowolnie pisać do nas także przez WhatsApp. Dostawcą jest {WHATSAPP_IRELAND}. WhatsApp należy do grupy Meta; dane mogą być przekazywane do USA. WhatsApp przetwarza na własną odpowiedzialność numer telefonu, profil, metadane komunikacji (np. godzinę) oraz – zależnie od ustawień – książkę adresową. Szczegóły zawiera polityka prywatności WhatsApp.</p>
            <p>Wiadomości wykorzystujemy wyłącznie do odpowiedzi na zapytanie (art. 6 ust. 1 lit. b lub f RODO) i usuwamy czaty po załatwieniu sprawy, najpóźniej po 12 miesiącach. Zawsze mogą Państwo skontaktować się z nami e-mailem lub telefonicznie. Prosimy nie przesyłać przez WhatsApp danych o zdrowiu.</p>
          </>
        ) : (
          <p>Obecnie nie oferujemy kontaktu przez komunikatory.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Prosimy nie podawać danych o zdrowiu</h2>
        <p>Wiele naszych klientek i klientów nosi uzupełnienia włosów z powodów zdrowotnych. Nie musimy znać tych powodów, aby doradzić, zrealizować zamówienie lub wykonać produkt na wymiar. Nasze formularze nie pytają więc o dane o zdrowiu i prosimy nie przekazywać informacji o chorobach, leczeniu ani diagnozach. Do wykonania na wymiar wystarczą obwód głowy, kolor, długość włosów i wybrana fryzura.</p>
        <p>Jeżeli mimo to przekażą nam Państwo dane o zdrowiu, są to szczególne kategorie danych w rozumieniu art. 9 RODO. Nie wykorzystujemy ich i usuwamy je, gdy tylko je zauważymy, chyba że wyjątkowo są nam potrzebne do odpowiedzi na zapytanie. Wtedy najpierw poprosimy o Państwa wyraźną zgodę (art. 9 ust. 2 lit. a RODO), którą można w każdej chwili wycofać.</p>
      </section>

      <section>
        <h2 id="bestellung">9. Zamówienie i wykonanie umowy</h2>
        <p>Na potrzeby zamówienia przetwarzamy imię i nazwisko, adres dostawy i rozliczeniowy, adres e-mail, ewentualnie numer telefonu, zamówione produkty, ceny, informacje o płatności i wysyłce oraz Państwa wiadomość. Pola obowiązkowe są oznaczone; bez nich nie możemy zawrzeć ani wykonać umowy.</p>
        <p>Podstawami prawnymi są art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy i jej wykonanie) oraz – w zakresie przechowywania faktur i dowodów księgowych – lit. c w związku z obowiązkami podatkowymi i handlowymi (zob. pkt 15).</p>
        <p>W celu doręczenia przekazujemy imię i nazwisko oraz adres dostawy przewoźnikowi {carrier}. Adres e-mail lub numer telefonu przekazujemy przewoźnikowi tylko wtedy, gdy wyraźnie wyrazili Państwo na to zgodę przy zamówieniu, aby mógł informować o doręczeniu (art. 6 ust. 1 lit. a RODO). Zgodę można w każdej chwili wycofać ze skutkiem na przyszłość.</p>
      </section>

      <section>
        <h2 id="zahlung">10. Płatność</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>Przy płatności przelewem przetwarzamy dane otrzymane wraz z przelewem (imię i nazwisko, dane rachunku, kwota, tytuł), aby przypisać płatność do zamówienia (art. 6 ust. 1 lit. b i c RODO). Państwa bank i nasz bank przetwarzają dane na własną odpowiedzialność.</p>
        ) : null}
        {c.payments.paypal ? (
          <p>Przy płatności PayPal przekazujemy dane niezbędne do płatności (imię i nazwisko, adres e-mail, kwotę, numer zamówienia, ewentualnie adres dostawy) do {PAYPAL_EUROPE}. PayPal przetwarza te dane jako niezależny administrator, m.in. w celu zapobiegania oszustwom i ewentualnie oceny wiarygodności płatniczej; możliwe jest przekazywanie danych do państw trzecich. Podstawą prawną naszego przekazania jest art. 6 ust. 1 lit. b RODO. Państwa prawa wobec PayPal opisuje oświadczenie o ochronie prywatności PayPal: https://www.paypal.com/pl/legalhub/privacy-full.</p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="metoda płatności do ustalenia" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Odstąpienie od umowy przez naszą stronę</h2>
        <p>Jeżeli odstępują Państwo od umowy za pomocą naszej funkcji odstąpienia („Odstąp od umowy”), przetwarzamy imię i nazwisko, dane zamówienia, adres e-mail oraz datę i godzinę otrzymania. Wysyłamy potwierdzenie otrzymania e-mailem i realizujemy odstąpienie. Podstawą prawną jest art. 6 ust. 1 lit. c RODO w związku z § 356a niemieckiego kodeksu cywilnego (BGB) oraz lit. b.</p>
      </section>

      <section>
        <h2 id="dienstleister">12. Usługodawcy (podmioty przetwarzające)</h2>
        <p>Korzystamy ze starannie wybranych usługodawców, którzy przetwarzają dane wyłącznie na nasze polecenie. Zawarliśmy z nimi umowy powierzenia zgodnie z art. 28 RODO.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – hosting strony
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – skrzynka pocztowa (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; miejsce przetwarzania: {p.country}; podstawa przekazania: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Przekazywanie danych do państw trzecich</h2>
        <p>Niektórzy usługodawcy mają siedzibę w USA lub mogą tam przetwarzać dane. Dla USA Komisja Europejska przyjęła 10 lipca 2023 r. decyzję stwierdzającą odpowiedni stopień ochrony (Ramy ochrony danych UE–USA). Przekazywanie do certyfikowanych przedsiębiorstw opiera się na art. 45 RODO. Dodatkowo lub w przypadku odbiorców niecertyfikowanych uzgodniliśmy standardowe klauzule umowne Komisji Europejskiej (art. 46 ust. 2 lit. c RODO). Mogą Państwo poprosić o kopię. Właściwa podstawa jest wskazana na liście w pkt 12.</p>
      </section>

      <section>
        <h2 id="newsletter">14. Newsletter</h2>
        <p>Newsletter otrzymują Państwo wyłącznie po wyraźnym zapisaniu się. Po zapisie wysyłamy e-mail z linkiem potwierdzającym (double opt-in). Dopiero po kliknięciu linku dodajemy Państwa do listy. Niepotwierdzone zapisy usuwamy po 30 dniach.</p>
        <p>Przechowujemy adres e-mail oraz czas zapisu i potwierdzenia, aby móc wykazać zgodę. Podstawą prawną jest Państwa zgoda (art. 6 ust. 1 lit. a RODO; § 7 ust. 2 pkt 2 niemieckiej ustawy o zwalczaniu nieuczciwej konkurencji – UWG); dowód przechowujemy na podstawie art. 6 ust. 1 lit. c w związku z art. 7 ust. 1 RODO. Nie mierzymy otwarć ani kliknięć.</p>
        <p>Z newslettera można w każdej chwili zrezygnować przez link w każdym wydaniu lub pisząc na adres {c.email}. Wówczas usuwamy adres z listy; dowód zgody przechowujemy do trzech lat po zakończeniu roku rezygnacji, aby móc bronić się przed roszczeniami.</p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Okresy przechowywania</h2>
        <ul>
          <li>Dane umowne przechowujemy do pełnego wykonania umowy i upływu ustawowego dwuletniego okresu odpowiedzialności za wady.</li>
          <li>Faktury i dowody księgowe przechowujemy przez osiem lat (§ 147 ust. 1 i 3 niemieckiej ordynacji podatkowej, AO).</li>
          <li>Korespondencję handlową, np. potwierdzenia zamówień, przechowujemy przez sześć lat (§ 147 ust. 1 i 3 AO).</li>
          <li>Terminy biegną od końca roku kalendarzowego, w którym powstał dokument. W tym czasie ograniczamy przetwarzanie do przechowywania.</li>
          <li>Wszystkie pozostałe dane usuwamy, gdy przestają być potrzebne; terminy podano w poszczególnych punktach.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Linki zewnętrzne i media społecznościowe</h2>
        <p>Na naszej stronie zamieszczamy linki do naszych profili na Instagramie i Facebooku oraz do WhatsApp. Są to zwykłe linki, a nie osadzone wtyczki: samo odwiedzenie naszej strony nie powoduje przekazania danych tym dostawcom.</p>
        <p>Dopiero po kliknięciu linku otwiera się strona dostawcy, który przetwarza dane na własną odpowiedzialność. Dostawcą Instagrama i Facebooka jest {META_IRELAND}; dostawcą WhatsApp jest {WHATSAPP_IRELAND}. Dane mogą być przekazywane do USA. Szczegóły zawierają polityki prywatności dostawców.</p>
      </section>

      <section>
        <h2 id="rechte">17. Państwa prawa</h2>
        <p>Przysługują Państwu następujące prawa dotyczące danych:</p>
        <ul>
          <li>Dostęp (art. 15 RODO)</li>
          <li>Sprostowanie (art. 16 RODO)</li>
          <li>Usunięcie (art. 17 RODO)</li>
          <li>Ograniczenie przetwarzania (art. 18 RODO)</li>
          <li>Przenoszenie danych (art. 20 RODO)</li>
          <li>Wycofanie zgody ze skutkiem na przyszłość (art. 7 ust. 3 RODO); przetwarzanie dokonane do tego czasu pozostaje zgodne z prawem</li>
        </ul>
        <p>
          <strong>Prawo sprzeciwu (art. 21 RODO):</strong> Jeżeli przetwarzamy dane na podstawie art.
          6 ust. 1 lit. f RODO, mogą Państwo w każdej chwili wnieść sprzeciw z przyczyn związanych ze
          szczególną sytuacją. Wówczas zaprzestaniemy przetwarzania, chyba że wykażemy ważne prawnie
          uzasadnione podstawy lub przetwarzanie służy ustaleniu, dochodzeniu lub obronie roszczeń. Po
          sprzeciwie nigdy więcej nie wyślemy Państwu reklam.
        </p>
        <p>W każdej sprawie wystarczy nieformalna wiadomość na adres {c.email}.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Prawo wniesienia skargi</h2>
        <p>Mogą Państwo wnieść skargę do organu nadzorczego (art. 77 RODO), np. w miejscu zamieszkania. Organem właściwym dla nas jest:</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Bezpieczeństwo, zautomatyzowane decyzje, zmiany</h2>
        <p>Połączenie z naszą stroną jest szyfrowane za pomocą TLS (rozpoznawalne po „https://”). Nie podejmujemy zautomatyzowanych decyzji ani nie stosujemy profilowania w rozumieniu art. 22 RODO. Aktualizujemy niniejszą politykę, gdy zmienia się strona lub przepisy.</p>
        <p>
          Ostatnia aktualizacja: {c.effectiveDate ?? <Missing field="effectiveDate" label="data wejścia w życie" />}
        </p>
      </section>
    </>
  );
}
