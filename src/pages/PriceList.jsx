import { useEffect, useState } from 'react'
import { Archive, Eye, Pencil, Plus, RotateCcw, Trash2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import { formatCurrency } from '../components/price-detail/priceUtils'
import StatusBadge from '../components/StatusBadge'
import { pricesApi } from '../services/api'
import { formInputClass, paddedCardClass, primaryButtonClass, textButtonClass } from '../styles/uiClasses'

export default function PriceList() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [notification, setNotification] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Muayene', price: '', description: '' })

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setItems(await pricesApi.list({ search, status }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, status])

  const runAction = async () => {
    try {
      if (pendingAction.type === 'delete') {
        await pricesApi.remove(pendingAction.item.id)
      } else {
        await pricesApi.status(pendingAction.item.id, pendingAction.nextStatus)
      }
      setNotification({ message: pendingAction.message, tone: pendingAction.tone })
      setPendingAction(null)
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    }
  }

  const createPrice = async (event) => {
    event.preventDefault()
    try {
      setIsSaving(true)
      await pricesApi.create(form)
      setNotification({ message: 'Fiyat kaydı oluşturuldu.', tone: 'success' })
      setCreateOpen(false)
      setForm({ name: '', category: 'Muayene', price: '', description: '' })
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setIsSaving(false)
    }
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
      <PageTitle title="Fiyat Listesi" subtitle="Klinik hizmetlerinin güncel ücret tarifesi." action={<button className={primaryButtonClass} type="button" onClick={() => setCreateOpen((current) => !current)}><Plus size={18} />Yeni İşlem</button>} />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      {createOpen && (
        <form className={`${paddedCardClass} mb-5 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1`} onSubmit={createPrice}>
          <input className={formInputClass} placeholder="İşlem adı" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <select className={formInputClass} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
            {['Muayene', 'Laboratuvar', 'Görüntüleme', 'Uygulama', 'Kontrol', 'Diğer'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <input className={formInputClass} min="0" placeholder="Ücret" required type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          <input className={formInputClass} placeholder="Açıklama" required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          <button className={primaryButtonClass} disabled={isSaving} type="submit">{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </form>
      )}
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_170px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="İşlem veya kategori ara" className={formInputClass} placeholder="İşlem veya kategori ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Fiyat durumuna göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Aktif', 'Pasif', 'Arşivlendi'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        {isLoading ? <p className="py-8 text-center text-sm text-gray-500">Fiyat listesi yükleniyor...</p> : error ? <p className="py-8 text-center text-sm text-red-600">{error}</p> : <DataTable columns={columns} data={items} />}
      </div>
      <ConfirmActionModal
        confirmLabel={pendingAction?.confirmLabel}
        description={pendingAction?.description}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.title}
        variant={pendingAction?.variant}
        onCancel={() => setPendingAction(null)}
        onConfirm={runAction}
      />
    </>
  )
}
