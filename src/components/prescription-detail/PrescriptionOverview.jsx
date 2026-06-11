import { ClipboardCheck } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { paddedCardClass } from '../../styles/uiClasses'

const Info = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs leading-5 text-gray-700">{value || '-'}</dd>
  </div>
)

export default function PrescriptionOverview({ prescription }) {
  const longestDuration = prescription.medicines.map((medicine) => medicine.duration).join(', ')

  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <ClipboardCheck className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Klinik Özet</h2>
      </div>
      <dl className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        <Info label="Hasta" value={`${prescription.patientName} (${prescription.patientNo})`} />
        <Info label="Muayene Dosyası" value={prescription.visitId} />
        <Info label="Tanı" value={prescription.diagnosis} />
        <Info label="İlaç Sayısı" value={`${prescription.medicines.length} kalem`} />
        <Info label="Kullanım Süresi" value={longestDuration} />
        <Info label="Kontrol Tarihi" value={prescription.controlDate} />
        <Info label="Başvuru Şikâyeti" value={prescription.complaint} />
        <Info label="Tedavi Amacı" value={prescription.treatmentGoal} />
        <Info label="Reçete Durumu" value={<StatusBadge status={prescription.status} />} />
        {prescription.cancellationReason && <Info label="İptal / Geçersiz Nedeni" value={prescription.cancellationReason} />}
        <div className="col-span-full rounded-[10px] bg-orange-50 p-3 max-[640px]:col-auto">
          <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-orange-600">Doktor Notu</dt>
          <dd className="mt-1 text-xs leading-5 text-orange-700">{prescription.doctorNote}</dd>
        </div>
      </dl>
    </section>
  )
}
