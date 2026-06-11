import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
import { useStaff } from '../context/StaffContext'
import { activityLogs } from '../data/activityLogsMock'

export default function StaffDetail() {
  const { id } = useParams()
  const { getStaffById, updateStaff } = useStaff()
  const staffRecord = getStaffById(id)
  const [activeTab, setActiveTab] = useState('general')
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    setActiveTab('general')
    setEditMode(false)
  }, [id])

  if (!staffRecord) return <EmptyState />

  const saveStaff = (nextStaff) => {
    updateStaff(nextStaff)
    setEditMode(false)
    setActiveTab('general')
  }

  const staffActivityLogs = activityLogs.filter((log) => log.staffId === staffRecord.id)

  const renderTabContent = () => {
    if (activeTab === 'schedule') return <StaffSchedule staff={staffRecord} />
    if (activeTab === 'leaves') return <StaffLeaves staff={staffRecord} />
    if (activeTab === 'activities') return <StaffActivities activities={staffActivityLogs} staff={staffRecord} />
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
      <StaffHeader staff={staffRecord} editMode={editMode} onEdit={() => setEditMode(true)} />
      <StaffSummaryCard staff={staffRecord} />
      <StaffQuickStats stats={staffRecord.quickStats} />
      {editMode ? (
        <StaffEditForm staff={staffRecord} onCancel={() => setEditMode(false)} onSave={saveStaff} />
      ) : (
        <>
          <StaffTabs activeTab={activeTab} onChange={setActiveTab} />
          {renderTabContent()}
        </>
      )}
    </>
  )
}
