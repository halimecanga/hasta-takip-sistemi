import { Eye, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import FilterBar from '../components/FilterBar'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import StatusBadge from '../components/StatusBadge'
import { useAppointments } from '../context/AppointmentContext'
import { paddedCardClass, primaryButtonClass, textButtonClass } from '../styles/uiClasses'

const columns = [
  { key: 'patient', label: 'Hasta Adı' }, { key: 'date', label: 'Tarih' },
  { key: 'time', label: 'Saat' }, { key: 'department', label: 'Bölüm / Muayene Türü' },
  { key: 'status', label: 'Durum', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'action', label: 'İşlem', render: (row) => <Link className={textButtonClass} state={{ from: '/randevular', fromLabel: 'Randevular' }} to={`/hastalar/${row.patientNo}?yeniMuayene=true`}><Eye size={15} />Görüntüle</Link> },
]

export default function Appointments() {
  const location = useLocation()
  const navigate = useNavigate()
  const { appointmentItems } = useAppointments()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (!location.state?.notification) return
    setNotification({ message: location.state.notification, tone: 'success' })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const sortedAppointments = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    return [...appointmentItems].sort((first, second) => {
      const firstDateTime = new Date(`${first.dateIso}T${first.time}`).getTime()
      const secondDateTime = new Date(`${second.dateIso}T${second.time}`).getTime()
      const firstPast = firstDateTime < todayStart
      const secondPast = secondDateTime < todayStart

      if (firstPast !== secondPast) return firstPast ? 1 : -1
      return firstPast ? secondDateTime - firstDateTime : firstDateTime - secondDateTime
    })
  }, [appointmentItems])

  return (
    <>
      <PageTitle title="Randevular" subtitle="Hasta randevularını planlayın ve takip edin." action={<Link className={primaryButtonClass} to="/randevular/yeni"><Plus size={18} />Yeni Randevu</Link>} />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <FilterBar placeholder="Hasta veya muayene türü ara..." />
        <DataTable columns={columns} data={sortedAppointments} />
      </div>
    </>
  )
}
