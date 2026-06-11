import { CalendarPlus } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { paddedCardClass } from '../../styles/uiClasses'

const summaryItems = [
  ['annual', 'Yıllık Hak'],
  ['used', 'Kullanılan'],
  ['remaining', 'Kalan'],
  ['report', 'Rapor'],
]

export default function StaffLeaves({ staff }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <CalendarPlus className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">İzinler</h2>
      </div>
      <div className="mb-4 grid grid-cols-4 gap-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1">
        {summaryItems.map(([key, label]) => (
          <div className="rounded-[12px] bg-gray-50 p-3" key={key}>
            <p className="text-[10px] font-semibold uppercase text-gray-400">{label}</p>
            <strong className="mt-1 block text-lg text-gray-900">{staff.leaveSummary[key]} gün</strong>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
              <th className="py-3 pr-3 font-bold">İzin Tipi</th>
              <th className="px-3 py-3 font-bold">Tarih Aralığı</th>
              <th className="px-3 py-3 font-bold">Süre</th>
              <th className="py-3 pl-3 font-bold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {staff.leaves.map((leave) => (
              <tr className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40" key={leave.id}>
                <td className="py-3 pr-3 font-semibold text-gray-800">{leave.type}</td>
                <td className="px-3 py-3 text-gray-600">{leave.range}</td>
                <td className="px-3 py-3 text-gray-600">{leave.days}</td>
                <td className="py-3 pl-3"><StatusBadge status={leave.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
