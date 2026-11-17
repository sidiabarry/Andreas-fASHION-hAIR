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
  return (
    <main>
      <section className="af-page" style={{ paddingBottom: 0 }}>
        <div className="af-wrap">
          <p className="af-mono">{t("kicker")}</p>
          <h1 className="af-h1" style={{ marginTop: 18, maxWidth: "18ch" }}>
            {t("title")}
          </h1>
        </div>
      </section>
      <section aria-labelledby="story-title" className="af-section">
        <div className="af-wrap af-split">
          <div className="af-split__media af-rise">
            <Image alt="" height={1194} priority sizes="(max-width: 900px) 100vw, 640px" src="/assets/content/mirror.jpg" width={1600} />
          </div>
          <div className="af-stack af-rise">
            <h2 className="af-h2" id="story-title">
              {t("storyTitle")}
            </h2>
            <p className="af-lead">{t("p1")}</p>
            <p className="af-text">{t("p2")}</p>
            <p className="af-text">
              <strong>{t("p3")}</strong>
            </p>
            <p className="af-text">{t("p4")}</p>
            <figure style={{ margin: "28px 0 0" }}>
              <blockquote className="af-quote">{t("quote")}</blockquote>
              <figcaption className="af-quote-by" style={{ marginTop: 14 }}>
                {t("quoteBy")}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section aria-labelledby="values-title" className="af-section" style={{ paddingTop: 0 }}>
        <div className="af-wrap">
          <p className="af-mono">{t("valuesKicker")}</p>
          <h2 className="af-h2" id="values-title" style={{ marginTop: 18 }}>
            {t("valuesTitle")}
          </h2>
          <div className="af-values">
            {[1, 2, 3].map((n) => (
              <div className="af-rise" key={n}>
                <p className="af-mono af-gold">— 0{n}</p>
                <h3 className="af-h3" style={{ marginTop: 12 }}>
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
