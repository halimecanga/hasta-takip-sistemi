import { Eye, Plus, CheckCircle2, XCircle, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { appointmentsApi } from '../services/api'
import { formInputClass, paddedCardClass, primaryButtonClass, textButtonClass } from '../styles/uiClasses'

export default function Appointments() {
  const location = useLocation()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const [doctor, setDoctor] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setItems(await appointmentsApi.list({ search, status, date, doctor }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, status, date, doctor])

  useEffect(() => {
    if (!location.state?.notification) return
    setNotification({ message: location.state.notification, tone: 'success' })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const changeStatus = async (id, nextStatus) => {
    try {
      setBusyId(id)
      await appointmentsApi.status(id, nextStatus)
      setNotification({ message: `Randevu ${nextStatus.toLocaleLowerCase('tr-TR')}.`, tone: nextStatus === 'İptal Edildi' ? 'warning' : 'success' })
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    } finally {
      setBusyId('')
    }
  }

  const columns = [
    { key: 'patient', label: 'Hasta Adı' },
    { key: 'date', label: 'Tarih' },
    { key: 'time', label: 'Saat' },
    { key: 'department', label: 'Bölüm / Muayene Türü' },
    { key: 'doctor', label: 'Doktor' },
    { key: 'status', label: 'Durum', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'action',
      label: 'İşlem',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link className={textButtonClass} state={{ from: '/randevular', fromLabel: 'Randevular' }} to={`/hastalar/${row.patientNo}?yeniMuayene=true&randevu=${row.id}`}>
            <Eye size={15} />Muayene Başlat
          </Link>
          <RowActionsMenu
            label={`${row.patient} randevu işlemleri`}
            items={[
              { label: 'Düzenle', icon: <Pencil size={15} />, tone: 'neutral', to: `/randevular/yeni?id=${row.id}` },
              row.status !== 'Tamamlandı' && { label: 'Tamamlandı', icon: <CheckCircle2 size={15} />, tone: 'success', onSelect: () => changeStatus(row.id, 'Tamamlandı') },
              row.status !== 'İptal Edildi' && { label: 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: () => changeStatus(row.id, 'İptal Edildi') },
            ].filter(Boolean)}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <PageTitle title="Randevular" subtitle="Hasta randevularını planlayın ve takip edin." action={<Link className={primaryButtonClass} to="/randevular/yeni"><Plus size={18} />Yeni Randevu</Link>} />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1.4fr)_170px_170px_170px] gap-3 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          <input aria-label="Hasta veya muayene türü ara" className={formInputClass} placeholder="Hasta veya muayene türü ara..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Doktora göre filtrele" className={formInputClass} value={doctor} onChange={(event) => setDoctor(event.target.value)}>
            <option value="">Tüm Doktorlar</option>
            <option>Dr. Cumhur Kesemenli</option>
          </select>
          <select aria-label="Duruma göre filtrele" className={formInputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Tüm Durumlar</option>
            {['Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal Edildi'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <input aria-label="Tarihe göre filtrele" className={formInputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        {isLoading ? <p className="py-8 text-center text-sm text-gray-500">Randevular yükleniyor...</p> : error ? <p className="py-8 text-center text-sm text-red-600">{error}</p> : <DataTable columns={columns} data={items} emptyText="Randevu kaydı bulunamadı." />}
        {busyId && <p className="mt-3 text-xs text-gray-500">Randevu güncelleniyor...</p>}
      </div>
    </>
  )
}
