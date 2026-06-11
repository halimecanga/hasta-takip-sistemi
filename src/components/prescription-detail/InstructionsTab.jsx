import { ListChecks } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

export default function InstructionsTab({ prescription }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <ListChecks className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Kullanım Talimatları</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
        {prescription.medicines.map((medicine) => (
          <article className="rounded-[12px] border border-gray-100 bg-gray-50 p-4" key={medicine.id}>
            <h3 className="text-sm font-bold text-gray-900">{medicine.name}</h3>
            <p className="mt-2 text-xs leading-5 text-gray-600">{medicine.instruction}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 max-[430px]:grid-cols-1">
              <div className="rounded-[10px] bg-white p-2"><dt className="text-[10px] text-gray-400">Sıklık</dt><dd className="text-xs font-semibold text-gray-700">{medicine.frequency}</dd></div>
              <div className="rounded-[10px] bg-white p-2"><dt className="text-[10px] text-gray-400">Süre</dt><dd className="text-xs font-semibold text-gray-700">{medicine.duration}</dd></div>
              <div className="rounded-[10px] bg-white p-2"><dt className="text-[10px] text-gray-400">Saklama</dt><dd className="text-xs font-semibold text-gray-700">{medicine.storage}</dd></div>
              <div className="rounded-[10px] bg-white p-2"><dt className="text-[10px] text-gray-400">Unutulan doz</dt><dd className="text-xs font-semibold text-gray-700">{medicine.missedDose}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-4 rounded-[12px] bg-orange-50 p-4 text-xs leading-5 text-orange-700">
        <strong className="block text-orange-800">Genel uyarı</strong>
        {prescription.generalWarning}
      </div>
    </section>
  )
}
