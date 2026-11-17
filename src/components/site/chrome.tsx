import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { formatPrice, getProduct, isUnique } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import { subscribeNewsletter } from "@/lib/shop.functions";

import { useCart } from "./cart";

export const PHOENIX = "/assets/brand/phoenix.png";

export function Arrow() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 18 14" width="18">
      <path d="M1 7h15M10.5 1.5 16 7l-5.500 5.500" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Slides content up as it enters the viewport. Transform only: nothing is ever hidden. */
export function useRise() {
  const { pathname } = useLocation();
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".af-rise:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);
}

export function SiteNav() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = (
    <>
      <Link search={{ kat: "alle" }} to="/kollektion">
        Kollektion
      </Link>
      <a href="/#extensions">Extensions</a>
      <a href="/#handwerk">Handwerk</a>
      <a href="/#geschichte">Geschichte</a>
      <Link search={{ produkt: "", thema: "beratung" }} to="/anfrage">
        Beratung
      </Link>
    </>
  );

  return (
    <>
      <header className="af-nav">
        <div className="af-wrap af-nav__in">
          <Link aria-label="Andrea's Fashion Hair, Startseite" className="af-brand" to="/">
            <img alt="" height={38} src={PHOENIX} width={38} />
            <span>Andrea&apos;s Fashion Hair</span>
          </Link>
          <nav aria-label="Hauptnavigation" className="af-nav__links">
            {links}
          </nav>
          <div className="af-nav__right">
            <Link className="af-bag" to="/warenkorb">
              Warenkorb <b>{cart.ready ? cart.count : 0}</b>
            </Link>
            <button
              aria-expanded={open}
              className="af-menu"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {open ? "Schließen" : "Menü"}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <nav aria-label="Mobile Navigation" className="af-sheet">
          {links}
        </nav>
      ) : null}
      <CartToast />
    </>
  );
}

function CartToast() {
  const cart = useCart();
  const product = cart.justAdded ? getProduct(cart.justAdded) : undefined;
  if (!product) {
    return null;
  }
  return (
    <div className="af-toast" role="status">
      <span>{product.name} liegt im Warenkorb.</span>
      <Link onClick={cart.dismiss} to="/warenkorb">
        Zur Kasse
      </Link>
    </div>
  );
}

export function SiteFooter() {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setState("busy");
    try {
      await subscribeNewsletter({ data: { email } });
      setState("ok");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <footer className="af-foot">
      <div className="af-wrap">
        <div className="af-foot__grid">
          <div className="af-stack">
            <Link className="af-brand" to="/">
              <img alt="" height={38} src={PHOENIX} width={38} />
              <span>Andrea&apos;s Fashion Hair</span>
            </Link>
            <p className="af-text">
              Echthaar-Topper, Perücken und Haarsysteme, von Hand gefertigt. Für den Moment, in dem
              Sie sich wiedererkennen.
            </p>
          </div>
          <div>
            <h4>Kollektion</h4>
            <ul>
              <li>
                <Link search={{ kat: "toppers" }} to="/kollektion">
                  Topper
                </Link>
              </li>
              <li>
                <Link search={{ kat: "peruecken" }} to="/kollektion">
                  Perücken
                </Link>
              </li>
              <li>
                <Link search={{ kat: "pony" }} to="/kollektion">
                  Pony
                </Link>
              </li>
              <li>
                <Link search={{ kat: "maenner" }} to="/kollektion">
                  Für Männer
                </Link>
              </li>
              <li>
                <Link search={{ kat: "pflege" }} to="/kollektion">
                  Pflege
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Atelier</h4>
            <ul>
              <li>
                <a href="/#geschichte">Andreas Geschichte</a>
              </li>
              <li>
                <a href="/#handwerk">Handwerk</a>
              </li>
              <li>
                <a href="/#fragen">Häufige Fragen</a>
              </li>
              <li>
                <Link search={{ produkt: "", thema: "massanfertigung" }} to="/anfrage">
                  Maßanfertigung
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Neue Stücke zuerst sehen</h4>
            <p className="af-note">
              Jedes Stück gibt es einmal. Wir schreiben Ihnen, sobald ein neues fertig ist.
            </p>
            <form className="af-news" onSubmit={onSubmit}>
              <input
                aria-label="E-Mail-Adresse"
                autoComplete="email"
                name="email"
                placeholder="ihre@email.de"
                required
                type="email"
              />
              <button disabled={state === "busy"} type="submit">
                Eintragen
              </button>
            </form>
            {state === "ok" ? <p className="af-note af-gold">Danke. Sie hören von uns.</p> : null}
            {state === "error" ? (
              <p className="af-note">Das hat nicht geklappt. Bitte prüfen Sie die Adresse.</p>
            ) : null}
          </div>
        </div>
        <div className="af-foot__base">
          <span>© {new Date().getFullYear()} Andrea&apos;s Fashion Hair</span>
          <span>Von Hand gefertigt. Versand mit DHL, weltweit.</span>
        </div>
      </div>
    </footer>
  );
}

export function ProductCard({ product, sold }: { product: Product; sold?: boolean }) {
  const isSold = product.sold || Boolean(sold);
  const flag = isSold ? "Verkauft" : product.madeToOrder ? "Nach Maß" : isUnique(product) ? "Einzelstück" : null;
  return (
    <Link className="af-card af-rise" data-sold={isSold} params={{ slug: product.slug }} to="/produkt/$slug">
      <div className="af-card__media">
        <img alt={`${product.name}, ${product.subtitle}`} decoding="async" height={800} loading="lazy" src={product.image} width={600} />
        {flag ? (
          <span className="af-card__flag" data-sold={isSold}>
            {flag}
          </span>
        ) : null}
      </div>
      <div className="af-card__row">
        <span className="af-card__name">{product.name}</span>
        <span className="af-card__price">{formatPrice(product.priceCents)}</span>
      </div>
      <p className="af-card__sub">{product.subtitle}</p>
    </Link>
  );
}

export function Field({ children, label, name }: { children: ReactNode; label: string; name: string }) {
  return (
    <div className="af-field">
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  );
}
