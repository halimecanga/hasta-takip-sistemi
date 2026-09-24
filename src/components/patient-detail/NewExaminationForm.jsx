import { FilePlus, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api, patientsApi, pricesApi } from '../../services/api'
import { formGridClass, formInputClass, formLabelClass, outlineButtonClass, paddedCardClass, primaryButtonClass, textareaClass } from '../../styles/uiClasses'

const doctorName = 'Dr. Cumhur Kesemenli'
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']

const toNumber = (value) => Math.max(0, Number(value || 0))
const formatCurrency = (value) => `₺${Math.max(0, value).toLocaleString('tr-TR')}`
const getTodayIso = () => {
  const today = new Date()
  const timezoneOffset = today.getTimezoneOffset() * 60 * 1000

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .split('T')[0]
}

const today = getTodayIso()

const FieldError = ({ id, message }) => message ? <span className="mt-1 text-[10px] font-semibold text-red-600" id={id}>{message}</span> : null

const InputField = ({ id, label, error, required, as = 'input', children, ...props }) => {
  const Component = as
  return (
    <label className={formLabelClass} htmlFor={id}>
      <span>{label}{required && <span className="text-red-500"> *</span>}</span>
      {children || <Component aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)} className={as === 'textarea' ? textareaClass : formInputClass} id={id} {...props} />}
      <FieldError id={`${id}-error`} message={error} />
    </label>
  )
}

const Section = ({ title, children }) => (
  <section className={`${paddedCardClass} min-w-0`}>
    <h3 className="mb-4 text-sm font-bold text-gray-900">{title}</h3>
    {children}
  </section>
)

const emptyMedicine = { name: '', dose: '', frequency: '', duration: '', note: '' }
const emptyNote = { title: '', content: '', date: today, time: '10:30' }

const initialForm = (patient, appointment) => ({
  date: appointment?.dateIso || today,
  time: appointment?.time || '10:30',
  type: appointment?.department || 'Genel Muayene',
  appointmentDate: appointment?.date || '05 Haziran 2026',
  appointmentTime: appointment?.time || '10:30',
  appointmentReason: appointment?.department || 'Genel Muayene',
  arrivalStatus: 'Hasta Geldi',
  complaint: appointment?.department ? `${appointment.department} için başvuru` : '',
  complaintStartDate: '',
  medicalHistory: '',
  pastDiseases: patient.chronicDisease || '',
  medicinesUsed: patient.regularMedicine || '',
  knownAllergies: patient.allergy || '',
  bloodPressure: '',
  pulse: '',
  fever: '',
  height: '',
  weight: '',
  oxygen: '',
  findings: '',
  preliminaryDiagnosis: '',
  diagnosis: '',
  procedure: '',
  treatmentPlan: '',
  doctorNote: '',
  needsControl: false,
  controlDate: '',
  notes: [{ ...emptyNote }],
  createPrescription: false,
  medicines: [{ ...emptyMedicine }],
  service: appointment?.department || 'Genel Muayene',
  total: '1250',
  discount: '0',
  paid: '0',
  paymentMethod: 'Henüz Ödenmedi',
  receiptNo: '',
  paymentNote: '',
  cardLastFour: '',
})

