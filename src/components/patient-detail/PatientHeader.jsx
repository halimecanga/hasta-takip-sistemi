import { ArrowLeft, FilePlus, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { outlineButtonClass, primaryButtonClass } from '../../styles/uiClasses'

const returnTextMap = {
  Hastalar: 'Hastalara Dön',
  Muayeneler: 'Muayenelere Dön',
  Randevular: 'Randevulara Dön',
}

export default function PatientHeader({ patient, returnLabel = 'Hastalar', returnPath = '/hastalar', onStartNewVisit }) {
  const returnText = returnTextMap[returnLabel] || `${returnLabel} Sayfasına Dön`

  return (
    <div className="mb-5 flex items-start justify-between gap-4 max-[760px]:flex-col">
      <div className="flex items-start gap-3">
        <Link aria-label={`${returnLabel} sayfasına dön`} className={`${outlineButtonClass} h-9 shrink-0 px-3 max-[430px]:w-9 max-[430px]:p-0`} to={returnPath}><ArrowLeft size={17} /><span className="max-[430px]:sr-only">{returnText}</span></Link>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[.3px] text-orange-600">Hasta Detayı</span>
          <h1 className="mt-1 text-2xl font-bold tracking-[-.5px] text-gray-900 max-[640px]:text-xl">{patient.name}</h1>
          <p className="mt-1 text-xs text-gray-500">Hasta No: {patient.id}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 max-[760px]:w-full max-[760px]:justify-start">
        <button className={primaryButtonClass} type="button" onClick={onStartNewVisit}><FilePlus size={17} />Yeni Muayene Başlat</button>
        <button className={`${outlineButtonClass} opacity-60`} disabled title="Hasta düzenleme henüz uygulanmadı." type="button"><Pencil size={17} />Hasta Bilgilerini Düzenle</button>
      </div>
    </div>
  )
}
