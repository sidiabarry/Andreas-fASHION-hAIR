import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { useCart } from "@/components/site/cart";
import { Arrow, ProductCard } from "@/components/site/chrome";
import { byCategory, categories, formatPrice, getProduct, isUnique } from "@/data/catalog";
import { getSoldSlugs } from "@/lib/shop.functions";

export const Route = createFileRoute("/produkt/$slug")({
  loader: async ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) {
      throw notFound();
    }
    return { product, sold: await getSoldSlugs() };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name}, ${loaderData.product.subtitle} | Andrea's Fashion Hair` },
          { name: "description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product, sold } = Route.useLoaderData();
  const cart = useCart();
  const images = product.restyled ? [product.image, ...product.originals] : product.originals;
  const gallery = images.length > 0 ? images : [product.image];
  const [shot, setShot] = useState(0);
  const isSold = product.sold || sold.includes(product.slug);
  const unique = isUnique(product);
  const inCart = cart.ready && cart.has(product.slug);
  const category = categories.find((item) => item.id === product.category);
  const more = byCategory(product.category)
    .filter((item) => item.slug !== product.slug && !item.sold && !sold.includes(item.slug))
    .slice(0, 4);
  const current = gallery[Math.min(shot, gallery.length - 1)];

  return (
    <main className="af-page">
      <div className="af-wrap">
        <nav aria-label="Brotkrumen" className="af-crumb">
          <Link search={{ kat: "alle" }} to="/kollektion">
            Kollektion
          </Link>
          <span>/</span>
          <Link search={{ kat: product.category }} to="/kollektion">
            {category?.label}
          </Link>
        </nav>

        <div className="af-pdp">
          <div className="af-pdp__gallery">
            <div className="af-pdp__main">
              <img alt={`${product.name}, ${product.subtitle}`} height={1600} src={current} width={1200} />
            </div>
            {gallery.length > 1 ? (
              <div className="af-pdp__thumbs">
                {gallery.map((src, index) => (
                  <button
                    aria-label={`Bild ${index + 1} zeigen`}
                    aria-pressed={index === shot}
                    className="af-thumb"
                    key={src}
                    onClick={() => setShot(index)}
                    type="button"
                  >
                    <img alt="" height={108} loading="lazy" src={src} width={84} />
                  </button>
                ))}
              </div>
            ) : null}
            {product.restyled ? (
              <p className="af-note">
                Das erste Bild zeigt das Stück im Studiolicht. Die weiteren sind unbearbeitete
                Aufnahmen aus dem Atelier.
              </p>
            ) : null}
          </div>

          <div className="af-pdp__info">
            <div>
              <p className="af-mono">{category?.label}</p>
              <h1 className="af-h2" style={{ marginTop: 14 }}>
                {product.name}
              </h1>
              <p className="af-lead" style={{ marginTop: 10 }}>
                {product.subtitle}
              </p>
            </div>

            <div className="af-pdp__price">
              {formatPrice(product.priceCents)}
              <small>inkl. MwSt., Versand innerhalb Deutschlands inklusive</small>
            </div>

            {isSold ? (
              <p className="af-msg">Dieses Stück hat bereits sein Zuhause gefunden.</p>
            ) : unique ? (
              <p className="af-only">Einzelstück. Nur dieses eine Mal verfügbar.</p>
            ) : product.madeToOrder ? (
              <p className="af-only">Wird nach Ihren Maßen gefertigt, in 15 bis 20 Tagen.</p>
            ) : null}

            <p className="af-text">{product.description}</p>

            {isSold ? (
              <Link className="af-cta-band" search={{ produkt: product.name, thema: "massanfertigung" }} to="/anfrage">
                Ein ähnliches Stück anfragen <Arrow />
              </Link>
            ) : inCart && unique ? (
              <Link className="af-cta-band" to="/warenkorb">
                Liegt im Warenkorb. Zur Kasse <Arrow />
              </Link>
            ) : (
              <button className="af-cta-add" onClick={() => cart.add(product.slug)} type="button">
                <span>In den Warenkorb</span>
                <span>{formatPrice(product.priceCents)}</span>
              </button>
            )}

            <Link className="af-cta-line" search={{ produkt: product.name, thema: "beratung" }} style={{ justifySelf: "start" }} to="/anfrage">
              Frage zu diesem Stück stellen
            </Link>

            <div className="af-assure">
              <span>
                <b>Erst bestätigen, dann bezahlen.</b> Andrea prüft Ihr Stück und schreibt Ihnen
                persönlich, bevor Geld fließt.
              </span>
              <span>
                <b>In 2 bis 5 Werktagen bei Ihnen.</b> Versand mit DHL, diskret verpackt.
              </span>
              <span>
                <b>Unsicher bei der Farbe?</b> Ein Foto bei Tageslicht genügt, und Sie bekommen eine
                ehrliche Antwort.
              </span>
            </div>

            <ul className="af-specs">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>

        {more.length > 0 ? (
          <section className="af-section" style={{ paddingBottom: 0 }}>
            <h2 className="af-h2">Auch noch da.</h2>
            <div className="af-grid">
              {more.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
