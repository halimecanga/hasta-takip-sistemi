import { CalendarDays } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { paddedCardClass } from '../../styles/uiClasses'

export default function StaffSchedule({ staff }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-orange-500" size={18} />
          <h2 className="text-sm font-bold text-gray-900">Çalışma Düzeni</h2>
        </div>
        <p className="text-xs font-semibold text-gray-500">{staff.workDays} / {staff.workHours.start} - {staff.workHours.end}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
              <th className="py-3 pr-3 font-bold">Gün</th>
              <th className="px-3 py-3 font-bold">Vardiya</th>
              <th className="px-3 py-3 font-bold">Konum</th>
              <th className="py-3 pl-3 font-bold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {staff.schedule.map((item) => (
              <tr className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40" key={item.day}>
                <td className="py-3 pr-3 font-semibold text-gray-800">{item.day}</td>
                <td className="px-3 py-3 text-gray-600">{item.shift}</td>
                <td className="px-3 py-3 text-gray-600">{item.location}</td>
                <td className="py-3 pl-3"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
