import { type Company, euro, processingDaysOf, shippingOf } from "../company-type";

/** ../checkout-texts.ts dosyasının Türkçe çevirisi (aynı anahtarlar ve yer tutucular). Yalnızca Almanca metin bağlayıcıdır. */
function build(smallBusiness: boolean | null, domesticCents: number, freeFromCents: number | null, euCents: number | null, processing: string) {
  const eur = (n: number) => euro(n, "tr-TR");
  const vatNote =
    smallBusiness === true
      ? "Alman KDV Kanunu (UStG) § 19 uyarınca KDV alınmaz. Tüm fiyatlar nihai fiyatlardır."
      : smallBusiness === false
        ? "Tüm fiyatlar yasal KDV dahil nihai fiyatlardır."
        : "[Eksik bilgi: KDV durumu]";
  const shipNote =
    `Almanya içi gönderim ${eur(domesticCents)}` +
    (freeFromCents !== null ? `, ${eur(freeFromCents)} ve üzeri ücretsiz` : "") +
    (euCents !== null ? `; AB'ye ${eur(euCents)}` : "") +
    ". Kargo ücreti toplam tutara dahildir.";

  return {
    buyButton: "Ödeme yükümlülüğü ile sipariş ver",
    consents: {
      agb: "{agb} okudum ve uygulanmasını kabul ediyorum.",
      widerruf: "Cayma hakkınız ve istisnaları (örneğin ölçüye göre ürünler) hakkındaki bilgileri {widerruf} bölümünde bulabilirsiniz.",
      datenschutz: "Verilerinizi nasıl işlediğimizi {datenschutz} bölümünde öğrenebilirsiniz.",
    },
    optionalConsents: {
      carrierEmail: "Evet, teslimat hakkında beni bilgilendirebilmesi için e-posta adresimin kargo şirketine iletilmesine izin veriyorum. Bu onayı istediğim zaman geri alabilirim.",
      newsletter: "Evet, {brand} bültenini yenilikler ve tekliflerle e-posta ile almak istiyorum. İstediğim zaman abonelikten çıkabilirim. Ayrıntılar: {datenschutz}.",
    },
    summaryNotes: [
      vatNote,
      shipNote,
      `Teslimat süresi: stoktaki ürünleri ${processing} iş günü içinde DHL'ye teslim ederiz (ön ödeme/PayPal: ödemenin alınmasından itibaren), buna taşıma süresi eklenir. Ölçüye göre ürünler: ürün sayfasına bakın.`,
      "Ürünlerin birçoğu tektir. Stok durumunu kişisel olarak kontrol ederiz; sözleşme ancak e-posta ile göndereceğimiz sipariş onayıyla kurulur. Ödemeyi ondan sonra yaparsınız.",
      "Ölçüye göre üretilen ürünlerde cayma hakkı yoktur.",
    ],
    confirmationNotice:
      "Teşekkürler, {name}! {orderNo} numaralı siparişinizi aldık. Siparişi göndererek bağlayıcı bir satın alma teklifi verdiniz. Şimdi ürününüzün mevcut olup olmadığını kişisel olarak kontrol ediyoruz ve üç iş günü içinde e-posta ile size döneceğiz. Satış sözleşmesi, siparişinizi bu onayla kabul ettiğimiz anda kurulur; onay ödeme bilgilerini de içerir. Lütfen ödemeyi ancak bundan sonra yapın. Size az önce e-posta ile bir alındı onayı gönderdik.",
    withdrawalButtonLabel: "Sözleşmeden cay",
    withdrawalConfirmLabel: "Caymayı onayla",
    withdrawalFormIntro:
      "Lütfen adınızı, sipariş numaranızı (veya sipariş tarihi ve ürünler gibi diğer bilgileri) ve alındı onayı için e-posta adresinizi girin. Siparişin tamamından veya yalnızca bazı ürünlerden cayabilirsiniz. Bilgilerinizi kontrol edin ve „Caymayı onayla” düğmesine tıklayın.",
    warrantyLabelAlt: "Yasal ayıp sorumluluğu: en az 2 yıl – Avrupa Birliği'nin uyumlaştırılmış bildirimi",
    mail: {
      orderReceived: {
        subject: "{orderNo} numaralı siparişinizin alındı onayı",
        body: [
          "Merhaba {name},",
          "",
          "Siparişiniz için teşekkür ederiz. Bu e-posta yalnızca siparişinizin bize ulaştığını teyit eder. Henüz teklifinizin kabulü değildir.",
          "",
          "Siparişiniz {orderNo}:",
          "{items}",
          "Toplam: {total}",
          "Teslimat adresi: {shippingAddress}",
          "",
          "Ürününüzün mevcut olup olmadığını kişisel olarak kontrol ediyor ve üç iş günü içinde size dönüyoruz. Satış sözleşmesi, ödeme bilgilerini de içeren sipariş onayımızla kurulur. Lütfen ödemeyi ancak ondan sonra yapın.",
          "",
          "Saygılarımızla",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderAccepted: {
        subject: "{orderNo} numaralı siparişinizin onayı",
        body: [
          "Merhaba {name},",
          "",
          "Güzel haber: ürününüz mevcut. {orderNo} numaralı siparişinizi kabul ediyoruz – satış sözleşmesi böylece kurulmuştur.",
          "",
          "{items}",
          "Toplam: {total}",
          "Teslimat adresi: {shippingAddress}",
          "",
          "Ödeme: {paymentInstructions}",
          "",
          "Ekte genel satış koşullarımızı, örnek formla birlikte cayma hakkı bilgilendirmesini ve yasal ayıp sorumluluğuna ilişkin bildirimi bulabilirsiniz. Cayma süresi içinde sitemizdeki „Sözleşmeden cay” ile çevrim içi olarak da cayabilirsiniz: {link}",
          "",
          "Saygılarımızla",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      orderDeclined: {
        subject: "Siparişiniz {orderNo}: ürün artık mevcut değil",
        body: [
          "Merhaba {name},",
          "",
          "Maalesef {orderNo} numaralı siparişinizdeki ürün artık mevcut değil. Bu nedenle siparişinizi kabul edemiyoruz; sözleşme kurulmamıştır. Ödeme yaptıysanız tutarı aynı ödeme yöntemiyle gecikmeksizin iade ederiz.",
          "",
          "Size benzer ürünler göstermekten veya isteğinize göre bir ürün üretmekten memnuniyet duyarız – bu e-postayı yanıtlamanız yeterli.",
          "",
          "Saygılarımızla",
          "{brand}",
        ].join("\n"),
      },
      withdrawalReceived: {
        subject: "Cayma beyanınızın alındı onayı",
        body: [
          "Merhaba {name},",
          "",
          "Cayma beyanınızın bize ulaştığını teyit ederiz. Alınma zamanı: {receivedDate}, saat {receivedTime}.",
          "",
          "Beyanınızın içeriği:",
          "{withdrawalContent}",
          "",
          "Bu e-posta beyanınızın alındığını teyit eder. Lütfen ürünü şu adrese gönderin: {brand}, {address}. Ürünü geri aldığımızda veya iadeyi kanıtladığınızda, ödemenizi cayma bilgilendirmemize uygun olarak iade ederiz. Bir ürün için cayma hakkının yasal bir istisnası geçerliyse sizi ayrıca bilgilendiririz.",
          "",
          "Saygılarımızla",
          "{brand}",
          "{address} · {phone} · {email}",
        ].join("\n"),
      },
      newsletterOptIn: {
        subject: "Lütfen bülten aboneliğinizi onaylayın",
        body: [
          "Merhaba,",
          "",
          "Birisi – umarız sizsiniz – bu e-posta adresini {brand} bültenine kaydetti. Lütfen aboneliği şu bağlantıya tıklayarak onaylayın:",
          "{link}",
          "",
          "Kaydı siz yapmadıysanız bu e-postayı dikkate almayın. Onay olmadan bülten almazsınız ve adresinizi 30 gün sonra sileriz.",
          "",
          "Her bültendeki bağlantıyla veya {email} adresine e-posta göndererek istediğiniz zaman abonelikten çıkabilirsiniz.",
          "",
          "Saygılarımızla",
          "{brand}",
        ].join("\n"),
      },
    },
    healthDataNotice:
      "Lütfen buraya sağlığınızla ilgili bilgi (örneğin hastalık veya tedavi) yazmayın. Danışmanlık veya üretim için bu bilgilere ihtiyacımız yoktur.",
  };
}

export type CheckoutTexts = ReturnType<typeof build>;

export function checkoutTextsFor(c: Company): CheckoutTexts {
  const s = shippingOf(c);
  return build(c.smallBusiness, s.domesticCents, s.freeFromCents, s.euCents, processingDaysOf(c));
}

export const checkoutTexts: CheckoutTexts = build(true, 600, 15000, 1500, "3–5");
