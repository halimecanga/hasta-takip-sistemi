import { useEffect, useMemo, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import EmptyState from '../components/patient-detail/EmptyState'
import NewExaminationForm from '../components/patient-detail/NewExaminationForm'
import PatientAlerts from '../components/patient-detail/PatientAlerts'
import PatientHeader from '../components/patient-detail/PatientHeader'
import PatientQuickStats from '../components/patient-detail/PatientQuickStats'
import PatientSummaryCard from '../components/patient-detail/PatientSummaryCard'
import VisitDetails from '../components/patient-detail/VisitDetails'
import VisitHistory from '../components/patient-detail/VisitHistory'
import { appointmentsApi, patientsApi } from '../services/api'
import { paddedCardClass } from '../styles/uiClasses'

const resolveVisitId = (visits, visitId) =>
  visits.some((visit) => visit.id === visitId)
    ? visitId
    : visits[0]?.id || ''

const formatDate = (value) => {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export default function PatientDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [appointment, setAppointment] = useState(null)

  const shouldCreate = searchParams.get('yeniMuayene') === 'true'
  const visitIdFromUrl = searchParams.get('dosya')
  const appointmentNoFromUrl = searchParams.get('randevu')
  const returnPath = location.state?.from || '/hastalar'
  const returnLabel = location.state?.fromLabel || 'Hastalar'

  const [patient, setPatient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [visits, setVisits] = useState([])
  const [selectedVisitId, setSelectedVisitId] = useState('')
  const [mode, setMode] = useState(
    shouldCreate ? 'create' : 'view'
  )
  const [activeTab, setActiveTab] = useState('overview')

  const selectedVisit = useMemo(
    () =>
      visits.find((visit) => visit.id === selectedVisitId) ||
      visits[0],
    [selectedVisitId, visits]
  )

  useEffect(() => {
    const controller = new AbortController()

    const loadPatient = async () => {
      try {
        setIsLoading(true)
        setLoadError('')
        setPatient(null)

        const data = await patientsApi.detail(id)
        const relatedAppointments = await appointmentsApi.list({ patientNo: id })
        if (!controller.signal.aborted) {
          setAppointment(
            relatedAppointments.find((item) => appointmentNoFromUrl && item.id === appointmentNoFromUrl)
            || relatedAppointments.find((item) => item.status !== 'İptal Edildi' && item.status !== 'Tamamlandı')
            || relatedAppointments[0]
            || null
          )
        }

        const loadedPatient = {
          ...data,
          birthDate: formatDate(data.birthDate),
          registeredAt: formatDate(data.registeredAt),
          visits: Array.isArray(data.visits) ? data.visits : [],
        }

        setPatient(loadedPatient)
        setVisits(loadedPatient.visits)
        setSelectedVisitId(
          resolveVisitId(loadedPatient.visits, visitIdFromUrl)
        )
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadError(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadPatient()

    return () => controller.abort()
  }, [id, appointmentNoFromUrl])

  useEffect(() => {
    if (!patient) return

    if (shouldCreate) {
      setMode('create')
      return
    }

    const nextVisitId = resolveVisitId(visits, visitIdFromUrl)
    const isValidUrlVisit = visits.some(
      (visit) => visit.id === visitIdFromUrl
    )

    if (nextVisitId) {
      setSelectedVisitId(nextVisitId)
    }

    setMode('view')
    setActiveTab('overview')

    if (visitIdFromUrl && !isValidUrlVisit && nextVisitId) {
      navigate(
        {
          pathname: `/hastalar/${patient.id}`,
          search: `?dosya=${nextVisitId}`,
        },
        {
          replace: true,
          state: location.state,
        }
      )
    }
  }, [
    patient,
    shouldCreate,
    visitIdFromUrl,
    visits,
    navigate,
    location.state,
  ])

  if (isLoading) {
    return (
      <section
        className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}
      >
        Hasta bilgileri yükleniyor...
      </section>
    )
  }

  if (loadError) {
    return (
      <EmptyState
        title="Hasta bilgileri alınamadı"
        text={loadError}
      />
    )
  }

  if (!patient) {
    return <EmptyState />
  }

  const navigatePatientSearch = (search) => {
    navigate(
      {
        pathname: `/hastalar/${patient.id}`,
        search,
      },
      {
        replace: true,
        state: location.state,
      }
    )
  }

  const startCreate = () => {
    setMode('create')
    navigatePatientSearch('?yeniMuayene=true')
  }

  const selectVisit = (visitId) => {
    setSelectedVisitId(visitId)
    setMode('view')
    setActiveTab('overview')
    navigatePatientSearch(`?dosya=${visitId}`)
  }

  const cancelCreate = () => {
    setMode('view')
    setActiveTab('overview')

    const nextVisitId = selectedVisitId || visits[0]?.id

    navigatePatientSearch(
      nextVisitId ? `?dosya=${nextVisitId}` : ''
    )
  }

  const saveVisit = async (visit) => {
    try {
      const data = await patientsApi.detail(id)
      const loadedVisits = Array.isArray(data.visits) ? data.visits : []
      setVisits(loadedVisits)
      setSelectedVisitId(resolveVisitId(loadedVisits, visit.id))
    } catch {
      setVisits((current) => [visit, ...current])
      setSelectedVisitId(visit.id)
    }
    setMode('view')
    setActiveTab('overview')
    navigatePatientSearch(`?dosya=${visit.id}`)
  }

  return (
    <>
      <PatientHeader
        patient={patient}
        returnLabel={returnLabel}
        returnPath={returnPath}
        onStartNewVisit={startCreate}
      />

      <PatientAlerts patient={patient} />
      <PatientSummaryCard patient={patient} />

      <PatientQuickStats
        patient={patient}
        visits={visits}
      />

      <div className="grid grid-cols-[27fr_73fr] gap-5 max-[980px]:grid-cols-1">
        <VisitHistory
          visits={visits}
          selectedVisitId={selectedVisit?.id}
          onSelect={selectVisit}
        />

        <main className="min-w-0">
          {mode === 'create' ? (
            <NewExaminationForm
              patient={patient}
              appointment={shouldCreate ? appointment : null}
              onCancel={cancelCreate}
              onSave={saveVisit}
            />
          ) : selectedVisit ? (
            <VisitDetails
              visit={selectedVisit}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          ) : (
            <section
              className={`${paddedCardClass} flex min-h-[220px] flex-col items-center justify-center text-center`}
            >
              <h2 className="text-sm font-bold text-gray-900">
                Henüz muayene kaydı yok
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Bu hasta için ilk muayeneyi başlatabilirsiniz.
              </p>
            </section>
          )}
        </main>
      </div>
    </>
  )
}