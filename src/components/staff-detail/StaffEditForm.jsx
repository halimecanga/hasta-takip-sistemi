import { Save, X } from 'lucide-react'
import { useState } from 'react'
import { formGridClass, formInputClass, formLabelClass, outlineButtonClass, paddedCardClass, primaryButtonClass, textareaClass } from '../../styles/uiClasses'

const FieldError = ({ id, message }) => message ? <span className="mt-1 text-[10px] font-semibold text-red-600" id={id}>{message}</span> : null

const statusOptions = ['Aktif', 'İzinli', 'Pasif', 'Raporlu']
const workTypeOptions = ['Tam Zamanlı', 'Yarı Zamanlı', 'Vardiyalı', 'Sözleşmeli']

const initialForm = (staff) => ({
  name: staff.name,
  id: staff.id,
  phone: staff.phone,
  email: staff.email,
  address: staff.address,
  department: staff.department,
  status: staff.status,
  workType: staff.workType,
  workDays: staff.workDays,
  startTime: staff.workHours.start,
  endTime: staff.workHours.end,
  emergencyName: staff.emergencyContact.name,
  emergencyPhone: staff.emergencyContact.phone,
  note: staff.note,
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StaffEditForm({ staff, onCancel, onSave }) {
  const [form, setForm] = useState(() => initialForm(staff))
  const [errors, setErrors] = useState({})

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.phone.trim()) nextErrors.phone = 'Telefon boş bırakılamaz.'
    if (!form.email.trim()) nextErrors.email = 'E-posta boş bırakılamaz.'
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Geçerli bir e-posta adresi girin.'
    if (!form.department.trim()) nextErrors.department = 'Departman boş bırakılamaz.'
    if (!form.status) nextErrors.status = 'Çalışma durumu seçilmelidir.'

    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) document.getElementById(`staff-${firstError}`)?.focus()
    return Object.keys(nextErrors).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return

    onSave({
      ...staff,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      department: form.department.trim(),
      status: form.status,
      workType: form.workType,
      workDays: form.workDays.trim(),
      workHours: { start: form.startTime, end: form.endTime },
      emergencyContact: {
        name: form.emergencyName.trim(),
        phone: form.emergencyPhone.trim(),
      },
      note: form.note.trim(),
    })
  }

  const inputProps = (key) => ({
    'aria-describedby': errors[key] ? `staff-${key}-error` : undefined,
    'aria-invalid': Boolean(errors[key]),
    id: `staff-${key}`,
    value: form[key],
    onChange: (event) => update(key, event.target.value),
  })

  return (
    <form className={`${paddedCardClass} space-y-5`} onSubmit={submit}>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Personel Bilgilerini Düzenle</h2>
        <p className="mt-1 text-xs text-gray-500">Kaydettiğiniz bilgiler bu sayfanın frontend state’i içinde güncellenir.</p>
      </div>
      <div className={formGridClass}>
        <label className={formLabelClass} htmlFor="staff-name">
          Ad Soyad
          <input className={`${formInputClass} bg-gray-50`} id="staff-name" readOnly value={form.name} />
        </label>
        <label className={formLabelClass} htmlFor="staff-id">
          Personel No
          <input className={`${formInputClass} bg-gray-50`} id="staff-id" readOnly value={form.id} />
        </label>
        <label className={formLabelClass} htmlFor="staff-phone">
          <span>Telefon <span className="text-red-500">*</span></span>
          <input className={formInputClass} type="tel" {...inputProps('phone')} />
          <FieldError id="staff-phone-error" message={errors.phone} />
        </label>
        <label className={formLabelClass} htmlFor="staff-email">
          <span>E-posta <span className="text-red-500">*</span></span>
          <input className={formInputClass} type="email" {...inputProps('email')} />
          <FieldError id="staff-email-error" message={errors.email} />
        </label>
        <label className={formLabelClass} htmlFor="staff-department">
          <span>Departman <span className="text-red-500">*</span></span>
          <input className={formInputClass} {...inputProps('department')} />
          <FieldError id="staff-department-error" message={errors.department} />
        </label>
        <label className={formLabelClass} htmlFor="staff-status">
          <span>Çalışma Durumu <span className="text-red-500">*</span></span>
          <select className={formInputClass} {...inputProps('status')}>
            <option value="">Durum seçin</option>
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <FieldError id="staff-status-error" message={errors.status} />
        </label>
        <label className={formLabelClass} htmlFor="staff-workType">
          Çalışma Şekli
          <select className={formInputClass} {...inputProps('workType')}>
            {workTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className={formLabelClass} htmlFor="staff-workDays">
          Çalışma Günleri
          <input className={formInputClass} {...inputProps('workDays')} />
        </label>
        <label className={formLabelClass} htmlFor="staff-startTime">
          Başlangıç Saati
          <input className={formInputClass} type="time" {...inputProps('startTime')} />
        </label>
        <label className={formLabelClass} htmlFor="staff-endTime">
          Bitiş Saati
          <input className={formInputClass} type="time" {...inputProps('endTime')} />
        </label>
        <label className={formLabelClass} htmlFor="staff-emergencyName">
          Acil Durum Kişisi
          <input className={formInputClass} {...inputProps('emergencyName')} />
        </label>
        <label className={formLabelClass} htmlFor="staff-emergencyPhone">
          Acil Durum Telefonu
          <input className={formInputClass} type="tel" {...inputProps('emergencyPhone')} />
        </label>
        <label className="col-span-full flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor="staff-address">
          Adres
          <textarea className={textareaClass} {...inputProps('address')} />
        </label>
        <label className="col-span-full flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor="staff-note">
          Personel Notu
          <textarea className={textareaClass} {...inputProps('note')} />
        </label>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 max-[640px]:justify-start">
        <button className={outlineButtonClass} type="button" onClick={onCancel}>
          <X size={17} />
          İptal
        </button>
        <button className={primaryButtonClass} type="submit">
          <Save size={17} />
          Kaydet
        </button>
      </div>
    </form>
  )
}
