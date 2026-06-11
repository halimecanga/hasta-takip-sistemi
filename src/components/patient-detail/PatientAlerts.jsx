import { AlertTriangle, CalendarClock, HeartPulse, Pill } from 'lucide-react'

const alertClasses = {
  critical: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-orange-200 bg-orange-50 text-orange-700',
  info: 'border-gray-200 bg-gray-50 text-gray-700',
}

export default function PatientAlerts({ patient }) {
  const alerts = [
    patient.allergy !== 'Yok' && { icon: AlertTriangle, tone: 'critical', label: `Alerji: ${patient.allergy}` },
    patient.chronicDisease !== 'Yok' && { icon: HeartPulse, tone: 'warning', label: `Kronik Durum: ${patient.chronicDisease}` },
    patient.paymentStatus !== 'Borcu Yok' && { icon: AlertTriangle, tone: 'critical', label: patient.paymentStatus },
    patient.nextControl && patient.nextControl !== 'Gerekli değil' && patient.nextControl !== 'Planlanmadı' && { icon: CalendarClock, tone: 'info', label: `Yaklaşan Kontrol: ${patient.nextControl}` },
    patient.regularMedicine !== 'Yok' && { icon: Pill, tone: 'info', label: `Düzenli İlaç: ${patient.regularMedicine}` },
  ].filter(Boolean)

  if (alerts.length === 0) return null

  return (
    <div className="mb-5 grid grid-cols-2 gap-2.5 max-[760px]:grid-cols-1">
      {alerts.map(({ icon: Icon, tone, label }) => (
        <div className={`flex items-center gap-2 rounded-[10px] border px-3 py-2 text-xs font-semibold ${alertClasses[tone]}`} key={label}>
          <Icon size={16} /><span>{label}</span>
        </div>
      ))}
    </div>
  )
}
