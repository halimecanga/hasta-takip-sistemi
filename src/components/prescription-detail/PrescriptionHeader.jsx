import { ArrowLeft, Download, Pencil, Printer, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import RowActionsMenu from '../RowActionsMenu'
import StatusBadge from '../StatusBadge'
import { outlineButtonClass, primaryButtonClass } from '../../styles/uiClasses'

export default function PrescriptionHeader({ prescription, editMode, onEdit, onCancelPrescription }) {
  const canCancel = prescription.status === 'Aktif' || prescription.status === 'Tamamlandı'

  return (
    <div className="mb-5 flex items-start justify-between gap-4 max-[760px]:flex-col">
      <div className="flex min-w-0 items-start gap-3">
        <Link aria-label="Reçetelere dön" className={`${outlineButtonClass} h-9 w-9 shrink-0 p-0`} to="/receteler">
          <ArrowLeft size={17} />
        </Link>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[.3px] text-orange-600">Reçete Detayı</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 max-[640px]:text-xl">Reçete No: {prescription.number}</h1>
            <StatusBadge status={prescription.status} />
          </div>
          <p className="mt-1 text-xs text-gray-500">{prescription.patientName} - {prescription.patientNo}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 max-[760px]:w-full max-[760px]:justify-start">
        <button className={outlineButtonClass} type="button" onClick={() => window.print()}><Printer size={17} />Yazdır</button>
        <button className={`${outlineButtonClass} opacity-60`} disabled title="PDF indirme henüz uygulanmadı." type="button"><Download size={17} />PDF yok</button>
        <button className={primaryButtonClass} disabled={editMode} type="button" onClick={onEdit}><Pencil size={17} />Reçeteyi Düzenle</button>
        {canCancel && (
          <RowActionsMenu
            label="Diğer reçete işlemleri"
            items={[{ label: prescription.status === 'Tamamlandı' ? 'Geçersiz İşaretle' : 'İptal Et', icon: <XCircle size={15} />, tone: 'warning', onSelect: onCancelPrescription }]}
          />
        )}
      </div>
    </div>
  )
}
