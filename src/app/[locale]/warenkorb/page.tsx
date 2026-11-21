import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CartView } from "@/components/cart/CartView";
import { company } from "@/config/company";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { siteMode } from "@/server/mode";

export async function generateMetadata({ params }: PageProps<"/[locale]/warenkorb">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return pageMetadata({ locale: locale as Locale, noindex: true, path: "/warenkorb", title: t("title") });
}

export default async function CartPage({ params }: PageProps<"/[locale]/warenkorb">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cart" });
  return (
    <main className="af-page af-zone-light" data-zone="light">
      <div className="af-wrap">
        <h1 className="af-h1">{t("title")}</h1>
        <p className="af-lead" style={{ margin: "22px 0 0" }}>
          {t("lead")}
        </p>
        <div className="af-cartview">
        <CartView
          checkoutOpen={siteMode().checkoutOpen}
          contact={{ email: company.email, phone: company.phone, phoneHref: company.phoneHref, whatsapp: company.social.whatsapp }}
        />
        </div>
      </div>
    </main>
  );
}
