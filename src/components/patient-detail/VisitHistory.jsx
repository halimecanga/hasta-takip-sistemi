import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatusBadge from '../StatusBadge'
import { formInputClass, paddedCardClass } from '../../styles/uiClasses'

const matchesVisit = (visit, query) => {
  const text = `${visit.id} ${visit.type} ${visit.complaint}`.toLocaleLowerCase('tr-TR')
  return text.includes(query.toLocaleLowerCase('tr-TR'))
}

export default function VisitHistory({ visits, selectedVisitId, onSelect }) {
  const [query, setQuery] = useState('')
  const filteredVisits = useMemo(() => visits.filter((visit) => matchesVisit(visit, query)), [query, visits])

  return (
    <aside className={`${paddedCardClass} self-start`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Hasta Geçmişi</h2>
          <p className="mt-1 text-[11px] text-gray-500">{visits.length} kayıt</p>
        </div>
      </div>
      <label className="mb-3 flex items-center gap-2 rounded-[11px] border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400 focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_#fff7ed]">
        <Search size={16} />
        <input aria-label="Hasta geçmişinde ara" className="w-full border-0 bg-transparent text-xs text-gray-900 outline-0 placeholder:text-gray-400" value={query} placeholder="Dosya, tür veya şikayet ara..." onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
        {filteredVisits.length === 0 && <div className="rounded-[11px] border border-dashed border-gray-200 p-4 text-center text-xs text-gray-500">Aramanıza uygun muayene dosyası bulunamadı.</div>}
        {filteredVisits.map((visit) => {
          const selected = visit.id === selectedVisitId
          return (
            <button
              className={`w-full rounded-[12px] border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 ${selected ? 'border-orange-300 bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-[#fffaf5]'}`}
              key={visit.id}
              type="button"
              onClick={() => onSelect(visit.id)}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <strong className="block text-xs text-gray-900">{visit.date} - {visit.time}</strong>
                  <span className="mt-1 block text-[11px] font-semibold text-orange-700">{visit.type}</span>
                </div>
                <StatusBadge status={visit.status} />
              </div>
              <p className="line-clamp-2 text-[11px] text-gray-600">{visit.complaint}</p>
              <span className="mt-2 block text-[10px] font-bold text-gray-400">{visit.id}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
