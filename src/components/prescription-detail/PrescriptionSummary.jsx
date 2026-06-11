import { ClipboardList } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { paddedCardClass } from '../../styles/uiClasses'
import PatientInfoCard from './PatientInfoCard'

const Info = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs font-semibold text-gray-700">{value || '-'}</dd>
  </div>
)

export default function PrescriptionSummary({ prescription }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-5 max-[980px]:grid-cols-1">
      <PatientInfoCard prescription={prescription} />
      <section className={`${paddedCardClass} min-w-0`}>
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="text-orange-500" size={18} />
          <div>
            <h2 className="text-sm font-bold text-gray-900">Reçete Bilgileri</h2>
            <p className="mt-1 text-xs text-gray-500">{prescription.visitId}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 max-[430px]:grid-cols-1">
          <Info label="Reçete No" value={prescription.number} />
          <Info label="Reçete Tarihi" value={prescription.prescriptionDate} />
          <Info label="Muayene Tarihi" value={prescription.examinationDate} />
          <Info label="Muayene Dosya No" value={prescription.visitId} />
          <Info label="Doktor" value={prescription.doctor} />
          <Info label="Tanı" value={prescription.diagnosis} />
          <Info label="Kontrol Tarihi" value={prescription.controlDate} />
          <Info label="Reçete Durumu" value={<StatusBadge status={prescription.status} />} />
        </dl>
      </section>
    </div>
  )
}
