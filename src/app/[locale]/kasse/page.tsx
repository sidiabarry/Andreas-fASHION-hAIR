import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { checkoutTextsFor } from "@legal/checkout-texts";

import { Arrow } from "@/components/Arrow";
import { Checkout } from "@/components/cart/Checkout";
import type { CheckoutLegal } from "@/components/cart/Checkout";
import { company } from "@/config/company";
import { toLegalCompany } from "@/config/legal-company";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { siteMode } from "@/server/mode";

export async function generateMetadata({ params }: PageProps<"/[locale]/kasse">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return pageMetadata({ locale: locale as Locale, noindex: true, path: "/kasse", title: t("metaTitle") });
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/kasse">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const mode = siteMode();
  const texts = checkoutTextsFor(toLegalCompany());

  // Deutsch: Wortlaut ausschließlich aus den Rechtstexten (checkout-texts.ts). Andere Sprachen:
  // übersetzte Beschriftungen, die Hinweise vor dem Kauf bleiben in der verbindlichen deutschen Fassung.
  const legal: CheckoutLegal =
    locale === "de"
      ? {
          agbConsent: texts.consents.agb,
          buyButton: texts.buyButton,
          links: { agb: "AGB", datenschutz: "Datenschutzerklärung", widerruf: "Widerrufsbelehrung" },
          notes: texts.summaryNotes,
          notesLang: "de",
          notesPreface: null,
          notesTitle: t("checkoutLegal.notesTitle"),
          privacyNote: texts.consents.datenschutz,
          withdrawalNote: texts.consents.widerruf,
        }
      : {
          agbConsent: t.raw("checkoutLegal.agbConsent") as string,
          buyButton: t("checkoutLegal.buyButton"),
          links: { agb: t("checkoutLegal.linkAgb"), datenschutz: t("checkoutLegal.linkDatenschutz"), widerruf: t("checkoutLegal.linkWiderruf") },
          notes: texts.summaryNotes,
          notesLang: "de",
          notesPreface: t("checkoutLegal.germanNotes"),
          notesTitle: t("checkoutLegal.notesTitle"),
          privacyNote: t.raw("checkoutLegal.privacyNote") as string,
          withdrawalNote: t.raw("checkoutLegal.withdrawalNote") as string,
        };

  return (
    <main className="af-page">
      <div className="af-wrap" style={{ maxWidth: 880 }}>
        <h1 className="af-h1">{t("checkout.title")}</h1>
        {mode.checkoutOpen ? (
          <Checkout carrier={company.shippingCarrier ?? ""} legal={legal} />
        ) : (
          <div className="af-empty">
            <p className="af-lead">{t("checkout.closed")}</p>
            <Link className="af-cta-gold" href={{ pathname: "/anfrage", query: { thema: "bestellung" } }}>
              {t("cart.inquiryCta")} <Arrow />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
