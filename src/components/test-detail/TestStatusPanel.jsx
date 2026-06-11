import { AlertCircle, CheckCircle2, Clock3, FileX, SearchCheck } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'
import TestStatusBadge from './TestStatusBadge'

const statusPanelMap = {
  Bekliyor: { icon: Clock3, title: 'Sonuç Bekleniyor', text: 'Bu tetkikin sonucu henüz hazır değil.', className: 'border-yellow-100 bg-yellow-50 text-yellow-800' },
  İnceleniyor: { icon: SearchCheck, title: 'Doktor İncelemesinde', text: 'Ham sonuçlar sisteme geldi; doktor değerlendirmesi devam ediyor.', className: 'border-orange-100 bg-orange-50 text-orange-700' },
  Hazır: { icon: CheckCircle2, title: 'Sonuç Hazır', text: 'Sonuçlar tamamlandı ve klinik değerlendirme görüntülenebilir.', className: 'border-green-100 bg-green-50 text-green-700' },
  'İptal Edildi': { icon: FileX, title: 'Tetkik İptal Edildi', text: 'Bu tetkik iptal edildiği için sonuç alanları boş durumdadır.', className: 'border-red-100 bg-red-50 text-red-700' },
}

export default function TestStatusPanel({ test }) {
  const panel = statusPanelMap[test.status] || { icon: AlertCircle, title: test.status, text: test.summary, className: 'border-gray-100 bg-gray-50 text-gray-600' }
  const Icon = panel.icon
  const detail = test.status === 'Bekliyor' ? `Numune: ${test.sampleDateTime} / Tahmini sonuç: ${test.estimatedResultTime || test.resultDateTime}` : test.status === 'Hazır' ? `Sonuç tarihi: ${test.resultDateTime}` : `Son güncel durum: ${test.status}`

  return (
    <section className={`${paddedCardClass} mb-5 border ${panel.className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Icon className="mt-0.5 shrink-0" size={20} />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold">{panel.title}</h2>
              <TestStatusBadge status={test.status} />
            </div>
            <p className="text-xs leading-5">{panel.text}</p>
            <p className="mt-1 text-[11px] font-semibold">{detail}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
