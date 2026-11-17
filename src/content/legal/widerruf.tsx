import { type Company, addressLine } from "./company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Angabe fehlt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? (
    <>{c.withdrawalUrl}</>
  ) : (
    <>unserer Website über die Schaltfläche „Vertrag widerrufen“ am Ende jeder Seite</>
  );
  return (
    <>
      <section>
        <h2 id="widerrufsbelehrung">1. Widerrufsbelehrung</h2>
        <h3 id="widerrufsrecht">Widerrufsrecht</h3>
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p>
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
          benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw.
          hat. Haben Sie mehrere Waren im Rahmen einer einheitlichen Bestellung bestellt, die
          getrennt geliefert werden, beträgt die Widerrufsfrist vierzehn Tage ab dem Tag, an dem Sie
          oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in
          Besitz genommen haben bzw. hat.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="vollständiger Name der Inhaberin" />}, {c.brandName},{" "}
          {addressLine(c)}, Telefon {c.phone}, E-Mail {c.withdrawalEmail}) mittels einer eindeutigen
          Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss,
          diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte
          Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Sie können Ihr Widerrufsrecht auch online unter {where} ausüben. Wenn Sie diese
          Online-Funktion nutzen, übermitteln wir Ihnen auf einem dauerhaften Datenträger (z. B.
          durch eine E-Mail) unverzüglich eine Eingangsbestätigung mit Informationen zum Inhalt der
          Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung
          des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>

        <h3 id="folgen">Folgen des Widerrufs</h3>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
          erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
          sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn
          Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags
          bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das
          Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
          ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
          Rückzahlung Entgelte berechnet. Wir können die Rückzahlung verweigern, bis wir die Waren
          wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren
          zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.
        </p>
        <p>
          Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab
          dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns
          zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der
          Frist von vierzehn Tagen absenden.
        </p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Wir tragen die Kosten der Rücksendung der Waren.</>
          ) : c.returnCosts === "customer" ? (
            <>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</>
          ) : (
            <Missing field="returnCosts" label="Wer trägt die Rücksendekosten? (Entscheidung der Inhaberin)" />
          )}
        </p>
        <p>
          Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
          Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der
          Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
        </p>

        <h3 id="ausschluss">Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts</h3>
        <p>Das Widerrufsrecht besteht nicht bei Verträgen</p>
        <ul>
          <li>
            zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine
            individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die
            eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind. Das
            betrifft bei uns alle als Maßanfertigung gekennzeichneten Produkte, zum Beispiel die
            maßgefertigte Haarprothese. Gleiches gilt für Extensions, die wir nach Ihren Vorgaben färben, zuschneiden oder anfertigen.</li>
        </ul>
        <p>Das Widerrufsrecht erlischt vorzeitig bei Verträgen</p>
        <ul>
          <li>
            zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der
            Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung
            entfernt wurde. Das betrifft nur Produkte, die wir versiegelt liefern und auf der
            Produktseite entsprechend kennzeichnen.
          </li>
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
        <h2 id="online-widerruf">3. So funktioniert der Widerruf über unsere Website</h2>
        <ol>
          <li>Klicken Sie auf „Vertrag widerrufen“. Die Schaltfläche steht während der Widerrufsfrist auf jeder Seite unserer Website.</li>
          <li>Geben Sie Ihren Namen, Ihre Bestellnummer oder andere Angaben zur Bestellung und die E-Mail-Adresse an, an die wir die Eingangsbestätigung senden sollen. Sie können auch nur einzelne Artikel einer Bestellung widerrufen.</li>
          <li>Prüfen Sie die Angaben und klicken Sie auf „Widerruf bestätigen“.</li>
          <li>Wir senden Ihnen unverzüglich per E-Mail eine Eingangsbestätigung mit dem Inhalt Ihrer Erklärung sowie Datum und Uhrzeit des Eingangs.</li>
        </ol>
        <p>
          Die Eingangsbestätigung bestätigt nur, dass Ihre Erklärung bei uns angekommen ist. Ob
          für einen Artikel eine Ausnahme vom Widerrufsrecht gilt, teilen wir Ihnen gesondert mit.
        </p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Hinweise zur Rücksendung</h2>
        <p>
          Bitte senden Sie die Ware an: {c.brandName}, {addressLine(c)}. Sie erleichtern uns die
          Bearbeitung, wenn Sie die Ware gut geschützt – möglichst in der Originalverpackung –
          zurückschicken und die Bestellnummer beilegen. Das ist keine Voraussetzung für einen
          wirksamen Widerruf. Haarteile dürfen Sie wie im Geschäft vorsichtig anprobieren; bitte
          schneiden, färben, waschen oder kleben Sie sie vor Ablauf der Widerrufsfrist nicht, sonst
          kann ein Wertverlust entstehen, für den Sie nach der Widerrufsbelehrung aufkommen müssen.
        </p>
      </section>
    </>
  );
}
