import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/Logo";
import { company } from "@/config/company";
import { VISIBLE_CATEGORY_IDS } from "@/data/catalog";
import { Link } from "@/i18n/navigation";

import "../shop.css";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { NewsletterForm } from "./NewsletterForm";

const icons = {
  facebook: <path d="M14 8h2.5V4.5H14c-2.2 0-4 1.8-4 4V11H7.5v3.5H10V21h3.5v-6.5h2.6l.4-3.5h-3V8.6c0-.3.2-.6.5-.6Z" fill="currentColor" />,
  instagram: (
    <>
      <rect height="16" rx="4.5" stroke="currentColor" strokeWidth="1.6" width="16" x="4" y="4" fill="none" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="16.8" cy="7.2" fill="currentColor" r="1" />
    </>
  ),
  whatsapp: (
    <path
      d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.6 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Zm4.6 11.8c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.1-2.9-.7-2.4-1-3.9-3.4-4-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.4.3.2.5.1.6 0l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1.2Z"
      fill="currentColor"
    />
  ),
};

export async function Footer({ demo }: { demo: boolean }) {
  const t = await getTranslations();
  const year = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", year: "numeric" }).format(new Date());
  const social = (["instagram", "facebook", "whatsapp"] as const).filter((key) => company.social[key]);

  return (
    <footer className="af-foot">
      <div className="af-wrap">
        <div className="af-foot__custom">
          <div>
            <p className="af-mono">{t("custom.strip.kicker")}</p>
            <p className="af-foot__customtitle">{t("custom.strip.title")}</p>
          </div>
          <Link className="af-cta-frame" href="/massanfertigung">
            {t("custom.strip.cta")}
          </Link>
        </div>
        <div className="af-foot__grid">
          <div className="af-stack">
            <Link className="af-homelink" href="/">
              <Logo claim size={44} />
              <span className="af-sr"> – {t("common.home")}</span>
            </Link>
            <p className="af-text">{t("footer.claim")}</p>
            {social.length ? (
              <>
                <ul aria-label={t("footer.social")} className="af-social">
                  {social.map((key) => (
                    <li key={key}>
                      <a aria-label={`${t(`footer.${key}`)} ${t("common.newTab")}`} href={company.social[key] ?? undefined} rel="noopener noreferrer" target="_blank">
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                          {icons[key]}
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="af-note">{t("footer.socialNote")}</p>
              </>
            ) : null}
          </div>
          <div>
            <h2 className="af-foot__h">{t("footer.collection")}</h2>
            <ul>
              <li>
                <Link href="/extensions">{t("footer.extensionsHub")}</Link>
              </li>
              {VISIBLE_CATEGORY_IDS.map((id) => (
                <li key={id}>
                  <Link href={{ pathname: "/kollektion", query: { kategorie: id } }}>{t(`categories.${id}.label`)}</Link>
                </li>
              ))}
              <li>
                <Link href="/massanfertigung">{t("footer.custom")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="af-foot__h">{t("footer.atelier")}</h2>
            <ul>
              <li>
                <Link href="/ueber-andrea">{t("nav.about")}</Link>
              </li>
              <li>
                <Link href={{ hash: "geschichte", pathname: "/" }}>{t("footer.story")}</Link>
              </li>
              <li>
                <Link href={{ hash: "fragen", pathname: "/" }}>{t("footer.faq")}</Link>
              </li>
              <li>
                <Link href="/anfrage">{t("nav.consultation")}</Link>
              </li>
              <li>
                <Link href="/kontakt">{t("nav.contact")}</Link>
              </li>
            </ul>
            <h2 className="af-foot__h" style={{ marginTop: 28 }}>
              {t("footer.service")}
            </h2>
            <ul>
              <li>
                <Link href="/versand-und-zahlung">{t("footer.shipping")}</Link>
              </li>
              <li>
                <Link href="/widerruf/erklaeren">{t("footer.withdraw")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="af-foot__h">{t("footer.newsTitle")}</h2>
            {demo ? <NewsletterForm /> : <p className="af-note">{t("footer.newsNote")}</p>}
            <h2 className="af-foot__h" style={{ marginTop: 28 }}>
              {t("locale.label")}
            </h2>
            <LocaleSwitcher id="locale-foot" />
          </div>
        </div>
        <div className="af-foot__base">
          <span>© {year} Andréia&apos;s Fashion Hair</span>
          <nav aria-label={t("footer.legal")} className="af-foot__legal">
            <Link href="/impressum">{t("footer.imprint")}</Link>
            <Link href="/datenschutz">{t("footer.privacy")}</Link>
            <Link href="/agb">{t("footer.terms")}</Link>
            <Link href="/widerruf">{t("footer.withdrawal")}</Link>
            <Link href="/widerruf/erklaeren">{t("footer.withdraw")}</Link>
          </nav>
          <span>
            {company.madeInGermany ? t("footer.madeIn") : null}
            {company.madeInGermany && company.shippingCarrier ? " · " : null}
            {company.shippingCarrier ? t("footer.shippedWith", { carrier: company.shippingCarrier }) : null}
          </span>
        </div>
      </div>
    </footer>
  );
}
