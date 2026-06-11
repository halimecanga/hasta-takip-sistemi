import { paddedCardClass } from '../../styles/uiClasses'

const maskIdentity = (value) => value ? `${value.slice(0, 3)}******${value.slice(-2)}` : '-'

const Info = ({ label, value }) => (
  <div>
    <span className="block text-[10px] font-semibold uppercase tracking-[.25px] text-gray-400">{label}</span>
    <strong className="mt-1 block text-xs text-gray-800">{value || '-'}</strong>
  </div>
)

export default function PatientSummaryCard({ patient }) {
  const fields = [
    ['Ad Soyad', patient.name],
    ['Hasta No', patient.id],
    ['TC Kimlik No', maskIdentity(patient.identityNumber)],
    ['Doğum Tarihi', patient.birthDate],
    ['Yaş', patient.age],
    ['Cinsiyet', patient.gender],
    ['Telefon', patient.phone],
    ['E-posta', patient.email],
    ['Kan Grubu', patient.bloodType],
    ['Alerji Bilgisi', patient.allergy],
    ['Kronik Hastalık', patient.chronicDisease],
    ['Kayıt Tarihi', patient.registeredAt],
    ['Son Geliş Tarihi', patient.lastVisit],
  ]

  const badges = [
    patient.status,
    patient.allergy !== 'Yok' && 'Alerji Var',
    patient.chronicDisease !== 'Yok' && 'Kronik Hastalık',
    patient.paymentStatus,
  ].filter(Boolean)

  return (
    <section className={`${paddedCardClass} mb-5`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">Hasta Genel Bilgileri</h2>
        <div className="flex flex-wrap gap-1.5">
          {badges.map((badge) => (
            <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700" key={badge}>{badge}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1">
        {fields.map(([label, value]) => <Info key={label} label={label} value={value} />)}
      </div>
    </section>
  )
}
