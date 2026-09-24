import { useEffect, useMemo, useState } from 'react'
import { Archive, RotateCcw, Pencil, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DataTable from '../components/DataTable'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { patientsApi } from '../services/api'
import { formInputClass, mutedTextButtonClass, paddedCardClass, primaryButtonClass, textButtonClass } from '../styles/uiClasses'

const archiveFilters = {
  active: 'Aktif Hastalar',
  archived: 'Arşivlenen Hastalar',
  all: 'Tümü',
}

export default function Patients() {
  const [patientItems, setPatientItems] = useState([])
const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [archiveFilter, setArchiveFilter] = useState('active')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [notification, setNotification] = useState(null)
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await patientsApi.list()
        setPatientItems(data)
      } catch (error) {
        console.error(error)
  
        setNotification({
          message: 'Hastalar veritabanından alınamadı.',
          tone: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    loadPatients()
  }, [])
  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('tr-TR')

    return patientItems.filter((patient) => {
      const isArchived = patient.status === 'Arşivlendi'
      const matchesArchive =
        archiveFilter === 'all' ||
        (archiveFilter === 'archived' && isArchived) ||
        (archiveFilter === 'active' && !isArchived)
      const matchesSearch = !normalizedSearch || [patient.no, patient.name, patient.identity, patient.phone]
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(normalizedSearch))

      return matchesArchive && matchesSearch
    })
  }, [archiveFilter, patientItems, search])

  const closeModal = () => setSelectedPatient(null)

  const archivePatient = async () => {
    if (!selectedPatient) return
  
    try {
      const data = await patientsApi.archive(selectedPatient.no)
  
      setPatientItems((current) =>
        current.map((patient) =>
          patient.no === selectedPatient.no
            ? {
                ...patient,
                status: data.patient.status,
                previousStatus: data.patient.previousStatus,
              }
            : patient
        )
      )
  
      setNotification({
        message: data.message,
        tone: 'warning',
      })
  
      closeModal()
    } catch (error) {
      setNotification({
        message: error.message,
        tone: 'error',
      })
    }
  }
  
  const restorePatient = async (patientNo) => {
    try {
      const data = await patientsApi.restore(patientNo)
  
      setPatientItems((current) =>
        current.map((patient) =>
          patient.no === patientNo
            ? {
                ...patient,
                status: data.patient.status,
                previousStatus: null,
              }
            : patient
        )
      )
  
      setNotification({
        message: data.message,
        tone: 'success',
      })
    } catch (error) {
      setNotification({
        message: error.message,
        tone: 'error',
      })
    }
  }
  const columns = [
    { key: 'no', label: 'Hasta No' },
    { key: 'name', label: 'Ad Soyad' },
    { key: 'identity', label: 'TC Kimlik' },
    { key: 'phone', label: 'Telefon' },
    { key: 'age', label: 'Yaş' },
    { key: 'gender', label: 'Cinsiyet' },
    { key: 'lastExam', label: 'Son Muayene' },
    { key: 'status', label: 'Durum', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'action',
      label: 'İşlem',
      render: (row) => (
        <div className="flex items-center gap-0.5">
          <Link className={textButtonClass} state={{ from: '/hastalar', fromLabel: 'Hastalar' }} to={`/hastalar/${row.no}`}>Görüntüle</Link>
          {row.status !== 'Arşivlendi' && <button className={`${mutedTextButtonClass} opacity-60`} disabled title="Hasta düzenleme henüz uygulanmadı." type="button"><Pencil size={15} />Düzenle</button>}
          <RowActionsMenu
            label={`${row.name} hasta işlemleri`}
            items={row.status === 'Arşivlendi'
              ? [{ label: 'Arşivden Çıkar', icon: <RotateCcw size={15} />, tone: 'success', onSelect: () => restorePatient(row.no) }]
              : [{ label: 'Arşivle', icon: <Archive size={15} />, tone: 'archive', onSelect: () => setSelectedPatient(row) }]}
          />
        </div>
      ),
    },
  ]

  return (
    
    <>
<Link className={primaryButtonClass} to="/hastalar/yeni">
  <UserPlus size={18} />
  Yeni Hasta Ekle
</Link>
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      <div className={paddedCardClass}>
        <div className="mb-[18px] grid grid-cols-[minmax(220px,1fr)_190px] gap-3 max-[640px]:grid-cols-1">
          <input aria-label="Hasta adı, no veya TC ara" className={formInputClass} placeholder="Hasta adı, no veya TC ara..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select aria-label="Arşiv durumuna göre filtrele" className={formInputClass} value={archiveFilter} onChange={(event) => setArchiveFilter(event.target.value)}>
            {Object.entries(archiveFilters).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        {isLoading ? (
  <p className="py-8 text-center text-sm text-slate-500">
    Hastalar yükleniyor...
  </p>
) : (
  <DataTable columns={columns} data={filteredPatients} />
)}
      </div>
      <ConfirmActionModal
        confirmLabel="Hastayı Arşivle"
        description="Hasta normal listeden kaldırılacak ancak muayene, reçete, ödeme ve tetkik geçmişi korunacaktır."
        isOpen={Boolean(selectedPatient)}
        title="Hasta arşivlensin mi?"
        variant="archive"
        onCancel={closeModal}
        onConfirm={archivePatient}
      />
    </>
  )
}
