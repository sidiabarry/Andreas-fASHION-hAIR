// STUB: Platzhalter, bis der Rechtsagent src/content/legal/datenschutz.tsx liefert (Branch legal-texts).
import type { Company } from "./company-type";

export const isStub = true;

export default function Page({ company }: { company: Company }) {
  return (
    <section data-legal-stub="datenschutz">
      <p>
        Dieser Text wird gerade erstellt. Bei Fragen erreichen Sie uns unter {company.email} oder {company.phone}.
      </p>
    </section>
  );
}
