// STUB: Platzhalter, bis der Rechtsagent src/content/legal/impressum.tsx liefert (Branch legal-texts).
import type { Company } from "./company-type";

export const isStub = true;

export default function Page({ company }: { company: Company }) {
  return (
    <section data-legal-stub="impressum">
      <p>
        Dieser Text wird gerade erstellt. Bei Fragen erreichen Sie uns unter {company.email} oder {company.phone}.
      </p>
    </section>
  );
}
