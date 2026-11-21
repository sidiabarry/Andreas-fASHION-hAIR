import { type Company, countryNames, UNIVERSAL_ADR, addressLine, anyPayment, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "./company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Angabe fehlt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const carrier = c.carrier ?? <Missing field="carrier" label="Versanddienstleister" />;
  return (
    <>
      <section>
        <h2 id="geltung">§ 1 Geltungsbereich und Anbieterin</h2>
        <ol>
          <li>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die
            Verbraucherinnen und Verbraucher (§ 13 BGB) über unseren Onlineshop aufgeben.
          </li>
          <li>
            Ihre Vertragspartnerin ist{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="vollständiger Name der Inhaberin" />} (Geschäftsbezeichnung „{c.brandName}“),{" "}
            {addressLine(c)}, Telefon {c.phone}, E-Mail {c.email}.
          </li>
          <li>Vertragssprache ist Deutsch. Übersetzungen dienen nur dem Verständnis.</li>
        <li>Diese AGB gelten nur für Verbraucherinnen und Verbraucher. Salons, Friseurbetriebe und andere Unternehmer erhalten auf Anfrage ein individuelles Angebot zu gesonderten Bedingungen.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Vertragsschluss</h2>
        <ol>
          <li>
            Die Darstellung der Produkte im Onlineshop ist kein verbindliches Angebot, sondern eine
            Einladung, eine Bestellung aufzugeben. Viele Stücke sind Einzelstücke und nur einmal
            vorhanden.
          </li>
          <li>
            Sie legen Produkte in den Warenkorb, geben im nächsten Schritt Ihre Kontakt- und
            Lieferdaten ein und sehen anschließend eine Übersicht mit allen Angaben und dem
            Gesamtpreis. Eingabefehler können Sie vor dem Absenden jederzeit korrigieren: mit dem
            Zurück-Button Ihres Browsers, über „Ändern“ im Warenkorb oder direkt in den
            Eingabefeldern. Mit einem Klick auf die Schaltfläche „Zahlungspflichtig bestellen“
            geben Sie ein verbindliches Angebot zum Kauf der Waren im Warenkorb ab.
          </li>
          <li>
            Unmittelbar danach erhalten Sie eine automatische E-Mail, dass Ihre Bestellung
            eingegangen ist. Diese Eingangsbestätigung ist noch keine Annahme Ihres Angebots.
          </li>
          <li>
            Wir prüfen persönlich, ob das Stück verfügbar ist. Der Vertrag kommt zustande, wenn wir
            Ihre Bestellung per E-Mail ausdrücklich annehmen (Auftragsbestätigung) oder die Ware an
            Sie absenden – je nachdem, was zuerst geschieht. Wir entscheiden innerhalb von drei
            Werktagen nach Eingang der Bestellung. Erhalten Sie in dieser Frist keine Annahme, sind
            Sie nicht mehr an Ihre Bestellung gebunden; bereits geleistete Zahlungen erstatten wir
            Ihnen unverzüglich.
          </li>
          <li>
            Ist ein Einzelstück nicht mehr verfügbar, informieren wir Sie unverzüglich. Ein Vertrag
            über dieses Stück kommt dann nicht zustande.
          </li>
          <li>
            Mit der Auftragsbestätigung erhalten Sie den Vertragstext mit diesen AGB, der
            Widerrufsbelehrung und dem Muster-Widerrufsformular per E-Mail.
          </li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Speicherung des Vertragstextes</h2>
        <p>
          Wir speichern den Vertragstext (Ihre Bestelldaten und die zum Zeitpunkt der Bestellung
          gültigen AGB) und senden ihn Ihnen per E-Mail zu. Die jeweils aktuellen AGB können Sie
          jederzeit auf dieser Seite abrufen, speichern und ausdrucken. Ein Kundenkonto, in dem
          frühere Bestellungen einsehbar wären, bieten wir nicht an.
        </p>
      </section>

      <section>
        <h2 id="preise">§ 4 Preise und Versandkosten</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>
                Alle Preise sind Endpreise. Als Kleinunternehmerin im Sinne von § 19
                Umsatzsteuergesetz berechnen wir keine Umsatzsteuer und weisen sie daher auch nicht
                aus.
              </>
            ) : c.smallBusiness === false ? (
              <>Alle Preise sind Endpreise und enthalten die gesetzliche Umsatzsteuer.</>
            ) : (
              <Missing field="smallBusiness" label="Umsatzsteuer-Status (Kleinunternehmerin ja/nein)" />
            )}
          </li>
          <li>
            Hinzu kommen Versandkosten: innerhalb Deutschlands {euro(ship.domesticCents)} je
            Bestellung
            {ship.freeFromCents !== null ? <>, ab einem Warenwert von {euro(ship.freeFromCents)} versandkostenfrei</> : null}
            {ship.euCents !== null ? <>; in andere Länder der Europäischen Union {euro(ship.euCents)} je Bestellung</> : null}
            . Versandkosten für andere Länder nennen wir Ihnen vor der Bestellung auf Anfrage. Die
            Versandkosten sehen Sie vor dem Absenden der Bestellung in der Bestellübersicht.
          </li>
          <li>
            Bei Lieferungen in Länder außerhalb der Europäischen Union können Zölle, Steuern und
            Gebühren anfallen, die Sie an die zuständigen Stellen zahlen.
          </li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Zahlung</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="Zahlungsart noch festzulegen" />
          </p>
        ) : (
          <>
            <p>Sie können mit den folgenden Zahlungsarten bezahlen. Die Zahlungsdaten finden Sie direkt nach Ihrer Bestellung auf der Bestellbestätigung; außerdem senden wir sie mit der Auftragsbestätigung.</p>
            <ul>
              {c.payments.prepayment ? (
                <li>
                  <strong>Vorkasse per Überweisung:</strong> Sie können den Gesamtbetrag sofort nach Ihrer
                  Bestellung überweisen, spätestens innerhalb von 7 Tagen nach Erhalt der Auftragsbestätigung. Wir versenden die Ware
                  nach Zahlungseingang. Geht die Zahlung trotz Erinnerung nicht ein, können wir vom
                  Vertrag zurücktreten.
                </li>
              ) : null}
              {c.payments.paypal ? (
                <li>
                  <strong>PayPal:</strong> Nach der Auftragsbestätigung erhalten Sie eine
                  Zahlungsaufforderung von PayPal. Bitte bezahlen Sie innerhalb von 7 Tagen. Für die
                  Zahlung gelten zusätzlich die Bedingungen von PayPal. Wir versenden nach
                  Zahlungseingang.
                </li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>Ratenzahlung über PayPal:</strong> Wenn PayPal Ihnen diese Option anbietet, können Sie den Betrag nach einer Bonitätsprüfung durch PayPal in Raten zahlen. Den Ratenkredit schließen Sie direkt mit PayPal als Kreditgeber; es gelten dessen Bedingungen und vorvertragliche Informationen. Wir selbst gewähren keinen Kredit. Ihr Kaufvertrag mit uns bleibt davon unberührt.</li> : null}
              {c.payments.bankTransfer ? (
                <li>
                  <strong>Rechnung (Überweisung nach Erhalt der Ware):</strong> Der Rechnungsbetrag
                  ist innerhalb von 14 Tagen nach Erhalt der Ware ohne Abzug zu überweisen. Wir
                  können diese Zahlungsart im Einzelfall, insbesondere bei hohen Bestellwerten oder
                  bei Lieferungen ins Ausland, ablehnen und Ihnen stattdessen eine andere
                  angebotene Zahlungsart vorschlagen.
                </li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Lieferung</h2>
        <ol>
          <li>
            Wir liefern innerhalb Deutschlands
            {c.shippingCountries.filter((x) => x !== "DE").length > 0 ? (
              <> sowie in folgende Länder: {countryNames(c.shippingCountries.filter((x) => x !== "DE"))}</>
            ) : null}
            . Lieferungen in andere Länder sind nach vorheriger Absprache möglich. Der Versand
            erfolgt mit {carrier}.
          </li>
          <li>Lieferzeit für lagernde Ware innerhalb Deutschlands: {deliveryDaysOf(c)} Werktage. Die Frist beginnt bei Zahlung per Vorkasse oder PayPal am Tag nach Zahlungseingang, sonst am Tag nach Vertragsschluss. Die Lieferzeit für Sendungen ins Ausland teilen wir Ihnen vor Vertragsschluss mit.</li>
          <li>
            Maßanfertigungen sind innerhalb Deutschlands in {madeToOrderDaysOf(c)} Werktagen bei Ihnen. Die Frist beginnt am Tag, nachdem alle für die Anfertigung nötigen Angaben bei uns vorliegen und – bei Vorkasse oder PayPal – die Zahlung eingegangen ist. Die Lieferzeit für Sendungen ins Ausland teilen wir Ihnen vor Vertragsschluss mit.
          </li>
          <li>
            Kommt die Ware mit äußerlich erkennbaren Transportschäden an, bitten wir Sie, dies beim
            Zusteller zu reklamieren und uns kurz zu informieren. Ihre gesetzlichen Rechte bleiben
            davon unberührt; die Meldung hilft uns, Ansprüche gegenüber dem Versanddienstleister
            geltend zu machen.
          </li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Eigentumsvorbehalt</h2>
        <p>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Maßanfertigung und Anfertigung nach Ihren Wünschen</h2>
        <ol>
          <li>
            Bei Produkten, die als Maßanfertigung gekennzeichnet sind, fertigen wir nach Ihren
            Angaben, zum Beispiel zu Kopfmaß, Haarfarbe, Dichte, Haarrichtung und Basis. Bitte prüfen
            Sie Ihre Angaben sorgfältig; wir besprechen sie vor Beginn der Fertigung mit Ihnen.
          </li>
          <li>
            Für Maßanfertigungen besteht kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB). Einzelheiten
            finden Sie in der Widerrufsbelehrung. Ihre Rechte bei Mängeln bleiben unberührt.
          </li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Widerrufsrecht</h2>
        <p>
          Als Verbraucherin oder Verbraucher haben Sie ein gesetzliches Widerrufsrecht. Bedingungen,
          Fristen und Verfahren, Ausnahmen und die Online-Widerrufsfunktion „Vertrag widerrufen“
          sind in unserer Widerrufsbelehrung beschrieben.
        </p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Gewährleistung (Mängelhaftung)</h2>
        <ol>
          <li>
            Es gelten die gesetzlichen Rechte bei Mängeln (§§ 434 ff. BGB). Die Frist für Ansprüche
            wegen Mängeln beträgt zwei Jahre ab Ablieferung der Ware.
          </li>
          <li>
            Wenden Sie sich bei einem Mangel bitte an uns: {c.email}, Telefon {c.phone}, oder per
            Post an {addressLine(c)}.
          </li>
          <li>
            Eine zusätzliche Garantie geben wir nur, wenn wir sie bei einem Produkt ausdrücklich
            angeben.
          </li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Haftung</h2>
        <ol>
          <li>
            Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung des
            Lebens, des Körpers oder der Gesundheit, nach dem Produkthaftungsgesetz sowie im Umfang
            einer übernommenen Garantie.
          </li>
          <li>
            Bei leicht fahrlässiger Verletzung einer Pflicht, deren Erfüllung die ordnungsgemäße
            Durchführung des Vertrags erst ermöglicht und auf deren Einhaltung Sie regelmäßig
            vertrauen dürfen (wesentliche Vertragspflicht), ist unsere Haftung auf den
            vorhersehbaren, vertragstypischen Schaden begrenzt.
          </li>
          <li>Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.</li>
          <li>Ihre Rechte bei Mängeln nach § 10 bleiben von diesen Regelungen unberührt.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Pflege-, Klebe- und Lösungsmittelprodukte</h2>
        <p>
          Bitte lesen Sie vor der Anwendung von Klebern, Klebebändern und Lösungsmitteln die
          Gebrauchs- und Warnhinweise des Herstellers auf der Verpackung und auf der Produktseite
          und befolgen Sie sie. Wir empfehlen, ein neues Produkt zunächst an einer kleinen
          Hautstelle zu testen. Bewahren Sie diese Produkte für Kinder unzugänglich auf. Für
          einzelne Produkte können Versandbeschränkungen bestehen; wir weisen darauf auf der
          Produktseite hin.
        </p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Verbraucherstreitbeilegung</h2>
        {c.disputeResolution === "willing" ? (
          <p>
            Wir sind bereit, an Streitbeilegungsverfahren vor folgender Verbraucherschlichtungsstelle
            teilzunehmen: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.
          </p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="Entscheidung zur Teilnahme an Verbraucherschlichtung (§ 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Anwendbares Recht</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          Haben Sie Ihren gewöhnlichen Aufenthalt in einem anderen Staat, bleibt Ihnen der Schutz
          durch die zwingenden Verbraucherschutzvorschriften dieses Staates erhalten (Art. 6 Abs. 2
          Rom-I-Verordnung).
        </p>
        <p>
          Stand: {c.effectiveDate ?? <Missing field="effectiveDate" label="Datum, ab dem die AGB gelten" />}
        </p>
      </section>
    </>
  );
}
