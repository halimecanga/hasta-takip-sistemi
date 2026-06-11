import { CalendarCheck, CircleDollarSign, FileText, Pill, Receipt, WalletCards } from 'lucide-react'
import { cardClass } from '../../styles/uiClasses'

export default function PatientQuickStats({ patient, visits }) {
  const latest = visits[0]
  const activePrescription = visits.some((visit) => visit.prescription?.status === 'Aktif') ? 'Var' : 'Yok'
  const totalPayment = visits.reduce((sum, visit) => sum + Number(String(visit.payment?.total || '0').replace(/[^\d]/g, '')), 0)
  const remaining = visits.reduce((sum, visit) => sum + Number(String(visit.payment?.remaining || '0').replace(/[^\d]/g, '')), 0)
  const stats = [
    { label: 'Son Geliş', value: latest?.date || '-', icon: CalendarCheck },
    { label: 'Toplam Muayene', value: visits.length, icon: FileText },
    { label: 'Aktif Reçete', value: activePrescription, icon: Pill },
    { label: 'Toplam Ödeme', value: `₺${totalPayment.toLocaleString('tr-TR')}`, icon: CircleDollarSign },
    { label: 'Kalan Borç', value: `₺${remaining.toLocaleString('tr-TR')}`, icon: WalletCards },
    { label: 'Yaklaşan Kontrol', value: patient.nextControl || '-', icon: Receipt },
  ]

  return (
    <div className="mb-5 grid grid-cols-6 gap-3 max-[1180px]:grid-cols-3 max-[640px]:grid-cols-2 max-[375px]:grid-cols-1">
      {stats.map(({ label, value, icon: Icon }) => (
        <div className={`${cardClass} flex min-w-0 items-center gap-3 p-3`} key={label}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-orange-50 text-orange-600"><Icon size={18} /></div>
          <div className="min-w-0">
            <span className="block truncate text-[10px] font-semibold text-gray-500">{label}</span>
            <strong className="mt-1 block truncate text-xs text-gray-900">{value}</strong>
          </div>
        </div>
      ))}
    </div>
  )
}
