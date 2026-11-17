import { type Company, UNIVERSAL_ADR } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Eksik bilgi: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  return (
    <>
      <p>
        <strong>Not:</strong> Hukuken yalnızca Almanca metin bağlayıcıdır; bu çeviri yalnızca
        anlamayı kolaylaştırmak içindir.
      </p>
      <section>
        <h2 id="anbieter">1. Hizmet sağlayıcı</h2>
        <p>Alman Dijital Hizmetler Kanunu (DDG) § 5 uyarınca bilgiler</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="işletme sahibinin tam adı" />}
          <br />
          Ticari ad: {c.brandName}
          <br />
          {c.legalForm ?? <Missing field="legalForm" label="hukuki yapı" />}
          <br />
          {c.street}
          <br />
          {c.zip} {c.city}
          <br />
          {c.country}
        </p>
      </section>

      <section>
        <h2 id="kontakt">2. İletişim</h2>
        <dl>
          <dt>Telefon</dt>
          <dd>{c.phone}</dd>
          <dt>E-posta</dt>
          <dd>{c.email}</dd>
          <dt>Ulaşılabilirlik</dt>
          <dd>{c.hours}</dd>
        </dl>
      </section>

      <section>
        <h2 id="steuer-register">3. KDV ve sicil</h2>
        {c.vatId ? (
          <p>Alman KDV Kanunu § 27a uyarınca KDV kimlik numarası: {c.vatId}</p>
        ) : c.smallBusiness === true ? (
          <p>İşletme sahibi, Alman KDV Kanunu (UStG) § 19 anlamında küçük işletmedir. KDV alınmaz.</p>
        ) : (
          <p>
            KDV numarası: <Missing field="vatId" label="KDV numarası (verildiyse) veya küçük işletme durumu" />
          </p>
        )}
        {c.tradeRegister ? <p>Sicil kaydı: {c.tradeRegister}</p> : <p>İşletme ticaret siciline kayıtlı değildir.</p>}
      </section>

      <section>
        <h2 id="streitbeilegung">4. Tüketici uyuşmazlıklarının çözümü</h2>
        {c.disputeResolution === "willing" ? (
          <>
            <p>Bir tüketici uyuşmazlık çözüm kuruluşu önündeki uyuşmazlık çözüm süreçlerine katılmaya hazırız. Yetkili kuruluş:</p>
            <p>
              {UNIVERSAL_ADR.name}
              <br />
              {UNIVERSAL_ADR.address}
              <br />
              {UNIVERSAL_ADR.web}
            </p>
            <p>Bu kuruluş önündeki uyuşmazlık çözüm süreçlerine katılacağımızı beyan ederiz.</p>
          </>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Bir tüketici uyuşmazlık çözüm kuruluşu önündeki süreçlere katılmaya hazır ve yükümlü değiliz. Sorunuz veya bir sorununuz varsa lütfen doğrudan bize yazın – birlikte bir çözüm buluruz.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="tüketici uyuşmazlık çözümü hakkında karar (VSBG § 36)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="hinweise">5. Bu web sitesi hakkında</h2>
        <p>Bu sitenin içeriğini özenle hazırlıyoruz. Bağlantı verilen diğer sağlayıcıların sayfalarından o sağlayıcılar sorumludur. Bu sitedeki fotoğraflar ve metinler telif hakkıyla korunmaktadır; kullanmadan önce lütfen bize sorun.</p>
      </section>
    </>
  );
}
