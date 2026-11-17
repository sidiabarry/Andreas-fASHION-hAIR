import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato mancante: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "it-IT");
  const carrier = c.carrier ?? <Missing field="carrier" label="corriere" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Nota:</strong> Fa fede esclusivamente la versione tedesca; la presente traduzione
        serve solo a facilitarne la comprensione.
      </p>
      <section>
        <h2 id="geltung">§ 1 Ambito di applicazione e venditrice</h2>
        <ol>
          <li>Le presenti condizioni generali di vendita (CGV) si applicano a tutti gli ordini effettuati da consumatori (articolo 13 BGB) nel nostro negozio online.</li>
          <li>
            La Sua controparte contrattuale è{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo della titolare" />} (denominazione commerciale «{c.brandName}»),{" "}
            {addressLine(c)}, telefono {c.phone}, e-mail {c.email}.
          </li>
          <li>La lingua del contratto è il tedesco. Le traduzioni servono solo alla comprensione.</li>
        <li>Le presenti CGV si applicano solo ai consumatori. Saloni, parrucchieri e altri professionisti ricevono su richiesta un'offerta individuale a condizioni separate.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Conclusione del contratto</h2>
        <ol>
          <li>La presentazione dei prodotti nel negozio non costituisce un'offerta vincolante, ma un invito a effettuare un ordine. Molti pezzi sono unici.</li>
          <li>Lei inserisce i prodotti nel carrello, nel passaggio successivo indica i dati di contatto e di consegna e vede poi un riepilogo con tutti i dati e il prezzo totale. Può correggere gli errori di inserimento in qualsiasi momento prima dell'invio: con il tasto «indietro» del browser, tramite «Modifica» nel carrello o direttamente nei campi. Cliccando sul pulsante «Ordine con obbligo di pagamento» presenta un'offerta vincolante di acquisto degli articoli nel carrello.</li>
          <li>Subito dopo riceve un'e-mail automatica che conferma la ricezione dell'ordine. Questa conferma di ricezione non costituisce ancora accettazione della Sua offerta.</li>
          <li>Verifichiamo personalmente la disponibilità del pezzo. Il contratto è concluso quando accettiamo espressamente il Suo ordine per e-mail (conferma d'ordine) o spediamo la merce, a seconda di quale evento si verifichi prima. Decidiamo entro tre giorni lavorativi dal ricevimento dell'ordine. Se in tale termine non riceve l'accettazione, non è più vincolato/a al Suo ordine; eventuali pagamenti già effettuati Le saranno rimborsati senza indugio.</li>
          <li>Se un pezzo unico non è più disponibile, La informiamo senza indugio. In tal caso non viene concluso alcun contratto per tale pezzo.</li>
          <li>Con la conferma d'ordine riceve per e-mail il testo del contratto, le presenti CGV, le informazioni sul recesso e il modulo di recesso tipo.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Conservazione del testo del contratto</h2>
        <p>Conserviamo il testo del contratto (dati dell'ordine e CGV vigenti al momento dell'ordine) e glielo inviamo per e-mail. Può consultare, salvare e stampare le CGV vigenti in qualsiasi momento su questa pagina. Non offriamo un account cliente in cui consultare gli ordini passati.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Prezzi e spese di spedizione</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Tutti i prezzi sono prezzi finali. In qualità di piccola impresa ai sensi dell'articolo 19 della legge tedesca sull'IVA (UStG) non addebitiamo l'IVA e pertanto non la indichiamo.</>
            ) : c.smallBusiness === false ? (
              <>Tutti i prezzi sono prezzi finali comprensivi di IVA.</>
            ) : (
              <Missing field="smallBusiness" label="regime IVA (piccola impresa sì/no)" />
            )}
          </li>
          <li>
            Si aggiungono le spese di spedizione: in Germania {eur(ship.domesticCents)} per ordine
            {ship.freeFromCents !== null ? <>, gratuite a partire da un valore della merce di {eur(ship.freeFromCents)}</> : null}
            {ship.euCents !== null ? <>; verso altri paesi dell'Unione europea {eur(ship.euCents)} per ordine</> : null}
            . Per altri paesi Le comunichiamo le spese su richiesta prima dell'ordine. Le spese di
            spedizione sono indicate nel riepilogo prima dell'invio dell'ordine.
          </li>
          <li>Per le consegne fuori dall'Unione europea possono essere dovuti dazi, imposte e diritti, che Lei paga alle autorità competenti.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Pagamento</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="metodo di pagamento da definire" />
          </p>
        ) : (
          <>
            <p>Può pagare con i seguenti metodi. Le inviamo i dati di pagamento con la conferma d'ordine.</p>
            <ul>
              {c.payments.prepayment ? (
                <li><strong>Pagamento anticipato con bonifico:</strong> bonifichi l'importo totale entro 7 giorni dal ricevimento della conferma d'ordine. Spediamo dopo il ricevimento del pagamento. Se il pagamento non perviene nonostante un sollecito, possiamo recedere dal contratto.</li>
              ) : null}
              {c.payments.paypal ? (
                <li><strong>PayPal:</strong> dopo la conferma d'ordine riceve una richiesta di pagamento PayPal. Paghi entro 7 giorni. Si applicano inoltre le condizioni di PayPal. Spediamo dopo il ricevimento del pagamento.</li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>Pagamento rateale tramite PayPal:</strong> se PayPal Le offre questa opzione, può pagare a rate previa verifica del merito creditizio da parte di PayPal. Il credito è concluso direttamente con PayPal in qualità di finanziatore; si applicano le sue condizioni e informazioni precontrattuali. Noi non concediamo credito. Il Suo contratto di vendita con noi non ne è influenzato.</li> : null}
              {c.payments.bankTransfer ? (
                <li><strong>Fattura (bonifico dopo la consegna):</strong> l'importo va bonificato senza detrazioni entro 14 giorni dal ricevimento della merce. Possiamo rifiutare questo metodo in singoli casi, in particolare per importi elevati o spedizioni all'estero, e proporLe un altro metodo disponibile.</li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Consegna</h2>
        <ol>
          <li>
            Consegniamo in Germania
            {others.length > 0 ? <> e nei seguenti paesi: {countryNames(others, "it")}</> : null}. Le
            consegne verso altri paesi sono possibili previo accordo. La spedizione è effettuata da {carrier}.
          </li>
          <li>Tempi di consegna degli articoli disponibili in Germania: {deliveryDaysOf(c)} giorni lavorativi. Con pagamento anticipato o PayPal il termine decorre dal giorno successivo al ricevimento del pagamento, altrimenti dal giorno successivo alla conclusione del contratto. I tempi per le spedizioni all'estero Le vengono comunicati prima della conclusione del contratto.</li>
          <li>Realizziamo i pezzi su misura in circa {madeToOrderDaysOf(c)} giorni lavorativi, una volta ricevuti tutti i dati necessari e – con pagamento anticipato o PayPal – il pagamento. Le comunichiamo la data di spedizione prevista.</li>
          <li>Se la merce arriva con danni di trasporto visibili, La preghiamo di contestarli al corriere e di informarci brevemente. I Suoi diritti di legge restano invariati; la segnalazione ci aiuta a far valere i nostri diritti nei confronti del corriere.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Riserva di proprietà</h2>
        <p>La merce resta di nostra proprietà fino al pagamento completo.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Realizzazione su misura e secondo le Sue indicazioni</h2>
        <ol>
          <li>Per i prodotti contrassegnati come realizzati su misura produciamo secondo le Sue indicazioni, ad esempio circonferenza della testa, colore, densità, direzione dei capelli e base. Verifichi accuratamente i Suoi dati; li discutiamo con Lei prima di iniziare.</li>
          <li>Per i prodotti su misura non sussiste il diritto di recesso (articolo 312g, paragrafo 2, n. 1, BGB). I dettagli sono nelle informazioni sul recesso. I Suoi diritti in caso di difetti restano invariati.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Diritto di recesso</h2>
        <p>In qualità di consumatore dispone di un diritto di recesso previsto dalla legge. Condizioni, termini e procedura, eccezioni e la funzione online «Recedere dal contratto» sono descritti nelle nostre informazioni sul recesso.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Garanzia legale (responsabilità per difetti)</h2>
        <ol>
          <li>Si applicano i diritti di legge in caso di difetti (articoli 434 e seguenti BGB). Il termine per far valere i diritti per difetti è di due anni dalla consegna della merce.</li>
          <li>In caso di difetto ci contatti: {c.email}, telefono {c.phone}, oppure per posta: {addressLine(c)}.</li>
          <li>Concediamo una garanzia convenzionale aggiuntiva solo se la indichiamo espressamente per un prodotto.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Responsabilità</h2>
        <ol>
          <li>Rispondiamo senza limiti in caso di dolo e colpa grave, di lesione della vita, del corpo o della salute, ai sensi della legge tedesca sulla responsabilità per danno da prodotti e nei limiti di una garanzia prestata.</li>
          <li>In caso di violazione per colpa lieve di un obbligo il cui adempimento è essenziale per la corretta esecuzione del contratto e sul cui rispetto Lei può normalmente fare affidamento (obbligo contrattuale essenziale), la nostra responsabilità è limitata al danno prevedibile e tipico del contratto.</li>
          <li>Per il resto, la responsabilità per colpa lieve è esclusa.</li>
          <li>I Suoi diritti in caso di difetti ai sensi del § 10 restano invariati.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Prodotti per la cura, adesivi e solventi</h2>
        <p>Prima di utilizzare colle, nastri adesivi e solventi legga e segua le istruzioni e le avvertenze del produttore riportate sulla confezione e nella pagina del prodotto. Consigliamo di provare prima un nuovo prodotto su una piccola zona della pelle. Tenere questi prodotti fuori dalla portata dei bambini. Per alcuni prodotti possono valere limitazioni di spedizione; lo indichiamo nella pagina del prodotto.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Risoluzione delle controversie dei consumatori</h2>
        {c.disputeResolution === "willing" ? (
          <p>Siamo disposti a partecipare a procedure di risoluzione delle controversie dinanzi al seguente organismo: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Non siamo disposti né obbligati a partecipare a procedure di risoluzione delle controversie dinanzi a un organismo di conciliazione per i consumatori.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="decisione sulla conciliazione dei consumatori (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Legge applicabile</h2>
        <p>Si applica il diritto della Repubblica federale di Germania, con esclusione della Convenzione delle Nazioni Unite sui contratti di compravendita internazionale di merci. Se la Sua residenza abituale si trova in un altro Stato, Le resta la tutela delle norme imperative a protezione dei consumatori di tale Stato (articolo 6, paragrafo 2, regolamento Roma I).</p>
        <p>
          Ultimo aggiornamento: {c.effectiveDate ?? <Missing field="effectiveDate" label="data di entrata in vigore delle CGV" />}
        </p>
      </section>
    </>
  );
}
