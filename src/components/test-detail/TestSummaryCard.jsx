import { FlaskConical } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'
import PatientInfoCard from './PatientInfoCard'
import TestStatusBadge from './TestStatusBadge'

const Info = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs font-semibold text-gray-700">{value || '-'}</dd>
  </div>
)

export default function TestSummaryCard({ test }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-5 max-[980px]:grid-cols-1">
      <PatientInfoCard test={test} />
      <section className={`${paddedCardClass} min-w-0`}>
        <div className="mb-4 flex items-center gap-2">
          <FlaskConical className="text-orange-500" size={18} />
          <div>
            <h2 className="text-sm font-bold text-gray-900">Tetkik Bilgileri</h2>
            <p className="mt-1 text-xs text-gray-500">{test.visitId}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 max-[430px]:grid-cols-1">
          <Info label="Tetkik adı" value={test.type} />
          <Info label="Tetkik numarası" value={test.number} />
          <Info label="Kategori" value={test.category} />
          <Info label="Tetkik tarihi" value={test.testDate} />
          <Info label="İstenme nedeni" value={test.requestReason} />
          <Info label="Numune türü" value={test.sampleType} />
          <Info label="Birim" value={test.unit} />
          <Info label="Doktor" value={test.doctor} />
          <Info label="Muayene dosya no" value={test.visitId} />
          <Info label="Sonuç durumu" value={<TestStatusBadge status={test.status} />} />
        </dl>
      </section>
    </div>
  )
}
