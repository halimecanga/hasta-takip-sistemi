import { Plus, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { formInputClass, formLabelClass, outlineButtonClass, paddedCardClass, primaryButtonClass, textareaClass } from '../../styles/uiClasses'

const statusOptions = ['Aktif', 'Tamamlandı', 'Süresi Doldu', 'İptal Edildi']

const emptyMedicine = (index = 0) => ({
  id: `MED-${Date.now()}-${index}`,
  name: '',
  activeIngredient: '',
  form: '',
  dose: '',
  frequency: '',
  time: '',
  duration: '',
  quantity: '',
  note: '',
  schedule: ['Sabah'],
  instruction: '',
  storage: '',
  missedDose: '',
})

const FieldError = ({ id, message }) => message ? <span className="mt-1 text-[10px] font-semibold text-red-600" id={id}>{message}</span> : null

export default function PrescriptionEditForm({ prescription, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    status: prescription.status,
    diagnosis: prescription.diagnosis,
    doctorNote: prescription.doctorNote,
    controlDate: prescription.controlDate,
    medicines: prescription.medicines.map((medicine) => ({ ...medicine, schedule: [...medicine.schedule] })),
  }))
  const [errors, setErrors] = useState({})

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const updateMedicine = (index, key, value) => {
    setForm((current) => ({
      ...current,
      medicines: current.medicines.map((medicine, medicineIndex) => medicineIndex === index ? { ...medicine, [key]: value } : medicine),
    }))
    setErrors((current) => ({
      ...current,
      medicines: current.medicines?.map((medicineError, medicineIndex) => medicineIndex === index ? { ...medicineError, [key]: '' } : medicineError),
    }))
  }

  const addMedicine = () => {
    setForm((current) => ({ ...current, medicines: [...current.medicines, emptyMedicine(current.medicines.length + 1)] }))
    setErrors((current) => ({ ...current, medicinesList: '' }))
  }

  const removeMedicine = (index) => {
    setForm((current) => ({ ...current, medicines: current.medicines.filter((_, medicineIndex) => medicineIndex !== index) }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.diagnosis.trim()) nextErrors.diagnosis = 'Tanı zorunludur.'
    if (form.medicines.length === 0) nextErrors.medicinesList = 'En az bir ilaç eklenmelidir.'

    const medicineErrors = form.medicines.map((medicine) => {
      const itemErrors = {}
      if (!medicine.name.trim()) itemErrors.name = 'İlaç adı zorunludur.'
      if (!medicine.dose.trim()) itemErrors.dose = 'Doz zorunludur.'
      if (!medicine.frequency.trim()) itemErrors.frequency = 'Kullanım sıklığı zorunludur.'
      if (!medicine.duration.trim()) itemErrors.duration = 'Kullanım süresi zorunludur.'
      return itemErrors
    })

    if (medicineErrors.some((item) => Object.keys(item).length > 0)) nextErrors.medicines = medicineErrors
    setErrors(nextErrors)

    if (nextErrors.diagnosis) document.getElementById('prescription-diagnosis')?.focus()
    else if (nextErrors.medicinesList) document.getElementById('add-medicine')?.focus()
    else if (nextErrors.medicines) {
      const firstIndex = nextErrors.medicines.findIndex((item) => Object.keys(item).length > 0)
      const firstKey = Object.keys(nextErrors.medicines[firstIndex])[0]
      document.getElementById(`medicine-${firstIndex}-${firstKey}`)?.focus()
    }

    return Object.keys(nextErrors).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSave({
      ...prescription,
      status: form.status,
      diagnosis: form.diagnosis.trim(),
      doctorNote: form.doctorNote.trim(),
      controlDate: form.controlDate.trim(),
      updatedAt: '05 Haziran 2026',
      remainingDays: form.status === 'Süresi Doldu' ? 'Süresi Doldu' : prescription.remainingDays,
      medicines: form.medicines.map((medicine, index) => ({
        ...medicine,
        id: medicine.id || `MED-SAVED-${index + 1}`,
        name: medicine.name.trim(),
        activeIngredient: medicine.activeIngredient.trim() || '-',
        form: medicine.form.trim() || '-',
        dose: medicine.dose.trim(),
        frequency: medicine.frequency.trim(),
        time: medicine.time.trim() || '-',
        duration: medicine.duration.trim(),
        quantity: medicine.quantity.trim() || '-',
        note: medicine.note.trim() || '-',
        schedule: medicine.schedule?.length ? medicine.schedule : ['Sabah'],
        instruction: medicine.instruction.trim() || `${medicine.name.trim()} ${medicine.frequency.trim()} kullanılmalıdır.`,
        storage: medicine.storage.trim() || 'Oda sıcaklığında saklayın.',
        missedDose: medicine.missedDose.trim() || 'Unutulan doz çift dozla telafi edilmemelidir.',
      })),
    })
  }

  const medicineError = (index, key) => errors.medicines?.[index]?.[key]
  const describedBy = (index, key) => medicineError(index, key) ? `medicine-${index}-${key}-error` : undefined

  return (
    <form className={`${paddedCardClass} space-y-5`} onSubmit={submit}>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Reçeteyi Düzenle</h2>
        <p className="mt-1 text-xs text-gray-500">Kaydedilen değişiklikler yalnızca bu sayfanın frontend state’i içinde güncellenir.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        <label className={formLabelClass} htmlFor="prescription-patient-name">Hasta adı<input className={`${formInputClass} bg-gray-50`} id="prescription-patient-name" readOnly value={prescription.patientName} /></label>
        <label className={formLabelClass} htmlFor="prescription-patient-no">Hasta numarası<input className={`${formInputClass} bg-gray-50`} id="prescription-patient-no" readOnly value={prescription.patientNo} /></label>
        <label className={formLabelClass} htmlFor="prescription-number">Reçete numarası<input className={`${formInputClass} bg-gray-50`} id="prescription-number" readOnly value={prescription.number} /></label>
        <label className={formLabelClass} htmlFor="prescription-doctor">Doktor<input className={`${formInputClass} bg-gray-50`} id="prescription-doctor" readOnly value={prescription.doctor} /></label>
      </div>

      <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
        <label className={formLabelClass} htmlFor="prescription-status">
          Reçete durumu
          <select className={formInputClass} id="prescription-status" value={form.status} onChange={(event) => update('status', event.target.value)}>
            {statusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className={formLabelClass} htmlFor="prescription-control-date">
          Kontrol tarihi
          <input className={formInputClass} id="prescription-control-date" value={form.controlDate} onChange={(event) => update('controlDate', event.target.value)} />
        </label>
        <label className="col-span-full flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor="prescription-diagnosis">
          <span>Tanı <span className="text-red-500">*</span></span>
          <textarea aria-describedby={errors.diagnosis ? 'prescription-diagnosis-error' : undefined} aria-invalid={Boolean(errors.diagnosis)} className={textareaClass} id="prescription-diagnosis" value={form.diagnosis} onChange={(event) => update('diagnosis', event.target.value)} />
          <FieldError id="prescription-diagnosis-error" message={errors.diagnosis} />
        </label>
        <label className="col-span-full flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor="prescription-doctor-note">
          Doktor notu
          <textarea className={textareaClass} id="prescription-doctor-note" value={form.doctorNote} onChange={(event) => update('doctorNote', event.target.value)} />
        </label>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">İlaç Listesi</h3>
            <FieldError id="medicines-list-error" message={errors.medicinesList} />
          </div>
          <button className={outlineButtonClass} id="add-medicine" type="button" onClick={addMedicine}><Plus size={16} />İlaç Ekle</button>
        </div>
        {form.medicines.map((medicine, index) => (
          <article className="rounded-[12px] border border-gray-100 p-3" key={medicine.id}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-gray-900">İlaç {index + 1}</h4>
              <button aria-label={`${index + 1}. ilacı sil`} className={`${outlineButtonClass} border-red-100 bg-red-50 text-red-600 hover:bg-red-100`} type="button" onClick={() => removeMedicine(index)}>
                <Trash2 size={15} />
                Sil
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1">
              {[
                ['name', 'İlaç adı', true],
                ['activeIngredient', 'Etken madde'],
                ['form', 'Form'],
                ['dose', 'Doz', true],
                ['frequency', 'Kullanım sıklığı', true],
                ['time', 'Kullanım zamanı'],
                ['duration', 'Kullanım süresi', true],
                ['quantity', 'Miktar'],
              ].map(([key, label, required]) => (
                <label className={formLabelClass} htmlFor={`medicine-${index}-${key}`} key={key}>
                  <span>{label}{required && <span className="text-red-500"> *</span>}</span>
                  <input aria-describedby={describedBy(index, key)} aria-invalid={Boolean(medicineError(index, key))} className={formInputClass} id={`medicine-${index}-${key}`} value={medicine[key]} onChange={(event) => updateMedicine(index, key, event.target.value)} />
                  <FieldError id={`medicine-${index}-${key}-error`} message={medicineError(index, key)} />
                </label>
              ))}
              <label className="col-span-2 flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor={`medicine-${index}-note`}>
                Açıklama
                <textarea className={textareaClass} id={`medicine-${index}-note`} value={medicine.note} onChange={(event) => updateMedicine(index, 'note', event.target.value)} />
              </label>
              <label className="col-span-2 flex flex-col gap-[7px] text-[11px] font-semibold text-gray-600 max-[640px]:col-auto" htmlFor={`medicine-${index}-instruction`}>
                Kullanım talimatı
                <textarea className={textareaClass} id={`medicine-${index}-instruction`} value={medicine.instruction} onChange={(event) => updateMedicine(index, 'instruction', event.target.value)} />
              </label>
            </div>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 max-[640px]:justify-start">
        <button className={outlineButtonClass} type="button" onClick={onCancel}><X size={17} />İptal</button>
        <button className={primaryButtonClass} type="submit"><Save size={17} />Kaydet</button>
      </div>
    </form>
  )
}
