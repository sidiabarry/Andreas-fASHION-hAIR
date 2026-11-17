import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Arrow } from "@/components/Arrow";
import { CompareSlider } from "@/components/product/CompareSlider";
import { byCategory, getProductById, isUnique, type Product } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";
import { siteMode } from "@/server/mode";

import "./preview.css";

export const metadata: Metadata = {
  title: "Designvorschau · Produktauswahl",
  robots: { index: false, follow: false },
};

const views = { produkt: "Produktseite", kollektion: "Kollektion", warenkorb: "Warenkorb" } as const;
const groups = { topper: "Topper", maenner: "Männerhaarsysteme", pony: "Curtain Bangs" } as const;
const sampleTopperIds = [416, 415, 413];
const sample = getProductById(416)!;

function previewLink(view: keyof typeof views, query: { gruppe?: keyof typeof groups; stueck?: string } = {}) {
  return { pathname: "/design-vorschau" as const, query: { ansicht: view, ...query } };
}

function productLabel(product: Product) {
  return product.color || product.subtitle;
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="af-preview__disclosure">
      <summary>{title}</summary>
      <div className="af-preview__disclosure-body">{children}</div>
    </details>
  );
}

function ReturnGuide() {
  return (
    <Disclosure title="Wie läuft eine Rückgabe ab?">
      <ol className="af-preview__return">
        <li><strong>Prüfen.</strong> Lesen Sie die Widerrufsbelehrung zum Stück, bevor Sie ein vorhandenes Siegel öffnen.</li>
        <li><strong>Widerruf erklären.</strong> Nutzen Sie im Shop den Link „Widerruf erklären“ oder die dort genannten Kontaktwege.</li>
        <li><strong>Rücksendung vorbereiten.</strong> Die Hinweise zum weiteren Ablauf stehen in der Widerrufsbelehrung.</li>
      </ol>
    </Disclosure>
  );
}

function Dimensions({ product }: { product: Product }) {
  if (!product.length && !product.base) return null;
  return (
    <section aria-label="Maße prüfen" className="af-preview__dimensions">
      <h2 className="af-preview__section-title">Maße am eigenen Kopf prüfen</h2>
      {product.length ? (
        <Disclosure title={`Haarlänge · ${product.length} cm`}>
          <div className="af-preview__measure">
            <div aria-hidden="true" className="af-preview__diagram af-preview__diagram--length">
              <i /><span>{product.length} cm</span>
            </div>
            <p>Setzen Sie ein Maßband dort an, wo das Haarteil sitzen soll. Führen Sie es in Fallrichtung des Haars nach unten. So sehen Sie, wo die Länge bei Ihnen ungefähr endet.</p>
          </div>
        </Disclosure>
      ) : null}
      {product.base ? (
        <Disclosure title={`Basis · ${product.base.replace(" x ", " × ")} cm`}>
          <div className="af-preview__measure">
            <div aria-hidden="true" className="af-preview__diagram af-preview__diagram--base">
              <i /><span>{product.base.replace(" x ", " × ")} cm</span>
            </div>
            <p>Messen Sie die Stelle, die Sie abdecken möchten, von vorn nach hinten und von Seite zu Seite. Vergleichen Sie beide Maße mit der Basis. Andrea hilft Ihnen bei der Einordnung.</p>
          </div>
        </Disclosure>
      ) : null}
    </section>
  );
}

function PreviewProduct({ product }: { product: Product }) {
  const original = product.restyled ? product.originals[0] : undefined;
  const price = formatPrice(product.priceCents, "de");
  const inquiry = product.madeToOrder || product.sold;

  return (
    <div className="af-preview__product">
      <figure className="af-preview__gallery" id="bildvergleich">
        {original ? (
          <CompareSlider
            label="Vergleich verschieben: Studiobild und Atelierfoto"
            original={original}
            originalLabel="Atelierfoto"
            studio={product.image}
            studioLabel="Studiobild"
          />
        ) : (
          <Image alt={product.name} className="af-preview__still" fetchPriority="high" height={800} src={product.image} width={600} />
        )}
        <figcaption>{original ? "Zwei Ansichten desselben Stücks. Ziehen Sie die Trennlinie zum Vergleichen." : "Produktansicht aus dem Katalog."}</figcaption>
      </figure>

      <div className="af-preview__info">
        <p className="af-mono">{groups[product.category as keyof typeof groups]}</p>
        <h2 className="af-preview__title">{product.name}</h2>
        <p className="af-preview__tone">{productLabel(product)}</p>
        <p className="af-preview__price">{price}</p>
        {isUnique(product) && !product.sold ? <p className="af-only af-only--unique af-preview__unique">Einzelstück. Verfügbarkeit auf Anfrage.</p> : null}
        {product.madeToOrder ? <p className="af-preview__unique">Anfertigung nach Maß</p> : null}
        <div className="af-preview__actions">
          {inquiry ? (
            <a className="af-preview__primary" href="#beratung">Beratung zum Modell <Arrow /></a>
          ) : (
            <Link className="af-preview__primary" href={previewLink("warenkorb", { stueck: String(product.id) })}>
              Warenkorb-Vorschau <Arrow />
            </Link>
          )}
          {original ? <a className="af-preview__glass-action" href="#bildvergleich">Bilder vergleichen</a> : null}
        </div>
        <Dimensions product={product} />
        <section className="af-preview__panel" id="beratung">
          <h2 className="af-preview__section-title">Frage zu diesem Stück?</h2>
          <p>Andrea hilft Ihnen bei Farbe, Sitz und Basis.</p>
          <Disclosure title="Produktanfrage ansehen">
            <p>Modell <strong>{product.name}</strong></p>
            <p>„Hallo Andrea, ich habe eine Frage zum Modell {product.name} ({productLabel(product)}).“</p>
            <small>Beispiel für die Abnahme. Hier wird keine Nachricht versendet.</small>
          </Disclosure>
        </section>
        <ReturnGuide />
      </div>
    </div>
  );
}

