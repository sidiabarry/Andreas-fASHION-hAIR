import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Information manquante : {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Remarque :</strong> Seule la version allemande fait foi ; la présente traduction est
        fournie pour faciliter votre compréhension.
      </p>
      <section>
        <h2 id="anbieter">1. Éditrice du site</h2>
        <p>Informations selon l'article 5 de la loi allemande sur les services numériques (DDG)</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="nom complet de la propriétaire" />}
          <br />
          Nom commercial : {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="forme juridique" />}
          <br />
          {c.street}
          <br />
          {c.zip} {c.city}
          <br />
          {c.country}
        </p>
      </section>

      <section>
        <h2 id="kontakt">2. Contact</h2>
        <dl>
          <dt>Téléphone</dt>
          <dd>{c.phone}</dd>
          <dt>E-mail</dt>
          <dd>{c.email}</dd>
          <dt>Disponibilité</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. TVA et immatriculation</h2>
        {c.vatId ? (
          <p>Numéro d'identification à la TVA selon l'article 27a de la loi allemande sur la TVA : {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>
            La propriétaire relève du régime des petites entreprises au sens de l'article 19 de la
            loi allemande sur la TVA (UStG). Aucune TVA n'est facturée.
          </p>
        ) : (
          <p>
            Numéro de TVA : <Missing field="vatId" label="numéro de TVA (si attribué) ou statut de petite entreprise" />
          </p>
        )}
        {c.tradeRegister ? (
          <p>Immatriculation : {c.tradeRegister}</p>
        ) : (
          <p>L'entreprise n'est pas inscrite au registre du commerce.</p>
        )}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Règlement des litiges de consommation</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Nous sommes disposés à participer à une procédure de règlement des litiges devant un organisme de médiation de la consommation. L'organisme compétent est :</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Nous déclarons par la présente participer aux procédures de règlement des litiges devant cet organisme.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>
            Nous ne sommes ni disposés ni tenus à participer à une procédure de règlement des litiges
            devant un organisme de médiation de la consommation. Pour toute question ou difficulté,
            écrivez-nous directement – nous trouverons une solution ensemble.
          </p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="décision sur la médiation de la consommation (art. 36 VSBG)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. À propos de ce site</h2>
        <p>
          Nous rédigeons le contenu de ce site avec soin. Les pages d'autres prestataires vers
          lesquelles nous renvoyons relèvent de leur responsabilité. Les photos et textes de ce site
          sont protégés par le droit d'auteur ; merci de nous demander avant de les utiliser.
        </p>
      </section>
    </>
  );
}
