import { useEffect, useState } from 'react'
import { BriefcaseBusiness, Mail, Pencil, Phone, Plus, RotateCcw, UserMinus } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConfirmActionModal from '../components/ConfirmActionModal'
import InlineNotification from '../components/InlineNotification'
import PageTitle from '../components/PageTitle'
import RowActionsMenu from '../components/RowActionsMenu'
import StatusBadge from '../components/StatusBadge'
import { staffApi } from '../services/api'
import { cardClass, departmentTagClass, outlineButtonClass, paddedCardClass, primaryButtonClass } from '../styles/uiClasses'

export default function Staff() {
  const location = useLocation()
  const navigate = useNavigate()
  const [staffItems, setStaffItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [notification, setNotification] = useState(null)

  const load = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStaffItems(await staffApi.list())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!location.state?.message) return
    setNotification({ message: location.state.message, tone: 'success' })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const confirmStatusUpdate = async () => {
    try {
      await staffApi.status(pendingAction.person.id, pendingAction.nextStatus)
      setNotification({ message: pendingAction.message, tone: pendingAction.tone })
      setPendingAction(null)
      await load()
    } catch (requestError) {
      setNotification({ message: requestError.message, tone: 'error' })
    }
  }

  const actionsFor = (person) => {
    const profile = { label: 'Profili Görüntüle', tone: 'neutral', to: `/personeller/${person.id}` }
    const edit = { label: 'Düzenle', icon: <Pencil size={15} />, tone: 'neutral', to: `/personeller/${person.id}?duzenle=true` }
    const activate = { label: 'Aktifleştir', icon: <RotateCcw size={15} />, tone: 'success', onSelect: () => setPendingAction({ person, nextStatus: 'Aktif', title: 'Personel aktifleştirilsin mi?', description: 'Personel yeniden aktif duruma alınacaktır.', confirmLabel: 'Aktifleştir', message: 'Personel aktifleştirildi.', tone: 'success', variant: 'neutral' }) }
    const deactivate = { label: 'Pasife Al', icon: <UserMinus size={15} />, tone: 'warning', onSelect: () => setPendingAction({ person, nextStatus: 'Pasif', title: 'Personel pasife alınsın mı?', description: 'Personelin geçmiş işlem ve aktivite kayıtları korunacaktır.', confirmLabel: 'Pasife Al', message: 'Personel pasife alındı.', tone: 'warning', variant: 'warning' }) }
    const leave = { label: 'İşten Ayrıldı Olarak İşaretle', icon: <BriefcaseBusiness size={15} />, tone: 'warning', onSelect: () => setPendingAction({ person, nextStatus: 'İşten Ayrıldı', title: 'Personel işten ayrıldı olarak işaretlensin mi?', description: 'Personelin geçmiş işlem ve aktivite kayıtları korunacaktır.', confirmLabel: 'İşten Ayrıldı İşaretle', message: 'Personel işten ayrıldı olarak işaretlendi.', tone: 'warning', variant: 'warning' }) }

    if (person.status === 'Aktif') return [profile, edit, deactivate, leave]
    if (person.status === 'İzinli' || person.status === 'Raporlu') return [profile, activate, deactivate]
    if (person.status === 'Pasif') return [profile, activate]
    return [profile]
  }

  return (
    <>
      <PageTitle title="Personeller" subtitle="Klinik ekibinizi ve çalışma durumlarını yönetin." action={<Link className={primaryButtonClass} to="/personeller/yeni"><Plus size={18} />Personel Ekle</Link>} />
      <InlineNotification message={notification?.message} tone={notification?.tone} onClose={() => setNotification(null)} />
      {isLoading ? <section className={`${paddedCardClass} py-16 text-center text-sm text-gray-500`}>Personeller yükleniyor...</section> : error ? <section className={`${paddedCardClass} py-16 text-center text-sm text-red-600`}>{error}</section> : (
        <div className="grid grid-cols-4 gap-[18px] max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
          {staffItems.map((person) => (
            <article className={`${cardClass} p-[18px]`} key={person.id}>
              <div className="mb-[15px] flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-gradient-to-br from-orange-300 to-orange-600 text-[13px] font-bold text-white">{person.initials}</div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={person.status} />
                  <RowActionsMenu label={`${person.name} personel işlemleri`} items={actionsFor(person)} />
                </div>
              </div>
              <h3 className="mb-[5px] text-sm">{person.name}</h3>
              <p className="mb-2.5 text-[11px] text-gray-500">{person.role}</p>
              <span className={departmentTagClass}>{person.department}</span>
              <div className="my-[15px] flex flex-col gap-2 border-t border-[#f1f3f5] pt-3.5">
                <span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Phone size={16} />{person.phone}</span>
                <span className="flex items-center gap-[7px] text-[10px] text-gray-500"><Mail size={16} />{person.email}</span>
              </div>
              <Link className={`${outlineButtonClass} w-full`} to={`/personeller/${person.id}`}>Profili Görüntüle</Link>
            </article>
          ))}
        </div>
      )}
      <ConfirmActionModal
        confirmLabel={pendingAction?.confirmLabel}
        description={pendingAction?.description}
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.title}
        variant={pendingAction?.variant}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmStatusUpdate}
      />
    </>
  )
}
