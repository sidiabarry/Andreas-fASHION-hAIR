import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, processingDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Gegeven ontbreekt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "nl-NL");
  const carrier = c.carrier ?? <Missing field="carrier" label="vervoerder" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Let op:</strong> Alleen de Duitse versie is juridisch bindend; deze vertaling dient
        uitsluitend ter verduidelijking.
      </p>
      <section>
        <h2 id="geltung">§ 1 Toepassingsgebied en verkoper</h2>
        <ol>
          <li>Deze algemene voorwaarden gelden voor alle bestellingen die consumenten (artikel 13 BGB) in onze onlinewinkel plaatsen.</li>
          <li>
            Uw contractpartij is{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="volledige naam van de eigenaar" />} (handelsnaam „{c.brandName}”),{" "}
            {addressLine(c)}, telefoon {c.phone}, e-mail {c.email}.
          </li>
          <li>De taal van de overeenkomst is Duits. Vertalingen dienen alleen ter verduidelijking.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Totstandkoming van de overeenkomst</h2>
        <ol>
          <li>De presentatie van producten in de winkel is geen bindend aanbod, maar een uitnodiging om te bestellen. Veel stukken zijn unica.</li>
          <li>U legt producten in de winkelwagen, vult in de volgende stap uw contact- en bezorggegevens in en ziet daarna een overzicht met alle gegevens en de totaalprijs. Invoerfouten kunt u vóór verzending altijd corrigeren: met de terugknop van uw browser, via „Wijzigen” in de winkelwagen of direct in de invoervelden. Door op de knop „Bestelling met betalingsverplichting” te klikken doet u een bindend aanbod tot koop van de artikelen in de winkelwagen.</li>
          <li>Direct daarna ontvangt u een automatische e-mail dat wij uw bestelling hebben ontvangen. Deze ontvangstbevestiging is nog geen aanvaarding van uw aanbod.</li>
          <li>Wij controleren persoonlijk of het stuk beschikbaar is. De overeenkomst komt tot stand wanneer wij uw bestelling per e-mail uitdrukkelijk aanvaarden (orderbevestiging) of de goederen verzenden – wat het eerst gebeurt. Wij beslissen binnen drie werkdagen na ontvangst van de bestelling. Ontvangt u in die termijn geen aanvaarding, dan bent u niet langer aan uw bestelling gebonden; reeds gedane betalingen betalen wij u onverwijld terug.</li>
          <li>Is een uniek stuk niet meer beschikbaar, dan informeren wij u onverwijld. Voor dat stuk komt dan geen overeenkomst tot stand.</li>
          <li>Met de orderbevestiging ontvangt u per e-mail de tekst van de overeenkomst, deze algemene voorwaarden, de informatie over het herroepingsrecht en het modelformulier voor herroeping.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Opslag van de tekst van de overeenkomst</h2>
        <p>Wij slaan de tekst van de overeenkomst op (uw bestelgegevens en de op het moment van bestellen geldende voorwaarden) en sturen deze per e-mail aan u. De actuele voorwaarden kunt u altijd op deze pagina bekijken, opslaan en afdrukken. Wij bieden geen klantaccount waarin eerdere bestellingen zichtbaar zijn.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Prijzen en verzendkosten</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Alle prijzen zijn eindprijzen. Als kleine ondernemer in de zin van artikel 19 van de Duitse btw-wet (UStG) berekenen wij geen btw en vermelden wij deze daarom niet.</>
            ) : c.smallBusiness === false ? (
              <>Alle prijzen zijn eindprijzen inclusief wettelijke btw.</>
            ) : (
              <Missing field="smallBusiness" label="btw-status (kleine ondernemer ja/nee)" />
            )}
          </li>
          <li>
            Daarbij komen verzendkosten: binnen Duitsland {eur(ship.domesticCents)} per bestelling
            {ship.freeFromCents !== null ? <>, gratis vanaf een bestelwaarde van {eur(ship.freeFromCents)}</> : null}
            {ship.euCents !== null ? <>; naar andere landen van de Europese Unie {eur(ship.euCents)} per bestelling</> : null}
            . Voor andere landen noemen wij de verzendkosten op aanvraag vóór de bestelling. U ziet de
            verzendkosten in het overzicht voordat u de bestelling verstuurt.
          </li>
          <li>Bij levering buiten de Europese Unie kunnen douanerechten, belastingen en kosten verschuldigd zijn, die u aan de bevoegde instanties betaalt.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Betaling</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="betaalwijze nog vast te stellen" />
          </p>
        ) : (
          <>
            <p>U kunt met de volgende betaalwijzen betalen. De betaalgegevens sturen wij mee met de orderbevestiging.</p>
            <ul>
              {c.payments.prepayment ? (
                <li><strong>Vooruitbetaling per overschrijving:</strong> maak het totaalbedrag binnen 7 dagen na ontvangst van de orderbevestiging over. Wij verzenden na ontvangst van de betaling. Blijft de betaling ondanks herinnering uit, dan kunnen wij de overeenkomst ontbinden.</li>
              ) : null}
              {c.payments.paypal ? (
                <li><strong>PayPal:</strong> na de orderbevestiging ontvangt u een betaalverzoek van PayPal. Betaal binnen 7 dagen. Daarnaast gelden de voorwaarden van PayPal. Verzending na ontvangst van de betaling.</li>
              ) : null}
              {c.payments.bankTransfer ? (
                <li><strong>Factuur (overschrijving na ontvangst):</strong> het factuurbedrag moet binnen 14 dagen na ontvangst van de goederen zonder aftrek worden overgemaakt. Wij kunnen deze betaalwijze in afzonderlijke gevallen weigeren, met name bij hoge bedragen of levering in het buitenland, en u een andere beschikbare betaalwijze aanbieden.</li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Levering</h2>
        <ol>
          <li>
            Wij leveren binnen Duitsland
            {others.length > 0 ? <> en naar de volgende landen: {countryNames(others, "nl")}</> : null}. Levering
            naar andere landen is mogelijk na overleg. De verzending gebeurt met {carrier}.
          </li>
          <li>Artikelen op voorraad geven wij binnen {processingDaysOf(c)} werkdagen af aan de vervoerder. Bij vooruitbetaling of PayPal begint de termijn op de dag na ontvangst van de betaling, anders op de dag na het sluiten van de overeenkomst. Daar komt de transporttijd bij. De verwachte levertijd vermelden wij op de productpagina en in het besteloverzicht.</li>
          <li>Maatwerk vervaardigen wij binnen ongeveer {madeToOrderDaysOf(c)} dagen nadat alle benodigde gegevens en – bij vooruitbetaling of PayPal – de betaling bij ons zijn binnengekomen. Wij laten u de verwachte verzenddatum weten.</li>
          <li>Komen de goederen aan met zichtbare transportschade, meld dit dan bij de bezorger en laat het ons kort weten. Uw wettelijke rechten blijven onverlet; uw melding helpt ons aanspraken tegenover de vervoerder geldend te maken.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Eigendomsvoorbehoud</h2>
        <p>De goederen blijven ons eigendom tot volledige betaling.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Maatwerk en vervaardiging naar uw wensen</h2>
        <ol>
          <li>Producten die als maatwerk zijn gemarkeerd, vervaardigen wij volgens uw gegevens, bijvoorbeeld hoofdomtrek, haarkleur, dichtheid, haarrichting en basis. Controleer uw gegevens zorgvuldig; wij bespreken ze met u voordat wij beginnen.</li>
          <li>Voor maatwerk bestaat geen herroepingsrecht (artikel 312g, lid 2, nr. 1, BGB). Details staan in de informatie over het herroepingsrecht. Uw rechten bij gebreken blijven onverlet.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Herroepingsrecht</h2>
        <p>Als consument hebt u een wettelijk herroepingsrecht. Voorwaarden, termijnen en procedure, uitzonderingen en de onlinefunctie „Overeenkomst herroepen” worden beschreven in onze informatie over het herroepingsrecht.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Wettelijke garantie (aansprakelijkheid voor gebreken)</h2>
        <ol>
          <li>De wettelijke rechten bij gebreken zijn van toepassing (artikelen 434 e.v. BGB). De termijn voor aanspraken wegens gebreken bedraagt twee jaar vanaf de levering van de goederen.</li>
          <li>Neem bij een gebrek contact met ons op: {c.email}, telefoon {c.phone}, of per post: {addressLine(c)}.</li>
          <li>Een aanvullende commerciële garantie geven wij alleen als wij die bij een product uitdrukkelijk vermelden.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Aansprakelijkheid</h2>
        <ol>
          <li>Wij zijn onbeperkt aansprakelijk bij opzet en grove nalatigheid, bij letsel aan leven, lichaam of gezondheid, op grond van de Duitse wet op de productaansprakelijkheid en voor zover een garantie is gegeven.</li>
          <li>Bij licht nalatige schending van een verplichting waarvan de nakoming essentieel is voor de juiste uitvoering van de overeenkomst en op de naleving waarvan u normaal gesproken mag vertrouwen (wezenlijke contractuele verplichting), is onze aansprakelijkheid beperkt tot de voorzienbare, voor de overeenkomst typische schade.</li>
          <li>Voor het overige is aansprakelijkheid voor lichte nalatigheid uitgesloten.</li>
          <li>Uw rechten bij gebreken volgens § 10 blijven door deze bepalingen onverlet.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Verzorgings-, lijm- en oplosmiddelproducten</h2>
        <p>Lees vóór gebruik van lijmen, tapes en oplosmiddelen de gebruiksaanwijzing en waarschuwingen van de fabrikant op de verpakking en op de productpagina en volg deze op. Wij raden aan een nieuw product eerst op een klein stukje huid te testen. Bewaar deze producten buiten bereik van kinderen. Voor sommige producten kunnen verzendbeperkingen gelden; wij vermelden dit op de productpagina.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Geschillenbeslechting voor consumenten</h2>
        {c.disputeResolution === "willing" ? (
          <p>Wij zijn bereid deel te nemen aan geschillenbeslechting voor de volgende instantie: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Wij zijn niet bereid en niet verplicht deel te nemen aan geschillenbeslechting voor een geschilleninstantie voor consumenten.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="besluit over consumentengeschillenbeslechting (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Toepasselijk recht</h2>
        <p>Het recht van de Bondsrepubliek Duitsland is van toepassing, met uitsluiting van het Weens Koopverdrag. Hebt u uw gewone verblijfplaats in een andere staat, dan behoudt u de bescherming van de dwingende consumentenbeschermingsbepalingen van die staat (artikel 6, lid 2, Rome I-verordening).</p>
        <p>
          Laatst bijgewerkt: {c.effectiveDate ?? <Missing field="effectiveDate" label="datum van inwerkingtreding van de voorwaarden" />}
        </p>
      </section>
    </>
  );
}
