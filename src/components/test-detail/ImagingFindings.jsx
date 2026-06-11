import { Image } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'

export default function ImagingFindings({ test }) {
  if (test.status === 'Bekliyor') {
    return <section className={paddedCardClass}><div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Bu tetkikin sonucu henüz hazır değil.</div></section>
  }

  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <Image className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Bulgular</h2>
      </div>
      <dl className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
        {test.findings.map((finding) => (
          <div className="rounded-[12px] bg-gray-50 p-3" key={finding.label}>
            <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{finding.label}</dt>
            <dd className="mt-1 text-xs leading-5 text-gray-700">{finding.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
