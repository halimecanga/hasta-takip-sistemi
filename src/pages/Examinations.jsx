import { useMemo, useState } from 'react'
import { Eye, FileEdit, RotateCcw, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { examinations } from '../data/mockData'
import { formInputClass, paddedCardClass, textButtonClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış kayıt', 'Hasta gelmedi', 'Çift kayıt', 'Diğer']

const draftExamination = {
  id: 'EXM-2026-DRAFT',
  patientNo: 'HT-1042',
  visitId: 'DOS-DRAFT-001',
  patient: 'Ayşe Yılmaz',
  date: '05 Haz 2026',
  complaint: 'Taslak muayene notu',
  diagnosis: 'Ön değerlendirme bekliyor',
  status: 'Taslak',
}

export default function Examinations() {
  const [items, setItems] = useState(() => [...examinations.map((item) => ({ ...item })), draftExamination])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [notification, setNotification] = useState(null)

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('tr-TR')
    return items.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.patient, item.complaint, item.diagnosis, item.id]
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
    setNotification({ message: 'Taslak muayene silindi.', tone: 'success' })
    closeModal()
  }

  const updateStatusWithReason = () => {
    const actionReason = reason === 'Diğer' ? note.trim() : reason
    setItems((current) => current.map((item) => (
      item.id === pendingAction.item.id
        ? { ...item, status: pendingAction.nextStatus, actionReason }
        : item
    )))
    setNotification({ message: pendingAction.message, tone: pendingAction.nextStatus === 'İptal Edildi' ? 'warning' : 'success' })
    closeModal()
  }

  const reactivate = (item) => {
    setItems((current) => current.map((record) => (record.id === item.id ? { ...record, status: 'Bekliyor', actionReason: '' } : record)))
    setNotification({ message: 'Muayene yeniden aktifleştirildi.', tone: 'success' })
  }

  const isReasonInvalid = pendingAction?.requiresReason && (!reason || (reason === 'Diğer' && !note.trim()))

  const columns = [
    { key: 'patient', label: 'Hasta Adı' },
    { key: 'date', label: 'Muayene Tarihi' },
    { key: 'complaint', label: 'Şikayet' },
    { key: 'diagnosis', label: 'Tanı' },
    { key: 'status', label: 'Durum', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'detail',
      label: 'Detay',
      render: (row) => {
        const viewItem = { label: row.status === 'Bekliyor' ? 'Muayeneye Devam Et' : 'Görüntüle', icon: <Eye size={15} />, tone: 'neutral', to: `/hastalar/${row.patientNo}?dosya=${row.visitId}`, state: { from: '/muayeneler', fromLabel: 'Muayeneler' } }
        const itemsForStatus = {
          Taslak: [
            { label: 'Düzenle', icon: <FileEdit size={15} />, tone: 'neutral', onSelect: showNoop },
            { label: 'Sil', icon: <Trash2 size={15} />, tone: 'danger', onSelect: () => setPendingAction({ type: 'delete', item: row }) },
          ],
          Bekliyor: [
            viewItem,
            { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, nextStatus: 'İptal Edildi', message: 'Muayene iptal edildi.', requiresReason: true }) },
          ],
          Takipte: [
            viewItem,
            { label: 'Tedavi Notu Ekle', icon: <FileEdit size={15} />, tone: 'neutral', onSelect: showNoop },
            { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, nextStatus: 'İptal Edildi', message: 'Muayene iptal edildi.', requiresReason: true }) },
          ],
          Tamamlandı: [
            viewItem,
            { label: 'Geçersiz İşaretle', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'invalid', item: row, nextStatus: 'İptal Edildi', message: 'Muayene geçersiz işaretlendi.', requiresReason: true }) },
          ],
          'İptal Edildi': [
            viewItem,
            { label: 'Yeniden Aktifleştir', icon: <RotateCcw size={15} />, tone: 'success', onSelect: () => reactivate(row) },
          ],
        }

        return (
          <div className="flex items-center gap-1">
            {row.status !== 'Taslak' && <Link className={textButtonClass} state={{ from: '/muayeneler', fromLabel: 'Muayeneler' }} to={`/hastalar/${row.patientNo}?dosya=${row.visitId}`}><Eye size={15} />Detay</Link>}
            <RowActionsMenu label={`${row.patient} muayene işlemleri`} items={itemsForStatus[row.status] || [viewItem]} />
          </div>
        )
      },
    },
  ]

  return (
    <>
      <PageTitle title="Muayeneler" subtitle="Muayene kayıtları ve klinik değerlendirmeler." />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_180px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="Hasta, şikayet veya tanı ara" className={formInputClass} placeholder="Hasta, şikayet veya tanı ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Muayene durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Taslak', 'Bekliyor', 'Takipte', 'Tamamlandı', 'İptal Edildi'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filteredItems} />
      </div>
      <ConfirmActionModal
        confirmLabel={pendingAction?.type === 'delete' ? 'Taslağı Sil' : 'Onayla'}
        description={pendingAction?.type === 'delete' ? 'Bu işlem geri alınamaz.' : 'Kayıt durumu güncellenecek, klinik geçmiş verileri korunacaktır.'}
        isConfirmDisabled={Boolean(isReasonInvalid)}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.type === 'delete' ? 'Taslak muayene silinsin mi?' : 'Muayene durumu güncellensin mi?'}
        variant={pendingAction?.type === 'delete' ? 'danger' : 'warning'}
        onCancel={closeModal}
        onConfirm={pendingAction?.type === 'delete' ? deleteDraft : updateStatusWithReason}
      >
        {pendingAction?.requiresReason && (
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
        )}
      </ConfirmActionModal>
    </>
  )
}
