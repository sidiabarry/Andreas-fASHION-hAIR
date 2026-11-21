import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

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
        <h2 id="geltung">§ 1 Champ d'application et vendeuse</h2>
        <ol>
          <li>Les présentes conditions générales de vente (CGV) s'appliquent à toutes les commandes passées par des consommateurs (article 13 BGB) sur notre boutique en ligne.</li>
          <li>
            Votre cocontractante est{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="nom complet de la propriétaire" />} (nom commercial « {c.brandName} »),{" "}
            {addressLine(c)}, téléphone {c.phone}, e-mail {c.email}.
          </li>
          <li>La langue du contrat est l'allemand. Les traductions ne servent qu'à la compréhension.</li>
        <li>Les présentes CGV s'appliquent uniquement aux consommateurs. Les salons, coiffeurs et autres professionnels reçoivent sur demande une offre individuelle à des conditions distinctes.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Conclusion du contrat</h2>
        <ol>
          <li>La présentation des produits dans la boutique ne constitue pas une offre ferme, mais une invitation à passer commande. De nombreuses pièces sont uniques.</li>
          <li>
            Vous placez les produits dans le panier, saisissez à l'étape suivante vos coordonnées et
            votre adresse de livraison, puis voyez un récapitulatif avec toutes les informations et le
            prix total. Vous pouvez corriger les erreurs de saisie à tout moment avant l'envoi : avec
            le bouton retour de votre navigateur, via « Modifier » dans le panier ou directement dans
            les champs. En cliquant sur le bouton « Commande avec obligation de paiement », vous
            faites une offre ferme d'achat des articles du panier.
          </li>
          <li>Immédiatement après, vous recevez un e-mail automatique confirmant la réception de votre commande. Cet accusé de réception ne vaut pas encore acceptation de votre offre.</li>
          <li>
            Nous vérifions personnellement la disponibilité de la pièce. Le contrat est conclu
            lorsque nous acceptons expressément votre commande par e-mail (confirmation de commande)
            ou expédions la marchandise – selon ce qui intervient en premier. Nous décidons dans les
            trois jours ouvrables suivant la réception de la commande. Sans acceptation dans ce
            délai, vous n'êtes plus lié(e) par votre commande ; les paiements déjà effectués vous sont
            remboursés sans délai.
          </li>
          <li>Si une pièce unique n'est plus disponible, nous vous en informons sans délai. Aucun contrat n'est alors conclu pour cette pièce.</li>
          <li>Avec la confirmation de commande, vous recevez par e-mail le texte du contrat, les présentes CGV, les informations sur la rétractation et le modèle de formulaire de rétractation.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Conservation du texte du contrat</h2>
        <p>Nous conservons le texte du contrat (vos données de commande et les CGV en vigueur au moment de la commande) et vous l'envoyons par e-mail. Vous pouvez consulter, enregistrer et imprimer les CGV en vigueur sur cette page à tout moment. Nous ne proposons pas de compte client permettant de consulter les commandes passées.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Prix et frais de livraison</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Tous les prix sont des prix finaux. En tant que petite entreprise au sens de l'article 19 de la loi allemande sur la TVA (UStG), nous ne facturons pas de TVA et ne la faisons donc pas apparaître.</>
            ) : c.smallBusiness === false ? (
              <>Tous les prix sont des prix finaux TVA légale incluse.</>
            ) : (
              <Missing field="smallBusiness" label="statut TVA (petite entreprise oui/non)" />
            )}
          </li>
          <li>
            S'y ajoutent les frais de livraison : en Allemagne {eur(ship.domesticCents)} par commande
            {ship.freeFromCents !== null ? <>, offerts à partir de {eur(ship.freeFromCents)} d'achats</> : null}
            {ship.euCents !== null ? <> ; vers les autres pays de l'Union européenne {eur(ship.euCents)} par commande</> : null}
            . Pour les autres pays, nous vous indiquons les frais sur demande avant la commande. Les
            frais de livraison figurent dans le récapitulatif avant l'envoi de la commande.
          </li>
          <li>Pour les livraisons hors de l'Union européenne, des droits de douane, taxes et frais peuvent s'appliquer ; vous les réglez auprès des autorités compétentes.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Paiement</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="mode de paiement à définir" />
          </p>
        ) : (
          <>
            <p>Vous pouvez payer avec les modes de paiement suivants. Vous trouvez les informations de paiement sur la page de confirmation juste après votre commande ; nous les envoyons aussi avec la confirmation de commande.</p>
            <ul>
              {c.payments.prepayment ? (
                <li>
                  <strong>Paiement anticipé par virement :</strong> vous pouvez virer le montant total
                  dès votre commande, au plus tard dans les 7 jours suivant la réception de la confirmation de commande. Nous expédions
                  après réception du paiement. À défaut de paiement malgré un rappel, nous pouvons
                  résoudre le contrat.
                </li>
              ) : null}
              {c.payments.paypal ? (
                <li>
                  <strong>PayPal :</strong> après la confirmation de commande, vous recevez une demande
                  de paiement PayPal. Veuillez payer dans les 7 jours. Les conditions de PayPal
                  s'appliquent en outre. Expédition après réception du paiement.
                </li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>Paiement échelonné via PayPal :</strong> si PayPal vous propose cette option, vous pouvez payer en plusieurs fois après une vérification de solvabilité par PayPal. Vous concluez le crédit directement avec PayPal en tant que prêteur ; ses conditions et informations précontractuelles s'appliquent. Nous n'accordons nous-mêmes aucun crédit. Votre contrat de vente avec nous n'en est pas affecté.</li> : null}
              {c.payments.bankTransfer ? (
                <li>
                  <strong>Facture (virement après réception) :</strong> le montant est payable sans
                  escompte dans les 14 jours suivant la réception de la marchandise. Nous pouvons
                  refuser ce mode de paiement dans certains cas, notamment pour des montants élevés ou
                  des livraisons à l'étranger, et vous proposer un autre mode de paiement disponible.
                </li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Livraison</h2>
        <ol>
          <li>
            Nous livrons en Allemagne
            {others.length > 0 ? <> ainsi que dans les pays suivants : {countryNames(others, "fr")}</> : null}. Les
            livraisons vers d'autres pays sont possibles sur accord préalable. L'expédition est assurée
            par {carrier}.
          </li>
          <li>Délai de livraison des articles en stock en Allemagne : {deliveryDaysOf(c)} jours ouvrables. Pour le paiement anticipé ou PayPal, le délai court à partir du lendemain de la réception du paiement, sinon à partir du lendemain de la conclusion du contrat. Pour les envois à l'étranger, nous vous indiquons le délai avant la conclusion du contrat.</li>
          <li>
            Les pièces sur mesure vous parviennent en Allemagne en {madeToOrderDaysOf(c)} jours ouvrables. Le délai commence le lendemain du jour où nous disposons de toutes les informations nécessaires et – pour le paiement anticipé ou PayPal – du paiement. Pour les envois à l'étranger, nous vous indiquons le délai de livraison avant la conclusion du contrat.
          </li>
          <li>En cas de dommages de transport visibles, veuillez faire une réclamation auprès du livreur et nous en informer brièvement. Vos droits légaux n'en sont pas affectés ; votre signalement nous aide à faire valoir nos droits envers le transporteur.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Réserve de propriété</h2>
        <p>La marchandise reste notre propriété jusqu'au paiement intégral.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Fabrication sur mesure et selon vos souhaits</h2>
        <ol>
          <li>Pour les produits signalés comme fabriqués sur mesure, nous fabriquons selon vos indications, par exemple tour de tête, couleur, densité, sens d'implantation et base. Veuillez vérifier soigneusement vos indications ; nous en discutons avec vous avant de commencer.</li>
          <li>Il n'existe pas de droit de rétractation pour les fabrications sur mesure (article 312g, paragraphe 2, n° 1 BGB). Les détails figurent dans les informations sur la rétractation. Vos droits en cas de défaut ne sont pas affectés.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Droit de rétractation</h2>
        <p>En tant que consommateur, vous disposez d'un droit légal de rétractation. Les conditions, délais et modalités, les exceptions ainsi que la fonction en ligne « Se rétracter du contrat » sont décrits dans nos informations sur la rétractation.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Garantie légale de conformité</h2>
        <ol>
          <li>Les droits légaux en cas de défaut s'appliquent (articles 434 et suivants BGB). Le délai de prescription des droits pour défaut est de deux ans à compter de la livraison.</li>
          <li>En cas de défaut, contactez-nous : {c.email}, téléphone {c.phone}, ou par courrier : {addressLine(c)}.</li>
          <li>Nous n'accordons de garantie commerciale supplémentaire que si nous l'indiquons expressément pour un produit.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Responsabilité</h2>
        <ol>
          <li>Notre responsabilité est illimitée en cas de faute intentionnelle ou de négligence grave, d'atteinte à la vie, à l'intégrité physique ou à la santé, en vertu de la loi allemande sur la responsabilité du fait des produits ainsi que dans la limite d'une garantie accordée.</li>
          <li>En cas de violation par négligence légère d'une obligation dont l'exécution est indispensable à la bonne exécution du contrat et au respect de laquelle vous pouvez normalement vous fier (obligation contractuelle essentielle), notre responsabilité est limitée au dommage prévisible et typique du contrat.</li>
          <li>Pour le reste, la responsabilité pour négligence légère est exclue.</li>
          <li>Vos droits en cas de défaut selon le § 10 ne sont pas affectés par ces dispositions.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Produits d'entretien, adhésifs et solvants</h2>
        <p>Avant d'utiliser des colles, rubans adhésifs et solvants, lisez et respectez le mode d'emploi et les mises en garde du fabricant figurant sur l'emballage et sur la page produit. Nous recommandons de tester d'abord un nouveau produit sur une petite zone de peau. Conservez ces produits hors de portée des enfants. Des restrictions d'expédition peuvent s'appliquer à certains produits ; nous le signalons sur la page produit.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Règlement des litiges de consommation</h2>
        {c.disputeResolution === "willing" ? (
          <p>Nous sommes disposés à participer à une procédure de règlement des litiges devant l'organisme de médiation suivant : {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Nous ne sommes ni disposés ni tenus à participer à une procédure de règlement des litiges devant un organisme de médiation de la consommation.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="décision sur la médiation de la consommation (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Droit applicable</h2>
        <p>Le droit de la République fédérale d'Allemagne s'applique, à l'exclusion de la Convention des Nations unies sur les contrats de vente internationale de marchandises. Si votre résidence habituelle se trouve dans un autre État, vous conservez la protection des dispositions impératives du droit de la consommation de cet État (article 6, paragraphe 2 du règlement Rome I).</p>
        <p>
          Dernière mise à jour : {c.effectiveDate ?? <Missing field="effectiveDate" label="date d'entrée en vigueur des CGV" />}
        </p>
      </section>
    </>
  );
}
