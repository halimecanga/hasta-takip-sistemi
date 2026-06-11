import { useMemo, useState } from 'react'
import { Eye, FileEdit, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { prescriptions } from '../data/mockData'
import { formInputClass, paddedCardClass, textButtonClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış ilaç seçimi', 'Doz değişikliği', 'Hasta intoleransı', 'Çift reçete', 'Diğer']

const draftPrescription = {
  id: 'REC-2026-DRAFT',
  patientNo: 'HT-1042',
  visitId: 'DOS-2026-003',
  patient: 'Ayşe Yılmaz',
  count: 1,
  date: '05 Haz 2026',
  status: 'Taslak',
}

export default function Prescriptions() {
  const [items, setItems] = useState(() => [...prescriptions.map((item) => ({ ...item })), draftPrescription])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [notification, setNotification] = useState(null)

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('tr-TR')
    return items.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.patient, item.id, item.status]
        .some((value) => value.toLocaleLowerCase('tr-TR').includes(normalizedSearch))
      return matchesSearch && (!status || item.status === status)
    })
  }, [items, search, status])

  const closeModal = () => {
    setPendingAction(null)
    setReason('')
    setNote('')
  }

  const showNoop = () => setNotification({ message: 'Bu işlem backend/form entegrasyonu ile etkinleştirilecektir.', tone: 'warning' })

  const deleteDraft = () => {
    setItems((current) => current.filter((item) => item.id !== pendingAction.item.id))
    setNotification({ message: 'Taslak reçete silindi.', tone: 'success' })
    closeModal()
  }

  const cancelPrescription = () => {
    const cancellationReason = reason === 'Diğer' ? note.trim() : reason
    setItems((current) => current.map((item) => (
      item.id === pendingAction.item.id
        ? { ...item, status: 'İptal Edildi', cancellationReason }
        : item
    )))
    setNotification({ message: pendingAction.message, tone: 'warning' })
    closeModal()
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
        const draftEditItem = { label: 'Düzenle', icon: <FileEdit size={15} />, tone: 'neutral', onSelect: showNoop }
        const itemsForStatus = {
          Taslak: [
            draftEditItem,
            { label: 'Sil', icon: <Trash2 size={15} />, tone: 'danger', onSelect: () => setPendingAction({ type: 'delete', item: row }) },
          ],
          Aktif: [
            viewItem,
            editItem,
            { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, message: 'Reçete iptal edildi.', requiresReason: true }) },
          ],
          Tamamlandı: [
            viewItem,
            { label: 'Geçersiz İşaretle', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, message: 'Reçete geçersiz işaretlendi.', requiresReason: true }) },
          ],
          'Süresi Doldu': [viewItem],
          'İptal Edildi': [viewItem],
        }

        return (
          <div className="flex items-center gap-1">
            {row.status === 'Taslak'
              ? <button className={textButtonClass} type="button" onClick={showNoop}><FileEdit size={15} />Düzenle</button>
              : <Link className={textButtonClass} to={`/receteler/${row.id}`}><Eye size={15} />Görüntüle</Link>}
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
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_180px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="Hasta veya reçete ara" className={formInputClass} placeholder="Hasta veya reçete ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Reçete durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Taslak', 'Aktif', 'Tamamlandı', 'Süresi Doldu', 'İptal Edildi'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filteredItems} />
      </div>
      <ConfirmActionModal
        confirmLabel={pendingAction?.type === 'delete' ? 'Taslağı Sil' : 'Onayla'}
        description={pendingAction?.type === 'delete' ? 'Bu işlem geri alınamaz.' : 'Reçete durumu iptal edildi olarak güncellenecek.'}
        isConfirmDisabled={Boolean(isReasonInvalid)}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.type === 'delete' ? 'Taslak reçete silinsin mi?' : 'Reçete iptal edilsin mi?'}
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
