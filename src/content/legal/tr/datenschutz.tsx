import { type Company, GOOGLE_IRELAND, LDI_NRW, META_IRELAND, PAYPAL_EUROPE, WHATSAPP_IRELAND, addressLine } from "../company-type";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Eksik bilgi: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const carrier = c.carrier ?? <Missing field="carrier" label="kargo şirketi" />;
  const gmail = c.email.toLowerCase().endsWith("@gmail.com");
  return (
    <>
      <p>
        <strong>Not:</strong> Hukuken yalnızca Almanca metin bağlayıcıdır; bu çeviri yalnızca
        anlamayı kolaylaştırmak içindir.
      </p>
      <section>
        <h2 id="ueberblick">1. Özet</h2>
        <ul>
          <li>Bu site çerez, analiz aracı veya reklam izleyicisi kullanmaz.</li>
          <li>Yazı tipleri ve videolar kendi sunucumuzda bulunur. Siteyi ziyaret ettiğinizde Google, YouTube, Meta veya benzeri sağlayıcılara veri aktarılmaz.</li>
          <li>Verilerinizi yalnızca siparişinizi veya talebinizi işlemek, yasal yükümlülükleri yerine getirmek ve – yalnızca onayınızla – bültenimizi göndermek için işleriz.</li>
          <li>Lütfen bize sağlık verisi göndermeyin (bkz. madde 8).</li>
        </ul>
      </section>

      <section>
        <h2 id="verantwortliche">2. Veri sorumlusu</h2>
        <p>Genel Veri Koruma Tüzüğü (GDPR) anlamında veri sorumlusu:</p>
        <p>
          {c.ownerFullName ?? <Missing field="ownerFullName" label="işletme sahibinin tam adı" />} ({c.brandName})
          <br />
          {addressLine(c)}
          <br />
          Telefon: {c.phone}
          <br />
          E-posta: {c.email}
        </p>
        <p>Yasal olarak bir veri koruma görevlisi atamakla yükümlü değiliz. Veri korumayla ilgili tüm sorularınız için yukarıdaki iletişim bilgilerinden bize ulaşabilirsiniz.</p>
      </section>

      <section>
        <h2 id="hosting">3. Barındırma ve sunucu kayıt dosyaları</h2>
        <p>Web sitemiz {c.hostingProvider.name}, {c.hostingProvider.address} tarafından barındırılmaktadır. Her ziyarette sunucu, tarayıcınızın otomatik olarak gönderdiği teknik açıdan gerekli verileri işler: IP adresi, tarih ve saat, açılan sayfa, aktarılan veri miktarı, durum kodu, yönlendiren URL ile tarayıcı ve işletim sistemi bilgileri.</p>
        <p>Bu verilere siteyi sunmak, güvenliğini sağlamak ve saldırıları önlemek için ihtiyaç duyarız. Hukuki dayanak GDPR md. 6/1-f'dir; meşru menfaatimiz güvenli ve çalışan bir sitedir. Kayıt dosyalarını istatistik veya pazarlama amacıyla analiz etmez, başka verilerle birleştirmeyiz. Barındırma sağlayıcısı kayıtları yalnızca teknik olarak gerekli kısa bir süre saklar ve ardından otomatik olarak siler.</p>
        <p>Barındırma sağlayıcısıyla GDPR md. 28 uyarınca bir veri işleme sözleşmesi yaptık. ABD'ye aktarım için bkz. madde 13.</p>
      </section>

      <section>
        <h2 id="endgeraet">4. Tarayıcınızda saklama (çerez yok, izleme yok)</h2>
        <p>Siz gezinirken sepetinizin korunması için seçtiğiniz ürünleri tarayıcınızın yerel belleğine (localStorage) kaydederiz. Bu bilgiler cihazınızda kalır ve yalnızca sipariş gönderdiğinizde bize iletilir. Sepeti boşaltarak veya tarayıcınızdaki site verilerini silerek bunları istediğiniz zaman kaldırabilirsiniz.</p>
        <p>Bu saklama, açıkça talep ettiğiniz sepet hizmetini sunmak için kesinlikle gereklidir. Bu nedenle Alman TDDDG § 25 fıkra 2 bent 2 uyarınca onay gerekmez. Kişisel veri söz konusuysa hukuki dayanak GDPR md. 6/1-b'dir (sözleşme öncesi adımlar).</p>
      </section>

      <section>
        <h2 id="inhalte">5. Yazı tipleri, görseller ve videolar</h2>
        <p>Tüm yazı tipleri, fotoğraflar ve videolar kendi barındırma hizmetimizden sunulur. Üçüncü taraf içerikleri (örneğin Google Fonts, YouTube veya Vimeo) yüklenmez.</p>
      </section>

      <section>
        <h2 id="anfragen">6. İletişim, danışmanlık ve talepler</h2>
        <p>Bizimle form, e-posta veya telefon yoluyla iletişime geçtiğinizde – örneğin danışmanlık, ölçüye göre üretim veya salon talebi için – bize verdiğiniz bilgileri (genellikle ad, e-posta adresi, gerekirse telefon numarası ve mesajınız) işleriz.</p>
        <p>Amaç talebinizi yanıtlamaktır. Talebiniz bir sözleşmeyle ilgiliyse hukuki dayanak GDPR md. 6/1-b, aksi halde md. 6/1-f'dir (talepleri yanıtlamaya yönelik meşru menfaatimiz). Talepleri, bir sözleşme doğmadıysa sonuçlandıktan sonra, en geç son iletişimden 12 ay sonra sileriz. Sözleşme kurulursa madde 15'teki süreler geçerlidir.</p>
        <p>Form verilerini veritabanımızda saklar, bildirimler için bir e-posta gönderim hizmeti kullanırız (bkz. madde 12).</p>
        {gmail ? (
          <p>E-posta kutumuz {GOOGLE_IRELAND} (Gmail) tarafından sağlanmaktadır. Bize gönderdiğiniz e-postalar ve yanıtlarımız bu nedenle Google sunucularında saklanır; veriler ABD'ye aktarılabilir (bkz. madde 13).</p>
        ) : null}
      </section>

      <section>
        <h2 id="whatsapp">7. WhatsApp üzerinden iletişim</h2>
        {c.social?.whatsapp ? (
          <>
            <p>İsterseniz bize WhatsApp üzerinden de yazabilirsiniz. Sağlayıcı: {WHATSAPP_IRELAND}. WhatsApp, Meta grubuna aittir; veriler ABD'ye aktarılabilir. WhatsApp telefon numaranızı, profilinizi, iletişim üst verilerini (örneğin saat) ve – ayarlarınıza bağlı olarak – rehberinizi kendi sorumluluğunda işler. Ayrıntılar için WhatsApp gizlilik politikasına bakın.</p>
            <p>Mesajları yalnızca talebinizi yanıtlamak için kullanırız (GDPR md. 6/1-b veya f) ve sohbetleri sonuçlandıktan sonra, en geç 12 ay içinde sileriz. Bize her zaman e-posta veya telefonla da ulaşabilirsiniz. Lütfen WhatsApp üzerinden sağlık verisi göndermeyin.</p>
          </>
        ) : (
          <p>Şu anda mesajlaşma hizmetleri üzerinden iletişim sunmuyoruz.</p>
        )}
      </section>

      <section>
        <h2 id="gesundheitsdaten">8. Lütfen sağlık verisi paylaşmayın</h2>
        <p>Müşterilerimizin birçoğu sağlık nedenleriyle saç protezi kullanmaktadır. Danışmanlık, sipariş veya ölçüye göre üretim için bu nedenleri bilmemiz gerekmez. Bu nedenle formlarımız sağlık verisi istemez; lütfen bize hastalık, tedavi veya teşhis bilgisi vermeyin. Ölçüye göre üretim için baş çevresi, saç rengi, saç uzunluğu ve istenen model yeterlidir.</p>
        <p>Yine de sağlık verisi paylaşırsanız, bunlar GDPR md. 9 anlamında özel nitelikli verilerdir. Bunları kullanmaz ve fark ettiğimiz anda sileriz; talebinizi yanıtlamak için istisnai olarak gerekmedikçe. Bu durumda önce açık rızanızı isteriz (GDPR md. 9/2-a); rızanızı istediğiniz zaman geri alabilirsiniz.</p>
      </section>

      <section>
        <h2 id="bestellung">9. Sipariş ve sözleşmenin ifası</h2>
        <p>Siparişiniz için ad, teslimat ve fatura adresi, e-posta adresi, gerekirse telefon numarası, sipariş edilen ürünler, fiyatlar, ödeme ve gönderim bilgileri ile mesajınızı işleriz. Zorunlu alanlar işaretlidir; bunlar olmadan sözleşmeyi kuramaz veya ifa edemeyiz.</p>
        <p>Hukuki dayanaklar GDPR md. 6/1-b (sözleşme öncesi adımlar ve sözleşmenin ifası) ve faturaların ile muhasebe belgelerinin saklanması için vergi ve ticaret hukuku yükümlülükleriyle bağlantılı olarak md. 6/1-c'dir (bkz. madde 15).</p>
        <p>Teslimat için adınızı ve teslimat adresinizi kargo şirketine ({carrier}) iletiriz. E-posta adresinizi veya telefon numaranızı yalnızca sipariş sırasında açıkça onay verdiyseniz, teslimat hakkında sizi bilgilendirebilmesi için kargo şirketine iletiriz (GDPR md. 6/1-a). Bu onayı istediğiniz zaman ileriye dönük olarak geri alabilirsiniz.</p>
      </section>

      <section>
        <h2 id="zahlung">10. Ödeme</h2>
        {c.payments.prepayment || c.payments.bankTransfer ? (
          <p>Havale ile ödemede, ödemeyi siparişinizle eşleştirmek için havaleyle birlikte gelen bilgileri (ad, hesap bilgileri, tutar, açıklama) işleriz (GDPR md. 6/1-b ve c). Sizin bankanız ve bizim bankamız verileri kendi sorumluluğunda işler.</p>
        ) : null}
        {c.payments.paypal ? (
          <p>PayPal ile ödediğinizde ödeme için gerekli verileri (ad, e-posta adresi, tutar, sipariş numarası, gerekirse teslimat adresi) şu şirkete iletiriz: {PAYPAL_EUROPE}. PayPal bu verileri bağımsız veri sorumlusu olarak, diğerlerinin yanı sıra dolandırıcılığı önleme ve gerekirse kredi değerliliği kontrolü için işler; üçüncü ülkelere aktarım olabilir. Aktarımımızın hukuki dayanağı GDPR md. 6/1-b'dir. PayPal'a karşı haklarınız PayPal gizlilik bildiriminde yer alır: https://www.paypal.com/tr/legalhub/privacy-full.</p>
        ) : null}
        {!c.payments.prepayment && !c.payments.bankTransfer && !c.payments.paypal ? (
          <p>
            <Missing field="payments" label="ödeme yöntemi henüz belirlenmedi" />
          </p>
        ) : null}
      </section>

      <section>
        <h2 id="widerruf">11. Web sitemiz üzerinden cayma</h2>
        <p>Cayma fonksiyonumuzu („Sözleşmeden cay”) kullanarak bir sözleşmeden caydığınızda adınızı, sipariş bilgilerini, e-posta adresinizi ve alınma tarihi ile saatini işleriz. Size e-posta ile bir alındı onayı gönderir ve caymayı işleme alırız. Hukuki dayanak, Alman Medeni Kanunu (BGB) § 356a ile bağlantılı olarak GDPR md. 6/1-c ve md. 6/1-b'dir.</p>
      </section>

      <section>
        <h2 id="dienstleister">12. Hizmet sağlayıcılar (veri işleyenler)</h2>
        <p>Verileri yalnızca talimatımız doğrultusunda işleyen, özenle seçilmiş hizmet sağlayıcılarla çalışırız. Bunlarla GDPR md. 28 uyarınca sözleşmeler yapılmıştır.</p>
        <ul>
          <li>
            {c.hostingProvider.name}, {c.hostingProvider.address} – web sitesi barındırma
          </li>
          {gmail ? <li>{GOOGLE_IRELAND} – e-posta kutusu (Gmail)</li> : null}
          {c.processors.map((p) => (
            <li key={p.name}>
              {p.name} – {p.purpose}; işleme yeri: {p.country}; aktarım dayanağı: {p.basis}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="drittland">13. Üçüncü ülkelere aktarım</h2>
        <p>Bazı hizmet sağlayıcıların merkezi ABD'dedir veya verileri orada işleyebilir. Avrupa Komisyonu ABD için 10 Temmuz 2023'te bir yeterlilik kararı almıştır (AB-ABD Veri Gizliliği Çerçevesi). Sertifikalı şirketlere aktarımlar GDPR md. 45'e dayanır. Ek olarak veya sertifikasız alıcılar için Avrupa Komisyonu'nun standart sözleşme hükümlerini kararlaştırdık (GDPR md. 46/2-c). Bir kopyasını bizden isteyebilirsiniz. Geçerli dayanak madde 12'deki listede belirtilmiştir.</p>
      </section>

      <section>
        <h2 id="newsletter">14. Bülten</h2>
        <p>Bültenimizi yalnızca açıkça abone olursanız alırsınız. Kayıttan sonra size onay bağlantısı içeren bir e-posta göndeririz (çift onay). Ancak bu bağlantıya tıkladığınızda sizi listeye ekleriz. Onaylanmamış kayıtları 30 gün sonra sileriz.</p>
        <p>Onayınızı kanıtlayabilmek için e-posta adresinizi ve kayıt ile onay zamanını saklarız. Hukuki dayanak onayınızdır (GDPR md. 6/1-a; Alman Haksız Rekabet Kanunu – UWG § 7 fıkra 2 bent 2); kanıtı GDPR md. 7/1 ile bağlantılı olarak md. 6/1-c'ye dayanarak saklarız. Açılma veya tıklamaları ölçmeyiz.</p>
        <p>Her bültendeki bağlantıyla veya {c.email} adresine yazarak istediğiniz zaman abonelikten çıkabilirsiniz. Bunun üzerine adresinizi listeden sileriz; onay kanıtını, taleplere karşı savunma yapabilmek için abonelikten çıktığınız yılın sonundan itibaren en fazla üç yıl saklarız.</p>
      </section>

      <section>
        <h2 id="speicherdauer">15. Saklama süreleri</h2>
        <ul>
          <li>Sözleşme verilerini, sözleşme tamamen ifa edilene ve iki yıllık yasal ayıp sorumluluğu süresi dolana kadar saklarız.</li>
          <li>Faturaları ve muhasebe belgelerini sekiz yıl saklarız (Alman Vergi Usul Kanunu – AO § 147 fıkra 1 ve 3).</li>
          <li>Sipariş onayları gibi ticari yazışmaları altı yıl saklarız (AO § 147 fıkra 1 ve 3).</li>
          <li>Süreler, belgenin oluşturulduğu takvim yılının sonunda başlar. Bu süre boyunca işlemeyi saklama ile sınırlarız.</li>
          <li>Diğer tüm verileri artık gerekli olmadıklarında sileriz; süreler ilgili maddelerde belirtilmiştir.</li>
        </ul>
      </section>

      <section>
        <h2 id="links">16. Harici bağlantılar ve sosyal medya</h2>
        <p>Web sitemizde Instagram ve Facebook profillerimize ve WhatsApp'a bağlantı veriyoruz. Bunlar yerleşik eklentiler değil, basit bağlantılardır: Sitemizi yalnızca ziyaret etmeniz bu sağlayıcılara veri aktarmaz.</p>
        <p>Ancak bir bağlantıya tıkladığınızda sağlayıcının sayfası açılır ve sağlayıcı verilerinizi kendi sorumluluğunda işler. Instagram ve Facebook'un sağlayıcısı: {META_IRELAND}. WhatsApp'ın sağlayıcısı: {WHATSAPP_IRELAND}. Veriler ABD'ye aktarılabilir. Ayrıntılar için sağlayıcıların gizlilik bildirimlerine bakın.</p>
      </section>

      <section>
        <h2 id="rechte">17. Haklarınız</h2>
        <p>Verilerinizle ilgili aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Erişim (GDPR md. 15)</li>
          <li>Düzeltme (GDPR md. 16)</li>
          <li>Silme (GDPR md. 17)</li>
          <li>İşlemenin kısıtlanması (GDPR md. 18)</li>
          <li>Veri taşınabilirliği (GDPR md. 20)</li>
          <li>Onayın ileriye dönük geri alınması (GDPR md. 7/3); o zamana kadarki işleme hukuka uygun kalır</li>
        </ul>
        <p>
          <strong>İtiraz hakkı (GDPR md. 21):</strong> Verileri GDPR md. 6/1-f'ye dayanarak
          işlediğimiz durumlarda, özel durumunuzdan kaynaklanan nedenlerle istediğiniz zaman itiraz
          edebilirsiniz. Zorlayıcı meşru gerekçeler ortaya koymadıkça veya işleme hukuki taleplerin
          tesisi, kullanılması ya da savunulması için gerekli olmadıkça verileri artık işlemeyiz.
          İtirazınızdan sonra size bir daha asla reklam göndermeyiz.
        </p>
        <p>Tüm talepleriniz için {c.email} adresine kısa bir mesaj yeterlidir.</p>
      </section>

      <section>
        <h2 id="beschwerde">18. Şikâyet hakkı</h2>
        <p>Bir denetim makamına şikâyette bulunabilirsiniz (GDPR md. 77), örneğin ikamet ettiğiniz yerde. Bizim için yetkili makam:</p>
        <p>
          {LDI_NRW.name}
          <br />
          {LDI_NRW.address}
          <br />
          {LDI_NRW.web}
        </p>
      </section>

      <section>
        <h2 id="sonstiges">19. Güvenlik, otomatik kararlar, değişiklikler</h2>
        <p>Web sitemize bağlantı TLS ile şifrelenir („https://” ile anlaşılır). GDPR md. 22 anlamında otomatik karar almayız ve profil oluşturmayız. Bu gizlilik politikasını, sitemiz veya mevzuat değiştiğinde güncelleriz.</p>
        <p>
          Son güncelleme: {c.effectiveDate ?? <Missing field="effectiveDate" label="yürürlük tarihi" />}
        </p>
      </section>
    </>
  );
}
