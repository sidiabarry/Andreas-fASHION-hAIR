import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";

import { useCart } from "@/components/site/cart";
import { Arrow, Field } from "@/components/site/chrome";
import { formatPrice, isUnique } from "@/data/catalog";
import { createOrder } from "@/lib/shop.functions";

export const Route = createFileRoute("/warenkorb")({
  head: () => ({ meta: [{ title: "Warenkorb | Andrea's Fashion Hair" }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    setBusy(true);
    setError(null);
    try {
      const result = await createOrder({
        data: {
          customer: {
            city: text("city"),
            country: text("country") || "Deutschland",
            email: text("email"),
            name: text("name"),
            note: text("note"),
            payment: text("payment") === "ueberweisung" ? "ueberweisung" : "paypal",
            phone: text("phone"),
            postalCode: text("postalCode"),
            street: text("street"),
          },
          items: cart.lines,
        },
      });
      cart.clear();
      await navigate({ params: { id: result.id }, to: "/bestellung/$id" });
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Die Bestellung konnte nicht gesendet werden. Bitte prüfen Sie Ihre Angaben.",
      );
      setBusy(false);
    }
  }

  if (!cart.ready) {
    return (
      <main className="af-page">
        <div className="af-wrap">
          <h1 className="af-h1">Ihr Warenkorb</h1>
          <p className="af-lead" style={{ marginTop: 22 }}>
            Einen Augenblick.
          </p>
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="af-page">
        <div className="af-wrap">
          <h1 className="af-h1">Ihr Warenkorb</h1>
          <div className="af-empty">
            <p className="af-lead">
              Noch liegt nichts darin. Ihr Stück ist vielleicht schon fertig und wartet im Atelier.
            </p>
            <Link className="af-cta-gold" search={{ kat: "alle" }} to="/kollektion">
              Kollektion ansehen <Arrow />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="af-page">
      <div className="af-wrap">
        <h1 className="af-h1">Ihr Warenkorb</h1>
        <p className="af-lead" style={{ marginTop: 22 }}>
          Sie bezahlen jetzt noch nichts. Andrea bestätigt Ihr Stück zuerst persönlich.
        </p>

        <div className="af-cart">
          <div>
            {cart.items.map(({ product, quantity }) => (
              <div className="af-line" key={product.slug}>
                <img alt="" height={118} src={product.image} width={92} />
                <div>
                  <Link params={{ slug: product.slug }} to="/produkt/$slug">
                    <b>{product.name}</b>
                  </Link>
                  <p className="af-note">{product.subtitle}</p>
                  {isUnique(product) ? (
                    <p className="af-note af-gold">Einzelstück</p>
                  ) : (
                    <p className="af-note">
                      Menge:{" "}
                      <select
                        aria-label={`Menge für ${product.name}`}
                        onChange={(event) => cart.setQuantity(product.slug, Number(event.target.value))}
                        style={{ width: 76, height: 36, paddingInline: 10 }}
                        value={quantity}
                      >
                        {[1, 2, 3, 4, 5, 6].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </p>
                  )}
                  <button onClick={() => cart.remove(product.slug)} type="button">
                    Entfernen
                  </button>
                </div>
                <span className="af-card__price">{formatPrice(product.priceCents * quantity)}</span>
              </div>
            ))}

            <form className="af-form" id="kasse" onSubmit={onSubmit} style={{ marginTop: 48 }}>
              <h2 className="af-h3">Wohin dürfen wir liefern?</h2>
              <div className="af-form__two">
                <Field label="Vor- und Nachname" name="name">
                  <input autoComplete="name" id="name" minLength={2} name="name" required />
                </Field>
                <Field label="E-Mail" name="email">
                  <input autoComplete="email" id="email" name="email" required type="email" />
                </Field>
              </div>
              <div className="af-form__two">
                <Field label="Straße und Hausnummer" name="street">
                  <input autoComplete="street-address" id="street" minLength={3} name="street" required />
                </Field>
                <Field label="Telefon (für Rückfragen, freiwillig)" name="phone">
                  <input autoComplete="tel" id="phone" name="phone" type="tel" />
                </Field>
              </div>
              <div className="af-form__two">
                <Field label="Postleitzahl" name="postalCode">
                  <input autoComplete="postal-code" id="postalCode" minLength={3} name="postalCode" required />
                </Field>
                <Field label="Ort" name="city">
                  <input autoComplete="address-level2" id="city" minLength={2} name="city" required />
                </Field>
              </div>
              <div className="af-form__two">
                <Field label="Land" name="country">
                  <input autoComplete="country-name" defaultValue="Deutschland" id="country" name="country" required />
                </Field>
                <Field label="So möchte ich bezahlen" name="payment">
                  <select defaultValue="paypal" id="payment" name="payment">
                    <option value="paypal">PayPal</option>
                    <option value="ueberweisung">Überweisung</option>
                  </select>
                </Field>
              </div>
              <Field label="Nachricht an Andrea (freiwillig)" name="note">
                <textarea id="note" maxLength={800} name="note" placeholder="Zum Beispiel Ihre Haarfarbe oder eine Frage zur Befestigung." />
              </Field>
              {error ? (
                <p className="af-msg" data-kind="error" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          </div>

          <aside className="af-sum">
            <div className="af-sum__row">
              <span>Zwischensumme</span>
              <span>{formatPrice(cart.subtotalCents)}</span>
            </div>
            <div className="af-sum__row">
              <span>Versand in Deutschland</span>
              <span>inklusive</span>
            </div>
            <div className="af-sum__row af-sum__total">
              <span>Gesamt</span>
              <span>{formatPrice(cart.subtotalCents)}</span>
            </div>
            <button className="af-cta-band" disabled={busy} form="kasse" type="submit">
              {busy ? "Wird gesendet" : "Verbindlich reservieren"}
            </button>
            <p className="af-note">
              Mit dem Absenden reservieren Sie Ihr Stück. Andrea bestätigt per E-Mail und schickt
              Ihnen die Zahlungsdaten. Für Lieferungen ins Ausland nennt sie Ihnen vorab die
              Versandkosten.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
