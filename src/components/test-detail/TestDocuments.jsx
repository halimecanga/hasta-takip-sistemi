import { Download, Eye, FileText } from 'lucide-react'
import { paddedCardClass, textButtonClass } from '../../styles/uiClasses'

export default function TestDocuments({ documents }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Belgeler</h2>
      </div>
      {documents.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu tetkike bağlı belge bulunmuyor.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50 text-[10px] uppercase text-gray-500">
                {['Dosya adı', 'Belge türü', 'Boyut', 'Tarih', 'İşlem'].map((head) => <th className={`px-3 py-3 font-bold ${head === 'İşlem' ? 'text-right' : ''}`} key={head}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40" key={document.id}>
                  <td className="max-w-[240px] truncate px-3 py-3 font-semibold text-gray-800">{document.name}</td>
                  <td className="px-3 py-3 text-gray-600">{document.type}</td>
                  <td className="px-3 py-3 text-gray-600">{document.size}</td>
                  <td className="px-3 py-3 text-gray-600">{document.date}</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <button aria-label={`${document.name} görüntüle`} className={`${textButtonClass} h-8 w-8 p-0`} title="Görüntüle" type="button"><Eye size={15} /></button>
                      <button aria-label={`${document.name} indir`} className={`${textButtonClass} h-8 w-8 p-0`} title="İndir" type="button"><Download size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
