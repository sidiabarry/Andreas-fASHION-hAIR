import { getTranslations } from "next-intl/server";

import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

/** „Maßanfertigung“ als ruhiger Streifen: immer sichtbar, nie laut. `product` nimmt den Produktnamen mit in die Anfrage. */
export async function CustomStrip({ product }: { product?: string }) {
  const t = await getTranslations("custom.strip");
  return (
    <aside aria-labelledby="custom-strip-title" className="af-strip">
      <div className="af-stack" style={{ "--gap": "10px" } as React.CSSProperties}>
        <p className="af-mono">{t("kicker")}</p>
        <h2 className="af-h3" id="custom-strip-title">
          {t("title")}
        </h2>
        <p className="af-text">{t("text")}</p>
      </div>
      <Link className="af-cta-frame" href={product ? { pathname: "/massanfertigung", query: { produkt: product } } : "/massanfertigung"}>
        {t("cta")} <Arrow />
      </Link>
    </aside>
  );
}
