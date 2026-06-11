import { useMemo, useState } from 'react'
import { Eye, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { tests } from '../data/mockData'
import { formInputClass, paddedCardClass, textButtonClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış hasta', 'Yanlış tetkik', 'Numune sorunu', 'Çift kayıt', 'Teknik hata', 'Diğer']

export default function Tests() {
  const [items, setItems] = useState(() => tests.map((item) => ({ ...item })))
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [notification, setNotification] = useState(null)

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('tr-TR')
    return items.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.patient, item.type, item.id, item.status]
        .some((value) => value.toLocaleLowerCase('tr-TR').includes(normalizedSearch))
      return matchesSearch && (!status || item.status === status)
    })
  }, [items, search, status])

  const closeModal = () => {
    setPendingAction(null)
    setReason('')
    setNote('')
  }

  const updateTestStatus = () => {
    const actionReason = reason === 'Diğer' ? note.trim() : reason
    setItems((current) => current.map((item) => (
      item.id === pendingAction.item.id
        ? { ...item, status: 'İptal Edildi', actionReason }
        : item
    )))
    setNotification({ message: pendingAction.message, tone: 'warning' })
    closeModal()
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
        const viewItem = { label: row.status === 'İptal Edildi' ? 'Görüntüle' : 'Sonucu Görüntüle', icon: <Eye size={15} />, tone: 'neutral', to: `/tetkikler/${row.id}` }
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
      <PageTitle title="Tetkikler" subtitle="Laboratuvar ve görüntüleme sonuçlarını izleyin." />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_180px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="Hasta veya tetkik türü ara" className={formInputClass} placeholder="Hasta veya tetkik türü ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Tetkik durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Bekliyor', 'İnceleniyor', 'Hazır', 'İptal Edildi'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filteredItems} />
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
          {isReasonInvalid && <p className="text-xs font-semibold text-red-600">{reason === 'Diğer' ? 'Diğer nedeni için açıklama zorunludur.' : 'Neden seçimi zorunludur.'}</p>}
        </div>
      </ConfirmActionModal>
    </>
  )
}
