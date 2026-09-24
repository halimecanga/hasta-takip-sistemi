import { useEffect, useState } from 'react'
import { Eye, FileEdit, RotateCcw, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { examinationsApi } from '../services/api'
import { formInputClass, paddedCardClass, textButtonClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış kayıt', 'Hasta gelmedi', 'Çift kayıt', 'Diğer']

export default function Examinations() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [doctor, setDoctor] = useState('')
  const [type, setType] = useState('')
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
      setItems(await examinationsApi.list({ search, status, doctor, type, date }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, status, doctor, type, date])

  const closeModal = () => {
    setPendingAction(null)
    setReason('')
    setNote('')
  }

  const deleteDraft = async () => {
    try {
      setBusy(true)
      await examinationsApi.remove(pendingAction.item.id)
      setNotification({ message: 'Taslak muayene arşivlendi.', tone: 'success' })
      closeModal()
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const updateStatusWithReason = async () => {
    try {
      setBusy(true)
      await examinationsApi.status(pendingAction.item.id, {
        status: pendingAction.nextStatus,
        reason,
        note,
      })
      setNotification({ message: pendingAction.message, tone: pendingAction.nextStatus === 'İptal' ? 'warning' : 'success' })
      closeModal()
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const reactivate = async (item) => {
    try {
      await examinationsApi.status(item.id, { status: 'Bekliyor' })
      setNotification({ message: 'Muayene yeniden aktifleştirildi.', tone: 'success' })
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    }
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
        const viewItem = { label: row.status === 'Bekliyor' || row.status === 'Taslak' ? 'Muayeneye Devam Et' : 'Görüntüle', icon: <Eye size={15} />, tone: 'neutral', to: `/hastalar/${row.patientNo}?dosya=${row.visitId}`, state: { from: '/muayeneler', fromLabel: 'Muayeneler' } }
        const itemsForStatus = {
          Taslak: [viewItem, { label: 'Arşivle', icon: <Trash2 size={15} />, tone: 'danger', onSelect: () => setPendingAction({ type: 'delete', item: row }) }],
          Bekliyor: [viewItem, { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, nextStatus: 'İptal', message: 'Muayene iptal edildi.', requiresReason: true }) }],
          Takipte: [viewItem, { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'cancel', item: row, nextStatus: 'İptal', message: 'Muayene iptal edildi.', requiresReason: true }) }],
          Tamamlandı: [viewItem, { label: 'Geçersiz İşaretle', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => setPendingAction({ type: 'invalid', item: row, nextStatus: 'İptal', message: 'Muayene geçersiz işaretlendi.', requiresReason: true }) }],
          İptal: [viewItem, { label: 'Yeniden Aktifleştir', icon: <RotateCcw size={15} />, tone: 'success', onSelect: () => reactivate(row) }],
        }

        return (
          <div className="flex items-center gap-1">
            <Link className={textButtonClass} state={{ from: '/muayeneler', fromLabel: 'Muayeneler' }} to={`/hastalar/${row.patientNo}?dosya=${row.visitId}`}><Eye size={15} />Detay</Link>
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
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1.4fr)_160px_160px_160px_160px] gap-3 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1">
          <input aria-label="Hasta, şikayet veya tanı ara" className={formInputClass} placeholder="Hasta, şikayet veya tanı ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Doktora göre filtrele" className={formInputClass} value={doctor} onChange={(event) => setDoctor(event.target.value)}>
            <option value="">Tüm Doktorlar</option>
            <option>Dr. Cumhur Kesemenli</option>
          </select>
          <select aria-label="Muayene türüne göre filtrele" className={formInputClass} value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">Tüm Türler</option>
            {['Genel Muayene', 'Kontrol Muayenesi', 'İlk Değerlendirme', 'Acil Değerlendirme'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <select aria-label="Muayene durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Taslak', 'Bekliyor', 'Takipte', 'Tamamlandı', 'İptal'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <input aria-label="Tarihe göre filtrele" className={formInputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        {isLoading ? <p className="py-8 text-center text-sm text-gray-500">Muayeneler yükleniyor...</p> : error ? <p className="py-8 text-center text-sm text-red-600">{error}</p> : <DataTable columns={columns} data={items} />}
      </div>
      <ConfirmActionModal
        confirmLabel={pendingAction?.type === 'delete' ? 'Taslağı Arşivle' : 'Onayla'}
        description={pendingAction?.type === 'delete' ? 'Taslak kalıcı silinmez; durumu İptal olarak arşivlenir.' : 'Kayıt durumu güncellenecek, klinik geçmiş verileri korunacaktır.'}
        isConfirmDisabled={Boolean(isReasonInvalid) || busy}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.type === 'delete' ? 'Taslak muayene arşivlensin mi?' : 'Muayene durumu güncellensin mi?'}
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
