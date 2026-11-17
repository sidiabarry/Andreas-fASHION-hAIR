import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Information manquante : {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>notre site, via le bouton « Se rétracter du contrat » en bas de chaque page</>;
  return (
    <>
      <p>
        <strong>Remarque :</strong> Seule la version allemande fait foi ; la présente traduction est
        fournie pour faciliter votre compréhension.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Informations concernant l'exercice du droit de rétractation</h2>
        <h3 id="widerrufsrecht">Droit de rétractation</h3>
        <p>Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours.</p>
        <p>
          Le délai de rétractation expire quatorze jours après le jour où vous-même, ou un tiers
          autre que le transporteur et désigné par vous, prenez physiquement possession du bien. Si
          vous avez commandé plusieurs biens dans une même commande et qu'ils sont livrés
          séparément, le délai expire quatorze jours après le jour où vous-même, ou un tiers autre
          que le transporteur et désigné par vous, prenez physiquement possession du dernier bien.
        </p>
        <p>
          Pour exercer le droit de rétractation, vous devez nous notifier (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nom complet de la propriétaire" />}, {c.brandName},{" "}
          {addressLine(c)}, téléphone {c.phone}, e-mail {c.withdrawalEmail}) votre décision de
          rétractation du présent contrat au moyen d'une déclaration dénuée d'ambiguïté (par
          exemple, lettre envoyée par la poste ou courrier électronique). Vous pouvez utiliser le
          modèle de formulaire de rétractation ci-joint, mais ce n'est pas obligatoire.
        </p>
        <p>
          Vous pouvez également exercer votre droit de rétractation en ligne sur {where}. Si vous
          utilisez cette fonction en ligne, nous vous transmettrons sans retard, sur un support
          durable (par exemple par e-mail), un accusé de réception indiquant le contenu de la
          déclaration de rétractation ainsi que la date et l'heure de sa réception.
        </p>
        <p>Pour que le délai de rétractation soit respecté, il suffit que vous transmettiez votre communication relative à l'exercice du droit de rétractation avant l'expiration du délai de rétractation.</p>

        <h3 id="folgen">Effets de la rétractation</h3>
        <p>
          En cas de rétractation de votre part du présent contrat, nous vous rembourserons tous les
          paiements reçus de vous, y compris les frais de livraison (à l'exception des frais
          supplémentaires découlant du fait que vous avez choisi, le cas échéant, un mode de
          livraison autre que le mode moins coûteux de livraison standard proposé par nous) sans
          retard excessif et, en tout état de cause, au plus tard quatorze jours à compter du jour où
          nous sommes informés de votre décision de rétractation du présent contrat. Nous
          procéderons au remboursement en utilisant le même moyen de paiement que celui que vous
          aurez utilisé pour la transaction initiale, sauf si vous convenez expressément d'un moyen
          différent ; en tout état de cause, ce remboursement n'occasionnera pas de frais pour vous.
          Nous pouvons différer le remboursement jusqu'à ce que nous ayons reçu le bien ou jusqu'à ce
          que vous ayez fourni une preuve d'expédition du bien, la date retenue étant celle du
          premier de ces faits.
        </p>
        <p>
          Vous devrez renvoyer ou rendre le bien à nous-mêmes sans retard excessif et, en tout état
          de cause, au plus tard quatorze jours après que vous nous aurez communiqué votre décision
          de rétractation du présent contrat. Ce délai est réputé respecté si vous renvoyez le bien
          avant l'expiration du délai de quatorze jours.
        </p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Nous prendrons en charge les frais de renvoi du bien.</>
          ) : c.returnCosts === "customer" ? (
            <>Vous devrez prendre en charge les frais directs de renvoi du bien.</>
          ) : (
            <Missing field="returnCosts" label="qui supporte les frais de retour (décision de la propriétaire)" />
          )}
        </p>
        <p>Votre responsabilité n'est engagée qu'à l'égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et le bon fonctionnement de ce bien.</p>

        <h3 id="ausschluss">Exclusion ou extinction anticipée du droit de rétractation</h3>
        <p>Le droit de rétractation n'existe pas pour les contrats</p>
        <ul>
          <li>de fourniture de biens qui ne sont pas préfabriqués et dont la fabrication dépend d'un choix ou d'une détermination individuels du consommateur, ou qui sont nettement personnalisés selon ses besoins. Chez nous, cela concerne tous les produits signalés comme fabriqués sur mesure, par exemple la prothèse capillaire sur mesure.</li>
        </ul>
        <p>Le droit de rétractation s'éteint de manière anticipée pour les contrats</p>
        <ul>
          <li>de fourniture de biens scellés qui ne peuvent être renvoyés pour des raisons de protection de la santé ou d'hygiène et qui ont été descellés après la livraison. Cela concerne uniquement les produits que nous livrons scellés et signalons comme tels sur la page produit.</li>
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
        <h2 id="online-widerruf">3. Comment se rétracter via notre site</h2>
        <ol>
          <li>Cliquez sur « Se rétracter du contrat ». Le bouton figure sur chaque page de notre site pendant le délai de rétractation.</li>
          <li>Indiquez votre nom, votre numéro de commande ou d'autres informations sur la commande ainsi que l'adresse e-mail à laquelle nous devons envoyer l'accusé de réception. Vous pouvez aussi vous rétracter pour certains articles seulement.</li>
          <li>Vérifiez les informations et cliquez sur « Confirmer la rétractation ».</li>
          <li>Nous vous envoyons sans retard par e-mail un accusé de réception reprenant votre déclaration ainsi que la date et l'heure de réception.</li>
        </ol>
        <p>L'accusé de réception confirme uniquement que votre déclaration nous est parvenue. Si une exception au droit de rétractation s'applique à un article, nous vous en informons séparément.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. Conseils pour le retour</h2>
        <p>
          Veuillez renvoyer la marchandise à : {c.brandName}, {addressLine(c)}. Vous nous facilitez
          le traitement en la renvoyant bien protégée – si possible dans l'emballage d'origine – avec
          le numéro de commande. Ce n'est pas une condition de validité de la rétractation. Vous
          pouvez essayer délicatement les compléments capillaires comme en magasin ; ne les coupez,
          colorez, lavez ni collez pas avant la fin du délai de rétractation, sinon une dépréciation
          peut en résulter, dont vous seriez responsable selon les informations sur la rétractation.
        </p>
      </section>
    </>
  );
}
