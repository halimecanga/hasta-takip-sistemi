import { Camera, KeyRound, Mail, Phone, Save, Stethoscope, UserRound } from 'lucide-react'
import PageTitle from '../components/PageTitle'
import {
  departmentTagClass,
  formGridClass,
  formInputClass,
  formLabelClass,
  mutedSmallTextClass,
  outlineButtonClass,
  paddedCardClass,
  primaryButtonClass,
  sectionHeadingClass,
  sectionTitleClass,
} from '../styles/uiClasses'

export default function Profile() {
  return (
    <>
      <PageTitle title="Profil" subtitle="Kişisel bilgilerinizi ve hesap güvenliğinizi yönetin." />
      <div className="grid grid-cols-[280px_1fr] gap-5 max-[640px]:grid-cols-1">
        <aside className={`${paddedCardClass} self-start text-center`}><div className="relative mx-auto mb-3.5 mt-1 grid h-[84px] w-[84px] place-items-center rounded-3xl bg-gradient-to-br from-orange-300 to-orange-600 text-[22px] font-extrabold text-white">CK<button aria-label="Profil fotoğrafını değiştir" className="absolute -bottom-[5px] -right-[5px] grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-gray-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2" type="button"><Camera size={16} /></button></div><h2 className="mb-[5px] text-base">Dr. Cumhur Kesemenli</h2><p className="mb-2.5 text-[11px] text-gray-500">Doktor / Yönetici</p><span className={departmentTagClass}>Dahiliye Uzmanı</span><div className="mt-5 flex flex-col gap-[11px] border-t border-[#f1f3f5] pt-[18px] text-left"><span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Mail size={17} />cumhur@klinik.com</span><span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Phone size={17} />0532 410 22 18</span><span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Stethoscope size={17} />12 yıllık deneyim</span></div></aside>
        <div className="flex flex-col gap-5">
          <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><UserRound size={20} /><div><h3 className={sectionHeadingClass}>Profil Bilgileri</h3><p className={mutedSmallTextClass}>Hesabınızda görünen kişisel bilgiler</p></div></div><div className={formGridClass}><label className={formLabelClass}>Ad Soyad<input className={formInputClass} defaultValue="Dr. Cumhur Kesemenli" /></label><label className={formLabelClass}>E-posta<input className={formInputClass} defaultValue="cumhur@klinik.com" /></label><label className={formLabelClass}>Telefon<input className={formInputClass} defaultValue="0532 410 22 18" /></label><label className={formLabelClass}>Görev<input className={formInputClass} defaultValue="Doktor / Yönetici" /></label><label className={formLabelClass}>Uzmanlık<input className={formInputClass} defaultValue="Dahiliye" /></label><label className={formLabelClass}>Diploma Numarası<input className={formInputClass} defaultValue="TR-DR-28419" /></label></div><button className={`${primaryButtonClass} mt-4`} type="button"><Save size={18} />Bilgileri Kaydet</button></section>
          <section className={`${paddedCardClass} min-w-0`}><div className={sectionTitleClass}><KeyRound size={20} /><div><h3 className={sectionHeadingClass}>Şifre Değiştir</h3><p className={mutedSmallTextClass}>Hesabınız için güçlü bir şifre belirleyin</p></div></div><div className={formGridClass}><label className={formLabelClass}>Mevcut Şifre<input className={formInputClass} type="password" placeholder="••••••••" /></label><label className={formLabelClass}>Yeni Şifre<input className={formInputClass} type="password" placeholder="En az 8 karakter" /></label><label className={formLabelClass}>Yeni Şifre Tekrar<input className={formInputClass} type="password" placeholder="Yeni şifrenizi tekrar girin" /></label></div><button className={outlineButtonClass} type="button">Şifreyi Güncelle</button></section>
        </div>
      </div>
    </>
  )
}
