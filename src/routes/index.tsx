import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import type { ScrollScrubScene } from "@/components/scroll-scrub/scroll-scrub";
import { Arrow, PHOENIX, ProductCard } from "@/components/site/chrome";
import { byCategory, categories, featured } from "@/data/catalog";
import type { CategoryId } from "@/data/catalog";
import { getSoldSlugs } from "@/lib/shop.functions";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  loader: async () => ({ sold: await getSoldSlugs() }),
  component: Index,
});

// Module constant: the journey scenes plus their CTAs. Never rebuilt per render.
const journey: ScrollScrubScene[] = scrollScrubScenes.map((scene, index) => {
  if (index === 0) {
    return {
      ...scene,
      actions: (
        <div className="af-hero-actions">
          <Link className="af-cta-gold" search={{ kat: "alle" }} to="/kollektion">
            Kollektion ansehen <Arrow />
          </Link>
          <Link className="af-cta-line" search={{ produkt: "", thema: "beratung" }} to="/anfrage">
            Persönlich beraten lassen
          </Link>
        </div>
      ),
    };
  }
  if (index === scrollScrubScenes.length - 1) {
    return {
      ...scene,
      actions: (
        <div className="af-hero-actions">
          <a className="af-cta-frame" href="#finden">
            Mein Stück finden
          </a>
        </div>
      ),
    };
  }
  return scene;
});

const facts = [
  { big: "100 %", text: "Echthaar. Kein Kunsthaar, keine Mischung." },
  { big: "1 von 1", text: "Jedes Stück wird einzeln gefertigt und existiert genau einmal." },
  { big: "2 bis 5", text: "Werktage, bis ein lagerndes Stück bei Ihnen ist." },
  { big: "15 bis 20", text: "Tage für ein Stück, das nach Ihren Maßen entsteht." },
];

const craft = [
  { key: "Die Basis", text: "Nano Skin, dünn wie eine zweite Haut. Sie liegt flach auf und verschwindet unter Ihrem Ansatz." },
  { key: "Das Haar", text: "Jedes einzelne Haar wird von Hand injiziert. So wächst es scheinbar direkt aus der Kopfhaut." },
  { key: "Der Scheitel", text: "Frei in jede Richtung. Sie tragen ihn links, rechts oder mittig, so wie heute Ihr Tag ist." },
  { key: "Der Halt", text: "Clips, die in Sekunden sitzen und abends genauso schnell wieder gelöst sind." },
];

const methods = ["Butterfly Weft", "Genius Weft", "Invisible Tape", "Tape-In", "Keratin Bondings", "Clip-In"];

const steps = [
  {
    title: "Sie wählen Ihr Stück",
    text: "Im Shop oder gemeinsam mit Andrea. Ein Foto bei Tageslicht genügt, und sie sagt Ihnen ehrlich, welche Farbe zu Ihnen passt.",
  },
  {
    title: "Andrea bestätigt persönlich",
    text: "Sie prüft Ihr Stück noch einmal von Hand und schreibt Ihnen. Erst danach bezahlen Sie, per PayPal oder Überweisung.",
  },
  {
    title: "Aufsetzen. Wiedererkennen.",
    text: "Lagernde Stücke sind in 2 bis 5 Werktagen mit DHL bei Ihnen. Diskret verpackt, sofort tragbar.",
  },
];

