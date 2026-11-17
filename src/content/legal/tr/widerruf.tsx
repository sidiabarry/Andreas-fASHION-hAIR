import { type Company, addressLine } from "../company-type";
import { fillWiderrufsformular } from "./widerrufsformular";

const Missing = ({ field, label }: { field: string; label: string }) => (
  <mark data-missing={field}>[Eksik bilgi: {label}]</mark>
);

export default function Page({ company: c }: { company: Company }) {
  const form = fillWiderrufsformular(c);
  const where = c.withdrawalUrl ? <>{c.withdrawalUrl}</> : <>web sitemizdeki her sayfanın altında bulunan „Sözleşmeden cay” düğmesi</>;
  return (
    <>
      <p>
        <strong>Not:</strong> Hukuken yalnızca Almanca metin bağlayıcıdır; bu çeviri yalnızca
        anlamayı kolaylaştırmak içindir.
      </p>
      <section>
        <h2 id="widerrufsbelehrung">1. Cayma hakkına ilişkin bilgilendirme</h2>
        <h3 id="widerrufsrecht">Cayma hakkı</h3>
        <p>On dört gün içinde herhangi bir gerekçe göstermeksizin bu sözleşmeden cayma hakkına sahipsiniz.</p>
        <p>Cayma süresi, sizin veya taşıyıcı dışında sizin belirleyeceğiniz üçüncü bir kişinin malı fiilen teslim aldığı günden itibaren on dört gündür. Tek siparişte birden fazla mal sipariş ettiyseniz ve bunlar ayrı ayrı teslim ediliyorsa süre, sizin veya taşıyıcı dışında sizin belirlediğiniz üçüncü kişinin son malı fiilen teslim aldığı günden itibaren on dört gündür.</p>
        <p>
          Cayma hakkınızı kullanmak için bize (
          {c.ownerFullName ?? <Missing field="ownerFullName" label="işletme sahibinin tam adı" />}, {c.brandName},{" "}
          {addressLine(c)}, telefon {c.phone}, e-posta {c.withdrawalEmail}) bu sözleşmeden cayma
          kararınızı açık bir beyanla (örneğin posta ile gönderilen bir mektup veya e-posta)
          bildirmeniz gerekir. Bunun için ekteki örnek cayma formunu kullanabilirsiniz; ancak bu
          zorunlu değildir.
        </p>
        <p>Cayma hakkınızı şu yolla çevrim içi olarak da kullanabilirsiniz: {where}. Bu çevrim içi fonksiyonu kullanırsanız, size kalıcı bir veri saklayıcısıyla (örneğin e-posta ile) gecikmeksizin, cayma beyanının içeriğini ve alındığı tarih ile saati içeren bir alındı onayı göndeririz.</p>
        <p>Cayma süresine uymak için, cayma hakkını kullandığınıza ilişkin bildirimi cayma süresi dolmadan göndermeniz yeterlidir.</p>

        <h3 id="folgen">Caymanın sonuçları</h3>
        <p>Bu sözleşmeden caymanız halinde, teslimat masrafları dahil sizden aldığımız tüm ödemeleri (sunduğumuz en ucuz standart teslimat dışında bir teslimat türü seçmenizden kaynaklanan ek masraflar hariç) gecikmeksizin ve her halükârda cayma kararınızın bize ulaştığı günden itibaren en geç on dört gün içinde iade ederiz. İadede, sizinle açıkça başka bir şey kararlaştırılmadıkça, ilk işlemde kullandığınız ödeme aracını kullanırız; bu iade nedeniyle sizden hiçbir ücret alınmaz. Malı geri alana veya malı geri gönderdiğinizi kanıtlayana kadar – hangisi önce olursa – iadeyi bekletebiliriz.</p>
        <p>Malı gecikmeksizin ve her halükârda bu sözleşmeden caydığınızı bize bildirdiğiniz günden itibaren en geç on dört gün içinde bize geri göndermeli veya teslim etmelisiniz. Malı on dört günlük süre dolmadan gönderirseniz süreye uyulmuş olur.</p>
        <p>
          {c.returnCosts === "merchant" ? (
            <>Malın geri gönderim masraflarını biz üstleniriz.</>
          ) : c.returnCosts === "customer" ? (
            <>Malın geri gönderiminin doğrudan masraflarını siz üstlenirsiniz.</>
          ) : (
            <Missing field="returnCosts" label="iade masraflarını kimin üstleneceği (işletme sahibinin kararı)" />
          )}
        </p>
        <p>Malın değerindeki bir kayıptan yalnızca, bu kayıp malın niteliğini, özelliklerini ve işleyişini anlamak için gerekli olanın ötesinde kullanılmasından kaynaklanıyorsa sorumlusunuz.</p>

        <h3 id="ausschluss">Cayma hakkının bulunmaması veya erken sona ermesi</h3>
        <p>Şu sözleşmelerde cayma hakkı yoktur:</p>
        <ul>
          <li>önceden üretilmemiş olan ve üretimi için tüketicinin bireysel seçimi veya belirlemesi belirleyici olan ya da açıkça tüketicinin kişisel ihtiyaçlarına göre hazırlanan malların teslimine ilişkin sözleşmeler. Bizde bu, ölçüye göre üretim olarak işaretlenen tüm ürünleri kapsar; örneğin ölçüye göre üretilen saç protezi.</li>
        </ul>
        <p>Şu sözleşmelerde cayma hakkı erken sona erer:</p>
        <ul>
          <li>sağlığın korunması veya hijyen nedenleriyle iadeye uygun olmayan, mühürlü olarak teslim edilen ve teslimden sonra mührü açılan malların teslimine ilişkin sözleşmeler. Bu yalnızca mühürlü olarak teslim ettiğimiz ve ürün sayfasında bu şekilde işaretlediğimiz ürünler için geçerlidir.</li>
        </ul>
      </section>

      <section>
        <h2 id="formular">2. {form.title}</h2>
        <ul>
          {form.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 id="online-widerruf">3. Web sitemiz üzerinden nasıl cayılır</h2>
        <ol>
          <li>„Sözleşmeden cay” düğmesine tıklayın. Düğme, cayma süresi boyunca sitemizin her sayfasında bulunur.</li>
          <li>Adınızı, sipariş numaranızı veya siparişe ilişkin diğer bilgileri ve alındı onayının gönderileceği e-posta adresini girin. Bir siparişteki yalnızca bazı ürünlerden de cayabilirsiniz.</li>
          <li>Bilgileri kontrol edin ve „Caymayı onayla” düğmesine tıklayın.</li>
          <li>Beyanınızın içeriğini ve alınma tarihi ile saatini içeren alındı onayını size gecikmeksizin e-posta ile göndeririz.</li>
        </ol>
        <p>Alındı onayı yalnızca beyanınızın bize ulaştığını teyit eder. Bir ürün için cayma hakkının istisnası geçerliyse sizi ayrıca bilgilendiririz.</p>
      </section>

      <section>
        <h2 id="ruecksendung">4. İade ile ilgili notlar</h2>
        <p>Lütfen ürünü şu adrese gönderin: {c.brandName}, {addressLine(c)}. Ürünü iyi korunmuş – mümkünse orijinal ambalajında – ve sipariş numarasıyla birlikte gönderirseniz işlemi kolaylaştırırsınız. Bu, geçerli bir cayma için şart değildir. Saç ürünlerini bir mağazada olduğu gibi dikkatlice deneyebilirsiniz; cayma süresi dolmadan kesmeyin, boyamayın, yıkamayın veya yapıştırmayın; aksi takdirde bilgilendirme uyarınca sorumlu olacağınız bir değer kaybı oluşabilir.</p>
      </section>
    </>
  );
}
