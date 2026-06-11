import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import DoctorEvaluation from '../components/test-detail/DoctorEvaluation'
import EmptyState from '../components/test-detail/EmptyState'
import ImagingFindings from '../components/test-detail/ImagingFindings'
import LaboratoryResults from '../components/test-detail/LaboratoryResults'
import TestDetailHeader from '../components/test-detail/TestDetailHeader'
import TestDocuments from '../components/test-detail/TestDocuments'
import TestHistory from '../components/test-detail/TestHistory'
import TestOverview from '../components/test-detail/TestOverview'
import TestQuickStats from '../components/test-detail/TestQuickStats'
import TestStatusPanel from '../components/test-detail/TestStatusPanel'
import TestSummaryCard from '../components/test-detail/TestSummaryCard'
import TestTabs from '../components/test-detail/TestTabs'
import { isLaboratoryTest } from '../components/test-detail/testUtils'
import { testDetails } from '../data/testDetailsMock'
import { formInputClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış hasta', 'Yanlış tetkik', 'Numune sorunu', 'Çift kayıt', 'Teknik hata', 'Diğer']

export default function TestDetail() {
  const { id } = useParams()
  const test = testDetails.find((item) => item.id === id)
  const [testState, setTestState] = useState(test)
  const [activeTab, setActiveTab] = useState('overview')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    setTestState(test)
    setActiveTab('overview')
    setCancelModalOpen(false)
    setReason('')
    setNote('')
  }, [test])

  if (!test || !testState) return <EmptyState />

  const closeCancelModal = () => {
    setCancelModalOpen(false)
    setReason('')
    setNote('')
  }

  const updateTestStatus = () => {
    const actionReason = reason === 'Diğer' ? note.trim() : reason
    setTestState((current) => ({
      ...current,
      status: 'İptal Edildi',
      actionReason,
      history: [
        { id: `HIS-CANCEL-${current.id}`, date: '05 Haziran 2026', time: '12:00', action: 'Tetkik durumu güncellendi', description: actionReason, actor: 'Dr. Cumhur Kesemenli' },
        ...current.history,
      ],
    }))
    setActiveTab('overview')
    closeCancelModal()
  }

  const isReasonInvalid = !reason || (reason === 'Diğer' && !note.trim())

  const renderTabContent = () => {
    if (activeTab === 'results') return isLaboratoryTest(testState) ? <LaboratoryResults test={testState} /> : <ImagingFindings test={testState} />
    if (activeTab === 'evaluation') return <DoctorEvaluation test={testState} />
    if (activeTab === 'history') return <TestHistory history={testState.history} />
    if (activeTab === 'documents') return <TestDocuments documents={testState.documents} />
    return <TestOverview test={testState} />
  }

  return (
    <>
      <TestDetailHeader test={testState} onCancelTest={() => setCancelModalOpen(true)} />
      <TestSummaryCard test={testState} />
      <TestQuickStats test={testState} />
      <TestStatusPanel test={testState} />
      <TestTabs activeTab={activeTab} test={testState} onChange={setActiveTab} />
      {renderTabContent()}
      <ConfirmActionModal
        confirmLabel="Onayla"
        description="Sonuç parametreleri, bulgular ve belgeler korunacak; yalnızca durum ve neden güncellenecektir."
        isConfirmDisabled={isReasonInvalid}
        isOpen={cancelModalOpen}
        title="Tetkik durumu güncellensin mi?"
        variant="warning"
        onCancel={closeCancelModal}
        onConfirm={updateTestStatus}
      >
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
      </ConfirmActionModal>
    </>
  )
}
