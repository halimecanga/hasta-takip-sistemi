import { Stethoscope } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'
import { boolText } from './testUtils'

const Info = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs leading-5 text-gray-700">{value || '-'}</dd>
  </div>
)

export default function DoctorEvaluation({ test }) {
  if (test.status === 'Bekliyor') {
    return <section className={paddedCardClass}><div className="rounded-[12px] border border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">Doktor değerlendirmesi henüz mevcut değil.</div></section>
  }

  if (test.status === 'İnceleniyor') {
    return <section className={paddedCardClass}><div className="rounded-[12px] bg-orange-50 p-5 text-xs leading-5 text-orange-700">Sonuçlar Dr. Cumhur Kesemenli tarafından inceleniyor.</div></section>
  }

  const evaluation = test.doctorEvaluation

  return (
    <section className={paddedCardClass}>
      <div className="mb-4 flex items-center gap-2">
        <Stethoscope className="text-orange-500" size={18} />
        <h2 className="text-sm font-bold text-gray-900">Doktor Değerlendirmesi</h2>
      </div>
      <dl className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
        <Info label="Klinik değerlendirme" value={evaluation?.clinicalAssessment} />
        <Info label="Şikayetle ilişki" value={evaluation?.relationToComplaint} />
        <Info label="Önerilen işlem / tedavi" value={evaluation?.recommendedAction} />
        <Info label="Ek tetkik gerekli mi?" value={evaluation?.additionalTestNeeded} />
        <Info label="Kontrol gerekli mi?" value={evaluation?.controlNeeded} />
        <Info label="Kontrol tarihi" value={test.controlDate} />
        <Info label="Hasta bilgilendirildi mi?" value={boolText(test.patientInformed)} />
        <Info label="Doktor" value={test.doctor} />
        <div className="col-span-full rounded-[10px] bg-orange-50 p-3 max-[760px]:col-auto"><dt className="text-[10px] font-bold uppercase tracking-[.25px] text-orange-600">Doktor notu</dt><dd className="mt-1 text-xs leading-5 text-orange-700">{evaluation?.doctorNote}</dd></div>
      </dl>
    </section>
  )
}
