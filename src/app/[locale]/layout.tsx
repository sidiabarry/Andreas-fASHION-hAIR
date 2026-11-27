import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { CartProvider } from "@/components/cart/CartProvider";
import { FxUi } from "@/components/fx/FxUi";
import { VtOrigin } from "@/components/fx/VtOrigin";
import { GlassDefs } from "@/components/fx/GlassDefs";
import { DemoBanner } from "@/components/site/DemoBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Rise } from "@/components/site/Rise";
import { ShopPreferences } from "@/components/site/ShopPreferences";
import { products, toLite } from "@/data/catalog";
import { methodShowcases } from "@/data/methods";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";
import { siteMode } from "@/server/mode";

import { fontVariables } from "../fonts";
import "../globals.css";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fbf7f1",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    applicationName: t("siteName"),
    description: t("defaultDescription"),
    formatDetection: { address: false, email: false, telephone: false },
    metadataBase: new URL(siteUrl()),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // Liest die Anfrage (Nonce aus proxy.ts): erzwingt dynamisches Rendern, damit jede Seite die
  // Nonce der Content-Security-Policy bekommt.
  await headers();
  const t = await getTranslations({ locale, namespace: "common" });
  const mode = siteMode();

  return (
    <html className={fontVariables} data-scroll-behavior="smooth" lang={locale}>
      <body className="af-body">
        <GlassDefs />
        <a className="af-skip" href="#inhalt">
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <ShopPreferences>
          <CartProvider checkoutOpen={mode.checkoutOpen} products={products.map((product) => toLite(product, locale))}>
            <Header methods={methodShowcases(() => true).map((m) => ({ id: m.id, image: m.image, onRequest: m.onRequest }))} />
            <div id="inhalt" tabIndex={-1}>
              {children}
            </div>
            <Footer demo={mode.demo} />
            <Rise />
          </CartProvider>
          </ShopPreferences>
          <FxUi />
          <VtOrigin />
        </NextIntlClientProvider>
        {mode.demo ? <DemoBanner /> : null}
      </body>
    </html>
  );
}
