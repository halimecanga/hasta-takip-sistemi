import { ClipboardList, ReceiptText, Settings2 } from 'lucide-react'
import { paddedCardClass } from '../../styles/uiClasses'
import { boolText, formatCurrency, statusClasses } from './priceUtils'

const Field = ({ label, value }) => (
  <div className="rounded-[10px] bg-gray-50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">{label}</dt>
    <dd className="mt-1 text-xs leading-5 text-gray-700">{value || '-'}</dd>
  </div>
)

const Section = ({ icon: Icon, title, children }) => (
  <section className={paddedCardClass}>
    <div className="mb-4 flex items-center gap-2">
      <Icon className="text-orange-500" size={18} />
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
    </div>
    <dl className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">{children}</dl>
  </section>
)

export default function PriceInfoCards({ price }) {
  return (
    <div className="grid grid-cols-3 gap-5 max-[1180px]:grid-cols-2 max-[760px]:grid-cols-1">
      <Section icon={ClipboardList} title="Temel Bilgiler">
        <Field label="İşlem adı" value={price.name} />
        <Field label="İşlem kodu" value={price.id} />
        <Field label="Kategori" value={price.category} />
        <Field label="Durum" value={<span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-[5px] text-[9px] font-bold ${statusClasses[price.status] || 'bg-gray-100 text-gray-600'}`}>{price.status}</span>} />
        <div className="col-span-full rounded-[10px] bg-gray-50 p-3 max-[640px]:col-auto"><dt className="text-[10px] font-bold uppercase tracking-[.25px] text-gray-400">Açıklama</dt><dd className="mt-1 text-xs leading-5 text-gray-700">{price.description}</dd></div>
      </Section>
      <Section icon={ReceiptText} title="Ücret Bilgileri">
        <Field label="Güncel ücret" value={formatCurrency(price.price)} />
        <Field label="KDV oranı" value={`%${price.vatRate}`} />
        <Field label="KDV dahil mi?" value={boolText(price.vatIncluded, 'Dahil', 'Hariç')} />
        <Field label="İndirim" value={boolText(price.discountAllowed, 'Uygulanabilir', 'Uygulanamaz')} />
        <Field label="Minimum ücret" value={formatCurrency(price.minimumPrice)} />
        <Field label="Son güncelleme" value={price.updatedAt} />
      </Section>
      <Section icon={Settings2} title="Hizmet Bilgileri">
        <Field label="Oluşturulma tarihi" value={price.createdAt} />
        <Field label="Ortalama süre" value={`${price.duration} dk`} />
        <Field label="Kullanım alanı" value={price.usageArea} />
        <Field label="Hasta görünürlüğü" value={boolText(price.patientVisible, 'Evet', 'Hayır')} />
        <Field label="Faturaya dahil" value={boolText(price.includedInInvoice, 'Evet', 'Hayır')} />
        <div className="col-span-full rounded-[10px] bg-orange-50 p-3 max-[640px]:col-auto"><dt className="text-[10px] font-bold uppercase tracking-[.25px] text-orange-600">İç not</dt><dd className="mt-1 text-xs leading-5 text-orange-700">{price.internalNote}</dd></div>
      </Section>
    </div>
  )
}