const faqs = [
  {
    q: "Sieht man, dass ich ein Haarteil trage?",
    a: "Dafür ist die Nano-Skin-Basis gemacht. Jedes Haar wird einzeln injiziert, deshalb sieht der Scheitel aus wie Ihre eigene Kopfhaut. Selbst aus der Nähe ist kein Rand und kein Knoten zu erkennen.",
  },
  {
    q: "Woher weiß ich, welche Farbe passt?",
    a: "Schicken Sie Andrea über die Beratung ein Foto Ihres Haars bei Tageslicht. Sie vergleicht es mit den Stücken im Atelier und sagt Ihnen offen, welches passt und welches nicht.",
  },
  {
    q: "Wie wird ein Topper befestigt?",
    a: "Mit kleinen Clips an Ihrem eigenen Haar. Das dauert Sekunden, hält den ganzen Tag und braucht weder Kleber noch einen Friseurtermin.",
  },
  {
    q: "Wie schnell ist mein Stück bei mir?",
    a: "Lagernde Stücke verschicken wir mit DHL, sie sind in 2 bis 5 Werktagen bei Ihnen. Eine Maßanfertigung braucht 15 bis 20 Tage, weil sie erst für Sie entsteht.",
  },
  {
    q: "Wann und wie bezahle ich?",
    a: "Nicht beim Absenden der Bestellung. Andrea bestätigt Ihr Stück zuerst persönlich und schickt Ihnen dann die Zahlungsdaten für PayPal oder Überweisung.",
  },
  {
    q: "Ich finde mein Stück nicht. Geht es nach Maß?",
    a: "Ja. Länge, Farbe, Dichte und Basis werden auf Sie abgestimmt. Beschreiben Sie Andrea, was Sie sich wünschen, und sie meldet sich mit einem Vorschlag.",
  },
];

