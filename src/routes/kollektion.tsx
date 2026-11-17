import { Link, createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/chrome";
import { categories, products } from "@/data/catalog";
import type { CategoryId } from "@/data/catalog";
import { getSoldSlugs } from "@/lib/shop.functions";

type Filter = CategoryId | "alle";

const ids: string[] = categories.map((category) => category.id);

export const Route = createFileRoute("/kollektion")({
  validateSearch: (search: Record<string, unknown>): { kat: Filter } => ({
    kat: typeof search.kat === "string" && ids.includes(search.kat) ? (search.kat as CategoryId) : "alle",
  }),
  loader: async () => ({ sold: await getSoldSlugs() }),
  head: () => ({
    meta: [
      { title: "Kollektion | Andrea's Fashion Hair" },
      {
        name: "description",
        content: "Echthaar-Topper, Front-Lace-Perücken, Pony und Haarsysteme. Jedes Stück ein Einzelstück.",
      },
    ],
  }),
  component: Collection,
});

function Collection() {
  const { kat } = Route.useSearch();
  const { sold } = Route.useLoaderData();
  const active = categories.find((category) => category.id === kat);
  const list = (kat === "alle" ? products : products.filter((product) => product.category === kat))
    .slice()
    .sort((a, b) => Number(a.sold || sold.includes(a.slug)) - Number(b.sold || sold.includes(b.slug)));
  const open = list.filter((product) => !product.sold && !sold.includes(product.slug)).length;

  return (
    <main className="af-page">
      <div className="af-wrap">
        <p className="af-mono">{open} Stücke verfügbar</p>
        <h1 className="af-h1" style={{ marginTop: 18 }}>
          {active ? active.label : "Die Kollektion"}
        </h1>
        <p className="af-lead" style={{ marginTop: 22 }}>
          {active
            ? active.caption
            : "Alles, was gerade im Atelier fertig ist. Jedes Stück von Hand gearbeitet, jedes nur einmal da."}
        </p>
        <div className="af-filters">
          <Link aria-selected={kat === "alle"} className="af-tab" search={{ kat: "alle" }} style={{ display: "inline-flex", alignItems: "center" }} to="/kollektion">
            Alle
          </Link>
          {categories.map((category) => (
            <Link
              aria-selected={kat === category.id}
              className="af-tab"
              key={category.id}
              search={{ kat: category.id }}
              style={{ display: "inline-flex", alignItems: "center" }}
              to="/kollektion"
            >
              {category.label}
            </Link>
          ))}
        </div>
        <div className="af-grid">
          {list.map((product) => (
            <ProductCard key={product.slug} product={product} sold={sold.includes(product.slug)} />
          ))}
        </div>
      </div>
    </main>
  );
}
