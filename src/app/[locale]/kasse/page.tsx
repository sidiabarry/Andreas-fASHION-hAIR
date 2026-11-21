import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { Checkout } from "@/components/cart/Checkout";
import type { CheckoutLegal } from "@/components/cart/Checkout";
import { company } from "@/config/company";
import { WARRANTY_LABEL } from "@/config/legal-assets";
import { toLegalCompany } from "@/config/legal-company";
import { legalFor } from "@/content/legal-registry";
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

  // Wortlaut ausschließlich aus den Rechtstexten (checkout-texts.ts bzw. deren Übersetzung).
  // Fehlt eine Übersetzung, werden die Beschriftungen übersetzt und die Hinweise auf Deutsch gezeigt.
  const legal = legalFor(locale);
  const texts = legal.checkoutTextsFor(toLegalCompany());
  const own = legal.lang === locale;
  const checkoutLegal: CheckoutLegal = {
    agbConsent: own ? texts.consents.agb : (t.raw("checkoutLegal.agbConsent") as string),
    buyButton: own ? texts.buyButton : t("checkoutLegal.buyButton"),
    links: { agb: t("checkoutLegal.linkAgb"), datenschutz: t("checkoutLegal.linkDatenschutz"), widerruf: t("checkoutLegal.linkWiderruf") },
    notes: texts.summaryNotes,
    notesLang: legal.lang,
    notesPreface: own ? null : t("checkoutLegal.germanNotes"),
    notesTitle: t("checkoutLegal.notesTitle"),
    privacyNote: own ? texts.consents.datenschutz : (t.raw("checkoutLegal.privacyNote") as string),
    warranty: texts.warrantyLabelAlt,
    warrantyImage: WARRANTY_LABEL,
    withdrawalNote: own ? texts.consents.widerruf : (t.raw("checkoutLegal.withdrawalNote") as string),
  };

  return (
    <main className="af-page af-zone-light" data-zone="light">
      <div className="af-wrap">
        <h1 className="af-h1">{t("checkout.title")}</h1>
        {mode.checkoutOpen ? (
          <div className="af-cartview">
          <Checkout carrier={company.shippingCarrier ?? ""} legal={checkoutLegal} whatsapp={company.social.whatsapp} />
          </div>
        ) : (
          <div className="af-empty">
            <p className="af-lead">{t("checkout.closed")}</p>
            <Link className="af-cta-gold af-glass af-glass--gold" href={{ pathname: "/anfrage", query: { thema: "bestellung" } }}>
              {t("cart.inquiryCta")} <Arrow />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
