import { BellRing, Building2, Palette, Save, ShieldCheck } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import {
  formGridClass,
  formInputClass,
  formLabelClass,
  fullFieldClass,
  mutedSmallTextClass,
  paddedCardClass,
  primaryButtonClass,
  sectionHeadingClass,
  sectionTitleClass,
  textareaClass,
} from '../styles/uiClasses'

const Toggle = ({ checked = false, ariaLabel }) => <label className="relative h-[22px] w-[38px] shrink-0"><input aria-label={ariaLabel} className="peer absolute opacity-0" type="checkbox" defaultChecked={checked} /><span className="absolute inset-0 rounded-full bg-gray-300 transition duration-200 ease-in-out before:absolute before:left-[3px] before:top-[3px] before:h-4 before:w-4 before:rounded-full before:bg-white before:shadow-[0_1px_3px_rgba(0,0,0,.16)] before:transition before:duration-200 before:ease-in-out peer-checked:bg-orange-500 peer-checked:before:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-300 peer-focus-visible:ring-offset-2" /></label>

export default function Settings() {
  return (
    <>
      <PageTitle title="Ayarlar" subtitle="Klinik ve uygulama tercihlerini yapılandırın." action={<button className={primaryButtonClass} type="button"><Save size={18} />Değişiklikleri Kaydet</button>} />
      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><Building2 size={20} /><div><h3 className={sectionHeadingClass}>Klinik Bilgileri</h3><p className={mutedSmallTextClass}>Kurumsal profil ve iletişim bilgileri</p></div></div><div className={formGridClass}><label className={formLabelClass}>Klinik Adı<input className={formInputClass} defaultValue="Cumhur Kesemenli Sağlık Kliniği" /></label><label className={formLabelClass}>Telefon<input className={formInputClass} defaultValue="+90 212 555 24 24" /></label><label className={formLabelClass}>E-posta<input className={formInputClass} defaultValue="bilgi@klinik.com" /></label><label className={formLabelClass}>Vergi Numarası<input className={formInputClass} defaultValue="1234567890" /></label><label className={`${formLabelClass} ${fullFieldClass}`}>Adres<textarea className={textareaClass} defaultValue="Merkez Mah. Sağlık Cad. No: 24, İstanbul" /></label></div></section>
        <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><BellRing size={20} /><div><h3 className={sectionHeadingClass}>Bildirim Ayarları</h3><p className={mutedSmallTextClass}>Hatırlatma ve sistem uyarıları</p></div></div><div className="flex flex-col gap-[15px]"><div className="flex items-center justify-between gap-2.5"><span><strong className="mb-1 block text-[11px] text-gray-700">Randevu hatırlatmaları</strong><small className="block text-[10px] text-gray-500">Yaklaşan randevular için bildirim gönder</small></span><Toggle ariaLabel="Randevu hatırlatmalarını aç veya kapat" checked /></div><div className="flex items-center justify-between gap-2.5"><span><strong className="mb-1 block text-[11px] text-gray-700">Tetkik sonucu bildirimleri</strong><small className="block text-[10px] text-gray-500">Sonuçlar hazır olduğunda haber ver</small></span><Toggle ariaLabel="Tetkik sonucu bildirimlerini aç veya kapat" checked /></div><div className="flex items-center justify-between gap-2.5"><span><strong className="mb-1 block text-[11px] text-gray-700">Günlük özet e-postası</strong><small className="block text-[10px] text-gray-500">Her sabah performans özetini gönder</small></span><Toggle ariaLabel="Günlük özet e-postasını aç veya kapat" /></div></div></section>
        <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><Palette size={20} /><div><h3 className={sectionHeadingClass}>Tema Ayarları</h3><p className={mutedSmallTextClass}>Panel görünümü ve görsel tercihler</p></div></div><div className="grid grid-cols-2 gap-3"><button className="rounded-[11px] border border-orange-400 bg-[#fffaf5] p-2 text-[11px] text-orange-600" type="button"><i className="mb-[7px] block h-[70px] rounded-[7px] bg-[linear-gradient(90deg,#1f2937_0_22%,#f3f4f6_22%_100%)]" />Açık Tema</button><button className="rounded-[11px] border border-gray-200 bg-white p-2 text-[11px] text-gray-600" type="button"><i className="mb-[7px] block h-[70px] rounded-[7px] bg-[linear-gradient(90deg,#111827_0_22%,#374151_22%_100%)]" />Koyu Tema</button></div></section>
        <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><ShieldCheck size={20} /><div><h3 className={sectionHeadingClass}>Kullanıcı Yetkileri</h3><p className={mutedSmallTextClass}>Rol bazlı erişim kontrolleri</p></div></div><div className="flex flex-col gap-[15px]"><div className="flex items-center justify-between gap-2.5"><span><strong className="mb-1 block text-[11px] text-gray-700">Rapor erişimi</strong><small className="block text-[10px] text-gray-500">Yönetici tüm raporları görüntüleyebilir</small></span><Toggle ariaLabel="Rapor erişimini aç veya kapat" checked /></div><div className="flex items-center justify-between gap-2.5"><span><strong className="mb-1 block text-[11px] text-gray-700">Personel fiyat düzenleme</strong><small className="block text-[10px] text-gray-500">Personeller fiyat listesini değiştirebilir</small></span><Toggle ariaLabel="Personel fiyat düzenlemeyi aç veya kapat" /></div><div className="flex items-center justify-between gap-2.5"><span><strong className="mb-1 block text-[11px] text-gray-700">Log görüntüleme</strong><small className="block text-[10px] text-gray-500">Yöneticiler işlem kayıtlarına erişebilir</small></span><Toggle ariaLabel="Log görüntülemeyi aç veya kapat" checked /></div></div></section>
      </div>
    </>
  )
}
