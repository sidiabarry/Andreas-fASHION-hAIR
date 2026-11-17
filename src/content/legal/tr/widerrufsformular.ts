import type { Company } from "../company-type";

/**
 * Örnek cayma formu – 2011/83/AB sayılı Direktif Ek I Bölüm B esas alınarak yapılmış Türkçe
 * çeviri (resmî AB dil sürümü yoktur). Yalnızca Almanca form (Anlage 2 EGBGB) bağlayıcıdır.
 */
export const widerrufsformular: { title: string; lines: string[] } = {
  title: "Örnek cayma formu",
  lines: [
    "(Bu formu yalnızca sözleşmeden caymak istiyorsanız doldurup gönderin.)",
    "– Alıcı [buraya satıcı tarafından satıcının adı, adresi ve e-posta adresi yazılmalıdır]:",
    "– Ben/Biz (*) aşağıdaki malların satışına (*)/aşağıdaki hizmetin ifasına (*) ilişkin sözleşmemden/sözleşmemizden (*) caydığımı/caydığımızı (*) bildiririm/bildiririz (*)",
    "– Sipariş tarihi (*)/teslim alma tarihi (*)",
    "– Tüketici(ler)in adı soyadı",
    "– Tüketici(ler)in adresi",
    "– Tüketici(ler)in imzası (yalnızca form kâğıt üzerinde gönderiliyorsa)",
    "– Tarih",
    "(*) Uygun olmayanı çiziniz.",
  ],
};

export function fillWiderrufsformular(c: Company): { title: string; lines: string[] } {
  const owner = `${c.ownerFullName ?? "[Eksik bilgi: işletme sahibinin adı]"}, ${c.brandName}`;
  const to = `– Alıcı: ${owner}, ${c.street}, ${c.zip} ${c.city}, ${c.country}, e-posta: ${c.withdrawalEmail}:`;
  return { title: widerrufsformular.title, lines: widerrufsformular.lines.map((l, i) => (i === 1 ? to : l)) };
}
