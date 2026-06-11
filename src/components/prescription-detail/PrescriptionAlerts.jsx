import { AlertTriangle, Info } from 'lucide-react'

const toneClasses = {
  critical: 'border-red-100 bg-red-50 text-red-700',
  warning: 'border-orange-100 bg-orange-50 text-orange-700',
  info: 'border-gray-100 bg-gray-50 text-gray-600',
}

export default function PrescriptionAlerts({ alerts }) {
  if (!alerts.length) return null

  return (
    <section className="mb-5 grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1" aria-label="Hasta uyarıları">
      {alerts.map((alert) => {
        const Icon = alert.tone === 'info' ? Info : AlertTriangle
        return (
          <article className={`rounded-[12px] border p-3 ${toneClasses[alert.tone] || toneClasses.info}`} key={alert.id}>
            <div className="mb-2 flex items-center gap-2">
              <Icon size={17} />
              <h2 className="text-xs font-bold">{alert.title}</h2>
            </div>
            <p className="text-xs leading-5">{alert.description}</p>
          </article>
        )
      })}
    </section>
  )
}