function createVisitFromForm(form, status, documents) {
  const payable = Math.max(0, toNumber(form.total) - toNumber(form.discount))
  const paid = Math.min(toNumber(form.paid), payable)
  const remaining = Math.max(0, payable - paid)
  const paymentStatus = payable === 0 || remaining === 0 ? 'Ödendi' : paid > 0 ? 'Kısmi Ödeme' : 'Ödeme Bekliyor'
  const id = `DOS-2026-${String(Date.now()).slice(-3)}`
  const displayDate = form.date ? new Date(form.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) : '05 Haziran 2026'

  return {
    id,
    date: displayDate,
    time: form.time,
    type: form.type,
    status,
    complaint: form.complaint,
    doctor: doctorName,
    updatedAt: displayDate,
    overview: {
      complaint: form.complaint,
      complaintStartDate: form.complaintStartDate,
      medicalHistory: form.medicalHistory,
      findings: form.findings,
      vitals: {
        bloodPressure: form.bloodPressure,
        pulse: form.pulse,
        fever: form.fever,
        height: form.height,
        weight: form.weight,
        oxygen: form.oxygen,
      },
      preliminaryDiagnosis: form.preliminaryDiagnosis,
      diagnosis: form.diagnosis || form.preliminaryDiagnosis,
      procedure: form.procedure,
      treatmentPlan: form.treatmentPlan,
      controlDate: form.needsControl ? form.controlDate : 'Gerekli değil',
      doctorNote: form.doctorNote,
    },
    treatmentNotes: form.notes
      .filter((note) => note.title || note.content)
      .map((note, index) => ({ id: `${id}-NOT-${index + 1}`, date: displayDate, time: note.time, title: note.title || 'Tedavi Notu', content: note.content, author: doctorName, updatedAt: displayDate })),
    prescription: form.createPrescription
      ? {
          no: `REC-${id.slice(-3)}`,
          date: displayDate,
          status: status === 'Taslak' ? 'Taslak' : 'Aktif',
          doctor: doctorName,
          medicines: form.medicines.filter((medicine) => medicine.name).map((medicine) => ({ ...medicine })),
        }
      : null,
    payment: {
      service: form.service,
      total: formatCurrency(toNumber(form.total)),
      discount: formatCurrency(toNumber(form.discount)),
      paid: formatCurrency(paid),
      remaining: formatCurrency(remaining),
      status: paymentStatus,
      method: form.paymentMethod,
      maskedCard: ['Kredi Kartı', 'Banka Kartı'].includes(form.paymentMethod) && form.cardLastFour ? `**** **** **** ${form.cardLastFour.slice(-4)}` : '',
      transactionDate: displayDate,
      receiptNo: form.receiptNo || '-',
      movements: paid > 0 ? [{ date: displayDate, amount: formatCurrency(paid), method: form.paymentMethod, status: 'Başarılı', receiptNo: form.receiptNo || '-' }] : [],
    },
    documents: documents.map((file, index) => ({ id: `${id}-DOC-${index + 1}`, name: file.name, type: file.kind, size: file.size, uploadedAt: displayDate })),
  }
}

