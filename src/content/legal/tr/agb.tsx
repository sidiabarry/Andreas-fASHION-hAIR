import { type Company, UNIVERSAL_ADR, addressLine, anyPayment, countryNames, euro, madeToOrderDaysOf, deliveryDaysOf, shippingOf } from "../company-type";

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
        <h2 id="geltung">§ 1 Kapsam ve satıcı</h2>
        <ol>
          <li>Bu genel satış koşulları, tüketicilerin (BGB § 13) çevrim içi mağazamızda verdiği tüm siparişler için geçerlidir.</li>
          <li>
            Sözleşme tarafınız:{" "}
            {c.ownerFullName ?? <Missing field="ownerFullName" label="işletme sahibinin tam adı" />} (ticari ad: „{c.brandName}”),{" "}
            {addressLine(c)}, telefon {c.phone}, e-posta {c.email}.
          </li>
          <li>Sözleşme dili Almancadır. Çeviriler yalnızca anlamayı kolaylaştırmak içindir.</li>
        <li>Bu koşullar yalnızca tüketiciler için geçerlidir. Salonlar, kuaförler ve diğer işletmeler talep üzerine ayrı koşullarla bireysel bir teklif alır.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragsschluss">§ 2 Sözleşmenin kurulması</h2>
        <ol>
          <li>Ürünlerin mağazada sunulması bağlayıcı bir teklif değil, sipariş vermeye davettir. Ürünlerin birçoğu tektir.</li>
          <li>Ürünleri sepete eklersiniz, sonraki adımda iletişim ve teslimat bilgilerinizi girersiniz ve ardından tüm bilgileri ve toplam fiyatı içeren bir özet görürsünüz. Göndermeden önce giriş hatalarını istediğiniz zaman düzeltebilirsiniz: tarayıcınızın geri düğmesiyle, sepetteki „Değiştir” ile veya doğrudan alanlarda. „Ödeme yükümlülüğü ile sipariş ver” düğmesine tıklayarak sepetteki ürünleri satın almak için bağlayıcı bir teklif vermiş olursunuz.</li>
          <li>Hemen ardından siparişinizin alındığını bildiren otomatik bir e-posta alırsınız. Bu alındı onayı henüz teklifinizin kabulü değildir.</li>
          <li>Ürünün mevcut olup olmadığını kişisel olarak kontrol ederiz. Sözleşme, siparişinizi e-posta ile açıkça kabul ettiğimizde (sipariş onayı) veya ürünü size gönderdiğimizde – hangisi önce gerçekleşirse – kurulur. Siparişin alınmasından itibaren üç iş günü içinde karar veririz. Bu süre içinde kabul almazsanız siparişinizle artık bağlı değilsiniz; yapılmış ödemeleri gecikmeksizin iade ederiz.</li>
          <li>Tek olan bir ürün artık mevcut değilse sizi gecikmeksizin bilgilendiririz. Bu ürün için sözleşme kurulmaz.</li>
          <li>Sipariş onayıyla birlikte sözleşme metnini, bu koşulları, cayma hakkı bilgilendirmesini ve örnek cayma formunu e-posta ile alırsınız.</li>
        </ol>
      </section>

      <section>
        <h2 id="vertragstext">§ 3 Sözleşme metninin saklanması</h2>
        <p>Sözleşme metnini (sipariş bilgileriniz ve sipariş anında geçerli koşullar) saklar ve size e-posta ile göndeririz. Güncel koşulları bu sayfada istediğiniz zaman görüntüleyebilir, kaydedebilir ve yazdırabilirsiniz. Geçmiş siparişlerin görülebileceği bir müşteri hesabı sunmuyoruz.</p>
      </section>

      <section>
        <h2 id="preise">§ 4 Fiyatlar ve kargo ücretleri</h2>
        <ol>
          <li>
            {c.smallBusiness === true ? (
              <>Tüm fiyatlar nihai fiyatlardır. Alman KDV Kanunu (UStG) § 19 anlamında küçük işletme olarak KDV almıyoruz ve bu nedenle göstermiyoruz.</>
            ) : c.smallBusiness === false ? (
              <>Tüm fiyatlar yasal KDV dahil nihai fiyatlardır.</>
            ) : (
              <Missing field="smallBusiness" label="KDV durumu (küçük işletme evet/hayır)" />
            )}
          </li>
          <li>
            Kargo ücreti eklenir: Almanya içinde sipariş başına {eur(ship.domesticCents)}
            {ship.freeFromCents !== null ? <>, {eur(ship.freeFromCents)} ve üzeri siparişlerde ücretsiz</> : null}
            {ship.euCents !== null ? <>; diğer Avrupa Birliği ülkelerine sipariş başına {eur(ship.euCents)}</> : null}
            . Diğer ülkeler için kargo ücretini talep üzerine sipariş öncesinde bildiririz. Kargo
            ücretlerini siparişi göndermeden önce özette görürsünüz.
          </li>
          <li>Avrupa Birliği dışına teslimatlarda gümrük vergileri, diğer vergiler ve harçlar doğabilir; bunları yetkili makamlara siz ödersiniz.</li>
        </ol>
      </section>

      <section>
        <h2 id="zahlung">§ 5 Ödeme</h2>
        {!anyPayment(c) ? (
          <p>
            <Missing field="payments" label="ödeme yöntemi henüz belirlenmedi" />
          </p>
        ) : (
          <>
            <p>Aşağıdaki ödeme yöntemleriyle ödeme yapabilirsiniz. Ödeme bilgilerini sipariş onayıyla birlikte göndeririz.</p>
            <ul>
              {c.payments.prepayment ? (
                <li><strong>Havale ile ön ödeme:</strong> lütfen toplam tutarı sipariş onayını aldıktan sonra 7 gün içinde havale edin. Ödeme alındıktan sonra gönderim yaparız. Hatırlatmaya rağmen ödeme yapılmazsa sözleşmeden dönebiliriz.</li>
              ) : null}
              {c.payments.paypal ? (
                <li><strong>PayPal:</strong> sipariş onayından sonra PayPal üzerinden bir ödeme talebi alırsınız. Lütfen 7 gün içinde ödeyin. Ayrıca PayPal koşulları geçerlidir. Ödeme alındıktan sonra gönderim yapılır.</li>
              ) : null}
              {c.payments.paypalInstallments ? <li><strong>PayPal ile taksitli ödeme:</strong> PayPal size bu seçeneği sunarsa, PayPal'ın kredi değerlendirmesinden sonra tutarı taksitle ödeyebilirsiniz. Kredi sözleşmesini doğrudan kredi veren PayPal ile yaparsınız; PayPal'ın koşulları ve sözleşme öncesi bilgileri geçerlidir. Biz kendimiz kredi vermiyoruz. Bizimle olan satış sözleşmeniz bundan etkilenmez.</li> : null}
              {c.payments.bankTransfer ? (
                <li><strong>Fatura (teslimattan sonra havale):</strong> fatura tutarı, ürünün tesliminden itibaren 14 gün içinde kesintisiz havale edilmelidir. Bu yöntemi tekil durumlarda, özellikle yüksek tutarlarda veya yurt dışı teslimatlarda reddedebilir ve size mevcut başka bir yöntem önerebiliriz.</li>
              ) : null}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 id="lieferung">§ 6 Teslimat</h2>
        <ol>
          <li>
            Almanya içinde
            {others.length > 0 ? <> ve şu ülkelere: {countryNames(others, "tr")}</> : null} teslimat yapıyoruz.
            Diğer ülkelere teslimat önceden anlaşma ile mümkündür. Gönderim kargo şirketi ile yapılır: {carrier}.
          </li>
          <li>Almanya içinde stoktaki ürünler için teslimat süresi: {deliveryDaysOf(c)} iş günü. Ön ödeme veya PayPal'da süre ödemenin alındığı günü izleyen gün, diğer durumlarda sözleşmenin kurulduğu günü izleyen gün başlar. Yurt dışı gönderimlerin teslimat süresini sözleşme kurulmadan önce bildiririz.</li>
          <li>Ölçüye göre ürünleri, gerekli tüm bilgiler ve – ön ödeme veya PayPal'da – ödeme bize ulaştıktan sonra yaklaşık {madeToOrderDaysOf(c)} iş günü içinde üretiriz. Tahmini gönderim tarihini size bildiririz.</li>
          <li>Ürün görünür taşıma hasarıyla gelirse lütfen bunu kuryeye bildirin ve bize kısaca haber verin. Yasal haklarınız etkilenmez; bildiriminiz kargo şirketine karşı taleplerimizi ileri sürmemize yardımcı olur.</li>
        </ol>
      </section>

      <section>
        <h2 id="eigentum">§ 7 Mülkiyetin saklı tutulması</h2>
        <p>Ürün, bedeli tamamen ödenene kadar mülkiyetimizde kalır.</p>
      </section>

      <section>
        <h2 id="massanfertigung">§ 8 Ölçüye ve isteğinize göre üretim</h2>
        <ol>
          <li>Ölçüye göre üretim olarak işaretlenen ürünleri, örneğin baş çevresi, saç rengi, yoğunluk, saç yönü ve taban gibi bilgilerinize göre üretiriz. Lütfen bilgilerinizi dikkatle kontrol edin; üretime başlamadan önce bunları sizinle görüşürüz.</li>
          <li>Ölçüye göre üretilen ürünlerde cayma hakkı yoktur (BGB § 312g fıkra 2 bent 1). Ayrıntılar cayma hakkı bilgilendirmesinde yer alır. Ayıp durumundaki haklarınız saklıdır.</li>
        </ol>
      </section>

      <section>
        <h2 id="widerrufsrecht">§ 9 Cayma hakkı</h2>
        <p>Tüketici olarak yasal bir cayma hakkınız vardır. Koşullar, süreler ve usul, istisnalar ile çevrim içi „Sözleşmeden cay” fonksiyonu cayma hakkı bilgilendirmemizde açıklanmıştır.</p>
      </section>

      <section>
        <h2 id="gewaehrleistung">§ 10 Yasal ayıp sorumluluğu</h2>
        <ol>
          <li>Ayıp durumunda yasal haklar geçerlidir (BGB § 434 vd.). Ayıptan doğan talepler için süre, ürünün tesliminden itibaren iki yıldır.</li>
          <li>Bir ayıp durumunda bize ulaşın: {c.email}, telefon {c.phone} veya posta ile: {addressLine(c)}.</li>
          <li>Ek bir ticari garantiyi yalnızca bir üründe açıkça belirttiğimizde veririz.</li>
        </ol>
      </section>

      <section>
        <h2 id="haftung">§ 11 Sorumluluk</h2>
        <ol>
          <li>Kast ve ağır ihmal hallerinde, hayata, vücuda veya sağlığa zarar verilmesi durumunda, Alman Ürün Sorumluluğu Kanunu uyarınca ve verilen bir garanti kapsamında sınırsız sorumluyuz.</li>
          <li>Sözleşmenin usulüne uygun ifası için zorunlu olan ve uyulmasına normalde güvenebileceğiniz bir yükümlülüğün (esaslı sözleşme yükümlülüğü) hafif ihmalle ihlalinde sorumluluğumuz öngörülebilir, sözleşmeye özgü zararla sınırlıdır.</li>
          <li>Bunun dışında hafif ihmal sorumluluğu hariç tutulmuştur.</li>
          <li>§ 10 uyarınca ayıp durumundaki haklarınız bu hükümlerden etkilenmez.</li>
        </ol>
      </section>

      <section>
        <h2 id="pflegeprodukte">§ 12 Bakım, yapıştırıcı ve çözücü ürünleri</h2>
        <p>Yapıştırıcıları, bantları ve çözücüleri kullanmadan önce üreticinin ambalajdaki ve ürün sayfasındaki kullanım talimatlarını ve uyarılarını okuyun ve uygulayın. Yeni bir ürünü önce küçük bir cilt bölgesinde denemenizi öneririz. Bu ürünleri çocukların ulaşamayacağı yerde saklayın. Bazı ürünler için gönderim kısıtlamaları olabilir; bunu ürün sayfasında belirtiriz.</p>
      </section>

      <section>
        <h2 id="streitbeilegung">§ 13 Tüketici uyuşmazlıklarının çözümü</h2>
        {c.disputeResolution === "willing" ? (
          <p>Şu kuruluş önündeki uyuşmazlık çözüm süreçlerine katılmaya hazırız: {UNIVERSAL_ADR.name}, {UNIVERSAL_ADR.address}, {UNIVERSAL_ADR.web}.</p>
        ) : c.disputeResolution === "not_willing" ? (
          <p>Bir tüketici uyuşmazlık çözüm kuruluşu önündeki süreçlere katılmaya hazır ve yükümlü değiliz.</p>
        ) : (
          <p>
            <Missing field="disputeResolution" label="tüketici uyuşmazlık çözümü hakkında karar (VSBG § 36)" />
          </p>
        )}
      </section>

      <section>
        <h2 id="recht">§ 14 Uygulanacak hukuk</h2>
        <p>Birleşmiş Milletler Uluslararası Mal Satımına İlişkin Sözleşmeler Hakkında Antlaşma hariç olmak üzere Federal Almanya Cumhuriyeti hukuku uygulanır. Mutat meskeniniz başka bir devletteyse, o devletin emredici tüketici koruma hükümlerinin sağladığı koruma saklıdır (Roma I Tüzüğü md. 6/2).</p>
        <p>
          Son güncelleme: {c.effectiveDate ?? <Missing field="effectiveDate" label="koşulların yürürlük tarihi" />}
        </p>
      </section>
    </>
  );
}
