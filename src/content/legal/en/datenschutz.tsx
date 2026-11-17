import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Missing: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="shipping carrier" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Please note:</strong> The German version is legally binding; this translation is
        provided for your understanding.
      </p>
      <section>
        <h2 id="ueberblick">1. Summary</h2>
        <ul>
          <li>This website uses no cookies, no analytics tools and no advertising trackers.</li>
          <li>Fonts and videos are served from our own hosting. Visiting the site does not transfer any data to Google, YouTube, Meta or similar providers.</li>
          <li>We process your data only to handle your order or enquiry, to meet legal obligations and – only with your consent – to send you our newsletter.</li>
          <li>Please do not send us any health data (see section 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Controller</h2>
        <p>The controller for data processing on this website within the meaning of the General Data Protection Regulation (GDPR) is:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="owner's full name" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Phone: {c.phone}
          <br />
          Email: {c.email}
        </p>
        <p>
          We are not legally required to appoint a data protection officer. You can reach us with
          any data protection question using the contact details above.
        </p>
      </section>

      <section>
        <h2 id="hosting">3. Hosting and server log files</h2>
        <p>
          Our website is hosted by {c.hostingProvider.name}, {c.hostingProvider.address}. Each time
          you visit, the server processes technically necessary data that your browser sends
          automatically: IP address, date and time, page requested, amount of data transferred,
          status code, referrer URL and browser and operating system details.
        </p>
        <p>
          We need these data to deliver the website, keep it secure and fend off attacks. The legal
          basis is Art. 6(1)(f) GDPR; our legitimate interest is a secure, working website. We do
          not analyse log files for statistics or marketing and do not combine them with other
          data. The host keeps log files only for a short, technically required period and then
          deletes them automatically.
        </p>
        <p>
          We have concluded a data processing agreement with the host under Art. 28 GDPR. For
          transfers to the USA see section 13.
        </p>
      </section>

      <section>
        <h2 id="endgeraet">4. Storage in your browser (no cookie, no tracking)</h2>
        <p>
          To keep your shopping cart while you browse, we store the selected items in your
          browser's local storage (localStorage). This information stays on your device and is
          only sent to us when you submit an order. You can delete it at any time by emptying the
          cart or clearing the site data in your browser.
        </p>
        <p>
          This storage is strictly necessary to provide the shopping cart you have expressly
          requested. Consent is therefore not required under Section 25(2) no. 2 of the German
          Telecommunications Digital Services Data Protection Act (TDDDG). Where personal data are
          involved, the legal basis is Art. 6(1)(b) GDPR (steps prior to entering into a contract).
        </p>
      </section>

      <section>
        <h2 id="inhalte">5. Fonts, images and videos</h2>
        <p>
          All fonts, photos and videos on this website are served from our own hosting. No content
          is loaded from third parties (for example Google Fonts, YouTube or Vimeo).
        </p>
      </section>

      <section>
        <h2 id="anfragen">6. Contact, advice and enquiries</h2>
        <p>
          When you contact us via a form, by email or by phone – for example for advice, a custom
          piece or a salon enquiry – we process the information you give us (usually name, email
          address, where applicable phone number, and your message).
        </p>
        <p>
          The purpose is to handle your enquiry. The legal basis is Art. 6(1)(b) GDPR if your
          enquiry concerns a contract, otherwise Art. 6(1)(f) GDPR (our legitimate interest in
          answering enquiries). We delete enquiries once they are settled and no contract has
          resulted, at the latest 12 months after the last contact. If a contract is concluded,
          the periods in section 15 apply.
        </p>
        <p>
          We store form data in our database (see section 12). We use an email delivery service
          for notifications (see section 12).
        </p>
        {gmail ? (
          <p>
            Our mailbox is provided by {GOOGLE_IRELAND} (Gmail). Emails you send us and our replies
            are therefore stored on Google servers; data may also be transferred to the USA (see
            section 13).
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Contact via WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>
              You may also write to us via WhatsApp on a voluntary basis. The provider is{" "}
              {WHATSAPP_IRELAND}. WhatsApp is part of the Meta group; data may also be transferred to
              the USA. WhatsApp processes your phone number, your profile, communication metadata
              (for example the time) and – depending on your settings – your address book under its
              own responsibility. For details see WhatsApp's privacy policy.
            </p>
            <p>
              We use the messages only to answer your enquiry (Art. 6(1)(b) or (f) GDPR) and delete
              chats once settled, at the latest after 12 months. If you prefer not to use WhatsApp,
              you can always reach us by email or phone. Please do not send us health data via
              WhatsApp.
            </p>
          </>
        ) : (
          <p>We currently do not offer contact via messenger services.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Please no health data</h2>
        <p>
          Many of our customers wear hair replacement for health reasons. We do not need to know
          these reasons for advice, orders or custom pieces. Our forms therefore do not ask for
          health data, and we ask you not to tell us about illnesses, treatments or diagnoses. For a
          custom piece, head measurements, hair colour, hair length and desired style are enough.
        </p>
        <p>
          If you send us health data anyway, these are special categories of personal data under
          Art. 9 GDPR. We will not use them and will delete them as soon as we notice them, unless
          we exceptionally need them to answer your enquiry. In that case we will first ask for
          your explicit consent (Art. 9(2)(a) GDPR), which you may withdraw at any time.
        </p>
      </section>

      <section>
        <h2 id="bestellung">9. Orders and contract processing</h2>
        <p>
          For your order we process your name, delivery and billing address, email address, where
          applicable phone number, the items ordered, prices, payment and shipping information and
          your message to us. Mandatory fields are marked; without them we cannot conclude or
          perform the contract.
        </p>
        <p>
          The legal bases are Art. 6(1)(b) GDPR (pre-contractual steps and performance of the
          contract) and, for keeping invoices and accounting records, Art. 6(1)(c) GDPR in
          conjunction with tax and commercial law obligations (see section 15).
        </p>
        <p>
          For delivery we pass your name and delivery address to the carrier {carrier}. We only pass
          your email address or phone number to the carrier if you have expressly consented to this
          during checkout so that the carrier can notify you about delivery (Art. 6(1)(a) GDPR). You
          may withdraw this consent at any time with effect for the future.
        </p>
      </section>

      <section>
        <h2 id="zahlung">10. Payment</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>
            For payment by bank transfer we process the information that reaches us with your
            transfer (name, account details, amount, reference) in order to match the payment to
            your order (Art. 6(1)(b) and (c) GDPR). Your bank and our bank process the data under
            their own responsibility.
          </p>
        ) : null}
        {c.payments.paypal ? (
          <p>
            If you pay with PayPal, we transmit the data required for payment (name, email address,
            amount, order number, where applicable delivery address) to {PAYPAL_EUROPE}. PayPal
            processes these data as an independent controller, among other things for fraud
            prevention and, where applicable, credit checks; transfers to third countries may occur.
            The legal basis for our transmission is Art. 6(1)(b) GDPR. Your rights against PayPal and
            further information are set out in PayPal's privacy statement at
            https://www.paypal.com/de/legalhub/privacy-full.
          </p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="payment method still to be decided" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Withdrawal via our website</h2>
        <p>
          If you withdraw from a contract using our withdrawal function (“Withdraw from contract”), we
          process your name, the order details, your email address and
          the date and time of receipt. We send you an acknowledgement of receipt by email and
          process the withdrawal. The legal basis is Art. 6(1)(c) GDPR in conjunction with Section
          356a of the German Civil Code (BGB) and Art. 6(1)(b) GDPR.
        </p>
      </section>

      <section>
        <h2 id="dienstleister">12. Service providers (processors)</h2>
        <p>
          We use carefully selected service providers who process data only on our instructions.
          Data processing agreements under Art. 28 GDPR are in place with them.
        </p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – website hosting
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – mailbox (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; location of processing: {p.country}; transfer basis: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Transfers to third countries</h2>
        <p>
          Some service providers are based in the USA or may process data there. For the USA the
          European Commission adopted an adequacy decision on 10 July 2023 (EU-US Data Privacy
          Framework). Transfers to companies certified under this framework are based on Art. 45
          GDPR. In addition, or for recipients that are not certified, we have agreed on the
          European Commission's standard contractual clauses (Art. 46(2)(c) GDPR). You may request a
          copy from us. The basis that applies in each case is stated in the list in section 12.
        </p>
      </section>

      <section>
        <h2 id="newsletter">14. Newsletter</h2>
        <p>
          You only receive our newsletter if you expressly subscribe. After signing up we send you
          an email with a confirmation link (double opt-in). Only when you click this link do we add
          you to the mailing list. We delete unconfirmed sign-ups after 30 days.
        </p>
        <p>
          We store your email address and the time of sign-up and confirmation to be able to prove
          your consent. The legal basis is your consent (Art. 6(1)(a) GDPR, Section 7(2) no. 2 of
          the German Unfair Competition Act – UWG); we keep the proof on the basis of Art. 6(1)(c)
          in conjunction with Art. 7(1) GDPR. We do not track opens or clicks.
        </p>
        <p>
          You can unsubscribe at any time – via the link in every issue or by writing to {c.email}.
          We then remove your address from the mailing list; we keep the proof of consent for up to
          three years after the end of the year in which you unsubscribed so that we can defend
          ourselves against claims.
        </p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Storage periods</h2>
        <ul>
          <li>We store contract data until the contract has been fully performed and the two-year statutory warranty period has expired.</li>
          <li>We keep invoices and accounting records for eight years (Section 147(1) and (3) of the German Fiscal Code, AO).</li>
          <li>We keep business letters, for example order confirmations, for six years (Section 147(1) and (3) AO).</li>
          <li>These periods begin at the end of the calendar year in which the document was created. During this time we restrict processing to storage.</li>
          <li>We delete all other data as soon as they are no longer needed for their purpose – the periods are stated in the individual sections.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. External links and social media</h2>
        <p>
          On our website we link to our profiles on Instagram and Facebook and to WhatsApp. These
          are simple links, not embedded plug-ins: merely visiting our website does not transfer any
          data to these providers.
        </p>
        <p>
          Only when you click a link does the provider's page open, and the provider then processes
          your data under its own responsibility. The provider of Instagram and Facebook is{" "}
          {META_IRELAND}; the provider of WhatsApp is {WHATSAPP_IRELAND}. Data may be transferred to
          the USA. For details see the providers' privacy notices.
        </p>
      </section>

      <section>
        <h2 id="rechte">17. Your rights</h2>
        <p>You have the following rights regarding your data:</p>
        <ul>
          <li>Access (Art. 15 GDPR)</li>
          <li>Rectification (Art. 16 GDPR)</li>
          <li>Erasure (Art. 17 GDPR)</li>
          <li>Restriction of processing (Art. 18 GDPR)</li>
          <li>Data portability (Art. 20 GDPR)</li>
          <li>Withdrawal of consent with effect for the future (Art. 7(3) GDPR); processing carried out until then remains lawful</li>
        </ul>
        <p>
          <strong>Right to object (Art. 21 GDPR):</strong> Where we process data on the basis of
          Art. 6(1)(f) GDPR, you may object at any time on grounds relating to your particular
          situation. We will then stop processing the data unless we demonstrate compelling
          legitimate grounds or the processing serves the establishment, exercise or defence of
          legal claims. After an objection we will never send you advertising again.
        </p>
        <p>An informal message to {c.email} is sufficient for any request.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Right to lodge a complaint</h2>
        <p>
          You may lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), for
          example in the place where you live. The authority responsible for us is:
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
        <h2 id="sonstiges">19. Security, automated decisions, changes</h2>
        <p>
          The connection to our website is encrypted with TLS (recognisable by “https://”). We do
          not make automated decisions or carry out profiling within the meaning of Art. 22 GDPR. We
          update this privacy policy when our website or the law changes.
        </p>
        <p>
          Last updated: {c.effectiveDate ?? <Missing field="effectiveDate" label="date from which this policy applies" />}
        </p>
      </section>
    </>
  );
}
