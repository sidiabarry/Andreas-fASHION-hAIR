import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WishlistView } from "@/components/cart/WishlistView";
import { products } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/merkliste">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wishlist" });
  return pageMetadata({ locale: locale as Locale, noindex: true, path: "/merkliste", title: t("metaTitle") });
}

/** Merkliste (Herz in der Kopfleiste): nur auf diesem Gerät gespeichert, wie der Warenkorb. */
export default async function WishlistPage({ params }: PageProps<"/[locale]/merkliste">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "wishlist" });
  const soldSlugs = products.filter((product) => product.sold).map((product) => product.slug);
  return (
    <main className="af-page af-zone-light" data-zone="light">
      <div className="af-wrap">
        <h1 className="af-h1">{t("title")}</h1>
        <p className="af-lead" style={{ margin: "22px 0 0" }}>
          {t("lead")}
        </p>
        <div className="af-cartview af-wishlist__wrap">
          <WishlistView soldSlugs={soldSlugs} />
        </div>
      </div>
    </main>
  );
}
