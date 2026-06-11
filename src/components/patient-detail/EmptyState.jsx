import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { outlineButtonClass, paddedCardClass } from '../../styles/uiClasses'

export default function EmptyState({ title = 'Hasta bulunamadı', text = 'Aradığınız hasta kaydı sistemde bulunamadı.' }) {
  return (
    <section className={`${paddedCardClass} flex min-h-[280px] flex-col items-center justify-center text-center`}>
      <h1 className="mb-2 text-xl font-bold text-gray-900">{title}</h1>
      <p className="mb-5 text-sm text-gray-500">{text}</p>
      <Link className={outlineButtonClass} to="/hastalar"><ArrowLeft size={17} />Hastalara Dön</Link>
    </section>
  )
}
