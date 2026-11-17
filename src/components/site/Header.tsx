"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

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
      <Link aria-current={current("/kollektion")} href="/kollektion">
        {t("nav.collection")}
      </Link>
      <Link href={{ hash: "extensions", pathname: "/" }}>{t("nav.extensions")}</Link>
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
      <CartToast />
    </>
  );
}

function CartToast() {
  const t = useTranslations("product");
  const cart = useCart();
  const product = cart.justAdded ? cart.lookup(cart.justAdded) : undefined;
  return (
    <div aria-live="polite" className="af-toast-region">
      {product ? (
        <div className="af-toast" role="status">
          <span>{t("added", { name: product.name })}</span>
          <Link href="/warenkorb" onClick={cart.dismiss}>
            {t("toCart")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
