import { Banknote, Clock3, ReceiptText, Tag } from 'lucide-react'
import { cardClass } from '../../styles/uiClasses'
import { boolText, formatCurrency } from './priceUtils'

export default function PriceSummaryCard({ price }) {
  const stats = [
    { label: 'Güncel Ücret', value: formatCurrency(price.price), meta: 'Tarife', icon: Banknote },
    { label: 'KDV Oranı', value: `%${price.vatRate}`, meta: boolText(price.vatIncluded, 'Dahil', 'Hariç'), icon: ReceiptText },
    { label: 'Minimum Ücret', value: formatCurrency(price.minimumPrice), meta: boolText(price.discountAllowed, 'İndirim var', 'İndirim yok'), icon: Tag },
    { label: 'Ortalama Süre', value: `${price.duration} dk`, meta: price.usageArea, icon: Clock3 },
  ]

  return (
    <section className="mb-5 grid grid-cols-4 gap-[18px] max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3" aria-label="Fiyat hızlı bilgileri">
      {stats.map(({ label, value, meta, icon: Icon }) => (
        <article className={`${cardClass} p-4`} key={label}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-orange-50 text-orange-600"><Icon size={19} /></div>
            <span className="max-w-[120px] truncate rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">{meta}</span>
          </div>
          <p className="text-[11px] font-semibold uppercase text-gray-400">{label}</p>
          <strong className="mt-1 block text-lg font-bold text-gray-900">{value}</strong>
        </article>
      ))}
    </section>
  )
}
