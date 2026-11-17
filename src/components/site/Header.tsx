"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { useLocalList, WISHLIST_KEY } from "@/components/cart/useLocalList";
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
  const wishlist = useLocalList(WISHLIST_KEY);

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
          <Link aria-label={t("logo.homeLabel")} href="/">
            <Logo claim priority size={40} />
          </Link>
          <nav aria-label={t("nav.main")} className="af-nav__links">
            {links}
          </nav>
          <div className="af-nav__right">
            <LocaleSwitcher id="locale-head" />
            <Link aria-label={t("wishlist.nav", { count: wishlist.items.length })} className="af-iconbtn" href="/merkliste">
              <svg aria-hidden="true" fill={wishlist.items.length ? "currentColor" : "none"} height="18" viewBox="0 0 24 24" width="18">
                <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.4 0 5.5 3.4 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
            <Link aria-label={t("common.cartWithCount", { count })} className="af-bag" href="/warenkorb">
              <span aria-hidden="true">{t("common.cart")}</span> <b aria-hidden="true">{count}</b>
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
