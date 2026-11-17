import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import * as legal from "@legal/versand-zahlung";

import { LegalPage } from "@/components/site/LegalPage";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/versand-und-zahlung">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({ description: t("shippingDescription"), locale: locale as Locale, path: "/versand-und-zahlung", title: t("shipping") });
}

export default async function VersandUndZahlungPage({ params }: PageProps<"/[locale]/versand-und-zahlung">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return (
    <LegalPage
      Content={legal.default}
      fields={[]}
      locale={locale as Locale}
      stub={"isStub" in legal}
      title={t("shipping")}
    />
  );
}
