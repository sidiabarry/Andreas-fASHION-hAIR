import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import * as legal from "@legal/datenschutz";

import { LegalPage } from "@/components/site/LegalPage";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/datenschutz">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({ description: t("privacyDescription"), locale: locale as Locale, path: "/datenschutz", title: t("privacy") });
}

export default async function DatenschutzPage({ params }: PageProps<"/[locale]/datenschutz">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return (
    <LegalPage
      Content={legal.default}
      fields={["ownerFullName"]}
      locale={locale as Locale}
      stub={"isStub" in legal}
      title={t("privacy")}
    />
  );
}
