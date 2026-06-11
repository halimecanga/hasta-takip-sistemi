import { ArrowLeft, FileX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { outlineButtonClass, paddedCardClass } from '../../styles/uiClasses'

export default function EmptyState() {
  return (
    <section className={`${paddedCardClass} flex min-h-[320px] flex-col items-center justify-center text-center`}>
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-600">
        <FileX size={28} />
      </div>
      <h1 className="text-xl font-bold text-gray-900">Reçete bulunamadı</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">Aradığınız reçete kaydı mevcut mock veriler içinde bulunamadı.</p>
      <Link className={`${outlineButtonClass} mt-5`} to="/receteler">
        <ArrowLeft size={17} />
        Reçetelere Dön
      </Link>
    </section>
  )
}
