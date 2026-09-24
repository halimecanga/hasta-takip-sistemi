import { useEffect, useState } from 'react'
import { Camera, KeyRound, Mail, Phone, Save, Stethoscope, UserRound } from 'lucide-react'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import { profileApi } from '../services/api'
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
  const [profile, setProfile] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    profileApi.get().then(setProfile).catch((error) => setNotification({ message: error.message, tone: 'error' }))
  }, [])

  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }))

  const saveProfile = async () => {
    try {
      setIsSaving(true)
      const result = await profileApi.update(profile)
      setProfile(result.profile)
      setNotification({ message: result.message, tone: 'success' })
    } catch (error) {
      setNotification({ message: error.message, tone: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  if (!profile) return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Profil yükleniyor...</section>

  return (
    <>
      <PageTitle title="Profil" subtitle="Kişisel bilgilerinizi ve hesap güvenliğinizi yönetin." />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className="grid grid-cols-[280px_1fr] gap-5 max-[640px]:grid-cols-1">
        <aside className={`${paddedCardClass} self-start text-center`}>
          <div className="relative mx-auto mb-3.5 mt-1 grid h-[84px] w-[84px] place-items-center rounded-3xl bg-gradient-to-br from-orange-300 to-orange-600 text-[22px] font-extrabold text-white">CK<button aria-label="Profil fotoğrafını değiştir" className="absolute -bottom-[5px] -right-[5px] grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-gray-700 text-white" disabled title="Fotoğraf yükleme henüz uygulanmadı." type="button"><Camera size={16} /></button></div>
          <h2 className="mb-[5px] text-base">{profile.fullName}</h2>
          <p className="mb-2.5 text-[11px] text-gray-500">{profile.role}</p>
          <span className={departmentTagClass}>{profile.specialty}</span>
          <div className="mt-5 flex flex-col gap-[11px] border-t border-[#f1f3f5] pt-[18px] text-left">
            <span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Mail size={17} />{profile.email}</span>
            <span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Phone size={17} />{profile.phone}</span>
            <span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Stethoscope size={17} />{profile.diplomaNo}</span>
          </div>
        </aside>
        <div className="flex flex-col gap-5">
          <section className={`${paddedCardClass} min-w-0`}>
            <div className={sectionTitleClass}><UserRound size={20} /><div><h3 className={sectionHeadingClass}>Profil Bilgileri</h3><p className={mutedSmallTextClass}>Hesabınızda görünen kişisel bilgiler</p></div></div>
            <div className={formGridClass}>
              <label className={formLabelClass}>Ad Soyad<input className={formInputClass} value={profile.fullName} onChange={(event) => update('fullName', event.target.value)} /></label>
              <label className={formLabelClass}>E-posta<input className={formInputClass} value={profile.email} onChange={(event) => update('email', event.target.value)} /></label>
              <label className={formLabelClass}>Telefon<input className={formInputClass} value={profile.phone || ''} onChange={(event) => update('phone', event.target.value)} /></label>
              <label className={formLabelClass}>Görev<input className={formInputClass} value={profile.role} onChange={(event) => update('role', event.target.value)} /></label>
              <label className={formLabelClass}>Uzmanlık<input className={formInputClass} value={profile.specialty || ''} onChange={(event) => update('specialty', event.target.value)} /></label>
              <label className={formLabelClass}>Diploma Numarası<input className={formInputClass} value={profile.diplomaNo || ''} onChange={(event) => update('diplomaNo', event.target.value)} /></label>
            </div>
            <button className={`${primaryButtonClass} mt-4`} disabled={isSaving} type="button" onClick={saveProfile}><Save size={18} />{isSaving ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}</button>
          </section>
          <section className={`${paddedCardClass} min-w-0`}>
            <div className={sectionTitleClass}><KeyRound size={20} /><div><h3 className={sectionHeadingClass}>Şifre Değiştir</h3><p className={mutedSmallTextClass}>Kimlik doğrulama bağlanmadan parola değiştirilemez</p></div></div>
            <p className="mb-3 text-xs text-gray-500">Bu endpoint yetkisiz parola değişikliğine açık olacağı için devre dışıdır. Tam bir giriş sistemi eklenene kadar şifre güncellenemez.</p>
            <div className={formGridClass}>
              <label className={formLabelClass}>Mevcut Şifre<input className={formInputClass} disabled type="password" /></label>
              <label className={formLabelClass}>Yeni Şifre<input className={formInputClass} disabled type="password" /></label>
              <label className={formLabelClass}>Yeni Şifre Tekrar<input className={formInputClass} disabled type="password" /></label>
            </div>
            <button className={`${outlineButtonClass} opacity-60`} disabled title="Kimlik doğrulama sistemi bağlanmadan şifre değiştirilemez." type="button">Şifreyi Güncelle</button>
          </section>
        </div>
      </div>
    </>
  )
}
