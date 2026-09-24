import { useEffect, useState } from 'react'
import { Eye, FileEdit, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { prescriptionsApi } from '../services/api'
import { formInputClass, paddedCardClass, textButtonClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış ilaç seçimi', 'Doz değişikliği', 'Hasta intoleransı', 'Çift reçete', 'Diğer']

export default function Prescriptions() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [notification, setNotification] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setItems(await prescriptionsApi.list({ search, status, doctor, date }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, status, doctor, date])

  const closeModal = () => {
    setPendingAction(null)
    setReason('')
    setNote('')
  }

  const deleteDraft = async () => {
    try {
      setBusy(true)
      await prescriptionsApi.remove(pendingAction.item.id)
      setNotification({ message: 'Taslak reçete arşivlendi.', tone: 'success' })
      closeModal()
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const cancelPrescription = async () => {
    try {
      setBusy(true)
      await prescriptionsApi.status(pendingAction.item.id, {
        status: 'İptal',
        reason,
        note,
      })
      setNotification({ message: pendingAction.message, tone: 'warning' })
      closeModal()
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const isReasonInvalid = pendingAction?.requiresReason && (!reason || (reason === 'Diğer' && !note.trim()))

  const columns = [
    { key: 'patient', label: 'Hasta Adı' },
    { key: 'count', label: 'İlaç Sayısı' },
    { key: 'date', label: 'Tarih' },
    { key: 'status', label: 'Reçete Durumu', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'action',
      label: 'İşlem',
      render: (row) => {
        const viewItem = { label: 'Görüntüle', icon: <Eye size={15} />, tone: 'neutral', to: `/receteler/${row.id}` }
        const editItem = { label: 'Düzenle', icon: <FileEdit size={15} />, tone: 'neutral', to: `/receteler/${row.id}?duzenle=true` }
        const itemsForStatus = {
          Taslak: [editItem, { label: 'Arşivle', icon: <Trash2 size={15} />, tone: 'danger', onSelect: () => setPendingAction({ type: 'delete', item: row }) }],
          Aktif: [viewItem, editItem, { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, message: 'Reçete iptal edildi.', requiresReason: true }) }],
          Tamamlandı: [viewItem, { label: 'Geçersiz İşaretle', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, message: 'Reçete geçersiz işaretlendi.', requiresReason: true }) }],
          'Süresi Doldu': [viewItem],
          İptal: [viewItem],
        }

        return (
          <div className="flex items-center gap-1">
            <Link className={textButtonClass} to={`/receteler/${row.id}`}><Eye size={15} />Görüntüle</Link>
            <RowActionsMenu label={`${row.patient} reçete işlemleri`} items={itemsForStatus[row.status] || [viewItem]} />
          </div>
        )
      },
    },
  ]

  return (
    <>
      <PageTitle title="Reçeteler" subtitle="Düzenlenen reçeteleri ve durumlarını takip edin." />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1.4fr)_170px_170px_170px] gap-3 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          <input aria-label="Hasta veya reçete ara" className={formInputClass} placeholder="Hasta veya reçete ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Doktora göre filtrele" className={formInputClass} value={doctor} onChange={(event) => setDoctor(event.target.value)}>
            <option value="">Tüm Doktorlar</option>
            <option>Dr. Cumhur Kesemenli</option>
          </select>
          <select aria-label="Reçete durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Taslak', 'Aktif', 'Pasif', 'Tamamlandı', 'Süresi Doldu', 'İptal'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <input aria-label="Tarihe göre filtrele" className={formInputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        {isLoading ? <p className="py-8 text-center text-sm text-gray-500">Reçeteler yükleniyor...</p> : error ? <p className="py-8 text-center text-sm text-red-600">{error}</p> : <DataTable columns={columns} data={items} />}
      </div>
      <ConfirmActionModal
        confirmLabel={pendingAction?.type === 'delete' ? 'Taslağı Arşivle' : 'Onayla'}
        description={pendingAction?.type === 'delete' ? 'Taslak kalıcı silinmez; durumu İptal olarak arşivlenir.' : 'Reçete durumu İptal olarak güncellenecek.'}
        isConfirmDisabled={Boolean(isReasonInvalid) || busy}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.type === 'delete' ? 'Taslak reçete arşivlensin mi?' : 'Reçete iptal edilsin mi?'}
        variant={pendingAction?.type === 'delete' ? 'danger' : 'warning'}
        onCancel={closeModal}
        onConfirm={pendingAction?.type === 'delete' ? deleteDraft : cancelPrescription}
      >
        {pendingAction?.requiresReason && (
          <div className="grid gap-3">
            <label className="text-xs font-semibold text-gray-600">İptal nedeni
              <select className={`${formInputClass} mt-1.5`} value={reason} onChange={(event) => setReason(event.target.value)}>
                <option value="">Neden seçin</option>
                {cancelReasons.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-gray-600">Açıklama
              <textarea className={`${formInputClass} mt-1.5 min-h-20 resize-y`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="İsteğe bağlı açıklama" />
            </label>
            {isReasonInvalid && <p className="text-xs font-semibold text-red-600">{reason === 'Diğer' ? 'Diğer nedeni için açıklama zorunludur.' : 'İptal nedeni zorunludur.'}</p>}
          </div>
        )}
      </ConfirmActionModal>
    </>
  )
}
