import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { paddedCardClass, textButtonClass } from '../../styles/uiClasses'

const statusClasses = {
  Başarılı: 'bg-green-50 text-green-700 border-green-100',
  Hata: 'bg-red-50 text-red-700 border-red-100',
  Uyarı: 'bg-orange-50 text-orange-700 border-orange-100',
}

export default function StaffActivities({ staff, activities = [] }) {
  const hasAuditLogs = activities.length > 0

  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <Activity className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Aktiviteler</h2>
      </div>
      <div className="space-y-3">
        {hasAuditLogs ? activities.map((activity) => (
          <article className="rounded-[12px] border border-gray-100 p-3 transition hover:bg-orange-50/40" key={activity.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-gray-900">{activity.action}</h3>
                <p className="mt-1 text-[10px] font-semibold text-gray-500">{activity.page} / {activity.module}</p>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${statusClasses[activity.status] || statusClasses.Başarılı}`}>{activity.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-500">{activity.description}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{activity.date} / {activity.time}</span>
              <Link className={textButtonClass} to={`/islem-kayitlari/${activity.id}`}>Detay</Link>
            </div>
          </article>
        )) : staff.activities.map((activity) => (
          <article className="rounded-[12px] border border-gray-100 p-3 transition hover:bg-orange-50/40" key={activity.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900">{activity.title}</h3>
              <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{activity.date} / {activity.time}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-500">{activity.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
