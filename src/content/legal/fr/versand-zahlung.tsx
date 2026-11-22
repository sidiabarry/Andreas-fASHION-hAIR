import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Information manquante : {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "fr-FR");
  const carrier = c.carrier ?? <Missing field="carrier" label="transporteur" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Remarque :</strong> Seule la version allemande fait foi ; la présente traduction est
        fournie pour faciliter votre compréhension.
      </p>
      <section>
        <h2 id="versandkosten">1. Frais de livraison</h2>
        <dl>
          <dt>Allemagne</dt>
          <dd>
            {eur(ship.domesticCents)} par commande
            {ship.freeFromCents !== null ? <> ; offerts à partir de {eur(ship.freeFromCents)} d'achats</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Pays de l'Union européenne</dt>
              <dd>{eur(ship.euCents)} par commande{others.length === 0 ? <> (livraison sur accord)</> : null}</dd>
            </>
          ) : null}
          <dt>Autres pays</dt>
          <dd>sur demande – nous vous indiquons les frais avant la commande</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>En tant que petite entreprise au sens de l'article 19 de la loi allemande sur la TVA (UStG), nous ne facturons pas de TVA – y compris sur les frais de livraison.</>
          ) : c.smallBusiness === false ? (
            <>Tous les prix et frais de livraison incluent la TVA légale.</>
          ) : (
            <Missing field="smallBusiness" label="statut TVA (petite entreprise oui/non)" />
          )}{" "}
          Pour les livraisons hors de l'Union européenne, des droits de douane, taxes à l'importation
          et frais peuvent s'appliquer ; vous les réglez auprès des autorités compétentes.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Livraison et délais</h2>
        <ul>
          <li>
            Nous expédions avec {carrier}, dans un emballage discret et avec suivi. Pays de
            livraison : Allemagne{others.length > 0 ? <>, {countryNames(others, "fr")}</> : null} ; autres pays sur accord.
          </li>
          <li>Les pièces en stock vous parviennent en Allemagne en {deliveryDaysOf(c)} jours ouvrables – pour le paiement anticipé et PayPal à partir du lendemain de la réception du paiement, sinon à partir du lendemain de la conclusion du contrat. Pour l'étranger, nous vous indiquons le délai avant la conclusion du contrat.</li>
          <li>
            Les pièces sur mesure vous parviennent en Allemagne en {madeToOrderDaysOf(c)} jours ouvrables, à compter du lendemain de la réception de toutes les informations et – pour le paiement anticipé ou PayPal – du paiement.
          </li>
          <li>Pour des raisons de sécurité, nous ne pouvons pas expédier certains produits d'entretien, adhésifs et solvants dans tous les pays. Nous le signalons sur la page produit.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Modes de paiement</h2>
        <p>Après votre commande, nous vérifions personnellement la disponibilité et vous envoyons une confirmation de commande avec les informations de paiement. Vous pouvez payer dès votre commande ou après notre confirmation. Si une pièce n'est pas disponible, nous remboursons sans délai tout paiement déjà effectué.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="mode de paiement à définir" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Paiement anticipé par virement</strong> – payable dès la commande, au plus tard 7 jours après la
                confirmation de commande ; expédition après réception du paiement.
                {c.bank ? (
                  <>
                    {" "}Titulaire du compte : {c.bank.holder}, IBAN : {c.bank.iban}
                    {c.bank.bic ? <>, BIC : {c.bank.bic}</> : null}. Merci d'indiquer votre numéro de
                    commande comme référence.
                  </>
                ) : (
                  <>{" "}Vous recevrez les coordonnées bancaires avec la confirmation de commande.</>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – dès la commande via le bouton PayPal sur la page de
                confirmation, ou par une demande de paiement après la confirmation de commande
                {c.paypalEmail ? <> (paiement à {c.paypalEmail})</> : null}
                ; payable au plus tard 7 jours après la confirmation de commande. Expédition après réception du paiement.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>Paiement échelonné via PayPal</strong> – si PayPal vous le propose ; le prêteur est PayPal, sous réserve de sa vérification de solvabilité et de ses conditions. Nous n'accordons nous-mêmes aucun crédit.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Facture</strong> – virement dans les 14 jours suivant la réception de la
                marchandise. Nous pouvons refuser ce mode de paiement dans certains cas et vous
                proposer un autre mode disponible.
                {c.bank ? null : <> <Missing field="bank" label="coordonnées bancaires" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Nous ne facturons aucun frais supplémentaire pour le paiement.</p>
      </section>
    </>
  );
}
