"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { Logo } from "@/components/Logo";
import { Link, usePathname } from "@/i18n/navigation";

import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations();
  const cart = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const count = cart.ready ? cart.count : 0;

  // Menü schließen, sobald sich die Seite ändert (Zustand beim Rendern anpassen)
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }

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
  const links = (
    <>
      <Link href={{ pathname: "/kollektion", query: { kategorie: "extensions" } }}>{t("nav.extensions")}</Link>
      <Link aria-current={current("/kollektion")} href="/kollektion">
        {t("nav.collection")}
      </Link>
      <Link href={{ hash: "handwerk", pathname: "/" }}>{t("nav.craft")}</Link>
      <Link aria-current={current("/ueber-andrea")} href="/ueber-andrea">
        {t("nav.about")}
      </Link>
      <Link aria-current={current("/anfrage")} href="/anfrage">
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
            {links}
          </nav>
          <div className="af-nav__right">
            <LocaleSwitcher id="locale-head" />
            <Link className="af-bag" href="/warenkorb">
              <svg aria-hidden="true" className="af-bag__icon" fill="none" height="18" viewBox="0 0 24 24" width="18">
                <path d="M5.5 8.5h13l1.25 12H4.25l1.25-12ZM9 9V6.5a3 3 0 1 1 6 0V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              </svg>
              <span className="af-bag__label">{t("common.cart")}</span>
              <b>{count}</b>
            </Link>
            <button
              aria-controls="af-sheet"
              aria-expanded={open}
              className="af-menu"
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
        {links}
        <Link href="/kontakt">{t("nav.contact")}</Link>
        <LocaleSwitcher id="locale-sheet" />
      </nav>
      <CartDrawer checkoutOpen={cart.checkoutOpen} />
    </>
  );
}
