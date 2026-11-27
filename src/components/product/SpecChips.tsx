import { getTranslations } from "next-intl/server";

import { unitInfo } from "@/data/catalog";
import type { Product } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { methodOf } from "@/lib/collection";

const TEXTURES: Record<string, "glatt" | "leichtGewellt" | "lockig"> = { glatt: "glatt", "leicht gewellt": "leichtGewellt", lockig: "lockig" };

/** Eigenschaften auf einen Blick: Methode, Länge, Gewicht, Struktur, Basis. Nur, was der Katalog wirklich kennt. */
export async function SpecChips({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "product.spec" });
  const te = await getTranslations({ locale, namespace: "extensions" });
  const unit = unitInfo(product);
  const method = methodOf(product);
  const texture = TEXTURES[product.texture.toLowerCase()];
  const cm = Number.parseInt(product.length, 10);
  const items: { key: string; label: string; value: string }[] = [
    ...(method ? [{ key: "method", label: t("method"), value: te(method) }] : []),
    ...(cm > 0 ? [{ key: "length", label: t("length"), value: t("lengthValue", { cm }) }] : []),
    ...(unit
      ? [
          {
            key: "weight",
            label: unit.kind === "set" ? t("set") : t("pack"),
            value: unit.kind === "set" ? t("setValue", { grams: unit.grams, pieces: unit.parts }) : t("packValue", { grams: unit.grams }),
          },
        ]
      : []),
    // Farbe steht als eigene Zeile mit Farbfeld darunter (ColorRow); bei Pflegeprodukten gibt es keine
    ...(texture ? [{ key: "texture", label: t("texture"), value: t(`textures.${texture}`) }] : []),
    ...(product.base ? [{ key: "base", label: t("base"), value: t("baseValue", { base: product.base }) }] : []),
  ];
  if (!items.length) return null;
  return (
    <ul aria-label={t("title")} className="af-chips">
      {items.map((item) => (
        <li key={item.key}>
          <span>{item.label}</span>
          <b>{item.value}</b>
        </li>
      ))}
    </ul>
  );
}
