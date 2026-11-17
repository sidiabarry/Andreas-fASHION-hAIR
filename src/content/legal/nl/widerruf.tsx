import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Gegeven ontbreekt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>onze website via de knop „Overeenkomst herroepen” onderaan elke pagina</>;
  return (
    <>
      <p>
        <strong>Let op:</strong> Alleen de Duitse versie is juridisch bindend; deze vertaling dient
        uitsluitend ter verduidelijking.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Informatie over het herroepingsrecht</h2>
        <h3 id="widerrufsrecht">Herroepingsrecht</h3>
        <p>U hebt het recht om binnen 14 dagen zonder opgave van redenen deze overeenkomst te herroepen.</p>
        <p>De herroepingstermijn verstrijkt 14 dagen na de dag waarop u, of een door u aangewezen derde die niet de vervoerder is, de goederen fysiek in bezit krijgt. Hebt u in één bestelling meerdere goederen besteld die afzonderlijk worden geleverd, dan verstrijkt de termijn 14 dagen na de dag waarop u, of een door u aangewezen derde die niet de vervoerder is, het laatste goed fysiek in bezit krijgt.</p>
        <p>
          Om het herroepingsrecht uit te oefenen, moet u ons (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="volledige naam van de eigenaar" />}, {c.brandName},{" "}
          {addressLine(c)}, telefoon {c.phone}, e-mail {c.withdrawalEmail}) via een ondubbelzinnige
          verklaring (bv. schriftelijk per post of e-mail) op de hoogte stellen van uw beslissing de
          overeenkomst te herroepen. U kunt hiervoor het bijgevoegde modelformulier voor herroeping
          gebruiken, maar bent hiertoe niet verplicht.
        </p>
        <p>U kunt uw herroepingsrecht ook online uitoefenen via {where}. Als u deze onlinefunctie gebruikt, sturen wij u onverwijld op een duurzame gegevensdrager (bv. per e-mail) een ontvangstbevestiging met informatie over de inhoud van de herroepingsverklaring en de datum en het tijdstip van ontvangst.</p>
        <p>Om de herroepingstermijn na te leven volstaat het om uw mededeling betreffende uw uitoefening van het herroepingsrecht te verzenden voordat de herroepingstermijn is verstreken.</p>

        <h3 id="folgen">Gevolgen van de herroeping</h3>
        <p>Als u de overeenkomst herroept, ontvangt u alle betalingen die u tot op dat moment hebt gedaan, inclusief leveringskosten (met uitzondering van eventuele extra kosten ten gevolge van uw keuze voor een andere wijze van levering dan de door ons geboden goedkoopste standaardlevering) onverwijld en in ieder geval niet later dan 14 dagen nadat wij op de hoogte zijn gesteld van uw beslissing de overeenkomst te herroepen, van ons terug. Wij betalen u terug met hetzelfde betaalmiddel als waarmee u de oorspronkelijke transactie hebt verricht, tenzij u uitdrukkelijk anderszins hebt ingestemd; in ieder geval zult u voor een dergelijke terugbetaling geen kosten hoeven te betalen. Wij mogen wachten met terugbetalen totdat wij de goederen hebben teruggekregen of totdat u hebt aangetoond dat u de goederen hebt teruggezonden, al naargelang welk tijdstip eerst valt.</p>
        <p>U moet de goederen onverwijld, doch in ieder geval niet later dan 14 dagen na de dag waarop u ons uw beslissing tot herroeping van de overeenkomst hebt meegedeeld, aan ons terugzenden of overhandigen. U bent op tijd als u de goederen terugzendt voordat de termijn van 14 dagen is verstreken.</p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>De kosten van het terugzenden van de goederen komen voor onze rekening.</>
          ) : c.returnCosts === "customer" ? (
            <>U draagt de rechtstreekse kosten van het terugzenden van de goederen.</>
          ) : (
            <Missing field="returnCosts" label="wie de retourkosten draagt (besluit van de eigenaar)" />
          )}
        </p>
        <p>U bent alleen aansprakelijk voor de waardevermindering van de goederen die het gevolg is van het gebruik van de goederen dat verder gaat dan nodig is om de aard, de kenmerken en de werking van de goederen vast te stellen.</p>

        <h3 id="ausschluss">Uitsluiting of vroegtijdig vervallen van het herroepingsrecht</h3>
        <p>Er bestaat geen herroepingsrecht bij overeenkomsten</p>
        <ul>
          <li>voor de levering van niet-geprefabriceerde goederen die volgens specificaties van de consument zijn vervaardigd of duidelijk voor een specifieke persoon bestemd zijn. Bij ons betreft dit alle producten die als maatwerk zijn gemarkeerd, bijvoorbeeld de op maat gemaakte haarprothese. Hetzelfde geldt voor extensions die wij volgens uw wensen verven, op maat knippen of vervaardigen.</li>
        </ul>
        <p>Het herroepingsrecht vervalt vroegtijdig bij overeenkomsten</p>
        <ul>
          <li>voor de levering van verzegelde goederen die om redenen van gezondheidsbescherming of hygiëne niet geschikt zijn om te worden teruggezonden en waarvan de verzegeling na de levering is verbroken. Dit betreft alleen producten die wij verzegeld leveren en op de productpagina als zodanig aanduiden.</li>
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
        <h2 id="online-widerruf">3. Zo herroept u via onze website</h2>
        <ol>
          <li>Klik op „Overeenkomst herroepen”. De knop staat tijdens de herroepingstermijn op elke pagina van onze website.</li>
          <li>Vul uw naam, uw bestelnummer of andere gegevens van de bestelling en het e-mailadres voor de ontvangstbevestiging in. U kunt ook alleen afzonderlijke artikelen van een bestelling herroepen.</li>
          <li>Controleer de gegevens en klik op „Herroeping bevestigen”.</li>
          <li>Wij sturen u onverwijld per e-mail een ontvangstbevestiging met de inhoud van uw verklaring en datum en tijdstip van ontvangst.</li>
        </ol>
        <p>De ontvangstbevestiging bevestigt alleen dat uw verklaring bij ons is aangekomen. Geldt voor een artikel een uitzondering op het herroepingsrecht, dan laten wij u dat apart weten.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Aanwijzingen voor retourzending</h2>
        <p>Stuur de goederen naar: {c.brandName}, {addressLine(c)}. U vergemakkelijkt de afhandeling als u de goederen goed beschermd – zo mogelijk in de originele verpakking – en met het bestelnummer terugstuurt. Dit is geen voorwaarde voor een geldige herroeping. U mag haarwerken voorzichtig passen zoals in een winkel; knip, verf, was of lijm ze niet vóór het einde van de herroepingstermijn, anders kan waardevermindering ontstaan waarvoor u volgens de informatie over het herroepingsrecht aansprakelijk bent.</p>
      </section>
    </>
  );
}
