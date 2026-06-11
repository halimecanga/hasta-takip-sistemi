import { ArrowLeft, CalendarPlus, Save, UserPlus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import { DOCTOR_NAME, nextAppointmentId, useAppointments } from '../context/AppointmentContext'
import { patientDetails } from '../data/patientDetailsMock'
import { patients } from '../data/mockData'
import {
  formGridClass,
  formInputClass,
  formLabelClass,
  fullFieldClass,
  outlineButtonClass,
  paddedCardClass,
  primaryButtonClass,
  textareaClass,
} from '../styles/uiClasses'

const appointmentTypes = ['İlk Muayene', 'Genel Muayene', 'Kontrol Muayenesi', 'Tetkik Değerlendirme', 'Acil Muayene', 'Konsültasyon']
const statusOptions = ['Bekliyor', 'Onaylandı']
const durationOptions = [15, 30, 45, 60]
const priorityOptions = ['Normal', 'Öncelikli', 'Acil']
const reminderMethods = ['SMS', 'E-posta', 'Telefon Araması', 'Hatırlatma Yok']
const reminderTimes = ['1 saat önce', '3 saat önce', '1 gün önce', '2 gün önce']
const shortMonths = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

const FieldError = ({ id, message }) => message ? <span className="mt-1 text-[10px] font-semibold text-red-600" id={id}>{message}</span> : null

const Section = ({ title, description, children }) => (
  <section className={`${paddedCardClass} space-y-4`}>
    <div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
    {children}
  </section>
)

const toLocalIsoDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDate = (dateIso) => {
  const [year, month, day] = dateIso.split('-').map(Number)
  return `${String(day).padStart(2, '0')} ${shortMonths[month - 1]} ${year}`
}

const timeToMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

const getDay = (dateIso) => {
  const [year, month, day] = dateIso.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

const overlaps = (start, end, existingStart, existingEnd) => start < existingEnd && end > existingStart

const buildInitialForm = (appointmentId) => ({
  id: appointmentId,
  patientNo: '',
  patient: '',
  phone: '',
  email: '',
  dateIso: '',
  time: '',
  type: 'Genel Muayene',
  status: 'Bekliyor',
  duration: '30',
  priority: 'Normal',
  reason: '',
  complaint: '',
  isControl: false,
  previousVisitId: '',
  doctorNote: '',
  reminderMethod: 'SMS',
  reminderTime: '1 gün önce',
  note: '',
})

export default function AddAppointment() {
  const navigate = useNavigate()
  const { addAppointment, appointmentItems } = useAppointments()
  const appointmentId = useMemo(() => nextAppointmentId(appointmentItems), [appointmentItems])
  const initialForm = useMemo(() => buildInitialForm(appointmentId), [appointmentId])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)

  const patientOptions = useMemo(() => patients.map((patient) => {
    const detail = patientDetails.find((item) => item.id === patient.no)
    return {
      ...patient,
      email: detail?.email || '',
      visits: detail?.visits || [],
    }
  }), [])

  const selectedPatient = patientOptions.find((patient) => patient.no === form.patientNo)
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm)
  const todayIso = toLocalIsoDate()

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const selectPatient = (patientNo) => {
    const patient = patientOptions.find((item) => item.no === patientNo)
    setForm((current) => ({
      ...current,
      patientNo,
      patient: patient?.name || '',
      phone: patient?.phone || '',
      email: patient?.email || '',
      previousVisitId: '',
    }))
    setErrors((current) => ({ ...current, patientNo: '', phone: '', email: '' }))
  }

  const showPatientNotice = () => {
    setNotification({ message: 'Yeni hasta ekleme ekranı henüz hazırlanmadı.', tone: 'warning' })
  }

  const inputProps = (key) => ({
    'aria-describedby': errors[key] ? `appointment-${key}-error` : undefined,
    'aria-invalid': Boolean(errors[key]),
    id: `appointment-${key}`,
    value: form[key],
    onChange: (event) => update(key, event.target.value),
  })

  const validateSchedule = (nextErrors) => {
    if (!form.dateIso || !form.time || !form.duration) return

    const duration = Number(form.duration)
    const start = timeToMinutes(form.time)
    const end = start + duration
    const day = getDay(form.dateIso)
    const isSaturday = day === 6

    if (form.dateIso < todayIso) {
      nextErrors.dateIso = 'Geçmiş bir tarihe randevu oluşturamazsınız.'
      return
    }

    if (day === 0) {
      nextErrors.dateIso = 'Pazar günü klinik kapalıdır.'
      return
    }

    const clinicStart = 9 * 60
    const clinicEnd = isSaturday ? 14 * 60 : 18 * 60
    if (start < clinicStart || end > clinicEnd) {
      nextErrors.time = 'Klinik çalışma saatleri dışında randevu oluşturamazsınız.'
      return
    }

    if (overlaps(start, end, 12 * 60 + 30, 13 * 60 + 30)) {
      nextErrors.time = 'Mola saatleri içinde randevu oluşturamazsınız.'
    }
  }

  const validateConflicts = (nextErrors) => {
    if (!form.dateIso || !form.time || !form.duration || nextErrors.time || nextErrors.dateIso) return

    const start = timeToMinutes(form.time)
    const end = start + Number(form.duration)
    const hasConflict = appointmentItems.some((appointment) => {
      if (appointment.status === 'İptal Edildi') return false
      if (appointment.dateIso !== form.dateIso) return false

      const existingStart = timeToMinutes(appointment.time)
      const existingEnd = existingStart + Number(appointment.duration || 30)
      const samePatientSameTime = appointment.patientNo === form.patientNo && appointment.time === form.time

      return samePatientSameTime || overlaps(start, end, existingStart, existingEnd)
    })

    if (hasConflict) nextErrors.time = 'Bu saat aralığında başka bir randevu bulunmaktadır.'
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.patientNo) nextErrors.patientNo = 'Hasta seçmelisiniz.'
    if (!form.dateIso) nextErrors.dateIso = 'Randevu tarihi zorunludur.'
    if (!form.time) nextErrors.time = 'Randevu saati zorunludur.'
    if (!form.type) nextErrors.type = 'Muayene türü zorunludur.'
    if (!form.status) nextErrors.status = 'Randevu durumu zorunludur.'
    if (!form.duration) nextErrors.duration = 'Süre zorunludur.'
    if (!form.reason.trim()) nextErrors.reason = 'Randevu nedeni zorunludur.'

    validateSchedule(nextErrors)
    validateConflicts(nextErrors)

    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) document.getElementById(`appointment-${firstError}`)?.focus()
    return Object.keys(nextErrors).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return

    addAppointment({
      id: form.id,
      patientNo: form.patientNo,
      patient: form.patient,
      date: formatDisplayDate(form.dateIso),
      dateIso: form.dateIso,
      time: form.time,
      type: form.type,
      department: form.type,
      status: form.status,
      duration: Number(form.duration),
      priority: form.priority,
      reason: form.reason.trim(),
      complaint: form.complaint.trim(),
      phone: form.phone,
      email: form.email,
      doctor: DOCTOR_NAME,
      reminderMethod: form.reminderMethod,
      reminderTime: form.reminderTime,
      note: [form.note.trim(), form.doctorNote.trim()].filter(Boolean).join('\n'),
      previousVisitId: form.previousVisitId,
      isControl: form.isControl,
    })

    navigate('/randevular', { state: { notification: 'Randevu başarıyla oluşturuldu.' } })
  }

  const leavePage = () => navigate('/randevular')

  const requestLeave = () => {
    if (!isDirty) {
      leavePage()
      return
    }

    setLeaveConfirmOpen(true)
  }

  return (
    <>
      <PageTitle
        title="Yeni Randevu Oluştur"
        subtitle="Hasta için uygun tarih ve saatte yeni randevu planlayın."
        action={(
          <button className={outlineButtonClass} type="button" onClick={requestLeave}>
            <ArrowLeft size={17} />
            Randevulara Dön
          </button>
        )}
      />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className="mb-5 flex flex-wrap justify-end gap-2 max-[640px]:justify-start">
        <button className={outlineButtonClass} type="button" onClick={requestLeave}>
          <X size={17} />
          İptal
        </button>
        <button className={primaryButtonClass} form="add-appointment-form" type="submit">
          <Save size={17} />
          Randevuyu Kaydet
        </button>
      </div>
      <form className="space-y-5" id="add-appointment-form" onSubmit={submit}>
        <Section title="Hasta Bilgileri" description="Randevu için kayıtlı hastayı seçin.">
          <div className={formGridClass}>
            <label className={formLabelClass} htmlFor="appointment-patientNo">
              <span>Hasta <span className="text-red-500">*</span></span>
              <select
                aria-describedby={errors.patientNo ? 'appointment-patientNo-error' : undefined}
                aria-invalid={Boolean(errors.patientNo)}
                className={formInputClass}
                id="appointment-patientNo"
                value={form.patientNo}
                onChange={(event) => selectPatient(event.target.value)}
              >
                <option value="">Hasta seçin</option>
                {patientOptions.map((patient) => (
                  <option key={patient.no} value={patient.no}>{patient.name} — {patient.no} — {patient.phone}</option>
                ))}
              </select>
              <FieldError id="appointment-patientNo-error" message={errors.patientNo} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-doctor">
              Doktor
              <input className={`${formInputClass} bg-gray-50`} id="appointment-doctor" readOnly value={DOCTOR_NAME} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-phone">
              Telefon
              <input className={`${formInputClass} bg-gray-50`} id="appointment-phone" readOnly value={form.phone} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-email">
              E-posta
              <input className={`${formInputClass} bg-gray-50`} id="appointment-email" readOnly value={form.email} />
            </label>
          </div>
          <button className={outlineButtonClass} type="button" onClick={showPatientNotice}>
            <UserPlus size={16} />
            Yeni Hasta Ekle
          </button>
        </Section>

        <Section title="Randevu Bilgileri" description="Tarih, saat, süre ve öncelik bilgilerini belirleyin.">
          <div className={formGridClass}>
            <label className={formLabelClass} htmlFor="appointment-id">
              Randevu ID
              <input className={`${formInputClass} bg-gray-50`} id="appointment-id" readOnly value={form.id} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-dateIso">
              <span>Randevu Tarihi <span className="text-red-500">*</span></span>
              <input className={formInputClass} min={todayIso} type="date" {...inputProps('dateIso')} />
              <FieldError id="appointment-dateIso-error" message={errors.dateIso} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-time">
              <span>Randevu Saati <span className="text-red-500">*</span></span>
              <input className={formInputClass} step="900" type="time" {...inputProps('time')} />
              <FieldError id="appointment-time-error" message={errors.time} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-type">
              <span>Muayene Türü <span className="text-red-500">*</span></span>
              <select className={formInputClass} {...inputProps('type')}>
                {appointmentTypes.map((option) => <option key={option}>{option}</option>)}
              </select>
              <FieldError id="appointment-type-error" message={errors.type} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-status">
              <span>Durum <span className="text-red-500">*</span></span>
              <select className={formInputClass} {...inputProps('status')}>
                {statusOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
              <FieldError id="appointment-status-error" message={errors.status} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-duration">
              <span>Süre <span className="text-red-500">*</span></span>
              <select className={formInputClass} {...inputProps('duration')}>
                {durationOptions.map((option) => <option key={option} value={option}>{option} dakika</option>)}
              </select>
              <FieldError id="appointment-duration-error" message={errors.duration} />
            </label>
            <label className={formLabelClass} htmlFor="appointment-priority">
              Öncelik
              <select className={formInputClass} {...inputProps('priority')}>
                {priorityOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
        </Section>

        <Section title="Muayene Bilgileri" description="Randevu nedeni ve klinik ön bilgileri girin.">
          <div className={formGridClass}>
            <label className={`${formLabelClass} ${fullFieldClass}`} htmlFor="appointment-reason">
              <span>Randevu Nedeni <span className="text-red-500">*</span></span>
              <input className={formInputClass} placeholder="Örn. kontrol muayenesi" {...inputProps('reason')} />
              <FieldError id="appointment-reason-error" message={errors.reason} />
            </label>
            <label className={`${formLabelClass} ${fullFieldClass}`} htmlFor="appointment-complaint">
              Başvuru Şikâyeti / Kısa Ön Bilgi
              <textarea className={textareaClass} {...inputProps('complaint')} />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600" htmlFor="appointment-isControl">
              <input
                checked={form.isControl}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-300"
                id="appointment-isControl"
                type="checkbox"
                onChange={(event) => update('isControl', event.target.checked)}
              />
              Kontrol randevusu mu?
            </label>
            <label className={formLabelClass} htmlFor="appointment-previousVisitId">
              İlgili Önceki Dosya
              <select className={formInputClass} disabled={!form.isControl || !selectedPatient} {...inputProps('previousVisitId')}>
                <option value="">{selectedPatient?.visits.length ? 'Dosya seçin' : 'Geçmiş dosya bulunmuyor'}</option>
                {selectedPatient?.visits.map((visit) => (
                  <option key={visit.id} value={visit.id}>{visit.id} — {visit.type}</option>
                ))}
              </select>
            </label>
            <label className={`${formLabelClass} ${fullFieldClass}`} htmlFor="appointment-doctorNote">
              Doktor İçin Not
              <textarea className={textareaClass} {...inputProps('doctorNote')} />
            </label>
          </div>
        </Section>

        <Section title="İletişim ve Hatırlatma" description="Hatırlatma bilgileri yalnızca frontend state içinde tutulur.">
          <div className={formGridClass}>
            <label className={formLabelClass} htmlFor="appointment-reminderMethod">
              Hatırlatma Yöntemi
              <select className={formInputClass} {...inputProps('reminderMethod')}>
                {reminderMethods.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={formLabelClass} htmlFor="appointment-reminderTime">
              Hatırlatma Zamanı
              <select className={formInputClass} disabled={form.reminderMethod === 'Hatırlatma Yok'} {...inputProps('reminderTime')}>
                {reminderTimes.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
        </Section>

        <Section title="Randevu Notu" description="Hazırlık bilgisi, sekreter notu veya hastaya özel açıklama ekleyin.">
          <label className={formLabelClass} htmlFor="appointment-note">
            Hastaya Özel Not
            <textarea className={`${textareaClass} min-h-28`} {...inputProps('note')} />
          </label>
          <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 max-[640px]:justify-start">
            <button className={outlineButtonClass} type="button" onClick={requestLeave}>
              <X size={17} />
              İptal
            </button>
            <button className={primaryButtonClass} type="submit">
              <CalendarPlus size={17} />
              Randevuyu Kaydet
            </button>
          </div>
        </Section>
      </form>

      <ConfirmActionModal
        cancelLabel="Formda Kal"
        confirmLabel="Çık"
        description="Sayfadan ayrılırsanız randevu bilgileri kaybolacaktır."
        isOpen={leaveConfirmOpen}
        title="Kaydedilmemiş değişiklikler var."
        variant="warning"
        onCancel={() => setLeaveConfirmOpen(false)}
        onConfirm={leavePage}
      />
    </>
  )
}
