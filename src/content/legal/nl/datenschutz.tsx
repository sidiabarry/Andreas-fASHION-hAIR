import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Gegeven ontbreekt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="vervoerder" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Let op:</strong> Alleen de Duitse versie is juridisch bindend; deze vertaling dient
        uitsluitend ter verduidelijking.
      </p>
      <section>
        <h2 id="ueberblick">1. In het kort</h2>
        <ul>
          <li>Deze website gebruikt geen cookies, geen analysetools en geen advertentietrackers.</li>
          <li>Lettertypen en video's staan op onze eigen server. Bij een bezoek worden geen gegevens doorgegeven aan Google, YouTube, Meta of vergelijkbare aanbieders.</li>
          <li>Wij verwerken uw gegevens alleen om uw bestelling of vraag af te handelen, wettelijke verplichtingen na te komen en – alleen met uw toestemming – u onze nieuwsbrief te sturen.</li>
          <li>Stuur ons alstublieft geen gezondheidsgegevens (zie punt 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Verwerkingsverantwoordelijke</h2>
        <p>Verwerkingsverantwoordelijke in de zin van de Algemene Verordening Gegevensbescherming (AVG) is:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="volledige naam van de eigenaar" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Telefoon: {c.phone}
          <br />
          E-mail: {c.email}
        </p>
        <p>Wij zijn wettelijk niet verplicht een functionaris voor gegevensbescherming aan te stellen. Voor vragen kunt u ons bereiken via de bovenstaande gegevens.</p>
      </section>

      <section>
        <h2 id="hosting">3. Hosting en serverlogbestanden</h2>
        <p>Onze website wordt gehost door {c.hostingProvider.name}, {c.hostingProvider.address}. Bij elk bezoek verwerkt de server technisch noodzakelijke gegevens die uw browser automatisch verstuurt: IP-adres, datum en tijd, opgevraagde pagina, hoeveelheid overgedragen gegevens, statuscode, verwijzende URL en gegevens over browser en besturingssysteem.</p>
        <p>Wij hebben deze gegevens nodig om de website te tonen, te beveiligen en aanvallen af te weren. De rechtsgrond is artikel 6, lid 1, onder f, AVG; ons gerechtvaardigd belang is een veilige, werkende website. Wij analyseren logbestanden niet voor statistiek of marketing en koppelen ze niet aan andere gegevens. De hostingprovider bewaart logbestanden slechts kort, zolang technisch nodig, en verwijdert ze daarna automatisch.</p>
        <p>Met de hostingprovider hebben wij een verwerkersovereenkomst volgens artikel 28 AVG gesloten. Voor doorgifte naar de VS zie punt 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Opslag in uw browser (geen cookie, geen tracking)</h2>
        <p>Om uw winkelwagen te bewaren terwijl u verder kijkt, slaan wij de gekozen artikelen op in de lokale opslag van uw browser (localStorage). Deze gegevens blijven op uw apparaat en worden pas aan ons verstuurd wanneer u een bestelling plaatst. U kunt ze altijd verwijderen door de winkelwagen te legen of de sitegegevens in uw browser te wissen.</p>
        <p>Deze opslag is strikt noodzakelijk om de door u uitdrukkelijk gevraagde winkelwagen te leveren. Toestemming is daarom niet vereist volgens artikel 25, lid 2, nr. 2, van de Duitse TDDDG. Voor zover persoonsgegevens worden verwerkt, is de rechtsgrond artikel 6, lid 1, onder b, AVG (precontractuele maatregelen).</p>
      </section>

      <section>
        <h2 id="inhalte">5. Lettertypen, afbeeldingen en video's</h2>
        <p>Alle lettertypen, foto's en video's worden vanaf onze eigen hosting geleverd. Er wordt geen inhoud van derden geladen (bijvoorbeeld Google Fonts, YouTube of Vimeo).</p>
      </section>

      <section>
        <h2 id="anfragen">6. Contact, advies en aanvragen</h2>
        <p>Als u contact met ons opneemt via een formulier, e-mail of telefoon – bijvoorbeeld voor advies, maatwerk of een salonaanvraag – verwerken wij de gegevens die u ons geeft (meestal naam, e-mailadres, eventueel telefoonnummer en uw bericht).</p>
        <p>Het doel is de afhandeling van uw vraag. De rechtsgrond is artikel 6, lid 1, onder b, AVG als uw vraag een overeenkomst betreft, anders onder f (ons gerechtvaardigd belang om vragen te beantwoorden). Wij verwijderen aanvragen zodra ze zijn afgehandeld en er geen overeenkomst uit is voortgekomen, uiterlijk 12 maanden na het laatste contact. Komt er een overeenkomst tot stand, dan gelden de termijnen van punt 15.</p>
        <p>Formuliergegevens slaan wij op in onze database; voor meldingen gebruiken wij een e-mailverzenddienst (zie punt 12).</p>
        {gmail ? (
          <p>Onze mailbox wordt geleverd door {GOOGLE_IRELAND} (Gmail). E-mails die u ons stuurt en onze antwoorden worden daarom opgeslagen op servers van Google; daarbij kunnen gegevens naar de VS worden doorgegeven (zie punt 13).</p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Contact via WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>U kunt ons desgewenst ook via WhatsApp schrijven. Aanbieder is {WHATSAPP_IRELAND}. WhatsApp hoort bij de Meta-groep; gegevens kunnen naar de VS worden doorgegeven. WhatsApp verwerkt onder eigen verantwoordelijkheid uw telefoonnummer, uw profiel, metagegevens van de communicatie (bijvoorbeeld het tijdstip) en – afhankelijk van uw instellingen – uw adresboek. Zie voor details het privacybeleid van WhatsApp.</p>
            <p>Wij gebruiken de berichten alleen om uw vraag te beantwoorden (artikel 6, lid 1, onder b of f, AVG) en verwijderen chats na afhandeling, uiterlijk na 12 maanden. U kunt ons altijd ook per e-mail of telefoon bereiken. Stuur ons via WhatsApp geen gezondheidsgegevens.</p>
          </>
        ) : (
          <p>Wij bieden momenteel geen contact via berichtendiensten aan.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Graag geen gezondheidsgegevens</h2>
        <p>Veel van onze klanten dragen haarwerken om gezondheidsredenen. Wij hoeven die redenen niet te kennen voor advies, bestelling of maatwerk. Onze formulieren vragen daarom niet naar gezondheidsgegevens, en wij vragen u ons geen informatie te geven over ziekten, behandelingen of diagnoses. Voor maatwerk volstaan hoofdomtrek, haarkleur, haarlengte en gewenst kapsel.</p>
        <p>Stuurt u ons toch gezondheidsgegevens, dan gaat het om bijzondere categorieën persoonsgegevens volgens artikel 9 AVG. Wij gebruiken ze niet en verwijderen ze zodra wij ze opmerken, tenzij wij ze uitzonderlijk nodig hebben om uw vraag te beantwoorden. In dat geval vragen wij eerst uw uitdrukkelijke toestemming (artikel 9, lid 2, onder a, AVG), die u altijd kunt intrekken.</p>
      </section>

      <section>
        <h2 id="bestellung">9. Bestelling en uitvoering van de overeenkomst</h2>
        <p>Voor uw bestelling verwerken wij naam, bezorg- en factuuradres, e-mailadres, eventueel telefoonnummer, bestelde artikelen, prijzen, betaal- en verzendgegevens en uw bericht. Verplichte velden zijn gemarkeerd; zonder deze gegevens kunnen wij de overeenkomst niet sluiten of uitvoeren.</p>
        <p>Rechtsgronden zijn artikel 6, lid 1, onder b, AVG (precontractuele maatregelen en uitvoering van de overeenkomst) en, voor het bewaren van facturen en boekingsstukken, onder c in samenhang met fiscale en handelsrechtelijke verplichtingen (zie punt 15).</p>
        <p>Voor de bezorging geven wij naam en bezorgadres door aan de vervoerder {carrier}. Uw e-mailadres of telefoonnummer geven wij alleen door als u daar bij het bestellen uitdrukkelijk mee hebt ingestemd, zodat de vervoerder u over de bezorging kan informeren (artikel 6, lid 1, onder a, AVG). U kunt deze toestemming altijd met ingang van de toekomst intrekken.</p>
      </section>

      <section>
        <h2 id="zahlung">10. Betaling</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>Bij betaling per overschrijving verwerken wij de gegevens die met uw overschrijving binnenkomen (naam, rekeninggegevens, bedrag, omschrijving) om de betaling aan uw bestelling te koppelen (artikel 6, lid 1, onder b en c, AVG). Uw bank en onze bank verwerken de gegevens onder eigen verantwoordelijkheid.</p>
        ) : null}
        {c.payments.paypal ? (
          <p>Betaalt u met PayPal, dan geven wij de voor de betaling nodige gegevens (naam, e-mailadres, bedrag, bestelnummer, eventueel bezorgadres) door aan {PAYPAL_EUROPE}. PayPal verwerkt deze gegevens als zelfstandige verwerkingsverantwoordelijke, onder meer voor fraudepreventie en eventueel kredietcontrole; doorgifte naar derde landen is mogelijk. De rechtsgrond voor onze doorgifte is artikel 6, lid 1, onder b, AVG. Uw rechten tegenover PayPal staan in de privacyverklaring van PayPal: https://www.paypal.com/nl/legalhub/privacy-full.</p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="betaalwijze nog vast te stellen" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Herroeping via onze website</h2>
        <p>Als u een overeenkomst herroept via onze herroepingsfunctie („Overeenkomst herroepen”), verwerken wij uw naam, de bestelgegevens, uw e-mailadres en datum en tijdstip van ontvangst. Wij sturen u per e-mail een ontvangstbevestiging en handelen de herroeping af. De rechtsgrond is artikel 6, lid 1, onder c, AVG in samenhang met artikel 356a van het Duitse Burgerlijk Wetboek (BGB), en onder b.</p>
      </section>

      <section>
        <h2 id="dienstleister">12. Dienstverleners (verwerkers)</h2>
        <p>Wij werken met zorgvuldig gekozen dienstverleners die gegevens alleen in onze opdracht verwerken. Met hen zijn verwerkersovereenkomsten volgens artikel 28 AVG gesloten.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – hosting van de website
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – mailbox (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; plaats van verwerking: {p.country}; grondslag van doorgifte: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Doorgifte naar derde landen</h2>
        <p>Sommige dienstverleners zijn gevestigd in de VS of kunnen daar gegevens verwerken. Voor de VS heeft de Europese Commissie op 10 juli 2023 een adequaatheidsbesluit vastgesteld (EU-US Data Privacy Framework). Doorgifte aan gecertificeerde bedrijven berust op artikel 45 AVG. Daarnaast, of voor niet-gecertificeerde ontvangers, hebben wij de modelcontractbepalingen van de Europese Commissie overeengekomen (artikel 46, lid 2, onder c, AVG). U kunt een kopie bij ons opvragen. De toepasselijke grondslag staat in de lijst onder punt 12.</p>
      </section>

      <section>
        <h2 id="newsletter">14. Nieuwsbrief</h2>
        <p>U ontvangt onze nieuwsbrief alleen als u zich uitdrukkelijk aanmeldt. Na aanmelding sturen wij u een e-mail met een bevestigingslink (double opt-in). Pas als u op die link klikt, nemen wij u op in de verzendlijst. Niet-bevestigde aanmeldingen verwijderen wij na 30 dagen.</p>
        <p>Wij bewaren uw e-mailadres en het tijdstip van aanmelding en bevestiging om uw toestemming te kunnen aantonen. De rechtsgrond is uw toestemming (artikel 6, lid 1, onder a, AVG; artikel 7, lid 2, nr. 2, van de Duitse wet tegen oneerlijke concurrentie – UWG); het bewijs bewaren wij op grond van artikel 6, lid 1, onder c, in samenhang met artikel 7, lid 1, AVG. Wij meten geen openingen of klikken.</p>
        <p>U kunt zich altijd afmelden via de link in elke nieuwsbrief of door te schrijven naar {c.email}. Wij verwijderen dan uw adres uit de verzendlijst; het bewijs van toestemming bewaren wij tot drie jaar na het einde van het jaar van afmelding om ons tegen aanspraken te kunnen verdedigen.</p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Bewaartermijnen</h2>
        <ul>
          <li>Contractgegevens bewaren wij tot de overeenkomst volledig is uitgevoerd en de wettelijke garantietermijn van twee jaar is verstreken.</li>
          <li>Facturen en boekingsstukken bewaren wij acht jaar (artikel 147, leden 1 en 3, van de Duitse belastingwet, AO).</li>
          <li>Zakelijke correspondentie, bijvoorbeeld orderbevestigingen, bewaren wij zes jaar (artikel 147, leden 1 en 3, AO).</li>
          <li>De termijnen beginnen aan het einde van het kalenderjaar waarin het document is ontstaan. In die tijd beperken wij de verwerking tot bewaring.</li>
          <li>Alle overige gegevens verwijderen wij zodra ze niet meer nodig zijn; de termijnen staan bij de afzonderlijke punten.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Externe links en sociale media</h2>
        <p>Op onze website linken wij naar onze profielen op Instagram en Facebook en naar WhatsApp. Het gaat om gewone links, niet om ingebouwde plug-ins: alleen door onze website te bezoeken worden geen gegevens aan deze aanbieders doorgegeven.</p>
        <p>Pas als u op een link klikt, opent de pagina van de aanbieder, die uw gegevens dan onder eigen verantwoordelijkheid verwerkt. Aanbieder van Instagram en Facebook is {META_IRELAND}; aanbieder van WhatsApp is {WHATSAPP_IRELAND}. Gegevens kunnen naar de VS worden doorgegeven. Zie de privacyverklaringen van de aanbieders.</p>
      </section>

      <section>
        <h2 id="rechte">17. Uw rechten</h2>
        <p>U hebt de volgende rechten met betrekking tot uw gegevens:</p>
        <ul>
          <li>Inzage (artikel 15 AVG)</li>
          <li>Rectificatie (artikel 16 AVG)</li>
          <li>Wissing (artikel 17 AVG)</li>
          <li>Beperking van de verwerking (artikel 18 AVG)</li>
          <li>Overdraagbaarheid (artikel 20 AVG)</li>
          <li>Intrekking van toestemming met ingang van de toekomst (artikel 7, lid 3, AVG); de verwerking tot dat moment blijft rechtmatig</li>
        </ul>
        <p>
          <strong>Recht van bezwaar (artikel 21 AVG):</strong> Voor zover wij gegevens verwerken op
          grond van artikel 6, lid 1, onder f, AVG, kunt u op grond van uw specifieke situatie
          altijd bezwaar maken. Wij verwerken de gegevens dan niet meer, tenzij wij dwingende
          gerechtvaardigde gronden aantonen of de verwerking dient voor de instelling, uitoefening of
          onderbouwing van een rechtsvordering. Na een bezwaar sturen wij u nooit meer reclame.
        </p>
        <p>Voor elk verzoek volstaat een eenvoudig bericht aan {c.email}.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Recht om een klacht in te dienen</h2>
        <p>U kunt een klacht indienen bij een toezichthoudende autoriteit (artikel 77 AVG), bijvoorbeeld in uw woonplaats. Voor ons bevoegd is:</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Beveiliging, geautomatiseerde besluiten, wijzigingen</h2>
        <p>De verbinding met onze website is versleuteld met TLS (herkenbaar aan „https://”). Wij nemen geen geautomatiseerde besluiten en doen niet aan profilering in de zin van artikel 22 AVG. Wij passen deze privacyverklaring aan als onze website of de wetgeving verandert.</p>
        <p>
          Laatst bijgewerkt: {c.effectiveDate ?? <Missing field="effectiveDate" label="datum van inwerkingtreding" />}
        </p>
      </section>
    </>
  );
}
