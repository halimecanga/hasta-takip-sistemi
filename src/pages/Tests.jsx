import { useEffect, useState } from 'react'
import { Eye, Plus, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { patientsApi, testsApi } from '../services/api'
import { formInputClass, paddedCardClass, primaryButtonClass, textButtonClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış hasta', 'Yanlış tetkik', 'Numune sorunu', 'Çift kayıt', 'Teknik hata', 'Diğer']

export default function Tests() {
  const [items, setItems] = useState([])
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [notification, setNotification] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({ patientNo: '', type: 'Tam Kan Sayımı', category: 'Laboratuvar', testDate: '', requestReason: '' })

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setItems(await testsApi.list({ search, status }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, status])

  useEffect(() => {
    patientsApi.options().then(setPatients).catch(() => {})
  }, [])

  const closeModal = () => {
    setPendingAction(null)
    setReason('')
    setNote('')
  }

  const updateTestStatus = async () => {
    try {
      await testsApi.update(pendingAction.item.id, { status: 'İptal Edildi', reason, note })
      setNotification({ message: pendingAction.message, tone: 'warning' })
      closeModal()
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    }
  }

  const createTest = async (event) => {
    event.preventDefault()
    try {
      setIsSaving(true)
      await testsApi.create(form)
      setNotification({ message: 'Tetkik kaydı oluşturuldu.', tone: 'success' })
      setCreateOpen(false)
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const isReasonInvalid = Boolean(pendingAction) && (!reason || (reason === 'Diğer' && !note.trim()))

  const columns = [
    { key: 'patient', label: 'Hasta Adı' },
    { key: 'type', label: 'Tetkik Türü' },
    { key: 'date', label: 'Tarih' },
    { key: 'status', label: 'Sonuç Durumu', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'action',
      label: 'İşlem',
      render: (row) => {
        const viewItem = { label: 'Sonucu Görüntüle', icon: <Eye size={15} />, tone: 'neutral', to: `/tetkikler/${row.id}` }
        const itemsForStatus = {
          Bekliyor: [viewItem, { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ item: row, message: 'Tetkik iptal edildi.' }) }],
          İnceleniyor: [viewItem, { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ item: row, message: 'Tetkik iptal edildi.' }) }],
          Hazır: [viewItem, { label: 'Geçersiz İşaretle', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ item: row, message: 'Tetkik geçersiz işaretlendi.' }) }],
          'İptal Edildi': [viewItem],
        }

        return (
          <div className="flex items-center gap-1">
            <Link className={textButtonClass} to={`/tetkikler/${row.id}`}><Eye size={15} />Sonuç</Link>
            <RowActionsMenu label={`${row.patient} tetkik işlemleri`} items={itemsForStatus[row.status] || [viewItem]} />
          </div>
        )
      },
    },
  ]

  return (
    <>
      <PageTitle title="Tetkikler" subtitle="Laboratuvar ve görüntüleme sonuçlarını izleyin." action={<button className={primaryButtonClass} type="button" onClick={() => setCreateOpen((current) => !current)}><Plus size={18} />Yeni Tetkik</button>} />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      {createOpen && (
        <form className={`${paddedCardClass} mb-5 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1`} onSubmit={createTest}>
          <select className={formInputClass} required value={form.patientNo} onChange={(event) => setForm((current) => ({ ...current, patientNo: event.target.value }))}>
            <option value="">Hasta seçin</option>
            {patients.map((patient) => <option key={patient.no} value={patient.no}>{patient.name} — {patient.no}</option>)}
          </select>
          <input className={formInputClass} placeholder="Tetkik türü" required value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} />
          <select className={formInputClass} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
            {['Laboratuvar', 'Görüntüleme', 'Kardiyoloji'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <input className={formInputClass} required type="date" value={form.testDate} onChange={(event) => setForm((current) => ({ ...current, testDate: event.target.value }))} />
          <input className={`${formInputClass} col-span-full`} placeholder="İstek nedeni" value={form.requestReason} onChange={(event) => setForm((current) => ({ ...current, requestReason: event.target.value }))} />
          <button className={primaryButtonClass} disabled={isSaving} type="submit">{isSaving ? 'Kaydediliyor...' : 'Tetkiki Kaydet'}</button>
        </form>
      )}
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_180px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="Hasta veya tetkik türü ara" className={formInputClass} placeholder="Hasta veya tetkik türü ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Tetkik durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Bekliyor', 'İnceleniyor', 'Hazır', 'İptal Edildi'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        {isLoading ? <p className="py-8 text-center text-sm text-gray-500">Tetkikler yükleniyor...</p> : error ? <p className="py-8 text-center text-sm text-red-600">{error}</p> : <DataTable columns={columns} data={items} />}
      </div>
      <ConfirmActionModal
        confirmLabel="Onayla"
        description="Sonuç parametreleri, bulgular ve belgeler korunacak; yalnızca durum ve neden güncellenecektir."
        isConfirmDisabled={isReasonInvalid}
        isOpen={Boolean(pendingAction)}
        title="Tetkik durumu güncellensin mi?"
        variant="warning"
        onCancel={closeModal}
        onConfirm={updateTestStatus}
      >
        <div className="grid gap-3">
          <label className="text-xs font-semibold text-gray-600">Neden
            <select className={`${formInputClass} mt-1.5`} value={reason} onChange={(event) => setReason(event.target.value)}>
              <option value="">Neden seçin</option>
              {cancelReasons.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">Açıklama
            <textarea className={`${formInputClass} mt-1.5 min-h-20 resize-y`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="İsteğe bağlı açıklama" />
          </label>
        </div>
      </ConfirmActionModal>
    </>
  )
}
