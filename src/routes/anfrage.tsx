import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";

import { Field } from "@/components/site/chrome";
import { createInquiry } from "@/lib/shop.functions";

const topics = [
  { id: "beratung", label: "Persönliche Beratung" },
  { id: "extensions", label: "Extensions" },
  { id: "massanfertigung", label: "Maßanfertigung" },
  { id: "salon", label: "Anfrage als Salon" },
];

const intro: Record<string, { title: string; lead: string; hint: string }> = {
  beratung: {
    title: "Andrea antwortet persönlich.",
    lead: "Beschreiben Sie, was Sie sich wünschen. Ein Foto ist nicht nötig, eine ehrliche Beschreibung genügt für den Anfang.",
    hint: "Zum Beispiel: Wo Ihr Haar lichter wird, Ihre Haarfarbe und welche Länge Sie tragen möchten.",
  },
  extensions: {
    title: "Ihre Extensions, zusammengestellt für Sie.",
    lead: "Sagen Sie uns Methode, Wunschlänge und Haarfarbe. Andrea meldet sich mit einem Vorschlag und einem festen Preis.",
    hint: "Zum Beispiel: Tape-In, etwa 50 cm, mittelblond, für feines Haar.",
  },
  massanfertigung: {
    title: "Ein Stück, das nur für Sie entsteht.",
    lead: "Länge, Farbe, Dichte und Basis werden auf Sie abgestimmt. Die Fertigung dauert 15 bis 20 Tage.",
    hint: "Zum Beispiel: Topper für den Oberkopf, 35 cm, aschblond, leicht gewellt.",
  },
  salon: {
    title: "Für Salons und Friseurinnen.",
    lead: "Sie möchten Echthaar für Ihre Kundinnen beziehen? Schreiben Sie uns, welche Mengen und Methoden Sie brauchen.",
    hint: "Zum Beispiel: Welche Methoden Sie anbieten und welche Farben am häufigsten gefragt sind.",
  },
};

export const Route = createFileRoute("/anfrage")({
  validateSearch: (search: Record<string, unknown>): { thema: string; produkt: string } => ({
    produkt: typeof search.produkt === "string" ? search.produkt.slice(0, 160) : "",
    thema: typeof search.thema === "string" && intro[search.thema] ? search.thema : "beratung",
  }),
  head: () => ({ meta: [{ title: "Beratung | Andrea's Fashion Hair" }] }),
  component: InquiryPage,
});

function InquiryPage() {
  const { produkt, thema } = Route.useSearch();
  const [topic, setTopic] = useState(thema);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const copy = intro[topic] ?? intro.beratung;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    setState("busy");
    setError(null);
    try {
      await createInquiry({
        data: {
          email: text("email"),
          message: text("message"),
          name: text("name"),
          phone: text("phone"),
          product: produkt,
          topic,
        },
      });
      setState("done");
    } catch {
      setError("Die Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Angaben und versuchen Sie es noch einmal.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <main className="af-page">
        <div className="af-wrap af-empty">
          <p className="af-mono">Anfrage gesendet</p>
          <h1 className="af-h1">Danke. Andrea meldet sich bei Ihnen.</h1>
          <p className="af-lead">
            Sie liest jede Nachricht selbst und antwortet per E-Mail. Meist dauert das nicht länger
            als ein, zwei Werktage.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="af-page">
      <div className="af-wrap af-pdp">
        <div className="af-stack" style={{ position: "sticky", top: 110 }}>
          <p className="af-mono">Beratung</p>
          <h1 className="af-h2">{copy.title}</h1>
          <p className="af-lead">{copy.lead}</p>
          {produkt ? <p className="af-only">Ihre Frage bezieht sich auf: {produkt}</p> : null}
        </div>

        <form className="af-form" onSubmit={onSubmit}>
          <Field label="Worum geht es?" name="topic">
            <select id="topic" name="topic" onChange={(event) => setTopic(event.target.value)} value={topic}>
              {topics.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="af-form__two">
            <Field label="Ihr Name" name="name">
              <input autoComplete="name" id="name" minLength={2} name="name" required />
            </Field>
            <Field label="E-Mail" name="email">
              <input autoComplete="email" id="email" name="email" required type="email" />
            </Field>
          </div>
          <Field label="Telefon oder WhatsApp (freiwillig)" name="phone">
            <input autoComplete="tel" id="phone" name="phone" type="tel" />
          </Field>
          <Field label="Ihre Nachricht" name="message">
            <textarea id="message" maxLength={1600} minLength={5} name="message" placeholder={copy.hint} required />
          </Field>
          {error ? (
            <p className="af-msg" data-kind="error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="af-cta-band" disabled={state === "busy"} type="submit">
            {state === "busy" ? "Wird gesendet" : "Anfrage senden"}
          </button>
          <p className="af-note">Ihre Angaben gehen nur an Andrea und werden nicht weitergegeben.</p>
        </form>
      </div>
    </main>
  );
}
