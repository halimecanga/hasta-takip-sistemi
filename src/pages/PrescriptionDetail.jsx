import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import EmptyState from '../components/prescription-detail/EmptyState'
import InstructionsTab from '../components/prescription-detail/InstructionsTab'
import MedicationSchedule from '../components/prescription-detail/MedicationSchedule'
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
import { prescriptionDetails } from '../data/prescriptionDetailsMock'
import { formInputClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış ilaç seçimi', 'Doz değişikliği', 'Hasta intoleransı', 'Çift reçete', 'Diğer']

export default function PrescriptionDetail() {
  const { id } = useParams()
  const prescriptionRecord = prescriptionDetails.find((prescription) => prescription.id === id)
  const [prescriptionState, setPrescriptionState] = useState(prescriptionRecord)
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelNote, setCancelNote] = useState('')

  useEffect(() => {
    setPrescriptionState(prescriptionRecord)
    setActiveTab('overview')
    setEditMode(false)
    setCancelModalOpen(false)
    setCancelReason('')
    setCancelNote('')
  }, [prescriptionRecord])

  if (!prescriptionRecord || !prescriptionState) return <EmptyState />

  const savePrescription = (nextPrescription) => {
    setPrescriptionState(nextPrescription)
    setEditMode(false)
    setActiveTab('overview')
  }

  const closeCancelModal = () => {
    setCancelModalOpen(false)
    setCancelReason('')
    setCancelNote('')
  }

  const cancelPrescription = () => {
    const cancellationReason = cancelReason === 'Diğer' ? cancelNote.trim() : cancelReason
    setPrescriptionState((current) => ({
      ...current,
      status: 'İptal Edildi',
      cancellationReason,
      history: [
        { id: `HIS-CANCEL-${current.id}`, date: '05 Haziran 2026', time: '12:00', action: 'Reçete iptal edildi', description: cancellationReason, actor: 'Dr. Cumhur Kesemenli' },
        ...current.history,
      ],
    }))
    setActiveTab('overview')
    closeCancelModal()
  }

  const isCancelInvalid = !cancelReason || (cancelReason === 'Diğer' && !cancelNote.trim())

  const renderTabContent = () => {
    if (activeTab === 'instructions') return <InstructionsTab prescription={prescriptionState} />
    if (activeTab === 'history') return <PrescriptionHistory history={prescriptionState.history} />
    if (activeTab === 'documents') return <PrescriptionDocuments documents={prescriptionState.documents} />
    return <PrescriptionOverview prescription={prescriptionState} />
  }

  return (
    <>
      <PrescriptionHeader prescription={prescriptionState} editMode={editMode} onCancelPrescription={() => setCancelModalOpen(true)} onEdit={() => setEditMode(true)} />
      <PrescriptionSummary prescription={prescriptionState} />
      <PrescriptionQuickStats prescription={prescriptionState} />
      <PrescriptionAlerts alerts={prescriptionState.alerts} />
      {editMode ? (
        <PrescriptionEditForm prescription={prescriptionState} onCancel={() => setEditMode(false)} onSave={savePrescription} />
      ) : (
        <>
          <MedicineList medicines={prescriptionState.medicines} />
          <MedicationSchedule medicines={prescriptionState.medicines} />
          <PrescriptionTabs activeTab={activeTab} onChange={setActiveTab} />
          {renderTabContent()}
        </>
      )}
      <ConfirmActionModal
        confirmLabel="Onayla"
        description="Reçete durumu iptal edildi olarak güncellenecek ve iptal nedeni detayda görünecektir."
        isConfirmDisabled={isCancelInvalid}
        isOpen={cancelModalOpen}
        title="Reçete iptal edilsin mi?"
        variant="warning"
        onCancel={closeCancelModal}
        onConfirm={cancelPrescription}
      >
        <div className="grid gap-3">
          <label className="text-xs font-semibold text-gray-600">İptal nedeni
            <select className={`${formInputClass} mt-1.5`} value={cancelReason} onChange={(event) => setCancelReason(event.target.value)}>
              <option value="">Neden seçin</option>
              {cancelReasons.map((reason) => <option key={reason}>{reason}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">Açıklama
            <textarea className={`${formInputClass} mt-1.5 min-h-20 resize-y`} value={cancelNote} onChange={(event) => setCancelNote(event.target.value)} placeholder="İsteğe bağlı açıklama" />
          </label>
          {isCancelInvalid && <p className="text-xs font-semibold text-red-600">{cancelReason === 'Diğer' ? 'Diğer nedeni için açıklama zorunludur.' : 'İptal nedeni zorunludur.'}</p>}
        </div>
      </ConfirmActionModal>
    </>
  )
}
