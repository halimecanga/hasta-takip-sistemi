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
import { testsApi } from '../services/api'
import { formInputClass, paddedCardClass } from '../styles/uiClasses'

const cancelReasons = ['Yanlış hasta', 'Yanlış tetkik', 'Numune sorunu', 'Çift kayıt', 'Teknik hata', 'Diğer']

export default function TestDetail() {
  const { id } = useParams()
  const [testState, setTestState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setTestState(await testsApi.detail(id))
    } catch (requestError) {
      setError(requestError.message)
      setTestState(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    setActiveTab('overview')
  }, [id])

  if (isLoading) return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Tetkik yükleniyor...</section>
  if (error || !testState) return <EmptyState />

  const closeCancelModal = () => {
    setCancelModalOpen(false)
    setReason('')
    setNote('')
  }

  const updateTestStatus = async () => {
    const updated = await testsApi.update(testState.id, { status: 'İptal Edildi', reason, note })
    setTestState(updated)
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
        </div>
      </ConfirmActionModal>
    </>
  )
}
