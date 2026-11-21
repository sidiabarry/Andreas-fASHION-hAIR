import "server-only";

import QRCode from "qrcode";
import { getTranslations } from "next-intl/server";

import { company } from "@/config/company";
import type { Locale } from "@/i18n/locales";
import { formatPrice } from "@/lib/money";
import { epcPayload, formatIban } from "@/lib/payment";

import { CopyField } from "./CopyField";

/**
 * Überweisung per GiroCode: QR-Code nach EPC069-12 (serverseitig als SVG, keine Drittanbieter),
 * daneben alle Angaben zum Kopieren und ein PNG zum Speichern für die Foto-Überweisung am Handy.
 */
export async function BankTransfer({ locale, orderId, totalCents }: { locale: Locale; orderId: string; totalCents: number }) {
  const bank = company.bank;
  if (!bank) return null;
  const t = await getTranslations({ locale, namespace: "pay" });
  const payload = epcPayload({ cents: totalCents, iban: bank.iban, name: bank.holder, reference: orderId });
  const options = { color: { dark: "#1e1813", light: "#ffffff" }, errorCorrectionLevel: "M" as const, margin: 0 };
  const [svg, png] = await Promise.all([QRCode.toString(payload, { ...options, type: "svg" }), QRCode.toDataURL(payload, { ...options, margin: 2, scale: 10 })]);
  const amount = formatPrice(totalCents, locale);

  return (
    <section aria-labelledby="pay-title" className="af-pay">
      <div className="af-pay__head">
        <p className="af-mono">{t("kicker")}</p>
        <h2 className="af-h2" id="pay-title">
          {t("title")}
        </h2>
        <p className="af-text">{t("lead")}</p>
      </div>
      <div className="af-pay__grid">
        <figure className="af-pay__qr">
          <div aria-label={t("scanLabel", { amount })} className="af-pay__code" dangerouslySetInnerHTML={{ __html: svg }} role="img" />
          <figcaption>
            <span className="af-pay__amount">{amount}</span>
            <a className="af-cta-line" download={`girocode-${orderId}.png`} href={png}>
              {t("save")}
            </a>
            <span className="af-note">{t("saveHint")}</span>
          </figcaption>
        </figure>
        <dl className="af-pay__fields">
          <CopyField copied={t("copied")} copy={t("copy")} label={t("holder")} srLabel={t("copyLabel", { label: t("holder") })} value={bank.holder} />
          <CopyField copied={t("copied")} copy={t("copy")} display={formatIban(bank.iban)} label={t("iban")} srLabel={t("copyLabel", { label: t("iban") })} value={bank.iban} />
          <CopyField copied={t("copied")} copy={t("copy")} display={amount} label={t("amount")} srLabel={t("copyLabel", { label: t("amount") })} value={(totalCents / 100).toFixed(2).replace(".", ",")} />
          <CopyField copied={t("copied")} copy={t("copy")} label={t("reference")} srLabel={t("copyLabel", { label: t("reference") })} value={orderId} />
        </dl>
      </div>
      <ul className="af-pay__notes">
        <li>{t("instant")}</li>
        <li>{t("when")}</li>
        {company.paymentMethods.includes("paypal") && company.paypal ? <li>{t("paypal", { email: company.paypal })}</li> : null}
      </ul>
    </section>
  );
}
