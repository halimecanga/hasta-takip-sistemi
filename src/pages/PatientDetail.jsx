import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/patient-detail/EmptyState'
import NewExaminationForm from '../components/patient-detail/NewExaminationForm'
import PatientAlerts from '../components/patient-detail/PatientAlerts'
import PatientHeader from '../components/patient-detail/PatientHeader'
import PatientQuickStats from '../components/patient-detail/PatientQuickStats'
import PatientSummaryCard from '../components/patient-detail/PatientSummaryCard'
import VisitDetails from '../components/patient-detail/VisitDetails'
import VisitHistory from '../components/patient-detail/VisitHistory'
import { appointments } from '../data/mockData'
import { patientDetails } from '../data/patientDetailsMock'

const resolveVisitId = (visits, visitId) => visits.some((visit) => visit.id === visitId) ? visitId : visits[0]?.id || ''

export default function PatientDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patient = patientDetails.find((item) => item.id === id)
  const appointment = appointments.find((item) => item.patientNo === id)
  const shouldCreate = searchParams.get('yeniMuayene') === 'true'
  const visitIdFromUrl = searchParams.get('dosya')
  const returnPath = location.state?.from || '/hastalar'
  const returnLabel = location.state?.fromLabel || 'Hastalar'
  const [visits, setVisits] = useState(() => patient?.visits || [])
  const [selectedVisitId, setSelectedVisitId] = useState(() => resolveVisitId(patient?.visits || [], visitIdFromUrl))
  const [mode, setMode] = useState(() => shouldCreate ? 'create' : 'view')
  const [activeTab, setActiveTab] = useState('overview')

  const selectedVisit = useMemo(() => visits.find((visit) => visit.id === selectedVisitId) || visits[0], [selectedVisitId, visits])

  useEffect(() => {
    setVisits(patient?.visits || [])
  }, [patient?.id])

  useEffect(() => {
    if (!patient) return
    if (shouldCreate) {
      setMode('create')
      return
    }

    const hasCurrentPatientVisit = visits.some((visit) => patient.visits.some((patientVisit) => patientVisit.id === visit.id))
    if (patient.visits.length > 0 && visits.length > 0 && !hasCurrentPatientVisit) return

    const nextVisitId = resolveVisitId(visits, visitIdFromUrl)
    const isValidUrlVisit = visits.some((visit) => visit.id === visitIdFromUrl)

    if (nextVisitId) setSelectedVisitId(nextVisitId)
    setMode('view')
    setActiveTab('overview')

    if (visitIdFromUrl && !isValidUrlVisit && nextVisitId) {
      navigate({ pathname: `/hastalar/${patient.id}`, search: `?dosya=${nextVisitId}` }, { replace: true, state: location.state })
    }
  }, [patient, shouldCreate, visitIdFromUrl, visits, navigate, location.state])

  if (!patient) return <EmptyState />

  const navigatePatientSearch = (search) => {
    navigate({ pathname: `/hastalar/${patient.id}`, search }, { replace: true, state: location.state })
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
    navigatePatientSearch(`?dosya=${selectedVisitId || visits[0]?.id || ''}`)
  }

  const saveVisit = (visit) => {
    setVisits((current) => [visit, ...current])
    setSelectedVisitId(visit.id)
    setMode('view')
    setActiveTab('overview')
    navigatePatientSearch(`?dosya=${visit.id}`)
  }

  return (
    <>
      <PatientHeader patient={patient} returnLabel={returnLabel} returnPath={returnPath} onStartNewVisit={startCreate} />
      <PatientAlerts patient={patient} />
      <PatientSummaryCard patient={patient} />
      <PatientQuickStats patient={patient} visits={visits} />
      <div className="grid grid-cols-[27fr_73fr] gap-5 max-[980px]:grid-cols-1">
        <VisitHistory visits={visits} selectedVisitId={selectedVisit?.id} onSelect={selectVisit} />
        <main className="min-w-0">
          {mode === 'create' ? (
            <NewExaminationForm patient={patient} appointment={shouldCreate ? appointment : null} onCancel={cancelCreate} onSave={saveVisit} />
          ) : (
            <VisitDetails visit={selectedVisit} activeTab={activeTab} onTabChange={setActiveTab} />
          )}
        </main>
      </div>
    </>
  )
}
