import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ConsultBlock } from "@/components/site/ConsultBlock";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/ueber-andrea">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ description: t("metaDescription"), locale: locale as Locale, path: "/ueber-andrea", title: t("metaTitle") });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/ueber-andrea">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const editorial = await getTranslations({ locale, namespace: "editorial" });
  return (
    <main className="af-about">
      <section className="af-page af-about__story">
        <div className="af-wrap af-split">
          <div className="af-stack af-about__copy">
            <p className="af-mono">{t("kicker")}</p>
            <h1 className="af-h1">{t("title")}</h1>
            <p className="af-lead">{t("p1")}</p>
            <p className="af-text">{t("p2")}</p>
            <p className="af-text">{t("p3")}</p>
            <p className="af-text">{t("p4")}</p>
          </div>
          <figure className="af-about__image">
            <Image alt="" height={1194} fetchPriority="high" sizes="(max-width: 900px) 100vw, 640px" src="/assets/content/craft.jpg" width={1600} />
            <figcaption>{editorial("illustration")}</figcaption>
          </figure>
        </div>
      </section>
      <section aria-labelledby="values-title" className="af-section af-about__values">
        <div className="af-wrap">
          <h2 className="af-h2" id="values-title">
            {t("valuesTitle")}
          </h2>
          <div className="af-values">
            {[1, 2, 3].map((n) => (
              <div className="af-rise" key={n}>
                <h3 className="af-h3">
                  {t(`v${n}Title`)}
                </h3>
                <p>{t(`v${n}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ConsultBlock />
    </main>
  );
}
