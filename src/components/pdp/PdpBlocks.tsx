import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { MethodDiagram } from "@/components/extensions/MethodDiagram";
import { company } from "@/config/company";
import { deliveryParams } from "@/config/shipping";
import type { Product, ProductText } from "@/data/catalog";
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
        <p className="pdp-color__more">
          {t("otherColors")}{" "}
          <Link className="af-link" href={{ pathname: "/anfrage", query: { produkt: t("otherColorsTopic", { name: `${text.name}, ${text.subtitle}` }), thema: "extensions" } }}>
            {t("otherColorsCta")}
          </Link>
        </p>
      ) : null}
      <p className="pdp-color__note">
        {t("colorNote")} {t("colorMatch")}
      </p>
    </div>
  );
}

/** Die drei stärksten Vorteile sichtbar statt im Akkordeon: Merkmal fett, Nutzen dahinter (Feature → Benefit). */
export async function BenefitList({ benefits, locale }: { benefits: string[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "pdp" });
  const items = benefits.slice(0, 3).map((line) => {
    const [feature, ...rest] = line.split("→");
    return { benefit: rest.join("→").trim(), feature: feature.trim() };
  });
  if (!items.length) return null;
  return (
    <section aria-label={t("benefitsTitle")} className="pdp-benefits">
      <ul>
        {items.map((item) => (
          <li key={item.feature}>
            <b>{item.feature}</b>
            {item.benefit ? <span>{item.benefit}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Sicherheit direkt am Kaufknopf: Zahlung, Widerruf, Lieferzeit (Baymard: Rückgabe und Versand nah am Kaufbereich). */
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

/** Extensions: die Technik hinter der Packung, mit Skizze und Sprung in den Vergleich. */
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
        <p className="af-text">{t(`ext.methods.${method}.how`)}</p>
        <dl className="pdp-tech__facts">
          {(["who", "fix", "wear", "heatGlue"] as const).map((key) => (
            <div key={key}>
              <dt>{t(`ext.labels.${key}`)}</dt>
              <dd>{t(`ext.methods.${method}.${key}`)}</dd>
            </div>
          ))}
        </dl>
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
