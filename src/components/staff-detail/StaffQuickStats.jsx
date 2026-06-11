import { Activity, BarChart3, CalendarCheck, ClipboardCheck } from 'lucide-react'
import { cardClass } from '../../styles/uiClasses'

const icons = [BarChart3, ClipboardCheck, CalendarCheck, Activity]

export default function StaffQuickStats({ stats }) {
  return (
    <section className="mb-5 grid grid-cols-4 gap-[18px] max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3" aria-label="Personel hızlı istatistikleri">
      {stats.map((stat, index) => {
        const Icon = icons[index] || Activity
        return (
          <article className={`${cardClass} p-4`} key={stat.label}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-orange-50 text-orange-600">
                <Icon size={19} />
              </div>
              <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{stat.meta}</span>
            </div>
            <p className="text-[11px] font-semibold uppercase text-gray-400">{stat.label}</p>
            <strong className="mt-1 block text-xl font-bold text-gray-900">{stat.value}</strong>
          </article>
        )
      })}
    </section>
  )
}
