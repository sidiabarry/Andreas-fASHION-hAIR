import { getTranslations } from "next-intl/server";

import { company } from "@/config/company";
import { deliveryParams, SHIPPING_ZONES } from "@/config/shipping";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";

/** Vertrauensangaben direkt am Preis. Alles aus company.ts / shipping.ts abgeleitet, nichts doppelt hartkodiert. */
export async function TrustFacts({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const de = SHIPPING_ZONES.de;
  const eu = SHIPPING_ZONES.eu;
  const items = [
    { icon: "return", text: t.rich("returns", { link: (chunks) => <Link className="af-link" href="/widerruf">{chunks}</Link> }) },
    {
      icon: "ship",
      text: t("shipping", { de: formatPrice(de.priceCents ?? 0, locale), eu: formatPrice(eu.priceCents ?? 0, locale), free: formatPrice(de.freeFromCents ?? 0, locale) }),
    },
    { icon: "time", text: t("delivery", { ...deliveryParams(), carrier: company.shippingCarrier ?? "" }) },
    { icon: "pay", text: t("payLater") },
    ...(compact
      ? []
      : [
          { icon: "world", text: t("world") },
          {
            icon: "person",
            text: t.rich("contact", { phone: company.phone, tel: (chunks) => <a className="af-link" href={`tel:${company.phoneHref}`}>{chunks}</a> }),
          },
          { icon: "pin", text: t("atelier", { city: company.address.city }) },
        ]),
  ];
  return (
    <section aria-label={t("title")} className="af-trust">
      <h2 className="af-mono">{t("title")}</h2>
      <ul>
        {items.map((item) => (
          <li data-icon={item.icon} key={item.icon}>
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
