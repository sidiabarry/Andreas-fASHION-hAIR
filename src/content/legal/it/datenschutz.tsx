import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato mancante: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="corriere" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Nota:</strong> Fa fede esclusivamente la versione tedesca; la presente traduzione
        serve solo a facilitarne la comprensione.
      </p>
      <section>
        <h2 id="ueberblick">1. In sintesi</h2>
        <ul>
          <li>Questo sito non utilizza cookie, strumenti di analisi né tracker pubblicitari.</li>
          <li>Caratteri e video sono ospitati sul nostro server. La visita del sito non trasmette dati a Google, YouTube, Meta o fornitori simili.</li>
          <li>Trattiamo i Suoi dati solo per gestire l'ordine o la richiesta, adempiere obblighi di legge e – solo con il Suo consenso – inviarLe la newsletter.</li>
          <li>La preghiamo di non comunicarci dati sanitari (vedi sezione 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Titolare del trattamento</h2>
        <p>Titolare del trattamento ai sensi del Regolamento generale sulla protezione dei dati (GDPR) è:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo della titolare" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Telefono: {c.phone}
          <br />
          E-mail: {c.email}
        </p>
        <p>Non siamo obbligati per legge a nominare un responsabile della protezione dei dati. Per qualsiasi domanda può contattarci ai recapiti indicati.</p>
      </section>

      <section>
        <h2 id="hosting">3. Hosting e file di log</h2>
        <p>Il nostro sito è ospitato da {c.hostingProvider.name}, {c.hostingProvider.address}. A ogni visita il server tratta i dati tecnicamente necessari che il Suo browser invia automaticamente: indirizzo IP, data e ora, pagina richiesta, quantità di dati trasferiti, codice di stato, URL di provenienza e informazioni su browser e sistema operativo.</p>
        <p>Questi dati servono a fornire il sito, garantirne la sicurezza e respingere attacchi. La base giuridica è l'articolo 6, paragrafo 1, lettera f), GDPR; il nostro legittimo interesse è un sito sicuro e funzionante. Non analizziamo i log a fini statistici o di marketing e non li combiniamo con altri dati. Il fornitore conserva i log solo per un breve periodo tecnicamente necessario e poi li cancella automaticamente.</p>
        <p>Con il fornitore abbiamo stipulato un accordo sul trattamento dei dati ai sensi dell'articolo 28 GDPR. Per i trasferimenti verso gli Stati Uniti si veda la sezione 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Memorizzazione nel browser (nessun cookie, nessun tracciamento)</h2>
        <p>Per conservare il carrello durante la navigazione, salviamo gli articoli selezionati nella memoria locale del browser (localStorage). Queste informazioni restano sul Suo dispositivo e ci vengono trasmesse solo quando invia un ordine. Può cancellarle in qualsiasi momento svuotando il carrello o i dati del sito nel browser.</p>
        <p>Questa memorizzazione è strettamente necessaria per fornire il carrello da Lei espressamente richiesto. Non è quindi necessario il consenso ai sensi dell'articolo 25, paragrafo 2, n. 2, della legge tedesca TDDDG. Se sono coinvolti dati personali, la base giuridica è l'articolo 6, paragrafo 1, lettera b), GDPR (misure precontrattuali).</p>
      </section>

      <section>
        <h2 id="inhalte">5. Caratteri, immagini e video</h2>
        <p>Tutti i caratteri, le foto e i video sono forniti dal nostro hosting. Non vengono caricati contenuti di terzi (ad esempio Google Fonts, YouTube o Vimeo).</p>
      </section>

      <section>
        <h2 id="anfragen">6. Contatto, consulenza e richieste</h2>
        <p>Quando ci contatta tramite modulo, e-mail o telefono – ad esempio per una consulenza, una realizzazione su misura o una richiesta per saloni – trattiamo i dati che ci comunica (di norma nome, indirizzo e-mail, eventualmente telefono e il Suo messaggio).</p>
        <p>La finalità è gestire la Sua richiesta. La base giuridica è l'articolo 6, paragrafo 1, lettera b), GDPR se la richiesta riguarda un contratto, altrimenti la lettera f) (nostro legittimo interesse a rispondere). Cancelliamo le richieste una volta evase se non ne deriva un contratto, al più tardi 12 mesi dopo l'ultimo contatto. Se viene concluso un contratto, valgono i termini della sezione 15.</p>
        <p>Salviamo i dati dei moduli nel nostro database e usiamo un servizio di invio e-mail per le notifiche (vedi sezione 12).</p>
        {gmail ? (
          <p>La nostra casella di posta è fornita da {GOOGLE_IRELAND} (Gmail). Le e-mail che ci invia e le nostre risposte sono quindi archiviate su server di Google; i dati possono essere trasferiti negli Stati Uniti (vedi sezione 13).</p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Contatto tramite WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>Se lo desidera, può scriverci anche tramite WhatsApp. Il fornitore è {WHATSAPP_IRELAND}. WhatsApp fa parte del gruppo Meta; i dati possono essere trasferiti negli Stati Uniti. WhatsApp tratta sotto la propria responsabilità il Suo numero di telefono, il profilo, i metadati della comunicazione (ad esempio l'ora) e – a seconda delle impostazioni – la rubrica. Per i dettagli si veda l'informativa privacy di WhatsApp.</p>
            <p>Utilizziamo i messaggi solo per rispondere alla Sua richiesta (articolo 6, paragrafo 1, lettere b) o f), GDPR) e cancelliamo le chat una volta evase, al più tardi dopo 12 mesi. Può sempre contattarci per e-mail o telefono. Non ci invii dati sanitari tramite WhatsApp.</p>
          </>
        ) : (
          <p>Al momento non offriamo contatti tramite servizi di messaggistica.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Per favore, nessun dato sanitario</h2>
        <p>Molte nostre clienti e molti nostri clienti portano protesi capillari per motivi di salute. Non abbiamo bisogno di conoscere tali motivi per consulenza, ordine o realizzazione su misura. I nostri moduli non chiedono dati sanitari e La preghiamo di non comunicarci informazioni su malattie, terapie o diagnosi. Per un pezzo su misura bastano circonferenza della testa, colore, lunghezza e acconciatura desiderata.</p>
        <p>Se ci comunica comunque dati sanitari, si tratta di categorie particolari di dati ai sensi dell'articolo 9 GDPR. Non li utilizziamo e li cancelliamo non appena li notiamo, salvo che ci servano eccezionalmente per rispondere alla Sua richiesta. In tal caso Le chiederemo prima il consenso esplicito (articolo 9, paragrafo 2, lettera a), GDPR), revocabile in qualsiasi momento.</p>
      </section>

      <section>
        <h2 id="bestellung">9. Ordini ed esecuzione del contratto</h2>
        <p>Per il Suo ordine trattiamo nome, indirizzi di consegna e fatturazione, e-mail, eventualmente telefono, articoli ordinati, prezzi, informazioni su pagamento e spedizione e il Suo messaggio. I campi obbligatori sono contrassegnati; senza di essi non possiamo concludere né eseguire il contratto.</p>
        <p>Le basi giuridiche sono l'articolo 6, paragrafo 1, lettera b), GDPR (misure precontrattuali ed esecuzione del contratto) e, per la conservazione di fatture e documenti contabili, la lettera c) in combinato con gli obblighi fiscali e commerciali (vedi sezione 15).</p>
        <p>Per la consegna comunichiamo nome e indirizzo di consegna al corriere {carrier}. Comunichiamo al corriere il Suo indirizzo e-mail o telefono solo se vi ha acconsentito espressamente durante l'ordine, affinché possa informarLa sulla consegna (articolo 6, paragrafo 1, lettera a), GDPR). Può revocare il consenso in qualsiasi momento con effetto per il futuro.</p>
      </section>

      <section>
        <h2 id="zahlung">10. Pagamento</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>In caso di pagamento con bonifico trattiamo i dati che riceviamo con il bonifico (nome, coordinate bancarie, importo, causale) per abbinarlo al Suo ordine (articolo 6, paragrafo 1, lettere b) e c), GDPR). La Sua banca e la nostra trattano i dati sotto la propria responsabilità.</p>
        ) : null}
        {c.payments.paypal ? (
          <p>Se paga con PayPal, trasmettiamo i dati necessari al pagamento (nome, e-mail, importo, numero d'ordine, eventualmente indirizzo di consegna) a {PAYPAL_EUROPE}. PayPal tratta tali dati come titolare autonomo, tra l'altro per la prevenzione delle frodi ed eventualmente per verifiche di solvibilità; possono verificarsi trasferimenti verso paesi terzi. La base giuridica della nostra trasmissione è l'articolo 6, paragrafo 1, lettera b), GDPR. I Suoi diritti nei confronti di PayPal sono indicati nella sua informativa: https://www.paypal.com/it/legalhub/privacy-full.</p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="metodo di pagamento da definire" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Recesso tramite il nostro sito</h2>
        <p>Se recede da un contratto tramite la nostra funzione di recesso («Recedere dal contratto»), trattiamo nome, dati dell'ordine, indirizzo e-mail e data e ora di ricezione. Le inviamo una conferma di ricezione per e-mail e gestiamo il recesso. La base giuridica è l'articolo 6, paragrafo 1, lettera c), GDPR in combinato con l'articolo 356a del Codice civile tedesco (BGB), nonché la lettera b).</p>
      </section>

      <section>
        <h2 id="dienstleister">12. Fornitori (responsabili del trattamento)</h2>
        <p>Ci avvaliamo di fornitori accuratamente selezionati che trattano i dati solo su nostra istruzione. Con loro abbiamo stipulato accordi ai sensi dell'articolo 28 GDPR.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – hosting del sito
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – casella di posta (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; luogo del trattamento: {p.country}; base del trasferimento: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Trasferimenti verso paesi terzi</h2>
        <p>Alcuni fornitori hanno sede negli Stati Uniti o possono trattare dati lì. Per gli Stati Uniti la Commissione europea ha adottato il 10 luglio 2023 una decisione di adeguatezza (EU-US Data Privacy Framework). I trasferimenti verso imprese certificate si basano sull'articolo 45 GDPR. In aggiunta, o per destinatari non certificati, abbiamo concordato le clausole contrattuali tipo della Commissione europea (articolo 46, paragrafo 2, lettera c), GDPR). Può richiederci una copia. La base applicabile è indicata nell'elenco della sezione 12.</p>
      </section>

      <section>
        <h2 id="newsletter">14. Newsletter</h2>
        <p>Riceve la newsletter solo se si iscrive espressamente. Dopo l'iscrizione Le inviamo un'e-mail con un link di conferma (double opt-in). Solo dopo il clic La aggiungiamo alla lista. Le iscrizioni non confermate vengono cancellate dopo 30 giorni.</p>
        <p>Salviamo l'indirizzo e-mail e i momenti di iscrizione e conferma per poter dimostrare il consenso. La base giuridica è il Suo consenso (articolo 6, paragrafo 1, lettera a), GDPR, articolo 7, paragrafo 2, n. 2, della legge tedesca contro la concorrenza sleale – UWG); conserviamo la prova sulla base dell'articolo 6, paragrafo 1, lettera c), in combinato con l'articolo 7, paragrafo 1, GDPR. Non misuriamo aperture né clic.</p>
        <p>Può annullare l'iscrizione in qualsiasi momento tramite il link in ogni invio o scrivendo a {c.email}. Cancelliamo quindi l'indirizzo dalla lista; conserviamo la prova del consenso fino a tre anni dopo la fine dell'anno della disiscrizione per poterci difendere da eventuali pretese.</p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Periodi di conservazione</h2>
        <ul>
          <li>Conserviamo i dati contrattuali fino alla completa esecuzione del contratto e alla scadenza della garanzia legale di due anni.</li>
          <li>Conserviamo fatture e documenti contabili per otto anni (articolo 147, paragrafi 1 e 3, del Codice tributario tedesco, AO).</li>
          <li>Conserviamo la corrispondenza commerciale, ad esempio le conferme d'ordine, per sei anni (articolo 147, paragrafi 1 e 3, AO).</li>
          <li>I termini decorrono dalla fine dell'anno solare in cui il documento è stato creato. In questo periodo limitiamo il trattamento alla conservazione.</li>
          <li>Cancelliamo tutti gli altri dati non appena non sono più necessari; i termini sono indicati nelle singole sezioni.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Link esterni e social media</h2>
        <p>Rimandiamo ai nostri profili Instagram e Facebook e a WhatsApp. Si tratta di semplici link, non di plug-in integrati: la sola visita del nostro sito non trasmette dati a questi fornitori.</p>
        <p>Solo cliccando su un link si apre la pagina del fornitore, che tratta i Suoi dati sotto la propria responsabilità. Il fornitore di Instagram e Facebook è {META_IRELAND}; quello di WhatsApp è {WHATSAPP_IRELAND}. I dati possono essere trasferiti negli Stati Uniti. Si vedano le informative dei fornitori.</p>
      </section>

      <section>
        <h2 id="rechte">17. I Suoi diritti</h2>
        <p>Lei ha i seguenti diritti sui Suoi dati:</p>
        <ul>
          <li>Accesso (articolo 15 GDPR)</li>
          <li>Rettifica (articolo 16 GDPR)</li>
          <li>Cancellazione (articolo 17 GDPR)</li>
          <li>Limitazione del trattamento (articolo 18 GDPR)</li>
          <li>Portabilità (articolo 20 GDPR)</li>
          <li>Revoca del consenso con effetto per il futuro (articolo 7, paragrafo 3, GDPR); il trattamento effettuato fino ad allora resta lecito</li>
        </ul>
        <p>
          <strong>Diritto di opposizione (articolo 21 GDPR):</strong> Se trattiamo dati sulla base
          dell'articolo 6, paragrafo 1, lettera f), GDPR, può opporsi in qualsiasi momento per motivi
          connessi alla Sua situazione particolare. Smetteremo di trattarli salvo motivi legittimi
          cogenti o necessità di accertare, esercitare o difendere un diritto in sede giudiziaria.
          Dopo un'opposizione non Le invieremo mai più pubblicità.
        </p>
        <p>Per ogni richiesta basta un messaggio informale a {c.email}.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Diritto di reclamo</h2>
        <p>Può proporre reclamo a un'autorità di controllo (articolo 77 GDPR), ad esempio nel luogo in cui risiede. L'autorità competente per noi è:</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Sicurezza, decisioni automatizzate, modifiche</h2>
        <p>La connessione al nostro sito è cifrata con TLS (riconoscibile da «https://»). Non adottiamo decisioni automatizzate né effettuiamo profilazione ai sensi dell'articolo 22 GDPR. Aggiorniamo la presente informativa quando cambiano il sito o la normativa.</p>
        <p>
          Ultimo aggiornamento: {c.effectiveDate ?? <Missing field="effectiveDate" label="data di entrata in vigore" />}
        </p>
      </section>
    </>
  );
}
