import { ArrowUpRight, Phone, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { outlineButtonClass, paddedCardClass } from '../../styles/uiClasses'

const Info = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs font-semibold text-gray-700">{value || '-'}</dd>
  </div>
)

export default function PatientInfoCard({ test }) {
  return (
    <section className={`${paddedCardClass} min-w-0`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserRound className="text-orange-500" size={18} />
          <div>
            <h2 className="text-sm font-bold text-gray-900">Hasta Bilgileri</h2>
            <p className="mt-1 text-xs text-gray-500">{test.patientName}</p>
          </div>
        </div>
        <Link className={outlineButtonClass} state={{ from: '/tetkikler', fromLabel: 'Tetkikler' }} to={`/hastalar/${test.patientNo}?dosya=${test.visitId}`}>
          <ArrowUpRight size={16} />
          Hasta Detayına Git
        </Link>
      </div>
      <dl className="grid grid-cols-2 gap-3 max-[430px]:grid-cols-1">
        <Info label="Hasta adı" value={test.patientName} />
        <Info label="Hasta no" value={test.patientNo} />
        <Info label="Telefon" value={<span className="inline-flex items-center gap-1.5"><Phone size={14} />{test.patient.phone}</span>} />
        <Info label="Yaş / Cinsiyet" value={`${test.patient.age} / ${test.patient.gender}`} />
        <Info label="Kan grubu" value={test.patient.bloodType} />
        <Info label="Alerji bilgisi" value={test.patient.allergy} />
        <Info label="Kronik hastalık" value={test.patient.chronicDisease} />
        <Info label="Son geliş" value={test.patient.lastVisit} />
      </dl>
    </section>
  )
}
