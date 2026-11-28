import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { MethodDiagram } from "@/components/extensions/MethodDiagram";
import { OpenDetailsOnWide } from "@/components/pdp/OpenDetailsOnWide";
import { company } from "@/config/company";
import { deliveryParams } from "@/config/shipping";
import type { Product, ProductCopy, ProductText } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import type { MethodId } from "@/lib/collection";

/** Farbe in der Sprache der Seite: aus der Spezifikation („Farbe: …“, „Colour: …“), sonst der deutsche Farbname. */
export function localizedColor(product: Product, text: ProductText): string {
  for (const spec of text.specs) {
    const match = /^(?:Farbe|Colour|Color|Couleur)\s*:\s*(.+)$/i.exec(spec);
    if (match) return match[1];
  }
  return product.color;
}

/**
 * Farbe direkt unter dem Preis: echte Strähne als Farbfeld, Hinweis zur Bildschirmdarstellung (Erwartung richtig setzen)
 * und bei Extensions der Weg zur Wunschfarbe.
 */
export async function ColorRow({ product, text, locale, isExtension }: { product: Product; text: ProductText; locale: Locale; isExtension: boolean }) {
  const t = await getTranslations({ locale, namespace: "product" });
  const color = localizedColor(product, text);
  if (!color) return null;
  return (
    <div className="pdp-color">
      <div className="pdp-color__row">
        {product.swatch?.length ? (
          // Gemessene Echtfarbe aus den Rohfotos (dunkel → hell), bei Ombré als Verlauf
          <span aria-hidden="true" className="pdp-color__swatch" style={{ background: `linear-gradient(160deg, ${product.swatch.join(", ")})` }} />
        ) : (
          <span aria-hidden="true" className="pdp-color__swatch">
            <Image alt="" height={96} sizes="48px" src={product.image} width={72} />
          </span>
        )}
        <p className="pdp-color__name">
          <span>{t("colorLabel")}</span>
          <b>{color}</b>
        </p>
      </div>
      {isExtension ? (
        <Link className="pdp-color__more" href={{ pathname: "/anfrage", query: { produkt: t("otherColorsTopic", { name: `${text.name}, ${text.subtitle}` }), thema: "extensions" } }}>
          {t("otherColors")} <Arrow />
        </Link>
      ) : null}
      <p className="pdp-color__note">{t("colorNote")}</p>
    </div>
  );
}

