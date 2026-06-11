import { CalendarDays, Clock, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { paddedCardClass } from '../../styles/uiClasses'

const infoItems = [
  { key: 'phone', label: 'Telefon', icon: Phone },
  { key: 'email', label: 'E-posta', icon: Mail },
  { key: 'hireDate', label: 'İşe Başlama', icon: CalendarDays },
  { key: 'workType', label: 'Çalışma Şekli', icon: UserRound },
]

export default function StaffSummaryCard({ staff }) {
  return (
    <section className={`${paddedCardClass} mb-5`}>
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4 max-[760px]:grid-cols-[auto_1fr] max-[430px]:grid-cols-1">
        <div className="grid h-20 w-20 place-items-center rounded-[18px] bg-gradient-to-br from-orange-300 to-orange-600 text-xl font-bold text-white">
          {staff.initials}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{staff.name}</h2>
            <StatusBadge status={staff.status} />
          </div>
          <p className="mt-1 text-sm font-semibold text-orange-600">{staff.role}</p>
          <p className="mt-1 text-xs text-gray-500">{staff.department}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 max-[980px]:grid-cols-1">
            <span className="inline-flex min-w-0 items-center gap-2 text-xs text-gray-500">
              <Clock className="shrink-0 text-orange-500" size={16} />
              {staff.workDays}, {staff.workHours.start} - {staff.workHours.end}
            </span>
            <span className="inline-flex min-w-0 items-center gap-2 text-xs text-gray-500">
              <MapPin className="shrink-0 text-orange-500" size={16} />
              <span className="truncate">{staff.address}</span>
            </span>
          </div>
        </div>
        <dl className="grid min-w-[260px] grid-cols-1 gap-2 max-[760px]:col-span-full max-[760px]:min-w-0 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1">
          {infoItems.map(({ key, label, icon: Icon }) => (
            <div className="flex items-center gap-2 rounded-[12px] bg-gray-50 p-3" key={key}>
              <Icon className="shrink-0 text-orange-500" size={17} />
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase text-gray-400">{label}</dt>
                <dd className="truncate text-xs font-semibold text-gray-700">{staff[key]}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
