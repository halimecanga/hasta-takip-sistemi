import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import EmptyState from '../components/prescription-detail/EmptyState'
import InstructionsTab from '../components/prescription-detail/InstructionsTab'
import MedicineList from '../components/prescription-detail/MedicineList'
import PrescriptionAlerts from '../components/prescription-detail/PrescriptionAlerts'
import PrescriptionDocuments from '../components/prescription-detail/PrescriptionDocuments'
import PrescriptionEditForm from '../components/prescription-detail/PrescriptionEditForm'
import PrescriptionHeader from '../components/prescription-detail/PrescriptionHeader'
import PrescriptionHistory from '../components/prescription-detail/PrescriptionHistory'
import PrescriptionOverview from '../components/prescription-detail/PrescriptionOverview'
import PrescriptionQuickStats from '../components/prescription-detail/PrescriptionQuickStats'
import PrescriptionSummary from '../components/prescription-detail/PrescriptionSummary'
import PrescriptionTabs from '../components/prescription-detail/PrescriptionTabs'
import { prescriptionsApi } from '../services/api'
import { formInputClass, paddedCardClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış ilaç seçimi', 'Doz değişikliği', 'Hasta intoleransı', 'Çift reçete', 'Diğer']

export default function PrescriptionDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [prescription, setPrescription] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const editMode = searchParams.get('duzenle') === 'true'

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setPrescription(await prescriptionsApi.detail(id))
    } catch (requestError) {
      setError(requestError.message)
      setPrescription(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  if (isLoading) {
    return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Reçete yükleniyor...</section>
  }

  if (error || !prescription) {
    return <EmptyState />
  }

  const savePrescription = async (nextPrescription) => {
    const saved = await prescriptionsApi.update(id, nextPrescription)
    setPrescription(saved)
    setSearchParams({})
  }

  const cancelPrescription = async () => {
    const updated = await prescriptionsApi.status(id, { status: 'İptal', reason, note })
    setPrescription((current) => ({ ...current, ...updated, status: 'İptal', cancellationReason: reason === 'Diğer' ? note : reason }))
    setCancelOpen(false)
    await load()
  }

  const isReasonInvalid = !reason || (reason === 'Diğer' && !note.trim())

  const renderTab = () => {
    if (activeTab === 'instructions') return <InstructionsTab prescription={prescription} />
    if (activeTab === 'history') return <PrescriptionHistory history={prescription.history} />
    if (activeTab === 'documents') return <PrescriptionDocuments documents={prescription.documents} />
    return <PrescriptionOverview prescription={prescription} />
  }

  return (
    <>
      <PrescriptionHeader
        prescription={prescription}
        editMode={editMode}
        onEdit={() => setSearchParams({ duzenle: 'true' })}
        onCancelPrescription={() => setCancelOpen(true)}
      />
      {editMode ? (
        <PrescriptionEditForm
          prescription={prescription}
          onCancel={() => setSearchParams({})}
          onSave={savePrescription}
        />
      ) : (
        <>
          <PrescriptionAlerts alerts={prescription.alerts || []} />
          <PrescriptionSummary prescription={prescription} />
          <PrescriptionQuickStats prescription={prescription} />
          <MedicineList medicines={prescription.medicines} />
          <PrescriptionTabs activeTab={activeTab} onChange={setActiveTab} />
          {renderTab()}
        </>
      )}
      <ConfirmActionModal
        confirmLabel="Onayla"
        description="Reçete durumu iptal edildi olarak güncellenecek."
        isConfirmDisabled={isReasonInvalid}
        isOpen={cancelOpen}
        title="Reçete iptal edilsin mi?"
        variant="warning"
        onCancel={() => setCancelOpen(false)}
        onConfirm={cancelPrescription}
      >
        <div className="grid gap-3">
          <label className="text-xs font-semibold text-gray-600">İptal nedeni
            <select className={`${formInputClass} mt-1.5`} value={reason} onChange={(event) => setReason(event.target.value)}>
              <option value="">Neden seçin</option>
              {cancelReasons.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">Açıklama
            <textarea className={`${formInputClass} mt-1.5 min-h-20 resize-y`} value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
        </div>
      </ConfirmActionModal>
    </>
  )
}
