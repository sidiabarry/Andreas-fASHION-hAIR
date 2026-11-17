import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalPage } from "@/components/site/LegalPage";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/impressum">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({ description: t("imprintDescription"), locale: locale as Locale, path: "/impressum", title: t("imprint") });
}

export default async function ImpressumPage({ params }: PageProps<"/[locale]/impressum">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return (
    <LegalPage
      page="impressum"
      fields={["ownerFullName", "legalForm", "register"]}
      locale={locale as Locale}
      title={t("imprint")}
    />
  );
}