function PreviewCard({ product, compare }: { product: Product; compare: boolean }) {
  return (
    <article className="af-preview__card">
      <Link href={previewLink("produkt", { stueck: String(product.id) })}>
        <Image alt={product.name} height={720} sizes="(max-width: 650px) 45vw, 392px" src={product.image} width={540} />
        <h3>{product.name}</h3>
      </Link>
      <p>{productLabel(product)}</p>
      <p className="af-preview__card-price">{formatPrice(product.priceCents, "de")}</p>
      {compare ? <ul>{product.specs.slice(0, 3).map((spec) => <li key={spec}>{spec}</li>)}</ul> : null}
    </article>
  );
}

function PreviewCollection({ group }: { group: keyof typeof groups }) {
  const products = byCategory(group).filter((product) => !product.sold);
  const samples = group === "topper" ? products.filter((product) => sampleTopperIds.includes(product.id)) : products.filter((product) => !product.madeToOrder);
  const custom = group === "maenner" ? products.find((product) => product.madeToOrder) : null;
  return (
    <section aria-labelledby="preview-collection-title">
      <nav aria-label="Kategorie" className="af-preview__categories">
        {Object.entries(groups).map(([id, label]) => (
          <Link aria-current={group === id ? "page" : undefined} href={previewLink("kollektion", { gruppe: id as keyof typeof groups })} key={id}>
            {label}
          </Link>
        ))}
      </nav>
      <h2 className="af-preview__title" id="preview-collection-title">{groups[group]}</h2>
      {group === "topper" ? (
        <div className="af-preview__panel af-preview__swatches">
          <h3 className="af-preview__section-title">Farbfamilien</h3>
          <ul aria-label="Darstellung der Farbauswahl">
            <li><i data-tone="braun" /> Braun</li>
            <li><i data-tone="kupfer" /> Kupfer</li>
            <li><i data-tone="blond" /> Blond</li>
          </ul>
        </div>
      ) : null}
      {group === "pony" ? (
        <Disclosure title="Curtain Bangs einordnen">
          <p>Vergleichen Sie Länge und Struktur der vier Varianten. Seitlich fallende Strähnen können Sie enger am Gesicht tragen oder nach außen stylen.</p>
        </Disclosure>
      ) : null}
      <div className="af-preview__cards" data-group={group}>
        {samples.map((product) => <PreviewCard compare={group === "maenner"} key={product.id} product={product} />)}
      </div>
      {custom ? (
        <Link className="af-preview__custom af-preview__panel" href={previewLink("produkt", { stueck: String(custom.id) })}>
          <span><strong>Haarsystem nach Maß</strong><br />Farbe und Dichte mit Andrea abstimmen.</span><Arrow />
        </Link>
      ) : null}
    </section>
  );
}

function PreviewCart({ product }: { product: Product }) {
  const price = formatPrice(product.priceCents, "de");
  return (
    <div className="af-preview__cart">
      <section aria-labelledby="preview-basket-title" className="af-preview__panel af-preview__basket">
        <h2 className="af-preview__section-title" id="preview-basket-title">Ihre Auswahl</h2>
        <div className="af-preview__basket-line">
          <Image alt="" height={120} src={product.image} width={90} />
          <div><strong>{product.name}</strong><p>{productLabel(product)}</p><b>{price}</b></div>
        </div>
        <Link className="af-preview__glass-action" href={previewLink("produkt", { stueck: String(product.id) })}>Zum Stück</Link>
      </section>
      <section aria-label="Zusammenfassung" className="af-preview__panel af-preview__cart-summary">
        <h2 className="af-preview__section-title">Zusammenfassung</h2>
        <p className="af-preview__subtotal"><span>Zwischensumme</span><strong>{price}</strong></p>
        <p>Andrea bestätigt Ihre Auswahl persönlich.</p>
        <ReturnGuide />
        <p className="af-preview__preview-note">Diese Ansicht löst keine Bestellung aus.</p>
      </section>
    </div>
  );
}

export default async function DesignPreview({ params, searchParams }: PageProps<"/[locale]/design-vorschau">) {
  const { locale } = await params;
  if (locale !== "de" || siteMode().production) notFound();
  const query = await searchParams;
  const view = query.ansicht === "kollektion" || query.ansicht === "warenkorb" ? query.ansicht : "produkt";
  const group = query.gruppe === "maenner" || query.gruppe === "pony" ? query.gruppe : "topper";
  const selected = typeof query.stueck === "string" ? getProductById(Number(query.stueck)) : undefined;
  const product = selected && (sampleTopperIds.includes(selected.id) || selected.category === "maenner" || selected.category === "pony") ? selected : sample;

  return (
    <main className="af-preview af-page">
      <div className="af-wrap">
        <header className="af-preview__header">
          <p className="af-preview__status">Designvorschau</p>
          <h1>Auswahl und Beratung</h1>
          <p>Ansichten zur Abnahme des Shops.</p>
          <nav aria-label="Vorschau-Ansicht" className="af-preview__views">
            {Object.entries(views).map(([id, label]) => (
              <Link aria-current={view === id ? "page" : undefined} href={previewLink(id as keyof typeof views, { stueck: String(product.id) })} key={id}>
                {label}
              </Link>
            ))}
          </nav>
        </header>
        {view === "kollektion" ? <PreviewCollection group={group} /> : view === "warenkorb" ? <PreviewCart product={product.madeToOrder || product.sold ? sample : product} /> : <PreviewProduct product={product} />}
      </div>
    </main>
  );
}
