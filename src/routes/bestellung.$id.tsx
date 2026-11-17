import { Link, createFileRoute } from "@tanstack/react-router";

import { Arrow, PHOENIX } from "@/components/site/chrome";
import { formatPrice } from "@/data/catalog";
import { getOrder } from "@/lib/shop.functions";

export const Route = createFileRoute("/bestellung/$id")({
  loader: async ({ params }) => ({ order: await getOrder({ data: { id: params.id } }) }),
  head: () => ({ meta: [{ title: "Ihre Reservierung | Andrea's Fashion Hair" }] }),
  component: OrderPage,
});

function OrderPage() {
  const { order } = Route.useLoaderData();

  if (!order) {
    return (
      <main className="af-page">
        <div className="af-wrap af-empty">
          <h1 className="af-h2">Diese Reservierung finden wir nicht.</h1>
          <p className="af-lead">Bitte prüfen Sie den Link aus Ihrer Bestätigung.</p>
          <Link className="af-cta-line" search={{ kat: "alle" }} to="/kollektion">
            Zur Kollektion
          </Link>
        </div>
      </main>
    );
  }

  const first = order.name.split(" ")[0];

  return (
    <main className="af-page">
      <div className="af-wrap" style={{ maxWidth: 820 }}>
        <img alt="" height={64} src={PHOENIX} width={64} />
        <p className="af-mono" style={{ marginTop: 28 }}>
          Reservierung {order.id}
        </p>
        <h1 className="af-h1" style={{ marginTop: 16 }}>
          Danke, {first}. Ihr Stück ist reserviert.
        </h1>
        <p className="af-lead" style={{ marginTop: 24 }}>
          Andrea prüft es jetzt noch einmal von Hand und schreibt Ihnen an {order.email}. In dieser
          Nachricht stehen die Zahlungsdaten für{" "}
          {order.payment === "ueberweisung" ? "die Überweisung" : "PayPal"}. Bis dahin müssen Sie
          nichts tun.
        </p>

        <div className="af-sum" style={{ marginTop: 44, position: "static" }}>
          {order.lines.map((line) => (
            <div className="af-sum__row" key={line.name}>
              <span>
                {line.quantity > 1 ? `${line.quantity} x ` : ""}
                {line.name}
              </span>
              <span>{formatPrice(line.unitCents * line.quantity)}</span>
            </div>
          ))}
          <div className="af-sum__row af-sum__total">
            <span>Gesamt</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </div>

        <div className="af-hero-actions" style={{ marginTop: 40 }}>
          <Link className="af-cta-line" search={{ kat: "pflege" }} to="/kollektion">
            Passende Pflege ansehen <Arrow />
          </Link>
        </div>
      </div>
    </main>
  );
}
