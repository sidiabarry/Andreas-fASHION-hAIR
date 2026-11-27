"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { useLocalList, WISHLIST_KEY } from "@/components/cart/useLocalList";
import { MethodDiagram } from "@/components/extensions/MethodDiagram";
import { Logo } from "@/components/Logo";
import { Link, usePathname } from "@/i18n/navigation";
import type { MethodId } from "@/lib/collection";

import "../shop.css";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { UnitToggle } from "./UnitToggle";

export type NavMethod = { id: MethodId; image: string | null; onRequest: boolean };

export function Header({ methods = [] }: { methods?: NavMethod[] }) {
  const t = useTranslations();
  const cart = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const megaTimer = useRef<number | undefined>(undefined);
  const menuButton = useRef<HTMLButtonElement>(null);
  const count = cart.ready ? cart.count : 0;
  const wishlist = useLocalList(WISHLIST_KEY);

  // Menü schließen, sobald sich die Seite ändert (Zustand beim Rendern anpassen)
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
    setMega(false);
  }

  // Extensions-Menü: Escape schließt
  useEffect(() => {
    if (!mega) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMega(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega]);
  const megaOpen = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const megaClose = () => {
    window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMega(false), 180);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (pathname === href ? "page" : undefined);
  // Reihenfolge laut Rangfolge: Extensions, Perücken und Topper, Maßanfertigung (immer sichtbar), Pflege, Andréia, Beratung
  const extLink = (
    <Link aria-current={current("/extensions")} href="/extensions">
      {t("nav.extensions")}
    </Link>
  );
  const links = (
    <>
      <Link href={{ pathname: "/kollektion", query: { kategorie: "topper" } }}>{t("nav.wigs")}</Link>
      <Link aria-current={current("/massanfertigung")} href="/massanfertigung">
        {t("nav.custom")}
      </Link>
      <Link aria-current={current("/ueber-andrea")} href="/ueber-andrea">
        {t("nav.about")}
      </Link>
      <Link aria-current={current("/anfrage")} className="af-nav__consult af-glass" href="/anfrage">
        {t("nav.consultation")}
      </Link>
    </>
  );

  return (
    <>
      <header className="af-nav">
        <div className="af-wrap af-nav__in">
          <Link className="af-homelink" href="/">
            <Logo claim priority size={40} />
            <span className="af-sr"> – {t("common.home")}</span>
          </Link>
          <nav aria-label={t("nav.main")} className="af-nav__links">
            <div
              className="af-mega"
              data-open={mega || undefined}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(false);
              }}
              onMouseEnter={megaOpen}
              onMouseLeave={megaClose}
            >
              <Link aria-current={current("/extensions")} href="/extensions">
                {t("nav.extensions")}
              </Link>
              {methods.length ? (
                <button aria-controls="af-mega-panel" aria-expanded={mega} aria-label={t("ext.mega.toggle")} className="af-mega__btn" onClick={() => setMega((v) => !v)} type="button">
                  <svg aria-hidden="true" fill="none" height="10" viewBox="0 0 12 8" width="12">
                    <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              ) : null}
              {methods.length ? (
                <div className="af-mega__panel" hidden={!mega} id="af-mega-panel">
                  <div className="af-wrap af-mega__in">
                    <div className="af-mega__intro">
                      <p className="af-mono">{t("ext.mega.title")}</p>
                      <p className="af-mega__text">{t("ext.mega.text")}</p>
                      <Link className="af-mega__cta" href={{ hash: "finder", pathname: "/extensions" }}>
                        {t("ext.mega.finder")}
                      </Link>
                      <Link className="af-mega__all" href="/extensions">
                        {t("ext.mega.all")}
                      </Link>
                    </div>
                    <ul className="af-mega__grid">
                      {methods.map((m) => (
                        <li key={m.id}>
                          <Link className="af-mega__tile" href={{ hash: `technik-${m.id}`, pathname: "/extensions" }}>
                            <span className="af-mega__img" data-diagram={m.image ? undefined : ""}>
                              {m.image ? <Image alt="" height={240} sizes="140px" src={m.image} width={180} /> : <MethodDiagram id={m.id} title="" />}
                              {m.onRequest ? <i className="af-mega__badge">{t("ext.labels.onRequestBadge")}</i> : null}
                            </span>
                            <b>{t(`ext.methods.${m.id}.name`)}</b>
                            <span className="af-mega__tag">{t(`ext.methods.${m.id}.tagline`)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
            {links}
          </nav>
          <div className="af-nav__right">
            <UnitToggle />
            <LocaleSwitcher id="locale-head" />
            <Link aria-label={t("wishlist.nav", { count: wishlist.items.length })} className="af-iconbtn af-glass" href="/merkliste">
              <svg aria-hidden="true" fill={wishlist.items.length ? "currentColor" : "none"} height="18" viewBox="0 0 24 24" width="18">
                <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.4 0 5.5 3.4 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
            <Link aria-label={t("common.cartWithCount", { count })} className="af-bag af-glass af-glass--lens" href="/warenkorb">
              <span aria-hidden="true">{t("common.cart")}</span> <b aria-hidden="true">{count}</b>
            </Link>
            <button
              aria-controls="af-sheet"
              aria-expanded={open}
              className="af-menu af-glass"
              onClick={() => setOpen((value) => !value)}
              ref={menuButton}
              type="button"
            >
              {open ? t("common.close") : t("common.menu")}
            </button>
          </div>
        </div>
      </header>
      <nav aria-label={t("nav.mobile")} className="af-sheet" hidden={!open} id="af-sheet">
        {extLink}
        {links}
        <Link href="/kontakt">{t("nav.contact")}</Link>
        <UnitToggle />
        <LocaleSwitcher id="locale-sheet" />
      </nav>
      <CartDrawer checkoutOpen={cart.checkoutOpen} />
    </>
  );
}