/** Drei Kurzvorteile direkt über dem Kaufknopf: je eine Zeile, in Sekunden erfasst (Ebene 1). */
export async function QuickBenefits({ items, locale }: { items: string[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "pdp" });
  const list = items.filter(Boolean).slice(0, 3);
  if (!list.length) return null;
  return (
    <ul aria-label={t("benefitsTitle")} className="pdp-quick">
      {list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Sicherheit direkt am Kaufknopf, eine Zeile je Punkt: Zahlung, Widerruf, Lieferzeit (Baymard: Rückgabe und Versand nah am Kaufbereich). */
export async function Assurance({ locale, madeToOrder }: { locale: Locale; madeToOrder: boolean }) {
  const t = await getTranslations({ locale, namespace: "pdp" });
  const delivery = deliveryParams();
  const days = madeToOrder ? { from: delivery.mFrom, to: delivery.mTo } : { from: delivery.from, to: delivery.to };
  return (
    <ul aria-label={t("assureTitle")} className="pdp-assure">
      <li data-icon="pay">{t("assurePay")}</li>
      <li data-icon="return">
        {madeToOrder ? t("returnCustom") : t.rich("assureReturn", { link: (chunks) => <Link className="af-link" href="/widerruf">{chunks}</Link> })}
      </li>
      <li data-icon="ship">{t("assureShip", days)}</li>
    </ul>
  );
}

/** Extensions: die Technik hinter der Packung, kompakt mit Skizze und Sprung in den Vergleich. */
export async function TechniqueSpotlight({ method, image, locale }: { method: MethodId; image: string | null; locale: Locale }) {
  const t = await getTranslations({ locale });
  const name = t(`ext.methods.${method}.name`);
  return (
    <section aria-labelledby="pdp-tech-title" className="pdp-tech">
      <div className="pdp-tech__media">
        {image ? (
          <figure className="pdp-tech__img">
            <Image alt="" fill sizes="(max-width: 760px) 92vw, 360px" src={image} />
          </figure>
        ) : null}
        <figure className="pdp-tech__diagram">
          <MethodDiagram id={method} title={t("ext.labels.diagram", { name })} />
        </figure>
      </div>
      <div className="pdp-tech__copy">
        <p className="af-mono">{t("pdp.techKicker")}</p>
        <h2 className="af-h2" id="pdp-tech-title">
          {name}
        </h2>
        <p className="pdp-tech__tag">{t(`ext.methods.${method}.tagline`)}</p>
        <Link className="af-cta-line" href={{ hash: `technik-${method}`, pathname: "/extensions" }}>
          {t("pdp.techLink")} <Arrow />
        </Link>
      </div>
    </section>
  );
}

/** „Ihre Farbe ist nicht dabei?“: jede Extension auf Anfrage in anderen Farben, Längen, Mengen. */
export async function ColorsBand({ locale, product, images }: { locale: Locale; product: string; images: string[] }) {
  const t = await getTranslations({ locale, namespace: "pdp" });
  const tp = await getTranslations({ locale, namespace: "product" });
  const whatsapp = company.social.whatsapp;
  return (
    <aside aria-labelledby="pdp-colors-title" className="pdp-colors">
      <ul aria-hidden="true" className="pdp-colors__fan">
        {images.slice(0, 5).map((src, i) => (
          <li key={src} style={{ "--i": i } as React.CSSProperties}>
            <Image alt="" fill sizes="120px" src={src} />
          </li>
        ))}
      </ul>
      <div className="pdp-colors__copy">
        <h2 className="af-h3" id="pdp-colors-title">
          {t("colorsTitle")}
        </h2>
        <p className="af-text">{t("colorsText")}</p>
        <div className="pdp-colors__cta">
          {whatsapp ? (
            <a className="af-cta-gold af-glass af-glass--gold" href={whatsapp} rel="noopener noreferrer" target="_blank">
              {t("colorsWhatsapp")}
            </a>
          ) : null}
          <Link className="af-cta-line" href={{ pathname: "/anfrage", query: { produkt: tp("otherColorsTopic", { name: product }), thema: "extensions" } }}>
            {t("colorsAsk")} <Arrow />
          </Link>
        </div>
      </div>
    </aside>
  );
}

type Faq = { q: string; a: string };

/** Ein zugeklappter Bereich der Ebene 3. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details>
      <summary>
        <h3 className="af-faq__q">{title}</h3>
        <i aria-hidden="true" />
      </summary>
      <div className="pdp-details__body">{children}</div>
    </details>
  );
}

/**
 * Ebene 3, Tiefe auf Abruf: eigenes Band unter dem Kaufbereich, höchstens vier Bereiche mit klaren Namen.
 * Am Handy zugeklappt, am Desktop offen in zwei Spalten (nur scrollen, nichts aufklappen).
 * „Über dieses Stück“ (Geschichte, So funktioniert es, Für wen, alle Vorteile, Eigenschaften), „Pflege“, „Häufige Fragen“, „Versand, Rückgabe und Bezahlung“.
 */
export async function PdpDetails({ locale, copy, specs, faq, trust }: { locale: Locale; copy: ProductCopy | null; specs: string[]; faq: Faq[]; trust: React.ReactNode }) {
  const t = await getTranslations({ locale });
  const benefits = (copy?.benefits ?? []).map((line) => {
    const [feature, ...rest] = line.split("→");
    return { benefit: rest.join("→").trim(), feature: feature.trim() };
  });
  return (
    <section aria-labelledby="pdp-details-title" className="af-faq af-faq--compact pdp-details">
      <h2 className="af-mono" id="pdp-details-title">
        {t("pdp.detailsTitle")}
      </h2>
      <Section title={t("pdp.aboutTitle")}>
        {copy?.story ? <p>{copy.story}</p> : null}
        {copy?.howItWorks ? (
          <>
            <h4>{t("product.copy.how")}</h4>
            <p>{copy.howItWorks}</p>
          </>
        ) : null}
        {copy?.goodFor ? (
          <>
            <h4>{t("product.copy.good")}</h4>
            <p>{copy.goodFor}</p>
          </>
        ) : null}
        {benefits.length ? (
          <>
            <h4>{t("pdp.benefitsFull")}</h4>
            <ul className="pdp-details__list">
              {benefits.map((b) => (
                <li key={b.feature}>
                  <b>{b.feature}</b>
                  {b.benefit ? <span> {b.benefit}</span> : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {specs.length ? (
          <>
            <h4>{t("pdp.specsTitle")}</h4>
            <ul className="af-specs">
              {specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </>
        ) : null}
      </Section>
      {copy?.care?.length ? (
        <Section title={t("product.copy.care")}>
          <ul className="pdp-details__list">
            {copy.care.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      ) : null}
      {faq.length ? (
        <Section title={t("pdp.faqTitle")}>
          <dl className="pdp-details__faq">
            {faq.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}
      <Section title={t("pdp.trustFold")}>{trust}</Section>
      <OpenDetailsOnWide selector=".pdp-details > details" />
    </section>
  );
}