function Index() {
  const { sold } = Route.useLoaderData();
  const [need, setNeed] = useState<CategoryId>("toppers");
  const active = categories.find((category) => category.id === need) ?? categories[0];
  const picks = byCategory(need)
    .filter((product) => !product.sold && !sold.includes(product.slug))
    .slice(0, 4);

  return (
    <main>
      <ScrollScrub scenes={journey} theme={scrollScrubTheme} />

      <section aria-label="Auf einen Blick" className="af-section--tight">
        <div className="af-wrap af-facts">
          {facts.map((fact) => (
            <div className="af-fact af-rise" key={fact.big}>
              <strong>{fact.big}</strong>
              <span>{fact.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="af-section" id="finden">
        <div className="af-wrap">
          <div className="af-stack af-rise">
            <h2 className="af-h2">Was fehlt Ihnen gerade?</h2>
            <p className="af-lead">
              Sagen Sie es uns, und wir zeigen Ihnen die Stücke, die dafür gemacht sind.
            </p>
          </div>
          <div aria-label="Bedarf wählen" className="af-finder__tabs" role="tablist">
            {categories.map((category) => (
              <button
                aria-selected={need === category.id}
                className="af-tab"
                key={category.id}
                onClick={() => setNeed(category.id)}
                role="tab"
                type="button"
              >
                {category.need}
              </button>
            ))}
          </div>
          <div className="af-finder__head">
            <p className="af-text">{active.caption}</p>
            <Link className="af-cta-line" search={{ kat: active.id }} to="/kollektion">
              Alle {active.label} <Arrow />
            </Link>
          </div>
          <div className="af-grid" role="tabpanel">
            {picks.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="af-section af-surface" id="handwerk">
        <div className="af-wrap af-split">
          <div className="af-split__media af-rise">
            <img
              alt="Hände, die einzelne Haare in eine hauchdünne Basis einarbeiten"
              decoding="async"
              height={1200}
              loading="lazy"
              src="/assets/content/craft.jpg"
              width={1600}
            />
          </div>
          <div className="af-rise">
            <p className="af-mono">Das Handwerk</p>
            <h2 className="af-h2" style={{ marginTop: 18 }}>
              Haar für Haar. Von Hand.
            </h2>
            <p className="af-lead" style={{ marginTop: 22 }}>
              Ein Topper von der Stange sitzt auf dem Kopf. Unserer wird Teil davon. Der Unterschied
              liegt in vier Dingen.
            </p>
            <ul className="af-list">
              {craft.map((item) => (
                <li key={item.key}>
                  <b>{item.key}</b>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="af-section">
        <div className="af-wrap">
          <div className="af-finder__head" style={{ marginTop: 0 }}>
            <div className="af-stack af-rise">
              <h2 className="af-h2">Gerade im Atelier.</h2>
              <p className="af-lead">
                Jedes dieser Stücke gibt es ein einziges Mal. Ist es verkauft, kommt es nicht wieder.
              </p>
            </div>
            <Link className="af-cta-line" search={{ kat: "alle" }} to="/kollektion">
              Ganze Kollektion <Arrow />
            </Link>
          </div>
          <div className="af-grid">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} sold={sold.includes(product.slug)} />
            ))}
          </div>
        </div>
      </section>

      <section className="af-phoenix" id="geschichte">
        <div aria-hidden="true" className="af-phoenix__bg">
          <img alt="" decoding="async" height={1152} loading="lazy" src="/assets/content/phoenix.jpg" width={2048} />
        </div>
        <div className="af-wrap af-phoenix__in">
          <img alt="Der Phönix, das Zeichen von Andrea's Fashion Hair" className="af-phoenix__mark" height={84} src={PHOENIX} width={84} />
          <h2 className="af-h2">Der Phönix ist kein Zufall.</h2>
          <p className="af-lead">
            Mit neunzehn begann Andrea in Rio de Janeiro, mit Haaren zu arbeiten. Seitdem hat sie
            erlebt, was mit einem Menschen geschieht, der sein Haar verliert. Und was geschieht, wenn
            es zurückkommt.
          </p>
          <blockquote className="af-quote">
            „Wenn das Haar wieder da ist, ist der Mensch ein anderer. Er ist wie neu geboren.“
          </blockquote>
          <p className="af-quote-by">Andrea, Gründerin und Haarmacherin</p>
          <p className="af-lead">
            Deshalb trägt jedes Stück aus ihrem Atelier dieses Zeichen. Es steht nicht für Haar. Es
            steht für den Morgen danach.
          </p>
        </div>
      </section>

      <section className="af-section af-surface" id="extensions">
        <div className="af-wrap af-split af-split--flip">
          <div className="af-rise">
            <p className="af-mono">Extensions</p>
            <h2 className="af-h2" style={{ marginTop: 18 }}>
              Länge, die Ihnen niemand ansieht.
            </h2>
            <p className="af-lead" style={{ marginTop: 22 }}>
              Echthaar-Extensions in sechs Methoden, für Kundinnen und für Salons. Andrea stellt
              Ihnen Farbe, Länge und Menge persönlich zusammen.
            </p>
            <ul className="af-methods">
              {methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
            <div className="af-hero-actions" style={{ marginTop: 34 }}>
              <Link className="af-cta-gold" search={{ produkt: "", thema: "extensions" }} to="/anfrage">
                Extensions anfragen <Arrow />
              </Link>
            </div>
          </div>
          <div className="af-split__media af-rise">
            <img
              alt="Echthaar-Extensions in drei Farbtönen: Weft, Tape, Bondings und Clip-In"
              decoding="async"
              height={1200}
              loading="lazy"
              src="/assets/content/extensions.jpg"
              width={1600}
            />
          </div>
        </div>
      </section>

      <section className="af-section">
        <div className="af-wrap">
          <div className="af-stack af-rise">
            <h2 className="af-h2">Drei Schritte. Kein Risiko.</h2>
            <p className="af-lead">Sie bezahlen erst, wenn Andrea Ihr Stück persönlich bestätigt hat.</p>
          </div>
          <div className="af-steps">
            {steps.map((step) => (
              <div className="af-step af-rise" key={step.title}>
                <h3 className="af-h3">{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="af-section af-surface" id="fragen">
        <div className="af-wrap">
          <h2 className="af-h2 af-rise">Was Sie vorher wissen möchten.</h2>
          <div className="af-faq">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <i aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="af-section">
        <div className="af-wrap">
          <div className="af-close af-rise">
            <img
              alt="Eine Frau vor dem Atelierspiegel, die ihr Haar berührt"
              decoding="async"
              height={1200}
              loading="lazy"
              src="/assets/content/mirror.jpg"
              width={1600}
            />
            <div className="af-close__in">
              <h2 className="af-h1">Der Spiegel wartet.</h2>
              <p className="af-lead">
                Ihr Stück ist vielleicht schon fertig. Sehen Sie nach, bevor es jemand anderes trägt.
              </p>
              <div className="af-hero-actions">
                <Link className="af-cta-gold" search={{ kat: "alle" }} to="/kollektion">
                  Kollektion ansehen <Arrow />
                </Link>
                <Link className="af-cta-line" search={{ produkt: "", thema: "beratung" }} to="/anfrage">
                  Persönlich beraten lassen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
