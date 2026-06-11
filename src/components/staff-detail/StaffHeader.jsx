import { ArrowLeft, CalendarPlus, MoreHorizontal, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { outlineButtonClass, primaryButtonClass, textButtonClass } from '../../styles/uiClasses'

export default function StaffHeader({ staff, editMode, onEdit }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4 max-[760px]:flex-col">
      <div className="flex min-w-0 items-start gap-3">
        <Link aria-label="Personellere dön" className={`${outlineButtonClass} h-9 w-9 shrink-0 p-0`} to="/personeller">
          <ArrowLeft size={17} />
        </Link>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[.3px] text-orange-600">Personel Detayı</span>
          <h1 className="mt-1 truncate text-2xl font-bold text-gray-900 max-[640px]:text-xl">{staff.name}</h1>
          <p className="mt-1 text-xs text-gray-500">Personel No: {staff.id}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 max-[760px]:w-full max-[760px]:justify-start">
        <button className={primaryButtonClass} type="button" onClick={onEdit} disabled={editMode}>
          <Pencil size={17} />
          Bilgileri Düzenle
        </button>
        <button aria-label={`${staff.name} için izin ekle`} className={outlineButtonClass} type="button">
          <CalendarPlus size={17} />
          İzin Ekle
        </button>
        <button aria-label="Diğer personel işlemleri" className={`${textButtonClass} h-9 w-9 p-0`} type="button">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  )
}
