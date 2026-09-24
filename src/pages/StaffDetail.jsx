import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/staff-detail/EmptyState'
import StaffActivities from '../components/staff-detail/StaffActivities'
import StaffDocuments from '../components/staff-detail/StaffDocuments'
import StaffEditForm from '../components/staff-detail/StaffEditForm'
import StaffGeneralInfo from '../components/staff-detail/StaffGeneralInfo'
import StaffHeader from '../components/staff-detail/StaffHeader'
import StaffLeaves from '../components/staff-detail/StaffLeaves'
import StaffQuickStats from '../components/staff-detail/StaffQuickStats'
import StaffRoleDetails from '../components/staff-detail/StaffRoleDetails'
import StaffSchedule from '../components/staff-detail/StaffSchedule'
import StaffSummaryCard from '../components/staff-detail/StaffSummaryCard'
import StaffTabs from '../components/staff-detail/StaffTabs'
import { logsApi, staffApi } from '../services/api'
import { paddedCardClass } from '../styles/uiClasses'

export default function StaffDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [staffRecord, setStaffRecord] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const editMode = searchParams.get('duzenle') === 'true'

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      const [staff, logs] = await Promise.all([
        staffApi.detail(id),
        logsApi.list({ staff: undefined }).catch(() => []),
      ])
      setStaffRecord(staff)
      setActivityLogs(logs.filter((log) => log.staffId === staff.id))
    } catch (requestError) {
      setError(requestError.message)
      setStaffRecord(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    setActiveTab('general')
  }, [id])

  if (isLoading) return <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Personel yükleniyor...</section>
  if (error || !staffRecord) return <EmptyState />

  const saveStaff = async (nextStaff) => {
    const saved = await staffApi.update(id, nextStaff)
    setStaffRecord(saved)
    setSearchParams({})
    setActiveTab('general')
  }

  const renderTabContent = () => {
    if (activeTab === 'schedule') return <StaffSchedule staff={staffRecord} />
    if (activeTab === 'leaves') return <StaffLeaves staff={staffRecord} />
    if (activeTab === 'activities') return <StaffActivities activities={activityLogs} staff={staffRecord} />
    if (activeTab === 'documents') return <StaffDocuments staff={staffRecord} />

    return (
      <div className="space-y-5">
        <StaffGeneralInfo staff={staffRecord} />
        <StaffRoleDetails roleDetails={staffRecord.roleDetails} />
      </div>
    )
  }

  return (
    <>
      <StaffHeader staff={staffRecord} editMode={editMode} onEdit={() => setSearchParams({ duzenle: 'true' })} />
      <StaffSummaryCard staff={staffRecord} />
      <StaffQuickStats stats={staffRecord.quickStats} />
      {editMode ? (
        <StaffEditForm staff={staffRecord} onCancel={() => setSearchParams({})} onSave={saveStaff} />
      ) : (
        <>
          <StaffTabs activeTab={activeTab} onChange={setActiveTab} />
          {renderTabContent()}
        </>
      )}
    </>
  )
}