export default function NewExaminationForm({ patient, appointment, onCancel, onSave }) {
  const [form, setForm] = useState(() => initialForm(patient, appointment))
  const [errors, setErrors] = useState({})
  const [documents, setDocuments] = useState([])
  const [fileError, setFileError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [services, setServices] = useState(['Genel Muayene', 'Kontrol Muayenesi', 'Dahiliye Muayenesi'])

  useEffect(() => {
    pricesApi.list({ status: 'Aktif' }).then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        setServices(items.map((item) => item.name))
      }
    }).catch(() => {})
  }, [])

  const payable = useMemo(() => Math.max(0, toNumber(form.total) - toNumber(form.discount)), [form.discount, form.total])
  const paid = useMemo(() => Math.min(toNumber(form.paid), payable), [form.paid, payable])
  const remaining = Math.max(0, payable - paid)
  const paymentStatus = payable === 0 || remaining === 0 ? 'Ödendi' : paid > 0 ? 'Kısmi Ödeme' : 'Ödeme Bekliyor'

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updateArray = (key, index, field, value) => setForm((current) => ({
    ...current,
    [key]: current[key].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  }))

  const validate = () => {
    const nextErrors = {}
    if (!form.date) nextErrors.date = 'Muayene tarihi zorunludur.'
    if (!form.type) nextErrors.type = 'Muayene türü zorunludur.'
    if (!form.complaint.trim()) nextErrors.complaint = 'Başvuru şikâyeti zorunludur.'
    if (!form.findings.trim()) nextErrors.findings = 'Muayene bulguları zorunludur.'
    if (!form.preliminaryDiagnosis.trim() && !form.diagnosis.trim()) nextErrors.preliminaryDiagnosis = 'Ön tanı veya kesin tanı alanlarından en az biri doldurulmalıdır.'
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) document.getElementById(firstError)?.focus()
    return Object.keys(nextErrors).length === 0
  }

  const submit = async (status) => {
    if (!validate()) return
  
    try {
      setIsSaving(true)
      setSaveError('')
  
      const data = await patientsApi.createExamination(patient.id, {
        ...form,
        status,
        appointmentId: appointment?.databaseId || null,
      })

      if (documents.length > 0) {
        await api.upload('examination', data.examination.id, documents.map((document) => document.file).filter(Boolean))
      }
  
      const localVisit = createVisitFromForm(
        form,
        status,
        documents
      )
  
      const displayDate = new Date(
        `${data.examination.date}T00:00:00`
      ).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
  
      const savedVisit = {
        ...localVisit,
        ...data.examination,
        date: displayDate,
        updatedAt: displayDate,
        payment: data.examination.payment || localVisit.payment,
      }
  
      onSave(savedVisit)
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || [])
    const validFiles = []
    const invalid = files.find((file) => !allowedTypes.includes(file.type))
    if (invalid) setFileError('Yalnızca PDF, JPG ve PNG dosyaları seçilebilir.')
    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) return
      validFiles.push({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        kind: file.type === 'application/pdf' ? 'PDF' : file.type === 'image/png' ? 'PNG' : 'JPG',
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        file,
      })
    })
    if (!invalid) setFileError('')
    setDocuments((current) => [...current, ...validFiles])
    event.target.value = ''
  }

  const removeDocument = (id) => {
    setDocuments((current) => current.filter((document) => document.id !== id))
  }

  return (
    <div className="space-y-5">
      <section className={paddedCardClass}>
        <h2 className="text-lg font-bold text-gray-900">Yeni Muayene Kaydı</h2>
        <p className="mt-1 text-xs text-gray-500">{patient.name} - {patient.id}</p>
        <div className="mt-4 grid grid-cols-4 gap-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1">
          <div className="rounded-[10px] bg-orange-50 p-3 text-xs text-orange-700">Randevu: {form.appointmentDate} - {form.appointmentTime}</div>
          <div className="rounded-[10px] bg-gray-50 p-3 text-xs text-gray-700">Neden: {form.appointmentReason}</div>
          <div className="rounded-[10px] bg-green-50 p-3 text-xs text-green-700">Durum: {form.arrivalStatus}</div>
          <div className="rounded-[10px] bg-gray-50 p-3 text-xs text-gray-700">Doktor: {doctorName}</div>
        </div>
      </section>
      {saveError && (
  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
    {saveError}
  </div>
)}

      <Section title="Randevu ve Muayene Bilgileri">
        <div className={formGridClass}>
          <InputField id="date" label="Muayene Tarihi" required error={errors.date} type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
          <InputField id="time" label="Muayene Saati" type="time" value={form.time} onChange={(event) => update('time', event.target.value)} />
          <InputField id="type" label="Muayene Türü" required error={errors.type}>
            <select aria-describedby={errors.type ? 'type-error' : undefined} aria-invalid={Boolean(errors.type)} className={formInputClass} id="type" value={form.type} onChange={(event) => update('type', event.target.value)}>
              {['İlk Muayene', 'Kontrol Muayenesi', 'Genel Muayene', 'Acil Muayene', 'Konsültasyon', 'Dahiliye Muayenesi', 'Tetkik Değerlendirme'].map((option) => <option key={option}>{option}</option>)}
            </select>
          </InputField>
          <InputField id="complaintStartDate" label="Şikâyetin Başlama Tarihi" value={form.complaintStartDate} onChange={(event) => update('complaintStartDate', event.target.value)} />
          <InputField as="textarea" id="complaint" label="Başvuru Şikâyeti" required error={errors.complaint} value={form.complaint} onChange={(event) => update('complaint', event.target.value)} />
          <InputField as="textarea" id="medicalHistory" label="Hastalık Öyküsü" value={form.medicalHistory} onChange={(event) => update('medicalHistory', event.target.value)} />
          <InputField as="textarea" id="pastDiseases" label="Geçmiş Hastalıklar" value={form.pastDiseases} onChange={(event) => update('pastDiseases', event.target.value)} />
          <InputField as="textarea" id="medicinesUsed" label="Kullanılan İlaçlar" value={form.medicinesUsed} onChange={(event) => update('medicinesUsed', event.target.value)} />
          <InputField as="textarea" id="knownAllergies" label="Bilinen Alerjiler" value={form.knownAllergies} onChange={(event) => update('knownAllergies', event.target.value)} />
        </div>
      </Section>

      <Section title="Vital Bulgular">
        <div className="grid grid-cols-6 gap-3 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-2 max-[375px]:grid-cols-1">
          {[
            ['bloodPressure', 'Tansiyon', '120/80'],
            ['pulse', 'Nabız', '78/dk'],
            ['fever', 'Ateş', '36.7'],
            ['height', 'Boy', '168'],
            ['weight', 'Kilo', '68'],
            ['oxygen', 'Oksijen Satürasyonu', '%98'],
          ].map(([key, label, placeholder]) => <InputField key={key} id={key} label={label} placeholder={placeholder} value={form[key]} onChange={(event) => update(key, event.target.value)} />)}
        </div>
      </Section>

      <Section title="Klinik Değerlendirme">
        <div className={formGridClass}>
          <InputField as="textarea" id="findings" label="Muayene Bulguları" required error={errors.findings} value={form.findings} onChange={(event) => update('findings', event.target.value)} />
          <InputField as="textarea" id="preliminaryDiagnosis" label="Ön Tanı" error={errors.preliminaryDiagnosis} value={form.preliminaryDiagnosis} onChange={(event) => update('preliminaryDiagnosis', event.target.value)} />
          <InputField as="textarea" id="diagnosis" label="Kesin Tanı" value={form.diagnosis} onChange={(event) => update('diagnosis', event.target.value)} />
          <InputField as="textarea" id="procedure" label="Uygulanan İşlem" value={form.procedure} onChange={(event) => update('procedure', event.target.value)} />
          <InputField as="textarea" id="treatmentPlan" label="Tedavi Planı" value={form.treatmentPlan} onChange={(event) => update('treatmentPlan', event.target.value)} />
          <InputField as="textarea" id="doctorNote" label="Doktor Notu" value={form.doctorNote} onChange={(event) => update('doctorNote', event.target.value)} />
          <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-600" htmlFor="needsControl"><input checked={form.needsControl} className="h-4 w-4 accent-orange-500" id="needsControl" type="checkbox" onChange={(event) => update('needsControl', event.target.checked)} />Kontrol gerekli mi?</label>
          <InputField id="controlDate" label="Kontrol Tarihi" type="date" disabled={!form.needsControl} value={form.controlDate} onChange={(event) => update('controlDate', event.target.value)} />
        </div>
      </Section>

      <Section title="Tedavi Notları">
        <div className="space-y-3">
          {form.notes.map((note, index) => (
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 rounded-[12px] border border-gray-100 p-3 max-[760px]:grid-cols-1" key={index}>
              <InputField id={`note-title-${index}`} label="Not Başlığı" value={note.title} onChange={(event) => updateArray('notes', index, 'title', event.target.value)} />
              <InputField id={`note-time-${index}`} label="Saat" type="time" value={note.time} onChange={(event) => updateArray('notes', index, 'time', event.target.value)} />
              <button aria-label="Tedavi notunu sil" className={`${outlineButtonClass} self-end max-[760px]:self-auto`} type="button" onClick={() => setForm((current) => ({ ...current, notes: current.notes.filter((_, itemIndex) => itemIndex !== index) || [{ ...emptyNote }] }))}><Trash2 size={16} /></button>
              <div className="col-span-full"><InputField as="textarea" id={`note-content-${index}`} label="Not İçeriği" value={note.content} onChange={(event) => updateArray('notes', index, 'content', event.target.value)} /></div>
            </div>
          ))}
        </div>
        <button className={`${outlineButtonClass} mt-3`} type="button" onClick={() => setForm((current) => ({ ...current, notes: [...current.notes, { ...emptyNote }] }))}><Plus size={16} />Yeni Tedavi Notu Ekle</button>
      </Section>

      <Section title="Reçete">
        <label className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-700" htmlFor="createPrescription"><input checked={form.createPrescription} className="h-4 w-4 accent-orange-500" id="createPrescription" type="checkbox" onChange={(event) => update('createPrescription', event.target.checked)} />Reçete oluşturulsun mu?</label>
        {form.createPrescription && (
          <>
            <div className="space-y-3">
              {form.medicines.map((medicine, index) => (
                <div className="grid grid-cols-[1.2fr_.8fr_1fr_.8fr_auto] gap-3 rounded-[12px] border border-gray-100 p-3 max-[900px]:grid-cols-2 max-[430px]:grid-cols-1" key={index}>
                  <InputField id={`medicine-name-${index}`} label="İlaç Adı" value={medicine.name} onChange={(event) => updateArray('medicines', index, 'name', event.target.value)} />
                  <InputField id={`medicine-dose-${index}`} label="Doz" value={medicine.dose} onChange={(event) => updateArray('medicines', index, 'dose', event.target.value)} />
                  <InputField id={`medicine-frequency-${index}`} label="Kullanım Sıklığı" value={medicine.frequency} onChange={(event) => updateArray('medicines', index, 'frequency', event.target.value)} />
                  <InputField id={`medicine-duration-${index}`} label="Süre" value={medicine.duration} onChange={(event) => updateArray('medicines', index, 'duration', event.target.value)} />
                  <button aria-label="İlaç satırını sil" className={`${outlineButtonClass} self-end max-[430px]:self-auto`} type="button" onClick={() => setForm((current) => ({ ...current, medicines: current.medicines.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={16} /></button>
                  <div className="col-span-full"><InputField id={`medicine-note-${index}`} label="Açıklama" value={medicine.note} onChange={(event) => updateArray('medicines', index, 'note', event.target.value)} /></div>
                </div>
              ))}
            </div>
            <button
  className={outlineButtonClass}
  disabled={isSaving}
  type="button"
  onClick={() => submit('Taslak')}
>
  <Save size={16} />

  {isSaving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
</button>

<button
  className={primaryButtonClass}
  disabled={isSaving}
  type="button"
  onClick={() => submit('Tamamlandı')}
>
  <Save size={16} />

  {isSaving ? 'Kaydediliyor...' : 'Muayeneyi Tamamla'}
</button>
          </>
        )}
      </Section>

      <Section title="Ödeme">
        <div className={formGridClass}>
          <InputField id="service" label="Hizmet / İşlem Adı">
            <select className={formInputClass} id="service" value={form.service} onChange={(event) => update('service', event.target.value)}>
              {services.map((option) => <option key={option}>{option}</option>)}
            </select>
          </InputField>
          <InputField id="total" label="Toplam Tutar" type="number" min="0" value={form.total} onChange={(event) => update('total', event.target.value)} />
          <InputField id="discount" label="İndirim" type="number" min="0" value={form.discount} onChange={(event) => update('discount', event.target.value)} />
          <InputField id="payable" label="Ödenecek Tutar" disabled value={formatCurrency(payable)} />
          <InputField id="paid" label="Ödenen Tutar" type="number" min="0" value={form.paid} onChange={(event) => update('paid', event.target.value)} />
          <InputField id="remaining" label="Kalan Tutar" disabled value={formatCurrency(remaining)} />
          <InputField id="paymentMethod" label="Ödeme Yöntemi">
            <select className={formInputClass} id="paymentMethod" value={form.paymentMethod} onChange={(event) => update('paymentMethod', event.target.value)}>
              {['Nakit', 'Kredi Kartı', 'Banka Kartı', 'Havale / EFT', 'Henüz Ödenmedi'].map((method) => <option key={method}>{method}</option>)}
            </select>
          </InputField>
          <InputField id="paymentStatus" label="Ödeme Durumu" disabled value={paymentStatus} />
          <InputField id="receiptNo" label="Makbuz No" value={form.receiptNo} onChange={(event) => update('receiptNo', event.target.value)} />
          {['Kredi Kartı', 'Banka Kartı'].includes(form.paymentMethod) && <InputField id="cardLastFour" label="Kart Son Dört Hane" maxLength={4} value={form.cardLastFour} onChange={(event) => update('cardLastFour', event.target.value.replace(/\D/g, '').slice(0, 4))} />}
          <InputField as="textarea" id="paymentNote" label="Ödeme Notu" value={form.paymentNote} onChange={(event) => update('paymentNote', event.target.value)} />
        </div>
      </Section>

      <Section title="Belgeler">
        <div className="rounded-[14px] border border-dashed border-orange-200 bg-orange-50/40 p-5 text-center">
          <FilePlus className="mx-auto mb-2 text-orange-500" size={28} />
          <p className="text-xs font-semibold text-gray-700">PDF, JPG veya PNG dosyalarını seçin.</p>
          <label className={`${outlineButtonClass} mt-3 cursor-pointer`} htmlFor="documents">Dosya Seç<input accept=".pdf,.jpg,.jpeg,.png" className="sr-only" id="documents" multiple type="file" onChange={handleFiles} /></label>
          {fileError && <p className="mt-2 text-[10px] font-semibold text-red-600">{fileError}</p>}
        </div>
        {documents.length > 0 && (
          <div className="mt-3 space-y-2">
            {documents.map((document) => (
              <div className="flex items-center justify-between gap-3 rounded-[10px] bg-gray-50 p-3 text-xs" key={document.id}>
                <span className="min-w-0 truncate">{document.name} - {document.kind} - {document.size}</span>
                <button aria-label={`${document.name} belgesini sil`} className={outlineButtonClass} type="button" onClick={() => removeDocument(document.id)}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className={`${paddedCardClass} sticky bottom-4 z-10 flex justify-end gap-2 max-[640px]:static max-[640px]:flex-col`}>
        <button className={outlineButtonClass} type="button" onClick={onCancel}><X size={16} />İptal</button>
        <button className={outlineButtonClass} type="button" onClick={() => submit('Taslak')}><Save size={16} />Taslak Kaydet</button>
        <button className={primaryButtonClass} type="button" onClick={() => submit('Tamamlandı')}><Save size={16} />Muayeneyi Tamamla</button>
      </div>
    </div>
  )
}
