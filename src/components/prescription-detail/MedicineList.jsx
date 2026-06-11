import { Pill } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

const headers = ['İlaç adı', 'Etken madde', 'Form', 'Doz', 'Sıklık', 'Zaman', 'Süre', 'Miktar', 'Açıklama']

export default function MedicineList({ medicines }) {
  return (
    <section className={`${paddedCardClass} mb-5`}>
      <div className="mb-4 flex items-center gap-2">
        <Pill className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Reçetedeki İlaçlar</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50 text-[10px] uppercase text-gray-500">
              {headers.map((header) => <th className="px-3 py-3 font-bold" key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40" key={medicine.id}>
                <td className="px-3 py-3 font-semibold text-gray-800">{medicine.name}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.activeIngredient}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.form}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.dose}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.frequency}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.time}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.duration}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.quantity}</td>
                <td className="px-3 py-3 text-gray-600">{medicine.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
