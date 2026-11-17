import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Brak danych: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>naszej stronie za pomocą przycisku „Odstąp od umowy” na dole każdej podstrony</>;
  return (
    <>
      <p>
        <strong>Uwaga:</strong> Wiążąca prawnie jest wyłącznie wersja niemiecka; niniejsze
        tłumaczenie służy jedynie ułatwieniu zrozumienia.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Pouczenie o prawie odstąpienia od umowy</h2>
        <h3 id="widerrufsrecht">Prawo odstąpienia od umowy</h3>
        <p>Mają Państwo prawo odstąpić od niniejszej umowy w terminie 14 dni bez podania jakiejkolwiek przyczyny.</p>
        <p>Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia, w którym weszli Państwo w posiadanie rzeczy lub w którym osoba trzecia inna niż przewoźnik i wskazana przez Państwa weszła w posiadanie rzeczy. Jeżeli w jednym zamówieniu zamówili Państwo kilka rzeczy dostarczanych osobno, termin wygasa po upływie 14 dni od dnia, w którym weszli Państwo w posiadanie ostatniej z rzeczy lub w którym weszła w jej posiadanie wskazana przez Państwa osoba trzecia inna niż przewoźnik.</p>
        <p>
          Aby skorzystać z prawa odstąpienia od umowy, muszą Państwo poinformować nas (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="imię i nazwisko właścicielki" />}, {c.brandName},{" "}
          {addressLine(c)}, telefon {c.phone}, e-mail {c.withdrawalEmail}) o swojej decyzji o
          odstąpieniu od niniejszej umowy w drodze jednoznacznego oświadczenia (na przykład pismo
          wysłane pocztą lub pocztą elektroniczną). Mogą Państwo skorzystać z załączonego wzoru
          formularza odstąpienia od umowy, jednak nie jest to obowiązkowe.
        </p>
        <p>Mogą Państwo także wykonać prawo odstąpienia online na {where}. Jeżeli skorzystają Państwo z tej funkcji, niezwłocznie prześlemy na trwałym nośniku (np. e-mailem) potwierdzenie otrzymania zawierające treść oświadczenia o odstąpieniu oraz datę i godzinę jego otrzymania.</p>
        <p>Aby zachować termin do odstąpienia od umowy, wystarczy, aby wysłali Państwo informację dotyczącą wykonania przysługującego Państwu prawa odstąpienia od umowy przed upływem terminu do odstąpienia od umowy.</p>

        <h3 id="folgen">Skutki odstąpienia od umowy</h3>
        <p>W przypadku odstąpienia od niniejszej umowy zwracamy Państwu wszystkie otrzymane od Państwa płatności, w tym koszty dostarczenia rzeczy (z wyjątkiem dodatkowych kosztów wynikających z wybranego przez Państwa sposobu dostarczenia innego niż najtańszy zwykły sposób dostarczenia oferowany przez nas), niezwłocznie, a w każdym przypadku nie później niż 14 dni od dnia, w którym zostaliśmy poinformowani o Państwa decyzji o wykonaniu prawa odstąpienia od niniejszej umowy. Zwrotu płatności dokonamy przy użyciu takich samych sposobów płatności, jakie zostały przez Państwa użyte w pierwotnej transakcji, chyba że wyraźnie zgodzili się Państwo na inne rozwiązanie; w każdym przypadku nie poniosą Państwo żadnych opłat w związku z tym zwrotem. Możemy wstrzymać się ze zwrotem płatności do czasu otrzymania rzeczy lub do czasu dostarczenia nam dowodu jej odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej.</p>
        <p>Prosimy odesłać lub przekazać nam rzecz niezwłocznie, a w każdym razie nie później niż 14 dni od dnia, w którym poinformowali nas Państwo o odstąpieniu od niniejszej umowy. Termin jest zachowany, jeżeli odeślą Państwo rzecz przed upływem terminu 14 dni.</p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Poniesiemy koszty zwrotu rzeczy.</>
          ) : c.returnCosts === "customer" ? (
            <>Będą Państwo musieli ponieść bezpośrednie koszty zwrotu rzeczy.</>
          ) : (
            <Missing field="returnCosts" label="kto ponosi koszty zwrotu (decyzja właścicielki)" />
          )}
        </p>
        <p>Odpowiadają Państwo tylko za zmniejszenie wartości rzeczy wynikające z korzystania z niej w sposób inny niż było to konieczne do stwierdzenia charakteru, cech i funkcjonowania rzeczy.</p>

        <h3 id="ausschluss">Wyłączenie lub wcześniejsza utrata prawa odstąpienia od umowy</h3>
        <p>Prawo odstąpienia od umowy nie przysługuje w przypadku umów</p>
        <ul>
          <li>dotyczących rzeczy nieprefabrykowanych, wyprodukowanych według specyfikacji konsumenta lub służących zaspokojeniu jego zindywidualizowanych potrzeb. U nas dotyczy to wszystkich produktów oznaczonych jako wykonywane na wymiar, np. protezy włosów na wymiar.</li>
        </ul>
        <p>Prawo odstąpienia od umowy wygasa wcześniej w przypadku umów</p>
        <ul>
          <li>dotyczących rzeczy dostarczanych w zapieczętowanym opakowaniu, których po otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte po dostarczeniu. Dotyczy to wyłącznie produktów dostarczanych przez nas w zapieczętowanym opakowaniu i oznaczonych tak na stronie produktu.</li>
        </ul>
      </section>

      <section>
        <h2 id="formular">2. {form.title}</h2>
        <ul>
          {form.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="online-widerruf">3. Jak odstąpić od umowy przez naszą stronę</h2>
        <ol>
          <li>Proszę kliknąć „Odstąp od umowy”. Przycisk znajduje się na każdej podstronie przez cały okres na odstąpienie.</li>
          <li>Proszę podać imię i nazwisko, numer zamówienia lub inne dane zamówienia oraz adres e-mail do wysłania potwierdzenia. Można także odstąpić tylko od wybranych produktów z zamówienia.</li>
          <li>Proszę sprawdzić dane i kliknąć „Potwierdź odstąpienie”.</li>
          <li>Niezwłocznie wyślemy e-mailem potwierdzenie otrzymania z treścią oświadczenia oraz datą i godziną otrzymania.</li>
        </ol>
        <p>Potwierdzenie potwierdza jedynie, że oświadczenie do nas dotarło. Jeżeli do produktu ma zastosowanie wyjątek od prawa odstąpienia, poinformujemy o tym osobno.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Wskazówki dotyczące zwrotu</h2>
        <p>Prosimy odesłać towar na adres: {c.brandName}, {addressLine(c)}. Ułatwią nam Państwo obsługę, odsyłając towar dobrze zabezpieczony – w miarę możliwości w oryginalnym opakowaniu – wraz z numerem zamówienia. Nie jest to warunek skutecznego odstąpienia. Uzupełnienia włosów można ostrożnie przymierzyć jak w sklepie; prosimy ich nie obcinać, nie farbować, nie myć ani nie przyklejać przed upływem terminu na odstąpienie, gdyż może to spowodować zmniejszenie wartości, za które odpowiadają Państwo zgodnie z pouczeniem.</p>
      </section>
    </>
  );
}
