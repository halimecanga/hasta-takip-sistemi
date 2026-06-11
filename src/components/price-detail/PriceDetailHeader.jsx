import { ArrowLeft, MoreHorizontal, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { outlineButtonClass, primaryButtonClass, textButtonClass } from '../../styles/uiClasses'
import { statusClasses } from './priceUtils'

export default function PriceDetailHeader({ price, editMode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4 max-[760px]:flex-col">
      <div className="flex min-w-0 items-start gap-3">
        <Link aria-label="Fiyat listesi sayfasına dön" className={`${outlineButtonClass} h-9 shrink-0 px-3 max-[430px]:w-9 max-[430px]:p-0`} to="/fiyat-listesi">
          <ArrowLeft size={17} />
          <span className="max-[430px]:sr-only">Fiyat Listesine Dön</span>
        </Link>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[.3px] text-orange-600">İşlem Detayı</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-bold text-gray-900 max-[640px]:text-xl">{price.name}</h1>
            <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-[5px] text-[9px] font-bold ${statusClasses[price.status] || 'bg-gray-100 text-gray-600'}`}>{price.status}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">İşlem Kodu: {price.id}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 max-[760px]:w-full max-[760px]:justify-start">
        <Link className={primaryButtonClass} to={`/fiyat-listesi/${price.id}?duzenle=true`} aria-disabled={editMode}><Pencil size={17} />Düzenle</Link>
        <button aria-label="Diğer fiyat işlemleri" className={`${textButtonClass} h-9 w-9 p-0`} type="button"><MoreHorizontal size={18} /></button>
      </div>
    </div>
  )
}
