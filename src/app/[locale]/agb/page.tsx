import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import * as legal from "@legal/agb";

import { LegalPage } from "@/components/site/LegalPage";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/agb">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({ description: t("termsDescription"), locale: locale as Locale, path: "/agb", title: t("terms") });
}

export default async function AgbPage({ params }: PageProps<"/[locale]/agb">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  return (
    <LegalPage
      Content={legal.default}
      fields={["ownerFullName", "register"]}
      locale={locale as Locale}
      stub={"isStub" in legal}
      title={t("terms")}
    />
  );
}
