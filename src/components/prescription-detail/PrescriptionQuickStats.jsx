import { CalendarDays, Clock3, Pill, ShieldCheck, TimerReset } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import { cardClass } from '../../styles/uiClasses'

export default function PrescriptionQuickStats({ prescription }) {
  const stats = [
    { label: 'Toplam İlaç', value: `${prescription.medicines.length}`, meta: 'Kalem', icon: Pill },
    { label: 'Reçete Durumu', value: prescription.status, meta: 'Güncel', icon: ShieldCheck, badge: true },
    { label: 'Reçete Tarihi', value: prescription.prescriptionDate, meta: 'Oluşturma', icon: CalendarDays },
    { label: 'Kontrol Tarihi', value: prescription.controlDate, meta: 'Plan', icon: Clock3 },
    { label: 'Kalan Gün', value: prescription.status === 'Süresi Doldu' ? 'Süresi Doldu' : prescription.remainingDays, meta: 'Takip', icon: TimerReset },
  ]

  return (
    <section className="mb-5 grid grid-cols-5 gap-[18px] max-[1180px]:grid-cols-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1 max-[640px]:gap-3" aria-label="Reçete hızlı bilgileri">
      {stats.map(({ label, value, meta, icon: Icon, badge }) => (
        <article className={`${cardClass} p-4`} key={label}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-orange-50 text-orange-600"><Icon size={19} /></div>
            <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{meta}</span>
          </div>
          <p className="text-[11px] font-semibold uppercase text-gray-400">{label}</p>
          <div className="mt-1">{badge ? <StatusBadge status={value} /> : <strong className="block text-lg font-bold text-gray-900">{value}</strong>}</div>
        </article>
      ))}
    </section>
  )
}
