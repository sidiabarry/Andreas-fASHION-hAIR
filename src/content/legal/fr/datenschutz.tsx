import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Information manquante : {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="transporteur" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Remarque :</strong> Seule la version allemande fait foi ; la présente traduction est
        fournie pour faciliter votre compréhension.
      </p>
      <section>
        <h2 id="ueberblick">1. L'essentiel en bref</h2>
        <ul>
          <li>Ce site n'utilise ni cookies, ni outils d'analyse, ni traceurs publicitaires.</li>
          <li>Les polices et vidéos sont hébergées chez nous. La consultation du site ne transmet aucune donnée à Google, YouTube, Meta ou à des prestataires similaires.</li>
          <li>Nous traitons vos données uniquement pour traiter votre commande ou votre demande, respecter nos obligations légales et – uniquement avec votre consentement – vous envoyer notre newsletter.</li>
          <li>Merci de ne pas nous communiquer de données de santé (voir section 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Responsable du traitement</h2>
        <p>Le responsable du traitement au sens du règlement général sur la protection des données (RGPD) est :</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nom complet de la propriétaire" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Téléphone : {c.phone}
          <br />
          E-mail : {c.email}
        </p>
        <p>Nous ne sommes pas légalement tenus de désigner un délégué à la protection des données. Pour toute question, contactez-nous aux coordonnées ci-dessus.</p>
      </section>

      <section>
        <h2 id="hosting">3. Hébergement et fichiers journaux</h2>
        <p>
          Notre site est hébergé par {c.hostingProvider.name}, {c.hostingProvider.address}. À chaque
          visite, le serveur traite les données techniquement nécessaires transmises automatiquement
          par votre navigateur : adresse IP, date et heure, page consultée, volume de données
          transféré, code de statut, URL de provenance, informations sur le navigateur et le système
          d'exploitation.
        </p>
        <p>
          Ces données sont nécessaires pour afficher le site, en assurer la sécurité et repousser
          les attaques. La base juridique est l'article 6, paragraphe 1, point f) du RGPD ; notre
          intérêt légitime est un site sûr et fonctionnel. Nous n'exploitons pas les journaux à des
          fins statistiques ou marketing et ne les recoupons pas avec d'autres données. L'hébergeur
          ne conserve les journaux que pendant une courte durée techniquement nécessaire, puis les
          supprime automatiquement.
        </p>
        <p>Nous avons conclu avec l'hébergeur un contrat de sous-traitance conforme à l'article 28 du RGPD. Pour les transferts vers les États-Unis, voir la section 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Stockage dans votre navigateur (ni cookie, ni traçage)</h2>
        <p>
          Pour conserver votre panier pendant votre visite, nous enregistrons les articles
          sélectionnés dans la mémoire locale de votre navigateur (localStorage). Ces informations
          restent sur votre appareil et ne nous sont transmises que lorsque vous envoyez une
          commande. Vous pouvez les supprimer à tout moment en vidant le panier ou les données du
          site dans votre navigateur.
        </p>
        <p>
          Ce stockage est strictement nécessaire pour fournir le panier que vous avez expressément
          demandé. Aucun consentement n'est donc requis selon l'article 25, paragraphe 2, n° 2 de la
          loi allemande TDDDG. Si des données personnelles sont concernées, la base juridique est
          l'article 6, paragraphe 1, point b) du RGPD (mesures précontractuelles).
        </p>
      </section>

      <section>
        <h2 id="inhalte">5. Polices, images et vidéos</h2>
        <p>Toutes les polices, photos et vidéos sont diffusées depuis notre propre hébergement. Aucun contenu de tiers (par exemple Google Fonts, YouTube ou Vimeo) n'est chargé.</p>
      </section>

      <section>
        <h2 id="anfragen">6. Contact, conseil et demandes</h2>
        <p>
          Lorsque vous nous contactez par formulaire, par e-mail ou par téléphone – par exemple pour
          un conseil, une fabrication sur mesure ou une demande de salon –, nous traitons les
          informations que vous nous communiquez (en général nom, adresse e-mail, le cas échéant
          numéro de téléphone et votre message).
        </p>
        <p>
          La finalité est le traitement de votre demande. La base juridique est l'article 6,
          paragraphe 1, point b) du RGPD si votre demande porte sur un contrat, sinon le point f)
          (notre intérêt légitime à répondre aux demandes). Nous supprimons les demandes une fois
          traitées si aucun contrat n'en résulte, au plus tard 12 mois après le dernier contact. Si
          un contrat est conclu, les durées de la section 15 s'appliquent.
        </p>
        <p>Nous enregistrons les données des formulaires dans notre base de données et utilisons un service d'envoi d'e-mails pour les notifications (voir section 12).</p>
        {gmail ? (
          <p>
            Notre messagerie est fournie par {GOOGLE_IRELAND} (Gmail). Les e-mails que vous nous
            envoyez et nos réponses sont donc stockés sur des serveurs de Google ; des données
            peuvent être transférées aux États-Unis (voir section 13).
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. Contact via WhatsApp</h2>
        {c.social?.whatsapp ? (
          <>
            <p>
              Vous pouvez aussi, si vous le souhaitez, nous écrire via WhatsApp. Le prestataire est{" "}
              {WHATSAPP_IRELAND}. WhatsApp fait partie du groupe Meta ; des données peuvent être
              transférées aux États-Unis. WhatsApp traite sous sa propre responsabilité votre numéro
              de téléphone, votre profil, les métadonnées de communication (par exemple l'heure) et –
              selon vos réglages – votre carnet d'adresses. Pour plus de détails, consultez la
              politique de confidentialité de WhatsApp.
            </p>
            <p>
              Nous utilisons les messages uniquement pour répondre à votre demande (article 6,
              paragraphe 1, points b) ou f) du RGPD) et supprimons les conversations une fois
              traitées, au plus tard après 12 mois. Vous pouvez toujours nous joindre par e-mail ou
              par téléphone. Merci de ne pas nous envoyer de données de santé via WhatsApp.
            </p>
          </>
        ) : (
          <p>Nous ne proposons actuellement pas de contact via une messagerie instantanée.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Pas de données de santé, s'il vous plaît</h2>
        <p>
          Beaucoup de nos clientes et clients portent des compléments capillaires pour des raisons
          de santé. Nous n'avons pas besoin de connaître ces raisons pour le conseil, la commande ou
          la fabrication sur mesure. Nos formulaires ne demandent donc aucune donnée de santé, et
          nous vous prions de ne pas nous communiquer d'informations sur des maladies, traitements
          ou diagnostics. Pour une pièce sur mesure, le tour de tête, la couleur, la longueur et la
          coiffure souhaitée suffisent.
        </p>
        <p>
          Si vous nous communiquez malgré tout des données de santé, il s'agit de catégories
          particulières de données au sens de l'article 9 du RGPD. Nous ne les utilisons pas et les
          supprimons dès que nous les remarquons, sauf si nous en avons exceptionnellement besoin
          pour répondre à votre demande. Dans ce cas, nous vous demandons au préalable votre
          consentement explicite (article 9, paragraphe 2, point a) du RGPD), que vous pouvez
          retirer à tout moment.
        </p>
      </section>

      <section>
        <h2 id="bestellung">9. Commande et exécution du contrat</h2>
        <p>
          Pour votre commande, nous traitons votre nom, vos adresses de livraison et de facturation,
          votre adresse e-mail, le cas échéant votre numéro de téléphone, les articles commandés, les
          prix, les informations de paiement et d'expédition ainsi que votre message. Les champs
          obligatoires sont signalés ; sans eux, nous ne pouvons ni conclure ni exécuter le contrat.
        </p>
        <p>
          Les bases juridiques sont l'article 6, paragraphe 1, point b) du RGPD (mesures
          précontractuelles et exécution du contrat) et, pour la conservation des factures et pièces
          comptables, le point c) en lien avec les obligations fiscales et commerciales (voir
          section 15).
        </p>
        <p>
          Pour la livraison, nous transmettons votre nom et votre adresse de livraison au
          transporteur {carrier}. Nous ne transmettons votre adresse e-mail ou votre numéro de
          téléphone au transporteur que si vous y avez expressément consenti lors de la commande,
          afin qu'il puisse vous informer de la livraison (article 6, paragraphe 1, point a) du
          RGPD). Vous pouvez retirer ce consentement à tout moment pour l'avenir.
        </p>
      </section>

      <section>
        <h2 id="zahlung">10. Paiement</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>
            En cas de paiement par virement, nous traitons les informations qui nous parviennent avec
            votre virement (nom, coordonnées bancaires, montant, référence) afin de l'affecter à votre
            commande (article 6, paragraphe 1, points b) et c) du RGPD). Votre banque et la nôtre
            traitent ces données sous leur propre responsabilité.
          </p>
        ) : null}
        {c.payments.paypal ? (
          <p>
            Si vous payez avec PayPal, nous transmettons les données nécessaires au paiement (nom,
            adresse e-mail, montant, numéro de commande, le cas échéant adresse de livraison) à{" "}
            {PAYPAL_EUROPE}. PayPal traite ces données en tant que responsable de traitement
            indépendant, notamment pour la prévention de la fraude et, le cas échéant, la
            vérification de solvabilité ; des transferts vers des pays tiers peuvent avoir lieu. La
            base juridique de notre transmission est l'article 6, paragraphe 1, point b) du RGPD. Vos
            droits à l'égard de PayPal figurent dans sa déclaration de confidentialité :
            https://www.paypal.com/fr/legalhub/privacy-full.
          </p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="mode de paiement à définir" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Rétractation via notre site</h2>
        <p>
          Si vous vous rétractez d'un contrat via notre fonction de rétractation (« Se rétracter du
          contrat »), nous traitons votre nom, les informations sur la commande, votre adresse
          e-mail ainsi que la date et l'heure de réception. Nous vous envoyons un accusé de
          réception par e-mail et traitons la rétractation. La base juridique est l'article 6,
          paragraphe 1, point c) du RGPD en lien avec l'article 356a du Code civil allemand (BGB),
          ainsi que le point b).
        </p>
      </section>

      <section>
        <h2 id="dienstleister">12. Prestataires (sous-traitants)</h2>
        <p>Nous faisons appel à des prestataires soigneusement choisis qui ne traitent les données que sur nos instructions. Des contrats de sous-traitance conformes à l'article 28 du RGPD ont été conclus avec eux.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – hébergement du site
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – messagerie (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose} ; lieu de traitement : {p.country} ; base du transfert : {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Transferts vers des pays tiers</h2>
        <p>
          Certains prestataires sont établis aux États-Unis ou peuvent y traiter des données. Pour
          les États-Unis, la Commission européenne a adopté le 10 juillet 2023 une décision
          d'adéquation (cadre de protection des données UE-États-Unis, « Data Privacy Framework »).
          Les transferts vers des entreprises certifiées reposent sur l'article 45 du RGPD. En
          complément, ou pour les destinataires non certifiés, nous avons conclu les clauses
          contractuelles types de la Commission européenne (article 46, paragraphe 2, point c) du
          RGPD). Vous pouvez nous en demander une copie. La base applicable figure dans la liste de
          la section 12.
        </p>
      </section>

      <section>
        <h2 id="newsletter">14. Newsletter</h2>
        <p>
          Vous ne recevez notre newsletter que si vous vous y abonnez expressément. Après
          l'inscription, nous vous envoyons un e-mail contenant un lien de confirmation (double
          opt-in). Ce n'est qu'après un clic sur ce lien que nous vous ajoutons à la liste. Les
          inscriptions non confirmées sont supprimées après 30 jours.
        </p>
        <p>
          Nous enregistrons votre adresse e-mail et les dates d'inscription et de confirmation afin
          de pouvoir prouver votre consentement. La base juridique est votre consentement (article
          6, paragraphe 1, point a) du RGPD, article 7, paragraphe 2, n° 2 de la loi allemande contre
          la concurrence déloyale – UWG) ; nous conservons la preuve sur la base de l'article 6,
          paragraphe 1, point c) en lien avec l'article 7, paragraphe 1 du RGPD. Nous ne mesurons ni
          les ouvertures ni les clics.
        </p>
        <p>
          Vous pouvez vous désabonner à tout moment via le lien présent dans chaque envoi ou en
          écrivant à {c.email}. Nous supprimons alors votre adresse de la liste ; nous conservons la
          preuve du consentement jusqu'à trois ans après la fin de l'année de votre désinscription
          afin de pouvoir nous défendre contre d'éventuelles réclamations.
        </p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Durées de conservation</h2>
        <ul>
          <li>Nous conservons les données contractuelles jusqu'à l'exécution complète du contrat et l'expiration du délai légal de garantie de deux ans.</li>
          <li>Nous conservons les factures et pièces comptables pendant huit ans (article 147, paragraphes 1 et 3 du Code fiscal allemand, AO).</li>
          <li>Nous conservons la correspondance commerciale, par exemple les confirmations de commande, pendant six ans (article 147, paragraphes 1 et 3 AO).</li>
          <li>Ces délais courent à partir de la fin de l'année civile de création du document. Pendant ce temps, nous limitons le traitement à la conservation.</li>
          <li>Nous supprimons toutes les autres données dès qu'elles ne sont plus nécessaires – les délais figurent dans chaque section.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Liens externes et réseaux sociaux</h2>
        <p>
          Nous renvoyons vers nos profils Instagram et Facebook ainsi que vers WhatsApp. Il s'agit de
          simples liens, non de modules intégrés : la simple visite de notre site ne transmet
          aucune donnée à ces prestataires.
        </p>
        <p>
          Ce n'est qu'en cliquant sur un lien que la page du prestataire s'ouvre ; celui-ci traite
          alors vos données sous sa propre responsabilité. Le prestataire d'Instagram et de Facebook
          est {META_IRELAND} ; celui de WhatsApp est {WHATSAPP_IRELAND}. Des données peuvent être
          transférées aux États-Unis. Consultez les politiques de confidentialité des prestataires.
        </p>
      </section>

      <section>
        <h2 id="rechte">17. Vos droits</h2>
        <p>Vous disposez des droits suivants concernant vos données :</p>
        <ul>
          <li>Accès (article 15 du RGPD)</li>
          <li>Rectification (article 16 du RGPD)</li>
          <li>Effacement (article 17 du RGPD)</li>
          <li>Limitation du traitement (article 18 du RGPD)</li>
          <li>Portabilité (article 20 du RGPD)</li>
          <li>Retrait du consentement pour l'avenir (article 7, paragraphe 3 du RGPD) ; le traitement effectué jusque-là reste licite</li>
        </ul>
        <p>
          <strong>Droit d'opposition (article 21 du RGPD) :</strong> Lorsque nous traitons des
          données sur la base de l'article 6, paragraphe 1, point f) du RGPD, vous pouvez vous y
          opposer à tout moment pour des raisons tenant à votre situation particulière. Nous cessons
          alors le traitement, sauf motifs légitimes impérieux ou constatation, exercice ou défense
          de droits en justice. Après une opposition, nous ne vous envoyons plus jamais de publicité.
        </p>
        <p>Un simple message à {c.email} suffit pour toute demande.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Droit d'introduire une réclamation</h2>
        <p>Vous pouvez introduire une réclamation auprès d'une autorité de contrôle (article 77 du RGPD), par exemple dans votre pays de résidence. L'autorité compétente pour nous est :</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Sécurité, décisions automatisées, modifications</h2>
        <p>
          La connexion à notre site est chiffrée par TLS (reconnaissable à « https:// »). Nous ne
          prenons aucune décision automatisée et ne pratiquons pas de profilage au sens de l'article
          22 du RGPD. Nous adaptons la présente politique lorsque notre site ou la loi évoluent.
        </p>
        <p>
          Dernière mise à jour : {c.effectiveDate ?? <Missing field="effectiveDate" label="date d'entrée en vigueur" />}
        </p>
      </section>
    </>
  );
}
