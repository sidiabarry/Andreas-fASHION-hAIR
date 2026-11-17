import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "./company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Angabe fehlt: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="Versanddienstleister" />;
  return (
    <>
      <section>
        <h2 id="ueberblick">1. Das Wichtigste in Kürze</h2>
        <ul>
          <li>Diese Website setzt keine Cookies, keine Analyse-Werkzeuge und keine Werbe-Tracker ein.</li>
          <li>Schriften und Videos liegen auf unserem eigenen Server. Beim Aufruf der Seite werden keine Daten an Google, YouTube, Meta oder ähnliche Anbieter übertragen.</li>
          <li>Wir verarbeiten Ihre Daten nur, um Ihre Bestellung oder Anfrage zu bearbeiten, gesetzliche Pflichten zu erfüllen und – nur mit Ihrer Einwilligung – Ihnen unseren Newsletter zu senden.</li>
          <li>Bitte teilen Sie uns keine Gesundheitsdaten mit (Einzelheiten in Abschnitt 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Verantwortliche</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="vollständiger Name der Inhaberin" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Telefon: {c.phone}
          <br />
          E-Mail: {c.email}
        </p>
        <p>
          Wir sind gesetzlich nicht verpflichtet, eine Datenschutzbeauftragte oder einen
          Datenschutzbeauftragten zu benennen. Für alle Fragen zum Datenschutz erreichen Sie uns
          unter den oben genannten Kontaktdaten.
        </p>
      </section>

      <section>
        <h2 id="hosting">3. Hosting und Server-Logfiles</h2>
        <p>
          Unsere Website wird bei {c.hostingProvider.name}, {c.hostingProvider.address}, betrieben.
          Bei jedem Aufruf verarbeitet der Server technisch notwendige Daten, die Ihr Browser
          automatisch übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, übertragene
          Datenmenge, Statuscode, Referrer-URL sowie Browser- und Betriebssystemangaben.
        </p>
        <p>
          Wir brauchen diese Daten, um die Website auszuliefern, ihre Sicherheit zu gewährleisten und
          Angriffe abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
          Interesse liegt in einem sicheren und funktionierenden Internetauftritt. Wir werten
          Logfiles nicht zu Statistik- oder Marketingzwecken aus und führen sie nicht mit anderen
          Daten zusammen. Der Hoster speichert Logfiles nur für einen kurzen, technisch bedingten
          Zeitraum und löscht sie danach automatisch.
        </p>
        <p>
          Mit dem Hoster haben wir einen Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO
          geschlossen. Zur Übermittlung in die USA siehe Abschnitt 13.
        </p>
      </section>

      <section>
        <h2 id="endgeraet">4. Speicherung in Ihrem Browser (kein Cookie, kein Tracking)</h2>
        <p>
          Damit Ihr Warenkorb erhalten bleibt, während Sie weiter stöbern, speichern wir die
          ausgewählten Artikel im lokalen Speicher Ihres Browsers (localStorage). Diese Angaben
          bleiben auf Ihrem Gerät und werden erst an uns übertragen, wenn Sie eine Bestellung
          abschicken. Sie können sie jederzeit löschen, indem Sie den Warenkorb leeren oder die
          Website-Daten in Ihrem Browser entfernen.
        </p>
        <p>
          Diese Speicherung ist unbedingt erforderlich, um den von Ihnen ausdrücklich gewünschten
          Warenkorb bereitzustellen. Eine Einwilligung ist deshalb nach § 25 Abs. 2 Nr. 2
          Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG) nicht erforderlich. Soweit
          dabei personenbezogene Daten verarbeitet werden, ist Rechtsgrundlage Art. 6 Abs. 1 lit. b
          DSGVO (Anbahnung eines Vertrags).
        </p>
      </section>

      <section>
        <h2 id="inhalte">5. Schriften, Bilder und Videos</h2>
        <p>
          Alle Schriftarten, Fotos und Videos dieser Website liefern wir von unserem eigenen Hosting
          aus. Es werden keine Inhalte von Drittanbietern (zum Beispiel Google Fonts, YouTube oder
          Vimeo) nachgeladen.
        </p>
      </section>

      <section>
        <h2 id="anfragen">6. Kontakt, Beratung und Anfragen</h2>
        <p>
          Wenn Sie uns über ein Formular, per E-Mail oder telefonisch kontaktieren – etwa für eine
          Beratung, eine Maßanfertigung oder eine Salon-Anfrage –, verarbeiten wir die Angaben, die
          Sie uns mitteilen (in der Regel Name, E-Mail-Adresse, gegebenenfalls Telefonnummer und Ihre
          Nachricht).
        </p>
        <p>
          Zweck ist die Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO,
          wenn Ihre Anfrage auf einen Vertrag zielt, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (unser
          berechtigtes Interesse, Anfragen zu beantworten). Wir löschen Anfragen, sobald sie
          erledigt sind und kein Vertrag daraus entstanden ist, spätestens jedoch 12 Monate nach
          dem letzten Kontakt. Entsteht ein Vertrag, gelten die Fristen aus Abschnitt 15.
        </p>
        <p>
          Formulardaten speichern wir in unserer Datenbank (siehe Abschnitt 12). Für die
          Benachrichtigung per E-Mail nutzen wir einen E-Mail-Versanddienst (siehe Abschnitt 12).
        </p>
        {c.email.toLowerCase().endsWith("@gmail.com") ? (
          <p>
            Unser E-Mail-Postfach stellt {GOOGLE_IRELAND} bereit (Gmail). E-Mails, die Sie uns
            schreiben, und unsere Antworten werden daher auf Servern von Google gespeichert; dabei
            können Daten auch in die USA übermittelt werden (siehe Abschnitt 13).
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Kontakt per WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>
              Sie können uns freiwillig auch über WhatsApp schreiben. Anbieter ist {WHATSAPP_IRELAND}.
              WhatsApp ist ein Dienst der Meta-Gruppe; dabei können Daten auch in die USA übermittelt
              werden. WhatsApp verarbeitet Ihre Telefonnummer, Ihr Profil, Metadaten der Kommunikation
              (zum Beispiel Zeitpunkt) und – je nach Ihren Einstellungen – Ihr Adressbuch in eigener
              Verantwortung. Einzelheiten finden Sie in der Datenschutzrichtlinie von WhatsApp.
            </p>
            <p>
              Wir nutzen die Nachrichten nur, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b
              bzw. lit. f DSGVO) und löschen Chats nach Erledigung, spätestens nach 12 Monaten.
              Wenn Sie WhatsApp nicht nutzen möchten, erreichen Sie uns jederzeit per E-Mail oder
              Telefon. Bitte senden Sie uns über WhatsApp keine Gesundheitsdaten.
            </p>
          </>
        ) : (
          <p>Wir bieten derzeit keine Kontaktaufnahme über Messenger-Dienste an.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Bitte keine Gesundheitsdaten</h2>
        <p>
          Viele unserer Kundinnen und Kunden tragen Haarersatz aus gesundheitlichen Gründen. Für
          Beratung, Bestellung und Maßanfertigung brauchen wir diese Gründe nicht. Unsere Formulare
          fragen deshalb keine Gesundheitsdaten ab, und wir bitten Sie, uns keine Angaben zu
          Erkrankungen, Behandlungen oder Diagnosen mitzuteilen. Für eine Maßanfertigung genügen
          Angaben zu Kopfmaß, Haarfarbe, Haarlänge und Wunschfrisur.
        </p>
        <p>
          Teilen Sie uns trotzdem Gesundheitsdaten mit, handelt es sich um besondere Kategorien
          personenbezogener Daten nach Art. 9 DSGVO. Wir verwenden diese Angaben dann nicht und
          löschen sie, sobald wir sie bemerken, soweit wir sie nicht ausnahmsweise zur Beantwortung
          Ihrer Anfrage brauchen. In diesem Fall fragen wir Sie zuvor nach Ihrer ausdrücklichen
          Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die Sie jederzeit widerrufen können.
        </p>
      </section>

      <section>
        <h2 id="bestellung">9. Bestellung und Vertragsabwicklung</h2>
        <p>
          Für Ihre Bestellung verarbeiten wir Name, Liefer- und Rechnungsanschrift, E-Mail-Adresse,
          gegebenenfalls Telefonnummer, die bestellten Artikel, Preise, Zahlungs- und
          Versandinformationen sowie Ihre Nachricht an uns. Pflichtfelder sind gekennzeichnet; ohne
          diese Angaben können wir den Vertrag nicht abschließen oder erfüllen.
        </p>
        <p>
          Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung und -erfüllung) und,
          für die Aufbewahrung von Rechnungen und Buchungsbelegen, Art. 6 Abs. 1 lit. c DSGVO in
          Verbindung mit den steuer- und handelsrechtlichen Pflichten (siehe Abschnitt 15).
        </p>
        <p>
          Zur Zustellung geben wir Name und Lieferanschrift an den Versanddienstleister {carrier}{" "}
          weiter. Ihre E-Mail-Adresse oder Telefonnummer geben wir nur dann an den
          Versanddienstleister weiter, wenn Sie im Bestellprozess ausdrücklich darin eingewilligt
          haben, damit er Sie über die Zustellung informieren kann (Art. 6 Abs. 1 lit. a DSGVO). Sie
          können diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
      </section>

      <section>
        <h2 id="zahlung">10. Zahlung</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>
            Bei Zahlung per Überweisung verarbeiten wir die Angaben, die mit Ihrer Überweisung bei
            uns eingehen (Name, Kontoverbindung, Betrag, Verwendungszweck), um die Zahlung Ihrer
            Bestellung zuzuordnen (Art. 6 Abs. 1 lit. b und c DSGVO). Ihre Bank und unsere Bank
            verarbeiten die Daten in eigener Verantwortung.
          </p>
        ) : null}
        {c.payments.paypal ? (
          <p>
            Wenn Sie mit PayPal bezahlen, übermitteln wir die für die Zahlung nötigen Daten
            (Name, E-Mail-Adresse, Betrag, Bestellnummer, gegebenenfalls Lieferanschrift) an{" "}
            {PAYPAL_EUROPE}. PayPal verarbeitet diese Daten als eigenständig Verantwortlicher, unter
            anderem zur Betrugsprävention und gegebenenfalls zur Bonitätsprüfung; dabei kann es zu
            Übermittlungen in Drittländer kommen. Rechtsgrundlage für unsere Übermittlung ist Art. 6
            Abs. 1 lit. b DSGVO. Ihre Rechte gegenüber PayPal und weitere Informationen finden Sie in
            der Datenschutzerklärung von PayPal unter https://www.paypal.com/de/legalhub/privacy-full.
          </p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="Zahlungsart noch festzulegen" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Widerruf über unsere Website</h2>
        <p>
          Wenn Sie einen Vertrag über unsere Widerrufsfunktion („Vertrag widerrufen“) widerrufen,
          verarbeiten wir Ihren Namen, die Angaben zur Bestellung, Ihre E-Mail-Adresse sowie Datum
          und Uhrzeit des Eingangs. Wir senden Ihnen eine Eingangsbestätigung per E-Mail und
          wickeln den Widerruf ab. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit
          § 356a Bürgerliches Gesetzbuch (BGB) sowie Art. 6 Abs. 1 lit. b DSGVO.
        </p>
      </section>

      <section>
        <h2 id="dienstleister">12. Dienstleister (Auftragsverarbeiter)</h2>
        <p>
          Wir setzen sorgfältig ausgewählte Dienstleister ein, die Daten nur nach unserer Weisung
          verarbeiten. Mit ihnen bestehen Verträge zur Auftragsverarbeitung nach Art. 28 DSGVO.
        </p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – Hosting der Website
          </li>
          {c.email.toLowerCase().endsWith("@gmail.com") ? <li>{GOOGLE_IRELAND} – E-Mail-Postfach (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; Sitz bzw. Verarbeitung: {p.country}; Grundlage der
              Übermittlung: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Übermittlung in Drittländer</h2>
        <p>
          Einige Dienstleister haben ihren Sitz in den USA oder können Daten dort verarbeiten. Für
          die USA hat die EU-Kommission am 10. Juli 2023 einen Angemessenheitsbeschluss erlassen
          (EU-US Data Privacy Framework). Übermittlungen an Unternehmen, die nach diesem Rahmen
          zertifiziert sind, stützen sich auf Art. 45 DSGVO. Zusätzlich oder für nicht zertifizierte
          Empfänger haben wir Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO)
          vereinbart. Eine Kopie können Sie bei uns anfordern. Welche Grundlage im Einzelfall gilt,
          steht in der Liste in Abschnitt 12.
        </p>
      </section>

      <section>
        <h2 id="newsletter">14. Newsletter</h2>
        <p>
          Unseren Newsletter erhalten Sie nur, wenn Sie ihn ausdrücklich bestellen. Nach der
          Anmeldung senden wir Ihnen eine E-Mail mit einem Bestätigungslink (Double-Opt-in). Erst
          wenn Sie diesen Link anklicken, nehmen wir Sie in den Verteiler auf. Nicht bestätigte
          Anmeldungen löschen wir nach 30 Tagen.
        </p>
        <p>
          Wir speichern Ihre E-Mail-Adresse sowie Zeitpunkt der Anmeldung und der Bestätigung, um
          Ihre Einwilligung nachweisen zu können. Rechtsgrundlage ist Ihre Einwilligung (Art. 6
          Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 2 Gesetz gegen den unlauteren Wettbewerb – UWG); den
          Nachweis bewahren wir auf Grundlage von Art. 6 Abs. 1 lit. c in Verbindung mit Art. 7
          Abs. 1 DSGVO auf. Wir werten weder Öffnungen noch Klicks aus.
        </p>
        <p>
          Sie können den Newsletter jederzeit abbestellen – über den Link in jeder Ausgabe oder
          per Nachricht an {c.email}. Danach löschen wir Ihre Adresse aus dem Verteiler; den
          Einwilligungsnachweis bewahren wir bis zu drei Jahre nach Ende des Jahres auf, in dem Sie
          sich abgemeldet haben, um uns gegen Ansprüche verteidigen zu können.
        </p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Speicherdauer</h2>
        <ul>
          <li>Vertragsdaten speichern wir, bis der Vertrag vollständig abgewickelt ist und die Gewährleistungsfrist von zwei Jahren abgelaufen ist.</li>
          <li>Rechnungen und Buchungsbelege bewahren wir acht Jahre auf (§ 147 Abs. 1 und 3 Abgabenordnung).</li>
          <li>Geschäftsbriefe, zum Beispiel Bestell- und Auftragsbestätigungen, bewahren wir sechs Jahre auf (§ 147 Abs. 1 und 3 Abgabenordnung).</li>
          <li>Die Fristen beginnen mit dem Ende des Kalenderjahres, in dem das Dokument entstanden ist. In dieser Zeit schränken wir die Verarbeitung auf die Aufbewahrung ein.</li>
          <li>Alle übrigen Daten löschen wir, sobald sie für den Zweck nicht mehr nötig sind – die Fristen stehen in den einzelnen Abschnitten.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Externe Links und Social Media</h2>
        <p>
          Auf unserer Website verlinken wir auf unsere Profile bei Instagram und Facebook sowie auf
          WhatsApp. Es handelt sich um einfache Links, nicht um eingebundene Plugins: Beim bloßen
          Aufruf unserer Website werden keine Daten an diese Anbieter übertragen.
        </p>
        <p>
          Erst wenn Sie einen Link anklicken, öffnet sich die Seite des Anbieters, und dieser
          verarbeitet Ihre Daten in eigener Verantwortung. Anbieter von Instagram und Facebook ist{" "}
          {META_IRELAND}; Anbieter von WhatsApp ist {WHATSAPP_IRELAND}. Dabei können Daten in die USA
          übermittelt werden. Einzelheiten finden Sie in den Datenschutzhinweisen der Anbieter.
        </p>
      </section>

      <section>
        <h2 id="rechte">17. Ihre Rechte</h2>
        <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer Daten:</p>
        <ul>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO); die bis dahin erfolgte Verarbeitung bleibt rechtmäßig</li>
        </ul>
        <p>
          <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit wir Daten auf Grundlage von
          Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie aus Gründen, die sich aus Ihrer
          besonderen Situation ergeben, jederzeit widersprechen. Wir verarbeiten die Daten dann
          nicht mehr, es sei denn, wir weisen zwingende schutzwürdige Gründe nach oder die
          Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
          Werbung senden wir Ihnen nach einem Widerspruch in keinem Fall mehr.
        </p>
        <p>Für alle Anliegen genügt eine formlose Nachricht an {c.email}.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Beschwerderecht</h2>
        <p>
          Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum
          Beispiel an Ihrem Wohnort. Für uns zuständig ist:
        </p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Sicherheit, automatisierte Entscheidungen, Änderungen</h2>
        <p>
          Die Verbindung zu unserer Website ist per TLS verschlüsselt (erkennbar an „https://“).
          Wir treffen keine automatisierten Entscheidungen und betreiben kein Profiling im Sinne von
          Art. 22 DSGVO. Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die
          Rechtslage ändert.
        </p>
        <p>
          Stand: {c.effectiveDate ?? <Missing field="effectiveDate" label="Datum, ab dem die Datenschutzerklärung gilt" />}
        </p>
      </section>
    </>
  );
}
