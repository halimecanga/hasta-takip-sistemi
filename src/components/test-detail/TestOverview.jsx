import { ClipboardCheck } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'
import { boolText } from './testUtils'
import TestStatusBadge from './TestStatusBadge'

const Info = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs leading-5 text-gray-700">{value || '-'}</dd>
  </div>
)

export default function TestOverview({ test }) {
  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <ClipboardCheck className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Sonuç Özeti</h2>
      </div>
      <dl className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        <Info label="Tetkik türü" value={test.type} />
        <Info label="Kategori" value={test.category} />
        <Info label="İstenme nedeni" value={test.requestReason} />
        <Info label="Tetkik tarihi" value={test.testDate} />
        <Info label="Numune tarihi" value={test.sampleDateTime} />
        <Info label="Sonuç tarihi" value={test.resultDateTime} />
        <Info label="Sonuç durumu" value={<TestStatusBadge status={test.status} />} />
        <Info label="Doktor" value={test.doctor} />
        <Info label="Muayene dosyası" value={test.visitId} />
        <Info label="Kontrol tarihi" value={test.controlDate} />
        <Info label="Hasta bilgilendirildi" value={boolText(test.patientInformed)} />
        {test.actionReason && <Info label="İptal / Geçersiz Nedeni" value={test.actionReason} />}
        <div className="col-span-full rounded-[10px] bg-orange-50 p-3 max-[640px]:col-auto"><dt className="text-[10px] font-bold uppercase tracking-[.25px] text-orange-600">Sonuç özeti</dt><dd className="mt-1 text-xs leading-5 text-orange-700">{test.summary}</dd></div>
      </dl>
    </section>
  )
}
