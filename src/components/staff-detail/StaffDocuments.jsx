import { Download, Eye, FileText } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { paddedCardClass, textButtonClass } from '../../styles/uiClasses'

export default function StaffDocuments({ staff }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Belgeler</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400">
              <th className="py-3 pr-3 font-bold">Belge</th>
              <th className="px-3 py-3 font-bold">Tür</th>
              <th className="px-3 py-3 font-bold">Tarih</th>
              <th className="px-3 py-3 font-bold">Durum</th>
              <th className="py-3 pl-3 text-right font-bold">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {staff.documents.map((document) => (
              <tr className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40" key={document.id}>
                <td className="py-3 pr-3 font-semibold text-gray-800">{document.name}</td>
                <td className="px-3 py-3 text-gray-600">{document.type}</td>
                <td className="px-3 py-3 text-gray-600">{document.date}</td>
                <td className="px-3 py-3"><StatusBadge status={document.status} /></td>
                <td className="py-3 pl-3">
                  <div className="flex justify-end gap-1">
                    <button aria-label={`${document.name} belgesini görüntüle`} className={`${textButtonClass} h-8 w-8 p-0`} title="Görüntüle" type="button">
                      <Eye size={15} />
                    </button>
                    <button aria-label={`${document.name} belgesini indir`} className={`${textButtonClass} h-8 w-8 p-0`} title="İndir" type="button">
                      <Download size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
