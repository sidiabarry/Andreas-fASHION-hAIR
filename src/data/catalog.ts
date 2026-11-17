import raw from "./catalog.json";

export type CategoryId = "toppers" | "peruecken" | "pony" | "maenner" | "pflege";

export type Product = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  priceCents: number;
  sold: boolean;
  length: string;
  base: string;
  color: string;
  texture: string;
  description: string;
  specs: string[];
  image: string;
  restyled: boolean;
  originals: string[];
  madeToOrder: boolean;
};

export const products = raw as Product[];

export const SHIPPING_CENTS = 0;

export const categories: { id: CategoryId; label: string; need: string; caption: string }[] = [
  {
    id: "toppers",
    label: "Topper",
    need: "Mehr Fülle am Oberkopf",
    caption: "Für lichter werdendes Haar am Scheitel und Oberkopf. Ihr eigenes Haar an den Seiten bleibt.",
  },
  {
    id: "peruecken",
    label: "Perücken",
    need: "Ein ganz neuer Ansatz",
    caption: "Front Lace für den ganzen Kopf, wenn Sie Haaransatz und Länge neu wählen möchten.",
  },
  {
    id: "pony",
    label: "Pony",
    need: "Nur die Stirnpartie",
    caption: "Vorhangpony und Topper Pony: Stirn und Ansatz gefüllt, ohne eigenes Haar zu schneiden.",
  },
  {
    id: "maenner",
    label: "Für Männer",
    need: "Haarsystem für ihn",
    caption: "Haarsysteme auf Mikrohaut, lagernd oder nach Maß gefertigt.",
  },
  {
    id: "pflege",
    label: "Pflege",
    need: "Halt und Pflege",
    caption: "Kleber, Tapes und Lösungsmittel, die wir im Atelier selbst verwenden.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function byCategory(id: CategoryId): Product[] {
  return products.filter((product) => product.category === id);
}

export function isUnique(product: Product): boolean {
  return product.category !== "pflege" && !product.madeToOrder;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export const featuredIds = [414, 413, 287, 416, 99, 415, 73, 206];

export const featured: Product[] = featuredIds
  .map((id) => products.find((product) => product.id === id))
  .filter((product): product is Product => Boolean(product));
