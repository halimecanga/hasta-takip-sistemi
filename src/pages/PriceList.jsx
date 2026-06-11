import { useMemo, useState } from 'react'
import { Archive, Eye, Pencil, Plus, RotateCcw, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import { formatCurrency } from '../components/price-detail/priceUtils'
import StatusBadge from '../components/StatusBadge'
import { priceList } from '../data/mockData'
import { formInputClass, paddedCardClass, primaryButtonClass, textButtonClass } from '../styles/uiClasses'

export default function PriceList() {
  const [items, setItems] = useState(() => priceList.map((item) => ({ ...item })))
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [notification, setNotification] = useState(null)

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('tr-TR')
    return items.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.name, item.category, item.description, item.id]
        .some((value) => value.toLocaleLowerCase('tr-TR').includes(normalizedSearch))
      return matchesSearch && (!status || item.status === status)
    })
  }, [items, search, status])

  const closeModal = () => setPendingAction(null)

  const runAction = () => {
    if (pendingAction.type === 'delete') {
      setItems((current) => current.filter((item) => item.id !== pendingAction.item.id))
    } else {
      setItems((current) => current.map((item) => (
        item.id === pendingAction.item.id
          ? { ...item, status: pendingAction.nextStatus }
          : item
      )))
    }
    setNotification({ message: pendingAction.message, tone: pendingAction.tone })
    closeModal()
  }

  const openAction = (item, action) => setPendingAction({ item, ...action })

  const actionsFor = (row) => {
    const view = { label: 'Görüntüle', icon: <Eye size={15} />, tone: 'neutral', to: `/fiyat-listesi/${row.id}` }
    const edit = { label: 'Düzenle', icon: <Pencil size={15} />, tone: 'neutral', to: `/fiyat-listesi/${row.id}?duzenle=true` }
    const deactivate = { label: 'Pasife Al', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => openAction(row, { type: 'status', nextStatus: 'Pasif', title: 'Fiyat kaydı pasife alınsın mı?', description: 'Fiyat kaydı listede pasif olarak görünecektir.', confirmLabel: 'Pasife Al', message: 'Fiyat kaydı pasife alındı.', tone: 'warning', variant: 'warning' }) }
    const activate = { label: 'Aktifleştir', icon: <RotateCcw size={15} />, tone: 'success', onSelect: () => openAction(row, { type: 'status', nextStatus: 'Aktif', title: 'Fiyat kaydı aktifleştirilsin mi?', description: 'Fiyat kaydı yeniden aktif duruma alınacaktır.', confirmLabel: 'Aktifleştir', message: 'Fiyat kaydı aktifleştirildi.', tone: 'success', variant: 'neutral' }) }
    const archive = { label: 'Arşivle', icon: <Archive size={15} />, tone: 'archive', onSelect: () => openAction(row, { type: 'status', nextStatus: 'Arşivlendi', title: 'Fiyat kaydı arşivlensin mi?', description: 'Kayıt normal kullanım listesinden kaldırılacak, geçmiş kullanım bilgileri korunacaktır.', confirmLabel: 'Arşivle', message: 'Fiyat kaydı arşivlendi.', tone: 'warning', variant: 'archive' }) }
    const restore = { label: 'Arşivden Çıkar', icon: <RotateCcw size={15} />, tone: 'success', onSelect: () => openAction(row, { type: 'status', nextStatus: 'Pasif', title: 'Fiyat kaydı arşivden çıkarılsın mı?', description: 'Kayıt pasif duruma alınarak yeniden listelenecektir.', confirmLabel: 'Arşivden Çıkar', message: 'Fiyat kaydı arşivden çıkarıldı.', tone: 'success', variant: 'neutral' }) }
    const remove = row.usageCount === 0 ? { label: 'Sil', icon: <Trash2 size={15} />, tone: 'danger', onSelect: () => openAction(row, { type: 'delete', title: 'Kullanılmamış fiyat kaydı silinsin mi?', description: 'Bu kayıt kullanım geçmişi olmadığı için listeden kaldırılacaktır.', confirmLabel: 'Sil', message: 'Fiyat kaydı silindi.', tone: 'success', variant: 'danger' }) } : null

    if (row.status === 'Aktif') return [view, edit, deactivate]
    if (row.status === 'Pasif') return [view, edit, activate, archive, remove]
    return [view, restore]
  }

  const columns = [
    { key: 'name', label: 'İşlem Adı' },
    { key: 'category', label: 'Kategori' },
    { key: 'price', label: 'Ücret', render: (row) => formatCurrency(row.price) },
    { key: 'description', label: 'Açıklama' },
    { key: 'status', label: 'Durum', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'action',
      label: 'İşlem',
      render: (row) => (
        <div className="flex items-center gap-0.5">
          <Link className={textButtonClass} to={`/fiyat-listesi/${row.id}`}><Eye size={15} />Görüntüle</Link>
          <RowActionsMenu label={`${row.name} fiyat işlemleri`} items={actionsFor(row)} />
        </div>
      ),
    },
  ]

  return (
    <>
      <PageTitle title="Fiyat Listesi" subtitle="Klinik hizmetlerinin güncel ücret tarifesi." action={<button className={primaryButtonClass} type="button"><Plus size={18} />Yeni İşlem</button>} />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_170px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="İşlem veya kategori ara" className={formInputClass} placeholder="İşlem veya kategori ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Fiyat durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Aktif', 'Pasif', 'Arşivlendi'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filteredItems} />
      </div>
      <ConfirmActionModal
        confirmLabel={pendingAction?.confirmLabel}
        description={pendingAction?.description}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.title}
        variant={pendingAction?.variant}
        onCancel={closeModal}
        onConfirm={runAction}
      />
    </>
  )
}
