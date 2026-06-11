import { Clock3 } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

const scheduleGroups = ['Sabah', 'Öğle', 'Akşam', 'Gece', 'Aç karnına', 'Tok karnına', 'Yemekten önce', 'Yemekten sonra']

export default function MedicationSchedule({ medicines }) {
  return (
    <section className={`${paddedCardClass} mb-5`}>
      <div className="mb-4 flex items-center gap-2">
        <Clock3 className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Günlük Kullanım Planı</h2>
      </div>
      <div className="grid grid-cols-4 gap-3 max-[1180px]:grid-cols-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1">
        {scheduleGroups.map((group) => {
          const items = medicines.filter((medicine) => medicine.schedule.includes(group))
          return (
            <article className="rounded-[12px] border border-gray-100 bg-gray-50 p-3" key={group}>
              <h3 className="mb-3 text-xs font-bold text-gray-900">{group}</h3>
              {items.length === 0 ? (
                <p className="text-xs text-gray-400">Planlanan ilaç yok.</p>
              ) : (
                <div className="space-y-2">
                  {items.map((medicine) => (
                    <div className="rounded-[10px] bg-white p-2 text-xs text-gray-600 shadow-[0_4px_12px_rgba(17,24,39,.04)]" key={`${group}-${medicine.id}`}>
                      <strong className="block text-gray-800">{medicine.name}</strong>
                      <span className="mt-1 block">{medicine.dose} - {medicine.frequency}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
