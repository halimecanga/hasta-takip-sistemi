import { Save, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  formGridClass,
  formInputClass,
  formLabelClass,
  fullFieldClass,
  outlineButtonClass,
  paddedCardClass,
  primaryButtonClass,
  textareaClass,
} from '../../styles/uiClasses'

const FieldError = ({ id, message }) => message ? <span className="mt-1 text-[10px] font-semibold text-red-600" id={id}>{message}</span> : null

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const roleOptions = [
  { value: 'nurse', label: 'Hemşire' },
  { value: 'secretary', label: 'Tıbbi Sekreter' },
  { value: 'advisor', label: 'Hasta Danışmanı' },
  { value: 'accounting', label: 'Muhasebe Sorumlusu' },
  { value: 'support', label: 'Destek Personeli' },
  { value: 'doctor', label: 'Doktor / Yönetici' },
]

const workTypeOptions = ['Tam Zamanlı', 'Yarı Zamanlı', 'Vardiyalı', 'Sözleşmeli']

const initialForm = {
  name: '',
  roleType: 'nurse',
  roleNote: '',
  department: 'Genel Klinik',
  phone: '',
  email: '',
  birthDate: '',
  hireDate: '05 Haziran 2026',
  workType: 'Tam Zamanlı',
  workDays: 'Pazartesi - Cuma',
  startTime: '09:00',
  endTime: '18:00',
  address: '',
  emergencyName: '',
  emergencyPhone: '',
  note: '',
}

export default function AddStaffForm({ hasDoctor, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Ad soyad boş bırakılamaz.'
    if (!form.roleType) nextErrors.roleType = 'Rol seçilmelidir.'
    if (form.roleType === 'doctor' && hasDoctor) nextErrors.roleType = 'Tek doktor kuralı nedeniyle yeni doktor eklenemez.'
    if (!form.department.trim()) nextErrors.department = 'Departman boş bırakılamaz.'
    if (!form.phone.trim()) nextErrors.phone = 'Telefon boş bırakılamaz.'
    if (!form.email.trim()) nextErrors.email = 'E-posta boş bırakılamaz.'
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Geçerli bir e-posta adresi girin.'
    if (!form.workDays.trim()) nextErrors.workDays = 'Çalışma günleri boş bırakılamaz.'
    if (!form.startTime) nextErrors.startTime = 'Başlangıç saati seçilmelidir.'
    if (!form.endTime) nextErrors.endTime = 'Bitiş saati seçilmelidir.'

    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) document.getElementById(`add-staff-${firstError}`)?.focus()
    return Object.keys(nextErrors).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return

    const result = onSubmit(form)
    if (!result.ok) {
      setSubmitError(result.message)
      document.getElementById('add-staff-roleType')?.focus()
    }
  }

  const inputProps = (key) => ({
    'aria-describedby': errors[key] ? `add-staff-${key}-error` : undefined,
    'aria-invalid': Boolean(errors[key]),
    id: `add-staff-${key}`,
    value: form[key],
    onChange: (event) => update(key, event.target.value),
  })

  return (
    <form className={`${paddedCardClass} space-y-5`} onSubmit={submit}>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Personel Bilgileri</h2>
        <p className="mt-1 text-xs text-gray-500">Yeni personel kaydı yalnızca bu oturumdaki frontend state içinde tutulur.</p>
      </div>
      {submitError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {submitError}
        </div>
      )}
      <div className={formGridClass}>
        <label className={formLabelClass} htmlFor="add-staff-name">
          <span>Ad Soyad <span className="text-red-500">*</span></span>
          <input className={formInputClass} placeholder="Örn. Elif Aksoy" {...inputProps('name')} />
          <FieldError id="add-staff-name-error" message={errors.name} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-roleType">
          <span>Rol <span className="text-red-500">*</span></span>
          <select className={formInputClass} {...inputProps('roleType')}>
            {roleOptions.map((option) => (
              <option disabled={option.value === 'doctor' && hasDoctor} key={option.value} value={option.value}>
                {option.label}{option.value === 'doctor' && hasDoctor ? ' (mevcut)' : ''}
              </option>
            ))}
          </select>
          <FieldError id="add-staff-roleType-error" message={errors.roleType} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-department">
          <span>Departman <span className="text-red-500">*</span></span>
          <input className={formInputClass} {...inputProps('department')} />
          <FieldError id="add-staff-department-error" message={errors.department} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-phone">
          <span>Telefon <span className="text-red-500">*</span></span>
          <input className={formInputClass} type="tel" placeholder="05xx xxx xx xx" {...inputProps('phone')} />
          <FieldError id="add-staff-phone-error" message={errors.phone} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-email">
          <span>E-posta <span className="text-red-500">*</span></span>
          <input className={formInputClass} type="email" placeholder="ad@klinik.com" {...inputProps('email')} />
          <FieldError id="add-staff-email-error" message={errors.email} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-birthDate">
          Doğum Tarihi
          <input className={formInputClass} placeholder="Örn. 12 Mart 1992" {...inputProps('birthDate')} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-hireDate">
          İşe Başlama
          <input className={formInputClass} {...inputProps('hireDate')} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-workType">
          Çalışma Şekli
          <select className={formInputClass} {...inputProps('workType')}>
            {workTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className={formLabelClass} htmlFor="add-staff-workDays">
          <span>Çalışma Günleri <span className="text-red-500">*</span></span>
          <input className={formInputClass} {...inputProps('workDays')} />
          <FieldError id="add-staff-workDays-error" message={errors.workDays} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-startTime">
          <span>Başlangıç Saati <span className="text-red-500">*</span></span>
          <input className={formInputClass} type="time" {...inputProps('startTime')} />
          <FieldError id="add-staff-startTime-error" message={errors.startTime} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-endTime">
          <span>Bitiş Saati <span className="text-red-500">*</span></span>
          <input className={formInputClass} type="time" {...inputProps('endTime')} />
          <FieldError id="add-staff-endTime-error" message={errors.endTime} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-emergencyName">
          Acil Durum Kişisi
          <input className={formInputClass} {...inputProps('emergencyName')} />
        </label>
        <label className={formLabelClass} htmlFor="add-staff-emergencyPhone">
          Acil Durum Telefonu
          <input className={formInputClass} type="tel" {...inputProps('emergencyPhone')} />
        </label>
        <label className={`${formLabelClass} ${fullFieldClass}`} htmlFor="add-staff-roleNote">
          Yetkinlik / Sorumluluk
          <input className={formInputClass} placeholder="Örn. Hasta kabul, arşiv, randevu koordinasyonu" {...inputProps('roleNote')} />
        </label>
        <label className={`${formLabelClass} ${fullFieldClass}`} htmlFor="add-staff-address">
          Adres
          <textarea className={textareaClass} {...inputProps('address')} />
        </label>
        <label className={`${formLabelClass} ${fullFieldClass}`} htmlFor="add-staff-note">
          Personel Notu
          <textarea className={textareaClass} {...inputProps('note')} />
        </label>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 max-[640px]:justify-start">
        <Link className={outlineButtonClass} to="/personeller">
          <X size={17} />
          İptal
        </Link>
        <button className={primaryButtonClass} type="submit">
          <Save size={17} />
          Kaydet
        </button>
      </div>
    </form>
  )
}
