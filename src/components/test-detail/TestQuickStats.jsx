import { BarChart3, CalendarDays, CheckCircle2, Clock3, Image, Timer, TriangleAlert } from 'lucide-react'
import { cardClass } from '../../styles/uiClasses'
import { isLaboratoryTest } from './testUtils'
import TestStatusBadge from './TestStatusBadge'

export default function TestQuickStats({ test }) {
  const abnormalCount = test.parameters.filter((item) => item.status !== 'Normal').length
  const criticalCount = test.parameters.filter((item) => item.status === 'Kritik').length
  const normalCount = test.parameters.filter((item) => item.status === 'Normal').length
  const stats = isLaboratoryTest(test)
    ? [
        { label: 'Tetkik Durumu', value: test.status, meta: 'Güncel', icon: CheckCircle2, badge: true },
        { label: 'Toplam Parametre', value: test.parameters.length || '-', meta: 'Parametre', icon: BarChart3 },
        { label: 'Normal Değer', value: normalCount || '-', meta: 'Normal', icon: CheckCircle2 },
        { label: 'Referans Dışı', value: abnormalCount || '-', meta: 'Dış değer', icon: TriangleAlert },
        { label: 'Sonuç Tarihi', value: test.resultDateTime, meta: criticalCount ? `${criticalCount} kritik` : 'Kayıt', icon: CalendarDays },
      ]
    : [
        { label: 'Rapor Durumu', value: test.status, meta: 'Güncel', icon: CheckCircle2, badge: true },
        { label: 'Teknik Kalite', value: test.metrics?.technicalQuality || '-', meta: 'Kalite', icon: Image },
        { label: 'Görüntü / Çıktı', value: test.metrics?.outputCount || '-', meta: 'Adet', icon: BarChart3 },
        { label: 'İnceleme Süresi', value: test.metrics?.reviewDuration || '-', meta: 'Süre', icon: Timer },
        { label: 'Kontrol Tarihi', value: test.controlDate, meta: 'Plan', icon: Clock3 },
      ]

  return (
    <section className="mb-5 grid grid-cols-5 gap-[18px] max-[1180px]:grid-cols-3 max-[760px]:grid-cols-2 max-[430px]:grid-cols-1 max-[640px]:gap-3" aria-label="Tetkik hızlı bilgileri">
      {stats.map(({ label, value, meta, icon: Icon, badge }) => (
        <article className={`${cardClass} p-4`} key={label}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-orange-50 text-orange-600"><Icon size={19} /></div>
            <span className="max-w-[120px] truncate rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{meta}</span>
          </div>
          <p className="text-[11px] font-semibold uppercase text-gray-400">{label}</p>
          <div className="mt-1">{badge ? <TestStatusBadge status={value} /> : <strong className="block text-lg font-bold text-gray-900">{value}</strong>}</div>
        </article>
      ))}
    </section>
  )
}
