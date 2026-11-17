import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Dato mancante: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>il nostro sito, tramite il pulsante «Recedere dal contratto» in fondo a ogni pagina</>;
  return (
    <>
      <p>
        <strong>Nota:</strong> Fa fede esclusivamente la versione tedesca; la presente traduzione
        serve solo a facilitarne la comprensione.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Informazioni sul diritto di recesso</h2>
        <h3 id="widerrufsrecht">Diritto di recesso</h3>
        <p>Ha il diritto di recedere dal contratto, senza indicarne le ragioni, entro 14 giorni.</p>
        <p>Il periodo di recesso scade dopo 14 giorni dal giorno in cui Lei o un terzo, diverso dal vettore e da Lei designato, acquisisce il possesso fisico dei beni. Se ha ordinato più beni con un unico ordine e questi vengono consegnati separatamente, il periodo scade dopo 14 giorni dal giorno in cui Lei o un terzo, diverso dal vettore e da Lei designato, acquisisce il possesso fisico dell'ultimo bene.</p>
        <p>
          Per esercitare il diritto di recesso, Lei è tenuto a informarci (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nome completo della titolare" />}, {c.brandName},{" "}
          {addressLine(c)}, telefono {c.phone}, e-mail {c.withdrawalEmail}) della Sua decisione di
          recedere dal presente contratto tramite una dichiarazione esplicita (ad esempio lettera
          inviata per posta o posta elettronica). A tal fine può utilizzare il modulo tipo di recesso
          allegato, ma non è obbligatorio.
        </p>
        <p>Può esercitare il diritto di recesso anche online su {where}. Se utilizza questa funzione online, Le trasmetteremo senza indugio, su un supporto durevole (ad esempio per e-mail), una conferma di ricezione con informazioni sul contenuto della dichiarazione di recesso e sulla data e l'ora della sua ricezione.</p>
        <p>Per rispettare il termine di recesso, è sufficiente che Lei invii la comunicazione relativa all'esercizio del diritto di recesso prima della scadenza del periodo di recesso.</p>

        <h3 id="folgen">Effetti del recesso</h3>
        <p>Se Lei recede dal presente contratto, Le saranno rimborsati tutti i pagamenti che ha effettuato a nostro favore, compresi i costi di consegna (ad eccezione dei costi supplementari derivanti dalla Sua eventuale scelta di un tipo di consegna diverso dal tipo meno costoso di consegna standard da noi offerto), senza indebito ritardo e in ogni caso non oltre 14 giorni dal giorno in cui siamo informati della Sua decisione di recedere dal presente contratto. Detti rimborsi saranno effettuati utilizzando lo stesso mezzo di pagamento da Lei usato per la transazione iniziale, salvo che Lei non abbia espressamente convenuto altrimenti; in ogni caso, non dovrà sostenere alcun costo quale conseguenza di tale rimborso. Il rimborso può essere sospeso fino al ricevimento dei beni oppure fino all'avvenuta dimostrazione da parte Sua di aver rispedito i beni, se precedente.</p>
        <p>È pregato di rispedire i beni o di consegnarli a noi senza indebiti ritardi e in ogni caso entro 14 giorni dal giorno in cui ci ha comunicato il Suo recesso dal presente contratto. Il termine è rispettato se Lei rispedisce i beni prima della scadenza del periodo di 14 giorni.</p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Sosterremo noi il costo della restituzione dei beni.</>
          ) : c.returnCosts === "customer" ? (
            <>I costi diretti della restituzione dei beni saranno a Suo carico.</>
          ) : (
            <Missing field="returnCosts" label="chi sostiene i costi di restituzione (decisione della titolare)" />
          )}
        </p>
        <p>Lei è responsabile unicamente della diminuzione del valore dei beni risultante da una manipolazione dei beni diversa da quella necessaria per stabilire la natura, le caratteristiche e il funzionamento dei beni.</p>

        <h3 id="ausschluss">Esclusione o estinzione anticipata del diritto di recesso</h3>
        <p>Il diritto di recesso è escluso per i contratti</p>
        <ul>
          <li>di fornitura di beni non prefabbricati, per la cui realizzazione è determinante una scelta o una specificazione individuale del consumatore, o chiaramente personalizzati in base alle sue esigenze. Da noi ciò riguarda tutti i prodotti contrassegnati come realizzati su misura, ad esempio la protesi capillare su misura.</li>
        </ul>
        <p>Il diritto di recesso si estingue anticipatamente per i contratti</p>
        <ul>
          <li>di fornitura di beni sigillati che non si prestano a essere restituiti per motivi igienici o connessi alla protezione della salute e che sono stati aperti dopo la consegna. Ciò riguarda solo i prodotti che consegniamo sigillati e contrassegniamo come tali nella pagina del prodotto.</li>
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
        <h2 id="online-widerruf">3. Come recedere tramite il nostro sito</h2>
        <ol>
          <li>Clicchi su «Recedere dal contratto». Il pulsante è presente su ogni pagina del sito durante il periodo di recesso.</li>
          <li>Indichi nome, numero d'ordine o altri dati dell'ordine e l'indirizzo e-mail a cui inviare la conferma di ricezione. Può recedere anche solo da singoli articoli di un ordine.</li>
          <li>Controlli i dati e clicchi su «Conferma recesso».</li>
          <li>Le inviamo senza indugio per e-mail una conferma di ricezione con il contenuto della Sua dichiarazione e la data e l'ora di ricezione.</li>
        </ol>
        <p>La conferma attesta solo che la Sua dichiarazione ci è pervenuta. Se per un articolo vale un'eccezione al diritto di recesso, La informiamo separatamente.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Indicazioni per la restituzione</h2>
        <p>Invii la merce a: {c.brandName}, {addressLine(c)}. Ci facilita il lavoro se la restituisce ben protetta – possibilmente nell'imballaggio originale – con il numero d'ordine. Non è una condizione per la validità del recesso. Può provare con cura i pezzi capillari come in negozio; non li tagli, tinga, lavi o incolli prima della scadenza del periodo di recesso, altrimenti può derivarne una diminuzione di valore di cui risponde secondo le informazioni sul recesso.</p>
      </section>
    </>
  );
}
