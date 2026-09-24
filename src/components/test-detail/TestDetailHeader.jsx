import { ArrowLeft, Download, Printer, UserRound, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import RowActionsMenu from '../RowActionsMenu'
import { outlineButtonClass } from '../../styles/uiClasses'
import TestStatusBadge from './TestStatusBadge'

export default function TestDetailHeader({ test, onCancelTest }) {
  const canCancel = test.status === 'Bekliyor' || test.status === 'İnceleniyor' || test.status === 'Hazır'

  return (
    <div className="mb-5 flex items-start justify-between gap-4 max-[760px]:flex-col">
      <div className="flex min-w-0 items-start gap-3">
        <Link aria-label="Tetkikler sayfasına dön" className={`${outlineButtonClass} h-9 shrink-0 px-3 max-[430px]:w-9 max-[430px]:p-0`} to="/tetkikler">
          <ArrowLeft size={17} />
          <span className="max-[430px]:sr-only">Tetkiklere Dön</span>
        </Link>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[.3px] text-orange-600">Tetkik Sonucu</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-bold text-gray-900 max-[640px]:text-xl">{test.type}</h1>
            <TestStatusBadge status={test.status} />
          </div>
          <p className="mt-1 text-xs text-gray-500">Tetkik No: {test.number}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 max-[760px]:w-full max-[760px]:justify-start">
        <button className={outlineButtonClass} type="button" onClick={() => window.print()}><Printer size={17} />Yazdır</button>
        <button className={`${outlineButtonClass} opacity-60`} disabled title="PDF indirme henüz uygulanmadı." type="button"><Download size={17} />PDF yok</button>
        <Link className={outlineButtonClass} state={{ from: '/tetkikler', fromLabel: 'Tetkikler' }} to={`/hastalar/${test.patientNo}?dosya=${test.visitId}`}><UserRound size={17} />Hasta Detayına Git</Link>
        {canCancel && (
          <RowActionsMenu
            label="Diğer tetkik işlemleri"
            items={[{ label: test.status === 'Hazır' ? 'Geçersiz İşaretle' : 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: onCancelTest }]}
          />
        )}
      </div>
    </div>
  )
}
