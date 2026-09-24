import { Download, Eye, FileText } from 'lucide-react'
import { documentDownloadUrl, documentViewUrl } from '../../services/api'
import { paddedCardClass, textButtonClass } from '../../styles/uiClasses'

export default function PrescriptionDocuments({ documents }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Belgeler</h2>
      </div>
      {documents.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu reçeteye bağlı belge bulunmuyor.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50 text-[10px] uppercase text-gray-500">
                <th className="px-3 py-3 font-bold">Dosya adı</th>
                <th className="px-3 py-3 font-bold">Tür</th>
                <th className="px-3 py-3 font-bold">Boyut</th>
                <th className="px-3 py-3 font-bold">Tarih</th>
                <th className="px-3 py-3 text-right font-bold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40" key={document.id}>
                  <td className="px-3 py-3 font-semibold text-gray-800">{document.name}</td>
                  <td className="px-3 py-3 text-gray-600">{document.type}</td>
                  <td className="px-3 py-3 text-gray-600">{document.size}</td>
                  <td className="px-3 py-3 text-gray-600">{document.date}</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <a aria-label={`${document.name} görüntüle`} className={`${textButtonClass} h-8 w-8 p-0`} href={document.url || documentViewUrl(document.id)} rel="noreferrer" target="_blank" title="Görüntüle"><Eye size={15} /></a>
                      <a aria-label={`${document.name} indir`} className={`${textButtonClass} h-8 w-8 p-0`} href={document.downloadUrl || documentDownloadUrl(document.id)} title="İndir"><Download size={15} /></a>
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
