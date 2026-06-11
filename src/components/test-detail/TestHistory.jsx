import { History } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

export default function TestHistory({ history }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <History className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Tetkik Geçmişi</h2>
      </div>
      <div className="space-y-3">
        {history.map((item) => (
          <article className="rounded-[12px] border border-gray-100 p-3 transition hover:bg-orange-50/40" key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900">{item.action}</h3>
              <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{item.date} / {item.time}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-500">{item.description}</p>
            <p className="mt-2 text-[10px] font-semibold text-gray-400">İşlemi yapan: {item.actor}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
