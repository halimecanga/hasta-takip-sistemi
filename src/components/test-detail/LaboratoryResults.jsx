import { FlaskConical } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'
import { parameterStatusClasses } from './testUtils'

export default function LaboratoryResults({ test }) {
  if (test.status === 'Bekliyor') {
    return <section className={paddedCardClass}><div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu tetkikin sonucu henüz hazır değil.</div></section>
  }

  if (test.parameters.length === 0) {
    return <section className={paddedCardClass}><div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu tetkik için parametre sonucu bulunmuyor.</div></section>
  }

  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <FlaskConical className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Laboratuvar Sonuçları</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50 text-[10px] uppercase text-gray-500">
              {['Parametre', 'Sonuç', 'Birim', 'Referans Aralığı', 'Durum'].map((head) => <th className="px-3 py-3 font-bold" key={head}>{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {test.parameters.map((parameter) => (
              <tr className={`border-b border-gray-50 last:border-0 hover:bg-orange-50/40 ${parameter.status !== 'Normal' ? 'bg-orange-50/30' : ''}`} key={parameter.name}>
                <td className="px-3 py-3 font-semibold text-gray-800">{parameter.name}</td>
                <td className="px-3 py-3 text-gray-700">{parameter.result}</td>
                <td className="px-3 py-3 text-gray-600">{parameter.unit}</td>
                <td className="px-3 py-3 text-gray-600">{parameter.reference}</td>
                <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2 py-[5px] text-[9px] font-bold ${parameterStatusClasses[parameter.status] || 'bg-gray-100 text-gray-600'}`}>{parameter.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
