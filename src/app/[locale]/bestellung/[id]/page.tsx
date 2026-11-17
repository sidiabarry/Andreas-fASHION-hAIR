import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { legalFor } from "@/content/legal-registry";

import { Arrow } from "@/components/Arrow";
import { Logo } from "@/components/Logo";
import { toLegalCompany } from "@/config/legal-company";
import { getProduct, productText } from "@/data/catalog";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/money";
import { pageMetadata } from "@/lib/seo";
import { fillTemplate } from "@/server/mail";
import { siteMode } from "@/server/mode";
import { tokenMatches } from "@/server/security";
import { memoryStore } from "@/server/store-memory";

export async function generateMetadata({ params }: PageProps<"/[locale]/bestellung/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "order" });
  return { ...pageMetadata({ locale: locale as Locale, noindex: true, path: `/bestellung/${id}`, title: t("metaTitle") }), referrer: "no-referrer" };
}

export default async function OrderPage({ params, searchParams }: PageProps<"/[locale]/bestellung/[id]">) {
  const { locale: raw, id } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const { code } = await searchParams;
  const t = await getTranslations({ locale });
  const mode = siteMode();

  const order = mode.demo && /^AF-[A-Z0-9]{6}$/.test(id) ? await memoryStore().getOrder(id) : null;
  const valid = order && typeof code === "string" && code.length > 20 && tokenMatches(code, order.tokenHash);

  if (!order || !valid) {
    return (
      <main className="af-page">
        <div className="af-wrap af-empty">
          <h1 className="af-h2">{t("order.notFound")}</h1>
          <p className="af-lead">{mode.demo ? t("order.demoGone") : t("order.notFoundLead")}</p>
          <Link className="af-cta-line" href="/kollektion">
            {t("notFound.cta")}
          </Link>
        </div>
      </main>
    );
  }

  const legal = legalFor(locale);
  const texts = legal.checkoutTextsFor(toLegalCompany());
  const first = order.customer.name.split(" ")[0];
  const countryName = new Intl.DisplayNames([locale], { type: "region" }).of(order.customer.country) ?? order.customer.country;

  return (
    <main className="af-page">
      <div className="af-wrap" style={{ maxWidth: 860 }}>
        <Logo size={64} variant="mark" />
        <p className="af-mono" style={{ marginTop: 28 }}>
          {t("order.number", { id: order.id })}
        </p>
        <h1 className="af-h1" style={{ marginTop: 16 }}>
          {t("order.thanks", { name: first })}
        </h1>
        <p className="af-lead" style={{ marginTop: 24 }}>
          {legal.lang === locale ? fillTemplate(texts.confirmationNotice, { name: first, orderNo: order.id }) : t("order.lead", { email: order.customer.email })}
        </p>
        <p className="af-msg" data-kind={order.mailCustomer === "gesendet" ? "ok" : "info"} role="status" style={{ marginTop: 22 }}>
          {order.mailCustomer === "gesendet" ? t("order.mailSent") : t("order.mailNotSent")}
        </p>

        <section aria-label={t("checkout.items")} className="af-sum" style={{ marginTop: 36, position: "static" }}>
          {order.lines.map((line) => {
            const product = getProduct(line.slug);
            const name = product ? `${productText(product, locale).name}, ${productText(product, locale).subtitle}` : line.name;
            return (
              <div className="af-sum__row" key={line.slug}>
                <span>
                  {line.quantity > 1 ? `${line.quantity} × ` : ""}
                  {name}
                </span>
                <span>{formatPrice(line.totalCents, locale)}</span>
              </div>
            );
          })}
          <div className="af-sum__row">
            <span>{t("cart.shipping")}</span>
            <span>{order.shippingCents === 0 ? t("checkout.shippingFree") : formatPrice(order.shippingCents, locale)}</span>
          </div>
          <div className="af-sum__row af-sum__total">
            <span>{t("checkout.total")}</span>
            <span>{formatPrice(order.totalCents, locale)}</span>
          </div>
          <p className="af-note">
            {t("checkout.deliveryAddress")}: {order.customer.name}, {order.customer.street}, {order.customer.postalCode} {order.customer.city}, {countryName}
          </p>
        </section>

        <section aria-labelledby="widerruf-title" className="af-review" style={{ marginTop: 28 }}>
          <h2 className="af-h3" id="widerruf-title">
            {t("order.withdrawTitle")}
          </h2>
          <p className="af-note">{t("order.withdrawText")}</p>
          <Link className="af-cta-line" href={{ pathname: "/widerruf/erklaeren", query: { bestellung: order.id } }} style={{ justifySelf: "start" }}>
            {legal.lang === locale ? texts.withdrawalButtonLabel : t("footer.withdraw")}
          </Link>
        </section>

        <p className="af-note" style={{ marginTop: 22 }}>
          {t("order.print")}
        </p>
        <div className="af-hero-actions" style={{ marginTop: 28 }}>
          <Link className="af-cta-line" href={{ pathname: "/kollektion", query: { kategorie: "pflege" } }}>
            {t("order.careCta")} <Arrow />
          </Link>
        </div>
      </div>
    </main>
  );
}
