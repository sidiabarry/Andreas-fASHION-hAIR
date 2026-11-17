import { type Company, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Eksik bilgi: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const ship = shippingOf(c);
  const eur = (n: number) => euro(n, "tr-TR");
  const carrier = c.carrier ?? <Missing field="carrier" label="kargo şirketi" />;
  const others = c.shippingCountries.filter((x) => x !== "DE");
  return (
    <>
      <p>
        <strong>Not:</strong> Hukuken yalnızca Almanca metin bağlayıcıdır; bu çeviri yalnızca
        anlamayı kolaylaştırmak içindir.
      </p>
      <section>
        <h2 id="versandkosten">1. Kargo ücretleri</h2>
        <dl>
          <dt>Almanya</dt>
          <dd>
            Sipariş başına {eur(ship.domesticCents)}
            {ship.freeFromCents !== null ? <>; {eur(ship.freeFromCents)} ve üzeri ücretsiz</> : null}
          </dd>
          {ship.euCents !== null ? (
            <>
              <dt>Avrupa Birliği ülkeleri</dt>
              <dd>Sipariş başına {eur(ship.euCents)}{others.length === 0 ? <> (anlaşma ile teslimat)</> : null}</dd>
            </>
          ) : null}
          <dt>Diğer ülkeler</dt>
          <dd>talep üzerine – ücreti sipariş öncesinde bildiririz</dd>
        </dl>
        <p>
          {c.smallBusiness === true ? (
            <>Alman KDV Kanunu (UStG) § 19 anlamında küçük işletme olarak kargo ücretleri dahil KDV almıyoruz.</>
          ) : c.smallBusiness === false ? (
            <>Tüm fiyatlar ve kargo ücretleri yasal KDV içerir.</>
          ) : (
            <Missing field="smallBusiness" label="KDV durumu (küçük işletme evet/hayır)" />
          )}{" "}
          Avrupa Birliği dışına teslimatlarda gümrük vergileri, ithalat vergileri ve harçlar
          doğabilir; bunları yetkili makamlara siz ödersiniz.
        </p>
      </section>

      <section>
        <h2 id="lieferzeit">2. Teslimat ve süreler</h2>
        <ul>
          <li>
            Gönderim kargo şirketi ile yapılır: {carrier} – gizli ambalajda ve takip numarasıyla.
            Teslimat ülkeleri: Almanya{others.length > 0 ? <>, {countryNames(others, "tr")}</> : null}; diğer ülkeler anlaşma ile.
          </li>
          <li>Stoktaki ürünler Almanya içinde {deliveryDaysOf(c)} gün içinde size ulaşır – ön ödeme ve PayPal'da ödemenin alındığı günü izleyen günden, diğer durumlarda sözleşmenin kurulduğu günü izleyen günden itibaren. Yurt dışı teslimat süresini sözleşme kurulmadan önce bildiririz.</li>
          <li>Ölçüye göre ürünleri, tüm bilgiler ve – ön ödeme veya PayPal'da – ödeme alındıktan sonra yaklaşık {madeToOrderDaysOf(c)} günde üretiriz.</li>
          <li>Güvenlik nedeniyle bazı bakım, yapıştırıcı ve çözücü ürünlerini her ülkeye gönderemiyoruz. Bunu ürün sayfasında belirtiriz.</li>
        </ul>
      </section>

      <section>
        <h2 id="zahlungsarten">3. Ödeme yöntemleri</h2>
        <p>Siparişinizden sonra stok durumunu kişisel olarak kontrol eder ve size ödeme bilgilerini içeren bir sipariş onayı göndeririz. Ödemeyi ancak siparişinizi kabul ettikten sonra yaparsınız.</p>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="ödeme yöntemi henüz belirlenmedi" />
          </p>
        ) : (
          <ul>
            {c.payments.prepayment ? (
              <li>
                <strong>Havale ile ön ödeme</strong> – sipariş onayından itibaren 7 gün içinde; ödeme
                alındıktan sonra gönderim.
                {c.bank ? (
                  <>
                    {" "}Hesap sahibi: {c.bank.holder}, IBAN: {c.bank.iban}
                    {c.bank.bic ? <>, BIC: {c.bank.bic}</> : null}. Lütfen açıklamaya sipariş numaranızı yazın.
                  </>
                ) : (
                  <> <Missing field="bank" label="banka bilgileri" /></>
                )}
              </li>
            ) : null}
            {c.payments.paypal ? (
              <li>
                <strong>PayPal</strong> – sipariş onayından sonra PayPal üzerinden bir ödeme talebi alırsınız
                {c.paypalEmail ? <> (gönderen: {c.paypalEmail})</> : <> <Missing field="paypalEmail" label="PayPal hesabı" /></>}
                ; 7 gün içinde ödenir. Ödeme alındıktan sonra gönderim.
              </li>
            ) : null}
            {c.payments.paypalInstallments ? <li><strong>PayPal ile taksitli ödeme</strong> – PayPal size sunarsa; kredi veren, kendi kredi değerlendirmesi ve koşullarıyla PayPal'dır. Biz kendimiz kredi vermiyoruz.</li> : null}
            {c.payments.bankTransfer ? (
              <li>
                <strong>Fatura</strong> – ürünün tesliminden itibaren 14 gün içinde havale. Bu yöntemi
                tekil durumlarda reddedebilir ve mevcut başka bir yöntem önerebiliriz.
                {c.bank ? null : <> <Missing field="bank" label="banka bilgileri" /></>}
              </li>
            ) : null}
          </ul>
        )}
        <p>Ödeme için ek ücret almıyoruz.</p>
      </section>
    </>
  );
}
